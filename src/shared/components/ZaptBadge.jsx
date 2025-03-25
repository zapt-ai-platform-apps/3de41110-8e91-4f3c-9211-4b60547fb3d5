import React from 'react';

const ZaptBadge = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <a
        href="https://www.zapt.ai"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center bg-gray-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
      >
        Made on ZAPT
      </a>
    </div>
  );
};

export default ZaptBadge;