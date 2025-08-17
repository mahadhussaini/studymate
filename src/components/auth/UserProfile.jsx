import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Save, 
  X,
  Mail,
  Calendar,
  Trophy,
  BookOpen,
  Brain,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { signOutUser, updateUserProfile } from '../../services/authService';
import useAppStore from '../../stores/useAppStore';
import { formatDate } from '../../utils/helpers';

const UserProfile = ({ user, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || user?.name || '',
    email: user?.email || ''
  });

  const { 
    logout, 
    notes, 
    flashcards, 
    studyStreak, 
    totalStudyHours,
    achievements 
  } = useAppStore();

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      await updateUserProfile({
        displayName: formData.displayName
      });
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      logout();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const stats = [
    {
      label: 'Study Hours',
      value: totalStudyHours.toFixed(1),
      icon: Clock,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900'
    },
    {
      label: 'Study Streak',
      value: studyStreak,
      icon: Trophy,
      color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
    },
    {
      label: 'Notes',
      value: notes.length,
      icon: BookOpen,
      color: 'text-green-600 bg-green-100 dark:bg-green-900'
    },
    {
      label: 'Flashcards',
      value: flashcards.length,
      icon: Brain,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="input-field text-center"
                  placeholder="Display Name"
                />
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {formData.displayName || 'User'}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                  <Mail className="w-4 h-4 mr-1" />
                  {formData.email}
                </div>
                {user?.createdAt && (
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-500 text-xs mt-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
                >
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Achievements */}
          {achievements.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Achievements
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {achievements.slice(-3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(achievement.unlockedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onClose();
                // Navigate to settings
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;