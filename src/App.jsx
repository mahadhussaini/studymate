import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import AuthModal from './components/auth/AuthModal';
import PWAInstallPrompt from './components/pwa/PWAInstallPrompt';
import Dashboard from './pages/Dashboard';
import SmartNotes from './pages/SmartNotes';
import Flashcards from './pages/Flashcards';
import AITutor from './pages/AITutor';
import StudySchedule from './pages/StudySchedule';
import Analytics from './pages/Analytics';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import useAppStore from './stores/useAppStore';
import { onAuthStateChange } from './services/authService';

function App() {
  const { currentPage, user, setUser, isAuthenticated, setupCloudSync } = useAppStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  // Set up cloud synchronization when user is authenticated
  useEffect(() => {
    let unsubscribeCloudSync = null;

    if (user && isAuthenticated) {
      try {
        unsubscribeCloudSync = setupCloudSync();
      } catch (error) {
        console.log('Cloud sync not available:', error);
      }
    }

    return () => {
      if (unsubscribeCloudSync) {
        unsubscribeCloudSync();
      }
    };
  }, [user, isAuthenticated, setupCloudSync]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'notes':
        return <SmartNotes />;
      case 'flashcards':
        return <Flashcards />;
      case 'ai-tutor':
        return <AITutor />;
      case 'schedule':
        return <StudySchedule />;
      case 'analytics':
        return <Analytics />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">SM</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            StudyMate
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your learning environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <DashboardLayout>
          {renderCurrentPage()}
        </DashboardLayout>
        
        {/* Authentication Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;