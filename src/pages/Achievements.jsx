import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Medal, 
  Award,
  Zap,
  Target,
  Calendar,
  Clock,
  BookOpen,
  Brain,
  TrendingUp,
  Gift,
  Crown,
  Shield,
  Flame,
  CheckCircle,
  Lock,
  Sparkles,
  Users,
  BarChart3,
  Settings,
  Share2
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';

const Achievements = () => {
  const { studyStreak, totalStudyHours, notes, flashcards } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRewards, setShowRewards] = useState(false);
  const [userXP] = useState(150);

  // Achievement definitions
  const achievementDefinitions = [
    {
      id: 'first-note',
      title: 'Note Taker',
      description: 'Create your first smart note',
      icon: BookOpen,
      category: 'notes',
      xp: 50,
      rarity: 'common',
      unlocked: notes.length > 0,
      progress: Math.min(notes.length, 1),
      target: 1
    },
    {
      id: 'note-master',
      title: 'Note Master',
      description: 'Create 10 smart notes',
      icon: BookOpen,
      category: 'notes',
      xp: 200,
      rarity: 'rare',
      unlocked: notes.length >= 10,
      progress: Math.min(notes.length, 10),
      target: 10
    },
    {
      id: 'first-flashcard',
      title: 'Card Creator',
      description: 'Create your first flashcard',
      icon: Brain,
      category: 'flashcards',
      xp: 50,
      rarity: 'common',
      unlocked: flashcards.length > 0,
      progress: Math.min(flashcards.length, 1),
      target: 1
    },
    {
      id: 'flashcard-master',
      title: 'Memory Champion',
      description: 'Create 50 flashcards',
      icon: Brain,
      category: 'flashcards',
      xp: 300,
      rarity: 'epic',
      unlocked: flashcards.length >= 50,
      progress: Math.min(flashcards.length, 50),
      target: 50
    },
    {
      id: 'streak-week',
      title: 'Consistent Learner',
      description: 'Study for 7 days straight',
      icon: Flame,
      category: 'streaks',
      xp: 100,
      rarity: 'uncommon',
      unlocked: studyStreak >= 7,
      progress: Math.min(studyStreak, 7),
      target: 7
    },
    {
      id: 'streak-month',
      title: 'Dedication Master',
      description: 'Study for 30 days straight',
      icon: Crown,
      category: 'streaks',
      xp: 500,
      rarity: 'legendary',
      unlocked: studyStreak >= 30,
      progress: Math.min(studyStreak, 30),
      target: 30
    },
    {
      id: 'study-10h',
      title: 'Time Investor',
      description: 'Study for 10 total hours',
      icon: Clock,
      category: 'time',
      xp: 150,
      rarity: 'uncommon',
      unlocked: totalStudyHours >= 10,
      progress: Math.min(totalStudyHours, 10),
      target: 10
    },
    {
      id: 'study-100h',
      title: 'Scholar',
      description: 'Study for 100 total hours',
      icon: Trophy,
      category: 'time',
      xp: 1000,
      rarity: 'legendary',
      unlocked: totalStudyHours >= 100,
      progress: Math.min(totalStudyHours, 100),
      target: 100
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Complete a study session before 8 AM',
      icon: Star,
      category: 'special',
      xp: 75,
      rarity: 'uncommon',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'night-owl',
      title: 'Night Owl',
      description: 'Study after 10 PM',
      icon: Shield,
      category: 'special',
      xp: 75,
      rarity: 'uncommon',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      description: 'Get 100% accuracy in a flashcard session',
      icon: Target,
      category: 'performance',
      xp: 200,
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      target: 1
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Complete 50 flashcards in under 10 minutes',
      icon: Zap,
      category: 'performance',
      xp: 150,
      rarity: 'rare',
      unlocked: false,
      progress: 0,
      target: 1
    }
  ];

  // Filter achievements by category
  const filteredAchievements = selectedCategory === 'all' 
    ? achievementDefinitions 
    : achievementDefinitions.filter(achievement => achievement.category === selectedCategory);

  // Achievement categories
  const categories = [
    { id: 'all', label: 'All', icon: Trophy },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Brain },
    { id: 'streaks', label: 'Streaks', icon: Flame },
    { id: 'time', label: 'Time', icon: Clock },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'special', label: 'Special', icon: Star }
  ];

  // Rarity colors
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
      case 'uncommon': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'rare': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'epic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'legendary': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };



  // Calculate XP for next level
  const xpForNextLevel = (level) => {
    return level * 100;
  };

  // Get level progress
  const levelProgress = (userXP % 100) / 100 * 100;

  // Weekly challenges
  const weeklyChallenge = {
    title: 'Study Warrior',
    description: 'Study for 15 hours this week',
    progress: 8,
    target: 15,
    reward: '250 XP + Warrior Badge',
    timeLeft: '3 days'
  };

  // Leaderboard data (mock)
  const leaderboard = [
    { rank: 1, name: 'Alex Chen', xp: 2450, level: 25, badge: '👑' },
    { rank: 2, name: 'Sarah Wilson', xp: 2200, level: 22, badge: '🥈' },
    { rank: 3, name: 'Mike Johnson', xp: 1980, level: 20, badge: '🥉' },
    { rank: 4, name: 'You', xp: userXP, level: Math.floor(userXP / 100) + 1, badge: '⭐' },
    { rank: 5, name: 'Emma Davis', xp: 1650, level: 17, badge: '🎯' }
  ];



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Achievements & Rewards
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your progress and unlock achievements
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRewards(!showRewards)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Gift className="w-4 h-4" />
            <span>Rewards</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share Progress</span>
          </button>
        </div>
      </div>

      {/* User Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level & XP */}
        <div
          className="card p-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Level {Math.floor(userXP / 100) + 1}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {userXP} XP
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {xpForNextLevel(Math.floor(userXP / 100) + 2) - userXP} XP to next level
            </p>
                      </div>
          </div>

        {/* Achievements Unlocked */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {achievementDefinitions.filter(a => a.unlocked).length}
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                  /{achievementDefinitions.length}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Current Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {studyStreak} days
              </p>
            </div>
          </div>
        </motion.div>

        {/* Weekly Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Challenge</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {Math.round((weeklyChallenge.progress / weeklyChallenge.target) * 100)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {weeklyChallenge.timeLeft} left
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Challenge Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Challenge: {weeklyChallenge.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {weeklyChallenge.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Reward</p>
            <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
              {weeklyChallenge.reward}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Progress: {weeklyChallenge.progress}/{weeklyChallenge.target} hours
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {weeklyChallenge.timeLeft} remaining
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.target) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, index) => {
          const Icon = achievement.icon;
          const progressPercentage = (achievement.progress / achievement.target) * 100;
          
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card p-6 transition-all duration-300 ${
                achievement.unlocked 
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  achievement.unlocked 
                    ? 'bg-green-100 dark:bg-green-900' 
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    achievement.unlocked 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                  {achievement.unlocked && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {!achievement.unlocked && achievement.progress === 0 && (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              <h4 className={`text-lg font-semibold mb-2 ${
                achievement.unlocked 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {achievement.title}
              </h4>
              
              <p className={`text-sm mb-4 ${
                achievement.unlocked 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {achievement.description}
              </p>
              
              {/* Progress Bar */}
              {!achievement.unlocked && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* XP Reward */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.xp} XP
                  </span>
                </div>
                
                {achievement.unlocked && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Unlocked!
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weekly Leaderboard
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View Full Leaderboard →
          </button>
        </div>
        
        <div className="space-y-3">
          {leaderboard.map((user, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                user.name === 'You' 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' 
                  : 'bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  user.rank === 1 ? 'bg-yellow-500 text-white' :
                  user.rank === 2 ? 'bg-gray-400 text-white' :
                  user.rank === 3 ? 'bg-orange-500 text-white' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {user.rank}
                </div>
                <div>
                  <p className={`font-medium ${
                    user.name === 'You' 
                      ? 'text-primary-700 dark:text-primary-300' 
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {user.name} {user.badge}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Level {user.level}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  {user.xp} XP
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Rewards Modal */}
      <AnimatePresence>
        {showRewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRewards(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Available Rewards
                </h3>
                <button
                  onClick={() => setShowRewards(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Study Themes', cost: '500 XP', description: 'Unlock custom study themes' },
                  { name: 'Advanced Analytics', cost: '1000 XP', description: 'Detailed progress insights' },
                  { name: 'Profile Badges', cost: '200 XP', description: 'Show off your achievements' },
                  { name: 'Priority Support', cost: '2000 XP', description: 'Get help faster' }
                ].map((reward, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {reward.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {reward.description}
                      </p>
                    </div>
                    <button className={`px-3 py-1 rounded text-sm font-medium ${
                      userXP >= parseInt(reward.cost)
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}>
                      {reward.cost}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;