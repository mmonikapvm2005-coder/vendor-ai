import React, { useState, useMemo } from 'react';
import { 
  TrendingDown, 
  TrendingUp,
  Minus,
  AlertTriangle, 
  Building2,
  Sparkles,
  Search,
  CheckCircle2,
  PlusCircle,
  Tag,
  ArrowUpDown,
  Filter
} from 'lucide-react';

export default function MandiArbitrage({ vendorExpenses, categoryProfile, onAddExpense }) {
  const [selectedMandi, setSelectedMandi] = useState('Azadpur Mandi (Delhi)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'leakage'
  const [quickAddedId, setQuickAddedId] = useState(null);

  // Full day-to-day market benchmark list from category profile
  const allMandiItems = useMemo(() => {
    return categoryProfile?.mandiData || [];
  }, [categoryProfile]);

  // Extract distinct sub-categories for filter chips
  const subCategories = useMemo(() => {
    const cats = new Set(['All']);
    allMandiItems.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [allMandiItems]);

  // Filtered items based on search query, sub-category chip, and view mode
  const filteredItems = useMemo(() => {
    return allMandiItems.filter(item => {
      // Sub-category filter
      if (selectedSubCategory !== 'All' && item.category !== selectedSubCategory) {
        return false;
      }
      // View mode filter (only overcharged if 'leakage' mode)
      if (viewMode === 'leakage' && (!item.potentialSaving || item.potentialSaving <= 0)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.item.toLowerCase().includes(query);
        const matchCat = item.category?.toLowerCase().includes(query);
        const matchNote = item.supplierNote?.toLowerCase().includes(query);
        return matchName || matchCat || matchNote;
      }
      return true;
    });
  }, [allMandiItems, selectedSubCategory, viewMode, searchQuery]);

  // Calculations for summary banner
  const overchargedItems = allMandiItems.filter(i => (i.potentialSaving || 0) > 0);
  const totalDailyLeakage = overchargedItems.reduce((acc, i) => acc + (i.potentialSaving || 0), 0);
  const monthlyProjectedSavings = totalDailyLeakage * 26;

  // Handle 1-click add to today's micro-ledger
  const handleQuickAdd = (item) => {
    if (onAddExpense) {
      onAddExpense({
        id: Date.now(),
        name: `${item.item} (Mandi Lot)`,
        category: item.category || "Stock",
        qty: item.purchasedQty || 10,
        unit: item.unit.split(' ')[0] || "kg",
        amount: Math.round((item.vendorRate || item.mandiAvgRate) * (item.purchasedQty || 10)),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setQuickAddedId(item.id);
      setTimeout(() => setQuickAddedId(null), 2000);
    }
  };

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-stone-900 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAE3D7]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-stone-900 flex items-center gap-2 flex-wrap">
              <span>Day-to-Day Market Prices & Mandi Arbitrage</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-200">
                {categoryProfile?.label || "Live Market"}
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Official APMC auction modal rates, daily trends & retail margins for {allMandiItems.length} items
            </p>
          </div>
        </div>

        {/* APMC Location Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Building2 className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={selectedMandi}
            onChange={(e) => setSelectedMandi(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#DCD1C0] text-stone-800 text-xs font-semibold focus:outline-none focus:border-[#0A1D37]"
          >
            <option>Azadpur Mandi (Delhi)</option>
            <option>Ghazipur Phool & Sabzi Mandi</option>
            <option>Vashi APMC (Mumbai)</option>
            <option>Koyambedu Wholesale (Chennai)</option>
            <option>Khari Baoli / Naya Bazar</option>
          </select>
        </div>
      </div>

      {/* Hero Leakage & Arbitrage Alert Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-900">
              {overchargedItems.length > 0 
                ? `Middleman Markup Alert: ${overchargedItems.length} Items Priced Above Official Mandi Rate`
                : "All Sourced Items are Within Optimal Mandi Modal Auction Rates"}
            </div>
            <p className="text-[11px] text-amber-800/90 mt-0.5">
              Live comparison against today's morning auction sheets at {selectedMandi}.
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

      {/* Controls: Search, View Mode Toggle, and Sub-Category Filter Chips */}
      <div className="space-y-2.5 pt-1">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${allMandiItems.length} items (e.g. Tamatar, Aloo, Oil, Milk, Kela)...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#0A1D37] transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-[#F5F1EB] p-1 rounded-xl border border-[#EAE3D7] shrink-0 text-xs font-bold">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'all'
                  ? 'bg-[#0A1D37] text-white shadow-sm font-extrabold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Items ({allMandiItems.length})
            </button>
            <button
              onClick={() => setViewMode('leakage')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${
                viewMode === 'leakage'
                  ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Overcharged ({overchargedItems.length})</span>
            </button>
          </div>
        </div>

        {/* Sub-Category Filter Chips */}
        {subCategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] text-stone-500 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filter:
            </span>
            {subCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedSubCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                  selectedSubCategory === cat
                    ? 'bg-[#0A1D37] text-white shadow-xs'
                    : 'bg-[#F5F1EB] text-stone-600 hover:bg-[#EAE3D7] border border-[#EAE3D7]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comprehensive Day-to-Day Market Rates Table */}
      <div className="overflow-x-auto border border-[#EAE3D7] rounded-2xl bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#EAE3D7] text-stone-500 uppercase text-[9px] tracking-wider">
              <th className="py-2.5 px-3 font-bold">Item & Sub-Category</th>
              <th className="py-2.5 px-2 font-bold text-center">Day Trend</th>
              <th className="py-2.5 px-2 font-bold text-right">Mandi Modal Rate</th>
              <th className="py-2.5 px-2 font-bold text-right">Mandi Range</th>
              <th className="py-2.5 px-2 font-bold text-right">Retail Sell Rate</th>
              <th className="py-2.5 px-2 font-bold text-right">Margin</th>
              <th className="py-2.5 px-2 font-bold text-right">Supplier Price</th>
              <th className="py-2.5 px-3 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-stone-400">
                  No items match the filter or search query "{searchQuery}"
                </td>
              </tr>
            ) : (
              filteredItems.map((row) => {
                const isOvercharged = (row.potentialSaving || 0) > 0;
                return (
                  <tr key={row.id || row.item} className="hover:bg-[#FAF8F5] transition">
                    
                    {/* Item Name & Notes */}
                    <td className="py-2.5 px-3">
                      <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                        <span>{row.item}</span>
                        {row.category && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F5F1EB] text-stone-600 border border-[#EAE3D7] font-semibold">
                            {row.category}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                        {row.supplierNote}
                      </div>
                    </td>

                    {/* Day-to-Day Trend Indicator */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {row.trend === 'up' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                          <TrendingUp className="w-3 h-3" />
                          <span>{row.trendChange || "Up"}</span>
                        </span>
                      )}
                      {row.trend === 'down' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <TrendingDown className="w-3 h-3" />
                          <span>{row.trendChange || "Down"}</span>
                        </span>
                      )}
                      {row.trend === 'stable' && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-bold border border-stone-200">
                          <Minus className="w-3 h-3" />
                          <span>Steady</span>
                        </span>
                      )}
                    </td>

                    {/* Mandi Wholesale Rate */}
                    <td className="py-2.5 px-2 text-right whitespace-nowrap font-extrabold text-[#0A1D37]">
                      ₹{row.mandiAvgRate}
                      <span className="text-[10px] text-stone-500 font-normal">/{row.unit}</span>
                    </td>

                    {/* Mandi Range (Min - Max) */}
                    <td className="py-2.5 px-2 text-right whitespace-nowrap text-stone-500 text-[11px]">
                      ₹{row.mandiMin} - ₹{row.mandiMax}
                    </td>

                    {/* Street Retail Selling Price */}
                    <td className="py-2.5 px-2 text-right whitespace-nowrap font-bold text-stone-800">
                      ₹{row.retailRate || Math.round(row.mandiAvgRate * 1.35)}
                      <span className="text-[10px] text-stone-500 font-normal">/{row.unit}</span>
                    </td>

                    {/* Retail Margin % */}
                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
                        {row.margin || "30%"}
                      </span>
                    </td>

                    {/* Middleman / Supplier Rate & Leakage */}
                    <td className="py-2.5 px-2 text-right whitespace-nowrap">
                      {isOvercharged ? (
                        <div>
                          <div className="font-bold text-amber-700 text-xs">
                            ₹{row.vendorRate}/{row.unit}
                          </div>
                          <div className="text-[9px] text-amber-600 font-bold">
                            +₹{row.overchargePerUnit} markup
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-stone-700 text-xs">₹{row.vendorRate || row.mandiAvgRate}/{row.unit}</span>
                          <div className="text-[9px] text-emerald-700 font-semibold">Best Rate</div>
                        </div>
                      )}
                    </td>

                    {/* Action: 1-Click Log Purchase into Ledger */}
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
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F5F1EB] hover:bg-[#0A1D37] text-stone-800 hover:text-white border border-[#DCD1C0] hover:border-[#0A1D37] text-[10px] font-bold transition active:scale-95 shadow-2xs"
                        >
                          <PlusCircle className="w-3 h-3" />
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

      {/* Helpful Negotiation Munshi Tip */}
      <div className="p-3 rounded-2xl bg-[#F5F1EB] border border-[#EAE3D7] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0A1D37] shrink-0" />
          <span className="text-stone-700 text-[11px]">
            <strong>Profit Munshi Rule:</strong> Show this APMC modal benchmark rate directly to wholesale dealers to eliminate the middleman surcharge.
          </span>
        </div>
        <span className="text-[10px] text-stone-500 font-bold shrink-0 hidden sm:inline">
          Updated: Today 5:00 AM APMC Broadcast
        </span>
      </div>

    </div>
  );
}
