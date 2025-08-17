import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Calendar, 
  BarChart3, 
  Trophy, 
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  Home,
  MessageCircle,
  User,
  LogIn
} from 'lucide-react';
import useAppStore from '../../stores/useAppStore';
import { MobileBottomNav, MobileHeader, MobileMenu } from './MobileNavigation';
import UserProfile from '../auth/UserProfile';
import AuthModal from '../auth/AuthModal';
import { isMobileDevice } from '../../utils/helpers';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'notes', label: 'Smart Notes', icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Brain },
  { id: 'ai-tutor', label: 'AI Tutor', icon: MessageCircle },
  { id: 'schedule', label: 'Study Schedule', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const DashboardLayout = ({ children }) => {
  const { 
    sidebarOpen, 
    toggleSidebar,
    currentPage,
    setCurrentPage,
    theme,
    toggleTheme,
    user
  } = useAppStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isMobile = isMobileDevice();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <AnimatePresence mode="wait">
          {sidebarOpen && !isMobile && (
            <div
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:relative lg:translate-x-0"
            >
              <div className="flex flex-col h-full">
                {/* Logo/Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      StudyMate
                    </span>
                  </div>
                  <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* User Profile */}
                {user && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 dark:text-primary-300 font-medium">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`sidebar-item w-full text-left ${isActive ? 'active' : ''}`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>

                {/* Theme Toggle */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    {theme === 'light' ? (
                      <Moon className="w-5 h-5 mr-3" />
                    ) : (
                      <Sun className="w-5 h-5 mr-3" />
                    )}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Desktop Header / Mobile Header */}
          {isMobile ? (
            <MobileHeader 
              onMenuOpen={() => setMobileMenuOpen(true)}
              title={currentPage}
            />
          ) : (
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  </button>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                    {currentPage}
                  </h1>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* User Actions */}
                  <div className="hidden md:flex items-center space-x-2">
                    <button className="btn-primary text-sm">
                      Quick Study
                    </button>
                    
                    {/* User Profile / Auth Button */}
                    {user ? (
                      <button
                        onClick={() => setShowUserProfile(true)}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                            {user.displayName?.charAt(0) || user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {user.displayName || user.name || 'User'}
                        </span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="flex items-center space-x-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign In</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Content Area */}
          <main className={`flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 ${
            isMobile ? 'pb-20 px-4 py-4' : 'p-6'
          }`}>
            <div
              key={currentPage}
              className={isMobile ? '' : 'max-w-7xl mx-auto'}
            >
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileBottomNav />}

        {/* Desktop Mobile Overlay */}
        {sidebarOpen && !isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>

      {/* User Profile Modal */}
      {showUserProfile && user && (
        <UserProfile 
          user={user} 
          onClose={() => setShowUserProfile(false)} 
        />
      )}

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default DashboardLayout;