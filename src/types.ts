export type Language = 'ja' | 'en';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type AppStep = 'login' | 'farm' | 'home' | 'questionnaire' | 'loading' | 'results' | 'checklist' | 'collection' | 'profile' | 'create-plan' | 'tracking';

export interface UserPreferences {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  experience: 'none' | 'some' | 'experienced';
  frequency: 'first_time' | 'few_times_year' | 'monthly' | 'weekly';
  elevationGainPref: 'low' | 'moderate' | 'high';
  transportation: 'public' | 'car';
  region: string;
  duration: 'day_trip' | 'overnight';
  cableCar: 'prefer' | 'avoid' | 'any';
  priority: 'scenery' | 'achievement';
  language: Language;
  season: Season;
}

export interface Potato {
  id: string;
  name: string;
  scientificName?: string;
  region: string;
  unlockCondition: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  difficulty: string;
  isUnlocked: boolean;
  image?: string;
}

export interface ClimbLog {
  id: string;
  mountainName: string;
  date: string;
  elevation: number;
  distance: number;
  duration: string;
  potatoesEarned: number;
  rarestPotatoFound?: string; // The specific rare potato found here
}

export interface ClimbingKnowledge {
  id: string;
  level: number;
  title: string;
  content: string;
  category: 'gear' | 'safety' | 'technique';
  icon?: string;
}

export interface Gear {
  id: string;
  name: string;
  category: 'shoes' | 'backpack' | 'clothing' | 'accessory' | 'special';
  level: 1 | 2 | 3 | 4; // 1: Beginner, 2: Intermediate, 3: Advanced, 4: Special
  icon: string;
  description: string;
}

export interface ClimbingPlan {
  id: string;
  mountainName: string;
  date: string;
  meetupLocation: string;
  meetupTime: string;
  isPublic: boolean;
  notes: string;
  participants: string[];
  requiredGear?: string;
  experienceLevel?: string;
  hasInsurance: boolean;
  elevationGain?: number;
  distance?: number;
  estPotatoesMin?: number;
  estPotatoesMax?: number;
}

export interface UserStats {
  nickname: string;
  level: number;
  totalPotatoes: number;
  potatoesToNextLevel: number;
  rankName: string;
  totalClimbs: number;
  totalElevation: number;
  rarestPotatoType: string;
  lastClimbDifficulty?: 'beginner' | 'intermediate' | 'advanced' | 'fuji';
  recentLogs?: ClimbLog[];
  ownedGearIds?: string[];
  plans?: ClimbingPlan[];
  avatar?: string;
}

export interface Friend {
  id: string;
  nickname: string;
  level: number;
  avatar: string;
  isOnline: boolean;
}

export interface ChecklistItem {
  id: string;
  name: string;
  isImportant: boolean;
  category: 'basic' | 'clothing' | 'food' | 'safety' | 'advance';
}

export interface MountainRoute {
  name: string;
  location: string;
  elevation: number;
  elevationGain: number; // 累計標高
  difficulty: string;
  difficultyLevel: number; // 1-5
  estimatedTime: string;
  transportAccess: string;
  mandatoryGear: string[];
  description: string;
  features: string[];
  reason: string;
}

export interface RecommendationResponse {
  recommendations: MountainRoute[];
  nextSteps: MountainRoute[];
}
