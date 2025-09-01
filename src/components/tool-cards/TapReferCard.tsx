import React from 'react';

const TapReferCard = () => (
  <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10 h-full flex flex-col">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
          <img
            src="https://taprefer.com/favicon.ico"
            alt="TapRefer Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = "w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center";
                parent.innerHTML = '<span class="text-white font-bold text-xs">T</span>';
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-base font-bold text-white truncate">TapRefer</h3>
          <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
            Referral Platform
          </span>
        </div>
        <p className="text-gray-300 text-xs mb-3 leading-relaxed line-clamp-3">
          Build a powerful referral program to grow your business. Track referrals, reward customers, and boost sales with automated referral marketing.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3 mt-auto">
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Automated tracking</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Custom rewards</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Analytics dashboard</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Easy integration</span>
      </div>
    </div>
    <a
      href="https://taprefer.com?aff=rYX8Vm"
      target="_blank"
      rel="nofollow noopener"
      className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
    >
      <span>🎯</span>
      <span>Start Referral Program</span>
    </a>
  </div>
);

export default TapReferCard;
