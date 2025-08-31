import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { SEOHead } from '../components/SEOHead';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AffiliationApplication {
  id: string;
  user_email: string;
  user_name: string;
  site_link: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

const AdminAffiliationPage: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AffiliationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin
  const isAdmin = user?.email === 'kaptan3k@gmail.com';

  useEffect(() => {
    if (!isAdmin) return;
    fetchApplications();
  }, [isAdmin]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('affiliation_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    try {
      const { error } = await supabase
        .from('affiliation_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Remove from local state
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      alert('Failed to delete application');
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('affiliation_applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === id ? { ...app, status, updated_at: new Date().toISOString() } : app
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-slate-400">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-slate-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Affiliation Applications - Admin Panel"
        description="Admin panel for managing affiliation applications"
        keywords="admin, affiliation, applications, management"
      />

      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Affiliation Applications</h1>
            <p className="text-slate-400">Manage partnership applications and review submissions.</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
              >
                🔄 Refresh
              </button>
              <div className="text-sm text-slate-400 flex items-center">
                Total Applications: <span className="ml-1 font-medium text-white">{applications.length}</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="text-slate-400 mt-4">Loading applications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Applications List */}
          {!loading && !error && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 text-lg">No applications found.</p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Application Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">{app.user_name}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              app.status === 'approved'
                                ? 'bg-green-500/20 text-green-400'
                                : app.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {app.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-slate-400">Email:</span>
                            <span className="ml-2 text-slate-200">{app.user_email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Website:</span>
                            <a
                              href={app.site_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-indigo-400 hover:text-indigo-300 underline"
                            >
                              {app.site_link}
                            </a>
                          </div>
                          {app.message && (
                            <div>
                              <span className="text-slate-400">Message:</span>
                              <p className="ml-2 text-slate-200 mt-1 bg-slate-700/30 rounded p-2">
                                {app.message}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-400">Submitted:</span>
                            <span className="ml-2 text-slate-200">
                              {new Date(app.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-0 lg:min-w-[140px]">
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value as any)}
                          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        
                        <button
                          onClick={() => deleteApplication(app.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminAffiliationPage;
