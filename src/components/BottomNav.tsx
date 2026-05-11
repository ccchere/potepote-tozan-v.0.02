import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, Book, User, Sprout, Mountain } from 'lucide-react';
import { AppStep, Language } from '../types';

interface BottomNavProps {
  currentStep: AppStep;
  onStepChange: (step: AppStep) => void;
  lang: Language;
  onAddPlan: () => void;
  onClimbNow: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentStep, onStepChange, lang, onAddPlan, onClimbNow }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const tabsLeft = [
    { id: 'farm', icon: Sprout, label: lang === 'ja' ? 'ホーム' : 'Home' },
    { id: 'home', icon: Search, label: lang === 'ja' ? '山を探す' : 'Search' },
  ] as const;

  const tabsRight = [
    { id: 'collection', icon: Book, label: lang === 'ja' ? '図鑑' : 'Library' },
    { id: 'profile', icon: User, label: lang === 'ja' ? 'マイページ' : 'Profile' },
  ] as const;

  // Map sub-steps of mountain search to the 'home' tab
  const getActiveTab = () => {
    if (['questionnaire', 'loading', 'results', 'checklist', 'home'].includes(currentStep)) return 'home';
    return currentStep;
  };

  const activeTab = getActiveTab();

  const renderTab = (tab: { id: string, icon: any, label: string }) => {
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => {
          onStepChange(tab.id as AppStep);
          setIsMenuOpen(false);
        }}
        className={`relative flex flex-col items-center gap-0.5 transition-all duration-500 px-3 py-2 rounded-2xl ${
          isActive ? 'bg-white text-mountain-primary shadow-xl scale-105' : 'text-white/60 hover:text-white hover:bg-white/10'
        }`}
      >
        <tab.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : ''}`} />
        <span className={`text-[7px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? 'opacity-100 max-h-3 mt-0.5' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          {tab.label}
        </span>
        {isActive && (
          <motion.div 
            layoutId="activeTabGlow"
            className="absolute -inset-1 bg-white/20 blur-xl rounded-full -z-10"
          />
        )}
      </button>
    );
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm px-2">
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-mountain-primary/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/20 flex flex-col gap-1"
          >
            <button
              onClick={() => {
                onAddPlan();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-white/10 text-white transition-colors text-left"
            >
              <div className="p-2 bg-white/10 rounded-xl">
                <Mountain className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{lang === 'ja' ? '登山計画の作成' : 'Create Plan'}</span>
            </button>
            <div className="h-px bg-white/10 mx-2" />
            <button
              onClick={() => {
                onClimbNow();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-white/10 text-white transition-colors text-left"
            >
              <div className="p-2 bg-white/10 rounded-xl">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{lang === 'ja' ? '今から登山' : 'Climb Now'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-mountain-primary/95 backdrop-blur-2xl rounded-[2rem] p-1.5 flex items-center justify-between shadow-2xl border border-white/20 ring-1 ring-white/10">
        {tabsLeft.map(renderTab)}
        
        {/* Center Add Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`relative group bg-white text-mountain-primary w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${isMenuOpen ? 'scale-110 ring-4 ring-white/20' : 'hover:scale-110 active:scale-95'}`}
        >
          <div className="absolute inset-0 bg-white/40 rounded-xl scale-0 group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100 blur-sm" />
          <motion.div
            animate={isMenuOpen ? { rotate: 180 } : { rotate: [0, 5, -5, 0] }}
            transition={isMenuOpen ? { duration: 0.3 } : { repeat: Infinity, duration: 4 }}
          >
             <Mountain className="w-4 h-4 fill-current" />
          </motion.div>
        </button>

        {tabsRight.map(renderTab)}
      </div>
    </div>
  );
};
