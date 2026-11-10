// 塔羅牌資料庫 - 78張完整塔羅牌（含圖示）
const TAROT_CARDS = [
  {
    "id": 0,
    "name": "愚者",
    "nameEn": "The Fool",
    "symbol": "🐣",
    "upright": {"keywords": ["新開始", "天真", "冒險", "自由", "潛力"], "desc": "站在旅途的起點，帶著純粹的熱情踏入未知。代表新的開始、無限可能與自發性。相信自己的直覺，勇敢邁出第一步。"},
    "reversed": {"keywords": ["魯莽", "冒失", "缺乏計畫", "輕率"], "desc": "行動前缺乏思考，可能因魯莽而導致失誤。需要在自由與謹慎之間找到平衡，重新評估風險。"}
  ,
    "image": "images/cards/0.webp"},
  {
    "id": 1,
    "name": "魔術師",
    "nameEn": "The Magician",
    "symbol": "🧙‍♂️",
    "upright": {"keywords": ["意志力", "技能", "主動", "創造力", "資源"], "desc": "擁有實現目標所需的一切工具與能力。代表意志力、技巧與行動力。現在是將想法化為現實的最佳時機。"},
    "reversed": {"keywords": ["操弄", "技能未發揮", "詐騙", "猶豫不決"], "desc": "才能未能充分發揮，或以欺騙手段達到目的。需重新審視動機，確保行動出於誠信。"}
  ,
    "image": "images/cards/1.webp"},
  {
    "id": 2,
    "name": "女祭司",
    "nameEn": "The High Priestess",
    "symbol": "🔮",
    "upright": {"keywords": ["直覺", "潛意識", "神秘", "智慧", "內省"], "desc": "代表深層的直覺與內在智慧。提示傾聽內心的聲音，答案藏於潛意識之中。保持安靜，讓洞察力自然浮現。"},
    "reversed": {"keywords": ["壓抑直覺", "隱藏秘密", "表面知識", "脫離內心"], "desc": "忽略內在聲音或壓抑直覺。可能過度依賴理性分析，需重新連結自己的內在感知。"}
  ,
    "image": "images/cards/2.webp"},
  {
    "id": 3,
    "name": "皇后",
    "nameEn": "The Empress",
    "symbol": "🌺",
    "upright": {"keywords": ["豐盛", "母性", "自然", "創造力", "滋養"], "desc": "代表豐饒、創造與滋養的力量。象徵母性與自然的豐盛。鼓勵享受生活中的美好，給予與接受愛與關懷。"},
    "reversed": {"keywords": ["創意受阻", "依賴", "過度保護", "空虛"], "desc": "豐盛受阻或過度依賴他人。可能需要重建自我價值感，學習獨立滋養自己。"}
  ,
    "image": "images/cards/3.webp"},
  {
    "id": 4,
    "name": "皇帝",
    "nameEn": "The Emperor",
    "symbol": "🏛️",
    "upright": {"keywords": ["權威", "結構", "穩定", "領導力", "父性"], "desc": "代表秩序、權威與穩固的基礎。象徵理性的領導與紀律。透過建立清晰的規則與結構來達成目標。"},
    "reversed": {"keywords": ["專制", "缺乏紀律", "剛愎自用", "失控"], "desc": "權力被濫用或紀律崩潰。可能過於控制或完全失去方向，需在彈性與規範之間取得平衡。"}
  ,
    "image": "images/cards/4.webp"},
  {
    "id": 5,
    "name": "教皇",
    "nameEn": "The Hierophant",
    "symbol": "📜",
    "upright": {"keywords": ["傳統", "信仰", "制度", "精神指引", "從眾"], "desc": "代表傳統價值、精神指引與社會制度。尋求導師或遵循既有規範可帶來穩定。象徵對集體智慧的信任。"},
    "reversed": {"keywords": ["叛逆", "非傳統", "個人信仰", "突破規範"], "desc": "質疑傳統規範或尋求個人化的精神道路。代表對既定體制的反叛，鼓勵找到屬於自己的信仰方式。"}
  ,
    "image": "images/cards/5.webp"},
  {
    "id": 6,
    "name": "戀人",
    "nameEn": "The Lovers",
    "symbol": "❤️‍🔥",
    "upright": {"keywords": ["愛", "選擇", "結合", "價值觀", "和諧"], "desc": "代表愛情、重要選擇與價值觀的結合。不僅指浪漫關係，也象徵在兩條道路之間做出符合內心的抉擇。"},
    "reversed": {"keywords": ["失衡", "價值觀衝突", "錯誤選擇", "逃避決定"], "desc": "關係或選擇中出現失衡與衝突。可能在逃避重要決定，需誠實面對自己真正的價值觀。"}
  ,
    "image": "images/cards/6.webp"},
  {
    "id": 7,
    "name": "戰車",
    "nameEn": "The Chariot",
    "symbol": "🚀",
    "upright": {"keywords": ["意志力", "控制", "勝利", "決心", "自律"], "desc": "以強大的意志力克服障礙，邁向勝利。代表專注、自律與掌控方向的能力。只要堅定目標，必能突破困境。"},
    "reversed": {"keywords": ["失控", "方向不明", "侵略性", "缺乏意志力"], "desc": "失去對局勢或情緒的控制，方向感模糊。需重新凝聚意志力，避免衝動行事。"}
  ,
    "image": "images/cards/7.webp"},
  {
    "id": 8,
    "name": "力量",
    "nameEn": "Strength",
    "symbol": "🦁",
    "upright": {"keywords": ["內在力量", "勇氣", "耐心", "慈悲", "自我控制"], "desc": "以溫柔與慈悲展現真正的力量，而非武力。代表內在的勇氣、耐心與自我掌控。以愛與理解化解困難。"},
    "reversed": {"keywords": ["自我懷疑", "軟弱", "壓抑情緒", "缺乏自信"], "desc": "內在力量受到壓抑，可能因自我懷疑而退縮。需重新找回對自己的信心與內在的堅韌。"}
  ,
    "image": "images/cards/8.webp"},
  {
    "id": 9,
    "name": "隱士",
    "nameEn": "The Hermit",
    "symbol": "🕯️",
    "upright": {"keywords": ["內省", "孤獨", "尋求真理", "智慧", "指引"], "desc": "從喧囂中退隱，獨自尋求內在的智慧與真理。代表需要靜思、自我反省的時期。智慧來自於獨處與沉澱。"},
    "reversed": {"keywords": ["孤立", "退縮", "拒絕接受幫助", "迷失"], "desc": "過度孤立或拒絕外界的幫助與連結。需在獨處與社交之間找到平衡，避免陷入孤立無援的狀態。"}
  ,
    "image": "images/cards/9.webp"},
  {
    "id": 10,
    "name": "命運之輪",
    "nameEn": "Wheel of Fortune",
    "symbol": "🌀",
    "upright": {"keywords": ["命運", "轉機", "循環", "好運", "改變"], "desc": "命運之輪轉動，帶來改變與新的機遇。代表生命的循環與因果。把握此刻的順境，同時接受變化是生命的常態。"},
    "reversed": {"keywords": ["厄運", "抗拒改變", "不幸循環", "失控"], "desc": "陷入不幸的循環或抗拒命運的變化。需接受無法掌控的事物，從中學習並找到新的平衡點。"}
  ,
    "image": "images/cards/10.webp"},
  {
    "id": 11,
    "name": "正義",
    "nameEn": "Justice",
    "symbol": "⚖️",
    "upright": {"keywords": ["公正", "真相", "因果", "法律", "平衡"], "desc": "代表公平、真理與業力的法則。事情將得到公正的評判，行動的後果會如實呈現。誠實面對真相。"},
    "reversed": {"keywords": ["不公正", "不誠實", "逃避責任", "偏見"], "desc": "面臨不公正的對待，或自身逃避應負的責任。需誠實檢視自己的行為，承擔相應的後果。"}
  ,
    "image": "images/cards/11.webp"},
  {
    "id": 12,
    "name": "倒吊人",
    "nameEn": "The Hanged Man",
    "symbol": "🙃",
    "upright": {"keywords": ["暫停", "臣服", "新視角", "犧牲", "等待"], "desc": "自願暫停行動，以不同的視角重新看待事物。代表透過犧牲與等待獲得深層洞見。放手反而能帶來解脫。"},
    "reversed": {"keywords": ["拖延", "無謂犧牲", "抗拒改變", "固執"], "desc": "無謂的拖延或不必要的犧牲。可能過於固執，拒絕從不同角度看問題，需評估當前的停滯是否有意義。"}
  ,
    "image": "images/cards/12.webp"},
  {
    "id": 13,
    "name": "死神",
    "nameEn": "Death",
    "symbol": "🦋",
    "upright": {"keywords": ["終結", "蛻變", "過渡", "放下", "新生"], "desc": "舊事物的結束，為新的開始騰出空間。代表深刻的蛻變與轉化。放下不再適合的一切，迎接新生。"},
    "reversed": {"keywords": ["抗拒改變", "停滯", "無法放手", "腐朽"], "desc": "抗拒必要的改變，緊抓已死去的事物。需鼓起勇氣放手，允許舊章節真正結束。"}
  ,
    "image": "images/cards/13.webp"},
  {
    "id": 14,
    "name": "節制",
    "nameEn": "Temperance",
    "symbol": "🏺",
    "upright": {"keywords": ["平衡", "節制", "耐心", "融合", "中庸"], "desc": "以耐心與平衡調和生命中的不同元素。代表中庸之道、和諧與長期視野。不急不躁，穩健前行。"},
    "reversed": {"keywords": ["失衡", "過度放縱", "衝突", "缺乏節制"], "desc": "生活中出現失衡或過度放縱。需重新調整步調，在極端之間找回中間道路。"}
  ,
    "image": "images/cards/14.webp"},
  {
    "id": 15,
    "name": "惡魔",
    "nameEn": "The Devil",
    "symbol": "⛓️",
    "upright": {"keywords": ["束縛", "物質主義", "上癮", "陰影面", "執念"], "desc": "代表自我設限、物質執著與難以擺脫的束縛。提醒審視那些讓自己受困的習慣或關係，鎖鏈往往是自己套上的。"},
    "reversed": {"keywords": ["掙脫束縛", "覺醒", "釋放", "重獲自由"], "desc": "開始意識到束縛的存在，並鼓起勇氣掙脫。代表從上癮、執念或負面關係中解放，重獲自由。"}
  ,
    "image": "images/cards/15.webp"},
  {
    "id": 16,
    "name": "高塔",
    "nameEn": "The Tower",
    "symbol": "⚡",
    "upright": {"keywords": ["突變", "動盪", "崩塌", "啟示", "覺醒"], "desc": "突如其來的動盪打破舊有的結構。雖然過程痛苦，但崩塌是為了清除虛假的基礎，為更穩固的未來鋪路。"},
    "reversed": {"keywords": ["逃避崩潰", "拖延危機", "內在動盪", "抗拒改變"], "desc": "試圖避免不可避免的改變，或危機正在內部悄悄發酵。延遲面對只會讓問題加劇，需勇敢直視。"}
  ,
    "image": "images/cards/16.webp"},
  {
    "id": 17,
    "name": "星星",
    "nameEn": "The Star",
    "symbol": "⭐",
    "upright": {"keywords": ["希望", "信念", "療癒", "靈感", "平靜"], "desc": "黑暗過後的希望之光。代表療癒、靈感與對未來的信念。敞開心扉接受宇宙的滋養，相信一切終將好轉。"},
    "reversed": {"keywords": ["絕望", "失去信念", "幻滅", "缺乏靈感"], "desc": "感到希望渺茫或失去對未來的信心。需尋回內心的平靜，重新點燃對生命的信念。"}
  ,
    "image": "images/cards/17.webp"},
  {
    "id": 18,
    "name": "月亮",
    "nameEn": "The Moon",
    "symbol": "🌕",
    "upright": {"keywords": ["幻覺", "恐懼", "潛意識", "直覺", "迷惑"], "desc": "迷霧中的旅程，真相尚未明朗。代表潛意識的浮現、恐懼與不確定感。相信直覺，謹慎辨別真實與幻象。"},
    "reversed": {"keywords": ["恐懼消散", "真相浮現", "混亂結束", "壓抑情緒"], "desc": "迷霧逐漸散去，真相開始清晰。過去壓抑的恐懼與困惑正走向解決，需持續面對內心的陰影。"}
  ,
    "image": "images/cards/18.webp"},
  {
    "id": 19,
    "name": "太陽",
    "nameEn": "The Sun",
    "symbol": "☀️",
    "upright": {"keywords": ["喜悅", "成功", "活力", "樂觀", "豐盛"], "desc": "代表光明、喜悅與成功。事情朝著正面方向發展，充滿活力與自信。享受這段充滿光彩的時光。"},
    "reversed": {"keywords": ["過度樂觀", "延遲成功", "負面思維", "活力不足"], "desc": "成功稍有延遲，或過度樂觀而忽略現實。保持正面態度的同時，也需腳踏實地面對挑戰。"}
  ,
    "image": "images/cards/19.webp"},
  {
    "id": 20,
    "name": "審判",
    "nameEn": "Judgement",
    "symbol": "📯",
    "upright": {"keywords": ["覺醒", "審判", "重生", "召喚", "反思"], "desc": "重大的覺醒與自我反思時刻。代表過去行為的評判與新生命的召喚。誠實回顧過去，接受轉化，邁向更高的自我。"},
    "reversed": {"keywords": ["自我懷疑", "拒絕反思", "逃避責任", "無法原諒"], "desc": "可能逃避必要的自我反省，或無法放下過去。學習原諒自己和他人，才能真正走向新生。"}
  ,
    "image": "images/cards/20.webp"},
  {
    "id": 21,
    "name": "世界",
    "nameEn": "The World",
    "symbol": "🌍",
    "upright": {"keywords": ["完成", "整合", "成就", "圓滿", "新循環"], "desc": "代表一個重要階段的圓滿完成。所有努力得到了肯定，達到整合與成就感。在享受成功的同時，準備迎接下一個循環的開始。"},
    "reversed": {"keywords": ["未竟之事", "停滯", "延遲完成", "缺乏結束感"], "desc": "某件重要的事尚未真正完成，或停留在快要結束的邊緣。需找出阻礙完成的因素，給這個階段一個真正的結尾。"}
  ,
    "image": "images/cards/21.webp"},
  {
    "id": 22,
    "name": "權杖王牌",
    "nameEn": "Ace of Wands",
    "symbol": "🔥",
    "upright": {
      "keywords": [
        "創造力",
        "靈感",
        "新機會",
        "潛力"
      ],
      "desc": "創造性能量的爆發，新計劃或冒險的開始。抓住這股熱情，採取行動。"
    },
    "reversed": {
      "keywords": [
        "缺乏方向",
        "延遲",
        "錯過機會",
        "創造力受阻"
      ],
      "desc": "可能感到缺乏動力或靈感。重新點燃你的熱情，不要讓機會溜走。"
    },
    "image": "images/cards/card_22.webp"
  },
  {
    "id": 23,
    "name": "權杖二",
    "nameEn": "Two of Wands",
    "symbol": "🌐",
    "upright": {
      "keywords": [
        "規劃",
        "抉擇",
        "未來願景",
        "進展"
      ],
      "desc": "站在十字路口，規劃未來的方向。做出決定，踏出舒適區。"
    },
    "reversed": {
      "keywords": [
        "猶豫",
        "恐懼未知",
        "缺乏規劃",
        "意外"
      ],
      "desc": "可能害怕做出選擇或缺乏遠見。不要讓恐懼阻止你前進。"
    },
    "image": "images/cards/card_23.webp"
  },
  {
    "id": 24,
    "name": "權杖三",
    "nameEn": "Three of Wands",
    "symbol": "🚢",
    "upright": {
      "keywords": [
        "擴展",
        "遠見",
        "領導",
        "進步"
      ],
      "desc": "你的努力開始有了成果，視野正在擴展。領導力得到認可，繼續前進。"
    },
    "reversed": {
      "keywords": [
        "挫折",
        "延遲",
        "缺乏遠見",
        "障礙"
      ],
      "desc": "可能遇到阻礙或計劃延遲。保持耐心，重新評估你的策略。"
    },
    "image": "images/cards/card_24.webp"
  },
  {
    "id": 25,
    "name": "權杖四",
    "nameEn": "Four of Wands",
    "symbol": "🎊",
    "upright": {
      "keywords": [
        "慶祝",
        "和諧",
        "家庭",
        "里程碑"
      ],
      "desc": "值得慶祝的時刻，達成重要的里程碑。享受與親友的和諧時光。"
    },
    "reversed": {
      "keywords": [
        "不穩定",
        "缺乏和諧",
        "未完成",
        "過渡期"
      ],
      "desc": "可能感到不穩定或慶祝被延遲。專注於建立穩固的基礎。"
    },
    "image": "images/cards/card_25.webp"
  },
  {
    "id": 26,
    "name": "權杖五",
    "nameEn": "Five of Wands",
    "symbol": "⚔️",
    "upright": {
      "keywords": [
        "競爭",
        "衝突",
        "挑戰",
        "多樣意見"
      ],
      "desc": "面臨競爭或意見分歧。這可以激發創造力，但也需要管理衝突。"
    },
    "reversed": {
      "keywords": [
        "避免衝突",
        "內在衝突",
        "解決爭端",
        "協調"
      ],
      "desc": "衝突正在緩解，或你在逃避必要的對抗。尋找建設性的方式解決分歧。"
    },
    "image": "images/cards/card_26.webp"
  },
  {
    "id": 27,
    "name": "權杖六",
    "nameEn": "Six of Wands",
    "symbol": "🎖️",
    "upright": {
      "keywords": [
        "勝利",
        "認可",
        "成功",
        "自信"
      ],
      "desc": "公開的成功和認可，你的努力得到回報。享受這一刻的榮耀。"
    },
    "reversed": {
      "keywords": [
        "失敗",
        "缺乏認可",
        "自我懷疑",
        "傲慢"
      ],
      "desc": "可能遭遇挫折或未獲得預期的認可。保持謙虛，從失敗中學習。"
    },
    "image": "images/cards/card_27.webp"
  },
  {
    "id": 28,
    "name": "權杖七",
    "nameEn": "Seven of Wands",
    "symbol": "🛡️",
    "upright": {
      "keywords": [
        "堅守立場",
        "挑戰",
        "競爭",
        "勇氣"
      ],
      "desc": "面對挑戰時要堅持自己的立場。你有優勢，不要輕易放棄。"
    },
    "reversed": {
      "keywords": [
        "退縮",
        "放棄",
        "壓力過大",
        "疲憊"
      ],
      "desc": "可能感到被壓垮或想要放棄。評估這場戰鬥是否值得繼續。"
    },
    "image": "images/cards/card_28.webp"
  },
  {
    "id": 29,
    "name": "權杖八",
    "nameEn": "Eight of Wands",
    "symbol": "🚀",
    "upright": {
      "keywords": [
        "快速行動",
        "進展",
        "溝通",
        "旅行"
      ],
      "desc": "事情正在快速發展，障礙被清除。把握這股動力，迅速行動。"
    },
    "reversed": {
      "keywords": [
        "延遲",
        "混亂",
        "誤解",
        "失去動力"
      ],
      "desc": "進展受阻或溝通出現問題。保持耐心，重新調整節奏。"
    },
    "image": "images/cards/card_29.webp"
  },
  {
    "id": 30,
    "name": "權杖九",
    "nameEn": "Nine of Wands",
    "symbol": "💪",
    "upright": {
      "keywords": [
        "堅持",
        "韌性",
        "毅力",
        "最後考驗"
      ],
      "desc": "雖然疲憊但接近終點。再堅持一下，勝利就在前方。"
    },
    "reversed": {
      "keywords": [
        "疲憊",
        "放棄",
        "多疑",
        "頑固"
      ],
      "desc": "可能過度防備或筋疲力盡。知道何時該休息，何時該尋求幫助。"
    },
    "image": "images/cards/card_30.webp"
  },
  {
    "id": 31,
    "name": "權杖十",
    "nameEn": "Ten of Wands",
    "symbol": "🏋️",
    "upright": {
      "keywords": [
        "負擔",
        "責任",
        "壓力",
        "努力"
      ],
      "desc": "承擔過多的責任和壓力。需要委派任務或重新評估優先順序。"
    },
    "reversed": {
      "keywords": [
        "卸下重擔",
        "釋放壓力",
        "拒絕責任",
        "燃燒殆盡"
      ],
      "desc": "即將釋放壓力，或學會拒絕不必要的負擔。不要讓責任壓垮你。"
    },
    "image": "images/cards/card_31.webp"
  },
  {
    "id": 32,
    "name": "權杖侍者",
    "nameEn": "Page of Wands",
    "symbol": "🌱",
    "upright": {
      "keywords": [
        "熱情",
        "探索",
        "好奇心",
        "新消息"
      ],
      "desc": "充滿熱情和好奇心的開始。可能有令人振奮的消息或新機會。"
    },
    "reversed": {
      "keywords": [
        "猶豫",
        "缺乏方向",
        "挫折",
        "不成熟"
      ],
      "desc": "可能缺乏方向感或熱情消退。重新找回你的激情和目標。"
    },
    "image": "images/cards/card_32.webp"
  },
  {
    "id": 33,
    "name": "權杖騎士",
    "nameEn": "Knight of Wands",
    "symbol": "🐎",
    "upright": {
      "keywords": [
        "冒險",
        "衝動",
        "熱血",
        "行動"
      ],
      "desc": "充滿活力和冒險精神，勇敢追求目標。但要注意不要過於魯莽。"
    },
    "reversed": {
      "keywords": [
        "魯莽",
        "衝動決定",
        "延遲",
        "挫折"
      ],
      "desc": "可能過於衝動或遭遇阻礙。在行動前多加思考。"
    },
    "image": "images/cards/card_33.webp"
  },
  {
    "id": 34,
    "name": "權杖王后",
    "nameEn": "Queen of Wands",
    "symbol": "🌻",
    "upright": {
      "keywords": [
        "自信",
        "熱情",
        "決心",
        "獨立"
      ],
      "desc": "充滿自信和魅力，能夠啟發他人。相信自己的能力，展現領導風範。"
    },
    "reversed": {
      "keywords": [
        "自我懷疑",
        "嫉妒",
        "控制欲",
        "情緒化"
      ],
      "desc": "可能缺乏自信或過於強勢。找回內在的平衡和穩定。"
    },
    "image": "images/cards/card_34.webp"
  },
  {
    "id": 35,
    "name": "權杖國王",
    "nameEn": "King of Wands",
    "symbol": "🦅",
    "upright": {
      "keywords": [
        "領導",
        "願景",
        "創業",
        "榮譽"
      ],
      "desc": "具有遠見和領導力，能夠激勵他人實現目標。大膽追求你的願景。"
    },
    "reversed": {
      "keywords": [
        "傲慢",
        "專制",
        "衝動",
        "高期望"
      ],
      "desc": "可能過於專制或期望過高。學會傾聽他人，保持謙遜。"
    },
    "image": "images/cards/card_35.webp"
  },
  {
    "id": 36,
    "name": "聖杯王牌",
    "nameEn": "Ace of Cups",
    "symbol": "💝",
    "upright": {
      "keywords": [
        "愛",
        "新感情",
        "直覺",
        "創造力"
      ],
      "desc": "情感的新開始，愛和喜悅湧入生活。敞開心扉接受祝福。"
    },
    "reversed": {
      "keywords": [
        "情感阻塞",
        "空虛",
        "壓抑感情",
        "失望"
      ],
      "desc": "可能壓抑情感或感到情緒空虛。釋放你的感受，允許愛流動。"
    },
    "image": "images/cards/card_36.webp"
  },
  {
    "id": 37,
    "name": "聖杯二",
    "nameEn": "Two of Cups",
    "symbol": "🤝",
    "upright": {
      "keywords": [
        "合作",
        "連結",
        "愛情",
        "夥伴關係"
      ],
      "desc": "深刻的情感連結或合作關係。無論是愛情還是友情，彼此互相支持。"
    },
    "reversed": {
      "keywords": [
        "失衡",
        "分離",
        "誤解",
        "破裂的關係"
      ],
      "desc": "關係中出現不平衡或衝突。需要溝通和重新建立連結。"
    },
    "image": "images/cards/card_37.webp"
  },
  {
    "id": 38,
    "name": "聖杯三",
    "nameEn": "Three of Cups",
    "symbol": "🥂",
    "upright": {
      "keywords": [
        "慶祝",
        "友誼",
        "社交",
        "創造力"
      ],
      "desc": "與朋友一起慶祝的美好時光。享受社交活動和群體的支持。"
    },
    "reversed": {
      "keywords": [
        "孤立",
        "過度放縱",
        "流言",
        "社交疲勞"
      ],
      "desc": "可能感到被排斥或社交過度。在社交與獨處間找到平衡。"
    },
    "image": "images/cards/card_38.webp"
  },
  {
    "id": 39,
    "name": "聖杯四",
    "nameEn": "Four of Cups",
    "symbol": "😔",
    "upright": {
      "keywords": [
        "不滿",
        "冥想",
        "重新評估",
        "錯失機會"
      ],
      "desc": "可能對現狀不滿或陷入沉思。注意不要錯過眼前的機會。"
    },
    "reversed": {
      "keywords": [
        "覺醒",
        "接受機會",
        "走出低潮",
        "新視角"
      ],
      "desc": "從冷漠中覺醒，準備好接受新的可能性。走出舒適區。"
    },
    "image": "images/cards/card_39.webp"
  },
  {
    "id": 40,
    "name": "聖杯五",
    "nameEn": "Five of Cups",
    "symbol": "😢",
    "upright": {
      "keywords": [
        "失落",
        "遺憾",
        "悲傷",
        "專注於失去"
      ],
      "desc": "經歷失落或悲傷，但不要只看到打翻的杯子。還有希望存在。"
    },
    "reversed": {
      "keywords": [
        "接受",
        "前進",
        "釋懷",
        "原諒"
      ],
      "desc": "開始接受失去並向前看。療癒正在發生，放下過去的遺憾。"
    },
    "image": "images/cards/card_40.webp"
  },
  {
    "id": 41,
    "name": "聖杯六",
    "nameEn": "Six of Cups",
    "symbol": "🧒",
    "upright": {
      "keywords": [
        "懷舊",
        "童年",
        "純真",
        "重逢"
      ],
      "desc": "與過去的美好回憶連結，可能與舊友重逢。保持童心和純真。"
    },
    "reversed": {
      "keywords": [
        "活在過去",
        "不願成長",
        "不切實際的回憶",
        "向前看"
      ],
      "desc": "過度沉溺於過去可能阻礙前進。珍惜回憶但要活在當下。"
    },
    "image": "images/cards/card_41.webp"
  },
  {
    "id": 42,
    "name": "聖杯七",
    "nameEn": "Seven of Cups",
    "symbol": "💭",
    "upright": {
      "keywords": [
        "幻想",
        "選擇",
        "夢想",
        "迷惑"
      ],
      "desc": "面對眾多選擇和可能性，但並非所有都是真實的。辨別幻想與現實。"
    },
    "reversed": {
      "keywords": [
        "清晰",
        "做出選擇",
        "面對現實",
        "專注"
      ],
      "desc": "迷霧散去，能夠更清楚地看待選擇。是時候做出決定了。"
    },
    "image": "images/cards/card_42.webp"
  },
  {
    "id": 43,
    "name": "聖杯八",
    "nameEn": "Eight of Cups",
    "symbol": "🚶",
    "upright": {
      "keywords": [
        "離開",
        "放棄",
        "尋找更深意義",
        "轉變"
      ],
      "desc": "離開不再滿足你的事物，尋找更有意義的道路。勇敢踏上新旅程。"
    },
    "reversed": {
      "keywords": [
        "猶豫",
        "害怕離開",
        "漂泊",
        "逃避"
      ],
      "desc": "可能害怕改變或不確定是否該離開。傾聽內心的真正渴望。"
    },
    "image": "images/cards/card_43.webp"
  },
  {
    "id": 44,
    "name": "聖杯九",
    "nameEn": "Nine of Cups",
    "symbol": "😊",
    "upright": {
      "keywords": [
        "滿足",
        "願望實現",
        "豐盛"
      ],
      "desc": "已經擁有很多，對自身感到滿意，願望即將實現，請享受這份豐盛。"
    },
    "reversed": {
      "keywords": [
        "不滿足",
        "貪婪",
        "空虛",
        "願望落空"
      ],
      "desc": "可能得到想要的卻仍感到空虛。真正的滿足來自內心。"
    },
    "image": "images/cards/card_44.webp"
  },
  {
    "id": 45,
    "name": "聖杯十",
    "nameEn": "Ten of Cups",
    "symbol": "🌈",
    "upright": {
      "keywords": [
        "圓滿",
        "家庭幸福",
        "和諧",
        "喜悅"
      ],
      "desc": "情感上的圓滿和家庭和諧。享受與所愛之人的幸福時光。"
    },
    "reversed": {
      "keywords": [
        "家庭不和",
        "失衡",
        "不切實際的期望",
        "分離"
      ],
      "desc": "家庭關係中可能存在問題。努力修復連結，調整期望。"
    },
    "image": "images/cards/card_45.webp"
  },
  {
    "id": 46,
    "name": "聖杯侍者",
    "nameEn": "Page of Cups",
    "symbol": "🐟",
    "upright": {
      "keywords": [
        "創意",
        "直覺",
        "好奇",
        "訊息"
      ],
      "desc": "情感或創意上的新開始。可能收到好消息或靈感湧現。"
    },
    "reversed": {
      "keywords": [
        "情緒不成熟",
        "創意受阻",
        "壞消息",
        "幻想"
      ],
      "desc": "可能過於情緒化或沉溺幻想。培養情緒成熟度。"
    },
    "image": "images/cards/card_46.webp"
  },
  {
    "id": 47,
    "name": "聖杯騎士",
    "nameEn": "Knight of Cups",
    "symbol": "🦢",
    "upright": {
      "keywords": [
        "浪漫",
        "魅力",
        "想像力",
        "追求夢想"
      ],
      "desc": "浪漫和創意的追求者。可能有浪漫的邂逅或創意靈感。"
    },
    "reversed": {
      "keywords": [
        "情緒化",
        "不切實際",
        "失望",
        "欺騙"
      ],
      "desc": "可能過於理想化或遭遇情感上的失望。保持現實。"
    },
    "image": "images/cards/card_47.webp"
  },
  {
    "id": 48,
    "name": "聖杯王后",
    "nameEn": "Queen of Cups",
    "symbol": "🧜",
    "upright": {
      "keywords": [
        "同理心",
        "直覺",
        "情感支持",
        "療癒"
      ],
      "desc": "具有深厚的同理心和直覺力。能夠撫慰他人，也要記得照顧自己。"
    },
    "reversed": {
      "keywords": [
        "情緒不穩",
        "過度敏感",
        "脫離現實",
        "依賴"
      ],
      "desc": "可能情緒過於敏感或與他人界限不清。保護你的能量。"
    },
    "image": "images/cards/card_48.webp"
  },
  {
    "id": 49,
    "name": "聖杯國王",
    "nameEn": "King of Cups",
    "symbol": "🔱",
    "upright": {
      "keywords": [
        "情緒平衡",
        "外交",
        "同情",
        "智慧"
      ],
      "desc": "在情感和理性間取得平衡。以智慧和同情心引導他人。"
    },
    "reversed": {
      "keywords": [
        "情緒壓抑",
        "操控",
        "情緒波動",
        "冷漠"
      ],
      "desc": "可能壓抑情感或利用情緒操控他人。尋求內在平衡。"
    },
    "image": "images/cards/card_49.webp"
  },
  {
    "id": 50,
    "name": "寶劍王牌",
    "nameEn": "Ace of Swords",
    "symbol": "🗡️",
    "upright": {
      "keywords": [
        "清晰",
        "真相",
        "突破",
        "新想法"
      ],
      "desc": "思維的突破和清晰，真相被揭示。以銳利的洞察力切入問題核心。"
    },
    "reversed": {
      "keywords": [
        "混亂",
        "誤解",
        "缺乏清晰",
        "錯誤判斷"
      ],
      "desc": "思維混亂或溝通出現問題。在做決定前尋求更多資訊。"
    },
    "image": "images/cards/card_50.webp"
  },
  {
    "id": 51,
    "name": "寶劍二",
    "nameEn": "Two of Swords",
    "symbol": "🙈",
    "upright": {
      "keywords": [
        "抉擇困難",
        "僵局",
        "逃避",
        "內心衝突"
      ],
      "desc": "面臨困難的選擇，可能在逃避決定。拿下眼罩，面對現實。"
    },
    "reversed": {
      "keywords": [
        "做出決定",
        "資訊過多",
        "焦慮",
        "真相揭露"
      ],
      "desc": "僵局被打破，準備好面對一直逃避的事情。"
    },
    "image": "images/cards/card_51.webp"
  },
  {
    "id": 52,
    "name": "寶劍三",
    "nameEn": "Three of Swords",
    "symbol": "💔",
    "upright": {
      "keywords": [
        "心痛",
        "悲傷",
        "失落",
        "背叛"
      ],
      "desc": "經歷情感的痛苦，可能是分離或背叛。允許自己悲傷，但也要療癒。"
    },
    "reversed": {
      "keywords": [
        "療癒",
        "釋放痛苦",
        "原諒",
        "前進"
      ],
      "desc": "從心痛中恢復，開始療癒的過程。釋放過去的傷痛。"
    },
    "image": "images/cards/card_52.webp"
  },
  {
    "id": 53,
    "name": "寶劍四",
    "nameEn": "Four of Swords",
    "symbol": "🧘",
    "upright": {
      "keywords": [
        "休息",
        "恢復",
        "冥想",
        "暫停"
      ],
      "desc": "需要休息和恢復的時期。暫時退出戰場，養精蓄銳。"
    },
    "reversed": {
      "keywords": [
        "不安",
        "燃燒殆盡",
        "過度活躍",
        "無法放鬆"
      ],
      "desc": "可能過度疲勞卻無法休息。強迫自己停下來休養。"
    }
  ,
    "image": "images/cards/22.webp"},
  {
    "id": 54,
    "name": "寶劍五",
    "nameEn": "Five of Swords",
    "symbol": "😤",
    "upright": {
      "keywords": [
        "衝突",
        "失敗",
        "自私",
        "空洞的勝利"
      ],
      "desc": "可能贏了表面卻輸了實質。評估這場衝突是否值得。"
    },
    "reversed": {
      "keywords": [
        "和解",
        "放下",
        "學習教訓",
        "避免衝突"
      ],
      "desc": "衝突結束，是時候和解或從錯誤中學習。"
    }
  ,
    "image": "images/cards/23.webp"},
  {
    "id": 55,
    "name": "寶劍六",
    "nameEn": "Six of Swords",
    "symbol": "⛵",
    "upright": {
      "keywords": [
        "轉變",
        "過渡",
        "離開困境",
        "平靜"
      ],
      "desc": "離開困難的處境，駛向更平靜的水域。雖然改變不易，但這是必要的。"
    },
    "reversed": {
      "keywords": [
        "困住",
        "無法離開",
        "抵抗改變",
        "未解決的問題"
      ],
      "desc": "可能被困住或害怕改變。面對那些未解決的問題。"
    }
  ,
    "image": "images/cards/24.webp"},
  {
    "id": 56,
    "name": "寶劍七",
    "nameEn": "Seven of Swords",
    "symbol": "🦊",
    "upright": {
      "keywords": [
        "欺騙",
        "策略",
        "隱密行動",
        "聰明"
      ],
      "desc": "可能涉及欺騙或需要謹慎的策略行動。保持警覺。"
    },
    "reversed": {
      "keywords": [
        "真相揭露",
        "被抓",
        "自欺",
        "坦誠"
      ],
      "desc": "欺騙被揭露，或決定走更誠實的道路。"
    }
  ,
    "image": "images/cards/25.webp"},
  {
    "id": 57,
    "name": "寶劍八",
    "nameEn": "Eight of Swords",
    "symbol": "🔒",
    "upright": {
      "keywords": [
        "受困",
        "限制",
        "受害者心態",
        "無力感"
      ],
      "desc": "感覺被困住，但這可能是自我設限。你有力量解放自己。"
    },
    "reversed": {
      "keywords": [
        "解放",
        "釋放限制",
        "新視角",
        "自我接納"
      ],
      "desc": "開始看到出路，從自我設限中解脫。你比想像的更自由。"
    }
  ,
    "image": "images/cards/26.webp"},
  {
    "id": 58,
    "name": "寶劍九",
    "nameEn": "Nine of Swords",
    "symbol": "😰",
    "upright": {
      "keywords": [
        "焦慮",
        "惡夢",
        "擔憂",
        "絕望"
      ],
      "desc": "被焦慮和擔憂困擾，可能失眠或惡夢連連。尋求支持和解決方法。"
    },
    "reversed": {
      "keywords": [
        "釋放恐懼",
        "希望",
        "面對焦慮",
        "恢復"
      ],
      "desc": "最壞的時刻正在過去，找到方法處理焦慮。"
    }
  ,
    "image": "images/cards/27.webp"},
  {
    "id": 59,
    "name": "寶劍十",
    "nameEn": "Ten of Swords",
    "symbol": "🌅",
    "upright": {
      "keywords": [
        "結束",
        "痛苦的終結",
        "背叛",
        "觸底"
      ],
      "desc": "這是最黑暗的時刻，但也意味著最壞的已經過去。新的黎明即將來臨。"
    },
    "reversed": {
      "keywords": [
        "復甦",
        "重生",
        "學習教訓",
        "抵抗結局"
      ],
      "desc": "從谷底開始回升，或在拖延不可避免的結束。"
    }
  ,
    "image": "images/cards/28.webp"},
  {
    "id": 60,
    "name": "寶劍侍者",
    "nameEn": "Page of Swords",
    "symbol": "🔍",
    "upright": {
      "keywords": [
        "好奇心",
        "新想法",
        "溝通",
        "機警"
      ],
      "desc": "充滿好奇心和新想法。可能有重要的消息或需要保持警覺。"
    },
    "reversed": {
      "keywords": [
        "八卦",
        "衝動發言",
        "缺乏計劃",
        "不成熟"
      ],
      "desc": "可能過於衝動或散播八卦。想清楚再說話。"
    }
  ,
    "image": "images/cards/29.webp"},
  {
    "id": 61,
    "name": "寶劍騎士",
    "nameEn": "Knight of Swords",
    "symbol": "⚔️",
    "upright": {
      "keywords": [
        "雄心勃勃",
        "果斷",
        "直接",
        "快速行動"
      ],
      "desc": "充滿決心和行動力，快速追求目標。但也要注意不要傷害他人。"
    },
    "reversed": {
      "keywords": [
        "魯莽",
        "沒有方向",
        "無計劃",
        "衝突"
      ],
      "desc": "可能過於激進或行動沒有計劃。放慢腳步思考。"
    }
  ,
    "image": "images/cards/30.webp"},
  {
    "id": 62,
    "name": "寶劍王后",
    "nameEn": "Queen of Swords",
    "symbol": "❄️",
    "upright": {
      "keywords": [
        "獨立",
        "洞察力",
        "清晰",
        "直接"
      ],
      "desc": "以清晰的思維和獨立的態度處理事情。不會被情緒左右判斷。"
    },
    "reversed": {
      "keywords": [
        "冷酷",
        "苛刻",
        "過度批判",
        "孤僻"
      ],
      "desc": "可能過於嚴厲或與他人疏離。用同理心平衡理性。"
    }
  ,
    "image": "images/cards/31.webp"},
  {
    "id": 63,
    "name": "寶劍國王",
    "nameEn": "King of Swords",
    "symbol": "👁️",
    "upright": {
      "keywords": [
        "權威",
        "真相",
        "公正",
        "知識"
      ],
      "desc": "以知識和公正處理事務。做出清晰、有邏輯的決定。"
    },
    "reversed": {
      "keywords": [
        "專制",
        "操控",
        "殘酷",
        "濫用權力"
      ],
      "desc": "可能濫用權力或過於冷酷。記住權力伴隨責任。"
    }
  ,
    "image": "images/cards/32.webp"},
  {
    "id": 64,
    "name": "錢幣王牌",
    "nameEn": "Ace of Pentacles",
    "symbol": "🪙",
    "upright": {
      "keywords": [
        "新機會",
        "繁榮",
        "顯化",
        "穩定"
      ],
      "desc": "物質或財務上的新開始。把握機會，將夢想轉化為現實。"
    },
    "reversed": {
      "keywords": [
        "錯失良機",
        "財務問題",
        "缺乏計劃",
        "貪婪"
      ],
      "desc": "可能錯過重要的機會或面臨財務挑戰。重新審視你的計劃。"
    }
  ,
    "image": "images/cards/33.webp"},
  {
    "id": 65,
    "name": "錢幣二",
    "nameEn": "Two of Pentacles",
    "symbol": "🎪",
    "upright": {
      "keywords": [
        "平衡",
        "適應",
        "時間管理",
        "靈活"
      ],
      "desc": "同時處理多個事務，需要保持平衡和靈活。適應變化的環境。"
    },
    "reversed": {
      "keywords": [
        "失衡",
        "不堪負荷",
        "優先順序混亂",
        "疏忽"
      ],
      "desc": "可能承擔太多導致失衡。重新安排優先順序。"
    }
  ,
    "image": "images/cards/34.webp"},
  {
    "id": 66,
    "name": "錢幣三",
    "nameEn": "Three of Pentacles",
    "symbol": "🏗️",
    "upright": {
      "keywords": [
        "團隊合作",
        "技能",
        "學習",
        "品質"
      ],
      "desc": "團隊合作帶來成功。你的技能得到認可，繼續學習和成長。"
    },
    "reversed": {
      "keywords": [
        "缺乏團隊精神",
        "品質差",
        "不合作",
        "能力不足"
      ],
      "desc": "團隊合作出現問題或工作品質不佳。改善溝通和技能。"
    }
  ,
    "image": "images/cards/35.webp"},
  {
    "id": 67,
    "name": "錢幣四",
    "nameEn": "Four of Pentacles",
    "symbol": "🏦",
    "upright": {
      "keywords": [
        "安全",
        "保守",
        "穩定",
        "控制"
      ],
      "desc": "重視安全和穩定，但也要注意不要過於執著於物質。"
    },
    "reversed": {
      "keywords": [
        "貪婪",
        "浪費",
        "放手",
        "財務不穩"
      ],
      "desc": "可能過於吝嗇或過度揮霍。在保守與慷慨間找到平衡。"
    }
  ,
    "image": "images/cards/36.webp"},
  {
    "id": 68,
    "name": "錢幣五",
    "nameEn": "Five of Pentacles",
    "symbol": "🥶",
    "upright": {
      "keywords": [
        "困難",
        "貧困",
        "孤立",
        "憂慮"
      ],
      "desc": "經歷物質或精神上的困難。記住有幫助可以尋求，你不是孤獨的。"
    },
    "reversed": {
      "keywords": [
        "恢復",
        "接受幫助",
        "改善",
        "信心回歸"
      ],
      "desc": "困難時期即將結束，接受他人的幫助和支持。"
    }
  ,
    "image": "images/cards/37.webp"},
  {
    "id": 69,
    "name": "錢幣六",
    "nameEn": "Six of Pentacles",
    "symbol": "🎁",
    "upright": {
      "keywords": [
        "慷慨",
        "給予",
        "接受",
        "公平"
      ],
      "desc": "施與受的平衡。無論是給予還是接受，都要心懷感恩。"
    },
    "reversed": {
      "keywords": [
        "不公平",
        "吝嗇",
        "債務",
        "附帶條件"
      ],
      "desc": "給予或接受的關係可能不平衡。確保交換是公平的。"
    }
  ,
    "image": "images/cards/38.webp"},
  {
    "id": 70,
    "name": "錢幣七",
    "nameEn": "Seven of Pentacles",
    "symbol": "🌾",
    "upright": {
      "keywords": [
        "耐心",
        "評估",
        "長期投資",
        "等待收穫"
      ],
      "desc": "播種後需要耐心等待收穫。評估你的進展，做必要的調整。"
    },
    "reversed": {
      "keywords": [
        "缺乏耐心",
        "浪費投資",
        "重新評估",
        "焦慮"
      ],
      "desc": "可能對結果感到焦慮或投資沒有回報。重新考慮你的策略。"
    }
  ,
    "image": "images/cards/39.webp"},
  {
    "id": 71,
    "name": "錢幣八",
    "nameEn": "Eight of Pentacles",
    "symbol": "🔨",
    "upright": {
      "keywords": [
        "勤奮",
        "專注",
        "技藝",
        "專業"
      ],
      "desc": "專注於提升你的技能和專業。勤奮的努力終將有回報。"
    },
    "reversed": {
      "keywords": [
        "缺乏專注",
        "完美主義",
        "無聊",
        "虎頭蛇尾"
      ],
      "desc": "可能感到無聊或無法專注。重新找回對工作的熱情。"
    }
  ,
    "image": "images/cards/40.webp"},
  {
    "id": 72,
    "name": "錢幣九",
    "nameEn": "Nine of Pentacles",
    "symbol": "🦚",
    "upright": {
      "keywords": [
        "豐盛",
        "獨立",
        "成就",
        "奢華"
      ],
      "desc": "享受努力帶來的成果和獨立。你值得這份豐盛和自由。"
    },
    "reversed": {
      "keywords": [
        "過度依賴",
        "財務問題",
        "缺乏自律",
        "不安全感"
      ],
      "desc": "可能在財務上過度依賴他人或缺乏自律。培養真正的獨立。"
    }
  ,
    "image": "images/cards/41.webp"},
  {
    "id": 73,
    "name": "錢幣十",
    "nameEn": "Ten of Pentacles",
    "symbol": "🏰",
    "upright": {
      "keywords": [
        "財富",
        "家族",
        "傳承",
        "長期成功"
      ],
      "desc": "長期的穩定和繁榮，物質和情感上的安全。重視家族和傳統。"
    },
    "reversed": {
      "keywords": [
        "財務損失",
        "家族問題",
        "短視",
        "缺乏根基"
      ],
      "desc": "可能面臨財務問題或家庭衝突。關注長期穩定而非短期利益。"
    }
  ,
    "image": "images/cards/42.webp"},
  {
    "id": 74,
    "name": "錢幣侍者",
    "nameEn": "Page of Pentacles",
    "symbol": "📚",
    "upright": {
      "keywords": [
        "新計劃",
        "機會",
        "學習",
        "勤奮"
      ],
      "desc": "學習新技能或開始新計劃的好時機。保持專注和實際。"
    },
    "reversed": {
      "keywords": [
        "缺乏進展",
        "不切實際",
        "拖延",
        "揮霍"
      ],
      "desc": "可能缺乏專注或計劃不切實際。腳踏實地，專心學習。"
    }
  ,
    "image": "images/cards/43.webp"},
  {
    "id": 75,
    "name": "錢幣騎士",
    "nameEn": "Knight of Pentacles",
    "symbol": "🐂",
    "upright": {
      "keywords": [
        "穩健",
        "責任",
        "耐心",
        "可靠"
      ],
      "desc": "穩定且負責任的前進。可能進展緩慢但堅實可靠。"
    },
    "reversed": {
      "keywords": [
        "停滯",
        "固執",
        "無聊",
        "過度謹慎"
      ],
      "desc": "可能過於保守或陷入停滯。保持前進的動力。"
    }
  ,
    "image": "images/cards/44.webp"},
  {
    "id": 76,
    "name": "錢幣王后",
    "nameEn": "Queen of Pentacles",
    "symbol": "🌺",
    "upright": {
      "keywords": [
        "務實",
        "滋養",
        "穩定",
        "豐盛"
      ],
      "desc": "創造溫暖和穩定的環境。照顧好自己和他人，享受生活的美好。"
    },
    "reversed": {
      "keywords": [
        "失衡",
        "疏忽自我",
        "物質主義",
        "不安全感"
      ],
      "desc": "可能過度關注他人而忽略自己，或過於注重物質。找回平衡。"
    }
  ,
    "image": "images/cards/45.webp"},
  {
    "id": 77,
    "name": "錢幣國王",
    "nameEn": "King of Pentacles",
    "symbol": "🤴",
    "upright": {
      "keywords": [
        "成功",
        "富裕",
        "領導力",
        "安全"
      ],
      "desc": "物質上的成功和穩定。以智慧管理資源，享受你的成就。"
    },
    "reversed": {
      "keywords": [
        "貪婪",
        "工作狂",
        "財務管理差",
        "固執"
      ],
      "desc": "可能過於專注物質或財務管理不善。記住生活不只有金錢。"
    }
  ,
    "image": "images/cards/46.webp"}
];
