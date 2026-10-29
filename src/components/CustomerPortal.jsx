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

export default function CustomerPortal({ user, onBack, onPaymentBroadcast }) {
  const [selectedStallKey, setSelectedStallKey] = useState(user?.defaultStall || 'produce');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);

  // Customer registered profile state
  const [customerName, setCustomerName] = useState(user?.name || 'Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98123 45678');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  // Handle Paytm / UPI Payment Checkout
  const handleCheckoutPayment = (paymentMethod) => {
    if (cartSummary.totalAmount <= 0) return;

    const txId = `TXN${Math.floor(100000 + Math.random() * 900000)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDate = new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
    const itemDescString = cartSummary.items.map(i => `${i.qty} ${i.unit} ${i.name.split(' ')[0]}`).join(', ');

    const receipt = {
      txId,
      stallKey: selectedStallKey,
      stallName: activeProfile.defaultBusinessName,
      owner: activeProfile.defaultOwner,
      amount: cartSummary.totalAmount,
      items: cartSummary.items,
      itemDesc: itemDescString,
      provider: paymentMethod, // 'Paytm' | 'PhonePe' | 'GPay' | 'Cash'
      time: currentTime,
      date: currentDate,
      customerName,
      customerPhone,
      vendorStatus: `Auto-Logged in ${activeProfile.defaultOwner}'s Profit Notes`
    };

    setLastReceipt(receipt);
    setIsPaymentSuccessOpen(true);

    // Add to customer's personal spend ledger
    setPurchaseHistory(prev => [receipt, ...prev]);

    // Announce via soundbox audio so busy vendor hears it!
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const announcement = paymentMethod === 'Paytm'
        ? `Paytm par ${receipt.amount} rupaye prapt hue.`
        : paymentMethod === 'PhonePe'
        ? `PhonePe par ${receipt.amount} rupaye prapt hue.`
        : paymentMethod === 'GPay'
        ? `Google Pay par ${receipt.amount} rupaye prapt hue.`
        : `Grahak ne counter par ${receipt.amount} rupaye diye.`;

      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.25;
      window.speechSynthesis.speak(utterance);
    }

    // Deliver note into vendor's live state & profit ledger!
    if (onPaymentBroadcast) {
      onPaymentBroadcast({
        txId,
        amount: receipt.amount,
        itemDesc: itemDescString,
        items: receipt.items,
        customer: customerName,
        customerName: customerName,
        customerPhone: customerPhone,
        provider: paymentMethod,
        stallKey: selectedStallKey,
        time: currentTime,
        date: currentDate
      });
    }

    // Clear cart
    setCart({});
  };

  const STALL_TABS = [
    { key: 'produce', label: 'Fruits & Veg', hindi: 'सब्ज़ी व फल', icon: ShoppingBag, color: 'text-emerald-700' },
    { key: 'street_food', label: 'Street Food', hindi: 'चाट व समोसा', icon: Flame, color: 'text-amber-700' },
    { key: 'chai_tea', label: 'Chai & Snacks', hindi: 'चाय कॉर्नर', icon: Coffee, color: 'text-amber-900' },
    { key: 'kirana', label: 'Micro Kirana', hindi: 'किराना स्टोर', icon: Store, color: 'text-blue-700' },
    { key: 'flowers', label: 'Pooja Flowers', hindi: 'पूजा व फूल', icon: Flower, color: 'text-rose-700' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 p-3 sm:p-5 selection:bg-[#0A1D37] selection:text-white pb-28">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Header with Back to Stall Login */}
        <header className="paper-card p-3 sm:p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F1EB] hover:bg-[#EAE3D7] border border-[#DCD1C0] text-stone-800 text-xs font-bold transition shadow-2xs active:scale-95 group"
            >
              <ArrowLeft className="w-4 h-4 text-[#0A1D37] group-hover:-translate-x-0.5 transition" />
              <span>Back to Vendor Portal</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black text-[#0A1D37]">
                  Vendor<span className="text-blue-600">AI</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black border border-blue-200">
                  Customer Self-Service
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">
                Auto-calculated bills • Permanent Paytm notes in vendor ledger
              </p>
            </div>
          </div>

          {/* Customer Profile & Registered Identity Badge */}
          <div className="flex items-center gap-2">
            <div className="p-2 px-3 rounded-2xl bg-white border border-[#EAE3D7] flex items-center gap-2 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <span>{customerName}</span>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-stone-400 hover:text-blue-700"
                    title="Edit Name & Phone"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-[10px] text-stone-500 font-mono">
                  {customerPhone}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
            <div className="w-full max-w-sm paper-card-elevated rounded-3xl p-5 bg-white text-stone-900 space-y-3 shadow-xl">
              <h3 className="text-sm font-extrabold text-[#0A1D37]">
                Customer Registration Details
              </h3>
              <p className="text-xs text-stone-500">
                Your name & phone will be registered on the vendor's payment note so they know who paid even during rush hours.
              </p>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD1C0] text-xs font-semibold focus:outline-none focus:border-[#0A1D37]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#DCD1C0] text-xs font-semibold focus:outline-none focus:border-[#0A1D37]"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="w-full py-2.5 rounded-xl bg-[#0A1D37] text-white font-extrabold text-xs shadow-sm hover:bg-[#0E294B] transition"
              >
                Save Details & Continue
              </button>
            </div>
          </div>
        )}

        {/* Customer Sub-Nav: Browse vs My Spends History */}
        <div className="p-1 bg-[#F5F1EB] rounded-2xl border border-[#EAE3D7] flex max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'browse'
                ? 'bg-[#0A1D37] text-white shadow-sm font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Select Stall & Products</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#0A1D37] text-white shadow-sm font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>My Spends & Notes ({purchaseHistory.length})</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: BROWSE PRODUCTS & SELF-CHECKOUT                   */}
        {/* ======================================================== */}
        {activeTab === 'browse' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 5-Stall Trade Switcher Bar */}
            <div className="paper-card p-2 rounded-2xl flex overflow-x-auto scrollbar-none gap-1.5">
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
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#0A1D37] text-white shadow-sm font-black'
                        : 'bg-[#F5F1EB] text-stone-700 hover:bg-[#EAE3D7] border border-[#EAE3D7]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : tab.color}`} />
                    <span className="whitespace-nowrap">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Stall Banner */}
            <div className="p-4 rounded-3xl bg-white border border-[#EAE3D7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0A1D37] text-white flex items-center justify-center shadow-sm shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm sm:text-base font-black text-[#0A1D37]">
                      {activeProfile.defaultBusinessName}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Verified Daily Rates
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-medium">
                    Owner: <strong className="text-stone-800">{activeProfile.defaultOwner}</strong> • Instant Paytm & UPI auto-billing active
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Vendor Status</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 sm:justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Auto-Settling in Profit
                </span>
              </div>
            </div>

            {/* Product Catalog & Search Controls */}
            <div className="space-y-3">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${stallProducts.length} items (e.g. Tamatar, Chai, Aloo, Samosa)...`}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DCD1C0] text-xs font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#0A1D37]"
                  />
                </div>

                {/* Sub-Category Pills */}
                {subCategories.length > 2 && (
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs shrink-0">
                    {subCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                          selectedCategory === cat
                            ? 'bg-[#0A1D37] text-white shadow-2xs'
                            : 'bg-[#F5F1EB] text-stone-600 hover:bg-[#EAE3D7] border border-[#EAE3D7]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Items Grid with Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {filteredProducts.map(product => {
                  const qtyInCart = cart[product.id] || 0;

                  return (
                    <div 
                      key={product.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-150 flex flex-col justify-between ${
                        qtyInCart > 0 
                          ? 'bg-blue-50/60 border-[#0A1D37] shadow-xs' 
                          : 'bg-white border-[#EAE3D7] hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h3 className="font-extrabold text-stone-900 text-xs line-clamp-1">
                            {product.name}
                          </h3>
                          <span className="text-[10px] font-bold text-stone-500 bg-[#F5F1EB] px-1.5 py-0.5 rounded shrink-0">
                            {product.category}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-1 my-1.5">
                          <span className="text-base font-black text-[#0A1D37]">
                            ₹{product.price}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            / {product.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-stone-500">
                          {qtyInCart > 0 ? `Subtotal: ₹${product.price * qtyInCart}` : 'Add quantity'}
                        </span>

                        <div className="flex items-center gap-1.5 bg-[#F5F1EB] p-0.5 rounded-xl border border-[#DCD1C0]">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={qtyInCart === 0}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                              qtyInCart > 0 
                                ? 'bg-white text-stone-900 shadow-2xs hover:bg-stone-100 active:scale-95' 
                                : 'text-stone-300 cursor-not-allowed'
                            }`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-6 text-center text-xs font-black text-[#0A1D37]">
                            {qtyInCart}
                          </span>

                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#0A1D37] hover:bg-[#0E294B] text-white flex items-center justify-center shadow-2xs active:scale-95 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
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
          <div className="space-y-3 animate-fadeIn">
            
            {/* Total Spent Summary Card */}
            <div className="paper-card p-4 sm:p-5 rounded-3xl flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-[#FAF8F5]">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Today's Total Spend across Stalls
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0A1D37]">
                  ₹{totalCustomerSpend.toLocaleString()}
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Registered under: <strong>{customerName}</strong> ({customerPhone})
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D7] text-xs font-bold text-stone-700 shadow-2xs">
                {purchaseHistory.length} Verified Payment Notes Logged
              </div>
            </div>

            {/* List of Notes */}
            <div className="paper-card p-4 rounded-3xl space-y-2.5">
              <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 pb-2 border-b border-[#EAE3D7]">
                Your Verified Purchase Notes & Receipts
              </h3>

              {purchaseHistory.length === 0 ? (
                <div className="py-8 text-center text-stone-400 text-xs">
                  No purchases yet. Add items and pay via Paytm/UPI to generate notes.
                </div>
              ) : (
                purchaseHistory.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#EAE3D7] space-y-2 hover:border-[#0A1D37]/40 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black">
                          {item.provider}
                        </span>
                        <span className="font-extrabold text-xs text-stone-900">
                          {item.stallName}
                        </span>
                      </div>
                      <span className="text-sm font-black text-emerald-800">
                        ₹{item.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 font-medium">
                      Items: {item.itemDesc}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#F0EAE1] text-[10px] text-stone-500">
                      <span>{item.date} • {item.time} • TxID: {item.txId}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
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
      {activeTab === 'browse' && cartSummary.totalAmount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#DCD1C0] p-3 sm:p-4 shadow-2xl animate-slideUp">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Cart Summary */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-sm shrink-0">
                {cartSummary.totalItemsCount}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                    Total Auto-Calculated Bill
                  </span>
                  <button 
                    onClick={clearCart}
                    className="text-[10px] text-stone-400 hover:text-rose-600 underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#0A1D37] flex items-center gap-1">
                  <span>₹{cartSummary.totalAmount.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-stone-500">
                    ({cartSummary.items.length} items)
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Buttons: Explicit Paytm Button + PhonePe + Cash */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Pay with Paytm (Explicit Request) */}
              <button
                onClick={() => handleCheckoutPayment('Paytm')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#002E6E] hover:bg-[#002050] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-sky-300" />
                <span>Pay ₹{cartSummary.totalAmount} with Paytm</span>
              </button>

              {/* Pay with PhonePe */}
              <button
                onClick={() => handleCheckoutPayment('PhonePe')}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>PhonePe</span>
              </button>

              {/* Cash Option */}
              <button
                onClick={() => handleCheckoutPayment('Cash')}
                className="px-3 py-2.5 rounded-xl bg-[#F5F1EB] hover:bg-[#EAE3D7] border border-[#DCD1C0] text-stone-800 font-bold text-xs transition active:scale-95"
              >
                💵 Cash
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DIGITAL RECEIPT & SOUNDBOX CONFIRMATION MODAL            */}
      {/* ======================================================== */}
      {isPaymentSuccessOpen && lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm paper-card-elevated rounded-3xl p-5 sm:p-6 text-stone-900 shadow-2xl text-center space-y-4">
            
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {lastReceipt.provider} Payment Verified & Logged
              </span>
              <h2 className="text-2xl font-black text-[#0A1D37] mt-1.5">
                ₹{lastReceipt.amount.toLocaleString()}
              </h2>
              <p className="text-xs font-medium text-stone-600">
                Paid to <strong className="text-stone-900">{lastReceipt.stallName}</strong> ({lastReceipt.owner})
              </p>
            </div>

            {/* Permanent Vendor Note Proof Box */}
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-left text-xs space-y-1">
              <div className="flex items-center justify-between text-blue-900 font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-blue-700" />
                  Written in Vendor's Profit Notes:
                </span>
                <span className="text-[10px] text-blue-700">{lastReceipt.time}</span>
              </div>
              <p className="text-[11px] text-blue-950 font-semibold">
                Customer: {lastReceipt.customerName} ({lastReceipt.customerPhone})
              </p>
              <p className="text-[10px] text-blue-800">
                Items: {lastReceipt.itemDesc}
              </p>
              <p className="text-[10px] text-emerald-700 font-bold pt-1 border-t border-blue-200">
                ✓ Automatically calculated into vendor's daily profit & revenue! Even if the vendor was busy, this entry is safe.
              </p>
            </div>

            {/* Soundbox notification banner */}
            <div className="p-2.5 rounded-2xl bg-[#F5F1EB] border border-[#EAE3D7] text-left text-xs space-y-0.5">
              <div className="flex items-center gap-1.5 text-stone-700 font-bold text-[11px]">
                <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Soundbox Announcement:</span>
              </div>
              <p className="text-[11px] text-stone-600 italic">
                "{lastReceipt.provider} par {lastReceipt.amount} rupaye prapt hue."
              </p>
            </div>

            <button
              onClick={() => setIsPaymentSuccessOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0A1D37] hover:bg-[#0E294B] text-white font-extrabold text-xs shadow-md transition active:scale-95"
            >
              Take Goods & Continue
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
