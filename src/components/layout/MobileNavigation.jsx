import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Home,
  BookOpen, 
  Brain, 
  MessageCircle,
  Calendar, 
  BarChart3, 
  Trophy, 
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';
import useAppStore from '../../stores/useAppStore';

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'notes', label: 'Notes', icon: BookOpen },
  { id: 'flashcards', label: 'Cards', icon: Brain },
  { id: 'ai-tutor', label: 'AI Tutor', icon: MessageCircle },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'achievements', label: 'Rewards', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Bottom Navigation Bar for Mobile
export const MobileBottomNav = () => {
  const { currentPage, setCurrentPage } = useAppStore();
  
  // Show only 5 most important items in bottom nav
  const primaryItems = navigationItems.slice(0, 5);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              
              {isActive && (
                <div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Mobile Header with hamburger menu
export const MobileHeader = ({ onMenuOpen, title }) => {
  const { user } = useAppStore();
  
  return (
    <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuOpen}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 -ml-2"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {user && (
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Full-screen mobile menu
export const MobileMenu = ({ isOpen, onClose }) => {
  const { currentPage, setCurrentPage, user, theme, toggleTheme } = useAppStore();
  
  const handleNavigation = (pageId) => {
    setCurrentPage(pageId);
    onClose();
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={onClose}
        >
          <div
            className="w-80 h-full bg-white dark:bg-gray-800 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                      StudyMate
                    </h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      AI Tutor 2.0
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              {/* User Profile */}
              {user && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.displayName || user.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left ${
                          isActive 
                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Footer Actions */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center space-x-3 px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-gray-800 dark:bg-yellow-400"></div>
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full bg-yellow-400"></div>
                      <span>Light Mode</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default {
  MobileBottomNav,
  MobileHeader,
  MobileMenu
};