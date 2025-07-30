
import React from 'react';

interface Action {
  id: string;
  label: string;
  handler: () => void;
  copiedLabel?: string;
}

interface SuggestionCardProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  actions: Action[];
  copiedId: string | null;
  className?: string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({
  icon,
  title,
  content,
  actions,
  copiedId,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-indigo-500">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="mb-6">
        {content}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.handler}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label={action.label}
          >
            {copiedId === action.id && action.copiedLabel 
              ? action.copiedLabel 
              : action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionCard;
