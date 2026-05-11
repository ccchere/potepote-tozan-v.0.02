import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getMountainRecommendations } from './services/geminiService.ts';
import { UserPreferences, RecommendationResponse, MountainRoute, Language, Season, ChecklistItem, AppStep, ClimbingPlan } from './types.ts';
import { LoginScreen } from './components/LoginScreen';
import { FarmScreen } from './components/FarmScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CreatePlanScreen } from './components/CreatePlanScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { BottomNav } from './components/BottomNav';
import { MOCK_POTATOES, MOCK_USER_STATS, MOCK_FRIENDS, MOCK_KNOWLEDGE, MOCK_GEAR } from './mockData';
import { 
  Mountain, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Trophy, 
  Eye, 
  TrainFront, 
  Award,
  RefreshCcw,
  Compass,
  Languages,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Calendar,
  X,
  TrendingUp,
  CloudSun,
  Snowflake,
  Sun,
  Leaf,
  Bean,
  Search,
  Book,
  User,
  Sprout,
  Flame,
  History,
  Star
} from 'lucide-react';

const PREFECTURES = [
  '东京都', '大阪府', '京都府', '北海道', '神奈川县', '爱知县', '千叶县', '埼玉县', '兵库县', '福冈县',
  '静冈县', '茨城县', '广岛县', '宫城县', '新潟县', '长野县', '栃木县', '群马县', '冈山县', '岐阜县',
  '三重县', '滋贺县', '熊本县', '鹿儿岛县', '奈良县', '长崎县', '爱媛县', '青森县', '岩手县', '大分县',
  '石川县', '山口县', '福岛县', '秋田县', '山梨县', '富山县', '和歌山县', '福井县', '香川县', '德岛县',
  '高知县', '佐贺县', '岛根县', '鳥取县', '宫崎县', '冲绳县', '山形县'
];

const PREFECTURES_EN = [
  'Tokyo', 'Osaka', 'Kyoto', 'Hokkaido', 'Kanagawa', 'Aichi', 'Chiba', 'Saitama', 'Hyogo', 'Fukuoka',
  'Shizuoka', 'Ibaraki', 'Hiroshima', 'Miyagi', 'Niigata', 'Nagano', 'Tochigi', 'Gunma', 'Okayama', 'Gifu',
  'Mie', 'Shiga', 'Kumamoto', 'Kagoshima', 'Nara', 'Nagasaki', 'Ehime', 'Aomori', 'Iwate', 'Oita',
  'Ishikawa', 'Yamaguchi', 'Fukushima', 'Akita', 'Yamanashi', 'Toyama', 'Wakayama', 'Fukui', 'Kagawa', 'Tokushima',
  'Kochi', 'Saga', 'Shimane', 'Tottori', 'Miyazaki', 'Okinawa', 'Yamagata'
];

const translations = {
  ja: {
    title: 'ぽてぽて登山',
    subtitle: 'あなたにぴったりの「山」を見つける旅へ。',
    description: '初心者から上級者まで、ポテトたちが最高のルートを推薦します。',
    start: '山を見つけにいく',
    discovery: 'POTEPOTE SURVEY',
    surveyTitle: 'お山の好みを教えてね',
    fitness: '体力レベル',
    experience: 'これまでの経験',
    experienceNone: '未経験・初心者',
    experienceSmall: '近所の低い山程度',
    experienceHigh: '標高のある本格的な登山',
    frequency: '登山の頻度',
    freqFirst: '今回が初めて',
    freqFew: '年に数回',
    freqMonth: '月に1回以上',
    freqWeek: '週に1回以上',
    region: '住んでいる地域（都道府県）',
    regionPlaceholder: '例：東京都、大阪府',
    duration: '期間',
    day_trip: '日帰り',
    overnight: '宿泊希望',
    elevationGain: '累計標高差の好み',
    elevLow: 'ゆるやか（500m以下）',
    elevMid: '标准（500m-1000m）',
    elevHigh: 'しっかり（1000m以上）',
    transit: '交通手段',
    transitPublic: '電車・バス等',
    transitCar: '車',
    cableCarTitle: 'ケーブルカー / ロープウェイ',
    cableCarPrefer: '積極的に利用したい',
    cableCarAvoid: '自分の足で歩きたい',
    cableCarAny: 'どちらでも良い',
    priority: '重視するポイント',
    priorityScenery: '絶景を楽しみたい',
    priorityAchievement: '達成感を味わいたい',
    season: '季節',
    analyze: '美味しいルートを探す',
    loading: 'ホクホクのお山を準備中...',
    loadingSub: 'ポテトたちがお山を調査しています',
    resultsTitle: 'あなたへのおすすめ',
    resultsSub: 'から出発する最高のコース',
    restart: '別のお山を探す',
    beginnerTitle: 'まずはここから。初心者向けルート',
    nextStepTitle: '次への挑戦。ステップアップルート',
    safetyTitle: '安全な登山のために',
    safetyDesc: '山の天候は非常に変わりやすいです。登山届の提出、十分な装備、こまめな水分補給を忘れずに。自分の体力に合わせて、無理のないペースで楽しみましょう。',
    low: '低い (初心者)',
    mid: '普通',
    high: '高い',
    expNone: '未経験',
    expSome: '何度かある',
    expFreq: '頻繁に行く',
    estTime: '行程目安',
    elevGainActual: '累計標高差',
    mandatory: '必須装備',
    access: 'アクセス方法',
    reason: '推奨の理由',
    packingList: '持ち物リスト',
    checklistTitle: '装備の準備はOK？',
    spring: '春',
    summer: '夏',
    autumn: '秋',
    winter: '冬',
    importantNote: '※ポテト初心者さんは特にこれらを忘れずに！',
    rank: 'あなたのランク',
    rankDesc: 'ランクの詳細を確認',
    rank1: '土の中のポテト (種いも)',
    rank2: '芽生えポテト',
    rank3: 'ふたばポテト',
    rank4: 'こつぶポテト',
    rank5: 'ホクホクポテト',
    rank6: '山歩きポテト',
    rank7: 'ポテト登山家',
    rank8: 'ポテト冒険家',
    rank9: 'ポテトマスター',
    rank10: 'マウンテン・キング・ポテト',
    libraryTitle: 'ポテポテファーム',
    librarySub: 'これまでに発見したポテトたち',
    knowledgeTitle: 'ポテトの登山マメ知識',
    knowledgeSub: 'レベルに合わせて役立つヒントをお届け！',
    close: '閉じる'
  },
  en: {
    title: 'Potepote Hiking',
    subtitle: 'Find your perfect mountain peak ✨',
    description: 'Whether you are a beginner or a pro, the potatoes will recommend the best routes for you.',
    start: 'Start Exploring!',
    discovery: 'POTEPOTE SURVEY',
    surveyTitle: 'Tell us your preferences',
    fitness: 'Fitness Level',
    experience: 'Previous Experience',
    experienceNone: 'Beginner/No major climbs',
    experienceSmall: 'Local small mountains',
    experienceHigh: 'High altitude/Multi-day',
    frequency: 'Climbing Frequency',
    freqFirst: 'This is my first time',
    freqFew: 'Few times a year',
    freqMonth: 'At least monthly',
    freqWeek: 'Weekly',
    region: 'Living Region (Japan Prefectures)',
    regionPlaceholder: 'e.g. Tokyo, Osaka',
    duration: 'Planned Duration',
    day_trip: 'Day Trip',
    overnight: 'Overnight Stay',
    elevationGain: 'Preferred Elevation Gain',
    elevLow: 'Gentle (<500m)',
    elevMid: 'Standard (500m-1000m)',
    elevHigh: 'Challenging (>1000m)',
    transit: 'Transportation',
    transitPublic: 'Trains & Buses',
    transitCar: 'Personal Car',
    cableCarTitle: 'Cable Car / Ropeway',
    cableCarPrefer: 'Prefer Ropeway',
    cableCarAvoid: 'Prefer Hiking',
    cableCarAny: 'Either is Fine',
    priority: 'What do you value most?',
    priorityScenery: 'Stunning Scenery',
    priorityAchievement: 'Sense of Achievement',
    season: 'Climbing Season',
    analyze: 'Search Best Routes',
    loading: 'Preparing hot mountain info...',
    loadingSub: 'Potatoes are scouting the trails for you!',
    resultsTitle: 'Your Recommended Peaks',
    resultsSub: 'Best routes starting from',
    restart: 'Find Another Peak',
    beginnerTitle: 'Start Here: Recommended for You ✨',
    nextStepTitle: 'Level Up: Challenge Routes 🏔️',
    safetyTitle: 'Safety Tips',
    safetyDesc: 'Mountain weather changes fast! Submit a hiking plan, carry enough gear, and stay hydrated. Enjoy at your own pace.',
    low: 'Active Beginner',
    mid: 'Good Fitness',
    high: 'Mountain Pro',
    expNone: 'Never climbed',
    expSome: 'Climbed a few times',
    expFreq: 'Frequent climber',
    estTime: 'Estimated Time',
    elevGainActual: 'Total Elevation Gain',
    mandatory: 'Mandatory Gear',
    access: 'Access Method',
    reason: 'Why we recommend',
    packingList: 'Packing Checklist',
    checklistTitle: 'Are you prepared?',
    spring: 'Spring',
    summer: 'Summer',
    autumn: 'Autumn',
    winter: 'Winter',
    importantNote: '*Beginners should pay extra attention to these!',
    rank: 'Your Potato Rank',
    rankDesc: 'View rank details',
    rank1: 'Dormant Seed Potato (Lv.1)',
    rank2: 'Sprouting Potato (Lv.2)',
    rank3: 'Two-Leaf Potato (Lv.3)',
    rank4: 'Tiny Potato (Lv.4)',
    rank5: 'Fluffy Potato (Lv.5)',
    rank6: 'Trail-Walking Potato (Lv.6)',
    rank7: 'Mountaineer Potato (Lv.7)',
    rank8: 'Explorer Potato (Lv.8)',
    rank9: 'Potato Master (Lv.9)',
    rank10: 'Mountain King Potato (Lv.10)',
    libraryTitle: 'Potepote Farm',
    librarySub: 'The world of discovered potatoes',
    knowledgeTitle: 'Potato Hiking Tips',
    knowledgeSub: 'Helpful hints tailored to your level!',
    close: 'Close'
  }
};

const SeasonalNature = ({ type, season }: { type: 'flower' | 'grass', season: Season }) => {
  if (type === 'grass') {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full text-mountain-lime fill-current opacity-40">
        <path d="M4 20C4 20 6 12 12 12C18 12 20 20 20 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 20C8 20 9 15 12 15C15 15 16 20 16 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  // Flowers based on season
  const colors = {
    spring: { petal: '#FFB7C5', center: '#FFF59D' }, // Sakura/Pink
    summer: { petal: '#FDD835', center: '#795548' }, // Sunflower
    autumn: { petal: '#FB8C00', center: '#BF360C' }, // Cosmos/Orange
    winter: { petal: '#E3F2FD', center: '#90CAF9' }, // Snowdrop/Ice
  }[season];

  return (
    <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-sm">
      <circle cx="12" cy="12" r="3" fill={colors.center} />
      <circle cx="12" cy="6" r="4" fill={colors.petal} />
      <circle cx="12" cy="18" r="4" fill={colors.petal} />
      <circle cx="6" cy="12" r="4" fill={colors.petal} />
      <circle cx="18" cy="12" r="4" fill={colors.petal} />
    </svg>
  );
};

const FarmHouse = () => (
  <div className="relative w-12 h-12 flex flex-col items-center">
    {/* Roof */}
    <div 
      className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[20px] border-b-[#D32F2F]"
      style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))' }}
    />
    {/* Body */}
    <div className="w-10 h-8 bg-[#FFF9C4] border-x border-b border-[#795548]/20 flex items-end justify-center pb-1 shadow-sm">
      <div className="w-3 h-4 bg-[#795548] rounded-t-sm" /> {/* Door */}
    </div>
    {/* Window */}
    <div className="absolute top-6 left-2 w-2 h-2 bg-[#81D4FA] border border-white/40" />
    <div className="absolute top-6 right-2 w-2 h-2 bg-[#81D4FA] border border-white/40" />
  </div>
);

const VisualFarm = ({ difficulty, lang }: { difficulty?: string, lang: Language }) => {
  const currentSeason = useMemo(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }, []);

  const [farmName, setFarmName] = useState(() => {
    return lang === 'ja' ? 'わたしのポテト農場' : 'My Potato Patch';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(farmName);

  const t = {
    ja: {
      beginner: { title: 'かけだし農場', desc: '土の中でスヤスヤ... 種いもを植えたよ！' },
      intermediate: { title: 'すくすく農場', desc: 'ホクホク！元気な芽が出てきたよ！' },
      advanced: { title: 'ぴかぴか農場', desc: '大収穫！レアなポテトが育ったよ！' },
      fuji: { title: '伝説の黄金農場', desc: '伝説！黄金のポテトが降臨したよ！' },
      default: { title: 'はじまりの農場', desc: '登山してポテトを育てよう！' },
      editHint: 'クリックして名前を変更'
    },
    en: {
      beginner: { title: 'Sprout Farm', desc: 'Sleeping in the soil... Seed potatoes planted!' },
      intermediate: { title: 'Growing Farm', desc: 'Sprouting! Fresh buds are coming up!' },
      advanced: { title: 'Golden Farm', desc: 'Bumper crop! Rare potatoes have grown!' },
      fuji: { title: 'Legendary Farm', desc: 'Legendary! Golden potatoes have descended!' },
      default: { title: 'Newbie Farm', desc: 'Go hiking to grow potatoes!' },
      editHint: 'Click to rename'
    }
  }[lang];

  const getFarmContent = () => {
    switch (difficulty) {
      case 'beginner':
        return {
          title: t.beginner.title,
          desc: t.beginner.desc,
          potatoes: ['🥔', '🥔', '🥔'],
          bg: 'bg-[#E8F5E9]',
          soil: 'bg-[#A1887F]'
        };
      case 'intermediate':
        return {
          title: t.intermediate.title,
          desc: t.intermediate.desc,
          potatoes: ['🌱', '🌱', '🌱'],
          bg: 'bg-[#C8E6C9]',
          soil: 'bg-[#8D6E63]'
        };
      case 'advanced':
        return {
          title: t.advanced.title,
          desc: t.advanced.desc,
          potatoes: ['🥔', '✨', '🥔'],
          bg: 'bg-[#FFF9C4]',
          soil: 'bg-[#795548]'
        };
      case 'fuji':
        return {
          title: t.fuji.title,
          desc: t.fuji.desc,
          potatoes: ['🌟', '🏆', '🌟'],
          bg: 'bg-[#FFECB3]',
          soil: 'bg-[#5D4037]'
        };
      default:
        return {
          title: t.default.title,
          desc: t.default.desc,
          potatoes: ['🕳️', '🕳️', '🕳️'],
          bg: 'bg-[#F5F5F5]',
          soil: 'bg-[#D7CCC8]'
        };
    }
  };

  const content = getFarmContent();

  const handleNameSave = () => {
    setFarmName(tempName || farmName);
    setIsEditing(false);
  };

  return (
    <div className={`mb-12 rounded-[2.5rem] ${content.bg} border-4 border-white shadow-xl text-center relative overflow-hidden p-6 pt-12 transition-colors duration-700`}>
      {/* Sky/Clouds decoration */}
      <div className="absolute top-4 left-4 flex gap-2 opacity-30">
        <div className="w-8 h-4 bg-white rounded-full shadow-sm" />
        <div className="w-6 h-3 bg-white rounded-full mt-2 shadow-sm" />
      </div>
      
      {/* Small Farm House */}
      <div className="absolute top-2 right-4 opacity-90 scale-75 md:scale-100">
        <FarmHouse />
      </div>

      {/* Farm Name Sign (Editable) */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-40">
        {isEditing ? (
          <div className="flex gap-1 items-center bg-white p-1 rounded-full shadow-lg border-2 border-[#795548]">
            <input 
              autoFocus
              className="px-3 py-0.5 text-xs font-bold text-mountain-primary outline-none min-w-[120px]"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              onBlur={handleNameSave}
            />
          </div>
        ) : (
          <button 
            onClick={() => { setIsEditing(true); setTempName(farmName); }}
            className="group relative bg-[#795548] px-6 py-1 rounded-b-xl border-x-2 border-b-2 border-white shadow-md transition-transform hover:scale-105"
          >
            <p className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap">{farmName}</p>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-[8px] px-2 py-0.5 rounded-full pointer-events-none whitespace-nowrap">
              {t.editHint}
            </div>
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <h3 className="text-lg font-cute text-mountain-primary font-bold mb-8 relative z-10">{content.title}</h3>
        
        {/* Farm Field with structured mounds */}
        <div className="relative mx-auto w-[92%] h-32">
          {/* Back Fence with Flowers */}
          <div className="absolute -top-4 left-0 right-0 flex justify-between px-2 h-8 items-end pointer-events-none opacity-90 z-10">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="relative w-1 h-full bg-[#8D6E63] rounded-t-full border-x border-t border-black/10">
                {(i % 3 === 0 || i % 4 === 1) && (
                  <div className={`absolute ${i % 3 === 0 ? '-top-4 -left-2' : '-top-3 -right-2'} w-4 h-4`}>
                    <SeasonalNature type="flower" season={currentSeason} />
                  </div>
                )}
              </div>
            ))}
            <div className="absolute bottom-1 left-0 right-0 h-1 bg-[#8D6E63] border-y border-black/10 shadow-sm" />
          </div>

          {/* Grid of Planting Mounds */}
          <div className="w-full h-full flex items-end justify-around pb-2 px-2 relative z-20">
            {content.potatoes.map((p, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {/* Potato/Sprout */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2, type: 'spring', damping: 12 }}
                  className="z-30 mb-[-12px]"
                >
                  <div className="text-4xl filter drop-shadow-lg scale-110">{p}</div>
                </motion.div>
                
                {/* Mound of Soil */}
                <div className={`w-16 h-12 ${content.soil} rounded-[1rem] shadow-md border-b-4 border-black/20 flex flex-col items-center justify-end overflow-hidden`}>
                   <div className="w-full h-1/2 bg-black/5" />
                </div>
                
                {/* Shadow */}
                <div className="absolute -bottom-2 w-12 h-2 bg-black/10 rounded-full blur-[2px]" />
              </div>
            ))}
          </div>

          {/* Front Fence Decor */}
          <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-1 h-6 items-end pointer-events-none z-30 opacity-90">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="relative w-1.5 h-full bg-[#A1887F] rounded-t-full border-x border-t border-black/10">
                {i % 2 === 0 && <span className="absolute -bottom-1 -left-1 text-[8px]">🌿</span>}
              </div>
            ))}
            <div className="absolute bottom-1 left-0 right-0 h-1.5 bg-[#A1887F] border-y border-black/10 shadow-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-sm inline-block px-4 py-1 rounded-full border border-white/60 relative z-30">
        <p className="text-[9px] font-bold text-mountain-primary uppercase tracking-widest">{content.desc}</p>
      </div>

      {/* Decorative Grass/Flowers bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-5 flex justify-around items-end px-4 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {i % 5 === 0 && (
              <div className="w-3 h-3 mb-[-2px] rotate-12">
                <SeasonalNature type="flower" season={currentSeason} />
              </div>
            )}
            <div className="w-4 h-4 opacity-40">
              <SeasonalNature type="grass" season={currentSeason} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getRank = (exp: string, fitness: string) => {
  if (exp === 'none' && fitness === 'beginner') return 'rank1';
  if (exp === 'some' && fitness === 'beginner') return 'rank2';
  if (fitness === 'intermediate') return 'rank3';
  if (fitness === 'advanced' && exp === 'some') return 'rank4';
  if (fitness === 'advanced' && exp === 'experienced') return 'rank5';
  return 'rank2';
};

const getPackingList = (season: Season, difficulty: string, lang: Language): ChecklistItem[] => {
  const common = [
    { id: '1', name: lang === 'ja' ? 'ザック (20-30L)' : 'Backpack (20-30L)', isImportant: true, category: 'basic' as const },
    { id: '2', name: lang === 'ja' ? '登山靴' : 'Hiking Boots', isImportant: true, category: 'basic' as const },
    { id: '3', name: lang === 'ja' ? 'レインウェア (上下)' : 'Rainwear (Top/Bottom)', isImportant: true, category: 'clothing' as const },
    { id: '4', name: lang === 'ja' ? '地図・コンパス' : 'Maps & Compass', isImportant: true, category: 'safety' as const },
    { id: '5', name: lang === 'ja' ? '飲み物 (1L以上)' : 'Water (1L+)', isImportant: true, category: 'food' as const },
    { id: '6', name: lang === 'ja' ? '行動食 (チョコ・ナッツ等)' : 'Trail Mix/Energy Food', isImportant: false, category: 'food' as const },
  ];

  const seasonal: Record<Season, ChecklistItem[]> = {
    spring: [
      { id: 's1', name: lang === 'ja' ? '薄手の防寒着' : 'Light Insulation', isImportant: true, category: 'clothing' },
      { id: 's2', name: lang === 'ja' ? '日焼け止め' : 'Sunscreen', isImportant: false, category: 'safety' },
    ],
    summer: [
      { id: 'su1', name: lang === 'ja' ? '帽子 (つば広)' : 'Sun Hat', isImportant: true, category: 'clothing' },
      { id: 'su2', name: lang === 'ja' ? '虫除けスプレー' : 'Bug Spray', isImportant: false, category: 'safety' },
      { id: 'su3', name: lang === 'ja' ? '塩分タブレット' : 'Salt Tablets', isImportant: true, category: 'food' },
    ],
    autumn: [
      { id: 'a1', name: lang === 'ja' ? 'フリース・ダウン' : 'Fleece/Down Jacket', isImportant: true, category: 'clothing' },
      { id: 'a2', name: lang === 'ja' ? '手袋' : 'Gloves', isImportant: false, category: 'clothing' },
    ],
    winter: [
      { id: 'w1', name: lang === 'ja' ? 'アイゼン' : 'Crampons', isImportant: true, category: 'safety' },
      { id: 'w2', name: lang === 'ja' ? '厚手の防寒着' : 'Heavy Insulation', isImportant: true, category: 'clothing' },
      { id: 'w3', name: lang === 'ja' ? 'カイロ' : 'Hand Warmers', isImportant: false, category: 'safety' },
    ],
  };

  const diffItems: Record<string, ChecklistItem[]> = {
    intermediate: [
      { id: 'i1', name: lang === 'ja' ? 'トレッキングポール' : 'Trekking Poles', isImportant: false, category: 'basic' },
      { id: 'i2', name: lang === 'ja' ? 'ヘッドランプ' : 'Headlamp', isImportant: true, category: 'safety' },
    ],
    advanced: [
      { id: 'av1', name: lang === 'ja' ? 'ツエルト (簡易テント)' : 'Emergency Shelter (Zelt)', isImportant: true, category: 'safety' },
      { id: 'av2', name: lang === 'ja' ? '予備の電池' : 'Spare Batteries', isImportant: true, category: 'safety' },
    ],
    advance: [
      { id: 'adv1', name: lang === 'ja' ? 'ピッケル (雪山核心)' : 'Ice Axe', isImportant: true, category: 'advance' },
      { id: 'adv2', name: lang === 'ja' ? 'ヘルメット' : 'Climbing Helmet', isImportant: true, category: 'advance' },
      { id: 'adv3', name: lang === 'ja' ? '登山杖' : 'Trekking Poles (Advanced)', isImportant: false, category: 'advance' },
      { id: 'adv4', name: lang === 'ja' ? '12本爪アイゼン' : '12-point Crampons', isImportant: true, category: 'advance' },
    ]
  };

  const difficultyItems = difficulty === 'advanced' ? [...diffItems.advanced, ...diffItems.advance] : (difficulty === 'intermediate' ? diffItems.intermediate : []);
  return [...common, ...seasonal[season], ...difficultyItems];
};

export default function App() {
  const [plans, setPlans] = useState<ClimbingPlan[]>(MOCK_USER_STATS.plans || []);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [lang, setLang] = useState<Language>('ja');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [step, setStep] = useState<AppStep>('login');
  const [showRankDetails, setShowRankDetails] = useState(false);
  const [ownedGearIds, setOwnedGearIds] = useState<string[]>(MOCK_USER_STATS.ownedGearIds || []);

  const onAddPlanHandler = () => {
    setStep('create-plan');
  };

  const onClimbNowHandler = () => {
    setStep('tracking');
  };

  const onFinishTracking = (stats: { elevation: number; distance: number; time: number; potatoesFound: number }) => {
    // Add logic to update user stats/history if needed
    // For now, just return to home/profile
    setStep('farm');
    alert(lang === 'ja' 
      ? `登山お疲れ様でした！\n獲得標高: ${stats.elevation.toFixed(1)}m\n距離: ${stats.distance.toFixed(2)}km\nポテト: ${stats.potatoesFound}個獲得！`
      : `Congratulation on your climb!\nElevation: ${stats.elevation.toFixed(1)}m\nDistance: ${stats.distance.toFixed(2)}km\nPotatoes Found: ${stats.potatoesFound}`
    );
  };

  const onSavePlan = (plan: ClimbingPlan) => {
    setPlans([plan, ...plans]);
    setStep('profile');
  };

  const toggleGear = (id: string) => {
    setOwnedGearIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const isGearOwned = (gearName: string) => {
    const name = gearName.toLowerCase();
    return MOCK_GEAR.some(g => 
      ownedGearIds.includes(g.id) && 
      (gearName.includes(g.name) || g.name.includes(gearName) || 
       (g.category === 'shoes' && (name.includes('靴') || name.includes('シューズ') || name.includes('boots') || name.includes('shoes'))) ||
       (g.category === 'backpack' && (name.includes('ザック') || name.includes('リュック') || name.includes('パック') || name.includes('backpack') || name.includes('pack'))) ||
       (g.category === 'clothing' && (name.includes('衣') || name.includes('服') || name.includes('ジャケット') || name.includes('shell') || name.includes('layer') || name.includes('jacket')))
      )
    );
  };
  const [prefs, setPrefs] = useState<UserPreferences>({
    fitnessLevel: 'beginner',
    experience: 'none',
    frequency: 'first_time',
    elevationGainPref: 'low',
    transportation: 'public',
    region: '',
    duration: 'day_trip',
    cableCar: 'any',
    priority: 'scenery',
    language: 'ja',
    season: 'summer'
  });
  const [results, setResults] = useState<RecommendationResponse | null>(null);

  const t = translations[lang];

  useEffect(() => {
    document.body.setAttribute('data-lang', lang);
  }, [lang]);

  const currentRankKey = getRank(prefs.experience, prefs.fitnessLevel);
  const currentRank = t[currentRankKey as keyof typeof t];

  const startQuestionnaire = () => setStep('questionnaire');

  const handleSubmit = async () => {
    setStep('loading');
    try {
      const data = await getMountainRecommendations({ ...prefs, language: lang });
      setResults(data);
      setStep('results');
    } catch (error) {
      alert(lang === 'ja' ? 'エラーが発生しました。もう一度お試しください。' : 'An error occurred. Please try again.');
      setStep('questionnaire');
    }
  };

  const reset = () => {
    setStep('home');
    setResults(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setStep('farm'); 
  };

  const toggleLanguage = () => {
    const newLang = lang === 'ja' ? 'en' : 'ja';
    setLang(newLang);
  };

  const packingList = useMemo(() => 
    getPackingList(prefs.season, prefs.fitnessLevel, lang), 
  [prefs.season, prefs.fitnessLevel, lang]);

  return (
    <div className="min-h-screen selection:bg-mountain-primary selection:text-white text-mountain-text overflow-x-hidden pb-20">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {isLoggedIn && (step === 'results' || step === 'home' || step === 'questionnaire' || step === 'checklist') && (
          <button 
            onClick={() => setStep('checklist')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-mountain-accent/20 shadow-sm hover:shadow-md transition-all text-[10px] font-bold text-mountain-primary"
          >
            <ClipboardList className="w-3 h-3" />
            {t.packingList}
          </button>
        )}
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/60 backdrop-blur-md rounded-full border border-mountain-accent/20 shadow-sm hover:shadow-md transition-all text-[10px] font-bold text-mountain-primary"
        >
          <Languages className="w-3 h-3" />
          {lang === 'ja' ? 'EN' : 'JA'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <LoginScreen key="login" onLogin={handleLogin} lang={lang} />
        ) : (
          <React.Fragment key="app-content">
            {step === 'farm' && <FarmScreen key="farm" lang={lang} />}
            
            {step === 'collection' && (
              <motion.div 
                key="collection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="pb-32 px-6 pt-12 max-w-4xl mx-auto min-h-screen"
              >
                <header className="mb-6 text-center">
                  <h1 className="text-2xl font-cute text-mountain-primary font-bold">{t.libraryTitle}</h1>
                  <p className="text-[10px] text-mountain-accent font-bold tracking-widest uppercase">{t.librarySub}</p>
                </header>

                <VisualFarm difficulty={MOCK_USER_STATS.lastClimbDifficulty} lang={lang} />

                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  {MOCK_POTATOES.map((potato) => (
                    <motion.div
                      key={potato.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative bg-white rounded-2xl md:rounded-[2rem] p-3 md:p-6 border border-mountain-accent/10 shadow-sm overflow-hidden flex flex-col items-center text-center ${!potato.isUnlocked && 'grayscale opacity-40'}`}
                    >
                      <div className="w-10 h-10 md:w-20 md:h-20 bg-mountain-bg rounded-xl md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-5xl mb-2 md:mb-4">
                        {potato.isUnlocked ? '🥔' : '❔'}
                      </div>
                      
                      <div className="min-w-0 flex flex-col items-center">
                        <p className="text-[10px] md:text-xs font-bold text-mountain-accent uppercase tracking-tighter mb-0.5 md:mb-1 truncate w-full">
                          {potato.isUnlocked ? potato.region : '???'}
                        </p>
                        <h3 className="text-[11px] md:text-lg font-cute font-bold text-mountain-primary leading-tight truncate w-full">
                          {potato.isUnlocked ? potato.name : '???'}
                        </h3>
                        
                        <div className="flex gap-0.5 mt-1 md:mt-2">
                          {[...Array(potato.rarity)].map((_, i) => (
                            <Star key={i} className="w-2 h-2 md:w-3.5 md:h-3.5 fill-potato-yellow text-potato-yellow" />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'profile' && (
              <ProfileScreen 
                key="profile"
                lang={lang} 
                ownedGearIds={ownedGearIds} 
                toggleGear={toggleGear} 
                plans={plans}
                setPlans={setPlans}
                showPlanModal={showPlanModal}
                setShowPlanModal={setShowPlanModal}
              />
            )}

            {step === 'create-plan' && (
              <CreatePlanScreen 
                key="create-plan"
                lang={lang}
                onBack={() => setStep('profile')}
                onSave={onSavePlan}
              />
            )}

            {step === 'tracking' && (
              <TrackingScreen 
                key="tracking"
                lang={lang}
                onFinish={onFinishTracking}
                onCancel={() => setStep('farm')}
              />
            )}

            {step === 'home' && (
              <motion.div 
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://picsum.photos/seed/mountains/1920/1080?blur=4" 
                    alt="Mountain background" 
                    className="w-full h-full object-cover opacity-10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-mountain-bg" />
                </div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="z-10 flex flex-col items-center max-w-xl mx-auto"
                >
                  <p className="text-xl md:text-3xl text-mountain-primary max-w-xl mx-auto mb-4 leading-tight font-cute font-bold">
                    {t.subtitle}
                  </p>
                  <p className="text-sm md:text-base text-mountain-text/70 max-w-xl mx-auto mb-12 leading-relaxed font-cute">
                    {t.description}
                  </p>

                  <button 
                    onClick={startQuestionnaire}
                    className="group relative px-10 py-5 bg-potato-brown text-white rounded-full font-bold text-lg overflow-hidden shadow-2xl shadow-potato-brown/40 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center">
                      <span>{t.start}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </motion.div>
              </motion.div>
            )}

            {step === 'questionnaire' && (
          <motion.div 
            key="questionnaire"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="max-w-2xl mx-auto py-20 px-6"
          >
            <div className="bg-[#E9EDC9] rounded-[2.5rem] p-8 md:p-12 border border-[#CCD5AE] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Bean className="w-32 h-32 text-potato-brown rotate-12" />
              </div>
              
              <h2 className="text-xl md:text-3xl text-mountain-primary mb-12 leading-tight font-cute text-balance pt-4">
                {t.surveyTitle}
              </h2>

              <div className="space-y-12 text-mountain-text">
                <section>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-mountain-primary" />
                    {t.season}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['spring', 'summer', 'autumn', 'winter'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setPrefs({ ...prefs, season: s })}
                        className={`px-3 py-3 rounded-xl border-2 transition-all font-bold text-xs flex flex-col items-center gap-2 ${
                          prefs.season === s 
                          ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                          : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                        }`}
                      >
                         {s === 'spring' && <Leaf className="w-5 h-5 text-green-500" />}
                         {s === 'summer' && <Sun className="w-5 h-5 text-orange-500" />}
                         {s === 'autumn' && <CloudSun className="w-5 h-5 text-amber-600" />}
                         {s === 'winter' && <Snowflake className="w-5 h-5 text-blue-400" />}
                         {t[s]}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-mountain-red" />
                    {t.fitness}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setPrefs({ ...prefs, fitnessLevel: level })}
                        className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                          prefs.fitnessLevel === level 
                          ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                          : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                        }`}
                      >
                        {level === 'beginner' ? t.low : level === 'intermediate' ? t.mid : t.high}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                    <History className="w-4 h-4 text-mountain-primary" />
                    {t.experience}
                  </label>
                  <div className="grid grid-cols-1 gap-4">
                    {(['none', 'some', 'experienced'] as const).map((exp) => (
                      <button
                        key={exp}
                        onClick={() => setPrefs({ ...prefs, experience: exp })}
                        className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs text-left flex items-center justify-between ${
                          prefs.experience === exp 
                          ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                          : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                        }`}
                      >
                        <span>{exp === 'none' ? t.experienceNone : exp === 'some' ? t.experienceSmall : t.experienceHigh}</span>
                        {prefs.experience === exp && <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-mountain-primary" />
                    {t.frequency}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['first_time', 'few_times_year', 'monthly', 'weekly'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setPrefs({ ...prefs, frequency: f })}
                        className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                          prefs.frequency === f 
                          ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                          : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                        }`}
                      >
                        {f === 'first_time' ? t.freqFirst : f === 'few_times_year' ? t.freqFew : f === 'monthly' ? t.freqMonth : t.freqWeek}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-mountain-red" />
                    {t.region}
                  </label>
                  <select
                    value={prefs.region}
                    onChange={(e) => setPrefs({ ...prefs, region: e.target.value })}
                    className={`w-full px-4 py-3 bg-white/70 border-2 border-white/50 rounded-xl focus:border-mountain-primary focus:bg-white focus:outline-none transition-all text-sm font-medium appearance-none ${!prefs.region ? 'text-mountain-accent' : 'text-mountain-text'}`}
                  >
                    <option value="" disabled>{t.regionPlaceholder}</option>
                    {lang === 'ja' ? (
                      [
                        '東京都', '大阪府', '京都府', '北海道', '神奈川県', '愛知県', '千葉県', '埼玉県', '兵庫県', '福岡県',
                        '静岡県', '茨城県', '広島県', '宮城県', '新潟県', '長野県', '栃木県', '群马県', '岡山県', '岐阜県',
                        '三重県', '滋賀県', '熊本県', '鹿児島県', '奈良県', '長崎県', '愛媛県', '青森県', '岩手県', '大分県',
                        '石川県', '山口県', '福島県', '秋田県', '山梨県', '富山県', '和歌山県', '福井県', '香川県', '德島県',
                        '高知県', '佐賀県', '島根県', '鳥取県', '宫崎县', '沖縄県', '山形県'
                      ].map(p => <option key={p} value={p}>{p}</option>)
                    ) : (
                      PREFECTURES_EN.map(p => <option key={p} value={p}>{p}</option>)
                    )}
                  </select>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <section>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-mountain-primary" />
                      {t.elevationGain}
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      {(['low', 'moderate', 'high'] as const).map((elev) => (
                        <button
                          key={elev}
                          onClick={() => setPrefs({ ...prefs, elevationGainPref: elev })}
                          className={`px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                            prefs.elevationGainPref === elev 
                            ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                            : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                          }`}
                        >
                          {elev === 'low' ? t.elevLow : elev === 'moderate' ? t.elevMid : t.elevHigh}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-mountain-primary" />
                      {t.transit}
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      {(['public', 'car'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setPrefs({ ...prefs, transportation: mode })}
                          className={`px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                            prefs.transportation === mode 
                            ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                            : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                          }`}
                        >
                          {mode === 'public' ? t.transitPublic : t.transitCar}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <section>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-mountain-primary" />
                      {t.duration}
                    </label>
                    <div className="flex gap-4">
                      {(['day_trip', 'overnight'] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setPrefs({ ...prefs, duration: d })}
                          className={`flex-1 px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                            prefs.duration === d 
                            ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                            : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                          }`}
                        >
                          {d === 'day_trip' ? t.day_trip : t.overnight}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                      <TrainFront className="w-4 h-4 text-mountain-primary" />
                      {t.cableCarTitle}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {(['prefer', 'avoid', 'any'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setPrefs({ ...prefs, cableCar: opt })}
                          className={`px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm text-left flex items-center justify-between ${
                            prefs.cableCar === opt 
                            ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                            : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                          }`}
                        >
                          <span>
                            {opt === 'prefer' ? (t as any).cableCarPrefer : 
                             opt === 'avoid' ? (t as any).cableCarAvoid : 
                             (t as any).cableCarAny}
                          </span>
                          {prefs.cableCar === opt && <div className="w-2 h-2 bg-mountain-primary rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <section>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mountain-accent mb-6 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-mountain-primary" />
                    {t.priority}
                  </label>
                  <div className="flex gap-4">
                    {(['scenery', 'achievement'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPrefs({ ...prefs, priority: p })}
                        className={`flex-1 px-6 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm ${
                          prefs.priority === p 
                          ? 'border-mountain-primary bg-white text-mountain-primary shadow-lg shadow-mountain-primary/5' 
                          : 'border-white/50 bg-white/30 hover:border-mountain-primary/30 text-mountain-text/60'
                        }`}
                      >
                        {p === 'scenery' ? <><Eye className="w-6 h-6" /> {t.priorityScenery}</> : <><Trophy className="w-6 h-6" /> {t.priorityAchievement}</>}
                      </button>
                    ))}
                  </div>
                </section>

                <div className="pt-12">
                  <button 
                    onClick={handleSubmit}
                    disabled={!prefs.region}
                    className="w-full py-4 bg-potato-brown text-white rounded-xl font-bold text-base shadow-xl shadow-potato-brown/30 hover:shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t.analyze}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-36 h-36 border-4 border-dashed border-mountain-accent rounded-full"
              />
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Bean className="w-16 h-16 text-potato-brown" />
              </motion.div>
            </div>
            <h2 className="text-xl md:text-4xl font-cute mb-4 text-mountain-primary leading-tight px-4 text-balance">{t.loading}</h2>
            <p className="text-[10px] md:text-base text-mountain-accent font-bold animate-pulse tracking-wide font-cute px-6 text-balance">{t.loadingSub}</p>
          </motion.div>
        )}

        {step === 'results' && results && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto py-20 px-6"
          >
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-mountain-accent/20 pb-12">
              <div>
                <h1 className="text-3xl md:text-5xl font-cute text-mountain-primary mb-4 tracking-tight text-balance">{t.resultsTitle}</h1>
                <div className="flex gap-3">
                  <div className="bg-white rounded-full px-5 py-2 border border-mountain-accent/50 flex items-center gap-2 shadow-sm font-cute max-w-full">
                    <Bean className="w-4 h-4 text-potato-brown animate-bounce shrink-0" />
                    <span className="text-xs md:text-sm font-bold text-mountain-primary truncate">{prefs.region}{t.resultsSub}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={reset}
                className="flex items-center gap-2 group px-6 py-3 bg-white border border-mountain-accent/30 rounded-2xl text-mountain-accent hover:text-mountain-primary hover:border-mountain-primary transition-all text-sm font-bold shadow-sm"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> {t.restart}
              </button>
            </header>

            <div className="mb-24 px-8 py-12 bg-white rounded-[2.5rem] border border-mountain-accent/20 shadow-sm">
              <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-mountain-primary">
                <div className="w-10 h-10 bg-mountain-primary rounded-xl flex items-center justify-center text-white text-sm font-bold">01</div>
                {t.beginnerTitle}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {results.recommendations.map((route, i) => (
                  <MountainCard key={i} route={route} t={t} isGearOwned={isGearOwned} />
                ))}
              </div>
            </div>

            <div className="px-8 py-12 bg-[#F0F2E8] rounded-[2.5rem] border border-mountain-accent/10 shadow-sm">
              <div className="flex justify-between items-end mb-10">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-mountain-primary">
                  <div className="w-10 h-10 bg-mountain-red rounded-xl flex items-center justify-center text-white text-sm font-bold tracking-widest">02</div>
                  {t.nextStepTitle}
                </h2>
                <span className="text-[10px] bg-mountain-red text-white font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Advanced Path</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {results.nextSteps.map((route, i) => (
                  <MountainCard key={i} route={route} variant="red" t={t} isGearOwned={isGearOwned} />
                ))}
              </div>
            </div>

            <footer className="mt-32 p-12 bg-white rounded-[2.5rem] border border-mountain-accent/20 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mountain-accent via-mountain-primary to-mountain-accent" />
              <Award className="w-16 h-16 text-mountain-accent/40 mx-auto mb-6" />
              <h3 className="text-3xl font-cute mb-4 text-mountain-primary leading-tight">{t.safetyTitle}</h3>
              <p className="text-mountain-text/70 max-w-2xl mx-auto leading-relaxed font-medium">
                {t.safetyDesc}
              </p>
            </footer>
          </motion.div>
        )}

        {step === 'checklist' && (
          <motion.div 
            key="checklist"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-mountain-primary/40 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-mountain-accent/20">
              <div className="px-8 py-6 bg-mountain-bg border-b border-mountain-accent/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-mountain-primary rounded-2xl text-white">
                      <Bean className="w-6 h-6 text-potato-yellow" />
                   </div>
                   <div>
                     <h2 className="text-2xl md:text-3xl font-cute text-mountain-primary">{t.checklistTitle}</h2>
                     <p className="text-[9px] text-mountain-accent font-bold uppercase tracking-widest leading-none mt-1">Season: {t[prefs.season]} • Level: {t[prefs.fitnessLevel]}</p>
                   </div>
                </div>
                <button 
                   onClick={() => setStep('home')}
                  className="p-2 hover:bg-mountain-accent/10 rounded-full transition-colors text-mountain-accent"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                {/* Checklist Section */}
                {prefs.fitnessLevel === 'beginner' && (
                  <div className="p-4 bg-mountain-red/10 border border-mountain-red/20 rounded-2xl flex gap-3 text-mountain-red">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-[11px] font-bold italic leading-tight">{t.importantNote}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {['basic', 'clothing', 'food', 'safety', 'advance'].map((cat) => (
                    <div key={cat} className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-mountain-accent border-l-4 border-mountain-primary pl-3 mb-4">
                        {cat === 'advance' ? (lang === 'ja' ? '本格装備' : 'Technical Gear') : cat}
                      </h3>
                      <div className="space-y-3">
                        {packingList.filter(item => item.category === cat).map(item => {
                          const owned = isGearOwned(item.name);
                          return (
                            <motion.div 
                              key={item.id} 
                              whileHover={{ x: 4 }}
                              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                owned 
                                ? 'bg-mountain-lime/5 border-mountain-lime/20 shadow-sm opacity-80' 
                                : item.isImportant && prefs.fitnessLevel === 'beginner' 
                                  ? 'bg-mountain-red/5 border-mountain-red/10 shadow-sm ring-1 ring-mountain-red/10 animate-pulse-slow' 
                                  : 'bg-white/40 border-mountain-accent/5'
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                                  owned ? 'bg-mountain-lime text-white' : 'bg-mountain-bg border-2 border-mountain-accent/20'
                                }`}>
                                  {owned ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1 h-1 bg-mountain-accent/20 rounded-full" />}
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-sm font-bold ${owned ? 'text-mountain-lime/80 line-through' : 'text-mountain-primary'}`}>
                                    {item.name}
                                  </span>
                                  {!owned && (
                                    <span className="text-[10px] text-mountain-accent/60 font-medium">
                                      {item.isImportant ? (lang === 'ja' ? '準備推奨' : 'Highly Recommended') : (lang === 'ja' ? 'あると便利' : 'Optional')}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {owned ? (
                                  <span className="text-[9px] font-black text-mountain-lime uppercase tracking-tighter bg-mountain-lime/10 px-2 py-0.5 rounded-full">Owned</span>
                                ) : (
                                  <button 
                                    onClick={() => window.open(`https://www.google.com/search?q=登山用品+${item.name}`, '_blank')}
                                    className="p-2 hover:bg-mountain-primary/10 rounded-xl transition-colors text-mountain-accent group"
                                    title={lang === 'ja' ? '購入・詳細を検索' : 'Find / Shop'}
                                  >
                                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                        {packingList.filter(item => item.category === cat).length === 0 && (
                          <p className="text-[10px] text-mountain-accent italic opacity-60 pl-4">— Not required for this level —</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-mountain-bg border-t border-mountain-accent/20 shrink-0">
                <button 
                  onClick={() => setStep('home')}
                  className="w-full py-4 bg-mountain-primary text-white font-bold rounded-2xl shadow-lg shadow-mountain-primary/20 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {isLoggedIn && showRankDetails && (
          <motion.div 
            key="rank-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-mountain-primary/40 backdrop-blur-md"
            onClick={() => setShowRankDetails(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 border border-mountain-accent/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-cute text-mountain-primary">{t.rank}</h2>
                <button onClick={() => setShowRankDetails(false)} className="p-2 hover:bg-mountain-bg rounded-full transition-colors">
                  <X className="w-5 h-5 text-mountain-accent" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
                {(['rank1', 'rank2', 'rank3', 'rank4', 'rank5', 'rank6', 'rank7', 'rank8', 'rank9', 'rank10'] as const).map((r) => (
                  <div 
                    key={r}
                    className={`p-3 rounded-2xl flex items-center justify-between border-2 transition-all ${
                      currentRankKey === r 
                      ? 'border-mountain-primary bg-mountain-primary/5 shadow-inner' 
                      : 'border-mountain-bg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                        currentRankKey === r ? 'bg-mountain-primary text-white' : 'bg-mountain-bg text-mountain-accent'
                      }`}>
                        {r.replace('rank', '')}
                      </div>
                      <span className={`text-[13px] font-bold ${currentRankKey === r ? 'text-mountain-primary' : 'text-mountain-text/40'}`}>
                        {t[r as keyof typeof t]}
                      </span>
                    </div>
                    {currentRankKey === r && (
                      <span className="text-[9px] bg-mountain-primary text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter animate-pulse">Current</span>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowRankDetails(false)}
                className="w-full mt-8 py-4 bg-mountain-primary text-white font-bold rounded-2xl shadow-lg shadow-mountain-primary/20"
              >
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}
          </React.Fragment>
        )}
      </AnimatePresence>

      {isLoggedIn && (
        <BottomNav 
          currentStep={step} 
          onStepChange={setStep} 
          lang={lang} 
          onAddPlan={onAddPlanHandler} 
          onClimbNow={onClimbNowHandler}
        />
      )}
    </div>
  );
}

function MountainCard({ route, variant = 'green', t, isGearOwned }: { route: MountainRoute, variant?: 'green' | 'red', t: any, isGearOwned: (name: string) => boolean, key?: any }) {
  const bgSoft = variant === 'green' ? 'bg-[#95d5b2]' : 'bg-[#e76f51]';
  const borderClass = variant === 'green' ? 'hover:border-mountain-primary' : 'hover:border-mountain-red';
  
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`relative flex flex-col bg-white border border-mountain-accent/20 rounded-[2rem] overflow-hidden shadow-sm transition-all duration-300 ${borderClass}`}
    >
      <div className={`h-32 ${bgSoft} relative overflow-hidden flex flex-col items-center justify-center p-6 bg-opacity-80`}>
         <div className="absolute top-2 right-4 flex gap-1 bg-white/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
           {[...Array(5)].map((_, i) => (
             <Bean 
               key={i} 
               className={`w-3.5 h-3.5 ${i < route.difficultyLevel ? 'fill-potato-yellow text-potato-brown' : 'text-white/40'}`} 
             />
           ))}
         </div>
         <Mountain className="w-12 h-12 text-white/50 mb-2" />
         <div className="absolute bottom-4 left-6 flex items-center gap-2">
           <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-sm border border-white/50 italic bg-black/20`}>
             {route.difficulty}
           </span>
           <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-[9px] font-bold text-white border border-white/30">
             +{route.elevationGain}m
           </span>
         </div>
      </div>

      <div className="p-8 pt-6 flex-1 flex flex-col min-w-0 overflow-hidden">
        <h3 className="text-xl md:text-2xl font-cute mb-2 text-mountain-primary text-balance leading-tight truncate-multiline">{route.name}</h3>
        <p className="text-[10px] text-mountain-accent font-bold mb-4 flex items-center gap-1 uppercase tracking-widest overflow-hidden">
          <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{route.location} • {route.elevation}m</span>
        </p>
        
        <p className="text-sm text-mountain-text/70 mb-4 leading-relaxed font-medium line-clamp-3">
          {route.description}
        </p>

        <div className="mb-6 space-y-2 overflow-hidden">
           <p className="text-[9px] font-bold text-mountain-accent uppercase tracking-wider flex items-center gap-2">
             <AlertCircle className="w-3 h-3 shrink-0" /> {t.mandatory}
           </p>
           <div className="flex flex-wrap gap-1.5 max-w-full">
             {route.mandatoryGear.map((gear, i) => {
               const owned = isGearOwned(gear);
               return (
                 <span 
                   key={i} 
                   className={`text-[9px] px-2 py-0.5 rounded-md font-bold whitespace-normal break-words leading-tight border flex items-center gap-1 ${
                     owned 
                     ? 'bg-mountain-lime/20 text-mountain-lime border-mountain-lime/30' 
                     : 'bg-mountain-red/10 text-mountain-red border-mountain-red/5'
                   }`}
                 >
                   {owned && <CheckCircle2 className="w-2.5 h-2.5" />}
                   {gear}
                 </span>
               );
             })}
           </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-mountain-accent/10 mt-auto">
          <div className="flex items-start justify-between text-[10px] font-bold gap-4">
            <span className="text-mountain-accent flex items-center gap-1 shrink-0"><Clock className="w-3" /> {t.estTime}</span>
            <span className="text-mountain-primary text-right">{route.estimatedTime}</span>
          </div>

          <div className="flex items-start justify-between text-[10px] font-bold gap-4 overflow-hidden">
            <span className="text-mountain-accent flex items-center gap-1 shrink-0"><Compass className="w-3" /> {t.access}</span>
            <span className="text-mountain-primary text-right break-words leading-tight italic" title={route.transportAccess}>{route.transportAccess}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {route.features.slice(0, 3).map((f, i) => (
              <span key={i} className={`px-2 py-0.5 border border-mountain-accent/30 text-mountain-accent rounded-full text-[9px] font-bold uppercase tracking-wide`}>
                {f}
              </span>
            ))}
          </div>

          <div className="group pt-4">
            <p className="text-[9px] font-bold text-mountain-accent uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <Award className="w-3 h-3" /> {t.reason}
            </p>
            <p className="text-xs text-mountain-text/60 leading-relaxed font-cute italic">
              "{route.reason}"
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
