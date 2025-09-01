import React from 'react';

// Enhanced Loading Spinner with multiple variants
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}> = ({ size = 'md', variant = 'primary', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const variantClasses = {
    primary: 'border-indigo-500',
    secondary: 'border-slate-400',
    accent: 'border-cyan-500'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-transparent ${sizeClasses[size]} ${className}`}>
      <div className={`rounded-full border-2 border-t-transparent ${variantClasses[variant]} h-full w-full`}></div>
    </div>
  );
};

// Skeleton Loading Components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800/50 rounded-xl p-6 ${className}`}>
    <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-slate-700 rounded w-2/3"></div>
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="animate-pulse bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <div className="h-3 bg-slate-700 rounded w-2/3 mb-3"></div>
        <div className="h-8 bg-slate-700 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

// Validation Progress Indicator
export const ValidationProgress: React.FC<{
  steps: string[];
  currentStep: number;
  className?: string;
}> = ({ steps, currentStep, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="text-center mb-6">
      <h3 className="text-lg font-semibold text-white mb-2">Analyzing Your Idea</h3>
      <p className="text-slate-400">Step {currentStep + 1} of {steps.length}</p>
    </div>
    
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            index < currentStep 
              ? 'bg-green-500 text-white' 
              : index === currentStep 
              ? 'bg-indigo-500 text-white animate-pulse' 
              : 'bg-slate-700 text-slate-400'
          }`}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span className={`text-sm transition-colors duration-300 ${
            index <= currentStep ? 'text-white' : 'text-slate-400'
          }`}>
            {step}
          </span>
        </div>
      ))}
    </div>
    
    {/* Progress Bar */}
    <div className="w-full bg-slate-700 rounded-full h-2 mt-6">
      <div 
        className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
      ></div>
    </div>
  </div>
);

// Floating Action Button
export const FloatingActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  className?: string;
}> = ({ onClick, icon, label, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'
    } ${className}`}
    aria-label={label}
  >
    <div className="text-white text-xl">
      {icon}
    </div>
    
    {/* Tooltip */}
    <div className="absolute right-full mr-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
      {label}
    </div>
  </button>
);

// Enhanced Button Component
export const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  onClick, 
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white hover:from-indigo-500 hover:to-cyan-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600',
    outline: 'border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
      } ${className}`}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};