// 塔羅占卜 App - 主程式
class TarotApp {
    constructor() {
        this.mode = null; // 'single' | 'three' | 'five'
        this.question = '';
        this.drawnCards = [];
        this.currentDrawIndex = 0;
        this.modeLabels = {
            single: ['占卜結果'],
            three: ['過去', '現在', '未來'],
            five: ['問題現況', '外在影響', '內在影響', '解決建議', '全能洞見']
        };
        this.modeNames = {
            single: '單張抽牌',
            three: '三張牌陣（過去・現在・未來）',
            five: '五張牌陣（深度解析）'
        };

        this.initElements();
        this.initEventListeners();
        this.createStars();
        this.registerServiceWorker();
        this.checkDebugMode();
    }

    initElements() {
        this.homeScreen = document.getElementById('homeScreen');
        this.drawScreen = document.getElementById('drawScreen');
        this.resultScreen = document.getElementById('resultScreen');

        this.questionInput = document.getElementById('questionInput');
        this.singleModeBtn = document.getElementById('singleModeBtn');
        this.threeModeBtn = document.getElementById('threeModeBtn');
        this.fiveModeBtn = document.getElementById('fiveModeBtn');

        this.backBtn = document.getElementById('backBtn');
        this.drawTitle = document.getElementById('drawTitle');
        this.drawQuestionPreview = document.getElementById('drawQuestionPreview');
        this.cardsContainer = document.getElementById('cardsContainer');
        this.drawHint = document.getElementById('drawHint');

        this.resultBackBtn = document.getElementById('resultBackBtn');
        this.resultContent = document.getElementById('resultContent');
        this.resultQuestion = document.getElementById('resultQuestion');
        this.resultCards = document.getElementById('resultCards');
        this.resultMeanings = document.getElementById('resultMeanings');
        this.saveBtn = document.getElementById('saveBtn');
        this.copyTextBtn = document.getElementById('copyTextBtn');
        this.redrawBtn = document.getElementById('redrawBtn');
        this.toast = document.getElementById('toast');
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    initEventListeners() {
        this.singleModeBtn.addEventListener('click', () => this.startDraw('single'));
        this.threeModeBtn.addEventListener('click', () => this.startDraw('three'));
        this.fiveModeBtn.addEventListener('click', () => this.startDraw('five'));

        this.backBtn.addEventListener('click', () => this.goToHome());
        this.resultBackBtn.addEventListener('click', () => this.goToHome());

        this.saveBtn.addEventListener('click', () => this.saveImage());
        this.copyTextBtn.addEventListener('click', () => this.copyTextForAI());
        this.redrawBtn.addEventListener('click', () => this.startDraw(this.mode));

        window.addEventListener('popstate', () => this.handlePopState());
    }

    createStars() {
        const container = document.getElementById('starsContainer');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${2 + Math.random() * 3}s`);
            star.style.setProperty('--opacity', `${0.3 + Math.random() * 0.7}`);
            star.style.animationDelay = `${Math.random() * 3}s`;
            container.appendChild(star);
        }
    }

    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    }

    /** 開發用：?debug_card=0 預覽單張結果 */
    checkDebugMode() {
        const debugId = new URLSearchParams(window.location.search).get('debug_card');
        if (debugId === null || debugId === '') return;

        const id = parseInt(debugId, 10);
        if (Number.isNaN(id)) return;

        const card = TAROT_CARDS.find(c => c.id === id);
        if (!card) {
            console.error('Debug: card not found for id', debugId);
            return;
        }

        this.mode = 'single';
        this.question = '（Debug 預覽）';
        this.drawnCards = [{ card, isReversed: false }];
        this.showResult();
    }

    switchScreen(target) {
        [this.homeScreen, this.drawScreen, this.resultScreen].forEach(screen => {
            screen.classList.remove('active');
        });
        target.classList.add('active');
        window.scrollTo(0, 0);
        setTimeout(() => window.scrollTo(0, 0), 50);
    }

    clearResultHash() {
        if (window.location.hash === '#result') {
            const path = window.location.pathname + window.location.search;
            history.replaceState(null, '', path || './');
        }
    }

    goToHome() {
        this.switchScreen(this.homeScreen);
        this.drawnCards = [];
        this.currentDrawIndex = 0;
        this.clearResultHash();
        // 保留問題輸入框內容，方便改完再抽
        if (this.questionInput && this.question) {
            this.questionInput.value = this.question;
        }
    }

    handlePopState() {
        if (!window.location.hash) {
            this.goToHome();
        }
    }

    getCardCount(mode) {
        switch (mode) {
            case 'single': return 1;
            case 'three': return 3;
            case 'five': return 5;
            default: return 1;
        }
    }

    getDrawTitle(mode) {
        switch (mode) {
            case 'single': return '點擊卡牌抽牌';
            case 'three': return '依序點擊三張卡牌';
            case 'five': return '依序點擊五張卡牌';
            default: return '點擊卡牌抽牌';
        }
    }

    captureQuestion() {
        this.question = (this.questionInput?.value || '').trim();
    }

    updateQuestionPreviews() {
        const hasQ = Boolean(this.question);

        if (this.drawQuestionPreview) {
            if (hasQ) {
                this.drawQuestionPreview.hidden = false;
                this.drawQuestionPreview.innerHTML =
                    `<span class="question-label">你的問題</span>` +
                    `<span class="question-text">${this.escapeHtml(this.question)}</span>`;
            } else {
                this.drawQuestionPreview.hidden = true;
                this.drawQuestionPreview.innerHTML = '';
            }
        }

        if (this.resultQuestion) {
            if (hasQ) {
                this.resultQuestion.hidden = false;
                this.resultQuestion.innerHTML =
                    `<span class="question-label">你的問題</span>` +
                    `<span class="question-text">${this.escapeHtml(this.question)}</span>`;
            } else {
                this.resultQuestion.hidden = true;
                this.resultQuestion.innerHTML = '';
            }
        }
    }

    escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    startDraw(mode) {
        if (!mode) return;

        this.captureQuestion();
        this.mode = mode;
        this.drawnCards = [];
        this.currentDrawIndex = 0;

        const cardCount = this.getCardCount(mode);
        const labels = this.modeLabels[mode];

        this.drawTitle.textContent = this.getDrawTitle(mode);
        this.updateQuestionPreviews();

        this.cardsContainer.innerHTML = '';
        for (let i = 0; i < cardCount; i++) {
            const card = this.createCardElement(i, mode !== 'single' ? labels[i] : null);
            this.cardsContainer.appendChild(card);
        }

        this.drawHint.classList.remove('hidden');
        this.drawHint.querySelector('span:last-child').textContent = '點擊卡牌揭示命運';
        this.switchScreen(this.drawScreen);
        this.clearResultHash();
    }

    createCardElement(index, label) {
        const card = document.createElement('div');
        card.className = 'tarot-card';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back">
                    <div class="card-back-design"></div>
                </div>
                <div class="card-face card-front">
                    ${label ? `<div class="card-label">${label}</div>` : ''}
                    <div class="card-symbol"></div>
                    <div class="card-name"></div>
                    <div class="card-name-en"></div>
                    <div class="card-position"></div>
                </div>
            </div>
        `;
        card.addEventListener('click', () => this.handleCardClick(card, index));
        return card;
    }

    handleCardClick(cardElement, index) {
        const alreadyRevealed =
            cardElement.classList.contains('flipped') ||
            cardElement.classList.contains('reversed') ||
            cardElement.classList.contains('disabled');

        if (index !== this.currentDrawIndex || alreadyRevealed) return;

        const drawnCard = this.drawRandomCard();
        if (!drawnCard) return;

        this.drawnCards.push(drawnCard);

        const cardFront = cardElement.querySelector('.card-front');
        const symbolEl = cardFront.querySelector('.card-symbol');
        if (drawnCard.card.image) {
            symbolEl.innerHTML =
                `<img src="${drawnCard.card.image}" class="tarot-img" alt="${drawnCard.card.name}">`;
        } else {
            symbolEl.textContent = drawnCard.card.symbol || '?';
        }
        cardFront.querySelector('.card-name').textContent = drawnCard.card.name;
        cardFront.querySelector('.card-name-en').textContent = drawnCard.card.nameEn;

        const positionEl = cardFront.querySelector('.card-position');
        positionEl.textContent = drawnCard.isReversed ? '逆位' : '正位';
        positionEl.className = `card-position ${drawnCard.isReversed ? 'reversed' : 'upright'}`;

        // 正位：翻面；逆位：翻面 + 旋轉（CSS .reversed 已含 rotateY）
        cardElement.classList.add(drawnCard.isReversed ? 'reversed' : 'flipped');
        cardElement.classList.add('disabled');
        this.currentDrawIndex++;

        const totalCards = this.getCardCount(this.mode);
        if (this.currentDrawIndex < totalCards) {
            this.drawHint.querySelector('span:last-child').textContent =
                `還剩 ${totalCards - this.currentDrawIndex} 張牌`;
        } else {
            this.drawHint.classList.add('hidden');
            setTimeout(() => this.showResult(), 1000);
        }
    }

    drawRandomCard() {
        const drawnIds = this.drawnCards.map(d => d.card.id);
        const available = TAROT_CARDS.filter(c => !drawnIds.includes(c.id));
        if (available.length === 0) {
            console.error('No cards left in deck');
            return null;
        }
        const card = available[Math.floor(Math.random() * available.length)];
        const isReversed = Math.random() < 0.5;
        return { card, isReversed };
    }

    showResult() {
        const labels = this.modeLabels[this.mode];
        this.updateQuestionPreviews();

        this.resultCards.innerHTML = this.drawnCards.map((drawn, i) => {
            const visual = drawn.card.image
                ? `<img src="${drawn.card.image}" class="tarot-img result-img" alt="${drawn.card.name}">`
                : drawn.card.symbol;
            return `
            <div class="result-card ${drawn.isReversed ? 'reversed' : ''}">
                ${this.mode !== 'single' ? `<div class="card-label">${labels[i]}</div>` : ''}
                <div class="card-symbol ${drawn.isReversed ? 'is-reversed' : ''}">${visual}</div>
                <div class="card-name">${drawn.card.name}</div>
            </div>`;
        }).join('');

        this.resultMeanings.innerHTML = this.drawnCards.map((drawn, i) => {
            const meaning = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
            const visual = drawn.card.image
                ? `<img src="${drawn.card.image}" class="tarot-img meaning-img" alt="${drawn.card.name}">`
                : drawn.card.symbol;
            return `
                <div class="meaning-card">
                    <div class="meaning-header">
                        ${this.mode !== 'single' ? `<span class="meaning-label">${labels[i]}</span>` : ''}
                        <span class="meaning-symbol">${visual}</span>
                        <span class="meaning-name">${drawn.card.name}</span>
                        <span class="meaning-position ${drawn.isReversed ? 'reversed' : 'upright'}">
                            ${drawn.isReversed ? '逆位' : '正位'}
                        </span>
                    </div>
                    <div class="meaning-keywords">
                        ${meaning.keywords.map(kw => `<span class="keyword">${kw}</span>`).join('')}
                    </div>
                    <div class="meaning-description">${meaning.desc}</div>
                </div>
            `;
        }).join('');

        this.switchScreen(this.resultScreen);

        if (window.location.hash !== '#result') {
            history.pushState({ page: 'result' }, '', '#result');
        }
    }

    showLoading(show) {
        this.loadingOverlay.classList.toggle('active', show);
    }

    async saveImage() {
        if (typeof html2canvas !== 'function') {
            this.copyTextForAI();
            this.showToast('截圖套件未載入，已改複製文字');
            return;
        }

        this.showLoading(true);
        try {
            await document.fonts.ready;
            this.resultContent.classList.add('snapshot-mode');

            const imgs = Array.from(this.resultContent.querySelectorAll('img'));
            await Promise.all(imgs.map(img =>
                img.complete
                    ? Promise.resolve()
                    : new Promise(r => {
                        img.onload = r;
                        img.onerror = r;
                    })
            ));
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(this.resultContent, {
                backgroundColor: '#0a0a1a',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: this.resultContent.scrollWidth,
                windowHeight: this.resultContent.scrollHeight
            });

            this.resultContent.classList.remove('snapshot-mode');

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Failed to create blob');

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `塔羅牌結果_${new Date().toLocaleDateString('zh-TW').replace(/\//g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Save image failed:', error);
            this.resultContent.classList.remove('snapshot-mode');
            this.copyTextForAI();
            this.showToast('儲存失敗，已改複製文字');
        } finally {
            this.showLoading(false);
        }
    }

    buildResultText() {
        const labels = this.modeLabels[this.mode];
        let text = `🔮 塔羅牌占卜結果\n`;
        text += `牌陣：${this.modeNames[this.mode] || this.mode}\n`;

        if (this.question) {
            text += `問題：${this.question}\n`;
        }

        text += `─`.repeat(30) + `\n\n`;

        this.drawnCards.forEach((drawn, i) => {
            const meaning = drawn.isReversed ? drawn.card.reversed : drawn.card.upright;
            if (this.mode !== 'single') {
                text += `【${labels[i]}】\n`;
            }
            text += `${drawn.card.name} / ${drawn.card.nameEn}（${drawn.isReversed ? '逆位' : '正位'}）\n`;
            text += `關鍵字：${meaning.keywords.join('、')}\n`;
            text += `牌義：${meaning.desc}\n\n`;
        });

        if (this.question) {
            text += `請依以上塔羅牌義，針對我的問題「${this.question}」給出清楚的解讀與實用建議。`;
        } else {
            text += `請依以上塔羅牌義給出清楚的解讀與實用建議。`;
        }

        return text;
    }

    copyTextForAI() {
        const text = this.buildResultText();

        const shareOrPrompt = () => {
            if (navigator.share) {
                navigator.share({ text }).catch(e => {
                    if (e.name !== 'AbortError') prompt('請複製以下內容', text);
                });
            } else {
                prompt('請複製以下內容', text);
            }
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
                .then(() => this.showToast())
                .catch(shareOrPrompt);
        } else {
            shareOrPrompt();
        }
    }

    showToast(message) {
        if (message) this.toast.textContent = message;
        else this.toast.textContent = '已複製，可直接貼給 AI 解牌';
        this.toast.classList.add('show');
        setTimeout(() => this.toast.classList.remove('show'), 2500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.tarotApp = new TarotApp();
});
