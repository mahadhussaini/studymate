import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Brain, 
  Clock, 
  Globe,
  Shield,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Monitor,
  Sun,
  Moon,
  Smartphone,
  Volume2,
  VolumeX,
  Zap,
  Database,
  Key,
  Settings as SettingsIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAppStore from '../stores/useAppStore';

const Settings = () => {
  const { theme, toggleTheme, user, resetData } = useAppStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    bio: user?.bio || '',
    timezone: 'UTC-5',
    language: 'en',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      studyReminders: true,
      achievementAlerts: true,
      weeklyReports: true,
      emailNotifications: false,
      pushNotifications: true,
      soundEffects: true
    },
    study: {
      sessionDuration: 45,
      breakDuration: 15,
      dailyGoal: 120,
      weeklyGoal: 10,
      difficultyLevel: 'intermediate',
      autoGenerateFlashcards: true,
      spacedRepetition: true,
      showProgress: true
    },
    privacy: {
      profileVisibility: 'friends',
      shareProgress: true,
      dataCollection: true,
      analytics: true
    },
    appearance: {
      theme: theme,
      fontSize: 'medium',
      animationSpeed: 'normal',
      compactMode: false,
      showSidebar: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'study', label: 'Study Preferences', icon: Brain },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const handleSave = (section) => {
    toast.success(`${section} settings saved successfully!`);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
      resetData();
      toast.success('All data has been reset successfully!');
    }
  };

  const handleExportData = () => {
    const data = {
      notes: [],
      flashcards: [],
      achievements: [],
      studySessions: [],
      preferences
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'studymate-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Picture
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload a profile picture or choose an avatar
          </p>
          <button className="mt-2 btn-secondary text-sm">
            Change Picture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="input-field"
          >
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">GMT (UTC+0)</option>
            <option value="UTC+1">Central European Time (UTC+1)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="input-field"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="input-field h-24 resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Change Password
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="input-field pr-10"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Profile')}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Study Notifications
        </h3>
        <div className="space-y-4">
          {[
            { key: 'studyReminders', label: 'Study Session Reminders', desc: 'Get notified when it\'s time to study' },
            { key: 'achievementAlerts', label: 'Achievement Alerts', desc: 'Celebrate when you unlock new achievements' },
            { key: 'weeklyReports', label: 'Weekly Progress Reports', desc: 'Receive weekly summaries of your progress' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.notifications[item.key]}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, [item.key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Delivery Methods
        </h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', icon: Bell },
            { key: 'pushNotifications', label: 'Push Notifications', icon: Smartphone },
            { key: 'soundEffects', label: 'Sound Effects', icon: Volume2 }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications[item.key]}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: { ...preferences.notifications, [item.key]: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Notifications')}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderStudyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Study Sessions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Session Duration (minutes)
            </label>
            <input
              type="number"
              value={preferences.study.sessionDuration}
              onChange={(e) => setPreferences({
                ...preferences,
                study: { ...preferences.study, sessionDuration: parseInt(e.target.value) }
              })}
              className="input-field"
              min="15"
              max="180"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Break Duration (minutes)
            </label>
            <input
              type="number"
              value={preferences.study.breakDuration}
              onChange={(e) => setPreferences({
                ...preferences,
                study: { ...preferences.study, breakDuration: parseInt(e.target.value) }
              })}
              className="input-field"
              min="5"
              max="60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Daily Goal (minutes)
            </label>
            <input
              type="number"
              value={preferences.study.dailyGoal}
              onChange={(e) => setPreferences({
                ...preferences,
                study: { ...preferences.study, dailyGoal: parseInt(e.target.value) }
              })}
              className="input-field"
              min="30"
              max="480"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Weekly Goal (hours)
            </label>
            <input
              type="number"
              value={preferences.study.weeklyGoal}
              onChange={(e) => setPreferences({
                ...preferences,
                study: { ...preferences.study, weeklyGoal: parseInt(e.target.value) }
              })}
              className="input-field"
              min="5"
              max="70"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Learning Preferences
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <select
              value={preferences.study.difficultyLevel}
              onChange={(e) => setPreferences({
                ...preferences,
                study: { ...preferences.study, difficultyLevel: e.target.value }
              })}
              className="input-field"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {[
            { key: 'autoGenerateFlashcards', label: 'Auto-Generate Flashcards', desc: 'Automatically create flashcards from your notes' },
            { key: 'spacedRepetition', label: 'Spaced Repetition', desc: 'Use spaced repetition algorithm for optimal learning' },
            { key: 'showProgress', label: 'Show Progress Indicators', desc: 'Display progress bars and completion percentages' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.study[item.key]}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    study: { ...preferences.study, [item.key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Study Preferences')}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => {
                  if (option.value !== 'system') {
                    setPreferences({
                      ...preferences,
                      appearance: { ...preferences.appearance, theme: option.value }
                    });
                    if (option.value !== theme) {
                      toggleTheme();
                    }
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  preferences.appearance.theme === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Display Options
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Font Size
            </label>
            <select
              value={preferences.appearance.fontSize}
              onChange={(e) => setPreferences({
                ...preferences,
                appearance: { ...preferences.appearance, fontSize: e.target.value }
              })}
              className="input-field"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Animation Speed
            </label>
            <select
              value={preferences.appearance.animationSpeed}
              onChange={(e) => setPreferences({
                ...preferences,
                appearance: { ...preferences.appearance, animationSpeed: e.target.value }
              })}
              className="input-field"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
              <option value="none">No Animations</option>
            </select>
          </div>

          {[
            { key: 'compactMode', label: 'Compact Mode', desc: 'Use smaller spacing and components' },
            { key: 'showSidebar', label: 'Show Sidebar by Default', desc: 'Keep the sidebar open when you start the app' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.appearance[item.key]}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    appearance: { ...preferences.appearance, [item.key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Appearance')}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacy Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={preferences.privacy.profileVisibility}
              onChange={(e) => setPreferences({
                ...preferences,
                privacy: { ...preferences.privacy, profileVisibility: e.target.value }
              })}
              className="input-field"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          {[
            { key: 'shareProgress', label: 'Share Progress with Friends', desc: 'Allow friends to see your study progress' },
            { key: 'dataCollection', label: 'Anonymous Data Collection', desc: 'Help improve the app by sharing anonymous usage data' },
            { key: 'analytics', label: 'Analytics Tracking', desc: 'Enable detailed analytics to improve your learning experience' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.privacy[item.key]}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, [item.key]: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Security
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Add an extra layer of security to your account
                </p>
              </div>
            </div>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Enable 2FA →
            </button>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  API Keys
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Manage your OpenAI and other service API keys
                </p>
              </div>
            </div>
            <button className="mt-3 text-sm text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 font-medium">
              Manage Keys →
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('Privacy')}
          className="btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Export Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download all your study data
                </p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="w-full btn-secondary"
            >
              Export All Data
            </button>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <RefreshCw className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Backup & Sync
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sync data across devices
                </p>
              </div>
            </div>
            <button className="w-full btn-secondary">
              Configure Sync
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <div className="p-6 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="flex items-start space-x-3">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                Reset All Data
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                This will permanently delete all your notes, flashcards, study sessions, and achievements. 
                This action cannot be undone.
              </p>
              <button
                onClick={handleResetData}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'study': return renderStudyTab();
      case 'appearance': return renderAppearanceTab();
      case 'privacy': return renderPrivacyTab();
      case 'data': return renderDataTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your StudyMate experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="card p-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;