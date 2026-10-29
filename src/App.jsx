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
import SplashScreen from './components/SplashScreen';
import { CATEGORY_PROFILES } from './data/categoryData';
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
  Receipt
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

  // Safeguard active category profile
  const categoryKey = currentUser?.categoryKey || 'street_food';
  const activeProfile = CATEGORY_PROFILES[categoryKey] || CATEGORY_PROFILES.street_food;

  // Dynamic Financial State (Defaulted safely to active category profile)
  const [revenue, setRevenue] = useState(activeProfile.revenue || { cash: 3100, upi: 2100, total: 5200 });
  const [expenses, setExpenses] = useState(activeProfile.initialExpenses || []);

  // Synchronize financial data whenever category profile changes
  const switchCategory = (newKey) => {
    if (CATEGORY_PROFILES[newKey]) {
      const p = CATEGORY_PROFILES[newKey];
      setCurrentUser(prev => prev ? {
        ...prev,
        categoryKey: newKey,
        category: p.label,
        businessName: p.defaultBusinessName,
        name: p.defaultOwner
      } : null);
      setRevenue(p.revenue || { cash: 3000, upi: 2000, total: 5000 });
      setExpenses(p.initialExpenses || []);
    }
  };

  useEffect(() => {
    if (currentUser?.categoryKey && CATEGORY_PROFILES[currentUser.categoryKey]) {
      const p = CATEGORY_PROFILES[currentUser.categoryKey];
      setRevenue(p.revenue || { cash: 3000, upi: 2000, total: 5000 });
      setExpenses(p.initialExpenses || []);
    }
  }, [currentUser?.categoryKey]);

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

  // Add expenses from Voice
  const handleAddExpensesFromVoice = (newItems) => {
    const formatted = (newItems || []).map((item, idx) => ({
      id: Date.now() + idx,
      name: item.name || "Expense Item",
      category: item.category || "Stock",
      qty: item.qty || 1,
      unit: item.unit || "lot",
      amount: Number(item.amount) || 0,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    setExpenses(prev => [...formatted, ...(prev || [])]);
  };

  // Passive UPI Soundbox & Paytm Payment Listener (Auto-writes Notes in Vendor Ledger)
  const handlePaymentFromSoundbox = (paymentData) => {
    const amt = Number(paymentData?.amount) || 0;
    setRevenue(prev => {
      const safePrev = prev || { cash: 0, upi: 0, total: 0 };
      return {
        cash: safePrev.cash,
        upi: safePrev.upi + amt,
        total: safePrev.total + amt
      };
    });

    const activeStall = paymentData?.stallKey || categoryKey;
    const newTx = {
      id: paymentData?.txId || `TXN${Date.now().toString().slice(-6)}`,
      customerName: paymentData?.customer || paymentData?.customerName || "Customer",
      customerPhone: paymentData?.customerPhone || "+91 98123 45678",
      amount: amt,
      itemDesc: paymentData?.itemDesc || "Stall Products",
      provider: paymentData?.provider || "Paytm",
      time: paymentData?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: paymentData?.date || "Today",
      status: "Settled in Profit"
    };

    setPaymentTransactions(prev => ({
      ...prev,
      [activeStall]: [newTx, ...(prev[activeStall] || [])]
    }));

    setRecentLivePayment(newTx);
    setTimeout(() => setRecentLivePayment(null), 6000);
  };

  const handleDeleteExpense = (id) => {
    setExpenses(prev => (prev || []).filter(e => e.id !== id));
  };

  // Safe Financial Computations with zero division guards
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  const safeRevenue = revenue || { cash: 0, upi: 0, total: 0 };
  const currentStallTransactions = paymentTransactions[categoryKey] || [];
  const totalExpenseAmount = safeExpenses.reduce((sum, item) => sum + (Number(item?.amount) || 0), 0);
  const netTakeHome = (safeRevenue.total || 0) - totalExpenseAmount;
  const profitMargin = safeRevenue.total > 0 
    ? ((netTakeHome / safeRevenue.total) * 100).toFixed(1) 
    : "0.0";

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onReplaySplash={() => setShowSplash(true)} />;
  }

  // Customer / Shopper Self-Checkout & Price Perception View
  if (currentUser.role === 'customer' || currentUser.role === 'user') {
    return (
      <CustomerPortal 
        user={currentUser} 
        onBack={handleBackToFrontPage} 
        onPaymentBroadcast={handlePaymentFromSoundbox} 
      />
    );
  }

  // Retailer View (Warm Sand & Midnight Navy)
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 p-3 sm:p-6 selection:bg-[#0A1D37] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Top Header with Prominent BACK BUTTON & LIVE STALL SWITCHER */}
        <header className="paper-card p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Prominent Back Button with Icon */}
            <button
              onClick={handleBackToFrontPage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EAE3D7] border border-[#DCD1C0] text-stone-800 hover:text-[#0A1D37] text-xs font-bold transition shadow-sm active:scale-95 group"
              title="Return to Front / Login Page"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A1D37] group-hover:-translate-x-0.5 transition" />
              <span className="font-extrabold">Back</span>
            </button>

            <div className="w-10 h-10 rounded-2xl bg-[#0A1D37] flex items-center justify-center text-white shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#0A1D37] tracking-tight">
                  Vendor<span className="text-blue-600">AI</span>
                </span>
                
                {/* IN-DASHBOARD STALL TYPE SWITCHER DROPDOWN */}
                <select
                  value={categoryKey}
                  onChange={(e) => switchCategory(e.target.value)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F5F1EB] hover:bg-[#EAE3D7] text-[#0A1D37] border border-[#DCD1C0] cursor-pointer focus:outline-none"
                  title="Switch Stall Type"
                >
                  <option value="street_food">Street Food / Chaat & Samosa</option>
                  <option value="produce">Fruits & Fresh Vegetables Cart</option>
                  <option value="chai_tea">Chai & Snacks Corner</option>
                  <option value="kirana">Micro Kirana & Kiosk Grocery</option>
                  <option value="flowers">Flower & Pooja Essentials</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium mt-0.5">
                <span className="font-semibold text-stone-700">{activeProfile.defaultBusinessName}</span>
                <span>•</span>
                <button 
                  onClick={() => setIsSoundboxModalOpen(true)}
                  className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Soundbox Sync Active</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSoundboxModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EAE3D7] border border-[#DCD1C0] text-[#0A1D37] font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
              title="Test Ambient UPI Soundbox"
            >
              <Radio className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline">Soundbox</span>
            </button>
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0A1D37] hover:bg-[#0E294B] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
            >
              <Mic className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Speak</span>
            </button>
            <button
              onClick={handleBackToFrontPage}
              title="Exit to Front Page"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EAE3D7] border border-[#DCD1C0] text-stone-700 hover:text-stone-900 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Live Incoming Payment Banner (Triggered by Soundbox) */}
        {recentLivePayment && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-700" />
              <span className="text-emerald-900 font-bold">
                Soundbox Auto-Sync: +₹{recentLivePayment.amount} received from {recentLivePayment.customer} ({recentLivePayment.itemDesc})
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-black">
              Revenue Updated Live
            </span>
          </div>
        )}

        {/* Hero Card: Deep Midnight Navy Card */}
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 navy-hero">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-[10px] font-bold uppercase tracking-wider border border-white/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Today's Real Take-Home (मुनाफ़ा)</span>
            </span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-blue-500/30 text-blue-100 border border-blue-400/30">
              {profitMargin}% Net Margin
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center">
              <span>₹{netTakeHome.toLocaleString()}</span>
            </div>
            <p className="text-xs text-blue-200 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real cash left in drawer after {activeProfile.hiddenOverhead?.primaryFuelLabel || "operating overhead"}</span>
            </p>
          </div>

          {/* Quick Metrics Inside Hero */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-white/15">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-200 font-bold uppercase block">Gross Sales (गल्ला)</span>
                <button 
                  onClick={() => setIsSoundboxModalOpen(true)}
                  className="text-[9px] text-blue-300 underline font-semibold"
                >
                  + Test Pay
                </button>
              </div>
              <div className="text-base sm:text-lg font-black text-white">₹{safeRevenue.total.toLocaleString()}</div>
              <div className="text-[10px] text-blue-200/80 font-medium truncate">
                Cash ₹{safeRevenue.cash.toLocaleString()} • UPI ₹{safeRevenue.upi.toLocaleString()}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
              <span className="text-[10px] text-amber-300 font-bold uppercase block">Total Costs (ख़र्चा)</span>
              <div className="text-base sm:text-lg font-black text-amber-300">₹{totalExpenseAmount.toLocaleString()}</div>
              <div className="text-[10px] text-blue-200/80 font-medium truncate">
                {activeProfile.label} Stock & Overhead
              </div>
            </div>
          </div>

          {/* Quick Projected Profit Breakdown Strip */}
          <div className="mt-3 pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-blue-100 gap-2">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
              <span><strong>Today:</strong> ₹{netTakeHome.toLocaleString()}</span>
              <span>•</span>
              <span><strong>Weekly:</strong> ₹{(netTakeHome * 7).toLocaleString()}</span>
              <span>•</span>
              <span className="text-emerald-300 font-semibold"><strong>Monthly:</strong> ₹{(netTakeHome * 30).toLocaleString()} (+14.8% Gain)</span>
            </div>
            <button
              onClick={() => setRetailerTab('profits')}
              className="text-[10px] font-bold text-white underline hover:text-emerald-300 transition"
            >
              View Item-by-Item Profits →
            </button>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="p-1 bg-[#F5F1EB] rounded-2xl border border-[#EAE3D7] flex overflow-x-auto scrollbar-none gap-1">
          <button
            onClick={() => setRetailerTab('overview')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              retailerTab === 'overview'
                ? 'bg-[#0A1D37] text-white font-extrabold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview & Ledger</span>
          </button>

          <button
            onClick={() => setRetailerTab('profits')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              retailerTab === 'profits'
                ? 'bg-[#0A1D37] text-white font-extrabold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Daily, Weekly & Monthly Profits</span>
          </button>

          <button
            onClick={() => setRetailerTab('mandi')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              retailerTab === 'mandi'
                ? 'bg-[#0A1D37] text-white font-extrabold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Daily Market Prices ({activeProfile.mandiData?.length || 0})</span>
          </button>

          <button
            onClick={() => setRetailerTab('hidden')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              retailerTab === 'hidden'
                ? 'bg-[#0A1D37] text-white font-extrabold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hidden Overhead</span>
          </button>

          <button
            onClick={() => setRetailerTab('margin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              retailerTab === 'margin'
                ? 'bg-[#0A1D37] text-white font-extrabold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Margin Optimizer</span>
          </button>

          <button
            onClick={() => setRetailerTab('audio')}
            className={`py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              retailerTab === 'audio'
                ? 'bg-[#0A1D37] text-white font-extrabold shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>20s Voice Note</span>
          </button>
        </div>

        {/* Tab 1: Overview & Micro-Ledger */}
        {retailerTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl paper-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="w-11 h-11 rounded-2xl bg-[#0A1D37] hover:bg-[#0E294B] text-white flex items-center justify-center shadow-md shrink-0 hover:scale-105 active:scale-95 transition"
                  >
                    <Mic className="w-5 h-5 fill-current" />
                  </button>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-stone-900">
                      Speak Expenses ({activeProfile.label})
                    </h3>
                    <p className="text-[11px] text-stone-500 truncate max-w-[200px]">
                      "{activeProfile.voiceSamples?.[0]?.audioText || "Speak your daily stock purchases"}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-3xl paper-card flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsSoundboxModalOpen(true)}
                    className="w-11 h-11 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center shadow-md shrink-0 hover:scale-105 active:scale-95 transition"
                  >
                    <Radio className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-stone-900">
                      UPI Soundbox Live
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Passive QR revenue ingestion
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSoundboxModalOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] border border-emerald-200 transition"
                >
                  Test QR Pay
                </button>
              </div>
            </div>

            {/* Micro-Ledger Records */}
            <div className="paper-card p-4 sm:p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#EAE3D7]">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-2">
                    <span>{activeProfile.label} Micro-Ledger</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EAE3D7] text-[#0A1D37] text-[10px] font-bold">
                      {safeExpenses.length} Records
                    </span>
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Real line-item stock purchases & operating costs
                  </p>
                </div>

                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#EAE3D7] text-[#0A1D37] border border-[#DCD1C0] text-xs font-bold hover:bg-[#DCD1C0] transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="divide-y divide-[#F0EAE1]">
                {safeExpenses.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] px-2 rounded-xl transition text-xs">
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F5F1EB] border border-[#EAE3D7] text-stone-600">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-2">
                        <span>{item.qty} {item.unit}</span>
                        <span>•</span>
                        <span className="text-stone-400 text-[10px]">{item.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-extrabold text-[#0A1D37] text-xs sm:text-sm">
                        ₹{(Number(item.amount) || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(item.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paytm & UPI Customer Notes (Permanent ledger if vendor didn't hear soundbox) */}
            <div className="paper-card p-4 sm:p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#EAE3D7]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-2">
                      <span>Paytm & UPI Customer Notes</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">
                        {currentStallTransactions.length} Verified Notes
                      </span>
                    </h3>
                    <p className="text-[10px] text-stone-500">
                      Auto-registered customer name & phone • Auto-added to your ₹{netTakeHome.toLocaleString()} net profit
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-bold text-stone-400 uppercase block">Total Digital Galla</span>
                  <span className="text-xs font-black text-emerald-800">
                    ₹{safeRevenue.upi.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Transactions list */}
              <div className="divide-y divide-[#F0EAE1]">
                {currentStallTransactions.length === 0 ? (
                  <div className="py-4 text-center text-stone-400 text-xs">
                    No Paytm transactions logged yet today.
                  </div>
                ) : (
                  currentStallTransactions.map((tx) => (
                    <div key={tx.id} className="py-2.5 flex items-center justify-between hover:bg-[#FAF8F5] px-2 rounded-xl transition text-xs">
                      <div>
                        <div className="font-extrabold text-stone-900 flex items-center gap-1.5 flex-wrap">
                          <span>{tx.customerName}</span>
                          <span className="text-[10px] text-stone-500 font-mono">({tx.customerPhone})</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                            {tx.provider || "Paytm"}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          Purchased: <strong className="text-stone-800">{tx.itemDesc}</strong>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-2">
                          <span>{tx.time}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Auto-added to Net Profit
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 text-right shrink-0">
                        <div>
                          <div className="font-black text-emerald-800 text-sm">
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
                            className="text-[9px] font-bold text-blue-700 hover:underline flex items-center gap-0.5 mt-0.5 ml-auto"
                            title="Replay Soundbox Voice Chime"
                          >
                            <Volume2 className="w-2.5 h-2.5" />
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
            <div className="paper-card p-4 sm:p-5 rounded-3xl">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#EAE3D7]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 flex items-center gap-2">
                      <span>Today's Market Benchmark Rates</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        {activeProfile.mandiData?.length || 0} Total Items
                      </span>
                    </h3>
                    <p className="text-[10px] text-stone-500">
                      Live APMC auction modal prices & daily trends for {activeProfile.label}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setRetailerTab('mandi')}
                  className="px-3 py-1.5 rounded-xl bg-[#0A1D37] hover:bg-[#0E294B] text-white text-xs font-bold transition shadow-xs"
                >
                  View All {activeProfile.mandiData?.length || 0} Rates →
                </button>
              </div>

              {/* Grid of staple items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {(activeProfile.mandiData || []).slice(0, 6).map((item) => (
                  <div 
                    key={item.id || item.item}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D7] hover:border-[#0A1D37]/40 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-extrabold text-stone-900 text-xs line-clamp-1">
                          {item.item}
                        </span>
                        {item.trend === 'up' && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded border border-rose-200 shrink-0">
                            ▲ {item.trendChange || "Up"}
                          </span>
                        )}
                        {item.trend === 'down' && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200 shrink-0">
                            ▼ {item.trendChange || "Down"}
                          </span>
                        )}
                        {item.trend === 'stable' && (
                          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1 rounded shrink-0">
                            Steady
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 mb-2">
                        {item.category || "Commodity"} • Margin: <strong className="text-blue-700">{item.margin || "30%"}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE1]">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-stone-400">Mandi Modal</div>
                        <div className="text-xs font-black text-[#0A1D37]">
                          ₹{item.mandiAvgRate}<span className="text-[9px] font-normal text-stone-500">/{item.unit.split(' ')[0]}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] uppercase font-bold text-stone-400">Retail Sell</div>
                        <div className="text-xs font-bold text-stone-800">
                          ₹{item.retailRate}<span className="text-[9px] font-normal text-stone-500">/{item.unit.split(' ')[0]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab: Daily, Weekly & Monthly Profit Analytics */}
        {retailerTab === 'profits' && (
          <div className="animate-fadeIn">
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
              onAddExpense={(newExp) => setExpenses(prev => [newExp, ...prev])}
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
            <MarginOptimizer />
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

      {/* Voice Modal (Category Specific) */}
      <VoiceExpenseLogger 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddExpenses={handleAddExpensesFromVoice}
        categoryProfile={activeProfile}
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
