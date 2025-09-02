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
    <div className="group relative bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/50">
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex items-start space-x-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
            <img
              src={logo}
              alt={`${name} Logo`}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.className = `w-10 h-10 ${fallbackBgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`;
                  parent.innerHTML = `<span class="text-white font-bold text-xs">${logoFallback}</span>`;
                }
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-base font-bold text-white group-hover:text-gray-100 transition-colors duration-300 truncate">
              {name}
            </h3>
            <span className={`${categoryColor} px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0`}>
              {category}
            </span>
          </div>

          <p className="text-gray-300 text-xs mb-3 leading-relaxed text-left group-hover:text-gray-200 transition-colors duration-300">
            {description}
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-1 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                <span className="text-green-400">✓</span>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href={ctaLink}
            target="_blank"
            rel="nofollow noopener"
            className={`inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r ${gradientColors.from} ${gradientColors.to} text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium group-hover:shadow-xl group-hover:shadow-opacity-50`}
          >
            <span>{ctaIcon}</span>
            <span>{ctaText}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AffiliateCard;
