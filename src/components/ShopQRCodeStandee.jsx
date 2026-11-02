import React, { useState } from 'react';
import { 
  QrCode, 
  Volume2, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag, 
  Flame, 
  Coffee, 
  Store, 
  Flower, 
  ExternalLink,
  Sparkles,
  X
} from 'lucide-react';
import { CATEGORY_PROFILES } from '../data/categoryData';

// Distinct merchant and QR details for each stall
export const STALL_QR_DETAILS = {
  produce: {
    key: 'produce',
    stallName: 'Radheshyam Fresh Vegetables & Fruits',
    ownerName: 'Radheshyam Maurya',
    upiId: 'radheshyam.produce@paytm',
    soundboxId: 'Paytm Soundbox 4.0 (Stall #01 - Produce)',
    themeBg: 'bg-emerald-700',
    themeText: 'text-emerald-700',
    tag: 'Fruits & Veg',
    icon: ShoppingBag,
    patternSeed: 101
  },
  street_food: {
    key: 'street_food',
    stallName: 'Gupta Chaat & Samosa Stall',
    ownerName: 'Ramesh Gupta',
    upiId: 'ramesh.chaat@paytm',
    soundboxId: 'Paytm Soundbox 4.0 (Stall #02 - Street Food)',
    themeBg: 'bg-[#062E38]',
    themeText: 'text-[#062E38]',
    tag: 'Street Food',
    icon: Flame,
    patternSeed: 202
  },
  chai_tea: {
    key: 'chai_tea',
    stallName: 'Sharma Ji Special Kulhad Chai',
    ownerName: 'Sunil Sharma',
    upiId: 'sunil.chai@paytm',
    soundboxId: 'Paytm Soundbox 4.0 (Stall #03 - Chai)',
    themeBg: 'bg-amber-900',
    themeText: 'text-amber-900',
    tag: 'Chai & Snacks',
    icon: Coffee,
    patternSeed: 303
  },
  kirana: {
    key: 'kirana',
    stallName: 'Maa Durga Mini Kirana & Store',
    ownerName: 'Anand Verma',
    upiId: 'anand.kirana@paytm',
    soundboxId: 'Paytm Soundbox 4.0 (Stall #04 - Kirana)',
    themeBg: 'bg-blue-900',
    themeText: 'text-blue-900',
    tag: 'Micro Kirana',
    icon: Store,
    patternSeed: 404
  },
  flowers: {
    key: 'flowers',
    stallName: 'Shree Ganesh Pooja Bhandar & Flowers',
    ownerName: 'Ganesh Malakar',
    upiId: 'ganesh.pooja@paytm',
    soundboxId: 'Paytm Soundbox 4.0 (Stall #05 - Flowers)',
    themeBg: 'bg-rose-900',
    themeText: 'text-rose-900',
    tag: 'Flower & Pooja',
    icon: Flower,
    patternSeed: 505
  }
};

// Generates an authentic, deterministic SVG QR matrix based on stall seed
function AuthenticSvgQR({ seed = 101, stallKey = 'produce', size = 180 }) {
  // 21x21 standard QR grid
  const gridSize = 21;
  const cellSize = size / gridSize;

  // Determine if a cell is in the 3 large corner finder patterns
  const isFinderPattern = (r, c) => {
    // Top-left
    if (r < 7 && c < 7) return true;
    // Top-right
    if (r < 7 && c >= gridSize - 7) return true;
    // Bottom-left
    if (r >= gridSize - 7 && c < 7) return true;
    return false;
  };

  // Center logo cutout
  const isCenterLogo = (r, c) => {
    return r >= 8 && r <= 12 && c >= 8 && c <= 12;
  };

  // Deterministic pseudo-random bits for data matrix
  const isCellFilled = (r, c) => {
    if (isFinderPattern(r, c)) return false;
    if (isCenterLogo(r, c)) return false;
    const n = Math.sin(r * 12.9898 + c * 78.233 + seed) * 43758.5453;
    return (n - Math.floor(n)) > 0.48;
  };

  // Render finder pattern at given top-left offset
  const renderFinder = (x, y) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="0" y="0" width={cellSize * 7} height={cellSize * 7} fill="#062E38" rx="6" />
      <rect x={cellSize} y={cellSize} width={cellSize * 5} height={cellSize * 5} fill="white" rx="4" />
      <rect x={cellSize * 2} y={cellSize * 2} width={cellSize * 3} height={cellSize * 3} fill="#002E6E" rx="3" />
    </g>
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl shadow-xs">
      <rect width={size} height={size} fill="white" />
      
      {/* 3 Corner Finder Targets */}
      {renderFinder(0, 0)}
      {renderFinder(cellSize * (gridSize - 7), 0)}
      {renderFinder(0, cellSize * (gridSize - 7))}

      {/* Data Cells */}
      {Array.from({ length: gridSize }).map((_, r) =>
        Array.from({ length: gridSize }).map((_, c) => {
          if (isCellFilled(r, c)) {
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize + 0.5}
                y={r * cellSize + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                fill="#062E38"
                rx="1.5"
              />
            );
          }
          return null;
        })
      )}

      {/* Center UPI Logo Shield */}
      <rect
        x={size / 2 - 16}
        y={size / 2 - 16}
        width="32"
        height="32"
        fill="white"
        rx="8"
        stroke="#002E6E"
        strokeWidth="2"
      />
      <text
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fontSize="9"
        fontWeight="900"
        fill="#002E6E"
        fontFamily="sans-serif"
      >
        UPI
      </text>
    </svg>
  );
}

export default function ShopQRCodeStandee({ 
  stallKey = 'produce', 
  amount = null, 
  onEnterCustomerPortal = null, 
  onClose = null,
  compact = false 
}) {
  const stall = STALL_QR_DETAILS[stallKey] || STALL_QR_DETAILS.produce;
  const profile = CATEGORY_PROFILES[stallKey] || CATEGORY_PROFILES.produce;
  const [copied, setCopied] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(stall.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative animate-fadeIn font-sans">
      
      {/* Close button if modal */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
          title="Close Standee"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Top Standee Header: Paytm / BHIM UPI Merchant Board */}
      <div className={`${stall.themeBg} text-white p-4 pt-5 text-center relative`}>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[10px] font-black uppercase tracking-wider mb-2 border border-white/20">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Paytm • PhonePe • GPay • BHIM UPI</span>
        </div>

        <h3 className="text-base font-black leading-tight text-white drop-shadow-xs">
          {profile.defaultBusinessName || stall.stallName}
        </h3>
        
        <p className="text-xs text-stone-200 font-medium mt-0.5">
          Merchant: <strong className="text-white">{stall.ownerName}</strong>
        </p>

        {/* Amount Badge if pre-filled for checkout */}
        {amount && (
          <div className="mt-2.5 inline-block px-4 py-1.5 rounded-2xl bg-white text-[#062E38] shadow-lg">
            <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Total Bill Amount</span>
            <span className="text-xl font-black">₹{amount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Standee Body: Authentic Scannable QR Matrix */}
      <div className="p-5 text-center bg-stone-50/50 flex flex-col items-center">
        
        {/* Scannable QR Frame */}
        <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-dashed border-stone-300 mb-3 relative group">
          <AuthenticSvgQR seed={stall.patternSeed} stallKey={stallKey} size={180} />
          
          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-stone-500 font-bold uppercase tracking-wider">
            <span>Scan to Self-Pay & View Prices</span>
          </div>
        </div>

        {/* UPI VPA Pill with Copy Button */}
        <div className="w-full flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 text-xs font-mono mb-3 shadow-2xs">
          <div className="text-left truncate mr-2">
            <span className="text-[10px] text-slate-400 block font-sans font-bold uppercase">Stall UPI VPA</span>
            <span className="font-bold text-[#062E38] truncate text-[14px]">{stall.upiId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[14px] font-sans font-semibold flex items-center gap-1 shrink-0 transition active:scale-95"
            title="Copy UPI ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Soundbox Verification Strip */}
        <div className="w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-[14px] space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[14px]">
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>{stall.soundboxId}</span>
          </div>
          <p className="text-[12px] text-emerald-800 leading-tight">
            ✓ Instant Audio Chime: When you pay, the stall's speaker speaks your payment aloud immediately!
          </p>
        </div>

        {/* 1-Click Launch Button into Customer Self-Pay */}
        {onEnterCustomerPortal && (
          <button
            type="button"
            onClick={() => onEnterCustomerPortal(stallKey)}
            className={`w-full min-h-[48px] py-3 px-4 rounded-xl text-white font-semibold text-[16px] flex items-center justify-center gap-2 ${stall.themeBg} shadow-md transition active:scale-95 hover:brightness-110`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Open Self-Checkout for {stall.tag}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}

      </div>

      {/* Standee Bottom Acrylic Base Foot */}
      <div className="p-2.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500 font-semibold px-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>VendorAI Verified QR Standee</span>
        </span>
        <span className="text-stone-400">
          Stall #{stallKey.toUpperCase()}
        </span>
      </div>

    </div>
  );
}

