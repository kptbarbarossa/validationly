import React, { useState } from 'react';

interface JobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  jobType?: string;
  requirements?: string[];
  benefits?: string[];
}

interface JobSearchProps {
  onJobSelect: (job: JobPosting) => void;
  token: string;
}

const JobSearch: React.FC<JobSearchProps> = ({ onJobSelect, token }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState<'indeed' | 'linkedin'>('indeed');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [jobUrl, setJobUrl] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&platform=${platform}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setJobs(data.jobs);
      } else {
        alert(data.error || 'Failed to search jobs');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleScrapeUrl = async () => {
    if (!jobUrl.trim()) {
      alert('Please enter a job URL');
      return;
    }

    setIsScrapingUrl(true);
    try {
      const response = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: jobUrl })
      });

      const data = await response.json();
      if (response.ok) {
        onJobSelect(data.job);
        setJobUrl('');
      } else {
        alert(data.error || 'Failed to scrape job posting');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      {/* URL Scraping Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Import from Job URL</h3>
        <div className="flex gap-3">
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="Paste LinkedIn, Indeed, or any job posting URL..."
            className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleScrapeUrl}
            disabled={isScrapingUrl || !jobUrl.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isScrapingUrl ? 'Importing...' : 'Import'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          ✨ Automatically extract job details from LinkedIn, Indeed, and other job sites
        </p>
      </div>

      {/* Job Search Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Search Jobs</h3>
        
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keywords..."
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (optional)"
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as 'indeed' | 'linkedin')}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="indeed">Indeed</option>
            <option value="linkedin">LinkedIn (Coming Soon)</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50"
        >
          {isSearching ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>

      {/* Search Results */}
      {jobs.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            Found {jobs.length} jobs
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => onJobSelect(job)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{job.title}</h4>
                    <p className="text-slate-300 text-sm">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">{job.location}</p>
                    {job.salary && (
                      <p className="text-green-400 text-xs">{job.salary}</p>
                    )}
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm mb-3">
                  {truncateText(job.description, 150)}
                </p>
                
                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {job.requirements.slice(0, 3).map((req, reqIndex) => (
                      <span
                        key={reqIndex}
                        className="px-2 py-1 bg-indigo-600/20 text-indigo-300 text-xs rounded"
                      >
                        {truncateText(req, 30)}
                      </span>
                    ))}
                    {job.requirements.length > 3 && (
                      <span className="px-2 py-1 bg-slate-600/20 text-slate-400 text-xs rounded">
                        +{job.requirements.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {job.jobType && (
                      <span className="px-2 py-1 bg-cyan-600/20 text-cyan-300 text-xs rounded">
                        {job.jobType}
                      </span>
                    )}
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm">
                    Use this job →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;