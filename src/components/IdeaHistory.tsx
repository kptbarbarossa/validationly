import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ValidationlyDB } from '../../lib/supabase';
import type { Validation } from '../../lib/supabase';
import { Button, LoadingSpinner } from './LoadingStates';

interface IdeaHistoryProps {
  onSelectIdea?: (idea: string) => void;
  className?: string;
}

export const IdeaHistory: React.FC<IdeaHistoryProps> = ({ onSelectIdea, className = '' }) => {
  const { user } = useAuth();
  const [validations, setValidations] = useState<Validation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'high-score'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadValidations();
    }
  }, [user, filter]);

  const loadValidations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let validations = await ValidationlyDB.getUserValidations(user.id, 50);
      
      // Apply filters
      if (filter === 'favorites') {
        validations = validations.filter(v => v.is_favorite);
      } else if (filter === 'high-score') {
        validations = validations.filter(v => (v.demand_score || 0) >= 70);
      }
      
      // Apply search
      if (searchTerm) {
        validations = validations.filter(v => 
          v.idea_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (v.category || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setValidations(validations);
    } catch (error) {
      console.error('Error loading validations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (validationId: string, currentFavorite: boolean) => {
    try {
      await ValidationlyDB.updateValidationFavorite(validationId, !currentFavorite);
      setValidations(prev => 
        prev.map(v => 
          v.id === validationId ? { ...v, is_favorite: !currentFavorite } : v
        )
      );
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const deleteValidation = async (validationId: string) => {
    if (!confirm('Are you sure you want to delete this validation?')) return;
    
    try {
      await ValidationlyDB.deleteValidation(validationId);
      setValidations(prev => prev.filter(v => v.id !== validationId));
    } catch (error) {
      console.error('Error deleting validation:', error);
    }
  };

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-slate-400">Sign in to view your idea history</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Idea History</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Ideas</option>
            <option value="favorites">Favorites</option>
            <option value="high-score">High Score (70+)</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && validations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            {filter === 'favorites' ? 'No favorite ideas yet' : 
             filter === 'high-score' ? 'No high-scoring ideas yet' :
             searchTerm ? 'No matching ideas found' : 'No ideas yet'}
          </h3>
          <p className="text-slate-400 mb-4">
            {filter === 'favorites' ? 'Star some ideas to see them here' :
             filter === 'high-score' ? 'Validate more ideas to find high-scoring ones' :
             searchTerm ? 'Try a different search term' : 'Start by validating your first idea'}
          </p>
          {!searchTerm && (
            <Button variant="primary" onClick={() => onSelectIdea?.('')}>
              Validate New Idea
            </Button>
          )}
        </div>
      )}

      {/* Ideas List */}
      {!loading && validations.length > 0 && (
        <div className="space-y-3">
          {validations.map((validation, index) => (
            <div
              key={validation.id}
              className="group bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 
                      className="font-medium text-white hover:text-indigo-300 transition-colors line-clamp-2 flex-1 cursor-pointer"
                      onClick={() => onSelectIdea?.(validation.idea_text)}
                    >
                      {validation.idea_text}
                    </h3>
                    
                    <button
                      onClick={() => toggleFavorite(validation.id, validation.is_favorite)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${
                        validation.is_favorite 
                          ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10' 
                          : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>{validation.demand_score || 'N/A'}/100</span>
                      </span>
                      <span>{validation.category || 'Uncategorized'}</span>
                      <span>{new Date(validation.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => onSelectIdea?.(validation.idea_text)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                        title="Use this idea"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteValidation(validation.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete validation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdeaHistory;