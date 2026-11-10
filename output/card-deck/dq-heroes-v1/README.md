# 勇者鬥惡龍・完整角色塔羅牌組

**78 / 78 張已製作完成並套用。** 正式映射使用 `images/cards/dq-heroes-v1/card-00.webp` 至 `card-77.webp`；牌名、正逆位牌義與其他原有資料保留。

全部 WebP 採 640×960 上限、Q84、method 6，等比例縮小。實際 runtime 圖檔總量 **20,191,754 bytes（19.26 MiB）**。

## 瀏覽與出處

[完整牌面、搜尋與新舊對照](preview.html)

- `manifest.json`：78 張 ID 對照、圖檔與來源 SHA256、角色／系列、編碼設定及套用紀錄。
- `prompts/`：完整生成 prompt、來源參考、產圖工具與逐張視覺檢查；失敗或淘汰嘗試保留各自狀態。
- `references/*.json`：角色參考來源索引；第三方典藏來源另記明來源類型。
- `visual-review.json`：父代理的品質檢查紀錄。
- `character-plan.json`：創作配對規劃，實際採用內容以最終 prompt 與 manifest 為準。
- `encoding-study/report.json`：編碼比較的實測大小。

新牌面是 AI 生成的角色塔羅插畫，來源連結供角色外觀辨識。原始 PNG、參考圖、舊 manga 測試版及編碼實驗二進位留在本機；Git 發布範圍見 `deployment-allowlist.json`。

## 驗證

新 checkout 可驗證已發布的 WebP／prompt 與完整映射：

```sh
python3 scripts/card_deck.py --deck dq-heroes-v1 check --release --require-complete
```

保有原始 PNG 的製作環境可執行嚴格來源 hash 檢查：

```sh
python3 scripts/card_deck.py --deck dq-heroes-v1 check --require-complete
```

## 保留原始資料

`tarot-data.before-apply.js` 保存套用前完整資料；原有牌面檔案仍保留。`manifest.application` 記錄原映射備份與套用後資料 hash，`encodingHistory` 記錄明確的編碼遷移。後續新版本可用工具的 `init`、`import`／`sync`、`check`、`preview` 與 `apply` 維護。
