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
    <a
      href={ctaLink}
      target="_blank"
      rel="nofollow noopener"
      className="group block"
    >
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-1 cursor-pointer">
        {/* Glassmorphic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative z-10">
          {/* Header Section - Logo and Title */}
          <div className="flex items-start space-x-4 mb-4">
            {/* Logo Circle */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200/20 flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300 border border-white/10">
                <img
                  src={logo}
                  alt={`${name} Logo`}
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = `w-16 h-16 ${fallbackBgColor} rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-white/10`;
                      parent.innerHTML = `<span class="text-white font-bold text-lg">${logoFallback}</span>`;
                    }
                  }}
                />
              </div>
            </div>
            
            {/* Title and Category */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-gray-100 transition-colors duration-300">
                {name}
              </h3>
              <span className={`${categoryColor} px-3 py-1 rounded-full text-sm font-medium inline-block`}>
                {category}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            {/* Description */}
            <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
              {description}
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></div>
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} text-white rounded-xl text-sm font-medium group-hover:shadow-lg transition-all duration-300`}>
              <span>{ctaIcon}</span>
              <span>{ctaText}</span>
              <svg 
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default AffiliateCard;
