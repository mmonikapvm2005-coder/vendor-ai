import React, { useState } from 'react';
import { 
  Store, 
  ShoppingBag, 
  Flame, 
  Coffee, 
  Flower, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  Languages,
  Radio,
  Mic,
  Scale,
  User,
  Phone,
  X
} from 'lucide-react';
import { CATEGORY_PROFILES } from '../data/categoryData';

export default function LoginPage({ onLoginSuccess, onReplaySplash }) {
  // Store custom phone numbers for each column if typed
  const [columnPhones, setColumnPhones] = useState({
    produce: '',
    street_food: '',
    chai_tea: '',
    kirana: '',
    flowers: ''
  });

  // Customer registration modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState('98123 45678');
  const [targetStallForCustomer, setTargetStallForCustomer] = useState('produce');

  const handlePhoneChange = (key, val) => {
    setColumnPhones(prev => ({ ...prev, [key]: val }));
  };

  const handleLogin = (categoryKey) => {
    const profile = CATEGORY_PROFILES[categoryKey] || CATEGORY_PROFILES.street_food;
    const customPhone = columnPhones[categoryKey];

    onLoginSuccess({
      role: 'retailer',
      name: customPhone ? `Vendor (${customPhone.slice(-4)})` : profile.defaultOwner,
      businessName: profile.defaultBusinessName,
      categoryKey: categoryKey,
      category: profile.label,
      phone: customPhone ? `+91 ${customPhone}` : '+91 98765 43210'
    });
  };

  // Open customer modal for a specific stall
  const handleOpenCustomerModal = (stallKey = 'produce') => {
    setTargetStallForCustomer(stallKey);
    setIsCustomerModalOpen(true);
  };

  const handleCustomerLoginSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      role: 'customer',
      name: customerName.trim() || 'Valued Shopper',
      phone: customerPhone.trim() ? `+91 ${customerPhone.trim()}` : '+91 98123 45678',
      defaultStall: targetStallForCustomer
    });
  };

  // Vendor column configurations
  const VENDOR_COLUMNS = [
    {
      key: 'produce',
      tag: 'Fruits & Veg',
      hindiTag: 'फल व ताज़ा सब्ज़ी',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      accentColor: 'hover:border-emerald-500/60',
      buttonBg: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      badge: '28 Mandi Items',
      dailySales: '₹6,800',
      dailyNet: '₹4,440',
      margin: '65%',
      heroItems: 'Tamatar, Aloo, Pyaz, Kela, Seb',
      profile: CATEGORY_PROFILES.produce
    },
    {
      key: 'street_food',
      tag: 'Street Food',
      hindiTag: 'चाट व समोसा स्टॉल',
      icon: Flame,
      iconBg: 'bg-amber-100 text-amber-900 border-amber-300',
      accentColor: 'hover:border-amber-500/60',
      buttonBg: 'bg-[#0A1D37] hover:bg-[#0E294B] text-white',
      badge: '15 Recipe Items',
      dailySales: '₹5,200',
      dailyNet: '₹1,955',
      margin: '38%',
      heroItems: 'Refined Oil, Maida, Besan, Aloo, LPG',
      profile: CATEGORY_PROFILES.street_food
    },
    {
      key: 'chai_tea',
      tag: 'Chai & Snacks',
      hindiTag: 'चाय व नाश्ता कॉर्नर',
      icon: Coffee,
      iconBg: 'bg-amber-100 text-amber-950 border-amber-300',
      accentColor: 'hover:border-amber-600/60',
      buttonBg: 'bg-amber-900 hover:bg-amber-950 text-white',
      badge: '14 Dairy & Spices',
      dailySales: '₹4,700',
      dailyNet: '₹3,218',
      margin: '68%',
      heroItems: 'Buffalo Milk, CTC Chai, Elaichi, Bun',
      profile: CATEGORY_PROFILES.chai_tea
    },
    {
      key: 'kirana',
      tag: 'Micro Kirana',
      hindiTag: 'किराना व जनरल स्टोर',
      icon: Store,
      iconBg: 'bg-blue-100 text-blue-900 border-blue-300',
      accentColor: 'hover:border-blue-500/60',
      buttonBg: 'bg-blue-900 hover:bg-blue-950 text-white',
      badge: '15 FMCG Staples',
      dailySales: '₹10,400',
      dailyNet: '₹5,470',
      margin: '53%',
      heroItems: 'Atta, Toor Dal, Mustard Oil, FMCG',
      profile: CATEGORY_PROFILES.kirana
    },
    {
      key: 'flowers',
      tag: 'Flower & Pooja',
      hindiTag: 'फूल व पूजा सामग्री',
      icon: Flower,
      iconBg: 'bg-rose-100 text-rose-900 border-rose-300',
      accentColor: 'hover:border-rose-500/60',
      buttonBg: 'bg-rose-900 hover:bg-rose-950 text-white',
      badge: '13 Pooja Items',
      dailySales: '₹4,700',
      dailyNet: '₹2,240',
      margin: '48%',
      heroItems: 'Genda, Gulab, Kapoor, Agarbatti',
      profile: CATEGORY_PROFILES.flowers
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col justify-between p-3 sm:p-5 selection:bg-[#0A1D37] selection:text-white">
      
      {/* Top Header Bar */}
      <header className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#EAE3D7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0A1D37] text-white flex items-center justify-center shadow-md">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0A1D37] tracking-tight">
                Vendor<span className="text-blue-600">AI</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAE3D7] text-[#0A1D37] text-[10px] font-black border border-[#DCD1C0]">
                Profit Munshi
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Direct 1-Click Stall Login • Click your trade column below to enter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Customer Self-Pay Button with Name & Phone Registration */}
          <button
            type="button"
            onClick={() => handleOpenCustomerModal('produce')}
            className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition active:scale-95 group"
            title="Customer login: Auto-calculate bills & pay with Paytm"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span>🛒 Customer Self-Pay (Paytm / Soundbox Proof)</span>
          </button>

          <div className="px-2.5 py-1 rounded-xl bg-white border border-[#EAE3D7] text-stone-600 text-[11px] font-semibold flex items-center gap-1.5 shadow-2xs">
            <Languages className="w-3.5 h-3.5 text-[#0A1D37]" />
            <span>Hindi • Tamil • Telugu • English</span>
          </div>

          {onReplaySplash && (
            <button
              type="button"
              onClick={onReplaySplash}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#F5F1EB] border border-[#EAE3D7] text-[#0A1D37] text-[11px] font-bold flex items-center gap-1 shadow-2xs transition active:scale-95"
              title="Replay intro animation"
            >
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Intro</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content: 5-Column Box-Type Login Grid */}
      <main className="max-w-7xl mx-auto w-full my-auto py-3">
        
        {/* Helper subtext */}
        <div className="text-center mb-3">
          <span className="text-xs font-extrabold text-[#0A1D37] uppercase tracking-wider bg-[#F5F1EB] px-3 py-1 rounded-full border border-[#EAE3D7]">
            Select Your Business Trade Column to Login
          </span>
        </div>

        {/* 5 Distinct Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-stretch">
          {VENDOR_COLUMNS.map((col) => {
            const Icon = col.icon;
            const profile = col.profile;

            return (
              <div 
                key={col.key}
                className={`paper-card-elevated rounded-3xl p-4 sm:p-4.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl border border-[#EAE3D7] ${col.accentColor} relative group bg-white`}
              >
                
                {/* Top Column Box Header */}
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                      {col.tag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#F5F1EB] text-stone-700 border border-[#EAE3D7]">
                      {col.badge}
                    </span>
                  </div>

                  {/* Icon & Business Title */}
                  <div className="flex items-start gap-2.5 mb-3">
                    <div className={`w-11 h-11 rounded-2xl ${col.iconBg} border flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-black text-[#0A1D37] leading-tight line-clamp-2">
                        {profile?.defaultBusinessName}
                      </h2>
                      <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                        {profile?.defaultOwner}
                      </p>
                    </div>
                  </div>

                  {/* Quick Profit & Galla Snapshot Pill */}
                  <div className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D7] mb-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-stone-500 font-bold uppercase">Daily Galla</span>
                      <span className="font-extrabold text-stone-900">{col.dailySales}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#F0EAE1] pt-1">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase">Take-Home</span>
                      <span className="font-black text-emerald-800">{col.dailyNet}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#F0EAE1] pt-1 text-[10px]">
                      <span className="text-stone-400 font-medium">Margin</span>
                      <span className="font-bold text-blue-700">{col.margin} Net</span>
                    </div>
                  </div>

                  {/* Hero Staples preview */}
                  <div className="mb-3">
                    <span className="text-[9px] font-bold text-stone-400 uppercase block mb-1">
                      Key Commodities
                    </span>
                    <p className="text-[11px] text-stone-600 line-clamp-1 font-medium bg-[#F5F1EB] px-2 py-1 rounded-lg border border-[#EAE3D7]">
                      {col.heroItems}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Area: Mobile Input & 1-Click Login Button */}
                <div className="space-y-2 pt-2 border-t border-[#F0EAE1]">
                  
                  {/* Phone input */}
                  <div className="relative rounded-xl shadow-2xs flex">
                    <div className="px-2 py-1.5 bg-[#F5F1EB] border border-r-0 border-[#DCD1C0] rounded-l-xl text-stone-700 text-[10px] font-bold flex items-center shrink-0">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Mobile No."
                      value={columnPhones[col.key]}
                      onChange={(e) => handlePhoneChange(col.key, e.target.value)}
                      className="w-full px-2 py-1.5 rounded-r-xl bg-white border border-[#DCD1C0] text-stone-900 placeholder-stone-400 text-xs focus:outline-none focus:border-[#0A1D37]"
                    />
                  </div>

                  {/* 1-Click Login Button */}
                  <button
                    type="button"
                    onClick={() => handleLogin(col.key)}
                    className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 ${col.buttonBg} shadow-md transition active:scale-[0.98] group-hover:shadow-lg`}
                  >
                    <Zap className="w-3.5 h-3.5 fill-current shrink-0 text-amber-300" />
                    <span>Enter Stall</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition" />
                  </button>

                  <div className="text-center pt-0.5 space-y-1">
                    <span className="text-[10px] text-stone-500 font-semibold block">
                      {col.hindiTag}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenCustomerModal(col.key)}
                      className="text-[10px] text-blue-700 hover:text-blue-900 font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Buying here? Self-Pay with Paytm →</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* Customer Registration Modal (Registers Name & Phone for Vendor Notes) */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm paper-card-elevated rounded-3xl p-5 sm:p-6 bg-white text-stone-900 space-y-3.5 shadow-2xl relative">
            
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-xl text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#0A1D37]">
                  Customer Self-Service Login
                </h3>
                <p className="text-[11px] text-stone-500">
                  Register your name & mobile for Paytm proof
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 bg-blue-50 p-2.5 rounded-2xl border border-blue-200">
              💡 <strong>Why register?</strong> When the vendor is busy, your payments will be written into their digital notes with your name & phone so you can take your items without waiting!
            </p>

            <form onSubmit={handleCustomerLoginSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Your Name (ग्राहक का नाम)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD1C0] text-xs font-semibold focus:outline-none focus:border-[#0A1D37]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  Mobile Number (मोबाइल नंबर)
                </label>
                <div className="relative rounded-xl flex shadow-2xs">
                  <div className="px-3 py-2 bg-[#F5F1EB] border border-r-0 border-[#DCD1C0] rounded-l-xl text-stone-700 text-xs font-bold flex items-center">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="98123 45678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-r-xl bg-[#FAF8F5] border border-[#DCD1C0] text-xs font-semibold focus:outline-none focus:border-[#0A1D37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>Continue to Self-Checkout & Price Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Bottom Features Strip */}
      <footer className="max-w-7xl mx-auto w-full pt-3 border-t border-[#EAE3D7] flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium">
          <span className="flex items-center gap-1.5 text-stone-700 font-bold">
            <Mic className="w-3.5 h-3.5 text-blue-700" />
            Vernacular Speech Logger
          </span>
          <span className="flex items-center gap-1.5 text-stone-700 font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-700" />
            UPI Soundbox Live Sync
          </span>
          <span className="flex items-center gap-1.5 text-stone-700 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
            Mandi Wholesale Arbitrage
          </span>
          <span className="flex items-center gap-1.5 text-stone-700 font-bold">
            <Scale className="w-3.5 h-3.5 text-purple-700" />
            Daily, Weekly & Monthly Micro-P&L
          </span>
        </div>

        <div className="text-[11px] text-stone-500 font-semibold">
          VendorAI • Built for Indian Street Vendors & Micro-Retailers
        </div>
      </footer>

    </div>
  );
}
