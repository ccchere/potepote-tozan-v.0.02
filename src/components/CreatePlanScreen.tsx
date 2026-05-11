import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  PlusCircle, 
  Globe, 
  Lock, 
  Calendar, 
  Clock, 
  MapPin, 
  Mountain,
  ArrowLeft,
  Bean
} from 'lucide-react';
import { Language, ClimbingPlan, AppStep } from '../types';
import { MOCK_USER_STATS } from '../mockData';

interface CreatePlanScreenProps {
  lang: Language;
  onBack: () => void;
  onSave: (plan: ClimbingPlan) => void;
}

export const CreatePlanScreen: React.FC<CreatePlanScreenProps> = ({ lang, onBack, onSave }) => {
  const [newPlan, setNewPlan] = useState<Partial<ClimbingPlan>>({
    mountainName: '',
    date: '',
    meetupLocation: '',
    meetupTime: '',
    isPublic: true,
    notes: '',
    requiredGear: '',
    experienceLevel: 'beginner',
    hasInsurance: false,
    elevationGain: undefined,
    distance: undefined,
    estPotatoesMin: undefined,
    estPotatoesMax: undefined
  });

  const t = {
    ja: {
      title: '登山計画の作成',
      mountain: '登る山',
      date: '登山日',
      location: '集合場所',
      time: '集合時間',
      visibility: '公開設定',
      public: '公開する',
      private: '非公開',
      notes: '計画メモ（コースなど）',
      gear: '必須装備（レインウェアなど）',
      level: '推奨レベル',
      insurance: '登山保険の加入状況',
      insuranceYes: '加入済み/予定',
      insuranceNo: '未加入',
      elevation: '予定獲得標高',
      distance: '予定距離',
      potatoesMin: '最小ポテト数',
      potatoesMax: '最大ポテト数',
      addPlan: '計画を保存',
      back: '戻る',
      placeholderMountain: '例: 大山, 高尾山',
      placeholderGear: '例: レインウェア, ヘッドランプ',
    },
    en: {
      title: 'Create Climbing Plan',
      mountain: 'Mountain',
      date: 'Date',
      location: 'Meetup Location',
      time: 'Meetup Time',
      visibility: 'Visibility',
      public: 'Public',
      private: 'Private',
      notes: 'Notes / Course',
      gear: 'Required Gear',
      level: 'Req. Level',
      insurance: 'Mountain Insurance',
      insuranceYes: 'Insured',
      insuranceNo: 'Not Insured',
      elevation: 'Est. Elevation Gain',
      distance: 'Est. Distance',
      potatoesMin: 'Min Potatoes',
      potatoesMax: 'Max Potatoes',
      addPlan: 'Save Plan',
      back: 'Back',
      placeholderMountain: 'e.g. Mt. Fuji, Mt. Oyama',
      placeholderGear: 'e.g. Rainwear, Headlamp',
    }
  }[lang];

  const handleSave = () => {
    if (!newPlan.mountainName || !newPlan.date) return;
    const plan: ClimbingPlan = {
      id: `p${Date.now()}`,
      mountainName: newPlan.mountainName!,
      date: newPlan.date!,
      meetupLocation: newPlan.meetupLocation || '',
      meetupTime: newPlan.meetupTime || '',
      isPublic: newPlan.isPublic ?? true,
      notes: newPlan.notes || '',
      requiredGear: newPlan.requiredGear || '',
      experienceLevel: newPlan.experienceLevel || 'beginner',
      hasInsurance: newPlan.hasInsurance || false,
      elevationGain: newPlan.elevationGain,
      distance: newPlan.distance,
      estPotatoesMin: newPlan.estPotatoesMin,
      estPotatoesMax: newPlan.estPotatoesMax,
      participants: [MOCK_USER_STATS.nickname]
    };
    onSave(plan);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pb-32 px-6 pt-12 max-w-lg mx-auto min-h-screen bg-mountain-bg/30"
    >
      <header className="flex items-center gap-4 mb-10">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-2xl shadow-sm text-mountain-primary hover:bg-mountain-bg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-cute text-mountain-primary font-bold">{t.title}</h1>
      </header>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl space-y-6 border border-white">
        <div>
          <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.mountain}</label>
          <div className="relative">
            <Mountain className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mountain-accent" />
            <input 
              type="text"
              placeholder={t.placeholderMountain}
              value={newPlan.mountainName}
              onChange={(e) => setNewPlan({...newPlan, mountainName: e.target.value})}
              className="w-full pl-12 pr-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.date}</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mountain-accent pointer-events-none" />
              <input 
                type="date"
                value={newPlan.date}
                onChange={(e) => setNewPlan({...newPlan, date: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.time}</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mountain-accent pointer-events-none" />
              <input 
                type="time"
                value={newPlan.meetupTime}
                onChange={(e) => setNewPlan({...newPlan, meetupTime: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.elevation} (m)</label>
            <input 
              type="number"
              placeholder="1200"
              value={newPlan.elevationGain || ''}
              onChange={(e) => setNewPlan({...newPlan, elevationGain: e.target.value ? parseInt(e.target.value) : undefined})}
              className="w-full px-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.distance} (km)</label>
            <input 
              type="number"
              step="0.1"
              placeholder="8.5"
              value={newPlan.distance || ''}
              onChange={(e) => setNewPlan({...newPlan, distance: e.target.value ? parseFloat(e.target.value) : undefined})}
              className="w-full px-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.potatoesMin}</label>
            <div className="relative">
              <Bean className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input 
                type="number"
                placeholder="10"
                value={newPlan.estPotatoesMin || ''}
                onChange={(e) => setNewPlan({...newPlan, estPotatoesMin: e.target.value ? parseInt(e.target.value) : undefined})}
                className="w-full pl-12 pr-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.potatoesMax}</label>
            <div className="relative">
              <Bean className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input 
                type="number"
                placeholder="20"
                value={newPlan.estPotatoesMax || ''}
                onChange={(e) => setNewPlan({...newPlan, estPotatoesMax: e.target.value ? parseInt(e.target.value) : undefined})}
                className="w-full pl-12 pr-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.location}</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mountain-accent" />
            <input 
              type="text"
              value={newPlan.meetupLocation}
              onChange={(e) => setNewPlan({...newPlan, meetupLocation: e.target.value})}
              className="w-full pl-12 pr-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.visibility}</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setNewPlan({...newPlan, isPublic: true})}
              className={`flex-1 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${newPlan.isPublic ? 'bg-mountain-primary text-white shadow-lg' : 'bg-mountain-bg text-mountain-accent'}`}
            >
              <Globe className="w-4 h-4" /> {t.public}
            </button>
            <button 
              onClick={() => setNewPlan({...newPlan, isPublic: false})}
              className={`flex-1 py-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${!newPlan.isPublic ? 'bg-mountain-accent text-white shadow-lg' : 'bg-mountain-bg text-mountain-accent'}`}
            >
              <Lock className="w-4 h-4" /> {t.private}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.gear}</label>
          <input 
            type="text"
            placeholder={t.placeholderGear}
            value={newPlan.requiredGear}
            onChange={(e) => setNewPlan({...newPlan, requiredGear: e.target.value})}
            className="w-full px-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.level}</label>
            <select 
              value={newPlan.experienceLevel}
              onChange={(e) => setNewPlan({...newPlan, experienceLevel: e.target.value})}
              className="w-full px-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20 appearance-none text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.insurance}</label>
            <button 
              onClick={() => setNewPlan({...newPlan, hasInsurance: !newPlan.hasInsurance})}
              className={`w-full h-[56px] rounded-2xl font-bold text-[10px] transition-all border-2 ${newPlan.hasInsurance ? 'bg-mountain-lime/10 border-mountain-lime text-mountain-lime' : 'bg-mountain-bg border-transparent text-mountain-accent'}`}
            >
              {newPlan.hasInsurance ? t.insuranceYes : t.insuranceNo}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest block mb-2">{t.notes}</label>
          <textarea 
            rows={3}
            value={newPlan.notes}
            onChange={(e) => setNewPlan({...newPlan, notes: e.target.value})}
            className="w-full px-5 py-4 bg-mountain-bg rounded-2xl font-bold text-mountain-primary outline-none focus:ring-2 ring-mountain-primary/20 resize-none"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={!newPlan.mountainName || !newPlan.date}
          className="w-full py-5 bg-mountain-primary text-white rounded-[2rem] font-bold shadow-xl shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
        >
          <PlusCircle className="w-5 h-5" />
          {t.addPlan}
        </button>
      </div>
    </motion.div>
  );
};
