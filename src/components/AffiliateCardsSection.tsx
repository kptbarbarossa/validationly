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
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          {title}
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
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
