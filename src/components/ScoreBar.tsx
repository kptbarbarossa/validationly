
import React from 'react';

interface ScoreBarProps {
    score: number;
    text: string;
}

const ScoreBar: React.FC<ScoreBarProps> = ({ score, text }) => {
    const scoreColor = score > 75 ? 'from-green-400 to-cyan-400' 
                   : score > 40 ? 'from-yellow-400 to-orange-400' 
                   : 'from-red-400 to-pink-500';
    
    return (
        <div>
            <div className="flex justify-between items-end mb-1.5">
                <span className="text-3xl font-bold text-gray-900">{score}<span className="text-xl text-gray-500">/100</span></span>
                <span className="text-sm font-semibold text-gray-600 pb-1">{text}</span>
            </div>
            <div className="w-full bg-gray-200/70 rounded-full h-2.5">
                <div
                    className={`bg-gradient-to-r ${scoreColor} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
};

export default ScoreBar;
