import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  LogOut, 
  Mountain, 
  ArrowUpRight, 
  Award, 
  Users, 
  ChevronRight,
  Circle,
  X,
  Save,
  MapPin,
  Lock,
  Gift,
  Share2,
  Calendar,
  Clock,
  Plus,
  Globe,
  PlusCircle,
  Copy,
  Sprout,
  TrendingUp
} from 'lucide-react';
import { Language, ClimbingPlan } from '../types';
import { MOCK_USER_STATS, MOCK_FRIENDS, MOCK_GEAR } from '../mockData';

interface ProfileScreenProps {
  lang: Language;
  ownedGearIds: string[];
  toggleGear: (id: string) => void;
  plans: ClimbingPlan[];
  setPlans: React.Dispatch<React.SetStateAction<ClimbingPlan[]>>;
  showPlanModal: boolean;
  setShowPlanModal: (show: boolean) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  lang, 
  ownedGearIds, 
  toggleGear,
  plans,
  setPlans,
  showPlanModal,
  setShowPlanModal
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showGearChecklist, setShowGearChecklist] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'climbs' | 'elevation' | 'potatoes' | 'rarest' | 'leaderboard'>('none');
  const [leaderboardType, setLeaderboardType] = useState<'regional' | 'national'>('regional');
  const [leaderboardView, setLeaderboardView] = useState<'top' | 'near'>('top');
  const [nickname, setNickname] = useState(MOCK_USER_STATS.nickname);
  const [address, setAddress] = useState('東京都 港区');
  const [password, setPassword] = useState('********');

  const getDayOfWeek = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const days = lang === 'ja' ? ['日', '月', '火', '水', '木', '金', '土'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `(${days[date.getDay()]})`;
    } catch {
      return '';
    }
  };

  const difficultyColors = {
    lv1: 'text-mountain-lime bg-mountain-lime/10 border-mountain-lime/20',
    lv2: 'text-mountain-primary bg-mountain-primary/10 border-mountain-primary/20',
    lv3: 'text-mountain-red bg-mountain-red/10 border-mountain-red/20',
    lv4: 'text-potato-brown bg-potato-brown/10 border-potato-brown/20'
  };

  const t = {
    ja: {
      profile: 'プロフィール',
      gear: '保有装備一覧',
      editGear: '装備の編集',
      gearInventory: '自分の装備',
      allGear: 'すべての装備リスト',
      stats: '活動実績',
      climbs: '累計登山回数',
      elevation: '総獲得標高',
      potatoes: '獲得ポテト数',
      rarest: '最稀有種',
      recentHistory: '最近の登山履歴',
      fullHistory: 'これまでの全記録',
      historyTitle: '登山記録の詳細',
      historyDesc: 'これまでに登った山と獲得報酬',
      elevationTitle: '獲得標高の記録',
      elevationDesc: 'ピークごとの獲得標高詳細',
      potatoesTitle: 'ポテト収穫の記録',
      potatoesDesc: '山行ごとの収穫履歴',
      rarestTitle: 'レアポテト発見録',
      rarestDesc: '希少種の発見エピソード',
      leaderboardTitle: 'ランキング詳細',
      topRankers: 'トップランカー',
      nearYou: '周辺ランキング',
      rank: '順位',
      userName: 'ユーザー',
      score: 'ポテト数',
      date: '日付',
      distance: '距離',
      duration: 'タイム',
      settings: '設定',
      loginStatus: 'ログイン状況',
      loggedInAs: 'としてログイン中',
      logout: 'ログアウト',
      inviteFriends: '友達招待ボーナス',
      inviteDesc: '紹介1人で次回ポテト2倍！',
      groupDesc: 'パーティ登山でポテト1.5倍！',
      copyLink: 'リンクをコピー',
      editNickname: 'ニックネーム',
      editPassword: 'パスワード',
      editAddress: 'ホームエリア',
      save: '保存する',
      level: 'Lv.',
      times: '回',
      meters: 'm',
      rareSource: 'にて発見',
      plansTitle: '今後の登山計画',
      addPlan: '計画を追加',
      planTitle: '登山計画の作成',
      planMountain: '目的地',
      planDate: '日程',
      planLocation: '集合場所',
      planTime: '集合時間',
      planVisibility: '公開',
      planPublic: '公開する',
      planPrivate: '非公開',
      planNotes: 'ルート・メモ',
      planGear: '携行装備',
      planLevel: '推奨Lv',
      planInsurance: '登山保険',
      planInsuranceYes: '加入済み',
      planInsuranceNo: '未加入',
      planElevation: '予定獲得標高',
      planDistance: '予定距離',
      planPotatoes: '獲得予定ポテト数',
      copySuccess: '計画をコピーしました！',
      sharePlan: '共有',
      noPlans: '予定されている計画はありません'
    },
    en: {
      profile: 'Profile',
      gear: 'Equipment List',
      editGear: 'Edit Equipment',
      gearInventory: 'My Gear',
      allGear: 'All Gear List',
      stats: 'Stats',
      climbs: 'Total Climbs',
      elevation: 'Total Elevation',
      potatoes: 'Total Potatoes',
      rarest: 'Rarest Potato',
      recentHistory: 'Recent History',
      fullHistory: 'Full Climbing History',
      historyTitle: 'Climbing Details',
      historyDesc: 'Mountains climbed and rewards earned',
      elevationTitle: 'Elevation Records',
      elevationDesc: 'Gain details per peak',
      potatoesTitle: 'Potato Harvests',
      potatoesDesc: 'Earnings per journey',
      rarestTitle: 'Rare Potato Archive',
      rarestDesc: 'Discovery episodes of rare types',
      leaderboardTitle: 'Ranking Details',
      topRankers: 'Top Rankers',
      nearYou: 'Near You',
      rank: 'Rank',
      userName: 'User',
      score: 'Potatoes',
      date: 'Date',
      distance: 'Dist.',
      duration: 'Time',
      settings: 'Settings',
      loginStatus: 'Login Status',
      loggedInAs: 'Logged in as',
      logout: 'Log Out',
      inviteFriends: 'Invite Friends, Get Bonus!',
      inviteDesc: 'Refer a friend: Next trek 2x potatoes!',
      groupDesc: 'Hike with friends: 1.5x potatoes!',
      copyLink: 'Copy Invite Link',
      editNickname: 'Nickname',
      editPassword: 'Password',
      editAddress: 'Primary Region',
      save: 'Save Changes',
      level: 'Lv.',
      times: 'times',
      meters: 'm',
      rareSource: 'Found at',
      plansTitle: 'Climbing Plans',
      addPlan: 'Add Plan',
      planTitle: 'Create Climbing Plan',
      planMountain: 'Mountain',
      planDate: 'Date',
      planLocation: 'Meetup Location',
      planTime: 'Meetup Time',
      planVisibility: 'Visibility',
      planPublic: 'Public',
      planPrivate: 'Private',
      planNotes: 'General Notes / Course',
      planGear: 'Required Gear',
      planLevel: 'Req. Level',
      planInsurance: 'Mountain Insurance',
      planInsuranceYes: 'Insured',
      planInsuranceNo: 'Not Insured',
      planElevation: 'Est. Elevation',
      planDistance: 'Est. Distance',
      planPotatoes: 'Est. Potatoes',
      copySuccess: 'Plan copied to clipboard!',
      sharePlan: 'Share Plan',
      noPlans: 'No upcoming plans'
    }
  }[lang];

  const stats = [
    { type: 'climbs', label: t.climbs, value: `${MOCK_USER_STATS.totalClimbs}${t.times}`, icon: <Mountain className="w-4 h-4 text-mountain-primary" /> },
    { type: 'elevation', label: t.elevation, value: `${MOCK_USER_STATS.totalElevation}${t.meters}`, icon: <ArrowUpRight className="w-4 h-4 text-green-500" /> },
    { type: 'potatoes', label: t.potatoes, value: `${MOCK_USER_STATS.totalPotatoes}`, icon: <Award className="w-4 h-4 text-amber-500" /> },
    { type: 'rarest', label: t.rarest, value: MOCK_USER_STATS.rarestPotatoType, icon: <span className="text-xs">🥔</span> },
  ] as const;

  const ownedGear = MOCK_GEAR.filter(g => ownedGearIds.includes(g.id));

  const catNames = {
    ja: {
      shoes: 'フットウェア',
      backpack: 'ザック・パック',
      clothing: 'ウェア・レイヤリング',
      accessory: '小道具・アクセサリ',
      special: 'テクニカルギア・特殊'
    },
    en: {
      shoes: 'Footwear',
      backpack: 'Backpacks',
      clothing: 'Clothing & Layers',
      accessory: 'Accessories',
      special: 'Technical & Special'
    }
  }[lang as 'ja' | 'en'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-32 px-6 pt-12 max-w-4xl mx-auto min-h-screen"
    >
      <header className="mb-10 text-center relative">
        <div className="flex justify-between items-center mb-8 absolute top-0 left-0 right-0">
           {/* Header controls could go here if needed, but keeping it clean for now */}
        </div>
        
        <div className="flex items-center gap-6 mt-4 text-left max-w-md mx-auto">
          <div className="relative shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-50 to-white rounded-full border-2 border-pink-100 shadow-lg flex items-center justify-center text-3xl overflow-hidden ring-4 ring-pink-400/10 transition-transform hover:scale-105">
               {MOCK_USER_STATS.avatar}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-pink-500 text-white w-7 h-7 rounded-full border border-white flex items-center justify-center text-[8px] font-black shadow-lg">
              {t.level}{MOCK_USER_STATS.level}
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-cute text-mountain-primary font-bold">{MOCK_USER_STATS.nickname}</h2>
            <p className="text-[9px] text-mountain-accent font-black tracking-widest uppercase opacity-60">
              {MOCK_USER_STATS.rankName}
            </p>
            <div className="mt-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-mountain-primary/5 rounded-xl border border-mountain-primary/10 transition-all hover:bg-mountain-primary/10">
                <span className="text-[9px] font-bold text-mountain-primary/40 italic">山への一言:</span>
                <input 
                  type="text"
                  defaultValue="一歩一歩、ポテトを求めて。"
                  className="bg-transparent border-none outline-none text-[10px] font-bold text-mountain-primary placeholder:text-mountain-accent/30 w-32"
                  placeholder="Message..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* DashBoard: Metric Blocks */}
        <div className="max-w-md mx-auto mt-6 bg-white/70 backdrop-blur-md rounded-[1.5rem] p-4 border border-white shadow-lg text-left">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 bg-mountain-primary/10 rounded-lg">
               <TrendingUp className="w-3.5 h-3.5 text-mountain-primary" />
            </div>
            <h3 className="text-sm font-cute text-mountain-primary font-bold">
              {lang === 'ja' ? 'ダッシュボード' : 'Dashboard'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Potatoes */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal('potatoes')}
              className="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between h-16 text-left shadow-sm"
            >
              <p className="text-[7.5px] font-bold text-mountain-accent uppercase tracking-widest">{lang === 'ja' ? '所持ポテト' : 'Balance'}</p>
              <div className="flex items-center justify-between">
                <Sprout className="w-3 h-3 text-potato-brown/40" />
                <span className="text-base font-cute font-bold text-potato-brown">{MOCK_USER_STATS.totalPotatoes}</span>
              </div>
            </motion.button>

            {/* Rarest */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal('rarest')}
              className="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between h-16 text-left shadow-sm"
            >
               <p className="text-[7.5px] font-bold text-mountain-accent uppercase tracking-widest">{lang === 'ja' ? '最稀有種' : 'Rarest'}</p>
               <div className="flex items-center justify-between">
                 <Award className="w-3 h-3 text-mountain-primary/40" />
                 <span className="text-[10px] font-bold text-mountain-primary truncate pl-1">{MOCK_USER_STATS.rarestPotatoType}</span>
               </div>
            </motion.button>

            {/* Regional Ranking */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLeaderboardType('regional');
                setActiveModal('leaderboard');
              }}
              className="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between h-16 text-left shadow-sm"
            >
               <p className="text-[7.5px] font-bold text-mountain-accent uppercase tracking-widest">{lang === 'ja' ? '地区順位' : 'Regional'}</p>
               <div className="flex items-center justify-between">
                 <Users className="w-3 h-3 text-mountain-primary/40" />
                 <span className="text-base font-cute font-bold text-mountain-primary">12位</span>
               </div>
            </motion.button>

            {/* National Ranking */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setLeaderboardType('national');
                setActiveModal('leaderboard');
              }}
              className="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between h-16 text-left shadow-sm"
            >
               <p className="text-[7.5px] font-bold text-mountain-accent uppercase tracking-widest">{lang === 'ja' ? '全国順位' : 'National'}</p>
               <div className="flex items-center justify-between">
                 <Globe className="w-3 h-3 text-mountain-primary/40" />
                 <span className="text-base font-cute font-bold text-mountain-primary">453位</span>
               </div>
            </motion.button>

            {/* Total Climbs */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal('climbs')}
              className="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between h-16 text-left shadow-sm"
            >
              <p className="text-[7.5px] font-bold text-mountain-accent uppercase tracking-widest">{t.climbs}</p>
              <div className="flex items-center justify-between">
                <Mountain className="w-3 h-3 text-mountain-primary/40" />
                <span className="text-base font-cute font-bold text-mountain-primary">{MOCK_USER_STATS.totalClimbs}{t.times}</span>
              </div>
            </motion.button>

            {/* Total Elevation */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveModal('elevation')}
              className="bg-white/50 p-2.5 rounded-xl border border-white/60 flex flex-col justify-between h-16 text-left shadow-sm"
            >
              <p className="text-[7.5px] font-bold text-mountain-accent uppercase tracking-widest">{t.elevation}</p>
              <div className="flex items-center justify-between">
                <ArrowUpRight className="w-3 h-3 text-green-500/40" />
                <span className="text-base font-cute font-bold text-mountain-primary">{MOCK_USER_STATS.totalElevation}{t.meters}</span>
              </div>
            </motion.button>
          </div>

          <div className="pt-3 mt-1 border-t border-mountain-accent/5">
            <div className="flex justify-between items-center mb-1 px-1">
              <p className="text-[8px] font-black text-mountain-accent uppercase tracking-widest">{lang === 'ja' ? 'レベル進捗' : 'Progress'}</p>
              <p className="text-[8px] font-bold text-mountain-primary font-mono opacity-60">
                 {lang === 'ja' ? `あと ${MOCK_USER_STATS.potatoesToNextLevel}` : `${MOCK_USER_STATS.potatoesToNextLevel} to go`}
              </p>
            </div>
            <div className="h-1.5 w-full bg-mountain-primary/5 rounded-full overflow-hidden p-0 border border-mountain-primary/5">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '70%' }}
                 className="h-full bg-gradient-to-r from-potato-yellow to-potato-brown rounded-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid Removed as its items are merged above */}

      {/* Gear Inventory Section */}
      <div className="mb-6 group/showcase bg-white/70 backdrop-blur-md rounded-[1.5rem] p-4 border border-white shadow-md">
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg shadow-inner">
               <Gift className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-cute text-mountain-primary font-bold">{t.gear}</h3>
              <p className="text-[8px] text-mountain-accent/60 font-bold uppercase tracking-wider">{ownedGear.length} Items</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowGearChecklist(true)}
              className="p-1.5 bg-mountain-primary text-white rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
              title={t.editGear}
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                const text = lang === 'ja' 
                  ? `私の登山装備コレクション: ${ownedGear.length}アイテムを保有中！ #ポテト登山 #MountainGear` 
                  : `My mountain gear collection: ${ownedGear.length} items owned! #MountainLife #Hiking`;
                alert(text);
              }}
              className="p-1.5 bg-white rounded-lg border border-mountain-accent/10 text-mountain-accent hover:text-mountain-primary transition-all shadow-sm"
              title="Share Loadout"
            >
              <Share2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
        
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {ownedGear.map((gear, i) => (
              <motion.div
                key={gear.id}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 200 }}
                onClick={() => setShowGearChecklist(true)}
                className="flex-shrink-0 w-28 bg-white/60 p-3 rounded-[1.5rem] border border-white shadow-sm flex flex-col items-center text-center cursor-pointer hover:bg-white hover:shadow-md transition-all group/item snap-center"
              >
                <div className="w-14 h-14 bg-mountain-bg/50 rounded-xl flex items-center justify-center text-2xl mb-2 shadow-inner group-hover/item:scale-110 transition-transform">
                  {gear.icon}
                </div>
                <div className="mb-1.5 text-center">
                  <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-full uppercase ${(difficultyColors as any)[`lv${gear.level}`]} shadow-sm`}>
                     LV.{gear.level}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-mountain-primary leading-tight line-clamp-2 min-h-[2.5em]">{gear.name}</p>
                <div className="mt-2 w-full h-1 bg-mountain-primary/5 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '100%' }}
                     transition={{ delay: i * 0.1 + 0.5, duration: 0.8 }}
                     className={`h-full ${(difficultyColors as any)[`lv${gear.level}`].split(' ')[1]}`} 
                   />
                </div>
              </motion.div>
            ))}
            {ownedGear.length === 0 && (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGearChecklist(true)}
                className="w-full py-12 text-center bg-white/30 backdrop-blur-md rounded-[2.5rem] border-2 border-dashed border-mountain-accent/20 flex flex-col items-center justify-center gap-3 group hover:border-mountain-primary/30 transition-all mx-2"
              >
                <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center text-mountain-accent group-hover:text-mountain-primary transition-colors shadow-sm">
                  <Gift className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-mountain-primary font-bold">装備を登録しましょう</p>
                  <p className="text-[10px] text-mountain-accent font-medium uppercase tracking-widest">Tap to start your collection</p>
                </div>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Climbing Plans Section */}
      <div className="mb-6 bg-white/70 backdrop-blur-md rounded-[1.5rem] p-4 border border-white shadow-md">
        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-mountain-primary/10 rounded-lg">
               <Calendar className="w-3.5 h-3.5 text-mountain-primary" />
            </div>
            <div>
              <h3 className="text-sm font-cute text-mountain-primary font-bold">{(t as any).plansTitle}</h3>
              <p className="text-[8px] text-mountain-accent/60 font-bold uppercase tracking-wider">{plans.length} Upcoming</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlanModal(true)}
            className="p-1.5 bg-mountain-primary/5 text-mountain-primary rounded-lg border border-mountain-primary/10 hover:bg-mountain-primary hover:text-white transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="space-y-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 rounded-2xl p-4 border border-white shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3">
                {plan.isPublic ? (
                  <Globe className="w-4 h-4 text-mountain-primary opacity-40" />
                ) : (
                  <Lock className="w-4 h-4 text-mountain-accent opacity-40" />
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-cute font-bold text-mountain-primary mb-1">{plan.mountainName}</h4>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-mountain-accent">
                       <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {plan.date}</span>
                       <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {plan.meetupTime}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const shareText = [
                        `🏔️ 登山計画: ${plan.mountainName}`,
                        `📅 日時: ${plan.date}${getDayOfWeek(plan.date)} ${plan.meetupTime}`,
                        plan.elevationGain ? `📈 予定獲得標高: ${plan.elevationGain}m` : '',
                        plan.distance ? `🚶 予定距離: ${plan.distance}km` : '',
                        plan.estPotatoesMax ? `🥔 予定ポテト: ${plan.estPotatoesMin}-${plan.estPotatoesMax}個` : '',
                        `📍 集合: ${plan.meetupLocation}`,
                        plan.requiredGear ? `🎒 装備: ${plan.requiredGear}` : '',
                        plan.hasInsurance ? '🛡️ 保険: 加入済み' : '⚠️ 保険: 未加入',
                        `📝 メモ: ${plan.notes}`,
                        '\n#ポテト登山 #芋山計画'
                      ].filter(Boolean).join('\n');
                      navigator.clipboard.writeText(shareText);
                      alert((t as any).copySuccess);
                    }}
                    className="shrink-0 p-2.5 bg-mountain-bg rounded-xl text-mountain-accent hover:text-mountain-primary transition-colors flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider"
                  >
                    <Share2 className="w-3.5 h-3.5" /> {(t as any).sharePlan}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   {plan.estPotatoesMin !== undefined && plan.estPotatoesMax !== undefined && (
                     <div className="col-span-2 bg-amber-50/50 p-3 rounded-2xl flex items-center justify-center gap-3 border border-amber-100 shadow-sm">
                        <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                          <Sprout className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none mb-1">{(t as any).planPotatoes}</p>
                           <p className="text-sm font-black text-mountain-primary">
                             {plan.estPotatoesMin} 〜 {plan.estPotatoesMax} <span className="text-[10px] opacity-60">POTATOES</span>
                           </p>
                        </div>
                     </div>
                   )}
                   {plan.elevationGain && (
                     <div className="bg-green-50/50 p-2.5 rounded-2xl flex items-center gap-2 border border-green-100">
                        <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                        <div>
                           <p className="text-[8px] font-black text-green-600 uppercase tracking-tighter">{(t as any).planElevation}</p>
                           <p className="text-xs font-black text-mountain-primary">+{plan.elevationGain}m</p>
                        </div>
                     </div>
                   )}
                   {plan.distance && (
                     <div className="bg-blue-50/50 p-2.5 rounded-2xl flex items-center gap-2 border border-blue-100">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <div>
                           <p className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">{(t as any).planDistance}</p>
                           <p className="text-xs font-black text-mountain-primary">{plan.distance}km</p>
                        </div>
                     </div>
                   )}
                </div>

                <div className="bg-mountain-bg/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-mountain-accent mt-0.5" />
                    <p className="text-xs text-mountain-text font-bold">{plan.meetupLocation}</p>
                  </div>
                  {plan.notes && (
                    <p className="text-[11px] text-mountain-text/70 leading-relaxed italic border-t border-mountain-accent/5 pt-2">
                      {plan.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {plan.participants.map((p, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full border-2 border-white bg-mountain-accent/20 flex items-center justify-center text-[8px] font-bold text-mountain-primary">
                        {p.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-mountain-accent">{plan.participants.length} Participants</span>
                </div>
              </div>
            </motion.div>
          ))}
          {plans.length === 0 && (
            <div className="py-12 bg-white/30 rounded-[2.5rem] border-2 border-dashed border-mountain-accent/20 flex flex-col items-center justify-center gap-3">
               <Calendar className="w-8 h-8 text-mountain-accent opacity-20" />
               <p className="text-xs text-mountain-accent font-bold">{(t as any).noPlans}</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent History Section */}
      <div className="mb-6 bg-white/70 backdrop-blur-md rounded-[1.5rem] p-4 border border-white shadow-md">
        <div className="flex items-center gap-2 mb-5 px-1">
          <div className="p-1.5 bg-mountain-primary/10 rounded-lg">
             <Clock className="w-3.5 h-3.5 text-mountain-primary" />
          </div>
          <div>
            <h3 className="text-sm font-cute text-mountain-primary font-bold">{t.recentHistory}</h3>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_USER_STATS.recentLogs?.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 rounded-2xl p-4 border border-white shadow-sm overflow-hidden relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-cute font-bold text-mountain-primary">{log.mountainName}</h4>
                  <p className="text-[10px] text-mountain-accent font-bold uppercase tracking-widest">{log.date}</p>
                </div>
                <div className="bg-potato-brown/10 px-3 py-1 rounded-full">
                  <p className="text-[10px] font-bold text-potato-brown">🥔 +{log.potatoesEarned}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-mountain-bg/50 px-3 py-2 rounded-xl text-center">
                   <p className="text-[8px] font-bold text-mountain-accent uppercase tracking-tighter mb-0.5">{t.elevation}</p>
                   <p className="text-xs font-bold text-mountain-primary">{log.elevation}m</p>
                </div>
                <div className="bg-mountain-bg/50 px-3 py-2 rounded-xl text-center">
                   <p className="text-[8px] font-bold text-mountain-accent uppercase tracking-tighter mb-0.5">{t.distance}</p>
                   <p className="text-xs font-bold text-mountain-primary">{log.distance}km</p>
                </div>
                <div className="bg-mountain-bg/50 px-3 py-2 rounded-xl text-center">
                   <p className="text-[8px] font-bold text-mountain-accent uppercase tracking-tighter mb-0.5">{t.duration}</p>
                   <p className="text-xs font-bold text-mountain-primary">{log.duration}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Referral Section (Bonuses) */}

      {/* Friends Referral Section */}
      <div className="mb-10">
        <div className="bg-gradient-to-br from-potato-brown/10 to-mountain-primary/5 rounded-[2.5rem] p-6 border border-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-mountain-primary rounded-xl">
                 <Gift className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-cute text-mountain-primary font-bold">{t.inviteFriends}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-white">
                <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600 font-bold text-xs">2x</div>
                <p className="text-[11px] font-bold text-mountain-text leading-relaxed">{t.inviteDesc}</p>
              </div>
              <div className="flex items-start gap-3 bg-white/60 p-3 rounded-2xl border border-white">
                <div className="bg-blue-100 p-1.5 rounded-lg text-blue-600 font-bold text-xs">1.5x</div>
                <p className="text-[11px] font-bold text-mountain-text leading-relaxed">{t.groupDesc}</p>
              </div>
            </div>

            <button className="w-full py-4 bg-mountain-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              <Share2 className="w-4 h-4" />
              {t.copyLink}
            </button>
          </div>
        </div>
      </div>

      {/* Settings & Status */}
      <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-xl mb-12">
        {/* Settings Button */}
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-mountain-bg transition-colors group mb-2 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gray-100 rounded-xl">
              <Settings className="w-5 h-5 text-gray-500" />
            </div>
            <span className="font-bold text-mountain-primary">{t.settings}</span>
          </div>
          <ChevronRight className="w-5 h-5 text-mountain-accent group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="h-px bg-mountain-accent/5 mx-4 my-2" />

        {/* Login Status */}
        <div className="p-4 flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500" />
             <p className="text-sm font-bold text-mountain-text/60">
               {t.loggedInAs} <span className="text-mountain-primary">chenzhaoyu0205@gmail.com</span>
             </p>
           </div>
           <button className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
              {t.logout}
           </button>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showGearChecklist && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md h-[80vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-8 pb-4 border-b border-gray-100 shrink-0">
                <button 
                  onClick={() => setShowGearChecklist(false)}
                  className="absolute top-6 right-6 text-mountain-accent hover:text-mountain-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-cute text-mountain-primary font-bold">{(t as any).gearInventory}</h3>
                <p className="text-xs text-mountain-accent font-bold mt-1">{(t as any).allGear}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                {(['shoes', 'backpack', 'clothing', 'accessory', 'special'] as const).map(cat => (
                  <div key={cat} className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-mountain-accent flex items-center gap-2">
                       <Circle className="w-2 h-2 fill-mountain-accent" /> {(catNames as any)[cat]}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {MOCK_GEAR.filter(g => g.category === cat).map(g => {
                        const isOwned = ownedGearIds.includes(g.id);
                        return (
                          <motion.button
                            key={g.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleGear(g.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                              isOwned 
                              ? 'bg-mountain-lime/10 border-mountain-lime/30 shadow-sm ring-1 ring-mountain-lime/10' 
                              : 'bg-mountain-bg/30 border-mountain-accent/5 opacity-60'
                            }`}
                          >
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">
                              {g.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className={`text-xs font-bold ${isOwned ? 'text-mountain-primary' : 'text-mountain-text/50'}`}>{g.name}</h5>
                                <span className={`text-[6px] font-black px-1 py-0.5 rounded uppercase ${(difficultyColors as any)[`lv${g.level}`]}`}>
                                  LV {g.level}
                                </span>
                              </div>
                              <p className="text-[9px] text-mountain-text/40 leading-tight mt-0.5">{g.description}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isOwned ? 'bg-mountain-lime border-mountain-lime' : 'border-mountain-accent/20'
                            }`}>
                              {isOwned && <Save className="w-3 h-3 text-white" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 pt-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
                <button 
                  onClick={() => setShowGearChecklist(false)}
                  className="w-full py-5 bg-mountain-primary text-white rounded-2xl font-bold shadow-xl shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {t.save}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ranking Leaderboard Modal */}
        {activeModal === 'leaderboard' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl flex flex-col overflow-hidden max-h-[75vh]"
            >
              <div className="p-8 pb-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-cute text-mountain-primary font-bold">{(t as any).leaderboardTitle}</h3>
                  <p className="text-[9px] font-bold text-mountain-accent uppercase tracking-widest">
                    {leaderboardType === 'regional' ? (lang === 'ja' ? 'エリア: 東京都 港区' : 'Region: Tokyo, Minato') : (lang === 'ja' ? '全国' : 'National')}
                  </p>
                </div>
                <button 
                  onClick={() => setActiveModal('none')}
                  className="p-3 bg-mountain-bg rounded-2xl text-mountain-accent hover:text-mountain-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Toggle View */}
              <div className="px-8 mt-6">
                <div className="bg-mountain-bg p-1.5 rounded-[1.5rem] flex gap-1">
                  <button 
                    onClick={() => setLeaderboardView('top')}
                    className={`flex-1 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all ${leaderboardView === 'top' ? 'bg-white text-mountain-primary shadow-sm' : 'text-mountain-accent hover:text-mountain-primary'}`}
                  >
                    {(t as any).topRankers}
                  </button>
                  <button 
                    onClick={() => setLeaderboardView('near')}
                    className={`flex-1 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-wider transition-all ${leaderboardView === 'near' ? 'bg-white text-mountain-primary shadow-sm' : 'text-mountain-accent hover:text-mountain-primary'}`}
                  >
                    {(t as any).nearYou}
                  </button>
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-1 font-sans">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100 italic">
                      <th className="pb-4 text-[9px] font-black text-mountain-accent uppercase tracking-tighter">{(t as any).rank}</th>
                      <th className="pb-4 text-[9px] font-black text-mountain-accent uppercase tracking-tighter">{(t as any).userName}</th>
                      <th className="pb-4 text-[9px] font-black text-mountain-accent uppercase tracking-tighter text-right">{(t as any).score}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(leaderboardView === 'top' ? 
                      [
                        { id: 'u1', rank: 1, name: 'PotatoKing', score: 12503, isUser: false },
                        { id: 'u2', rank: 2, name: 'MountainGoat', score: 11200, isUser: false },
                        { id: 'u3', rank: 3, name: 'Imo-Hiker', score: 9800, isUser: false },
                        { id: 'u4', rank: 4, name: 'PeakSeeker', score: 8500, isUser: false },
                        { id: 'u5', rank: 5, name: 'SproutClimber', score: 7200, isUser: false },
                      ] : 
                      [
                        { id: 'u11', rank: 11, name: 'CloudWalker', score: 4850, isUser: false },
                        { id: 'user', rank: 12, name: nickname, score: 4530, isUser: true },
                        { id: 'u13', rank: 13, name: 'ForestNinja', score: 4200, isUser: false },
                      ]
                    ).map((ranker) => (
                      <tr key={ranker.id} className={`${ranker.isUser ? 'bg-mountain-lime/5' : ''}`}>
                        <td className="py-4">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-bold ${
                            ranker.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                            ranker.rank === 2 ? 'bg-gray-100 text-gray-700' :
                            ranker.rank === 3 ? 'bg-amber-100 text-amber-700' :
                            'text-mountain-accent'
                          }`}>
                            {ranker.rank}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                             {ranker.isUser && <div className="w-1.5 h-1.5 bg-mountain-lime rounded-full" />}
                             <span className={`text-[10px] font-bold ${ranker.isUser ? 'text-mountain-primary' : 'text-mountain-text'}`}>
                               {ranker.name}
                             </span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <span className="text-[10px] font-bold text-potato-brown">🥔 {ranker.score.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-8 pt-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
                <button 
                  onClick={() => setActiveModal('none')}
                  className="w-full py-5 bg-mountain-primary text-white rounded-2xl font-bold shadow-xl shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-6 right-6 text-mountain-accent hover:text-mountain-primary transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-base font-cute text-mountain-primary font-bold mb-8">{t.settings}</h3>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.editNickname}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mountain-accent" />
                    <input 
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.editPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mountain-accent" />
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.editAddress}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mountain-accent" />
                    <input 
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-5 bg-mountain-primary text-white rounded-2xl font-bold shadow-xl shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {t.save}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Detail Modals */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm max-h-[75vh] flex flex-col shadow-2xl relative overflow-hidden"
            >
              <div className="p-8 pb-4 border-b border-gray-100 shrink-0">
                <button 
                  onClick={() => setActiveModal('none')}
                  className="absolute top-6 right-6 text-mountain-accent hover:text-mountain-primary transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-base font-cute text-mountain-primary font-bold">
                  {activeModal === 'climbs' ? t.historyTitle : 
                   activeModal === 'elevation' ? (t as any).elevationTitle : 
                   activeModal === 'potatoes' ? (t as any).potatoesTitle : 
                   (t as any).rarestTitle}
                </h3>
                <p className="text-[10px] text-mountain-accent font-bold mt-1">
                  {activeModal === 'climbs' ? t.historyDesc : 
                   activeModal === 'elevation' ? (t as any).elevationDesc : 
                   activeModal === 'potatoes' ? (t as any).potatoesDesc : 
                   (t as any).rarestDesc}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 custom-scrollbar">
                {activeModal === 'rarest' ? (
                  <div className="space-y-6">
                    <div className="relative aspect-square w-full max-w-[200px] mx-auto bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center group shadow-inner">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="text-8xl select-none"
                      >
                        🥔
                      </motion.div>
                      <div className="absolute inset-0 border-4 border-dashed border-amber-300 rounded-full animate-spin-slow opacity-30" />
                    </div>
                    
                    <div className="text-center space-y-2">
                       <h4 className="text-base font-black text-mountain-primary">{MOCK_USER_STATS.rarestPotatoType}</h4>
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                         <Award className="w-3 h-3" /> Legendary Grade
                       </div>
                    </div>

                    <div className="bg-mountain-bg/10 p-6 rounded-[2rem] border border-white/50 space-y-4">
                      <p className="text-xs font-bold text-mountain-text/80 leading-relaxed italic">
                        "このポテトは、伝説のポテト王国でも数年に一度しか発見されない極めて希少な品種です。その輝きは登山者の勇気の証とされています。"
                      </p>
                      <div className="h-px bg-mountain-accent/10" />
                      {MOCK_USER_STATS.recentLogs.find(l => l.rarestPotatoFound) && (
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-xl shadow-sm">
                             <MapPin className="w-4 h-4 text-mountain-primary" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest">Discovery Location</p>
                              <p className="text-xs font-bold text-mountain-primary">
                                {MOCK_USER_STATS.recentLogs.find(l => l.rarestPotatoFound)?.mountainName} ({MOCK_USER_STATS.recentLogs.find(l => l.rarestPotatoFound)?.date})
                              </p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  MOCK_USER_STATS.recentLogs?.map((log, i) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`rounded-3xl p-5 border border-white/50 transition-all ${
                        activeModal === 'elevation' ? 'bg-green-50/50 border-green-100' :
                        activeModal === 'potatoes' ? 'bg-amber-50/50 border-amber-100' :
                        'bg-mountain-bg/10'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${
                            activeModal === 'elevation' ? 'bg-green-500 text-white' :
                            activeModal === 'potatoes' ? 'bg-amber-500 text-white' :
                            'bg-white text-mountain-primary'
                          }`}>
                             {activeModal === 'elevation' ? <ArrowUpRight className="w-5 h-5" /> :
                              activeModal === 'potatoes' ? <Award className="w-5 h-5" /> :
                              <Mountain className="w-5 h-5" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-mountain-primary text-xs">{log.mountainName}</h4>
                            <p className="text-[10px] text-mountain-accent font-bold uppercase tracking-widest">{log.date}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`px-3 py-1 rounded-full shadow-sm ${
                            activeModal === 'potatoes' ? 'bg-amber-500 text-white' : 'bg-potato-brown text-white'
                          }`}>
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                              {activeModal === 'potatoes' ? `🥔 +${log.potatoesEarned}` : `+${log.potatoesEarned}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className={`p-3 rounded-2xl text-center shadow-tiny ${activeModal === 'elevation' ? 'bg-green-50' : 'bg-white/60'}`}>
                           <p className="text-[8px] font-black text-mountain-accent uppercase tracking-tighter mb-1">{t.elevation}</p>
                           <p className={`text-xs font-black ${activeModal === 'elevation' ? 'text-green-600' : 'text-mountain-primary'}`}>+{log.elevation}m</p>
                        </div>
                        <div className="bg-white/60 p-3 rounded-2xl text-center shadow-tiny">
                           <p className="text-xs font-black text-mountain-primary">{log.distance}km</p>
                        </div>
                        <div className="bg-white/60 p-3 rounded-2xl text-center shadow-tiny">
                           <p className="text-[8px] font-black text-mountain-accent uppercase tracking-tighter mb-1">{t.duration}</p>
                           <p className="text-xs font-black text-mountain-primary">{log.duration}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="p-8 pt-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
                <button 
                  onClick={() => setActiveModal('none')}
                  className="w-full py-5 bg-mountain-primary text-white rounded-2xl font-bold shadow-xl shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
