import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, 
  TrendingUp,
  Minus,
  AlertTriangle, 
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
  PlusCircle,
  Filter,
  Radio
} from 'lucide-react';

// ─── City-specific wholesale mandi price multipliers ──────────────────────────
// Prices vary city to city based on:
//   • Distance from production farms
//   • Local demand & competition
//   • Transport & cold-chain costs
const CITY_CONFIG = {
  delhi: {
    id: 'delhi',
    name: 'Delhi',
    nameFull: 'Delhi — Azadpur APMC Mandi',
    flag: '🏛️',
    activeClass: 'bg-orange-600 text-white shadow-sm',
    inactiveClass: 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-900',
    bannerClass: 'bg-orange-50 border-orange-200',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-200',
    // Base prices (Delhi = 1.0) — Asia's largest fresh produce mandi
    priceMultiplier: 1.0,
    note: "Asia's largest wholesale mandi • Morning Auction Rates 5:00 AM"
  },
  mumbai: {
    id: 'mumbai',
    name: 'Mumbai',
    nameFull: 'Mumbai — Vashi APMC, Navi Mumbai',
    flag: '🌊',
    activeClass: 'bg-blue-600 text-white shadow-sm',
    inactiveClass: 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900',
    bannerClass: 'bg-blue-50 border-blue-200',
    badgeClass: 'bg-blue-100 text-blue-900 border-blue-200',
    // Mumbai 10–15% higher — long transport from UP/MP farms + high urban demand
    priceMultiplier: 1.13,
    note: 'Vashi APMC, Navi Mumbai • Prices higher due to transport from farms'
  },
  kolkata: {
    id: 'kolkata',
    name: 'Kolkata',
    nameFull: 'Kolkata — Kolay Market, Mechua',
    flag: '🌿',
    activeClass: 'bg-green-700 text-white shadow-sm',
    inactiveClass: 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-green-50 hover:border-green-300 hover:text-green-900',
    bannerClass: 'bg-green-50 border-green-200',
    badgeClass: 'bg-green-100 text-green-900 border-green-200',
    // Kolkata 7–10% cheaper — close to Bengal, Bihar & Odisha farms
    priceMultiplier: 0.91,
    note: 'Kolay Market Mechua & Howrah Mandi • Fresh from nearby Bengal farms'
  },
  chennai: {
    id: 'chennai',
    name: 'Chennai',
    nameFull: 'Chennai — Koyambedu APMC Complex',
    flag: '☀️',
    activeClass: 'bg-rose-600 text-white shadow-sm',
    inactiveClass: 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-900',
    bannerClass: 'bg-rose-50 border-rose-200',
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-200',
    // Chennai 5–9% higher — South India logistics & warm climate spoilage premium
    priceMultiplier: 1.07,
    note: 'Koyambedu Wholesale Complex • 4:30 AM South India Auction Rates'
  }
};

export default function MandiArbitrage({ vendorExpenses, categoryProfile, onAddExpense }) {
  const [selectedCity, setSelectedCity] = useState('delhi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'leakage'
  const [quickAddedId, setQuickAddedId] = useState(null);

  const city = CITY_CONFIG[selectedCity];

  // Apply city-specific price multiplier to all mandi items (deterministic)
  const allMandiItems = useMemo(() => {
    const baseItems = categoryProfile?.mandiData || [];
    const mul = city.priceMultiplier;
    return baseItems.map(item => {
      const cityAvg   = Math.round(item.mandiAvgRate * mul);
      const cityMin   = Math.round(item.mandiMin * mul);
      const cityMax   = Math.round(item.mandiMax * mul);
      const cityRetail = Math.round((item.retailRate || Math.round(item.mandiAvgRate * 1.35)) * mul);
      const cityVendor = Math.round((item.vendorRate || item.mandiAvgRate) * mul);
      const cityOvercharge = Math.max(0, cityVendor - cityAvg);
      const citySaving = cityOvercharge > 0
        ? Math.round((item.purchasedQty || 10) * cityOvercharge * 0.5)
        : 0;
      return {
        ...item,
        mandiAvgRate: cityAvg,
        mandiMin: cityMin,
        mandiMax: cityMax,
        retailRate: cityRetail,
        vendorRate: cityVendor,
        overchargePerUnit: cityOvercharge,
        potentialSaving: citySaving,
        status: cityOvercharge > 0 ? 'overcharged' : 'optimal',
        supplierNote: `${city.nameFull}: Mandi modal rate ₹${cityAvg}/${item.unit}. Retail sell @ ₹${cityRetail}/${item.unit}.`
      };
    });
  }, [categoryProfile, city]);

  // Distinct sub-categories for filter chips
  const subCategories = useMemo(() => {
    const cats = new Set(['All']);
    allMandiItems.forEach(item => { if (item.category) cats.add(item.category); });
    return Array.from(cats);
  }, [allMandiItems]);

  // Apply filters
  const filteredItems = useMemo(() => {
    return allMandiItems.filter(item => {
      if (selectedSubCategory !== 'All' && item.category !== selectedSubCategory) return false;
      if (viewMode === 'leakage' && (!item.potentialSaving || item.potentialSaving <= 0)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.item.toLowerCase().includes(q)
          || item.category?.toLowerCase().includes(q)
          || item.supplierNote?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allMandiItems, selectedSubCategory, viewMode, searchQuery]);

  const overchargedItems = allMandiItems.filter(i => (i.potentialSaving || 0) > 0);
  const totalDailyLeakage = overchargedItems.reduce((acc, i) => acc + (i.potentialSaving || 0), 0);
  const monthlyProjectedSavings = totalDailyLeakage * 26;

  const handleQuickAdd = (item) => {
    if (onAddExpense) {
      onAddExpense({
        id: Date.now(),
        name: `${item.item} (${city.name} Mandi)`,
        category: item.category || 'Stock',
        qty: item.purchasedQty || 10,
        unit: item.unit.split(' ')[0] || 'kg',
        amount: Math.round((item.vendorRate || item.mandiAvgRate) * (item.purchasedQty || 10)),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setQuickAddedId(item.id);
      setTimeout(() => setQuickAddedId(null), 2000);
    }
  };

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-stone-900 space-y-4">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 pb-3 border-b border-[#EAE3D7]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-2 flex-wrap">
                <span>Live Market Prices</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${city.badgeClass}`}>
                  {categoryProfile?.label || 'Market Rates'}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                  Today's Rates
                </span>
              </h3>
              <p className="text-[12px] text-stone-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                {city.nameFull} • {city.note}
              </p>
            </div>
          </div>
        </div>

        {/* ── 4 City Tabs ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <MapPin className="w-3.5 h-3.5" />
            Select City:
          </span>
          {Object.values(CITY_CONFIG).map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedCity(c.id); setSelectedSubCategory('All'); }}
              className={`flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl text-[14px] font-semibold transition active:scale-95 ${
                selectedCity === c.id ? c.activeClass : c.inactiveClass
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* City price info banner */}
        <div className={`px-3.5 py-2.5 rounded-xl border text-[12px] font-medium flex items-center gap-2 ${city.bannerClass}`}>
          <Sparkles className="w-4 h-4 shrink-0 opacity-80" />
          <span>
            <strong>{city.name} price level:</strong>{' '}
            {city.priceMultiplier === 1.0
              ? 'Base reference prices (Delhi Azadpur = national benchmark)'
              : city.priceMultiplier > 1.0
              ? `~${Math.round((city.priceMultiplier - 1) * 100)}% higher than Delhi due to transport & local demand`
              : `~${Math.round((1 - city.priceMultiplier) * 100)}% cheaper than Delhi — close to farm supply zones`}
          </span>
        </div>
      </div>

      {/* ── Leakage Alert Banner ────────────────────────────────────────── */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-900">
              {overchargedItems.length > 0
                ? `Middleman Markup Alert: ${overchargedItems.length} Items Above ${city.name} APMC Official Rate`
                : `All Sourced Items Within ${city.name} APMC Optimal Auction Rate`}
            </div>
            <p className="text-[11px] text-amber-800/90 mt-0.5">
              Compared against today's morning auction rates at {city.nameFull}.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-amber-200 pt-2 sm:pt-0 sm:pl-3 shrink-0">
          <div>
            <div className="text-[9px] text-amber-700 uppercase font-bold">Daily Middleman Cut</div>
            <div className="text-base font-black text-amber-900">₹{totalDailyLeakage}</div>
          </div>
          <div>
            <div className="text-[9px] text-emerald-700 uppercase font-bold">Monthly Direct Saving</div>
            <div className="text-base font-black text-emerald-800">₹{monthlyProjectedSavings.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ── Controls: Search + View Toggle + Sub-Category Chips ─────────── */}
      <div className="space-y-2.5 pt-1">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${allMandiItems.length} items (e.g. Tamatar, Aloo, Oil, Milk)...`}
              className="w-full pl-9 pr-3 py-2.5 min-h-[48px] rounded-xl bg-white border border-slate-300 text-[14px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-sm font-bold">✕</button>
            )}
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 text-[14px] font-semibold gap-1">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-2 rounded-lg transition min-h-[40px] ${
                viewMode === 'all' ? 'bg-[#062E38] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items ({allMandiItems.length})
            </button>
            <button
              onClick={() => setViewMode('leakage')}
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 min-h-[40px] ${
                viewMode === 'leakage' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overcharged ({overchargedItems.length})</span>
            </button>
          </div>
        </div>

        {subCategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] text-slate-500 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {subCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition ${
                  selectedSubCategory === cat
                    ? 'bg-[#062E38] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Market Rates Table ─────────────────────────────────────────── */}
      <div className="overflow-x-auto border border-[#EAE3D7] rounded-2xl bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3 font-bold">Item & Category</th>
              <th className="py-2.5 px-2 font-bold text-center">Trend</th>
              <th className="py-2.5 px-2 font-bold text-right">{city.name} Mandi Rate</th>
              <th className="py-2.5 px-2 font-bold text-right">Range</th>
              <th className="py-2.5 px-2 font-bold text-right">Retail Price</th>
              <th className="py-2.5 px-2 font-bold text-right">Margin</th>
              <th className="py-2.5 px-2 font-bold text-right">Your Supplier</th>
              <th className="py-2.5 px-3 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-stone-400">
                  No items match "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredItems.map((row) => {
                const isOvercharged = (row.potentialSaving || 0) > 0;
                return (
                  <tr key={row.id || row.item} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                        <span>{row.item}</span>
                        {row.category && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F5F1EB] text-stone-600 border border-[#EAE3D7] font-semibold">
                            {row.category}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {city.name} APMC modal: ₹{row.mandiAvgRate}/{row.unit}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {row.trend === 'up' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                          <TrendingUp className="w-3 h-3" />
                          <span>{row.trendChange || 'Up'}</span>
                        </span>
                      )}
                      {row.trend === 'down' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <TrendingDown className="w-3 h-3" />
                          <span>{row.trendChange || 'Down'}</span>
                        </span>
                      )}
                      {row.trend === 'stable' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold border border-stone-200">
                          <Minus className="w-3 h-3" />
                          <span>Steady</span>
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-2 text-right whitespace-nowrap font-bold text-[#062E38]">
                      ₹{row.mandiAvgRate}
                      <span className="text-[11px] text-slate-500 font-normal">/{row.unit}</span>
                    </td>

                    <td className="py-2.5 px-2 text-right whitespace-nowrap text-stone-500 text-[11px]">
                      ₹{row.mandiMin} – ₹{row.mandiMax}
                    </td>

                    <td className="py-2.5 px-2 text-right whitespace-nowrap font-bold text-stone-800">
                      ₹{row.retailRate}
                      <span className="text-[10px] text-stone-500 font-normal">/{row.unit}</span>
                    </td>

                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
                        {row.margin || '30%'}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      {isOvercharged ? (
                        <div>
                          <div className="font-bold text-amber-700 text-xs">₹{row.vendorRate}/{row.unit}</div>
                          <div className="text-[9px] text-amber-600 font-bold">+₹{row.overchargePerUnit} markup</div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-stone-700 text-xs">₹{row.vendorRate}/{row.unit}</span>
                          <div className="text-[9px] text-emerald-700 font-semibold">✓ Best Rate</div>
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {quickAddedId === row.id ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleQuickAdd(row)}
                          title="Record today's purchase into Micro-Ledger"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#062E38] text-slate-800 hover:text-white border border-slate-300 hover:border-[#062E38] text-[12px] font-semibold transition active:scale-95 shadow-2xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Log Purchase</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Smart Tip Footer ─────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-2 text-[14px]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="text-slate-700">
            <strong>Smart Strategy:</strong> Show this {city.name} APMC modal rate directly to your supplier to eliminate the middleman surcharge and save ₹{monthlyProjectedSavings.toLocaleString()}/month.
          </span>
        </div>
        <span className="text-[10px] text-stone-500 font-bold shrink-0 hidden sm:inline">
          {city.nameFull} • Today 5:00 AM
        </span>
      </div>

    </div>
  );
}
