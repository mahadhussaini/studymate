import React from 'react';
import { Brain, Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xl: 'text-xl'
  };

  const SpinnerIcon = variant === 'brain' ? Brain : Loader2;

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'p-8'}`}
    >
      <div
        className={`${sizeClasses[size]} text-primary-600 dark:text-primary-400 mb-4 animate-spin`}
      >
        <SpinnerIcon className="w-full h-full" />
      </div>
      
      {text && (
        <p
          className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 text-center`}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeleton loaders for different components
export const SkeletonCard = () => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
  </div>
);

export const SkeletonList = ({ items = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="card p-6 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="card overflow-hidden animate-pulse">
    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 flex space-x-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
                colIndex === 0 ? 'w-1/4' : colIndex === cols - 1 ? 'w-1/6' : 'flex-1'
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Loading overlay for existing content
export const LoadingOverlay = ({ isLoading, children, text = 'Loading...' }) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 flex items-center justify-center z-10">
          <LoadingSpinner text={text} size="large" />
        </div>
      )}
    </div>
  );
};

// Button loading state
export const LoadingButton = ({ 
  isLoading, 
  children, 
  disabled, 
  className = 'btn-primary',
  ...props 
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${className} ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingSpinner;