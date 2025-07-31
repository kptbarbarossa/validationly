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
            {/* Custom Logo */}
            <img 
                src="/logo.png" 
                alt="Validationly Logo"
                className={`${sizeClasses[size]} flex-shrink-0 object-contain`}
            />
            
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