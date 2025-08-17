import { format, differenceInDays, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

// Date formatting utilities
export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return '';
  return format(new Date(date), formatString);
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'h:mm a');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const targetDate = new Date(date);
  
  if (isToday(targetDate)) {
    return 'Today';
  }
  
  if (isYesterday(targetDate)) {
    return 'Yesterday';
  }
  
  const daysDiff = differenceInDays(new Date(), targetDate);
  if (daysDiff < 7) {
    return `${daysDiff} days ago`;
  }
  
  return formatDistanceToNow(targetDate, { addSuffix: true });
};

// Text processing utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const extractKeywords = (text, count = 5) => {
  if (!text) return [];
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'them', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'make', 'what', 'know', 'think', 'take', 'come', 'your', 'good', 'some', 'first', 'also', 'after', 'back', 'work', 'life', 'only', 'right', 'very', 'well', 'just', 'still', 'should', 'through'].includes(word));
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
};

export const estimateReadingTime = (text, wordsPerMinute = 200) => {
  if (!text) return 0;
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

export const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

// Number formatting utilities
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return Math.round((value / total) * 100) + '%';
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
};

export const unique = (array, key) => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password) => {
  return password.length >= 8;
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const getContrastColor = (backgroundColor) => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

export const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

// Local storage utilities
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};

// Device detection utilities
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Study-specific utilities
export const calculateStudyStreak = (studySessions) => {
  if (!studySessions || studySessions.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Sort sessions by date (newest first)
  const sortedSessions = studySessions
    .filter(session => session.endTime)
    .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
  
  for (let i = 0; i < 365; i++) { // Max 365 days
    const hasSessionToday = sortedSessions.some(session => 
      isToday(new Date(session.endTime)) || 
      format(new Date(session.endTime), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );
    
    if (hasSessionToday) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateAccuracy = (correctAnswers, totalAnswers) => {
  if (!totalAnswers || totalAnswers === 0) return 0;
  return Math.round((correctAnswers / totalAnswers) * 100);
};

export const getNextReviewDate = (reviewCount, accuracy = 100) => {
  // Spaced repetition intervals (in days)
  const intervals = [1, 3, 7, 14, 30, 90, 180, 365];
  
  // Adjust interval based on accuracy
  let intervalIndex = Math.min(reviewCount, intervals.length - 1);
  
  if (accuracy < 60) {
    intervalIndex = Math.max(0, intervalIndex - 2); // Go back 2 intervals
  } else if (accuracy < 80) {
    intervalIndex = Math.max(0, intervalIndex - 1); // Go back 1 interval
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervals[intervalIndex]);
  
  return nextReview;
};

export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'text-green-600 bg-green-100 dark:bg-green-900';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    case 'hard':
      return 'text-red-600 bg-red-100 dark:bg-red-900';
    default:
      return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
  }
};

// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Error handling utilities
export const handleAsyncError = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      console.error('Async operation failed:', error);
      throw error;
    }
  };
};

export const retryWithDelay = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
};

export default {
  // Date utilities
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  
  // Text utilities
  truncateText,
  extractKeywords,
  estimateReadingTime,
  highlightText,
  
  // Number utilities
  formatNumber,
  formatPercentage,
  formatDuration,
  
  // Array utilities
  groupBy,
  sortBy,
  unique,
  
  // Validation utilities
  isValidEmail,
  isValidPassword,
  isValidUrl,
  
  // Color utilities
  hexToRgb,
  getContrastColor,
  generateColors,
  
  // Storage utilities
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  
  // Device utilities
  isMobileDevice,
  isTouchDevice,
  getDeviceType,
  
  // Study utilities
  calculateStudyStreak,
  calculateAccuracy,
  getNextReviewDate,
  getDifficultyColor,
  
  // Performance utilities
  debounce,
  throttle,
  
  // Error utilities
  handleAsyncError,
  retryWithDelay
};