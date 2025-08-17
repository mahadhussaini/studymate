import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Target,
  BookOpen,
  Brain,
  Trophy,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Users,
  Award,
  Star,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  Share2
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import useAppStore from '../stores/useAppStore';

const Analytics = () => {
  const { studyStreak } = useAppStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('study-time');

  // Generate mock study data for better visualization
  const generateStudyData = (days) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      data.push({
        date: format(date, 'MMM dd'),
        fullDate: date,
        studyTime: Math.floor(Math.random() * 4) + 1,
        flashcardsSeen: Math.floor(Math.random() * 20) + 5,
        notesCreated: Math.floor(Math.random() * 3),
        accuracy: Math.floor(Math.random() * 30) + 70,
        focus: Math.floor(Math.random() * 20) + 80,
        completion: Math.floor(Math.random() * 25) + 75
      });
    }
    return data;
  };

  const studyData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return generateStudyData(days);
  }, [timeRange]);

  // Subject performance data
  const subjectData = [
    { subject: 'Mathematics', hours: 25, progress: 85, color: '#3B82F6' },
    { subject: 'Science', hours: 20, progress: 72, color: '#10B981' },
    { subject: 'History', hours: 15, progress: 90, color: '#F59E0B' },
    { subject: 'Literature', hours: 12, progress: 68, color: '#EF4444' },
    { subject: 'Languages', hours: 8, progress: 78, color: '#8B5CF6' }
  ];

  // Performance radar data
  const performanceData = [
    { subject: 'Focus', A: 85, B: 90, fullMark: 100 },
    { subject: 'Accuracy', A: 78, B: 85, fullMark: 100 },
    { subject: 'Speed', A: 92, B: 88, fullMark: 100 },
    { subject: 'Retention', A: 88, B: 82, fullMark: 100 },
    { subject: 'Consistency', A: 76, B: 79, fullMark: 100 },
    { subject: 'Improvement', A: 94, B: 87, fullMark: 100 }
  ];

  // Learning efficiency data
  const efficiencyData = studyData.map(day => ({
    ...day,
    efficiency: Math.round((day.accuracy * day.focus * day.completion) / 10000)
  }));

  // Calculate statistics
  const stats = {
    totalStudyTime: studyData.reduce((acc, day) => acc + day.studyTime, 0),
    averageAccuracy: Math.round(studyData.reduce((acc, day) => acc + day.accuracy, 0) / studyData.length),
    totalFlashcards: studyData.reduce((acc, day) => acc + day.flashcardsSeen, 0),
    averageFocus: Math.round(studyData.reduce((acc, day) => acc + day.focus, 0) / studyData.length),
    streak: studyStreak,
    improvement: 12 // percentage improvement over last period
  };

  // Productivity insights
  const insights = [
    {
      type: 'positive',
      title: 'Great Progress!',
      description: `You've improved your accuracy by ${stats.improvement}% this week`,
      icon: TrendingUp,
      color: 'text-green-500'
    },
    {
      type: 'neutral',
      title: 'Focus Opportunity',
      description: 'Your focus scores are highest between 9-11 AM',
      icon: Target,
      color: 'text-blue-500'
    },
    {
      type: 'warning',
      title: 'Review Needed',
      description: 'Mathematics concepts need more review time',
      icon: AlertCircle,
      color: 'text-yellow-500'
    },
    {
      type: 'positive',
      title: 'Consistency Win',
      description: `${stats.streak} day study streak - keep it up!`,
      icon: Zap,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Progress Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress and identify improvement areas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: 'Study Time', value: `${stats.totalStudyTime}h`, change: '+12%', icon: Clock, color: 'bg-blue-500' },
          { title: 'Accuracy', value: `${stats.averageAccuracy}%`, change: `+${stats.improvement}%`, icon: Target, color: 'bg-green-500' },
          { title: 'Flashcards', value: stats.totalFlashcards, change: '+8%', icon: Brain, color: 'bg-purple-500' },
          { title: 'Focus Score', value: `${stats.averageFocus}%`, change: '+5%', icon: Zap, color: 'bg-yellow-500' },
          { title: 'Study Streak', value: `${stats.streak}d`, change: 'Active', icon: Trophy, color: 'bg-orange-500' },
          { title: 'Notes Created', value: '12', change: '+3', icon: BookOpen, color: 'bg-indigo-500' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 ${metric.color} rounded-lg`}>
                <metric.icon className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.change.includes('+') 
                  ? 'text-green-600 bg-green-100 dark:bg-green-900' 
                  : 'text-blue-600 bg-blue-100 dark:bg-blue-900'
              }`}>
                {metric.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {metric.title}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Time Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Study Time Trend
            </h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="input-field text-sm w-32"
            >
              <option value="study-time">Study Time</option>
              <option value="accuracy">Accuracy</option>
              <option value="focus">Focus Score</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={studyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey={selectedMetric === 'study-time' ? 'studyTime' : selectedMetric === 'accuracy' ? 'accuracy' : 'focus'}
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Subject Performance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Efficiency
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={efficiencyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Radar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Profile
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={performanceData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Current" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
              <Radar name="Previous" dataKey="B" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Study Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Study Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="hours"
              >
                {subjectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {subjectData.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {subject.subject}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {subject.hours}h
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Insights
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  insight.type === 'positive' ? 'bg-green-100 dark:bg-green-900' :
                  insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900' :
                  'bg-blue-100 dark:bg-blue-900'
                }`}>
                  <insight.icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Goals & Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Goals & Progress
          </h3>
          <div className="space-y-4">
            {[
              { title: 'Weekly Study Time', current: 25, target: 30, unit: 'hours' },
              { title: 'Flashcard Mastery', current: 85, target: 100, unit: 'cards' },
              { title: 'Note Summaries', current: 12, target: 15, unit: 'notes' },
              { title: 'Study Streak', current: stats.streak, target: 30, unit: 'days' }
            ].map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {goal.title}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Study Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Study Patterns & Optimization
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Best Study Times */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Optimal Study Times
            </h4>
            <div className="space-y-2">
              {[
                { time: '9:00 AM - 11:00 AM', score: 95, label: 'Peak Focus' },
                { time: '2:00 PM - 4:00 PM', score: 88, label: 'Good' },
                { time: '7:00 PM - 9:00 PM', score: 82, label: 'Moderate' }
              ].map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {slot.time}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {slot.label}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary-600">
                    {slot.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Difficulty */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Challenge Areas
            </h4>
            <div className="space-y-2">
              {[
                { subject: 'Mathematics', difficulty: 'High', accuracy: 72 },
                { subject: 'Science', difficulty: 'Medium', accuracy: 85 },
                { subject: 'History', difficulty: 'Low', accuracy: 92 }
              ].map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {subject.subject}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {subject.difficulty} difficulty
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    {subject.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Recommendations
            </h4>
            <div className="space-y-2">
              {[
                'Schedule math sessions in the morning',
                'Review flashcards before 3 PM',
                'Take breaks every 45 minutes',
                'Focus on problem-solving practice'
              ].map((rec, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-900 dark:text-white">
                    {rec}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;