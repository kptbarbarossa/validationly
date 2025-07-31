import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
                {/* Logo Icon */}
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        stroke="white" 
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                {/* Logo Text */}
                <h1 className="text-2xl font-bold text-gray-900">
                    Validationly
                </h1>
            </div>
        </div>
    );
};

export default Logo;