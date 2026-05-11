import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mountain, Mail, Lock, LogIn, UserPlus, Github, User, Cloud, Bean } from 'lucide-react';
import { Language } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
  lang: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const t = {
    ja: {
      title: 'ぽてぽて登山',
      slogan: '登山して、じゃがいもを集めよう',
      email: 'メールアドレス',
      password: 'パスワード',
      login: 'ログイン',
      register: '新規登録',
      google: 'Googleでログイン',
      guest: 'ゲストとして始める',
    },
    en: {
      title: 'Potepote Hiking',
      slogan: 'Climb Mountains, Collect Potatoes',
      email: 'Email Address',
      password: 'Password',
      login: 'Login',
      register: 'Sign Up',
      google: 'Sign in with Google',
      guest: 'Start as Guest',
    }
  }[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-mountain-bg relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] opacity-20"
        >
          <Cloud className="w-32 h-32 text-mountain-accent" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-[15%] opacity-20"
        >
          <Cloud className="w-24 h-24 text-mountain-accent" />
        </motion.div>
        
        <Mountain className="absolute -bottom-10 -left-10 w-64 h-64 text-mountain-primary/10 rotate-12" />
        <Bean className="absolute bottom-20 right-10 w-32 h-32 text-potato-yellow/10 -rotate-12" />
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border border-white/60 shadow-2xl relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6">
            <div className="p-6 bg-mountain-primary rounded-[2.5rem] shadow-xl">
              <Mountain className="w-14 h-14 text-white" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-3 -right-3 p-2 bg-potato-yellow rounded-full shadow-lg border-2 border-white"
            >
              <Bean className="w-7 h-7 text-potato-brown fill-potato-yellow" />
            </motion.div>
          </div>
          <div className="relative group cursor-default mb-4">
            <h1 className="text-3xl md:text-5xl text-mountain-primary relative z-10 leading-tight drop-shadow-lg font-cute text-center text-balance font-bold">
              {t.title}
            </h1>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[110%] h-3 bg-mountain-accent/20 -rotate-1 -z-0 blur-[2px] rounded-full" />
          </div>
          <p className="text-sm text-mountain-accent font-bold tracking-widest uppercase text-center text-balance">{t.slogan}</p>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mountain-accent" />
            <input 
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-white/50 rounded-2xl focus:border-mountain-primary focus:outline-none transition-all font-medium text-mountain-text"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mountain-accent" />
            <input 
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-white/50 rounded-2xl focus:border-mountain-primary focus:outline-none transition-all font-medium text-mountain-text"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button 
            onClick={onLogin}
            className="w-full py-4 bg-mountain-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-mountain-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-balance"
          >
            <LogIn className="w-5 h-5" />
            {t.login}
          </button>
          <button className="w-full py-4 bg-white border-2 border-mountain-primary/10 text-mountain-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/50 transition-all text-balance">
            <UserPlus className="w-5 h-5" />
            {t.register}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-mountain-accent/20" />
          <span className="text-[10px] font-bold text-mountain-accent uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-mountain-accent/20" />
        </div>

        {/* OAuth & Guest */}
        <div className="space-y-3">
          <button className="w-full py-3 bg-white border border-mountain-accent/20 text-mountain-text rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/50 transition-all">
            <Github className="w-4 h-4" /> {/* Github as placeholder icon for Google login */}
            {t.google}
          </button>
          <button 
            onClick={onLogin}
            className="w-full py-3 text-mountain-accent rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:text-mountain-primary transition-all underline-offset-4 hover:underline"
          >
            <User className="w-4 h-4" />
            {t.guest}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
