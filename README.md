# 🔮 塔羅牌占卜 PWA

一個精美的塔羅牌占卜 Progressive Web App，支援離線使用並可安裝到手機主畫面。

## ✨ 功能特色

- 🎴 **完整 78 張塔羅牌** - 22 張大阿爾克那 + 56 張小阿爾克那
- ⬆️⬇️ **正逆位解讀** - 每張牌包含正位與逆位的詳細解釋
- 🎯 **三種抽牌模式** - 單張 / 三張牌陣（過去・現在・未來）/ 五張牌陣
- 💬 **問題輸入** - 抽牌前可填想問的問題，結果可連同牌義一鍵複製給 AI 解讀
- 🌙 **精美介面** - 神秘深色星空主題 + 流暢翻牌動畫
- 📥 **儲存與分享** - 可截圖儲存或複製文字
- 📱 **PWA 支援** - 可安裝到 Android/iOS 主畫面
- 🌏 **繁體中文** - 全繁體中文介面與牌義解說

## 🚀 線上體驗

👉 [https://kamiyu94.github.io/tarot/](https://kamiyu94.github.io/tarot/)

## 📱 安裝到手機

### Android
1. 用 Chrome 開啟網頁
2. 點擊瀏覽器選單 (⋮)
3. 選擇「新增至主畫面」或「安裝應用程式」

### iOS
1. 用 Safari 開啟網頁
2. 點擊分享按鈕
3. 選擇「加入主畫面」

## 🛠️ 本機開發

```bash
git clone https://github.com/Kamiyu94/tarot.git
cd tarot
python -m http.server 8080
# http://localhost:8080
```

## 📁 專案結構

```
tarot/
├── index.html          # 主頁面
├── admin.html          # 牌義／圖檔管理後台
├── manifest.json       # PWA 設定
├── sw.js               # Service Worker
├── css/
│   ├── style.css       # 主站樣式
│   └── admin.css
├── js/
│   ├── app.js          # 應用程式邏輯
│   ├── tarot-data.js   # 78 張塔羅牌資料
│   └── admin.js
├── images/cards/       # 牌面圖
└── icons/
```

## 📄 授權

MIT License
