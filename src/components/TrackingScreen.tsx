import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mountain, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Flag, 
  Pause, 
  Play, 
  Square,
  Navigation,
  Sprout,
  ShieldAlert,
  Award,
  Sun,
  Cloud,
  CloudRain,
  Thermometer
} from 'lucide-react';
import { Language } from '../types';
import { MOCK_USER_STATS } from '../mockData';

interface TrackingScreenProps {
  onFinish: (stats: { elevation: number; distance: number; time: number; potatoesFound: number }) => void;
  onCancel: () => void;
  lang: Language;
}

type WeatherType = 'sunny' | 'cloudy' | 'rainy';

export const TrackingScreen: React.FC<TrackingScreenProps> = ({ onFinish, onCancel, lang }) => {
  const [isActive, setIsActive] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [distance, setDistance] = useState(0);
  const [potatoesFound, setPotatoesFound] = useState(0);
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPotatoPopup, setShowPotatoPopup] = useState(false);
  const [path, setPath] = useState<{lat: number, lng: number}[]>([]);
  const [weather, setWeather] = useState<WeatherType>('sunny');
  const [temp, setTemp] = useState(22);
  const [potatoesOnPath, setPotatoesOnPath] = useState<{ id: number, progress: number, collected: boolean, isRare: boolean }[]>([]);
  const [isLatestRare, setIsLatestRare] = useState(false);
  const [comments, setComments] = useState<{ id: number, text: string, top: number, duration: number }[]>([]);
  const weatherFetched = useRef(false);

  // Danmaku comments
  useEffect(() => {
    const texts = lang === 'ja' 
      ? [
          "がんばれ！", "あともう少し！", "ナイス登山！", "ポテトを探そう！", 
          "頂上はすぐそこ！", "いいペース！", "景色最高！", "おなかすいたね",
          "一歩一歩着実に！", "いい空気だ！", "水分補給も忘れずに", "ポテトレーダー反応あり",
          "山の神様が見てるぞ", "足元に気をつけて！", "ゴールで待ってるよ", "登山は楽しい！",
          "山ガール、ファイト！", "最高の1日だね", "空がきれい！"
        ] 
      : [
          "Good Job!", "Keep going!", "Nearly there!", "Find the spuds!", 
          "Peak is in sight!", "Nice pace!", "Look at that view!", "Stay hydrated!",
          "One step at a time", "Fresh air feels great", "Potato radar active!", "Watch your step",
          "Adventure awaits!", "You're doing amazing!", "Summit is close!", "Enjoy the climb!",
          "Mountain Girl Power!", "Best day ever!", "Sky is blue!"
        ];
    
    const interval = setInterval(() => {
      const id = Date.now();
      const newComment = {
        id,
        text: texts[Math.floor(Math.random() * texts.length)],
        top: 20 + Math.random() * 60, // Avoid header/footer mainly
        duration: 8 + Math.random() * 7 // Slow movement
      };
      setComments(prev => [...prev, newComment]);
      // Cleanup after duration
      setTimeout(() => {
        setComments(prev => prev.filter(c => c.id !== id));
      }, newComment.duration * 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, [lang]);

  // Map elevation to a percentage (0-100%) for the display
  // Assume a small beginner peak is ~100m for visual mapping
  const verticalProgress = Math.min((elevation / 100) * 100, 100);

  // Difficulty-based Luck: Higher elevation = higher rare chance
  const rareChance = useMemo(() => {
    // Base 5% + up to 15% extra based on elevation progress
    return Math.min(5 + (verticalProgress * 0.15), 20);
  }, [verticalProgress]);

  useEffect(() => {
    // Pre-populate some potatoes on the path at RANDOM progress points
    const initialPotatoes = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      progress: 10 + Math.random() * 80, // Random 10-90%
      collected: false,
      isRare: Math.random() < 0.05 // Initial small chance for rare
    }));
    setPotatoesOnPath(initialPotatoes);
  }, []);

  const watchId = useRef<number | null>(null);

  // Fetch real weather based on coordinates
  useEffect(() => {
    if (lastPosition && !weatherFetched.current) {
      const fetchWeather = async () => {
        try {
          const { latitude, longitude } = lastPosition.coords;
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
          const data = await response.json();
          if (data.current) {
            const code = data.current.weather_code;
            setTemp(Math.round(data.current.temperature_2m));
            
            // Map WMO codes: 0=clear, 1-3=partly cloudy, >3=rain/snow/etc
            if (code === 0) setWeather('sunny');
            else if (code >= 1 && code <= 3) setWeather('cloudy');
            else setWeather('rainy');
            
            weatherFetched.current = true;
          }
        } catch (err) {
          console.error("Weather fetch failed", err);
        }
      };
      fetchWeather();
    }
  }, [lastPosition]);

  // Generate a complex mountain path for the visual
  const mountainPathPoints = useMemo(() => {
    const points = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Winding path logic: a mix of sine waves
        const x = 50 + 25 * Math.sin(t * Math.PI * 4) * Math.cos(t * Math.PI);
        const y = 145 - 130 * t;
        points.push({ x, y });
    }
    return points;
  }, []);

  const mountainPathD = useMemo(() => {
    return "M " + mountainPathPoints.map(p => `${p.x},${p.y}`).join(" L ");
  }, [mountainPathPoints]);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setSeconds(s => s + 1);
        
        // Randomly spawn a new potato occasionally
        if (Math.random() < 0.02 && verticalProgress < 90) {
           const isRareSpawn = Math.random() < (rareChance / 100);
           setPotatoesOnPath(prev => [
             ...prev,
             { 
               id: Date.now(), 
               progress: Math.min(verticalProgress + 5 + Math.random() * 15, 98), 
               collected: false,
               isRare: isRareSpawn
             }
           ]);
        }

        // Auto-collect potatoes near the player's progress
        setPotatoesOnPath(prev => {
          let foundNew = false;
          let wasRare = false;
          
          const next = prev.map(p => {
            if (!p.collected && Math.abs(p.progress - verticalProgress) < 2.5) {
               foundNew = true;
               wasRare = p.isRare;
               return { ...p, collected: true };
            }
            return p;
          });

          if (foundNew) {
            setPotatoesFound(pf => pf + (wasRare ? 3 : 1)); // Rare counts as 3!
            setIsLatestRare(wasRare);
            setShowPotatoPopup(true);
            setTimeout(() => setShowPotatoPopup(false), wasRare ? 2500 : 2000);
          }
          return next;
        });

        // Simulate elevation gain if no GPS
        if (!lastPosition) {
           setElevation(e => e + Math.random() * 0.5);
           setDistance(d => d + Math.random() * 0.01);
           
           // Simulate movement for the path demo if no GPS
           setPath(prev => [
             ...prev, 
             { 
               lat: (prev[prev.length - 1]?.lat || 35.6895) + (Math.random() - 0.5) * 0.0001,
               lng: (prev[prev.length - 1]?.lng || 139.6917) + (Math.random() - 0.5) * 0.0001
             }
           ].slice(-50)); // Keep last 50 points
        }
      }, 1000);

      if ("geolocation" in navigator) {
        watchId.current = navigator.geolocation.watchPosition(
          (position) => {
            const newPoint = { lat: position.coords.latitude, lng: position.coords.longitude };
            setPath(prev => [...prev, newPoint]);

            if (lastPosition) {
              const d = calculateDistance(
                lastPosition.coords.latitude,
                lastPosition.coords.longitude,
                position.coords.latitude,
                position.coords.longitude
              );
              setDistance(prev => prev + d);
            }
            
            if (position.coords.altitude !== null) {
               // Only update if it's an increase for simplicity
               if (lastPosition?.coords.altitude !== null && position.coords.altitude > (lastPosition?.coords.altitude || 0)) {
                  setElevation(prev => prev + (position.coords.altitude! - (lastPosition?.coords.altitude || position.coords.altitude!)));
               }
            }
            
            setLastPosition(position);
            setError(null);
          },
          (err) => {
            console.error("Geolocation error:", err);
            setError(lang === 'ja' ? 'GPS信号を取得できません' : 'Could not get GPS signal');
          },
          { enableHighAccuracy: true }
        );
      }

      return () => {
        clearInterval(interval);
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
      }
    }
  }, [isActive, lastPosition, lang, showPotatoPopup]);

  // Helper to draw path in SVG
  const getPathData = () => {
    if (path.length < 2) return "";
    
    const lats = path.map(p => p.lat);
    const lngs = path.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const latRange = maxLat - minLat || 0.0001;
    const lngRange = maxLng - minLng || 0.0001;
    
    // Project to 200x200 SVG space with 20px padding
    const project = (p: {lat: number, lng: number}) => {
      const x = 20 + ((p.lng - minLng) / lngRange) * 160;
      const y = 180 - ((p.lat - minLat) / latRange) * 160; // Flip Y for lat
      return `${x},${y}`;
    };
    
    return "M " + path.map(project).join(" L ");
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const t = {
    ja: {
       tracking: '冒険中！',
       paused: '休憩中',
       elevation: 'のぼった高さ',
       distance: 'あるいた距離',
       time: 'あそんだ時間',
       potatoes: 'ゲットしたポテト',
       finish: 'ぼうけん終了',
       resume: 'つづける',
       pause: 'ちょっと休憩',
       cancel: 'やめる',
       alert: '電波がよわいかも？',
       found: 'ポテトを発見！',
       rareFound: '超レア・ポテト！！！',
       luck: 'レア遭遇率',
    },
    en: {
       tracking: 'On Adventure!',
       paused: 'Resting',
       elevation: 'Height',
       distance: 'Distance',
       time: 'Time',
       potatoes: 'Potatoes Get!',
       finish: 'End Adventure',
       resume: 'Resume',
       pause: 'Rest',
       cancel: 'Cancel',
       alert: 'Weak Signal',
       found: 'Potato Found!',
       rareFound: 'ULTRA RARE POTATO!!!',
       luck: 'Rare Luck'
    }
  }[lang];

  return (
    <div className="fixed inset-0 z-[100] bg-mountain-bg flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ring-4 ${isActive ? 'bg-mountain-primary ring-mountain-primary/10 animate-pulse' : 'bg-gray-400 ring-gray-200'}`}>
             {isActive ? <Navigation className="w-5 h-5 text-white animate-bounce" /> : <Pause className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-cute font-bold text-mountain-primary">
              {isActive ? t.tracking : t.paused}
            </h2>
            <div className="flex items-center gap-2">
               <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`} />
               <span className="text-[10px] font-black text-mountain-accent uppercase tracking-widest">
                  {isActive ? 'QUEST IN PROGRESS' : 'GAME PAUSED'}
               </span>
            </div>
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="p-2 bg-white/50 rounded-full text-mountain-accent hover:text-red-500 transition-colors shadow-sm"
        >
          <Square className="w-5 h-5" />
        </button>
      </div>

      {/* Main Metrics Card */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Game-like Progress Visual */}
        <div className={`rounded-[2.5rem] p-4 border border-white shadow-xl relative overflow-hidden h-80 flex flex-col items-center justify-between ${
          weather === 'sunny' ? 'bg-[#e0f2fe]' : 
          weather === 'cloudy' ? 'bg-[#f1f5f9]' : 'bg-[#e0e7ff]'
        }`}>
           {/* Danmaku Layer */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <AnimatePresence>
                {comments.map(comment => (
                  <motion.div
                    key={comment.id}
                    initial={{ x: '100vw', opacity: 0 }}
                    animate={{ x: '-100vw', opacity: 1 }}
                    transition={{ duration: comment.duration, ease: "linear" }}
                    className="absolute whitespace-nowrap text-mountain-primary/80 font-black text-sm italic drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
                    style={{ top: `${comment.top}%` }}
                  >
                    {comment.text}
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>

           {/* Recursive Dot Pattern Background for texture */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

           {/* Decorative Background Elements - Flowers/Trees */}
           <div className="absolute inset-x-0 bottom-8 flex justify-around opacity-40 pointer-events-none z-0">
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                <Sprout className="w-8 h-8 text-green-500" />
              </motion.div>
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }}>
                <Sprout className="w-6 h-6 text-green-400" />
              </motion.div>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 5 }}>
                <div className="w-12 h-12 bg-green-200/40 rounded-full blur-md" />
              </motion.div>
           </div>

           {/* Atmospheric Effects */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
              {weather === 'sunny' && (
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-yellow-300/10 rounded-full blur-[60px]" />
              )}
              {weather === 'rainy' && Array.from({ length: 15 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 400, opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 0.8 + Math.random(), 
                    repeat: Infinity, 
                    delay: Math.random() * 2,
                    ease: "linear"
                  }}
                  className="absolute w-[1px] h-3 bg-blue-400/60"
                  style={{ left: `${Math.random() * 100}%` }}
                />
              ))}
              {weather === 'cloudy' && Array.from({ length: 3 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ x: [ -50, 250 ] }}
                  transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
                  className="absolute opacity-30"
                  style={{ top: `${15 + i * 20}%` }}
                >
                  <Cloud className="w-16 h-16 text-slate-400" />
                </motion.div>
              ))}
           </div>

           {/* Weather Info Pill - Moved Inside */}
           <div className="absolute top-4 left-4 z-40 flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white shadow-sm ring-1 ring-black/5">
              {weather === 'sunny' && <Sun className="w-4 h-4 text-orange-400" />}
              {weather === 'cloudy' && <Cloud className="w-4 h-4 text-slate-400" />}
              {weather === 'rainy' && <CloudRain className="w-4 h-4 text-blue-400" />}
              <div className="flex items-center gap-0.5 text-mountain-primary">
                  <Thermometer className="w-3 h-3 opacity-50" />
                  <span className="text-[10px] font-black">{temp}°C</span>
              </div>
           </div>

           {/* Luck Meter Indicator */}
           <div className="absolute top-20 right-4 z-40 bg-white/70 backdrop-blur-md px-2 py-1 rounded-xl border border-white/50 shadow-sm flex flex-col items-center min-w-[65px]">
              <span className="text-[6px] font-black text-amber-600 uppercase tracking-tighter">{t.luck}</span>
              <div className="flex items-center gap-1">
                 <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-1 h-1 rounded-full ${rareChance > (i * 5) ? 'bg-amber-400' : 'bg-gray-200'}`} />
                    ))}
                 </div>
                 <span className="text-[8px] font-black text-mountain-primary">{rareChance.toFixed(1)}%</span>
              </div>
           </div>

           {/* Rare types info below luck */}
           <div className="absolute top-28 right-4 z-40 bg-white/40 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/40 shadow-sm flex flex-col items-end ring-1 ring-black/5">
              <div className="flex items-center gap-1 mb-1 opacity-80">
                 <div className="w-1 h-1 bg-amber-500 rounded-full animate-ping" />
                 <span className="text-[6px] font-black text-mountain-primary uppercase tracking-tighter">{lang === 'ja' ? 'ご当地レア出現中' : 'Localized Rares'}</span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                 <span className="text-[8px] font-bold text-orange-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">✨ {lang === 'ja' ? '黄金のポテト' : 'Golden Spud'}</span>
                 <span className="text-[8px] font-bold text-purple-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">✨ {lang === 'ja' ? '山の宝石' : 'Peak Gem'}</span>
              </div>
           </div>

           {/* Progress Ring / Percentage */}
           <div className="absolute top-4 right-4 z-40 bg-white/90 rounded-2xl p-2.5 border border-white shadow-lg flex flex-col items-center min-w-[65px]">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                  <motion.circle 
                    cx="16" cy="16" r="14" 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                    strokeDasharray="88"
                    animate={{ strokeDashoffset: 88 - (88 * verticalProgress / 100) }}
                  />
                </svg>
                <div className="absolute text-[8px] font-black text-mountain-primary">
                  {Math.round(verticalProgress)}%
                </div>
              </div>
           </div>

           {/* Stylized Mountain Path Area */}
           <div className="relative w-full h-full flex items-center justify-center py-12">
             {/* The Goal (Summit) */}
             <motion.div 
               animate={{ y: [0, -0.5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-0 flex flex-col items-center z-20"
             >
               <div className="relative">
                 {/* App-like Mountain Base */}
                 <div className="bg-mountain-primary p-2.5 rounded-xl shadow-xl border-2 border-white ring-8 ring-mountain-primary/10">
                   <Mountain className="w-5 h-5 text-white" />
                 </div>
                 {/* Flag "on top" */}
                 <div className="absolute -top-3 -right-2 bg-amber-400 p-1 rounded-lg border-2 border-white shadow-sm rotate-12">
                   <Flag className="w-3 h-3 text-white fill-white" />
                 </div>
                 
                 <motion.div 
                   animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute -top-8 left-1/2 -translate-x-1/2 text-amber-500"
                 >
                    <Award className="w-4 h-4" />
                 </motion.div>
               </div>
               <span className="text-[10px] font-black text-mountain-primary mt-3 bg-white/80 px-3 py-1 rounded-full border border-mountain-primary/20 shadow-sm">SUMMIT</span>
             </motion.div>

             {/* Progress Path (Abstract Dirt Path) */}
             <svg viewBox="0 0 100 150" className="w-full h-[80%] overflow-visible">
                {/* Outline/Shadow of the path */}
                <motion.path 
                  d={mountainPathD}
                  fill="none" 
                  stroke="#4b2c00" 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  className="opacity-5"
                />
                {/* Main Path */}
                <motion.path 
                  d={mountainPathD}
                  fill="none" 
                  stroke="#d97706" 
                  strokeWidth="6" 
                  strokeLinecap="round" 
                  strokeDasharray="200"
                  initial={{ strokeDashoffset: 200 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 2 }}
                  className="opacity-20"
                />
                {/* Visual "Dirt" texture along path */}
                {mountainPathPoints.filter((_, idx) => idx % 8 === 0).map((p, i) => (
                  <circle 
                    key={i}
                    cx={p.x + (Math.random() - 0.5) * 4}
                    cy={p.y + (Math.random() - 0.5) * 4}
                    r={0.8 + Math.random() * 1.5}
                    fill="#4b2c00"
                    className="opacity-10"
                  />
                ))}

                {/* Visible Potatoes on Path */}
                {potatoesOnPath.map(pot => !pot.collected && (
                  <motion.g 
                    key={pot.id} 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transform={`translate(${mountainPathPoints[Math.floor(pot.progress)].x}, ${mountainPathPoints[Math.floor(pot.progress)].y})`}
                  >
                    <motion.text
                      x="-6"
                      y="6"
                      animate={{ 
                        scale: pot.isRare ? [1, 1.4, 1] : [1, 1.2, 1],
                        rotate: pot.isRare ? [0, 20, -20, 0] : [0, 10, -10, 0]
                      }}
                      transition={{ duration: pot.isRare ? 1 : 2, repeat: Infinity }}
                      className={`text-[12px] select-none ${pot.isRare ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : ''}`}
                    >
                      {pot.isRare ? '🥔✨' : '🥔'}
                    </motion.text>
                    <circle 
                      r={pot.isRare ? "12" : "8"} 
                      fill={pot.isRare ? "rgba(251, 191, 36, 0.4)" : "rgba(251, 191, 36, 0.2)"} 
                      className="animate-pulse" 
                    />
                  </motion.g>
                ))}
             </svg>

             {/* The Climber (Current Position mapping to path points) */}
             {mountainPathPoints.length > 0 && (
               <motion.div 
                 className="absolute z-30"
                 style={{ 
                   // Map path points (0-100 x 0-150) to container percentage
                   left: `${mountainPathPoints[Math.min(Math.floor(verticalProgress), mountainPathPoints.length - 1)].x}%`,
                   top: `${(mountainPathPoints[Math.min(Math.floor(verticalProgress), mountainPathPoints.length - 1)].y / 150) * 100}%`,
                 }}
                 animate={{ 
                   x: "-50%",
                   y: ["-50%", "-51%", "-50%"],
                   rotate: [-0.3, 0.3, -0.3]
                 }}
                 transition={{ 
                   y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                   rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                 }}
               >
                  <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl border-4 border-pink-400/30 flex items-center justify-center text-2xl overflow-hidden ring-8 ring-pink-100/50">
                       {MOCK_USER_STATS.avatar}
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-pink-400 rounded-2xl -z-10" 
                    />
                    
                    {/* Status Bubble */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-pink-600 text-[7px] font-black px-2 py-1 rounded-lg shadow-md border border-pink-50">
                      {verticalProgress < 50 ? "GO! GO!" : "NEAR SUMMIT!"}
                    </div>
                  </div>
               </motion.div>
             )}

             {/* Starting Point */}
             <div className="absolute bottom-2 flex flex-col items-center">
               <div className="w-10 h-2 bg-mountain-accent/30 rounded-full blur-[2px]" />
               <span className="text-[8px] font-black text-mountain-accent uppercase tracking-widest mt-1">START</span>
             </div>
           </div>

        </div>


        {/* Stats Grid - Single Row */}
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-white text-center">
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-mountain-primary/40" />
                <span className="text-[8px] font-black text-mountain-accent tracking-widest uppercase truncate w-full">{t.time}</span>
                <p className="text-lg font-cute font-bold text-mountain-primary truncate w-full">{formatTime(seconds)}</p>
              </div>
           </div>
           <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-white text-center">
              <div className="flex flex-col items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-mountain-primary/40" />
                <span className="text-[8px] font-black text-mountain-accent tracking-widest uppercase truncate w-full">{t.elevation}</span>
                <p className="text-lg font-cute font-bold text-mountain-primary truncate w-full">{elevation.toFixed(1)}<span className="text-[10px] ml-0.5">m</span></p>
              </div>
           </div>
           <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-white text-center">
              <div className="flex flex-col items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-mountain-primary/40" />
                <span className="text-[8px] font-black text-mountain-accent tracking-widest uppercase truncate w-full">{t.distance}</span>
                <p className="text-lg font-cute font-bold text-mountain-primary truncate w-full">{distance.toFixed(2)}<span className="text-[10px] ml-0.5">km</span></p>
              </div>
           </div>
        </div>

        {/* Potatoes Found */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2.5rem] p-6 shadow-xl border border-white relative overflow-hidden group">
           <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/80 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                    <Sprout className="w-6 h-6 text-amber-600" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-mountain-primary">{t.potatoes}</h3>
                    <p className="text-2xl font-cute font-bold text-amber-900">{potatoesFound}</p>
                 </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                 <Award className="w-6 h-6 text-amber-600/30" />
              </div>
           </div>
           {/* Animated Background */}
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl pointer-events-none"
           />
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold"
          >
             <ShieldAlert className="w-5 h-5 flex-shrink-0" />
             {error}
          </motion.div>
        )}
      </div>

      {/* Popups */}
      <AnimatePresence>
        {showPotatoPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[110] flex flex-col items-center gap-4"
          >
             {/* RPG Flash Effect */}
             <motion.div 
               initial={{ opacity: 0, scale: 0 }}
               animate={{ opacity: [0, 0.8, 0], scale: [0, 6, 2.5] }}
               transition={{ duration: 0.8 }}
               className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full blur-3xl -z-10 ${isLatestRare ? 'bg-orange-400' : 'bg-yellow-400'}`}
             />
             
             <div className={`bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 flex flex-col items-center gap-4 relative overflow-hidden ${isLatestRare ? 'border-orange-500 ring-8 ring-orange-500/20' : 'border-amber-400'}`}>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{ 
                    backgroundImage: `radial-gradient(circle, ${isLatestRare ? '#f97316' : '#fbbf24'} 2px, transparent 2px)`, 
                    backgroundSize: '16px 16px' 
                  }}
                />
                
                <div className="relative">
                  <div className={`text-7xl drop-shadow-xl animate-bounce ${isLatestRare ? 'scale-125' : ''}`}>
                    {isLatestRare ? '🥔🤴' : '🥔'}
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.2 }}
                    className={`absolute -top-4 -right-4 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-black border-4 border-white shadow-lg ${isLatestRare ? 'bg-orange-600' : 'bg-orange-500'}`}
                  >
                    {isLatestRare ? '★' : '!'}
                  </motion.div>
                </div>

                <div className="flex flex-col items-center">
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`${isLatestRare ? 'bg-orange-500' : 'bg-amber-400'} text-white px-4 py-1 rounded-full font-black text-[10px] shadow-md uppercase tracking-widest mb-1`}
                  >
                    {isLatestRare ? 'Ultra Rare Found!' : 'Item Obtained'}
                  </motion.div>
                  <p className={`text-2xl font-cute font-bold text-mountain-primary ${isLatestRare ? 'text-orange-900 border-b-2 border-orange-200 pb-1' : ''}`}>
                    {isLatestRare ? t.rareFound : t.found}
                  </p>
                  {isLatestRare && (
                    <motion.span 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-[10px] font-black text-orange-600 mt-2"
                    >
                      +3 POTATO SCORE!
                    </motion.span>
                  )}
                </div>
             </div>
             
             {/* Floating particles */}
             {Array.from({ length: isLatestRare ? 24 : 12 }).map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                 animate={{ 
                   opacity: 0, 
                   x: (Math.random() - 0.5) * (isLatestRare ? 450 : 300), 
                   y: (Math.random() - 0.5) * (isLatestRare ? 450 : 300),
                   scale: 0.5,
                   rotate: Math.random() * 360
                 }}
                 transition={{ duration: isLatestRare ? 1.2 : 0.8, ease: "easeOut" }}
                 className={`absolute w-3 h-3 rounded-lg shadow-sm ${isLatestRare ? 'bg-orange-400' : 'bg-amber-400'}`}
               />
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-4 px-2">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`flex-1 py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 transition-all shadow-lg text-white ${isActive ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isActive ? (
            <>
              <Pause className="w-6 h-6" />
              <span>{t.pause}</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>{t.resume}</span>
            </>
          )}
        </button>
        
        <button 
          onClick={() => onFinish({ elevation, distance, time: seconds, potatoesFound })}
          className="flex-1 py-5 bg-mountain-primary rounded-[2rem] font-bold text-white flex items-center justify-center gap-3 shadow-lg hover:bg-mountain-primary/90"
        >
          <Flag className="w-6 h-6" />
          <span>{t.finish}</span>
        </button>
      </div>
    </div>
  );
};
