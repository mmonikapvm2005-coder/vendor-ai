import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Trash2, 
  Package, 
  Truck, 
  Layers, 
  Sparkles 
} from 'lucide-react';

export default function HiddenCostEstimator({ categoryProfile }) {
  const defaults = categoryProfile?.hiddenOverhead || {
    lpgCost: 1100,
    lpgDays: 15,
    spoilageCost: 60,
    disposablesCost: 90,
    autoFare: 80,
    lightFee: 50,
    primaryFuelLabel: "Commercial LPG Gas Wear"
  };

  const [lpgDays, setLpgDays] = useState(defaults.lpgDays || 15);
  const [lpgCost, setLpgCost] = useState(defaults.lpgCost || 1100);
  const [spoilageCost, setSpoilageCost] = useState(defaults.spoilageCost || 60);
  const [disposablesCost, setDisposablesCost] = useState(defaults.disposablesCost || 90);
  const [transportCost, setTransportCost] = useState(defaults.autoFare || 80);
  const [stallLightFee, setStallLightFee] = useState(defaults.lightFee || 50);

  // Re-sync when category changes
  useEffect(() => {
    if (categoryProfile?.hiddenOverhead) {
      const h = categoryProfile.hiddenOverhead;
      setLpgDays(h.lpgDays || 15);
      setLpgCost(h.lpgCost || (h.lpgDays ? 1100 : 0));
      setSpoilageCost(h.spoilageCost || 60);
      setDisposablesCost(h.disposablesCost || 90);
      setTransportCost(h.autoFare || 80);
      setStallLightFee(h.lightFee || 50);
    }
  }, [categoryProfile]);

  const dailyLpgCost = lpgDays > 0 ? Math.round(lpgCost / lpgDays) : 0;
  const totalHiddenCosts = dailyLpgCost + spoilageCost + disposablesCost + transportCost + stallLightFee;

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-slate-900 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#062E38]">
            <Layers className="w-5 h-5 text-[#062E38]" />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-[#062E38] flex items-center gap-2">
              <span>Uncover Hidden Overhead & Leakage</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#062E38] text-[12px] font-semibold border border-slate-200">
                {categoryProfile?.label || "True Micro-P&L"}
              </span>
            </h3>
            <p className="text-[14px] text-slate-500 font-normal">
              The invisible leaks customized for {categoryProfile?.label || "your stall type"}
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-right">
          <span className="text-[11px] text-slate-500 uppercase font-semibold block">Today's Hidden OPEX</span>
          <span className="text-[16px] font-bold text-amber-800">₹{totalHiddenCosts} / day</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* 1. Fuel / Fixed Device Overhead */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>{defaults.primaryFuelLabel}</span>
            </span>
            <span className="text-[14px] font-bold text-amber-800">₹{dailyLpgCost}/day</span>
          </div>
          <p className="text-[12px] text-slate-500 mb-2 font-normal">
            {lpgDays > 0 ? `₹${lpgCost} cylinder amortized over ${lpgDays} days.` : "Fixed routine daily equipment allocation."}
          </p>
          {lpgDays > 0 && (
            <div className="flex items-center gap-2.5 text-xs">
              <input 
                type="range" 
                min="10" 
                max="25" 
                value={lpgDays} 
                onChange={(e) => setLpgDays(Number(e.target.value))}
                className="flex-1 accent-[#062E38] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="font-bold text-[#062E38] text-[14px] w-8 text-right">{lpgDays}d</span>
            </div>
          )}
        </div>

        {/* 2. Spoilage & Shrinkage */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Evening Spoilage & Waste Loss</span>
            </span>
            <span className="text-[14px] font-bold text-rose-700">₹{spoilageCost} lost</span>
          </div>
          <p className="text-[12px] text-slate-500 mb-2 font-normal">
            Perishable waste, overripe rot or damaged goods.
          </p>
          <div className="flex items-center gap-2.5 text-xs">
            <input 
              type="range" 
              min="0" 
              max="350" 
              step="10"
              value={spoilageCost} 
              onChange={(e) => setSpoilageCost(Number(e.target.value))}
              className="flex-1 accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-bold text-rose-700 text-[14px] w-10 text-right">₹{spoilageCost}</span>
          </div>
        </div>

        {/* 3. Consumable Packaging */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#062E38]" />
              <span>Packaging, Bags & Disposables</span>
            </span>
            <span className="text-[14px] font-bold text-amber-800">₹{disposablesCost}/day</span>
          </div>
          <p className="text-[12px] text-slate-500 mb-2 font-normal">
            Paper bags, plastic carry bags, cups & napkins.
          </p>
          <div className="flex items-center gap-2.5 text-xs">
            <input 
              type="range" 
              min="20" 
              max="250" 
              step="10"
              value={disposablesCost} 
              onChange={(e) => setDisposablesCost(Number(e.target.value))}
              className="flex-1 accent-[#062E38] h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="font-bold text-[#062E38] text-[14px] w-10 text-right">₹{disposablesCost}</span>
          </div>
        </div>

        {/* 4. Transport & Electricity */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-teal-700" />
              <span>Transport & Stall Utilities</span>
            </span>
            <span className="text-[14px] font-bold text-amber-800">₹{transportCost + stallLightFee}/day</span>
          </div>
          <p className="text-[12px] text-slate-500 mb-2 font-normal">
            Mandi tempo / logistics (₹{transportCost}) + Electricity & space fee (₹{stallLightFee}).
          </p>
          <div className="flex items-center justify-between text-[13px] pt-1 font-medium">
            <span className="text-slate-700 font-semibold">Transport ₹{transportCost}</span>
            <span className="text-slate-700 font-semibold">Utility ₹{stallLightFee}</span>
            <span className="text-slate-400 font-normal text-[11px]">Fixed Routine</span>
          </div>
        </div>

      </div>

      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2 text-[14px]">
        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="text-slate-700 font-normal">
          <strong className="text-[#062E38]">True Profit Logic:</strong> Accounting for these ₹{totalHiddenCosts} ensures {categoryProfile?.label || "your store"} shows genuine take-home cash in pocket.
        </span>
      </div>

    </div>
  );
}
