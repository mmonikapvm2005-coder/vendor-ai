import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShoppingBag, 
  Flame, 
  Coffee, 
  Store, 
  Flower, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  IndianRupee,
  ArrowUp
} from 'lucide-react';
import { CATEGORY_PROFILES } from '../data/categoryData';

export default function ShopMonthlyBarChart({ 
  stallRevenues = {}, 
  stallExpenses = {}, 
  paymentTransactions = {}, 
  currentLang = 'en', 
  activeStallKey = 'produce',
}) {
  const [viewMode, setViewMode] = useState('6month'); // '6month' | '12month'

  // Metadata for the 5 stalls
  const STALL_CONFIG = {
    produce: {
      key: 'produce',
      nameEn: 'Radheshyam Fresh Vegetables & Fruits',
      nameTa: 'ராதேஷ்யாம் காய்கறி & பழக் கடை',
      nameHi: 'राधेश्याम ताज़ा सब्ज़ी व फल',
      owner: 'Radheshyam Maurya',
      icon: ShoppingBag,
      color: 'emerald',
      barColor: 'from-emerald-500 to-teal-700',
      profitBarColor: 'from-teal-400 to-emerald-600',
      badge: '🥬'
    },
    street_food: {
      key: 'street_food',
      nameEn: 'Gupta Chaat & Samosa Stall',
      nameTa: 'குப்தா சாட் & சமோசா கடை',
      nameHi: 'गुप्ता चाट व समोसा स्टॉल',
      owner: 'Ramesh Gupta',
      icon: Flame,
      color: 'amber',
      barColor: 'from-amber-500 to-amber-700',
      profitBarColor: 'from-yellow-400 to-amber-600',
      badge: '🍲'
    },
    chai_tea: {
      key: 'chai_tea',
      nameEn: 'Sharma Ji Special Kulhad Chai',
      nameTa: 'சர்மா ஜி குல்ஹத் டீ கடை',
      nameHi: 'शर्मा जी स्पेशल कुल्हड़ चाय',
      owner: 'Sunil Sharma',
      icon: Coffee,
      color: 'orange',
      barColor: 'from-orange-500 to-amber-800',
      profitBarColor: 'from-orange-400 to-amber-700',
      badge: '☕'
    },
    kirana: {
      key: 'kirana',
      nameEn: 'Maa Durga Mini Kirana & Store',
      nameTa: 'மா துர்கா மினி மளிகை கடை',
      nameHi: 'माँ दुर्गा मिनी किराना स्टोर',
      owner: 'Anand Verma',
      icon: Store,
      color: 'blue',
      barColor: 'from-blue-500 to-cyan-800',
      profitBarColor: 'from-blue-400 to-cyan-700',
      badge: '🏪'
    },
    flowers: {
      key: 'flowers',
      nameEn: 'Shree Ganesh Pooja Bhandar & Flowers',
      nameTa: 'ஸ்ரீ கணேஷ் பூ மற்றும் பூஜை பொருட்கள்',
      nameHi: 'श्री गणेश पूजा भंडार व फूल',
      owner: 'Ganesh Malakar',
      icon: Flower,
      color: 'rose',
      barColor: 'from-rose-500 to-pink-800',
      profitBarColor: 'from-rose-400 to-pink-700',
      badge: '🌸'
    }
  };

  // Get the active stall config
  const stallConfig = STALL_CONFIG[activeStallKey] || STALL_CONFIG.produce;
  const profile = CATEGORY_PROFILES[activeStallKey] || CATEGORY_PROFILES.produce;
  const StallIcon = stallConfig.icon;

  // Compute current stall financials (deterministic)
  const rev = stallRevenues[activeStallKey] || profile.revenue || { cash: 0, upi: 0, total: 0 };
  const exps = stallExpenses[activeStallKey] || profile.initialExpenses || [];
  const txList = paymentTransactions[activeStallKey] || [];

  const dailySales = Math.max(0, Number(rev.total) || 0);
  const dailyExpenses = exps.reduce((sum, item) => sum + Math.max(0, Number(item?.amount) || 0), 0);
  const dailyProfit = dailySales - dailyExpenses;
  const monthlySales = dailySales * 30;
  const monthlyExpenses = dailyExpenses * 30;
  const monthlyProfit = monthlySales - monthlyExpenses;
  const marginPercent = monthlySales > 0 ? ((monthlyProfit / monthlySales) * 100).toFixed(1) : '0.0';
  const selfPayTotal = txList.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const stallName = currentLang === 'hi'
    ? stallConfig.nameHi
    : currentLang === 'ta'
    ? stallConfig.nameTa
    : stallConfig.nameEn;

  // ── 6-Month trend data for this shop ──────────────────────────────────────
  // Growth factors: roughly +16% over half-year with seasonal variance
  const MONTH_NAMES_EN = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov (Now)'];
  const MONTH_NAMES_TA = ['ஜூன்', 'ஜுலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ. (இப்போது)'];
  const MONTH_NAMES_HI = ['जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नव. (अभी)'];
  const GROWTH_FACTORS_6 = [0.84, 0.88, 0.92, 0.95, 0.98, 1.0];

  const SIX_MONTH_DATA = GROWTH_FACTORS_6.map((factor, idx) => {
    const s = Math.round(monthlySales * factor);
    const e = Math.round(monthlyExpenses * factor);
    return {
      label: currentLang === 'ta' ? MONTH_NAMES_TA[idx] : currentLang === 'hi' ? MONTH_NAMES_HI[idx] : MONTH_NAMES_EN[idx],
      sales: s,
      expenses: e,
      profit: s - e,
      isCurrent: idx === 5
    };
  });

  // ── 12-Month (yearly) trend data for this shop ────────────────────────────
  const MONTH_NAMES_12_EN = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const MONTH_NAMES_12_TA = ['டிச.', 'ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜுலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.'];
  const MONTH_NAMES_12_HI = ['दिसंबर', 'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर'];
  // Seasonal growth curve — low in monsoon, peak in festive & winter
  const GROWTH_FACTORS_12 = [0.72, 0.74, 0.77, 0.80, 0.84, 0.88, 0.83, 0.86, 0.91, 0.95, 0.98, 1.0];

  const TWELVE_MONTH_DATA = GROWTH_FACTORS_12.map((factor, idx) => {
    const s = Math.round(monthlySales * factor);
    const e = Math.round(monthlyExpenses * factor);
    return {
      label: currentLang === 'ta' ? MONTH_NAMES_12_TA[idx] : currentLang === 'hi' ? MONTH_NAMES_12_HI[idx] : MONTH_NAMES_12_EN[idx],
      sales: s,
      expenses: e,
      profit: s - e,
      isCurrent: idx === 11
    };
  });

  const chartData = viewMode === '6month' ? SIX_MONTH_DATA : TWELVE_MONTH_DATA;
  const maxSales = Math.max(...chartData.map(d => d.sales), 1);
  const maxProfit = Math.max(...chartData.map(d => d.profit), 1);

  // Yearly totals
  const yearlyTotalSales = TWELVE_MONTH_DATA.reduce((s, d) => s + d.sales, 0);
  const yearlyTotalProfit = TWELVE_MONTH_DATA.reduce((s, d) => s + d.profit, 0);

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-slate-900 space-y-5 shadow-sm border border-slate-200">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#062E38] text-emerald-400 flex items-center justify-center shadow-md">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-[#062E38] flex items-center gap-2 flex-wrap">
              {currentLang === 'hi'
                ? 'आपकी दुकान का लाभ विश्लेषण'
                : currentLang === 'ta'
                ? 'உங்கள் கடையின் லாப பகுப்பாய்வு'
                : 'My Shop Profit Analysis'}
              <span className="text-[14px] font-normal text-slate-500">
                {stallConfig.badge} {stallName}
              </span>
            </h3>
            <p className="text-[14px] text-slate-500 font-normal mt-0.5">
              {currentLang === 'hi'
                ? 'केवल आपकी दुकान का मासिक / वार्षिक लाभ देखें'
                : currentLang === 'ta'
                ? 'உங்கள் கடையின் மட்டும் மாதாந்திர / வருடாந்திர லாப வரைபடம்'
                : 'Your shop only • Monthly & yearly profit bar graph'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 gap-0.5">
          <button
            type="button"
            onClick={() => setViewMode('6month')}
            className={`px-3.5 py-2 min-h-[38px] rounded-lg text-[13px] font-semibold transition ${
              viewMode === '6month'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {currentLang === 'hi' ? '6 माह' : currentLang === 'ta' ? '6 மாதம்' : '6 Months'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('12month')}
            className={`px-3.5 py-2 min-h-[38px] rounded-lg text-[13px] font-semibold transition ${
              viewMode === '12month'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              {currentLang === 'hi' ? '1 वर्ष' : currentLang === 'ta' ? '1 வருடம்' : '1 Year'}
            </span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards: My Shop Summary ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Daily Sales */}
        <div className="p-3.5 rounded-2xl bg-[#062E38]/5 border border-[#062E38]/10">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {currentLang === 'hi' ? 'आज की बिक्री' : currentLang === 'ta' ? 'இன்றைய விற்பனை' : "Today's Sales"}
          </span>
          <div className="text-[22px] font-bold text-[#062E38] mt-1 font-mono">
            ₹{dailySales.toLocaleString()}
          </div>
        </div>

        {/* Daily Expenses */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
            {currentLang === 'hi' ? 'आज का खर्च' : currentLang === 'ta' ? 'இன்றைய செலவு' : "Today's Expenses"}
          </span>
          <div className="text-[22px] font-bold text-amber-900 mt-1 font-mono">
            ₹{dailyExpenses.toLocaleString()}
          </div>
        </div>

        {/* Monthly Profit */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
            {currentLang === 'hi' ? 'मासिक लाभ' : currentLang === 'ta' ? 'மாதாந்திர லாபம்' : 'Monthly Profit'}
          </span>
          <div className="text-[22px] font-bold text-emerald-800 mt-1 font-mono flex items-center gap-1">
            ₹{monthlyProfit.toLocaleString()}
          </div>
        </div>

        {/* Net Margin */}
        <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
          <span className="text-[11px] font-semibold text-teal-700 uppercase tracking-wider block">
            {currentLang === 'hi' ? 'नेट मार्जिन' : currentLang === 'ta' ? 'நிகர மார்ஜின்' : 'Net Margin'}
          </span>
          <div className="text-[22px] font-bold text-teal-900 mt-1 font-mono flex items-center gap-1">
            {marginPercent}%
            <ArrowUp className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* ── Bar Chart Area ──────────────────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] font-semibold text-slate-600">
          <span className="flex items-center gap-1.5">
            <StallIcon className="w-4 h-4 text-[#062E38]" />
            <span>
              {viewMode === '6month'
                ? (currentLang === 'hi' ? '6 महीने का विक्री व लाभ' : currentLang === 'ta' ? '6 மாத விற்பனை & லாபம்' : '6-Month Sales & Profit Trend')
                : (currentLang === 'hi' ? '12 महीने का विक्री व लाभ' : currentLang === 'ta' ? '12 மாத விற்பனை & லாபம்' : '12-Month Sales & Profit View')}
            </span>
          </span>
          <div className="flex items-center gap-3 text-[12px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gradient-to-t from-slate-500 to-slate-400 inline-block" />
              {currentLang === 'hi' ? 'बिक्री' : currentLang === 'ta' ? 'விற்பனை' : 'Sales'}
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-3 h-3 rounded bg-gradient-to-t ${stallConfig.profitBarColor} inline-block`} />
              {currentLang === 'hi' ? 'लाभ' : currentLang === 'ta' ? 'லாபம்' : 'Profit'}
            </span>
          </div>
        </div>

        {/* Bar Columns */}
        <div className={`grid gap-1.5 sm:gap-2 items-end pt-4 pb-2 min-h-[210px] ${
          viewMode === '6month' ? 'grid-cols-6' : 'grid-cols-12'
        }`}>
          {chartData.map((item, idx) => {
            const salesHeight = Math.max(14, Math.round((item.sales / maxSales) * 100));
            const profitHeight = item.profit > 0 ? Math.max(8, Math.round((item.profit / maxSales) * 100)) : 0;

            return (
              <div key={idx} className="flex flex-col items-center group">
                {/* Sales value above */}
                <div className={`text-[10px] sm:text-[12px] font-bold text-[#062E38] mb-1 text-center whitespace-nowrap ${
                  viewMode === '12month' ? 'hidden sm:block' : ''
                }`}>
                  ₹{item.sales >= 1000 ? `${(item.sales / 1000).toFixed(0)}k` : item.sales}
                </div>

                {/* Dual bars: Sales (grey bg) + Profit (colored fill) */}
                <div className="w-full relative flex gap-0.5 items-end"
                  style={{ height: '140px' }}>
                  {/* Sales bar */}
                  <div className="flex-1 h-full bg-slate-200/80 rounded-xl overflow-hidden flex items-end">
                    <div
                      style={{ height: `${salesHeight}%` }}
                      className={`w-full rounded-xl bg-gradient-to-t from-slate-400 to-slate-500 transition-all duration-700 ${
                        item.isCurrent ? 'ring-1 ring-slate-400' : ''
                      }`}
                    />
                  </div>
                  {/* Profit bar */}
                  <div className="flex-1 h-full bg-slate-100/80 rounded-xl overflow-hidden flex items-end">
                    <div
                      style={{ height: `${profitHeight}%` }}
                      className={`w-full rounded-xl bg-gradient-to-t ${stallConfig.profitBarColor} transition-all duration-700 ${
                        item.isCurrent ? 'ring-1 ring-emerald-400 shadow-md' : ''
                      }`}
                    />
                  </div>
                  {/* Live pulse on current month */}
                  {item.isCurrent && (
                    <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>

                {/* Month label */}
                <div className={`mt-1.5 text-center ${viewMode === '12month' ? 'px-0' : 'px-1'}`}>
                  <div className={`font-semibold truncate ${
                    item.isCurrent ? 'text-emerald-800 font-bold' : 'text-slate-500'
                  } ${viewMode === '12month' ? 'text-[9px] sm:text-[11px]' : 'text-[11px] sm:text-[13px]'}`}>
                    {item.label}
                  </div>
                  {/* Profit label below */}
                  <div className={`font-mono font-bold text-emerald-700 ${
                    viewMode === '12month' ? 'text-[9px] hidden sm:block' : 'text-[11px]'
                  }`}>
                    +₹{item.profit >= 1000 ? `${(item.profit / 1000).toFixed(0)}k` : item.profit}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart Footer */}
        <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[12px] text-slate-500 gap-1.5">
          <span className="flex items-center gap-1 text-emerald-800 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {currentLang === 'ta'
                ? 'உங்கள் கடை மட்டும் • நேரடி கணக்கீடு'
                : currentLang === 'hi'
                ? 'केवल आपकी दुकान • सीधा गणित'
                : 'Your shop only • Real-time arithmetic'}
            </span>
          </span>
          <span className="text-slate-400 font-mono">
            {currentLang === 'hi' ? 'लाभ = बिक्री − खर्च' : currentLang === 'ta' ? 'லாபம் = விற்பனை − செலவு' : 'Profit = Sales − Expenses'}
          </span>
        </div>
      </div>

      {/* ── Yearly Summary Strip (shown in 12-month mode) ───────────────── */}
      {viewMode === '12month' && (
        <div className="p-4 rounded-2xl bg-[#062E38]/5 border border-[#062E38]/10 flex flex-wrap items-center gap-4 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
          <div>
            <div className="text-[13px] font-semibold text-slate-600">
              {currentLang === 'hi'
                ? 'अनुमानित वार्षिक बिक्री (12 माह)'
                : currentLang === 'ta'
                ? 'மதிப்பிடப்பட்ட வருடாந்திர விற்பனை (12 மாதம்)'
                : 'Projected Annual Sales (12 Months)'}
            </div>
            <div className="text-[22px] font-bold text-[#062E38] font-mono">
              ₹{yearlyTotalSales.toLocaleString()}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-300 hidden sm:block" />
          <div>
            <div className="text-[13px] font-semibold text-slate-600">
              {currentLang === 'hi'
                ? 'अनुमानित वार्षिक लाभ'
                : currentLang === 'ta'
                ? 'மதிப்பிடப்பட்ட வருடாந்திர லாபம்'
                : 'Projected Annual Profit'}
            </div>
            <div className="text-[22px] font-bold text-emerald-700 font-mono">
              ₹{yearlyTotalProfit.toLocaleString()}
            </div>
          </div>
          <div className="h-10 w-px bg-slate-300 hidden sm:block" />
          <div>
            <div className="text-[13px] font-semibold text-slate-600">
              {currentLang === 'hi' ? 'Self-Pay रिकॉर्ड' : currentLang === 'ta' ? 'சுய சேவை பதிவு' : 'Self-Service Records'}
            </div>
            <div className="text-[22px] font-bold text-teal-800 font-mono">
              {txList.length} <span className="text-[14px] font-medium text-slate-500">
                {currentLang === 'hi' ? 'ग्राहक' : currentLang === 'ta' ? 'வாடிக்கையாளர்' : 'customers'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Self-Service Recent Records for this shop ───────────────────── */}
      {txList.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#062E38]">
            <IndianRupee className="w-4 h-4 text-emerald-700" />
            <span>
              {currentLang === 'hi'
                ? 'आज के Self-Service भुगतान रिकॉर्ड'
                : currentLang === 'ta'
                ? 'இன்றைய சுய சேவை கட்டண பதிவுகள்'
                : "Today's Self-Service Payment Records"}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[12px] font-bold">
                {txList.length}
              </span>
            </span>
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
            {txList.slice(0, 8).map((tx, idx) => (
              <div key={tx.id || idx} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 text-[13px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[12px]">
                    {(tx.customerName || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{tx.customerName || 'Customer'}</div>
                    <div className="text-[12px] text-slate-500">{tx.customerPhone} • {tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 text-[15px]">+₹{tx.amount}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{tx.provider}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[12px] text-slate-400 text-center font-mono">
            {currentLang === 'hi'
              ? `कुल Self-Service बिक्री: ₹${selfPayTotal.toLocaleString()}`
              : currentLang === 'ta'
              ? `மொத்த சுய சேவை விற்பனை: ₹${selfPayTotal.toLocaleString()}`
              : `Total self-service payments collected: ₹${selfPayTotal.toLocaleString()}`}
          </div>
        </div>
      )}

      {/* ── Formula Footer ──────────────────────────────────────────────── */}
      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-[13px] text-emerald-950 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>
              {currentLang === 'hi' ? 'निर्धारक गणित: ' : currentLang === 'ta' ? 'நேர்மையான கணிதம்: ' : 'Deterministic Arithmetic: '}
            </strong>
            {currentLang === 'hi'
              ? 'मासिक लाभ = मासिक बिक्री (रोज़ × 30) − मासिक खर्च (रोज़ × 30)'
              : currentLang === 'ta'
              ? 'மாதாந்திர லாபம் = மாதாந்திர விற்பனை (தினசரி × 30) − மாதாந்திர செலவு (தினசரி × 30)'
              : 'Monthly Profit = Monthly Sales (Daily × 30) − Monthly Expenses (Daily × 30)'}
          </span>
        </div>
        <span className="text-emerald-800 font-mono text-[12px] font-semibold">
          {currentLang === 'hi'
            ? '100% शुद्ध • केवल आपकी दुकान'
            : currentLang === 'ta'
            ? '100% நேர்மையானது • உங்கள் கடை மட்டும்'
            : '100% Deterministic • Your Shop Only'}
        </span>
      </div>

    </div>
  );
}
