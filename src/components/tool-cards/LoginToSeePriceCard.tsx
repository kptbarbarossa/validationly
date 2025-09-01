import React from 'react';

const LoginToSeePriceCard = () => (
  <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10 h-full flex flex-col">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
          <img
            src="/logo-b2b.png"
            alt="B2B Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center";
                parent.innerHTML = '<span class="text-white font-bold text-xs">B2B</span>';
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-base font-bold text-white truncate">Login to See Price</h3>
          <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
            Shopify App
          </span>
        </div>
        <p className="text-gray-300 text-xs mb-3 leading-relaxed line-clamp-3">
          Hide product prices from guests to drive account signups and grow your email list. Perfect for B2B stores, wholesale, and exclusive pricing strategies.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3 mt-auto">
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Easy installation</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">B2B & wholesale ready</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Mobile optimized</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Zero maintenance</span>
      </div>
    </div>
    <a
      href="https://apps.shopify.com/shhhh-pricing"
      target="_blank"
      rel="nofollow noopener"
      className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
    >
      <span>🛍️</span>
      <span>View on Shopify App Store</span>
    </a>
  </div>
);

export default LoginToSeePriceCard;
