import React from 'react';
import AffiliateCard from './AffiliateCard';
import { affiliateCards } from '../data/affiliateCards';

interface AffiliateCardsSectionProps {
  title?: string;
  subtitle?: string;
  maxCards?: number;
  className?: string;
}

const AffiliateCardsSection: React.FC<AffiliateCardsSectionProps> = ({
  title = "🛠️ Recommended Tools for Startups",
  subtitle = "Curated tools and services to help you build, launch, and grow your startup efficiently",
  maxCards,
  className = ""
}) => {
  const cardsToShow = maxCards ? affiliateCards.slice(0, maxCards) : affiliateCards;

  return (
    <div className={`${className}`}>
      {/* Enhanced Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          {title}
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Enhanced Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {cardsToShow.map((card) => (
          <AffiliateCard
            key={card.id}
            {...card}
          />
        ))}
      </div>
    </div>
  );
};

export default AffiliateCardsSection;
