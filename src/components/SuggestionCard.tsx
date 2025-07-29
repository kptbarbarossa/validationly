
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
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ icon, title, content, actions, copiedId }) => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/70 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">{icon}</div>
                {title}
            </h3>
            <div className="text-gray-600 flex-grow mb-5 prose prose-sm max-w-none">
                {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
            <div className="flex flex-wrap gap-3 mt-auto justify-center">
                {actions.map((action) => {
                    const isCopied = copiedId === action.id;
                    return (
                        <button
                            key={action.id}
                            onClick={action.handler}
                            disabled={isCopied}
                            className={`flex-1 min-w-[120px] text-center font-medium py-2 px-4 rounded-full transition-all duration-200 text-sm ${
                                isCopied && action.copiedLabel
                                ? 'bg-green-500 text-white cursor-default border-green-500' 
                                : 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                            }`}
                        >
                            {isCopied && action.copiedLabel ? action.copiedLabel : action.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SuggestionCard;
