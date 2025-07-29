
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <span className="text-indigo-500">{icon}</span>
                {title}
            </h3>
            <div className="text-gray-600 flex-grow mb-6 prose prose-sm max-w-none">
                {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-auto justify-center">
                {actions.map((action) => {
                    const isCopied = copiedId === action.id;
                    return (
                        <button
                            key={action.id}
                            onClick={action.handler}
                            disabled={isCopied}
                            className={`flex-1 text-center font-medium py-2 px-4 rounded-full transition-all duration-200 text-sm ${
                                isCopied && action.copiedLabel
                                ? 'bg-green-500 text-white cursor-default border-green-500' 
                                : 'border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
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