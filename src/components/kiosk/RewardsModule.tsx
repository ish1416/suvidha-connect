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
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            {text.title}
          </h1>
          <p className="text-slate-500">{text.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stats Card */}
        <Card className="lg:col-span-2 border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full -mr-8 -mt-8" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-slate-500 uppercase tracking-wider">{text.points}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-6xl font-bold text-slate-900">{points}</span>
              <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 mb-2 ${level.bg} ${level.color} border ${level.border}`}>
                <Award className="w-4 h-4" />
                {level.name}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{text.level}</span>
                <span className="text-slate-600">{nextLevel} {text.cost} ({text.next})</span>
              </div>
              <Progress value={progress} className="h-3 bg-slate-100" indicatorClassName="bg-gradient-to-r from-yellow-400 to-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-slate-200 shadow-sm bg-slate-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-yellow-600" />
              {text.leaderboard}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaderboard.map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    user.rank === 1 ? 'bg-yellow-500' : 
                    user.rank === 2 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {user.rank}
                  </div>
                  <span className="font-medium text-slate-700">{user.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-600">{user.points}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Rewards Grid */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-pink-500" />
          {text.redeem}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <Card key={reward.id} className={`border-slate-200 transition-all hover:shadow-md ${points >= reward.cost ? 'opacity-100 cursor-pointer hover:border-blue-300' : 'opacity-60 cursor-not-allowed'}`}>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <reward.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{reward.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{reward.desc}</p>
                </div>
                <Button className={`w-full mt-2 ${points >= reward.cost ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 text-slate-400'}`} disabled={points < reward.cost}>
                  {points >= reward.cost ? 'Redeem' : 'Locked'} • {reward.cost} {text.cost}
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
