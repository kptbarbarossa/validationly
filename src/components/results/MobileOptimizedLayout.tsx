import React, { useState } from 'react';

interface Section {
  id: string;
  title: string;
  icon: string;
  component: React.ComponentType<any>;
  priority: number;
}

interface MobileOptimizedLayoutProps {
  sections: Section[];
  data: any;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({ sections, data }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(sections[0]?.id || null);
  const [viewMode, setViewMode] = useState<'accordion' | 'tabs'>('accordion');

  const sortedSections = sections.sort((a, b) => a.priority - b.priority);

  const AccordionView = () => (
    <div className="space-y-4">
      {sortedSections.map((section) => {
        const isExpanded = expandedSection === section.id;
        const Component = section.component;
        
        return (
          <div key={section.id} className="glass glass-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{section.icon}</span>
                <span className="font-semibold text-white">{section.title}</span>
              </div>
              <svg 
                className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isExpanded && (
              <div className="border-t border-slate-700 p-4 animate-slideDown">
                <Component {...data} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const TabsView = () => {
    const activeSection = sortedSections.find(s => s.id === expandedSection) || sortedSections[0];
    const Component = activeSection.component;

    return (
      <div>
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {sortedSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setExpandedSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  expandedSection === section.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="glass glass-border p-6 rounded-2xl">
          <Component {...data} />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* View Mode Toggle (Desktop Only) */}
      <div className="hidden md:flex justify-center mb-6">
        <div className="inline-flex bg-slate-800/50 rounded-xl p-1 border border-slate-700">
          <button
            onClick={() => setViewMode('accordion')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'accordion'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 Sections
          </button>
          <button
            onClick={() => setViewMode('tabs')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'tabs'
                ? 'bg-blue-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📑 Tabs
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="md:hidden">
        <AccordionView />
      </div>
      <div className="hidden md:block">
        {viewMode === 'accordion' ? <AccordionView /> : <TabsView />}
      </div>
    </div>
  );
};

// Custom CSS for animations (add to your global CSS)
const styles = `
@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 1000px;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
`;