import React from 'react';
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Zap
} from 'lucide-react';
import useAppStore from '../stores/useAppStore';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const { 
    notes, 
    flashcards, 
    achievements, 
    studyStreak, 
    totalStudyHours 
  } = useAppStore();

  // Sample data for charts
  const weeklyStudyData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 3.5 },
  ];

  const subjectData = [
    { name: 'Mathematics', value: 30, color: '#3B82F6' },
    { name: 'Science', value: 25, color: '#10B981' },
    { name: 'History', value: 20, color: '#F59E0B' },
    { name: 'Literature', value: 15, color: '#EF4444' },
    { name: 'Other', value: 10, color: '#8B5CF6' },
  ];

  const stats = [
    {
      title: 'Total Study Hours',
      value: totalStudyHours.toFixed(1),
      icon: Clock,
      color: 'bg-blue-500',
      change: '+2.5h this week'
    },
    {
      title: 'Study Streak',
      value: studyStreak,
      icon: Zap,
      color: 'bg-yellow-500',
      change: 'days in a row'
    },
    {
      title: 'Notes Created',
      value: notes.length,
      icon: BookOpen,
      color: 'bg-green-500',
      change: '+3 this week'
    },
    {
      title: 'Flashcards',
      value: flashcards.length,
      icon: Brain,
      color: 'bg-purple-500',
      change: '+12 this week'
    }
  ];

  const recentAchievements = achievements.slice(-3);
  const upcomingGoals = [
    { title: 'Complete Mathematics Chapter 5', due: '2 days', progress: 75 },
    { title: 'Review 50 Flashcards', due: '1 day', progress: 60 },
    { title: 'Study 10 hours this week', due: '4 days', progress: 40 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to continue your learning journey?
            </p>
          </div>
          <button className="btn-primary">
            Start Studying
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Hours */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyStudyData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
                      </ResponsiveContainer>
          </div>

          {/* Subject Distribution */}
          <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study by Subject
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {subjectData.map((subject) => (
              <div key={subject.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {subject.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Achievements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Achievements
            </h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Complete your first study session to earn achievements!
              </p>
            </div>
          )}
        </div>

        {/* Upcoming Goals */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Goals
            </h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {upcomingGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.title}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.due}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {goal.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;