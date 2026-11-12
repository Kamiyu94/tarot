const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

function setup({ nativeCopy = true, writeText } = {}) {
    let clipboard = '原本複製的別段內容';
    let copyListener;
    let field;
    let focusRestored = false;
    let timeoutCallback;
    let nativeCalls = 0;
    const document = {
        activeElement: { focus() { focusRestored = true; } },
        body: { appendChild(element) { field = element; } },
        createElement() {
            return {
                style: {}, setAttribute() {}, focus() {}, select() {}, setSelectionRange() {},
                remove() { field = null; }
            };
        },
        addEventListener(type, listener) { if (type === 'copy') copyListener = listener; },
        removeEventListener(type) { if (type === 'copy') copyListener = null; },
        execCommand(command) {
            assert.equal(command, 'copy');
            nativeCalls++;
            if (!nativeCopy) return false;
            assert.ok(field.value.length > 0);
            copyListener({
                clipboardData: { setData(type, value) { assert.equal(type, 'text/plain'); clipboard = value; } },
                preventDefault() {}
            });
            return true;
        }
    };
    const sandbox = {
        document, window: { getSelection: () => null },
        navigator: writeText ? { clipboard: { writeText } } : {},
        setTimeout(callback) { timeoutCallback = callback; return 1; }, clearTimeout() {}
    };
    vm.runInNewContext(readFileSync(join(__dirname, '../js/app.js'), 'utf8') + '\nglobalThis.App = TarotApp;', sandbox);
    const app = Object.create(sandbox.App.prototype);
    const card = {
        id: 0, name: '愚者', nameEn: 'The Fool',
        upright: { keywords: ['開始'], desc: '新旅程' },
        reversed: { keywords: ['猶豫'], desc: '留意方向' }
    };
    Object.assign(app, {
        copyInProgress: false, copyTextBtn: { disabled: false }, retryCopyBtn: { disabled: false },
        drawnCards: [{ card, isReversed: false }], isSimple: true, question: '接下來的方向？',
        mode: 'single', modeNames: { single: '單張抽牌' },
        copyFallbackDialog: {
            open: false, showModal() { this.open = true; }, close() { this.open = false; }
        },
        copyFallbackText: { value: '', focus() {}, select() {}, setSelectionRange() {} },
        notices: [], showToast(message) { this.notices.push(message || 'copied'); }
    });
    return {
        app, document,
        clipboard: () => clipboard,
        cleanup: () => ({ field, copyListener, focusRestored }),
        nativeCalls: () => nativeCalls,
        timeout: () => timeoutCallback()
    };
}

test('複製取代既有內容，保留中文與換行，並清理暫存選取欄位', async () => {
    const s = setup();
    const expected = s.app.buildResultText();
    assert.equal(await s.app.copyTextForAI(), true);
    assert.equal(s.clipboard(), expected);
    assert.deepEqual(s.app.notices, ['copied']);
    assert.deepEqual(s.cleanup(), { field: null, copyListener: null, focusRestored: true });
});

test('同步複製不可用時，使用 Clipboard API；連點不會產生並行寫入', async () => {
    let finish;
    const writes = [];
    const s = setup({ nativeCopy: false, writeText(text) {
        writes.push(text);
        return new Promise(resolve => { finish = resolve; });
    } });
    const pending = s.app.copyTextForAI();
    assert.equal(s.app.copyTextBtn.disabled, true);
    assert.equal(await s.app.copyTextForAI(), false);
    assert.equal(writes.length, 1);
    finish();
    assert.equal(await pending, true);
    assert.equal(s.app.copyTextBtn.disabled, false);
    assert.equal(s.app.retryCopyBtn.disabled, false);
});

test('寫入被拒絕時，完整文字可手動複製，不誤報成功或清空舊內容', async () => {
    const s = setup({ nativeCopy: false, writeText: () => Promise.reject(new Error('NotAllowedError')) });
    assert.equal(await s.app.copyTextForAI(), false);
    assert.equal(s.app.copyFallbackDialog.open, true);
    assert.equal(s.app.copyFallbackText.value, s.app.buildResultText());
    assert.equal(s.clipboard(), '原本複製的別段內容');
    assert.deepEqual(s.app.notices, []);
    assert.equal(s.app.copyInProgress, false);
});

test('沒有 Clipboard API 仍顯示完整文字；重新點擊可成功複製並關閉備援視窗', async () => {
    const s = setup({ nativeCopy: false });
    assert.equal(await s.app.copyTextForAI(), false);
    assert.equal(s.app.copyFallbackDialog.open, true);
    s.document.execCommand = () => true;
    assert.equal(await s.app.copyTextForAI(), true);
    assert.equal(s.app.copyFallbackDialog.open, false);
    assert.deepEqual(s.app.notices, ['copied']);
});

test('系統寫入未回應時，解除按鈕鎖定並提供完整手動文字', async () => {
    const s = setup({ nativeCopy: false, writeText: () => new Promise(() => {}) });
    const pending = s.app.copyTextForAI();
    s.timeout();
    assert.equal(await pending, false);
    assert.equal(s.app.copyTextBtn.disabled, false);
    assert.equal(s.app.copyFallbackText.value, s.app.buildResultText());
});

test('未抽牌不寫入剪貼簿；簡易版與牌義版皆複製完整結果', async () => {
    const s = setup();
    s.app.isSimple = false;
    assert.equal(await s.app.copyTextForAI(), true);
    assert.match(s.clipboard(), /牌義：新旅程/);
    s.app.isSimple = true;
    assert.equal(await s.app.copyTextForAI(), true);
    assert.doesNotMatch(s.clipboard(), /牌義：/);
    const before = s.nativeCalls();
    s.app.drawnCards = [];
    assert.equal(await s.app.copyTextForAI(), false);
    assert.equal(s.nativeCalls(), before);
});
