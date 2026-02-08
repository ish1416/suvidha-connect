import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Award, Trophy, Star, TrendingUp, Gift, Crown, Medal } from 'lucide-react';

interface RewardsModuleProps {
  onBack: () => void;
}

const RewardsModule: React.FC<RewardsModuleProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const { citizen, language } = useAuth();

  const points = citizen?.points || 0;
  const nextLevel = 500;
  const progress = (points / nextLevel) * 100;

  const getLevel = (pts: number) => {
    if (pts >= 1000) return { name: 'Platinum', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
    if (pts >= 500) return { name: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    if (pts >= 200) return { name: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' };
    return { name: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
  };

  const level = getLevel(points);

  const leaderboard = [
    { name: 'Amit Verma', points: 1250, rank: 1 },
    { name: 'Sneha Gupta', points: 980, rank: 2 },
    { name: 'Rahul Singh', points: 850, rank: 3 },
  ];

  const rewards = [
    { id: 1, title: 'Priority Service', cost: 500, icon: Star, desc: 'Skip the queue at any civic center' },
    { id: 2, title: 'Bill Discount', cost: 1000, icon: Gift, desc: '₹100 off on your next electricity bill' },
    { id: 3, title: 'Tree Plantation', cost: 300, icon: TrendingUp, desc: 'Donate points to plant a tree in your name' },
  ];

  const translations = {
    en: {
      title: 'Suvidha Rewards',
      subtitle: 'Earn points for being a responsible citizen',
      points: 'Your Points',
      level: 'Current Level',
      next: 'Next Level',
      leaderboard: 'Neighborhood Leaderboard',
      redeem: 'Redeem Rewards',
      cost: 'pts',
      back: 'Back',
      history: 'Recent Activity'
    },
    hi: {
      title: 'सुविधा रिवॉर्ड्स',
      subtitle: 'जिम्मेदार नागरिक बनने के लिए अंक अर्जित करें',
      points: 'आपके अंक',
      level: 'वर्तमान स्तर',
      next: 'अगला स्तर',
      leaderboard: 'पड़ोस लीडरबोर्ड',
      redeem: 'रिवॉर्ड्स भुनाएं',
      cost: 'अंक',
      back: 'वापस',
      history: 'हाल की गतिविधि'
    }
  };

  const text = language === 'en' ? translations.en : translations.hi;

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-500 max-w-7xl mx-auto p-6 overflow-y-auto">
      {/* Header Section */}
      <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack} 
          className="h-12 w-12 rounded-full bg-white shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-300 border border-blue-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="p-2 bg-yellow-100 rounded-xl border border-yellow-200">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            {text.title}
          </h1>
          <p className="text-lg text-slate-600 mt-1 font-medium">{text.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Card */}
        <Card className="lg:col-span-2 border-slate-200 shadow-md overflow-hidden relative bg-gradient-to-br from-white to-slate-50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-4 pt-8 px-8">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              {text.points}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
              <span className="text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tighter drop-shadow-sm">
                {points}
              </span>
              <div className={`px-4 py-2 rounded-2xl text-base font-bold flex items-center gap-2 mb-4 shadow-sm ${level.bg} ${level.color} border ${level.border} ring-1 ring-black/5`}>
                <Award className="w-5 h-5" />
                {level.name}
              </div>
            </div>

            <div className="space-y-3 bg-white/60 p-6 rounded-2xl border border-white/50 shadow-inner backdrop-blur-sm">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-slate-700">{text.level}</span>
                <span className="text-blue-700">{nextLevel - points} {text.cost} to {text.next}</span>
              </div>
              <Progress 
                value={progress} 
                className="h-5 bg-slate-200/80 rounded-full border border-slate-100" 
                indicatorClassName="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full shadow-lg" 
              />
              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>0</span>
                <span>{nextLevel}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-slate-200 shadow-md bg-white overflow-hidden flex flex-col">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <div className="p-1.5 bg-yellow-100 rounded-lg">
                <Crown className="w-5 h-5 text-yellow-700" />
              </div>
              {text.leaderboard}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none">
            <div className="divide-y divide-slate-100">
              {leaderboard.map((user, index) => (
                <div key={user.rank} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-default group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm transform transition-transform group-hover:scale-110 ${
                      user.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : 
                      user.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' : 
                      user.rank === 3 ? 'bg-gradient-to-br from-orange-300 to-orange-500' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.rank}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">{user.name}</span>
                      {user.rank === 1 && <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">Top Neighbor</span>}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">{user.points}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards Grid */}
      <div className="pb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-xl border border-pink-200">
            <Gift className="w-6 h-6 text-pink-600" />
          </div>
          {text.redeem}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <Card key={reward.id} className={`group border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden ${points >= reward.cost ? 'bg-white cursor-pointer hover:border-blue-300 ring-1 ring-transparent hover:ring-blue-200' : 'bg-slate-50 opacity-80 cursor-not-allowed'}`}>
              {points >= reward.cost && <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />}
              
              <CardContent className="p-8 flex flex-col gap-6 h-full">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    points >= reward.cost ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-sm' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <reward.icon className="w-7 h-7" />
                  </div>
                  <span className={`font-mono font-bold text-sm px-3 py-1 rounded-full border ${
                    points >= reward.cost ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-200 text-slate-500 border-slate-300'
                  }`}>
                    {reward.cost} {text.cost}
                  </span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{reward.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{reward.desc}</p>
                </div>
                
                <Button 
                  className={`w-full h-12 rounded-xl font-bold tracking-wide shadow-sm transition-all ${
                    points >= reward.cost 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 text-white border-0' 
                      : 'bg-slate-200 text-slate-400 hover:bg-slate-200 border border-slate-300'
                  }`} 
                  disabled={points < reward.cost}
                >
                  {points >= reward.cost ? (
                    <span className="flex items-center gap-2">
                      {text.redeem} <ArrowLeft className="w-4 h-4 rotate-180" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Medal className="w-4 h-4" /> Locked
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsModule;
