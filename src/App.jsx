import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import VoiceExpenseLogger from './components/VoiceExpenseLogger';
import SoundboxSimulator from './components/SoundboxSimulator';
import MandiArbitrage from './components/MandiArbitrage';
import HiddenCostEstimator from './components/HiddenCostEstimator';
import EveningAudioDebrief from './components/EveningAudioDebrief';
import MarginOptimizer from './components/MarginOptimizer';
import ProfitAnalytics from './components/ProfitAnalytics';
import CustomerPortal from './components/CustomerPortal';
import ShopMonthlyBarChart from './components/ShopMonthlyBarChart';
import SplashScreen from './components/SplashScreen';
import LanguageSelector from './components/LanguageSelector';
import VyaparMitraLogo from './components/VyaparMitraLogo';
import { CATEGORY_PROFILES } from './data/categoryData';
import { TRANSLATIONS } from './data/translations';
import { 
  Store, 
  ArrowLeft,
  LogOut, 
  TrendingUp, 
  Mic, 
  Radio, 
  Trash2, 
  Layers, 
  Volume2, 
  TrendingDown, 
  LayoutDashboard,
  Plus,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Receipt,
  ShieldCheck,
  Lock,
  X,
  BarChart3
} from 'lucide-react';

const INITIAL_TRANSACTIONS = {
  produce: [
    {
      id: "TXN918231",
      customerName: "Pooja Sharma",
      customerPhone: "+91 98123 45678",
      amount: 108,
      itemDesc: "2 kg Tomatoes (Hybrid) + 1 kg Potatoes",
      provider: "Paytm",
      time: "11:30 AM",
      date: "Today",
      status: "Settled in Profit"
    },
    {
      id: "TXN918230",
      customerName: "Vikram Mehta",
      customerPhone: "+91 98765 22334",
      amount: 60,
      itemDesc: "1 Dozen Robusta Bananas",
      provider: "Paytm",
      time: "10:45 AM",
      date: "Today",
      status: "Settled in Profit"
    }
  ],
  street_food: [
    {
      id: "TXN812301",
      customerName: "Amit Verma",
      customerPhone: "+91 98456 12345",
      amount: 50,
      itemDesc: "2 Plates Samosa + Chutney",
      provider: "Paytm",
      time: "11:15 AM",
      date: "Today",
      status: "Settled in Profit"
    },
    {
      id: "TXN812300",
      customerName: "Neha Gupta",
      customerPhone: "+91 98990 44556",
      amount: 70,
      itemDesc: "2 Plates Papdi Chaat",
      provider: "Paytm",
      time: "10:30 AM",
      date: "Today",
      status: "Settled in Profit"
    }
  ],
  chai_tea: [
    {
      id: "TXN702911",
      customerName: "Sanjay Kumar",
      customerPhone: "+91 97112 33445",
      amount: 40,
      itemDesc: "2 Special Kulhad Chai + 1 Bun Maska",
      provider: "Paytm",
      time: "10:50 AM",
      date: "Today",
      status: "Settled in Profit"
    }
  ],
  kirana: [
    {
      id: "TXN654120",
      customerName: "Anita Rao",
      customerPhone: "+91 98101 22334",
      amount: 210,
      itemDesc: "1L Mustard Oil + 1kg Tata Salt + Maggi",
      provider: "Paytm",
      time: "11:05 AM",
      date: "Today",
      status: "Settled in Profit"
    }
  ],
  flowers: [
    {
      id: "TXN541209",
      customerName: "Rajesh Joshi",
      customerPhone: "+91 99887 66554",
      amount: 70,
      itemDesc: "1 Genda Garland + 1 Kapoor Box",
      provider: "Paytm",
      time: "09:40 AM",
      date: "Today",
      status: "Settled in Profit"
    }
  ]
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSoundboxModalOpen, setIsSoundboxModalOpen] = useState(false);
  const [retailerTab, setRetailerTab] = useState('overview');
  const [recentLivePayment, setRecentLivePayment] = useState(null);
  const [paymentTransactions, setPaymentTransactions] = useState(INITIAL_TRANSACTIONS);

  // Manual fallback action states
  const [isManualExpenseOpen, setIsManualExpenseOpen] = useState(false);
  const [manualExpenseName, setManualExpenseName] = useState('');
  const [manualExpenseAmount, setManualExpenseAmount] = useState('');
  const [manualExpenseCategory, setManualExpenseCategory] = useState('Stock');

  const [isManualSaleOpen, setIsManualSaleOpen] = useState(false);
  const [manualSaleAmount, setManualSaleAmount] = useState('');

  // App-wide 3-Language state (English • हिन्दी • தமிழ்)
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('vendor_ai_lang') || 'en';
  });

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('vendor_ai_lang', lang);
  };

  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Safeguard active category profile (Default to Produce cart)
  const categoryKey = currentUser?.categoryKey || 'produce';
  const activeProfile = CATEGORY_PROFILES[categoryKey] || CATEGORY_PROFILES.produce;

  // Persistent Shop-by-Shop Financial Records for All 5 Stalls
  // Guarantees customer self-service payments strictly update their respective shop!
  const [stallRevenues, setStallRevenues] = useState(() => ({
    produce: { ...(CATEGORY_PROFILES.produce?.revenue || { cash: 4200, upi: 2600, total: 6800 }) },
    street_food: { ...(CATEGORY_PROFILES.street_food?.revenue || { cash: 2600, upi: 2600, total: 5200 }) },
    chai_tea: { ...(CATEGORY_PROFILES.chai_tea?.revenue || { cash: 2200, upi: 2500, total: 4700 }) },
    kirana: { ...(CATEGORY_PROFILES.kirana?.revenue || { cash: 4800, upi: 5600, total: 10400 }) },
    flowers: { ...(CATEGORY_PROFILES.flowers?.revenue || { cash: 2800, upi: 1900, total: 4700 }) }
  }));

  const [stallExpenses, setStallExpenses] = useState(() => ({
    produce: [...(CATEGORY_PROFILES.produce?.initialExpenses || [])],
    street_food: [...(CATEGORY_PROFILES.street_food?.initialExpenses || [])],
    chai_tea: [...(CATEGORY_PROFILES.chai_tea?.initialExpenses || [])],
    kirana: [...(CATEGORY_PROFILES.kirana?.initialExpenses || [])],
    flowers: [...(CATEGORY_PROFILES.flowers?.initialExpenses || [])]
  }));

  // Dynamic Financial State for the currently active stall
  const revenue = stallRevenues[categoryKey] || { cash: 0, upi: 0, total: 0 };
  const expenses = stallExpenses[categoryKey] || [];

  // Save manual expense fallback (Deterministic & Validated to Active Shop)
  const handleSaveManualExpense = (e) => {
    e.preventDefault();
    const amt = Number(manualExpenseAmount);
    // Prevent invalid negative, zero, or empty amounts
    if (isNaN(amt) || amt <= 0 || !manualExpenseName.trim()) return;
    const newExp = {
      id: Date.now(),
      name: manualExpenseName.trim(),
      category: manualExpenseCategory,
      qty: 1,
      unit: 'lot',
      amount: amt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setStallExpenses(prev => ({
      ...prev,
      [categoryKey]: [newExp, ...(prev[categoryKey] || [])]
    }));
    setManualExpenseName('');
    setManualExpenseAmount('');
    setIsManualExpenseOpen(false);
  };

  // Save manual cash sale fallback (Deterministic & Validated to Active Shop)
  const handleSaveManualSale = (e) => {
    e.preventDefault();
    const amt = Number(manualSaleAmount);
    // Prevent invalid negative, zero, or empty amounts
    if (isNaN(amt) || amt <= 0) return;
    setStallRevenues(prev => {
      const safe = prev[categoryKey] || { cash: 0, upi: 0, total: 0 };
      return {
        ...prev,
        [categoryKey]: {
          cash: safe.cash + amt,
          upi: safe.upi,
          total: safe.total + amt
        }
      };
    });
    setManualSaleAmount('');
    setIsManualSaleOpen(false);
  };

  // Synchronize category profile changes across independent stalls
  const switchCategory = (newKey) => {
    if (CATEGORY_PROFILES[newKey]) {
      const p = CATEGORY_PROFILES[newKey];
      setCurrentUser(prev => prev ? {
        ...prev,
        categoryKey: newKey,
        category: p.label,
        businessName: p.defaultBusinessName,
        name: p.defaultOwner
      } : {
        role: 'retailer',
        categoryKey: newKey,
        category: p.label,
        businessName: p.defaultBusinessName,
        name: p.defaultOwner,
        phone: '+91 98765 43210',
        isOwnerAuthenticated: true
      });
    }
  };

  // Support both browser native Back button and in-app Back button
  useEffect(() => {
    const handlePopState = () => {
      setCurrentUser(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    window.history.pushState({ page: 'dashboard' }, '');
  };

  const handleBackToFrontPage = () => {
    setCurrentUser(null);
  };

  // Add expenses from Voice (Validated & Non-Negative to Specified Shop)
  const handleAddExpensesFromVoice = (newItems, targetShop = categoryKey) => {
    const target = targetShop || categoryKey;
    const formatted = (newItems || [])
      .filter(item => {
        const amt = Number(item?.amount);
        return !isNaN(amt) && amt > 0;
      })
      .map((item, idx) => ({
        id: Date.now() + idx,
        name: (item.name || "Expense Item").trim(),
        category: item.category || "Stock",
        qty: item.qty || 1,
        unit: item.unit || "lot",
        amount: Number(item.amount),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));

    if (formatted.length > 0) {
      setStallExpenses(prev => ({
        ...prev,
        [target]: [...formatted, ...(prev[target] || [])]
      }));
    }
  };

  // Add sales from Voice (Validated & Non-Negative to Specified Shop)
  const handleAddSalesFromVoice = (amount, targetShop = categoryKey) => {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return;
    const target = targetShop || categoryKey;
    setStallRevenues(prev => {
      const safe = prev[target] || { cash: 0, upi: 0, total: 0 };
      return {
        ...prev,
        [target]: {
          cash: safe.cash + amt,
          upi: safe.upi,
          total: safe.total + amt
        }
      };
    });
  };

  // Passive UPI Soundbox & Paytm Payment Listener
  // CRITICAL: Guarantees every customer self-service payment is strictly credited to its respective shop!
  const handlePaymentFromSoundbox = (paymentData) => {
    const amt = Number(paymentData?.amount);
    // Prevent invalid negative or empty amounts
    if (isNaN(amt) || amt <= 0) return;

    // Detect target shop from the self-service payment
    const targetStall = paymentData?.stallKey || categoryKey;

    // 1. Credit revenue strictly to target shop's financial ledger
    setStallRevenues(prev => {
      const safePrev = prev[targetStall] || { cash: 0, upi: 0, total: 0 };
      const isCash = paymentData?.provider === 'Cash';
      return {
        ...prev,
        [targetStall]: {
          cash: isCash ? safePrev.cash + amt : safePrev.cash,
          upi: isCash ? safePrev.upi : safePrev.upi + amt,
          total: safePrev.total + amt
        }
      };
    });

    // 2. Save transaction note strictly under the target shop's records
    const newTx = {
      id: paymentData?.txId || `TXN${Date.now().toString().slice(-6)}`,
      customerName: paymentData?.customerName || paymentData?.customer || "Customer",
      customerPhone: paymentData?.customerPhone || "+91 98123 45678",
      amount: amt,
      itemDesc: paymentData?.itemDesc || "Stall Products",
      provider: paymentData?.provider || "Paytm",
      time: paymentData?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: paymentData?.date || "Today",
      status: "Settled in Profit",
      stallKey: targetStall
    };

    setPaymentTransactions(prev => ({
      ...prev,
      [targetStall]: [newTx, ...(prev[targetStall] || [])]
    }));

    setRecentLivePayment(newTx);
    setTimeout(() => setRecentLivePayment(null), 6000);
  };

  const handleDeleteExpense = (id) => {
    setStallExpenses(prev => ({
      ...prev,
      [categoryKey]: (prev[categoryKey] || []).filter(e => e.id !== id)
    }));
  };

  // =========================================================================
  // CORE DETERMINISTIC PROFIT LOGIC:
  // Profit = Total Sales - Total Expenses
  // Pure arithmetic calculation (no LLM calculation).
  // =========================================================================
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeRevenue = revenue || { cash: 0, upi: 0, total: 0 };
  const currentStallTransactions = paymentTransactions[categoryKey] || [];

  // 1. Today's Sales: Validated non-negative total
  const todaySales = Math.max(0, Number(safeRevenue.total) || 0);

  // 2. Today's Expenses: Deterministic sum of all non-negative expense entries
  const todayExpenses = safeExpenses.reduce((sum, item) => {
    const amt = Number(item?.amount) || 0;
    return sum + (amt > 0 ? amt : 0);
  }, 0);

  // 3. Today's Profit: Exactly Total Sales - Total Expenses
  const todayProfit = todaySales - todayExpenses;

  // Compatibility bindings for existing views
  const totalExpenseAmount = todayExpenses;
  const netTakeHome = todayProfit;
  const profitMargin = todaySales > 0 
    ? ((todayProfit / todaySales) * 100).toFixed(1) 
    : "0.0";

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onReplaySplash={() => setShowSplash(true)}
        currentLang={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // Customer / Shopper Self-Checkout & Price Perception View
  if (currentUser.role === 'customer' || currentUser.role === 'user') {
    return (
      <CustomerPortal 
        user={currentUser} 
        onBack={handleBackToFrontPage} 
        onPaymentBroadcast={handlePaymentFromSoundbox} 
        currentLang={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    );
  }

  // Retailer View (Mobile-First Deep Teal + Emerald Theme)
  return (
    <div className="min-h-screen bg-[#F8FAFB] text-slate-900 p-3 sm:p-6 selection:bg-[#062E38] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Top Header with Prominent BACK BUTTON & LIVE STALL DETAILS */}
        <header className="paper-card p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Prominent Back Button with 48px touch target & 16px font */}
            <button
              onClick={handleBackToFrontPage}
              className="flex items-center gap-2 px-3.5 py-2.5 min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 hover:text-[#062E38] text-[16px] font-semibold transition shadow-xs active:scale-95 group"
              title="Return to Front / Login Page"
            >
              <ArrowLeft className="w-5 h-5 text-[#062E38] group-hover:-translate-x-0.5 transition" />
              <span>{t.back}</span>
            </button>

            <VyaparMitraLogo size="sm" variant="light" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[28px] font-extrabold text-[#062E38] tracking-tight leading-none">
                  Kamai<span className="text-emerald-600 font-extrabold">Mitra</span>
                </span>
                
                {/* LOCKED OWNER SESSION BADGE */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[14px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>{t.ownerLabel}: {currentUser?.name || activeProfile.defaultOwner}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-slate-500 font-normal mt-1 flex-wrap">
                <span className="font-semibold text-[#062E38]">{currentUser?.businessName || activeProfile.defaultBusinessName}</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">{currentUser?.phone || '+91 98765 43210'}</span>
                <span>•</span>
                <button 
                  onClick={() => setIsSoundboxModalOpen(true)}
                  className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 font-semibold"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t.soundboxActive}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 3-Language Selector for Shop Owner */}
            <LanguageSelector 
              currentLang={currentLanguage} 
              onLanguageChange={handleLanguageChange} 
            />

            <button
              onClick={() => setIsSoundboxModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2.5 min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#062E38] font-semibold text-[14px] sm:text-[16px] flex items-center gap-1.5 transition active:scale-95"
              title="Test Ambient UPI Soundbox"
            >
              <Radio className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">{t.soundboxBtn}</span>
            </button>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="p-2 sm:px-3.5 sm:py-2.5 min-h-[48px] rounded-xl bg-[#062E38] hover:bg-[#0A3B46] text-white font-semibold text-[14px] sm:text-[16px] flex items-center gap-2 shadow-sm transition active:scale-95"
            >
              <Mic className="w-4 h-4 text-emerald-400 fill-current" />
              <span className="hidden sm:inline">{t.speakBtn}</span>
            </button>
            <button
              onClick={handleBackToFrontPage}
              title="Lock Stall & Logout to Main Login"
              className="p-2 sm:px-3 sm:py-2.5 min-h-[48px] rounded-xl bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-[14px] sm:text-[16px] font-semibold transition flex items-center gap-1.5 active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span className="hidden sm:inline">{t.lockStall}</span>
            </button>
          </div>
        </header>

        {/* Live Incoming Payment Banner (Triggered by Soundbox) */}
        {recentLivePayment && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-[14px] animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2.5">
              <Radio className="w-5 h-5 text-emerald-700 shrink-0" />
              <span className="text-emerald-950 font-semibold">
                Soundbox Auto-Sync: +₹{recentLivePayment.amount} received from {recentLivePayment.customerName || recentLivePayment.customer} ({recentLivePayment.customerPhone}) • Logged into Today's Profit!
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 text-[12px] font-bold">
              Revenue Updated Live
            </span>
          </div>
        )}

        {/* HERO CARD: TODAY'S PROFIT (VISUALLY PROMINENT - DEEP TEAL HERO) */}
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-7 teal-hero">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-[12px] font-semibold uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.todaysProfit || "Today's Profit"}</span>
            </span>
            <span className="text-[14px] font-bold px-3 py-1 rounded-xl bg-emerald-500/25 text-emerald-100 border border-emerald-400/30">
              {profitMargin}% Net Margin
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
            {/* Profit value number: 32px, weight 700 */}
            <div>
              <div className="text-[32px] sm:text-[38px] font-bold text-white tracking-tight flex items-center leading-none">
                <span>₹{todayProfit.toLocaleString()}</span>
              </div>
              <div className="text-[12px] text-teal-200 mt-2 font-medium flex items-center gap-1.5">
                <span>Formula:</span>
                <span className="font-semibold text-white">₹{todaySales.toLocaleString()}</span>
                <span>(Sales)</span>
                <span>−</span>
                <span className="font-semibold text-amber-200">₹{todayExpenses.toLocaleString()}</span>
                <span>(Expenses)</span>
                <span>=</span>
                <span className="font-bold text-emerald-300">₹{todayProfit.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-[14px] text-teal-100/90 font-normal flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-300" />
              <span>Net take-home cash left in drawer today</span>
            </p>
          </div>

          {/* Quick Metrics Inside Hero: Today's Sales and Today's Expenses */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/15">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-teal-200 font-semibold uppercase block">
                  {t.todaysSales || "Today's Sales"}
                </span>
                <button 
                  onClick={() => setIsSoundboxModalOpen(true)}
                  className="text-[12px] text-emerald-300 underline font-semibold hover:text-white"
                >
                  + Test Pay
                </button>
              </div>
              <div className="text-[20px] sm:text-[22px] font-bold text-white mt-0.5">₹{todaySales.toLocaleString()}</div>
              <div className="text-[14px] text-teal-200/80 font-normal truncate mt-0.5">
                Cash ₹{safeRevenue.cash.toLocaleString()} • UPI ₹{safeRevenue.upi.toLocaleString()}
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-amber-300 font-semibold uppercase block">
                  {t.todaysExpenses || "Today's Expenses"}
                </span>
                <span className="text-[12px] text-amber-200 font-medium">
                  {safeExpenses.length} items
                </span>
              </div>
              <div className="text-[20px] sm:text-[22px] font-bold text-amber-300 mt-0.5">₹{todayExpenses.toLocaleString()}</div>
              <div className="text-[14px] text-teal-200/80 font-normal truncate mt-0.5">
                {activeProfile.label} Stock & Overhead
              </div>
            </div>
          </div>

          {/* Quick Projected Profit Breakdown Strip */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between text-[14px] text-teal-100 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span><strong>Today:</strong> ₹{netTakeHome.toLocaleString()}</span>
              <span>•</span>
              <span><strong>Weekly:</strong> ₹{(netTakeHome * 7).toLocaleString()}</span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold"><strong>Monthly:</strong> ₹{(netTakeHome * 30).toLocaleString()} (+14.8% Gain)</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setRetailerTab('charts')}
                className="text-[14px] font-semibold text-emerald-300 underline hover:text-white transition flex items-center gap-1.5"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{t.monthlySalesGraph || "Monthly Sales Bar Graph"} →</span>
              </button>
              <button
                onClick={() => setRetailerTab('profits')}
                className="text-[14px] font-semibold text-white underline hover:text-emerald-300 transition"
              >
                View Item-by-Item Profits →
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTERPIECE VOICE ASSISTANT HERO CARD (MAIN FOCUS OF THE DASHBOARD)       */}
        {/* ========================================================================= */}
        <div className="paper-card-elevated rounded-3xl p-5 sm:p-6 border border-emerald-200/70 bg-gradient-to-br from-white via-white to-emerald-50/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
            
            {/* Centerpiece Microphone Visual with Pulse Ring */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#062E38] to-[#0A3B46] text-emerald-400 flex items-center justify-center shadow-xl shrink-0 hover:scale-105 active:scale-95 transition-transform duration-200 animate-voice-pulse"
              title="Click to speak your expenses or daily stock"
            >
              <Mic className="w-8 h-8 sm:w-9 sm:h-9 fill-current" />
            </button>

            <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-[20px] font-semibold text-[#062E38]">
                  Smart Voice Assistant
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-semibold border border-emerald-200">
                  Hindi • Tamil • English
                </span>
              </div>
              <p className="text-[16px] text-slate-700 font-normal">
                Ask profit questions, tell sales and expenses, or log stock by speaking.
              </p>
              <p className="text-[14px] text-slate-500 italic">
                Try saying: "Sales ₹2,500 and expenses ₹900, what is my profit?" or "Aaj ka profit kitna hai?"
              </p>

              {/* Large Touch-Friendly Primary CTA Button */}
              <div className="pt-2">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="w-full min-h-[56px] py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[16px] font-semibold shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2.5 group"
                >
                  <Mic className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                  <span>Tap to Speak (Voice Assistant & Profit Calculator)</span>
                </button>
              </div>

              {/* Quick 1-Tap Voice Action Prompts for Active Stall */}
              <div className="pt-3 border-t border-slate-200/80 mt-3">
                <div className="text-[13px] text-slate-500 font-medium mb-2 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Tap Voice Questions for {activeProfile.defaultBusinessName || "your shop"}:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-800 text-[13px] font-semibold transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>🎙️ "Sales ₹2,500, expenses ₹900 → Profit?"</span>
                  </button>
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-800 text-[13px] font-semibold transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>📊 "What is today's profit?"</span>
                  </button>
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 text-slate-800 text-[13px] font-semibold transition active:scale-95 flex items-center gap-1.5"
                  >
                    <span>🛒 "Log stock expense"</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 flex overflow-x-auto scrollbar-none gap-1.5">
          <button
            onClick={() => setRetailerTab('overview')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'overview'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & Ledger</span>
          </button>

          <button
            onClick={() => setRetailerTab('charts')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'charts'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.monthlySalesGraph || "Monthly Sales Bar Graph"}</span>
          </button>

          <button
            onClick={() => setRetailerTab('profits')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'profits'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Daily, Weekly & Monthly Profits</span>
          </button>

          <button
            onClick={() => setRetailerTab('mandi')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'mandi'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Daily Market Prices ({activeProfile.mandiData?.length || 0})</span>
          </button>

          <button
            onClick={() => setRetailerTab('hidden')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'hidden'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Hidden Overhead</span>
          </button>

          <button
            onClick={() => setRetailerTab('margin')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'margin'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Margin Optimizer</span>
          </button>

          <button
            onClick={() => setRetailerTab('audio')}
            className={`py-2.5 px-3.5 rounded-xl text-[14px] font-semibold min-h-[44px] whitespace-nowrap transition flex items-center gap-2 ${
              retailerTab === 'audio'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>20s Voice Note</span>
          </button>
        </div>

        {/* Tab 1: Overview & Micro-Ledger */}
        {retailerTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">

            {/* Micro-Ledger Records */}
            <div className="paper-card p-4 sm:p-6 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-slate-200 gap-2">
                <div>
                  <h3 className="text-[20px] font-semibold text-[#062E38] flex items-center gap-2">
                    <span>{activeProfile.label} Micro-Ledger</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[#062E38] text-[12px] font-semibold">
                      {safeExpenses.length} Records
                    </span>
                  </h3>
                  <p className="text-[14px] text-slate-500 font-normal">
                    Real line-item stock purchases & operating costs
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsManualExpenseOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-[#062E38] border border-slate-200 text-[14px] font-semibold transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Manual Add</span>
                  </button>

                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-xl bg-[#062E38] text-white text-[14px] font-semibold hover:bg-[#0A3B46] transition shadow-xs"
                  >
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>Voice Add</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {safeExpenses.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition">
                    <div>
                      <div className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                        <span>{item.name}</span>
                        <span className="text-[12px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[14px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{item.qty} {item.unit}</span>
                        <span>•</span>
                        <span className="text-slate-400 text-[12px]">{item.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[16px] font-bold text-[#062E38]">
                        ₹{(Number(item.amount) || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete expense entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paytm & UPI Customer Notes */}
            <div className="paper-card p-4 sm:p-6 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold text-[#062E38] flex items-center gap-2">
                      <span>Paytm & UPI Customer Notes</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-bold border border-emerald-200">
                        {currentStallTransactions.length} Verified Notes
                      </span>
                    </h3>
                    <p className="text-[14px] text-slate-500 font-normal">
                      Auto-registered customer name & phone • Auto-added to your ₹{netTakeHome.toLocaleString()} net profit
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[12px] font-semibold text-slate-400 uppercase block">Total Digital Galla</span>
                  <span className="text-[16px] font-bold text-emerald-800">
                    ₹{safeRevenue.upi.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Transactions list */}
              <div className="divide-y divide-slate-100">
                {currentStallTransactions.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-[14px]">
                    No Paytm transactions logged yet today.
                  </div>
                ) : (
                  currentStallTransactions.map((tx) => (
                    <div key={tx.id} className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-xl transition">
                      <div>
                        <div className="text-[16px] font-semibold text-slate-900 flex items-center gap-2 flex-wrap">
                          <span>{tx.customerName}</span>
                          <span className="text-[14px] text-slate-500 font-mono">({tx.customerPhone})</span>
                          <span className="text-[12px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                            {tx.provider || "Paytm"}
                          </span>
                        </div>
                        <div className="text-[14px] text-slate-600 mt-0.5 font-normal">
                          Purchased: <strong className="text-slate-800 font-semibold">{tx.itemDesc}</strong>
                        </div>
                        <div className="text-[14px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{tx.time}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Auto-added to Net Profit
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right shrink-0">
                        <div>
                          <div className="text-[16px] font-bold text-emerald-800">
                            +₹{(Number(tx.amount) || 0).toLocaleString()}
                          </div>
                          <button
                            onClick={() => {
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                const u = new SpeechSynthesisUtterance(`${tx.provider || "Paytm"} par ${tx.amount} rupaye prapt hue`);
                                u.lang = 'hi-IN';
                                u.rate = 1.25;
                                window.speechSynthesis.speak(u);
                              }
                            }}
                            className="text-[14px] font-semibold text-teal-700 hover:underline flex items-center gap-1 mt-0.5 ml-auto min-h-[36px]"
                            title="Replay Soundbox Voice Chime"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Play Chime</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Today's Market Rates Preview Card */}
            <div className="paper-card p-4 sm:p-6 rounded-3xl">
              <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-semibold text-[#062E38] flex items-center gap-2">
                      <span>Today's Market Benchmark Rates</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[12px] font-semibold">
                        {activeProfile.mandiData?.length || 0} Total Items
                      </span>
                    </h3>
                    <p className="text-[14px] text-slate-500 font-normal">
                      Live APMC auction modal prices & daily trends for {activeProfile.label}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setRetailerTab('mandi')}
                  className="px-4 py-2.5 min-h-[48px] rounded-xl bg-[#062E38] hover:bg-[#0A3B46] text-white text-[16px] font-semibold transition shadow-xs"
                >
                  View All {activeProfile.mandiData?.length || 0} Rates →
                </button>
              </div>

              {/* Grid of staple items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {(activeProfile.mandiData || []).slice(0, 6).map((item) => (
                  <div 
                    key={item.id || item.item}
                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-[#062E38]/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[16px] font-semibold text-slate-900 line-clamp-1">
                          {item.item}
                        </span>
                        {item.trend === 'up' && (
                          <span className="text-[12px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                            ▲ {item.trendChange || "Up"}
                          </span>
                        )}
                        {item.trend === 'down' && (
                          <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                            ▼ {item.trendChange || "Down"}
                          </span>
                        )}
                        {item.trend === 'stable' && (
                          <span className="text-[12px] font-medium text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded shrink-0">
                            Steady
                          </span>
                        )}
                      </div>
                      <div className="text-[14px] text-slate-500 mb-2 font-normal">
                        {item.category || "Commodity"} • Margin: <strong className="text-teal-700">{item.margin || "30%"}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-200">
                      <div>
                        <div className="text-[12px] uppercase font-semibold text-slate-400">Mandi Modal</div>
                        <div className="text-[16px] font-bold text-[#062E38]">
                          ₹{item.mandiAvgRate}<span className="text-[12px] font-normal text-slate-500">/{item.unit.split(' ')[0]}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[12px] uppercase font-semibold text-slate-400">Retail Sell</div>
                        <div className="text-[16px] font-bold text-slate-800">
                          ₹{item.retailRate}<span className="text-[12px] font-normal text-slate-500">/{item.unit.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop-by-Shop Monthly Sales & Profit Bar Graph Comparison */}
            <div className="pt-2">
              <ShopMonthlyBarChart 
                stallRevenues={stallRevenues}
                stallExpenses={stallExpenses}
                paymentTransactions={paymentTransactions}
                currentLang={currentLanguage}
                activeStallKey={categoryKey}
                onSelectStall={switchCategory}
              />
            </div>

          </div>
        )}

        {/* Tab: Dedicated Monthly Sales Bar Graph Comparison */}
        {retailerTab === 'charts' && (
          <div className="animate-fadeIn">
            <ShopMonthlyBarChart 
              stallRevenues={stallRevenues}
              stallExpenses={stallExpenses}
              paymentTransactions={paymentTransactions}
              currentLang={currentLanguage}
              activeStallKey={categoryKey}
              onSelectStall={switchCategory}
            />
          </div>
        )}

        {/* Tab: Daily, Weekly & Monthly Profit Analytics */}
        {retailerTab === 'profits' && (
          <div className="animate-fadeIn space-y-4">
            <ShopMonthlyBarChart 
              stallRevenues={stallRevenues}
              stallExpenses={stallExpenses}
              paymentTransactions={paymentTransactions}
              currentLang={currentLanguage}
              activeStallKey={categoryKey}
              onSelectStall={switchCategory}
            />
            <ProfitAnalytics 
              categoryProfile={activeProfile}
              currentRevenue={safeRevenue}
              currentExpenses={safeExpenses}
            />
          </div>
        )}

        {/* Tab 2: Mandi Price Benchmark & Arbitrage */}
        {retailerTab === 'mandi' && (
          <div className="animate-fadeIn">
            <MandiArbitrage 
              vendorExpenses={safeExpenses} 
              categoryProfile={activeProfile}
              onAddExpense={(newExp) => setStallExpenses(prev => ({ ...prev, [categoryKey]: [newExp, ...(prev[categoryKey] || [])] }))}
            />
          </div>
        )}

        {/* Tab 3: Hidden Costs & Spoilage Estimator */}
        {retailerTab === 'hidden' && (
          <div className="animate-fadeIn">
            <HiddenCostEstimator 
              categoryProfile={activeProfile}
            />
          </div>
        )}

        {/* Tab 4: Margin Optimizer */}
        {retailerTab === 'margin' && (
          <div className="animate-fadeIn">
            <MarginOptimizer 
              categoryKey={categoryKey}
              categoryProfile={activeProfile}
              currentLang={currentLanguage}
            />
          </div>
        )}

        {/* Tab 5: 20s Evening Audio Debrief */}
        {retailerTab === 'audio' && (
          <div className="animate-fadeIn">
            <EveningAudioDebrief 
              netTakeHome={netTakeHome}
              totalRevenue={safeRevenue.total}
              totalExpenses={totalExpenseAmount}
              categoryProfile={activeProfile}
            />
          </div>
        )}

      </div>

      {/* Manual Expense Fallback Modal */}
      {isManualExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md paper-card-elevated rounded-3xl p-5 sm:p-6 bg-white text-slate-900 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsManualExpenseOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#062E38] flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5 text-[#062E38]" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#062E38]">
                  Add Expense Manually
                </h3>
                <p className="text-[14px] text-slate-500">
                  Fallback entry for {activeProfile.label}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveManualExpense} className="space-y-3.5">
              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1">
                  Item or Stock Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 kg Aloo / 15L Oil / Cooking Fuel"
                  value={manualExpenseName}
                  onChange={(e) => setManualExpenseName(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-[48px] rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-[16px] focus:outline-none focus:border-emerald-600 font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[14px] font-semibold text-slate-700 block mb-1">
                    Amount (₹)
                  </label>
                  <div className="relative flex rounded-xl">
                    <span className="px-3.5 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 text-[16px] font-semibold flex items-center">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 450"
                      value={manualExpenseAmount}
                      onChange={(e) => setManualExpenseAmount(e.target.value)}
                      className="w-full px-3 py-3 min-h-[48px] rounded-r-xl bg-slate-50 border border-slate-300 text-slate-900 text-[16px] font-semibold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={manualExpenseCategory}
                    onChange={(e) => setManualExpenseCategory(e.target.value)}
                    className="w-full px-3 py-3 min-h-[48px] rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-[16px] font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="Stock">Stock / Raw Material</option>
                    <option value="Fuel">Fuel / LPG / Firewood</option>
                    <option value="Transport">Transport / Tempo</option>
                    <option value="Packaging">Packaging / Thaili</option>
                    <option value="Daily Rent">Stall Rent / Fee</option>
                    <option value="Other">Other Expense</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsManualExpenseOpen(false)}
                  className="px-4 py-2.5 min-h-[48px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-[16px] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[16px] font-semibold shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save to Ledger</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Cash Sale Fallback Modal */}
      {isManualSaleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm paper-card-elevated rounded-3xl p-5 sm:p-6 bg-white text-slate-900 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsManualSaleOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#062E38]">
                  Record Cash Sale
                </h3>
                <p className="text-[14px] text-slate-500">
                  Adds directly to your cash galla (गल्ला)
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveManualSale} className="space-y-4">
              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1">
                  Cash Amount Received (₹)
                </label>
                <div className="relative flex rounded-xl">
                  <span className="px-3.5 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 text-[16px] font-semibold flex items-center">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 150"
                    autoFocus
                    value={manualSaleAmount}
                    onChange={(e) => setManualSaleAmount(e.target.value)}
                    className="w-full px-3 py-3 min-h-[48px] rounded-r-xl bg-slate-50 border border-slate-300 text-slate-900 text-[20px] font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[14px] text-emerald-900">
                💡 Cash sale is immediately added to your ₹{netTakeHome.toLocaleString()} net take-home profit.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsManualSaleOpen(false)}
                  className="px-4 py-2.5 min-h-[48px] rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-[16px] font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[16px] font-semibold shadow-md transition active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Record Sale</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voice Modal (Strictly Isolated to Current Logged-in Shop) */}
      <VoiceExpenseLogger 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddExpenses={handleAddExpensesFromVoice}
        onAddSales={handleAddSalesFromVoice}
        categoryProfile={activeProfile}
        activeStallKey={categoryKey}
        stallRevenues={stallRevenues}
        stallExpenses={stallExpenses}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {/* Ambient Soundbox Simulator Modal */}
      <SoundboxSimulator 
        isOpen={isSoundboxModalOpen}
        onClose={() => setIsSoundboxModalOpen(false)}
        onPaymentReceived={handlePaymentFromSoundbox}
      />
    </div>
  );
}
