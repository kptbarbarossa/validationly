import React from 'react';

const NextUpKitCard = () => (
  <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10 h-full flex flex-col">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
          <img
            src="https://www.nextupkit.com/favicon.ico"
            alt="NextUpKit Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.className = "w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center";
                parent.innerHTML = '<span class="text-white font-bold text-xs">N</span>';
              }
            }}
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-base font-bold text-white truncate">NextUpKit</h3>
          <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
            Startup Toolkit
          </span>
        </div>
        <p className="text-gray-300 text-xs mb-3 leading-relaxed line-clamp-3">
          Complete startup toolkit with templates, resources, and tools to launch your next project faster. Perfect for founders, developers, and entrepreneurs.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2 mb-3 mt-auto">
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Ready-to-use templates</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Launch resources</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Time-saving tools</span>
      </div>
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        <span className="text-green-400">✓</span>
        <span className="truncate">Proven frameworks</span>
      </div>
    </div>
    <a
      href="https://nextupkit.lemonsqueezy.com?aff=rYX8Vm"
      target="_blank"
      rel="nofollow noopener"
      className="inline-flex items-center justify-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
    >
      <span>🚀</span>
      <span>Get NextUpKit</span>
    </a>
  </div>
);

export default NextUpKitCard;
