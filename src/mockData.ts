import { Potato, UserStats, Friend, ClimbingKnowledge, Gear } from './types';

export const MOCK_GEAR: Gear[] = [
  // --- FOOTWEAR ---
  { id: 's1', name: 'トレイルランニングシューズ', category: 'shoes', level: 1, icon: '👟', description: '軽量で通気性抜群。整備された登山道やスピードハイクに最適。' },
  { id: 's2', name: '3シーズン用ハイカットブーツ', category: 'shoes', level: 1, icon: '🥾', description: '足首をしっかりサポートし、重い荷物でも疲れにくい定番の一足。' },
  { id: 's3', name: '本格アルパインブーツ', category: 'shoes', level: 3, icon: '👢', description: '硬いソールで岩場での立ち込みに強く、セミワンタッチアイゼン対応。' },
  { id: 's4', name: '厳冬期用ダブルブーツ', category: 'shoes', level: 4, icon: '⛸️', description: 'インナー付きで保温性抜群。マイナス30度の極寒地でも指先を守る。' },

  // --- BACKPACKS ---
  { id: 'b1', name: '20Lデイパック', category: 'backpack', level: 1, icon: '🎒', description: '日帰り登山やハイキングに。背面メッシュで背中が蒸れにくい。' },
  { id: 'b2', name: '45L中型ザック', category: 'backpack', level: 2, icon: '🎒', description: '山小屋泊や軽量なテント泊に。荷重分散に優れたヒップベルトを搭載。' },
  { id: 'b3', name: '75L大型遠征ザック', category: 'backpack', level: 3, icon: '🎒', description: '長期縦走や冬山登山に。重い荷物も安定して背負える屈強なフレーム。' },

  // --- CLOTHING (Layers) ---
  // Base Layers
  { id: 'c1', name: 'メリノウールベースレイヤー', category: 'clothing', level: 1, icon: '👕', description: '天然の防臭効果と調湿機能。汗冷えを防ぐ登山の命。' },
  { id: 'c2', name: '速乾ポリドライシャツ', category: 'clothing', level: 1, icon: '🎽', description: '汗を瞬時に吸い上げ拡散。夏の激しい登山でもドライをキープ。' },
  
  // Mid Layers
  { id: 'c3', name: 'グリッドフリース', category: 'clothing', level: 2, icon: '🧥', description: '凹凸のある生地で通気と保温を両立。行動着として最高の一枚。' },
  { id: 'c4', name: '高透湿ソフトシェル', category: 'clothing', level: 2, icon: '🧥', description: '防風性とストレッチ性を兼ね備え、稜線での冷たい風をシャットアウト。' },

  // Outer / Insulation
  { id: 'c5', name: '3層式ハードシェル(GORE-TEX)', category: 'clothing', level: 3, icon: '🧥', description: '風雪を完全に防ぐ。厳しい冬山や岩場での生命線。' },
  { id: 'c6', name: '800FP超軽量ダウンジャケット', category: 'clothing', level: 2, icon: '🛌', description: '休憩時やテント泊に。圧倒的な軽さと暖かさを提供。' },
  { id: 'c7', name: '化繊インサレーション', category: 'clothing', level: 2, icon: '🧥', description: '濡れても保温力を失わない。行動中も積極的に着られる保温着。' },

  // --- ACCESSORIES ---
  { id: 'a1', name: '伸縮式カーボンポール', category: 'accessory', level: 2, icon: '🦯', description: '膝の負担を大幅に軽減。軽量で長時間使っても手が疲れにくい。' },
  { id: 'a2', name: '高性能ヘッドランプ(900lm)', category: 'accessory', level: 2, icon: '💡', description: '夜間歩行や遭難防止に。周囲まで明るく照らす高出力モデル。' },
  { id: 'a3', name: '12本爪登山アイゼン', category: 'accessory', level: 3, icon: '⚙️', description: '雪や氷を確実に捉える。厳冬期の縦走には欠かせない。' },
  { id: 'a4', name: '登山用GPSウォッチ', category: 'accessory', level: 2, icon: '⌚', description: '高度、ルート、気圧を。常に現在地を把握し安全を確保。' },

  // --- SPECIAL / TECHNICAL ---
  { id: 'sp1', name: 'チタン製超極小ストーブ', category: 'accessory', level: 2, icon: '🔥', description: '山頂で温かいコーヒーを。極限まで削ぎ落とされたミニマルな火器。' },
  { id: 'sp2', name: 'ワンポール軽量テント', category: 'special', level: 3, icon: '⛺', description: '風に強く、設営も簡単。自由な山行を叶える山の家。' },
  { id: 'sp3', name: '黄金のピッケル', category: 'special', level: 4, icon: '⛏️', description: 'ポテト王国の宝。すべての最高峰を制覇した者のみに許される証。' },
];

export const MOCK_KNOWLEDGE: ClimbingKnowledge[] = [
  {
    id: 'k1',
    level: 1,
    category: 'gear',
    title: '靴選びの基本',
    content: '初心者は足首までしっかりサポートする「ハイカット」の登山靴がおすすめ！捻挫を防いでくれます。',
    icon: '🥾'
  },
  {
    id: 'k2',
    level: 2,
    category: 'safety',
    title: '山の天気',
    content: '標高が100m上がると気温は約0.6度下がります。下界が暑くても、山の上はひんやり！',
    icon: '🌤️'
  },
  {
    id: 'k3',
    level: 3,
    category: 'technique',
    title: '歩き方のコツ',
    content: '足の裏全体を地面につける「フラットフィッティング」を意識すると、疲れにくく滑りにくいですよ。',
    icon: '🚶'
  },
  {
    id: 'k4',
    level: 3,
    category: 'gear',
    title: '水分の目安',
    content: '「体重(kg) × 行動時間(h) × 5」が、必要な水分量の目安です。こまめに飲みましょう！',
    icon: '💧'
  }
];

export const MOCK_POTATOES: Potato[] = [
  {
    id: 'baron',
    name: '男爵いも',
    region: '北海道',
    unlockCondition: '初級の山を3回登頂',
    rarity: 1,
    difficulty: '初級',
    isUnlocked: true,
  },
  {
    id: 'mayqueen',
    name: 'メークイン',
    region: '長野県',
    unlockCondition: '標高1000m以上の山を登頂',
    rarity: 2,
    difficulty: '中級',
    isUnlocked: true,
  },
  {
    id: 'kitaakari',
    name: 'キタアカリ',
    region: '北海道',
    unlockCondition: '累計30ポテト達成',
    rarity: 2,
    difficulty: '初級',
    isUnlocked: true,
  },
  {
    id: 'inca',
    name: 'インカのめざめ',
    region: '群馬県',
    unlockCondition: '累計100ポテト達成',
    rarity: 4,
    difficulty: '上級',
    isUnlocked: true,
  },
  {
    id: 'touya',
    name: 'とうや',
    region: '岐阜県',
    unlockCondition: '秋の山を登頂',
    rarity: 3,
    difficulty: '中級',
    isUnlocked: true,
  },
  {
    id: 'hokkaikogane',
    name: '北海こがね',
    region: '山梨県',
    unlockCondition: '富士山を登頂',
    rarity: 5,
    difficulty: '最上級',
    isUnlocked: false,
  },
  {
    id: 'shadow',
    name: 'シャドークイーン',
    region: '静岡県',
    unlockCondition: '夜の山を登頂',
    rarity: 3,
    difficulty: '中級',
    isUnlocked: true,
  },
  {
    id: 'redmoon',
    name: 'レッドムーン',
    region: '栃木県',
    unlockCondition: '冬の山を登頂',
    rarity: 3,
    difficulty: '中級',
    isUnlocked: true,
  },
  {
    id: 'potesara',
    name: 'ぽてさら君',
    region: '東京都',
    unlockCondition: '公園の丘を散歩',
    rarity: 1,
    difficulty: '初級',
    isUnlocked: true,
  },
  {
    id: 'sweet',
    name: 'サツマイモもどき',
    region: '鹿児島県',
    unlockCondition: '南の山に遠征',
    rarity: 4,
    difficulty: '上級',
    isUnlocked: false,
  },
  {
    id: 'gold',
    name: '黄金ポテト',
    region: '福島県',
    unlockCondition: '幸運の山で見つける',
    rarity: 5,
    difficulty: '最上級',
    isUnlocked: false,
  },
  {
    id: 'snow',
    name: '雪解けポテト',
    region: '新潟県',
    unlockCondition: '雪山の春',
    rarity: 3,
    difficulty: '中級',
    isUnlocked: false,
  },
  {
    id: 'ocean',
    name: '海辺ポテト',
    region: '沖縄県',
    unlockCondition: '海岸沿いの崖',
    rarity: 2,
    difficulty: '初級',
    isUnlocked: false,
  },
  {
    id: 'star',
    name: '星降るポテト',
    region: '岡山県',
    unlockCondition: '天文台のある山',
    rarity: 4,
    difficulty: '上級',
    isUnlocked: false,
  },
  {
    id: 'forest',
    name: '森の番人ポテト',
    region: '奈良県',
    unlockCondition: '原生林の奥深く',
    rarity: 3,
    difficulty: '中級',
    isUnlocked: false,
  },
  {
    id: 'fire',
    name: '火山ポテト',
    region: '熊本県',
    unlockCondition: '阿蘇山周辺',
    rarity: 5,
    difficulty: '最上級',
    isUnlocked: false,
  },
  {
    id: 'crystal',
    name: '水晶ポテト',
    region: '愛媛県',
    unlockCondition: '鉱山跡',
    rarity: 4,
    difficulty: '上級',
    isUnlocked: false,
  },
  {
    id: 'wind',
    name: '風読みポテト',
    region: '滋賀県',
    unlockCondition: '琵琶湖を望む嶺',
    rarity: 2,
    difficulty: '初級',
    isUnlocked: false,
  },
  {
    id: 'ancient',
    name: '古代ポテト',
    region: '京都府',
    unlockCondition: '歴史ある古道',
    rarity: 4,
    difficulty: '上級',
    isUnlocked: false,
  },
  {
    id: 'flying',
    name: '空飛ぶポテト',
    region: '高知県',
    unlockCondition: '標高2000m以上',
    rarity: 5,
    difficulty: '最上級',
    isUnlocked: false,
  },
];

export const MOCK_USER_STATS: UserStats = {
  nickname: 'ポテトマスターZ',
  level: 3,
  totalPotatoes: 128,
  potatoesToNextLevel: 42,
  rankName: 'かけだし登山者',
  totalClimbs: 15,
  totalElevation: 4500,
  rarestPotatoType: 'インカのめざめ',
  lastClimbDifficulty: 'intermediate',
  ownedGearIds: ['s2', 'b1', 'c1', 'a2'],
  avatar: '🧗‍♀️',
  plans: [
    {
      id: 'p1',
      mountainName: '大山 (Mt. Oyama)',
      date: '2024.06.15',
      meetupLocation: '伊勢原駅北口',
      meetupTime: '08:30',
      isPublic: true,
      notes: '初心者歓迎！ゆっくり登りましょう。',
      participants: ['Potato King', 'Hiker Ben'],
      requiredGear: 'レインウェア, 登山靴, お弁当',
      experienceLevel: 'beginner',
      hasInsurance: true,
      elevationGain: 850,
      distance: 9.2,
      estPotatoesMin: 15,
      estPotatoesMax: 25
    }
  ],
  recentLogs: [
    {
      id: 'log1',
      mountainName: '高尾山 (Mt. Takao)',
      date: '2024.04.15',
      elevation: 599,
      distance: 3.8,
      duration: '3.5h',
      potatoesEarned: 8
    },
    {
      id: 'log2',
      mountainName: '大山 (Mt. Oyama)',
      date: '2024.04.02',
      elevation: 1252,
      distance: 6.2,
      duration: '4.5h',
      potatoesEarned: 12
    },
    {
      id: 'log3',
      mountainName: '雲取山 (Mt. Kumotori)',
      date: '2024.03.20',
      elevation: 2017,
      distance: 12.5,
      duration: '8h',
      potatoesEarned: 24,
      rarestPotatoFound: 'インカのめざめ'
    },
    {
      id: 'log4',
      mountainName: '筑波山 (Mt. Tsukuba)',
      date: '2024.03.01',
      elevation: 877,
      distance: 4.5,
      duration: '4h',
      potatoesEarned: 10
    }
  ]
};

export const MOCK_FRIENDS: Friend[] = [
  { id: '1', nickname: '山ガールあみ', level: 5, avatar: '👩', isOnline: true },
  { id: '2', nickname: '頂上ハンター', level: 8, avatar: '👲', isOnline: false },
  { id: '3', nickname: '登山ポテト君', level: 2, avatar: '🥔', isOnline: true },
  { id: '4', nickname: 'クライマー健一', level: 12, avatar: '🧗', isOnline: false },
];
