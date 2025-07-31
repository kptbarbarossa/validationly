import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    const textSizeClasses = {
        sm: 'text-lg',
        md: 'text-xl',
        lg: 'text-3xl'
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Logo SVG */}
            <div className={`${sizeClasses[size]} flex-shrink-0`}>
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <linearGradient id="logoGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="logoGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                    
                    {/* Left wing */}
                    <path
                        d="M15 85 L15 25 C15 15 25 5 35 5 L50 20 L35 35 C25 45 15 55 15 85 Z"
                        fill="url(#logoGradient1)"
                    />
                    
                    {/* Right wing */}
                    <path
                        d="M85 85 L85 25 C85 15 75 5 65 5 L50 20 L65 35 C75 45 85 55 85 85 Z"
                        fill="url(#logoGradient2)"
                    />
                </svg>
            </div>
            
            {/* Logo Text */}
            {showText && (
                <span className={`font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent ${textSizeClasses[size]}`}>
                    Validationly
                </span>
            )}
        </div>
    );
};

export default Logo;