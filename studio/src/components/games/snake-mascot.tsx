'use client';

import React from 'react';

interface SnakeMascotProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  withSunglasses?: boolean;
  className?: string;
}

const SnakeMascot: React.FC<SnakeMascotProps> = ({ 
  size = 'medium', 
  animated = false, 
  withSunglasses = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const segmentSize = {
    small: 'w-2 h-2',
    medium: 'w-4 h-4',
    large: 'w-6 h-6'
  };

  return (
    <div className={`flex items-center ${animated ? 'animate-pulse' : ''} ${className}`}>
      {/* Snake head with sunglasses */}
      <div className={`${sizeClasses[size]} bg-yellow-400 border-2 border-yellow-300 relative flex items-center justify-center pixel-border`}>
        {withSunglasses ? (
          <div className="relative">
            {/* Sunglasses */}
            <div className={`absolute ${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-sm' : 'text-xs'} text-black font-bold`}>
              😎
            </div>
          </div>
        ) : (
          <div className={`${size === 'large' ? 'text-lg' : size === 'medium' ? 'text-sm' : 'text-xs'}`}>
            👁️
          </div>
        )}
      </div>

      {/* Snake body segments */}
      <div className={`${segmentSize[size]} bg-yellow-500 border border-yellow-400`} />
      <div className={`${segmentSize[size]} bg-yellow-500 border border-yellow-400`} />
      <div className={`${segmentSize[size]} bg-yellow-500 border border-yellow-400`} />
      
      {size !== 'small' && (
        <>
          <div className={`${segmentSize[size]} bg-yellow-500 border border-yellow-400`} />
          <div className={`${segmentSize[size]} bg-yellow-600 border border-yellow-400`} />
        </>
      )}
    </div>
  );
};

export default SnakeMascot;
