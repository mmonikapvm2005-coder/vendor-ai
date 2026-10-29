import React, { useState } from 'react';
import { 
  Sparkles, 
  Scale, 
  Check, 
  Coffee, 
  Utensils
} from 'lucide-react';

export default function MarginOptimizer() {
  const [activeStrategy, setActiveStrategy] = useState('combo');

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-stone-900 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#EAE3D7]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAE3D7] flex items-center justify-center text-[#0A1D37]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-2">
              <span>Margin & Portion Advisor</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAE3D7] text-[#0A1D37] text-[10px] font-bold border border-[#DCD1C0]">
                AI Defense
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Protect profit during raw material price spikes
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-semibold">
          Alert: Oil & Onion Surge (+18%)
        </span>
      </div>

      {/* Strategies */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        
        <button
          onClick={() => setActiveStrategy('combo')}
          className={`p-3 rounded-2xl border text-left transition ${
            activeStrategy === 'combo'
              ? 'bg-[#FAF8F5] border-[#0A1D37] shadow-sm'
              : 'bg-white border-[#EAE3D7] hover:border-[#DCD1C0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-stone-900 text-xs">1. Combo Pairing</span>
            <Coffee className="w-3.5 h-3.5 text-[#0A1D37]" />
          </div>
          <p className="text-[10px] text-stone-500">
            Pair Samosa with High-Margin Cutting Chai (82% margin).
          </p>
        </button>

        <button
          onClick={() => setActiveStrategy('portion')}
          className={`p-3 rounded-2xl border text-left transition ${
            activeStrategy === 'portion'
              ? 'bg-[#FAF8F5] border-[#0A1D37] shadow-sm'
              : 'bg-white border-[#EAE3D7] hover:border-[#DCD1C0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-stone-900 text-xs">2. Portion Sizing</span>
            <Scale className="w-3.5 h-3.5 text-[#0A1D37]" />
          </div>
          <p className="text-[10px] text-stone-500">
            Calibrate gravy portion by 15ml instead of raising price.
          </p>
        </button>

        <button
          onClick={() => setActiveStrategy('bulk')}
          className={`p-3 rounded-2xl border text-left transition ${
            activeStrategy === 'bulk'
              ? 'bg-[#FAF8F5] border-[#0A1D37] shadow-sm'
              : 'bg-white border-[#EAE3D7] hover:border-[#DCD1C0]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-stone-900 text-xs">3. 15L Tin Buy</span>
            <Utensils className="w-3.5 h-3.5 text-[#0A1D37]" />
          </div>
          <p className="text-[10px] text-stone-500">
            Switch from 1L pouches to wholesale 15L commercial tin.
          </p>
        </button>

      </div>

      {/* Selected Action Details */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D7] text-xs">
        {activeStrategy === 'combo' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#0A1D37]">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended: "Samosa + Chai" Morning Combo @ ₹25</span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              Standalone Samosa cost jumped to ₹9.20 (Only ₹5.80 profit).
              Chai costs ₹2.20 to make and sells for ₹10 (₹7.80 profit).
              Sold together for ₹25, your combined margin reaches <strong>54.4%</strong> (₹13.60 take-home cash), completely shielding your stall from the edible oil rally!
            </p>
          </div>
        )}

        {activeStrategy === 'portion' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#0A1D37]">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended: Portion Calibration Without Quality Loss</span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              Street food customers are highly price-sensitive. Raising prices from ₹15 to ₹20 causes a ~35% drop in footfall.
              Maintaining frying temperature at 175°C cuts oil absorption by 12% and standardized 40ml chutney scoops saves ₹110 daily.
            </p>
          </div>
        )}

        {activeStrategy === 'bulk' && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#0A1D37]">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Recommended: Group Buy with Adjacent Cart Vendor</span>
            </div>
            <p className="text-stone-700 text-[11px] leading-relaxed">
              Buying 5 single-litre pouches at ₹130/L costs ₹650.
              A 15L commercial wholesale tin costs ₹1,770 (₹118/L).
              Splitting one tin every 3 days saves your stall <strong>₹5,400 annually</strong>.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
