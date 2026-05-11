import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MapPin, Award, Info, X, Sprout, TrendingUp, Sun, Cloud, CloudRain, RotateCcw, Mountain, Book, ChevronRight, Wind, Zap, Users, Globe, Bean } from 'lucide-react';
import { Potato, Language } from '../types';
import { MOCK_POTATOES, MOCK_USER_STATS, MOCK_KNOWLEDGE, MOCK_GEAR } from '../mockData';

interface FarmScreenProps {
  lang: Language;
}

export const FarmScreen: React.FC<FarmScreenProps> = ({ lang }) => {
  const [selectedPotato, setSelectedPotato] = useState<Potato | null>(null);

  const difficultyColors = {
    lv1: 'text-mountain-lime bg-mountain-lime/10 border-mountain-lime/20',
    lv2: 'text-mountain-primary bg-mountain-primary/10 border-mountain-primary/20',
    lv3: 'text-mountain-red bg-mountain-red/10 border-mountain-red/20',
    lv4: 'text-potato-brown bg-potato-brown/10 border-potato-brown/20'
  };

  const mockRecommendations = [
    {
      name: { ja: '高尾山', en: 'Mt. Takao' },
      location: { ja: '東京都 八王子市', en: 'Hachioji, Tokyo' },
      weather: 'sunny',
      difficulty: 2,
      time: '3.5',
      reward: '5~8',
    },
    {
      name: { ja: '大山', en: 'Mt. Oyama' },
      location: { ja: '神奈川県 伊勢原市', en: 'Isehara, Kanagawa' },
      weather: 'cloudy',
      difficulty: 3,
      time: '4.5',
      reward: '8~12',
    },
    {
      name: { ja: '筑波山', en: 'Mt. Tsukuba' },
      location: { ja: '茨城県 つくば市', en: 'Tsukuba, Ibaraki' },
      weather: 'sunny',
      difficulty: 2,
      time: '3.0',
      reward: '4~7',
    },
    {
      name: { ja: '金時山', en: 'Mt. Kintoki' },
      location: { ja: '神奈川県 箱根町', en: 'Hakone, Kanagawa' },
      weather: 'sunny',
      difficulty: 2,
      time: '2.5',
      reward: '3~6',
    },
    {
      name: { ja: '三頭山', en: 'Mt. Mito' },
      location: { ja: '東京都 奥多摩町', en: 'Okutama, Tokyo' },
      weather: 'rainy',
      difficulty: 3,
      time: '5.0',
      reward: '10~15',
    }
  ];

  const [recommendIdx, setRecommendIdx] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRecommendation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRecommendIdx((prev) => (prev + 1) % mockRecommendations.length);
      setIsRefreshing(false);
    }, 600);
  };

  const currentRecommend = mockRecommendations[recommendIdx];

  const t = {
    ja: {
      farmTitle: 'ポテポテ農場',
      level: 'Lv.',
      potatoCount: '所持ポテト',
      nextLevel: 'あと {count} ポテトでLv.{next}',
      unlocked: '獲得済み',
      locked: '未開放',
      region: '獲得地',
      condition: '獲得条件',
      rarity: 'レア度',
      difficulty: '登山難易度',
      back: '閉じる',
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
      rankRegional: '地区ランキング',
      rankNational: '全国ランキング',
      dailyRecommend: '今日のオススメ登山',
      publicPlans: '現在公開中の登山計画',
      recommendForYou: 'あなたのレベルに対応',
      closeToYou: '現在地に近いエリア',
      refresh: '更新',
      weather: '天気',
      difficultyLevel: '難易度マッチ',
      climbTime: '推奨時間',
      reward: '獲得ポテト',
      recommendedForYou: 'あなたのランクに最適！',
      location: '場所',
      mechanics: '登山でポテトをゲット！',
      mechanicsList: [
        { label: '初級', value: '+1-5' },
        { label: '中級', value: '+6-15' },
        { label: '上級', value: '+16-30' },
        { label: '超級', value: '+31-50' },
      ],
      knowledgeTitle: 'ポテトの登山マメ知識',
      knowledgeSub: 'レベルに合わせて役立つヒントをお届け！',
      gearTitle: '現在の登山装備',
      gearSub: '持っている装備をチェックしよう！',
      lv1: '初級',
      lv2: '中級',
      lv3: '上級',
      lv4: '超級'
    },
    en: {
      farmTitle: 'Potepote Farm',
      level: 'Lv.',
      potatoCount: 'Potatoes Collected',
      nextLevel: '{count} more for Lv.{next}',
      unlocked: 'Unlocked',
      locked: 'Locked',
      region: 'Region',
      condition: 'Condition',
      rarity: 'Rarity',
      difficulty: 'Difficulty',
      back: 'Close',
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
      rankRegional: 'Regional Rank',
      rankNational: 'National Rank',
      dailyRecommend: 'Today\'s Recommendation',
      publicPlans: 'Current Public Plans',
      refresh: 'Refresh',
      weather: 'Weather',
      difficultyLevel: 'Level Match',
      climbTime: 'Recommended Time',
      reward: 'Potatoes',
      recommendedForYou: 'Perfect for your current rank!',
      location: 'Location',
      mechanics: 'Climb to Get Potatoes!',
      mechanicsList: [
        { label: 'Level 1', value: '+1-5' },
        { label: 'Level 2', value: '+6-15' },
        { label: 'Level 3', value: '+16-30' },
        { label: 'Level 4', value: '+31-50' },
      ],
      knowledgeTitle: 'Potato Hiking Tips',
      knowledgeSub: 'Helpful hints tailored to your level!',
      gearTitle: 'My Climbing Gear',
      gearSub: 'Check your equipment status!',
      lv1: 'Lv. 1',
      lv2: 'Lv. 2',
      lv3: 'Lv. 3',
      lv4: 'Lv. 4'
    }
  }[lang];

  const mockPublicPlans = [
    {
      id: 'pub1',
      mountainName: '陣馬山',
      date: '2026-05-15',
      userName: 'MountainGoat',
      difficulty: 2,
      location: '東京都 八王子市',
      matchReason: lang === 'ja' ? 'レベルが最適です' : 'Level Match'
    },
    {
      id: 'pub2',
      mountainName: '大山',
      date: '2026-05-16',
      userName: 'Imo-Hiker',
      difficulty: 3,
      location: '神奈川県 伊勢原市',
      matchReason: lang === 'ja' ? '現在地に近いエリア' : 'Near you'
    },
    {
      id: 'pub3',
      mountainName: '弘法山',
      date: '2026-05-17',
      userName: 'PotatoExpert',
      difficulty: 1,
      location: '神奈川県 秦野市',
      matchReason: lang === 'ja' ? '初級者にオススメ' : 'Recommended'
    }
  ];

  const ownedGear = MOCK_GEAR.filter(g => MOCK_USER_STATS.ownedGearIds?.includes(g.id));

  return (
    <div className="pb-32 px-6 pt-8 max-w-2xl mx-auto overflow-y-auto min-h-screen bg-mountain-bg/10">
      {/* App Header */}
      <div className="flex items-center justify-start gap-3 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative">
          <div className="w-10 h-10 bg-mountain-primary rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 p-0.5 bg-potato-yellow rounded-full shadow-md border border-white">
            <Bean className="w-3.5 h-3.5 text-potato-brown fill-potato-yellow" />
          </div>
        </div>
        <div className="relative group">
          <h1 className="text-xl font-cute font-bold text-mountain-primary tracking-tight relative z-10">
            {lang === 'ja' ? 'ポテポテ登山' : 'Potepote Climbing'}
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-2 bg-mountain-accent/10 -rotate-1 -z-0 blur-[1px] rounded-full" />
        </div>
      </div>

    {/* Public Climbing Plans Section */}
    <div className="mb-12 bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-mountain-primary text-white rounded-xl">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-cute font-bold text-mountain-primary uppercase tracking-tight">{(t as any).publicPlans}</h3>
          </div>
        </div>
        <Globe className="w-5 h-5 text-mountain-accent/30" />
      </div>

      <div className="space-y-4">
        {mockPublicPlans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/80 p-4 rounded-3xl border border-white shadow-sm flex items-center gap-4 group hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-mountain-bg rounded-2xl flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-110 transition-transform">
               🏔️
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-sm font-bold text-mountain-primary">{plan.mountainName}</h4>
                <span className="text-[7px] font-black bg-mountain-lime/20 text-mountain-lime px-1.5 py-0.5 rounded uppercase tracking-tighter">
                  {plan.matchReason}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-mountain-text/60 font-bold">
                 <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {plan.location}</span>
                 <span className="flex items-center gap-1 opacity-70">👤 {plan.userName}</span>
              </div>
            </div>
            <div className="text-right">
               <div className="flex gap-0.5 mb-1 group-hover:scale-110 transition-transform">
                  {[...Array(plan.difficulty)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-mountain-primary text-mountain-primary" />)}
               </div>
               <p className="text-[9px] font-black text-mountain-accent uppercase tracking-tighter">{plan.date.split('-').slice(1).join('/')}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-[10px] font-bold text-mountain-primary flex items-center gap-1 mx-auto hover:underline uppercase tracking-widest">
          {lang === 'ja' ? 'すべての公開計画を見る' : 'View all public plans'} <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

      {/* Daily Recommendation */}
      <div className="mb-12 bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mountain-primary/10 rounded-xl">
              <Mountain className="w-5 h-5 text-mountain-primary" />
            </div>
            <h3 className="text-xl font-cute text-mountain-primary font-bold uppercase tracking-tight">{(t as any).dailyRecommend}</h3>
          </div>
          <motion.button
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={refreshRecommendation}
            disabled={isRefreshing}
            className="p-2 text-mountain-accent hover:text-mountain-primary transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        <motion.div 
          key={recommendIdx}
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className="bg-white/80 rounded-[1.5rem] p-6 shadow-sm border border-mountain-accent/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-mountain-primary/5 rounded-full -mr-16 -mt-16" />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-1">{(t as any).location}</span>
                <h4 className="text-2xl font-cute text-mountain-primary font-bold break-words">{currentRecommend.name[lang as 'ja' | 'en']}</h4>
                <p className="text-xs text-mountain-text/60 font-bold flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 flex-shrink-0" /> {currentRecommend.location[lang as 'ja' | 'en']}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${
                  currentRecommend.weather === 'sunny' ? 'bg-mountain-lime/20 text-mountain-lime' :
                  currentRecommend.weather === 'cloudy' ? 'bg-gray-100 text-gray-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  {currentRecommend.weather === 'sunny' ? <Sun className="w-3 h-3" /> :
                   currentRecommend.weather === 'cloudy' ? <Cloud className="w-3 h-3" /> :
                    <CloudRain className="w-3 h-3" />}
                  {currentRecommend.weather === 'sunny' ? (lang === 'ja' ? '晴れ' : 'Sunny') :
                   currentRecommend.weather === 'cloudy' ? (lang === 'ja' ? '曇り' : 'Cloudy') :
                    (lang === 'ja' ? '雨' : 'Rainy')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-mountain-bg/50 p-3 rounded-2xl border border-mountain-accent/5">
                <div className="flex gap-1 mb-1">
                  {[...Array(currentRecommend.difficulty)].map((_, i) => <Star key={i} className="w-3 h-3 fill-mountain-primary text-mountain-primary" />)}
                  {[...Array(5 - currentRecommend.difficulty)].map((_, i) => <Star key={i} className="w-3 h-3 text-mountain-accent/20" />)}
                </div>
                <p className="text-[9px] font-bold text-mountain-accent uppercase tracking-tighter">{(t as any).difficultyLevel}</p>
              </div>
              <div className="bg-mountain-bg/50 p-3 rounded-2xl border border-mountain-accent/5">
                <p className="text-xs font-bold text-mountain-primary mb-1">
                  {lang === 'ja' ? `${currentRecommend.time} 時間` : `${currentRecommend.time} hrs`}
                </p>
                <p className="text-[9px] font-bold text-mountain-accent uppercase tracking-widest tracking-tighter">{(t as any).climbTime}</p>
              </div>
            </div>

            <div className="p-3 bg-mountain-primary/5 rounded-2xl border border-mountain-primary/10 flex items-center gap-3">
              <div className="p-2 bg-mountain-primary rounded-xl flex-shrink-0">
                <Award className="w-4 h-4 text-white" />
              </div>
              <p className="text-[11px] font-bold text-mountain-primary leading-tight">
                {(t as any).recommendedForYou}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Climbing Knowledge */}
      <div className="mb-12 bg-white/70 backdrop-blur-md rounded-[2rem] p-6 border border-white shadow-xl">
        <div className="flex flex-col gap-2 mb-8">
          <h3 className="text-xl font-cute font-bold flex items-center gap-3 text-mountain-primary uppercase tracking-tight">
            <div className="w-8 h-8 bg-potato-brown rounded-lg flex items-center justify-center text-white shadow-sm">
              <Book className="w-4 h-4" />
            </div>
            {(t as any).knowledgeTitle}
          </h3>
          <p className="text-[9px] text-mountain-accent font-bold uppercase tracking-widest pl-11">{(t as any).knowledgeSub}</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {MOCK_KNOWLEDGE.filter(k => k.level <= MOCK_USER_STATS.level).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-4 bg-white/50 rounded-2xl border border-mountain-accent/5 hover:border-mountain-primary/20 transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm border border-mountain-accent/10 grow-0 shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] font-black bg-mountain-primary text-white px-1.5 py-0.5 rounded uppercase tracking-tighter">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-mountain-primary">{item.title}</h4>
                </div>
                <p className="text-[10px] text-mountain-text/70 leading-relaxed font-medium">
                  {item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Potato Detail Modal */}
      <AnimatePresence>
        {selectedPotato && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPotato(null)}
              className="absolute inset-0 bg-mountain-primary/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-8 relative z-10 border border-white overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mountain-lime via-mountain-primary to-potato-brown" />
              
              <button 
                onClick={() => setSelectedPotato(null)}
                className="absolute top-6 right-6 p-2 hover:bg-mountain-bg rounded-full transition-colors"
               >
                <X className="w-6 h-6 text-mountain-accent" />
              </button>

              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-mountain-lime/10 rounded-full flex items-center justify-center text-6xl mb-6 shadow-inner ring-8 ring-mountain-lime/5">
                  {selectedPotato.isUnlocked ? '🥔' : '❔'}
                </div>
                
                <h3 className="text-3xl font-cute text-mountain-primary mb-2 font-bold">
                  {selectedPotato.isUnlocked ? selectedPotato.name : '???'}
                </h3>
                
                {selectedPotato.isUnlocked ? (
                  <div className="flex gap-1 mb-8">
                    {[...Array(selectedPotato.rarity)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-potato-yellow text-potato-yellow" />
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-1 bg-mountain-accent/10 rounded-full mb-8">
                    <p className="text-mountain-accent font-bold uppercase tracking-widest text-[10px]">{t.locked}</p>
                  </div>
                )}

                <div className="w-full space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-mountain-bg pb-3">
                    <span className="text-mountain-accent font-bold uppercase tracking-tighter text-[10px] flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {t.region}
                    </span>
                    <span className="font-bold text-mountain-primary">{selectedPotato.isUnlocked ? selectedPotato.region : '???'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-mountain-bg pb-3">
                    <span className="text-mountain-accent font-bold uppercase tracking-tighter text-[10px] flex items-center gap-2">
                      <Award className="w-3.5 h-3.5" /> {t.difficulty}
                    </span>
                    <span className="font-bold text-mountain-primary">{selectedPotato.isUnlocked ? selectedPotato.difficulty : '???'}</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    <span className="text-mountain-accent font-bold uppercase tracking-tighter text-[10px] flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" /> {t.condition}
                    </span>
                    <p className="text-sm font-medium text-mountain-text/80 leading-relaxed italic bg-mountain-bg/30 p-5 rounded-[1.5rem] border border-mountain-accent/10 text-center">
                       "{selectedPotato.unlockCondition}"
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedPotato(null)}
                  className="w-full mt-10 py-5 bg-mountain-primary text-white font-bold rounded-2xl shadow-xl shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {t.back}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
