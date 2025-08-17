import useAppStore from '../../stores/useAppStore';

const navigationItems = [
  { id: 'dashboard', label: 'Home', icon: 'Home' },
  { id: 'notes', label: 'Notes', icon: 'BookOpen' },
  { id: 'flashcards', label: 'Cards', icon: 'Brain' },
  { id: 'ai-tutor', label: 'AI Tutor', icon: 'MessageCircle' },
  { id: 'schedule', label: 'Schedule', icon: 'Calendar' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
  { id: 'achievements', label: 'Rewards', icon: 'Trophy' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
];

// Swipe gestures for mobile navigation
export const useSwipeNavigation = () => {
  const { currentPage, setCurrentPage } = useAppStore();
  
  const handleSwipe = (direction) => {
    const currentIndex = navigationItems.findIndex(item => item.id === currentPage);
    
    if (direction === 'left' && currentIndex < navigationItems.length - 1) {
      setCurrentPage(navigationItems[currentIndex + 1].id);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentPage(navigationItems[currentIndex - 1].id);
    }
  };
  
  return { handleSwipe };
};

// Mobile-optimized card component
export const MobileCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

// Mobile action button (FAB style)
export const MobileActionButton = ({ icon: Icon, onClick, className = '' }) => {
  const IconComponent = Icon;
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-20 right-4 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-30 lg:hidden ${className}`}
    >
      <IconComponent className="w-6 h-6" />
    </button>
  );
}; 