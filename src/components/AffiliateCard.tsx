import React from 'react';

export interface AffiliateCardProps {
  id: string;
  name: string;
  description: string;
  logo: string;
  logoFallback: string;
  category: string;
  categoryColor: string;
  features: string[];
  ctaText: string;
  ctaIcon: string;
  ctaLink: string;
  gradientColors: {
    from: string;
    to: string;
  };
  fallbackBgColor: string;
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({
  name,
  description,
  logo,
  logoFallback,
  category,
  categoryColor,
  features,
  ctaText,
  ctaIcon,
  ctaLink,
  gradientColors,
  fallbackBgColor
}) => {
  return (
    <div className="group relative bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-2">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-gray-700/10 to-gray-900/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated border glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <div className="relative z-10">
        {/* Header with Logo and Category */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Enhanced Logo Container */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-gray-800 to-gray-700 border border-white/10 group-hover:border-white/20">
                <img
                  src={logo}
                  alt={`${name} Logo`}
                  className="w-full h-full object-contain rounded-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = `w-12 h-12 ${fallbackBgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`;
                      parent.innerHTML = `<span class="text-white font-bold text-sm">${logoFallback}</span>`;
                    }
                  }}
                />
              </div>
              {/* Logo glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {/* Title and Category */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white group-hover:text-gray-100 transition-colors duration-300 truncate">
                {name}
              </h3>
              <span className={`${categoryColor} px-3 py-1 rounded-full text-xs font-semibold inline-block mt-1`}>
                {category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-4 leading-relaxed group-hover:text-gray-200 transition-colors duration-300 line-clamp-3">
          {description}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <a
          href={ctaLink}
          target="_blank"
          rel="nofollow noopener"
          className={`group/btn relative inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} text-white rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold overflow-hidden`}
        >
          {/* Button background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          
          {/* Button content */}
          <span className="relative z-10">{ctaIcon}</span>
          <span className="relative z-10">{ctaText}</span>
          
          {/* Arrow icon */}
          <svg 
            className="relative z-10 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default AffiliateCard;
