import React from 'react';

export default function KamaiMitraLogo({ 
  size = 'md', 
  showText = false, 
  variant = 'light', // 'light' (for white backgrounds) | 'dark' (for dark/teal backgrounds)
  animated = false 
}) {
  // Dimension presets
  const sizeMap = {
    xs: { box: 'w-7 h-7', px: 28 },
    sm: { box: 'w-9 h-9', px: 36 },
    md: { box: 'w-11 h-11 sm:w-12 sm:h-12', px: 48 },
    lg: { box: 'w-16 h-16 sm:w-20 sm:h-20', px: 80 },
    xl: { box: 'w-24 h-24 sm:w-28 sm:h-28', px: 112 }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="inline-flex items-center gap-3 select-none">
      
      {/* Visual Logo Emblem */}
      <div 
        className={`relative ${currentSize.box} rounded-2xl sm:rounded-3xl flex items-center justify-center shrink-0 shadow-lg ${
          variant === 'dark' 
            ? 'shadow-emerald-950/40 ring-1 ring-white/20' 
            : 'shadow-teal-900/15 ring-1 ring-emerald-500/20'
        } ${animated ? 'animate-splash-scale' : 'transition-transform hover:scale-105 active:scale-95'}`}
        style={{
          background: 'linear-gradient(135deg, #042027 0%, #062E38 45%, #0A4350 100%)'
        }}
      >
        {/* Subtle Ambient Radial Highlight */}
        <div 
          className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-60 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 25%, rgba(16, 185, 129, 0.35) 0%, transparent 65%)'
          }}
        />

        {/* Vector Artwork: Modern "V" + "M" + Indian Rupee (₹) + Growth Surge */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-[72%] h-[72%] drop-shadow-md relative z-10"
        >
          <defs>
            {/* Emerald Gradient */}
            <linearGradient id="vmEmerald" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Gold Harvest Gradient */}
            <linearGradient id="vmGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>

            {/* Soft Glow Filter */}
            <filter id="vmGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#10B981" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Protective Shop Canopy Arc ("Vyapar Dukan Chhat") */}
          <path 
            d="M 18 36 Q 50 18 82 36" 
            stroke="url(#vmGold)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            fill="none"
          />

          {/* Mitra Handshake / Partnership Node (Bridge) */}
          <circle cx="50" cy="27" r="4.5" fill="url(#vmGold)" />

          {/* Left "V" Wing (Vyapar) sweeping upward */}
          <path 
            d="M 24 40 L 46 76 Q 50 82 54 76 L 76 40" 
            stroke="white" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.9"
          />

          {/* Central Rupee & Profit Surge Arrow ("M" Mitra + ₹) */}
          <path 
            d="M 34 50 L 66 50 M 34 59 L 60 59" 
            stroke="url(#vmGold)" 
            strokeWidth="4.5" 
            strokeLinecap="round"
          />

          {/* Upward Rising Profit Arrow (Through the center of V) */}
          <path 
            d="M 50 78 L 50 32 M 50 32 L 40 42 M 50 32 L 60 42" 
            stroke="url(#vmEmerald)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            filter="url(#vmGlow)"
          />

          {/* Prosperity Spark (AI Sparkle) in top right */}
          <path 
            d="M 80 20 Q 80 27 87 27 Q 80 27 80 34 Q 80 27 73 27 Q 80 27 80 20 Z" 
            fill="url(#vmGold)" 
          />
        </svg>

        {/* Outer Corner Glow Pin */}
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#062E38] shadow-xs" />
      </div>

      {/* Optional Brand Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`text-[24px] sm:text-[28px] font-extrabold tracking-tight ${
              variant === 'dark' ? 'text-white' : 'text-[#062E38]'
            }`}>
              Kamai<span className="text-emerald-500 font-extrabold">Mitra</span>
            </span>
          </div>
          <span className={`text-[12px] font-medium tracking-wide mt-0.5 ${
            variant === 'dark' ? 'text-teal-200/80' : 'text-slate-500'
          }`}>
            Smart Daily Profit Intelligence
          </span>
        </div>
      )}

    </div>
  );
}
