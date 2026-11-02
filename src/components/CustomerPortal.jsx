import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Store, 
  Flame, 
  Coffee, 
  Flower, 
  Search, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  QrCode, 
  CheckCircle2, 
  Radio, 
  Zap, 
  CreditCard, 
  Receipt, 
  IndianRupee,
  Sparkles,
  Volume2,
  User,
  Phone,
  Clock,
  Check,
  Edit2
} from 'lucide-react';
import { CATEGORY_PROFILES } from '../data/categoryData';
import LanguageSelector from './LanguageSelector';
import { TRANSLATIONS } from '../data/translations';
import ShopQRCodeStandee from './ShopQRCodeStandee';

export default function CustomerPortal({ user, onBack, onPaymentBroadcast, currentLang = 'en', onLanguageChange }) {
  const [selectedStallKey, setSelectedStallKey] = useState(user?.defaultStall || 'produce');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Customer registered profile state (10-Digit Phone, Name & Validation)
  const [customerName, setCustomerName] = useState(user?.name || 'Priya Sharma');
  const [rawPhone, setRawPhone] = useState(() => {
    const p = (user?.phone || '').replace(/\D/g, '').slice(-10);
    return p.length === 10 ? p : '9812345678';
  });
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 9812345678');
  const [customAmount, setCustomAmount] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handlePhoneInput = (val) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setRawPhone(digitsOnly);
    setCustomerPhone(digitsOnly ? `+91 ${digitsOnly}` : '');
    if (checkoutError) setCheckoutError('');
  };

  // Customer purchase notes history (tracks how much they spent across stalls)
  const [purchaseHistory, setPurchaseHistory] = useState([
    {
      txId: "TXN784102",
      stallKey: "street_food",
      stallName: "Gupta Chaat & Samosa Stall",
      owner: "Ramesh Gupta",
      amount: 40,
      itemDesc: "2 Plate Samosa",
      items: [{ name: "Samosa Plates", qty: 2, unit: "plate", price: 20, subtotal: 40 }],
      provider: "Paytm",
      time: "10:15 AM",
      date: "Today",
      vendorStatus: "Verified & Entered in Ramesh's Profit"
    }
  ]);

  // Active stall profile
  const activeProfile = CATEGORY_PROFILES[selectedStallKey] || CATEGORY_PROFILES.produce;

  // Derive products list with retail selling prices from mandiData
  const stallProducts = useMemo(() => {
    const raw = activeProfile.mandiData || [];
    return raw.map(item => {
      const sellPrice = item.retailRate || Math.round((item.vendorRate || item.mandiAvgRate || 25) * 1.35);
      return {
        id: item.id || item.item,
        name: item.item,
        category: item.category || "General",
        price: sellPrice,
        unit: item.unit.split(' ')[0] || "kg",
        trend: item.trend,
        trendChange: item.trendChange,
        note: item.supplierNote
      };
    });
  }, [activeProfile]);

  // Subcategories for active stall
  const subCategories = useMemo(() => {
    const cats = new Set(['All']);
    stallProducts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [stallProducts]);

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    return stallProducts.filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stallProducts, selectedCategory, searchQuery]);

  // Cart operations
  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      const current = prev[productId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: updated };
    });
  };

  const clearCart = () => setCart({});

  // Compute Cart Item Details & Total
  const cartSummary = useMemo(() => {
    let totalAmount = 0;
    let totalItemsCount = 0;
    const items = [];

    Object.entries(cart).forEach(([id, qty]) => {
      const product = stallProducts.find(p => p.id === id);
      if (product && qty > 0) {
        const subtotal = product.price * qty;
        totalAmount += subtotal;
        totalItemsCount += qty;
        items.push({
          ...product,
          qty,
          subtotal
        });
      }
    });

    return {
      items,
      totalAmount,
      totalItemsCount
    };
  }, [cart, stallProducts]);

  // Total amount spent by customer across all stalls today
  const totalCustomerSpend = useMemo(() => {
    return purchaseHistory.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [purchaseHistory]);

  // Handle Paytm / UPI Payment Checkout with Mandatory Name, 10-Digit Mobile & Live Profit Logging
  const handleCheckoutPayment = (paymentMethod) => {
    // Determine payable amount
    const cartAmt = cartSummary.totalAmount;
    const directAmt = Number(customAmount) || 0;
    const payableAmount = cartAmt > 0 ? cartAmt : directAmt;

    // 1. Validate Customer Name
    const trimmedName = (customerName || '').trim();
    if (!trimmedName) {
      setCheckoutError(
        currentLang === 'ta'
          ? 'தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.'
          : currentLang === 'hi'
          ? 'कृपया अपना नाम दर्ज करें।'
          : 'Please enter customer name before paying.'
      );
      return;
    }

    // 2. Validate 10-Digit Mobile Number
    const cleanedDigits = (rawPhone || '').replace(/\D/g, '');
    if (cleanedDigits.length !== 10) {
      setCheckoutError(
        currentLang === 'ta'
          ? `மொபைல் எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும் (${cleanedDigits.length} இலக்கங்கள் உள்ளது).`
          : currentLang === 'hi'
          ? `मोबाइल नंबर ठीक 10 अंकों का होना चाहिए (${cleanedDigits.length} अंक डाले गए हैं)।`
          : `Mobile number must be exactly 10 digits (${cleanedDigits.length} digits entered).`
      );
      return;
    }

    // 3. Validate Payable Amount
    if (payableAmount <= 0) {
      setCheckoutError(
        currentLang === 'ta'
          ? 'பொருட்களை தேர்வு செய்யவும் அல்லது செலுத்த வேண்டிய தொகையை உள்ளிடவும்.'
          : currentLang === 'hi'
          ? 'कृपया सामान चुनें या भुगतान राशि दर्ज करें।'
          : 'Please select items from the stall or enter an amount to pay.'
      );
      return;
    }

    setCheckoutError('');

    const formattedPhone = `+91 ${cleanedDigits}`;
    const txId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    const itemDescString = cartAmt > 0
      ? cartSummary.items.map(i => `${i.qty} ${i.unit} ${i.name.split(' ')[0]}`).join(', ')
      : `${activeProfile.label || 'Stall'} Direct Self-Pay`;

    const receipt = {
      txId,
      stallKey: selectedStallKey,
      stallName: activeProfile.defaultBusinessName,
      owner: activeProfile.defaultOwner,
      amount: payableAmount,
      items: cartAmt > 0
        ? cartSummary.items
        : [{ name: "Counter Self-Pay", qty: 1, unit: "order", price: payableAmount, subtotal: payableAmount }],
      itemDesc: itemDescString,
      provider: paymentMethod, // 'Paytm' | 'PhonePe' | 'GPay' | 'Cash'
      time: currentTime,
      date: currentDate,
      customerName: trimmedName,
      customerPhone: formattedPhone,
      vendorStatus: `Auto-Logged in ${activeProfile.defaultOwner}'s Profit Notes`
    };

    setLastReceipt(receipt);
    setIsPaymentSuccessOpen(true);

    // Add to customer's personal spend ledger
    setPurchaseHistory(prev => [receipt, ...prev]);

    // Announce via soundbox audio so busy vendor hears customer's name & amount!
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const announcement = paymentMethod === 'Paytm'
        ? `Paytm par ${trimmedName} se ${payableAmount} rupaye prapt hue.`
        : paymentMethod === 'PhonePe'
        ? `PhonePe par ${trimmedName} se ${payableAmount} rupaye prapt hue.`
        : paymentMethod === 'GPay'
        ? `Google Pay par ${trimmedName} se ${payableAmount} rupaye prapt hue.`
        : `${trimmedName} ne counter par ${payableAmount} rupaye diye.`;

      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.2;
      window.speechSynthesis.speak(utterance);
    }

    // Deliver note into vendor's live state & profit ledger!
    if (onPaymentBroadcast) {
      onPaymentBroadcast({
        txId,
        amount: payableAmount,
        itemDesc: itemDescString,
        items: receipt.items,
        customer: trimmedName,
        customerName: trimmedName,
        customerPhone: formattedPhone,
        provider: paymentMethod,
        stallKey: selectedStallKey,
        time: currentTime,
        date: currentDate
      });
    }

    // Clear cart and custom input
    setCart({});
    setCustomAmount('');
  };

  const STALL_TABS = [
    { key: 'produce', label: currentLang === 'hi' ? 'सब्ज़ी व फल' : currentLang === 'ta' ? 'பழங்கள் & காய்கறி' : 'Fruits & Veg', icon: ShoppingBag, color: 'text-emerald-700' },
    { key: 'street_food', label: currentLang === 'hi' ? 'चाट व समोसा' : currentLang === 'ta' ? 'சாட் & சமோசா' : 'Street Food', icon: Flame, color: 'text-amber-700' },
    { key: 'chai_tea', label: currentLang === 'hi' ? 'चाय व नाश्ता' : currentLang === 'ta' ? 'டீ & சிற்றுண்டி' : 'Chai & Snacks', icon: Coffee, color: 'text-amber-900' },
    { key: 'kirana', label: currentLang === 'hi' ? 'किराना स्टोर' : currentLang === 'ta' ? 'மளிகைக் கடை' : 'Micro Kirana', icon: Store, color: 'text-blue-700' },
    { key: 'flowers', label: currentLang === 'hi' ? 'पूजा व फूल' : currentLang === 'ta' ? 'பூ & பூஜை' : 'Pooja Flowers', icon: Flower, color: 'text-rose-700' }
  ];

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-slate-900 p-3 sm:p-6 selection:bg-[#062E38] selection:text-white pb-32">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header with Back to Stall Login & Language Selector */}
        <header className="paper-card p-3.5 sm:p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3.5 py-2.5 min-h-[48px] rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-[16px] font-semibold transition shadow-xs active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 text-[#062E38] group-hover:-translate-x-0.5 transition" />
              <span>{t.back}</span>
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[28px] font-bold text-[#062E38] tracking-tight leading-none">
                  Vendor<span className="text-emerald-600">AI</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[12px] font-semibold border border-emerald-200">
                  {t.customerSelfPay}
                </span>
              </div>
              <p className="text-[14px] text-slate-500 font-normal mt-0.5">
                {currentLang === 'hi' 
                  ? 'स्वचालित बिल गणना • स्थायी Paytm रसीद' 
                  : currentLang === 'ta' 
                  ? 'தானியங்கி பில் கணக்கீடு • நிலையான Paytm சான்று'
                  : 'Auto-calculated bills • Permanent Paytm notes in vendor ledger'}
              </p>
            </div>
          </div>

          {/* Customer Language Selector & Profile */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

            {/* View Stall Specific QR Standee Button: 48px touch target & 16px font */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[16px] font-semibold flex items-center gap-2 shadow-sm transition active:scale-95"
              title="View Stall UPI QR Standee"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>{t.scanStallQr}</span>
            </button>

            <div className="p-2 px-3 rounded-2xl bg-white border border-slate-200 flex items-center gap-2.5 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-slate-900 flex items-center gap-1.5">
                  <span>{customerName}</span>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-slate-400 hover:text-emerald-700"
                    title="Edit Name & Phone"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[12px] text-slate-500 font-mono">
                  {customerPhone}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-sm paper-card-elevated rounded-3xl p-6 bg-white text-slate-900 space-y-3.5 shadow-2xl">
              <h3 className="text-[20px] font-semibold text-[#062E38]">
                Customer Registration Details
              </h3>
              <p className="text-[14px] text-slate-500 font-normal">
                Your name & phone will be registered on the vendor's payment note so they know who paid even during rush hours.
              </p>

              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 min-h-[48px] rounded-xl bg-slate-50 border border-slate-300 text-[16px] font-normal focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1">10-Digit Mobile Number</label>
                <div className="flex rounded-xl shadow-2xs">
                  <span className="px-3 min-h-[48px] bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 text-[15px] font-semibold flex items-center shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={rawPhone}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    placeholder="9812345678"
                    className="w-full px-3.5 py-2.5 min-h-[48px] rounded-r-xl bg-slate-50 border border-slate-300 text-[16px] font-normal focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="w-full min-h-[48px] py-3 rounded-xl bg-[#062E38] hover:bg-[#0A3B46] text-white font-semibold text-[16px] shadow-sm transition"
              >
                Save Details & Continue
              </button>
            </div>
          </div>
        )}

        {/* Customer Sub-Nav: Browse vs My Spends History */}
        <div className="p-1.5 bg-slate-100 rounded-2xl border border-slate-200 flex max-w-md mx-auto gap-1">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[14px] font-semibold min-h-[44px] transition flex items-center justify-center gap-2 ${
              activeTab === 'browse'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Select Stall & Products</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-[14px] font-semibold min-h-[44px] transition flex items-center justify-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#062E38] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>My Spends & Notes ({purchaseHistory.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: BROWSE PRODUCTS & SELF-CHECKOUT                   */}
        {/* ======================================================== */}
        {activeTab === 'browse' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 5-Stall Trade Switcher Bar */}
            <div className="paper-card p-2 rounded-2xl flex overflow-x-auto scrollbar-none gap-2">
              {STALL_TABS.map(tab => {
                const Icon = tab.icon;
                const isSelected = selectedStallKey === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setSelectedStallKey(tab.key);
                      setSelectedCategory('All');
                      setCart({});
                    }}
                    className={`flex-1 min-w-[130px] min-h-[44px] py-2.5 px-3.5 rounded-xl text-[14px] font-semibold transition flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#062E38] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : tab.color}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Stall Banner */}
            <div className="p-4 sm:p-5 rounded-3xl paper-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#062E38] text-emerald-400 flex items-center justify-center shadow-sm shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-semibold text-[#062E38]">
                      {activeProfile.defaultBusinessName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-semibold">
                      Verified Daily Rates
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-500 font-normal">
                    Owner: <strong className="text-slate-800">{activeProfile.defaultOwner}</strong> • Instant Paytm & UPI auto-billing active
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[12px] font-semibold text-slate-400 uppercase block">Vendor Status</span>
                <span className="text-[14px] font-semibold text-emerald-700 flex items-center gap-1.5 sm:justify-end">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                  Auto-Settling in Profit
                </span>
              </div>
            </div>

            {/* Product Catalog & Search Controls */}
            <div className="space-y-3.5">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${stallProducts.length} items (e.g. Tamatar, Chai, Aloo, Samosa)...`}
                    className="w-full pl-11 pr-4 py-2.5 min-h-[48px] rounded-xl bg-white border border-slate-300 text-[16px] font-normal text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Sub-Category Pills */}
                {subCategories.length > 2 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[14px] shrink-0">
                    {subCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 min-h-[40px] rounded-xl text-[14px] font-semibold whitespace-nowrap transition ${
                          selectedCategory === cat
                            ? 'bg-[#062E38] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Items Grid with Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map(product => {
                  const qtyInCart = cart[product.id] || 0;

                  return (
                    <div 
                      key={product.id}
                      className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                        qtyInCart > 0 
                          ? 'bg-emerald-50/50 border-emerald-500 shadow-xs' 
                          : 'paper-card hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h3 className="text-[16px] font-semibold text-slate-900 line-clamp-1">
                            {product.name}
                          </h3>
                          <span className="text-[12px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg shrink-0">
                            {product.category}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 my-2">
                          <span className="text-[20px] font-bold text-[#062E38]">
                            ₹{product.price}
                          </span>
                          <span className="text-[14px] text-slate-500 font-normal">
                            / {product.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[14px] font-medium text-slate-500">
                          {qtyInCart > 0 ? `Subtotal: ₹${product.price * qtyInCart}` : 'Add quantity'}
                        </span>

                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={qtyInCart === 0}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                              qtyInCart > 0 
                                ? 'bg-white text-slate-900 shadow-2xs hover:bg-slate-200 active:scale-95' 
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-7 text-center text-[16px] font-bold text-[#062E38]">
                            {qtyInCart}
                          </span>

                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-8 h-8 rounded-lg bg-[#062E38] hover:bg-[#0A3B46] text-white flex items-center justify-center shadow-2xs active:scale-95 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY SPENDS & PURCHASE NOTES LEDGER                 */}
        {/* ======================================================== */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Total Spent Summary Card */}
            <div className="paper-card p-5 sm:p-6 rounded-3xl flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/50 to-white">
              <div>
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Today's Total Spend across Stalls
                </span>
                <div className="text-[32px] font-bold text-[#062E38]">
                  ₹{totalCustomerSpend.toLocaleString()}
                </div>
                <p className="text-[14px] text-slate-600 mt-0.5">
                  Registered under: <strong>{customerName}</strong> ({customerPhone})
                </p>
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-[14px] font-semibold text-slate-700 shadow-2xs">
                {purchaseHistory.length} Verified Payment Notes Logged
              </div>
            </div>

            {/* List of Notes */}
            <div className="paper-card p-5 rounded-3xl space-y-3">
              <h3 className="text-[20px] font-semibold text-[#062E38] pb-3 border-b border-slate-200">
                Your Verified Purchase Notes & Receipts
              </h3>

              {purchaseHistory.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-[14px]">
                  No purchases yet. Add items and pay via Paytm/UPI to generate notes.
                </div>
              ) : (
                purchaseHistory.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-[#062E38]/40 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-bold">
                          {item.provider}
                        </span>
                        <span className="font-semibold text-[16px] text-slate-900">
                          {item.stallName}
                        </span>
                      </div>
                      <span className="text-[16px] font-bold text-emerald-800">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-[14px] text-slate-600 font-normal">
                      Items: {item.itemDesc}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[12px] text-slate-500">
                      <span>{item.date} • {item.time} • TxID: {item.txId}</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.vendorStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* STICKY BOTTOM AUTO-CALCULATOR BILL & PAYTM CHECKOUT      */}
      {/* ======================================================== */}
      {activeTab === 'browse' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-2xl animate-slideUp">
          <div className="max-w-4xl mx-auto space-y-3">
            
            {/* Top row: Bill summary & Quick custom amount */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-[16px] shrink-0">
                  {cartSummary.totalItemsCount || (customAmount ? '1' : '0')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                      {currentLang === 'ta' ? 'செலுத்த வேண்டிய தொகை' : currentLang === 'hi' ? 'कुल देय राशि' : 'Total Amount to Pay'}
                    </span>
                    {cartSummary.items.length > 0 && (
                      <button 
                        onClick={clearCart}
                        className="text-[12px] text-slate-400 hover:text-rose-600 underline font-normal"
                      >
                        {currentLang === 'ta' ? 'அழி' : currentLang === 'hi' ? 'हटाएं' : 'Clear Cart'}
                      </button>
                    )}
                  </div>
                  <div className="text-[28px] sm:text-[32px] font-bold text-[#062E38] flex items-center gap-2 leading-none">
                    <span>₹{((cartSummary.totalAmount > 0 ? cartSummary.totalAmount : Number(customAmount)) || 0).toLocaleString()}</span>
                    {cartSummary.items.length > 0 && (
                      <span className="text-[14px] font-normal text-slate-500">
                        ({cartSummary.items.length} {currentLang === 'ta' ? 'பொருட்கள்' : currentLang === 'hi' ? 'सामान' : 'items'})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct counter amount input if cart is empty */}
              {cartSummary.totalAmount === 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[12px] font-semibold text-slate-500">
                    {currentLang === 'ta' ? 'கைமுறை தொகை:' : currentLang === 'hi' ? 'काउंटर नकद राशि:' : 'Quick Counter Amount:'}
                  </span>
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[14px]">₹</span>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (checkoutError) setCheckoutError('');
                      }}
                      className="w-full pl-6 pr-2 py-1.5 min-h-[40px] rounded-xl bg-slate-50 border border-slate-300 text-[16px] font-bold text-[#062E38] focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  {/* Quick Preset Amount Chips */}
                  {[20, 50, 100].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setCustomAmount(val.toString());
                        if (checkoutError) setCheckoutError('');
                      }}
                      className="px-2.5 py-1 min-h-[36px] rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-[13px] font-semibold"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Middle row: Customer Details Form (Name + 10-Digit Mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[12px] font-semibold text-slate-700 block mb-1">
                  {currentLang === 'ta' ? 'வாடிக்கையாளர் பெயர் *' : currentLang === 'hi' ? 'ग्राहक का नाम *' : 'Customer Name *'}
                </label>
                <input
                  type="text"
                  placeholder={currentLang === 'ta' ? 'உங்கள் பெயர் (எ.கா. பிரியா சர்மா)' : currentLang === 'hi' ? 'आपका नाम (उदा. प्रिया शर्मा)' : 'e.g. Priya Sharma'}
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (checkoutError) setCheckoutError('');
                  }}
                  className="w-full px-3 py-2 min-h-[44px] rounded-xl bg-slate-50 border border-slate-300 text-[15px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[12px] font-semibold text-slate-700">
                    {currentLang === 'ta' ? '10 இலக்க மொபைல் எண் *' : currentLang === 'hi' ? '10 अंकों का मोबाइल नंबर *' : '10-Digit Mobile Number *'}
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {rawPhone.length}/10 digits
                  </span>
                </div>
                <div className="flex rounded-xl shadow-2xs">
                  <span className="px-2.5 min-h-[44px] bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 text-[14px] font-semibold flex items-center shrink-0">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9812345678"
                    value={rawPhone}
                    onChange={(e) => handlePhoneInput(e.target.value)}
                    className="w-full px-3 py-2 min-h-[44px] rounded-r-xl bg-slate-50 border border-slate-300 text-[15px] font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Error message banner if any validation fails */}
            {checkoutError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[13px] font-semibold flex items-center gap-2 animate-fadeIn">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Bottom row: Payment Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Pay with Paytm (Primary Action) */}
              <button
                type="button"
                onClick={() => handleCheckoutPayment('Paytm')}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-[#002E6E] hover:bg-[#002050] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md transition active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current text-sky-300 shrink-0" />
                <span>
                  {currentLang === 'ta' 
                    ? `Paytm வழியாக ₹${((cartSummary.totalAmount > 0 ? cartSummary.totalAmount : Number(customAmount)) || 0)} செலுத்த` 
                    : currentLang === 'hi' 
                    ? `Paytm से ₹${((cartSummary.totalAmount > 0 ? cartSummary.totalAmount : Number(customAmount)) || 0)} दें` 
                    : `Pay ₹${((cartSummary.totalAmount > 0 ? cartSummary.totalAmount : Number(customAmount)) || 0)} with Paytm`}
                </span>
              </button>

              {/* Pay with PhonePe */}
              <button
                type="button"
                onClick={() => handleCheckoutPayment('PhonePe')}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[15px] flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
              >
                <span>PhonePe</span>
              </button>

              {/* Scan Stall QR Standee */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[15px] flex items-center justify-center gap-1.5 transition active:scale-95 shadow-sm"
                title="Scan Stall QR with any UPI app"
              >
                <QrCode className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Stall QR</span>
              </button>

              {/* Cash Option */}
              <button
                type="button"
                onClick={() => handleCheckoutPayment('Cash')}
                className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-[15px] transition active:scale-95"
              >
                💵 Counter Cash
              </button>
            </div>

            {/* Live Profit Notice */}
            <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between pt-0.5">
              <span className="flex items-center gap-1 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {currentLang === 'ta'
                    ? `கட்டணம் நேரடியாக ${activeProfile.defaultOwner}-ன் லாபக் கணக்கில் பதிவாகும்`
                    : currentLang === 'hi'
                    ? `भुगतान सीधे ${activeProfile.defaultOwner} के दैनिक मुनाफ़ा खाते में दर्ज होगा`
                    : `Payment auto-settles directly into ${activeProfile.defaultOwner}'s Take-Home Profit`}
                </span>
              </span>
              <span className="text-slate-400 font-mono">
                Soundbox 4.0 Active
              </span>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIGITAL RECEIPT & SOUNDBOX CONFIRMATION MODAL            */}
      {/* ======================================================== */}
      {isPaymentSuccessOpen && lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm paper-card-elevated rounded-3xl p-6 text-slate-900 shadow-2xl text-center space-y-4 bg-white">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>

            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                {lastReceipt.provider} Payment Verified & Logged
              </span>
              <h2 className="text-[32px] font-bold text-[#062E38] mt-2">
                ₹{lastReceipt.amount.toLocaleString()}
              </h2>
              <p className="text-[14px] font-normal text-slate-600">
                Paid to <strong className="text-slate-900">{lastReceipt.stallName}</strong> ({lastReceipt.owner})
              </p>
            </div>

            {/* Permanent Vendor Note Proof Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-left text-[14px] space-y-1.5">
              <div className="flex items-center justify-between text-emerald-950 font-semibold text-[14px]">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-700" />
                  Written in Vendor's Profit Notes:
                </span>
                <span className="text-[12px] text-emerald-700 font-mono">{lastReceipt.time}</span>
              </div>
              <p className="text-[14px] text-emerald-950 font-medium">
                Customer: {lastReceipt.customerName} ({lastReceipt.customerPhone})
              </p>
              <p className="text-[14px] text-emerald-900">
                Items: {lastReceipt.itemDesc}
              </p>
              <p className="text-[12px] text-emerald-800 font-semibold pt-1 border-t border-emerald-200">
                ✓ Automatically calculated into vendor's daily profit & revenue! Even if the vendor was busy, this entry is safe.
              </p>
            </div>

            {/* Soundbox notification banner */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-[14px] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[14px]">
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>Soundbox Announcement:</span>
              </div>
              <p className="text-[14px] text-slate-600 italic">
                "{lastReceipt.provider} par {lastReceipt.amount} rupaye prapt hue."
              </p>
            </div>

            <button
              onClick={() => setIsPaymentSuccessOpen(false)}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#062E38] hover:bg-[#0A3B46] text-white font-semibold text-[16px] shadow-md transition active:scale-95"
            >
              Take Goods & Continue
            </button>

          </div>
        </div>
      )}

      {/* Customer Stall Specific QR Standee Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm relative">
            <ShopQRCodeStandee 
              stallKey={selectedStallKey}
              amount={cartSummary.totalAmount > 0 ? cartSummary.totalAmount : null}
              onClose={() => setIsQrModalOpen(false)}
            />
            {cartSummary.totalAmount > 0 && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsQrModalOpen(false);
                    handleCheckoutPayment('Paytm QR');
                  }}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-[16px] font-semibold shadow-lg transition active:scale-95 inline-flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>I Have Scanned & Paid ₹{cartSummary.totalAmount}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
