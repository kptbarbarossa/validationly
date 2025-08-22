import React, { useState, useEffect } from 'react';

interface ValidationResult {
  id: string;
  query: string;
  score: number;
  sentiment: string;
  date: string;
  communities: string[];
}

interface ValidationHistoryProps {
  onCompare?: (results: ValidationResult[]) => void;
}

export const ValidationHistory: React.FC<ValidationHistoryProps> = ({ onCompare }) => {
  const [history, setHistory] = useState<ValidationResult[]>([]);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('validation-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load validation history:', error);
      }
    }
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedForComparison(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : prev.length < 3 ? [...prev, id] : prev // Limit to 3 comparisons
    );
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) return;
    
    const selectedResults = history.filter(item => selectedForComparison.includes(item.id));
    onCompare?.(selectedResults);
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectedForComparison([]);
    localStorage.removeItem('validation-history');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  if (history.length === 0) {
    return (
      <div className="glass glass-border p-6 rounded-2xl text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">No Validation History</h3>
        <p className="text-sm text-slate-400">
          Your validation results will appear here for comparison and reference.
        </p>
      </div>
    );
  }

  return (
    <div className="glass glass-border p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-400">📊 Validation History</h3>
        <div className="flex gap-2">
          {selectedForComparison.length >= 2 && (
            <button
              onClick={handleCompare}
              className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
            >
              Compare ({selectedForComparison.length})
            </button>
          )}
          <button
            onClick={clearHistory}
            className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {history.slice(0, 10).map((result) => (
          <div
            key={result.id}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              selectedForComparison.includes(result.id)
                ? 'border-purple-400/50 bg-purple-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => toggleSelection(result.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white text-sm flex-1 mr-2">
                {result.query}
              </h4>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </span>
                <span className="text-sm">
                  {getSentimentIcon(result.sentiment)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{new Date(result.date).toLocaleDateString()}</span>
              <span>{result.communities.length} communities</span>
            </div>
          </div>
        ))}
      </div>

      {selectedForComparison.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-slate-400 text-center">
            Select 2-3 results to compare • {selectedForComparison.length}/3 selected
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to save validation result to history
export const saveValidationToHistory = (
  query: string,
  score: number,
  sentiment: string,
  communities: string[]
) => {
  const result: ValidationResult = {
    id: Date.now().toString(),
    query,
    score,
    sentiment,
    date: new Date().toISOString(),
    communities
  };

  const existingHistory = localStorage.getItem('validation-history');
  let history: ValidationResult[] = [];
  
  if (existingHistory) {
    try {
      history = JSON.parse(existingHistory);
    } catch (error) {
      console.error('Failed to parse validation history:', error);
    }
  }

  // Add new result and keep only last 20
  history.unshift(result);
  history = history.slice(0, 20);

  localStorage.setItem('validation-history', JSON.stringify(history));
};