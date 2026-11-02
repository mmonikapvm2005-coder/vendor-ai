import React, { useState, useEffect } from 'react';
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
  Languages, 
  Radio, 
  Mic, 
  Scale, 
  User, 
  Phone, 
  X, 
  Lock, 
  KeyRound, 
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Send,
  MessageSquare,
  QrCode
} from 'lucide-react';
import { CATEGORY_PROFILES } from '../data/categoryData';
import { TRANSLATIONS } from '../data/translations';
import LanguageSelector from './LanguageSelector';
import ShopQRCodeStandee, { STALL_QR_DETAILS } from './ShopQRCodeStandee';
import VyaparMitraLogo from './VyaparMitraLogo';

export default function LoginPage({ onLoginSuccess, onReplaySplash, currentLang = 'en', onLanguageChange }) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Selected Stall for dedicated QR Standee modal
  const [qrModalStallKey, setQrModalStallKey] = useState(null);

  // Store 10-digit phone inputs for each stall
  const [columnPhones, setColumnPhones] = useState({
    produce: '',
    street_food: '',
    chai_tea: '',
    kirana: '',
    flowers: ''
  });

  // Store authentication error per stall
  const [authErrors, setAuthErrors] = useState({});

  // Active OTP verification session
  const [activeOtpSession, setActiveOtpSession] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Simulated live SMS Notification banner
  const [smsBanner, setSmsBanner] = useState(null);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Customer registration modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerPhone, setCustomerPhone] = useState('9812345678');
  const [customerPhoneError, setCustomerPhoneError] = useState('');
  const [targetStallForCustomer, setTargetStallForCustomer] = useState('produce');

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Clean and limit phone input to exactly 10 digits
  const handlePhoneChange = (key, val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setColumnPhones(prev => ({ ...prev, [key]: cleaned }));
    if (authErrors[key]) {
      setAuthErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  // 5 Registered Stalls with distinct owners and registered 10-digit mobile numbers
  const REGISTERED_STALLS = [
    {
      key: 'produce',
      ownerName: 'Radheshyam Maurya',
      ownerPhone: '9876543210',
      ownerPhoneFormatted: '98765 43210',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accentColor: 'hover:border-emerald-500/60',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: '28 Mandi Items',
      profile: CATEGORY_PROFILES.produce
    },
    {
      key: 'street_food',
      ownerName: 'Ramesh Gupta',
      ownerPhone: '9823456789',
      ownerPhoneFormatted: '98234 56789',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      icon: Flame,
      iconBg: 'bg-amber-50 text-amber-900 border-amber-200',
      accentColor: 'hover:border-amber-500/60',
      buttonBg: 'bg-[#062E38] hover:bg-[#0A3B46] text-white',
      badge: '15 Recipe Items',
      profile: CATEGORY_PROFILES.street_food
    },
    {
      key: 'chai_tea',
      ownerName: 'Sunil Sharma',
      ownerPhone: '9834567890',
      ownerPhoneFormatted: '98345 67890',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
      icon: Coffee,
      iconBg: 'bg-amber-50 text-amber-950 border-amber-200',
      accentColor: 'hover:border-amber-600/60',
      buttonBg: 'bg-[#062E38] hover:bg-[#0A3B46] text-white',
      badge: '14 Dairy & Spices',
      profile: CATEGORY_PROFILES.chai_tea
    },
    {
      key: 'kirana',
      ownerName: 'Anand Verma',
      ownerPhone: '9845678901',
      ownerPhoneFormatted: '98456 78901',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80',
      icon: Store,
      iconBg: 'bg-teal-50 text-teal-900 border-teal-200',
      accentColor: 'hover:border-teal-500/60',
      buttonBg: 'bg-teal-700 hover:bg-teal-800 text-white',
      badge: '15 FMCG Staples',
      profile: CATEGORY_PROFILES.kirana
    },
    {
      key: 'flowers',
      ownerName: 'Ganesh Malakar',
      ownerPhone: '9856789012',
      ownerPhoneFormatted: '98567 89012',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
      icon: Flower,
      iconBg: 'bg-rose-50 text-rose-900 border-rose-200',
      accentColor: 'hover:border-rose-500/60',
      buttonBg: 'bg-[#062E38] hover:bg-[#0A3B46] text-white',
      badge: '13 Pooja Items',
      profile: CATEGORY_PROFILES.flowers
    }
  ];

  // Request & Dispatch SMS OTP for Owner
  const handleRequestOtp = (col) => {
    const entered = (columnPhones[col.key] || '').replace(/\D/g, '');

    // 1. Validate exactly 10 digits
    if (entered.length === 0) {
      setAuthErrors(prev => ({
        ...prev,
        [col.key]: t.invalidPhoneLength.replace('{len}', '0')
      }));
      return;
    }

    if (entered.length < 10) {
      setAuthErrors(prev => ({
        ...prev,
        [col.key]: t.invalidPhoneLength.replace('{len}', entered.length)
      }));
      return;
    }

    // 2. Validate phone number belongs to this registered stall owner
    if (entered !== col.ownerPhone) {
      setAuthErrors(prev => ({
        ...prev,
        [col.key]: t.unregisteredPhone
          .replace('{owner}', col.ownerName)
          .replace('{phone}', col.ownerPhoneFormatted)
      }));
      return;
    }

    // 3. Generate secure 6-digit random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear previous errors
    setAuthErrors(prev => ({ ...prev, [col.key]: null }));
    setOtpError('');
    setOtpInput('');
    setResendCooldown(45);

    // Initialize OTP session
    setActiveOtpSession({
      colKey: col.key,
      col,
      phone: entered,
      otp: generatedOtp,
      attempts: 0
    });

    // Display SMS Alert Banner with sound & copy option
    setSmsBanner({
      phone: col.ownerPhoneFormatted,
      otp: generatedOtp,
      ownerName: col.ownerName
    });

    // Auto-dismiss SMS notification after 15 seconds
    setTimeout(() => {
      setSmsBanner(prev => (prev?.otp === generatedOtp ? null : prev));
    }, 15000);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!activeOtpSession || resendCooldown > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpSession(prev => ({
      ...prev,
      otp: newOtp,
      attempts: 0
    }));
    setOtpError('');
    setResendCooldown(45);
    setSmsBanner({
      phone: activeOtpSession.col.ownerPhoneFormatted,
      otp: newOtp,
      ownerName: activeOtpSession.col.ownerName
    });
  };

  // Verify OTP and Authenticate Owner
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!activeOtpSession) return;

    const cleanedInput = otpInput.replace(/\D/g, '').trim();

    if (cleanedInput !== activeOtpSession.otp) {
      const updatedAttempts = (activeOtpSession.attempts || 0) + 1;
      if (updatedAttempts >= 3) {
        setOtpError("Too many failed attempts! Session locked. Request a new OTP.");
        setTimeout(() => {
          setActiveOtpSession(null);
          setSmsBanner(null);
        }, 2000);
        return;
      }
      setActiveOtpSession(prev => ({ ...prev, attempts: updatedAttempts }));
      setOtpError(`${t.incorrectOtp} (Attempts remaining: ${3 - updatedAttempts})`);
      return;
    }

    // OTP Verified Successfully!
    const col = activeOtpSession.col;
    setActiveOtpSession(null);
    setSmsBanner(null);

    const localizedCat = t.categories?.[col.key] || {};
    onLoginSuccess({
      role: 'retailer',
      name: localizedCat.ownerName || col.ownerName,
      businessName: localizedCat.stallName || col.profile.defaultBusinessName,
      categoryKey: col.key,
      category: localizedCat.tag || col.tag,
      phone: `+91 ${col.ownerPhoneFormatted}`,
      isOwnerAuthenticated: true
    });
  };

  // Open customer modal for a specific stall
  const handleOpenCustomerModal = (stallKey = 'produce') => {
    setTargetStallForCustomer(stallKey);
    setCustomerPhoneError('');
    setIsCustomerModalOpen(true);
  };

  const handleCustomerLoginSubmit = (e) => {
    e.preventDefault();
    const cleaned = customerPhone.replace(/\D/g, '').slice(0, 10);
    if (cleaned.length < 10) {
      setCustomerPhoneError(t.invalidPhoneLength.replace('{len}', cleaned.length));
      return;
    }

    onLoginSuccess({
      role: 'customer',
      name: customerName.trim() || 'Valued Shopper',
      phone: `+91 ${cleaned}`,
      defaultStall: targetStallForCustomer
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB] text-slate-900 flex flex-col justify-between p-3 sm:p-6 selection:bg-[#062E38] selection:text-white relative">
      
      {/* Top Floating SMS OTP Notification Banner */}
      {smsBanner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-3 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-[#062E38] text-white shadow-2xl border border-teal-500/30 flex items-start justify-between gap-3 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-teal-200">
                    {t.otpNotificationTitle.replace('{phone}', smsBanner.phone)}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
                    Live SMS
                  </span>
                </div>
                <p className="text-[14px] text-teal-100 font-normal mt-0.5">
                  {t.otpNotificationBody.replace('{otp}', '')}
                </p>
                <div className="mt-2.5 flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#062E38] font-mono text-[20px] font-bold tracking-widest shadow-inner">
                    {smsBanner.otp}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpInput(smsBanner.otp);
                      setCopiedOtp(true);
                      setTimeout(() => setCopiedOtp(false), 2000);
                    }}
                    className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[14px] font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-xs"
                  >
                    {copiedOtp ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedOtp ? 'Filled!' : 'Auto-Fill OTP'}</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSmsBanner(null)}
              className="text-teal-300 hover:text-white p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar with 3-WAY LANGUAGE SWITCHER */}
      <header className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <VyaparMitraLogo size="md" variant="light" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[28px] font-extrabold text-[#062E38] tracking-tight leading-none">
                Vyapar<span className="text-emerald-600 font-extrabold">Mitra</span>
              </h1>
            </div>
            <p className="text-[14px] text-slate-500 font-normal mt-0.5">
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-[14px] flex-wrap">
          {/* Customer Self-Pay QR Hub Button: 48px touch target & 16px font */}
          <button
            type="button"
            onClick={() => setQrModalStallKey('produce')}
            className="min-h-[48px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[16px] font-semibold flex items-center gap-2 shadow-sm transition active:scale-95 group"
            title="Customer QR Self-Service: Scan individual shop QR standees to calculate bill & pay"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span>{t.customerSelfPay}</span>
          </button>

          {/* 3-Language Selector (English • हिन्दी • தமிழ்) */}
          <LanguageSelector 
            currentLang={currentLang} 
            onLanguageChange={onLanguageChange} 
          />

          {onReplaySplash && (
            <button
              type="button"
              onClick={onReplaySplash}
              className="min-h-[48px] px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#062E38] text-[14px] font-semibold flex items-center gap-1.5 shadow-2xs transition active:scale-95"
              title="Replay intro animation"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Intro</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content: 5-Column Stall Cards */}
      <main className="max-w-7xl mx-auto w-full my-auto py-5">

        {/* Strong Security & Role Segregation Notice */}
        <div className="mb-5 p-4 rounded-2xl bg-white paper-card border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-[16px] font-semibold text-[#062E38]">
                {t.multiOwnerSecurityTitle}
              </p>
              <p className="text-[14px] text-slate-500 font-normal">
                {t.multiOwnerSecurityDesc}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-2xs">
              {t.fiveOwners}
            </span>
          </div>
        </div>

        {/* 5 Distinct Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {REGISTERED_STALLS.map((col) => {
            const hasError = !!authErrors[col.key];
            const localizedCat = t.categories?.[col.key] || {};
            const displayStallName = localizedCat.stallName || col.profile.defaultBusinessName;
            const displayOwnerName = localizedCat.ownerName || col.ownerName;
            const displayTag = localizedCat.tag || col.tag;

            return (
              <div 
                key={col.key}
                className={`paper-card-elevated rounded-3xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border border-slate-200/90 ${col.accentColor} relative group bg-white`}
              >
                
                {/* Shop Image Banner (PIN completely removed!) */}
                <div>
                  <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 bg-slate-100 shadow-inner">
                    <img 
                      src={col.image} 
                      alt={displayStallName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Category Tag Pill */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-[#062E38]/85 text-white backdrop-blur-xs border border-white/20">
                        {displayTag}
                      </span>
                    </div>

                    {/* Owner Protected Status */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                      <span className="text-[12px] font-semibold flex items-center gap-1 drop-shadow-md text-emerald-300">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>{t.ownerOnly}</span>
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-lg bg-black/60 text-slate-200 font-mono backdrop-blur-xs flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-300" />
                        <span>SMS OTP</span>
                      </span>
                    </div>
                  </div>

                  {/* Shop Name & Distinct Owner */}
                  <div className="mb-3 space-y-2">
                    {/* Card Title: 16px, weight 600 */}
                    <h2 className="text-[16px] font-semibold text-[#062E38] leading-tight min-h-[44px] line-clamp-2">
                      {displayStallName}
                    </h2>
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-6 h-6 rounded-lg bg-[#062E38] text-emerald-400 flex items-center justify-center text-[12px] font-bold shrink-0">
                        {col.ownerName.charAt(0)}
                      </div>
                      <div className="text-[14px] text-slate-700 truncate font-normal">
                        {t.ownerLabel}: <span className="text-[#062E38] font-semibold">{displayOwnerName}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Secure Owner Login Section */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  
                  {/* Security Header: Strict 10-Digit Phone */}
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#062E38]" />
                      <span>{t.ownerLabel} Mobile Auth</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      10 Digits
                    </span>
                  </div>

                  {/* 10-Digit Mobile Number Input: min 48px height, 16px font */}
                  <div className="relative rounded-xl shadow-2xs flex">
                    <div className="px-3 min-h-[48px] bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 text-[16px] font-semibold flex items-center shrink-0">
                      <span>🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder={t.mobilePlaceholder}
                      value={columnPhones[col.key]}
                      onChange={(e) => handlePhoneChange(col.key, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRequestOtp(col);
                      }}
                      className="w-full px-3 py-2.5 min-h-[48px] rounded-r-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-[16px] font-medium focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Security Error Notice */}
                  {hasError && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[12px] font-semibold leading-tight flex items-start gap-1.5 animate-fadeIn">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{authErrors[col.key]}</span>
                    </div>
                  )}

                  {/* Send OTP Button: 48px min-height, 16px weight 600 */}
                  <button
                    type="button"
                    onClick={() => handleRequestOtp(col)}
                    className={`w-full min-h-[48px] py-3 px-3.5 rounded-xl text-[16px] font-semibold flex items-center justify-center gap-2 ${col.buttonBg} shadow-md transition active:scale-[0.98] group-hover:shadow-lg`}
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>{t.requestOtp}</span>
                    <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition" />
                  </button>

                  {/* Dedicated Customer Stall QR & Self-Pay Button */}
                  <div className="pt-2 border-t border-dashed border-slate-200">
                    <button
                      type="button"
                      onClick={() => setQrModalStallKey(col.key)}
                      className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-[14px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-2xs group"
                      title="View Stall QR Standee & Pay"
                    >
                      <QrCode className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition" />
                      <span>{t.scanStallQr} →</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </main>

      {/* Dynamic SMS OTP Verification Modal */}
      {activeOtpSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm paper-card-elevated rounded-3xl p-5 sm:p-6 bg-white text-slate-900 space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => {
                setActiveOtpSession(null);
                setSmsBanner(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close OTP modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <KeyRound className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#062E38]">
                  {t.enterOtp}
                </h3>
                <p className="text-[14px] text-slate-500 font-normal">
                  {t.otpSentTo} +91 {activeOtpSession.phone}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[14px] space-y-1">
              <div className="text-slate-700 font-medium flex items-center justify-between">
                <span>{t.ownerLabel}: <strong className="text-[#062E38]">{activeOtpSession.col.ownerName}</strong></span>
                <span className="text-[12px] text-emerald-700 font-semibold">{t.validFor}</span>
              </div>
              <div className="text-[14px] text-slate-500 truncate">
                {activeOtpSession.col.profile.defaultBusinessName}
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1.5">
                  {t.enterOtp}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  required
                  placeholder="• • • • • •"
                  value={otpInput}
                  onChange={(e) => {
                    setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                    if (otpError) setOtpError('');
                  }}
                  className="w-full px-4 py-3 min-h-[52px] rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-center font-mono text-[24px] font-bold tracking-widest focus:outline-none focus:border-emerald-600"
                />
              </div>

              {otpError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[14px] font-semibold animate-fadeIn">
                  {otpError}
                </div>
              )}

              <div className="flex items-center justify-between text-[14px] pt-1">
                {resendCooldown > 0 ? (
                  <span className="text-[14px] text-slate-400 font-normal">
                    {t.resendOtp} in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-[14px] text-emerald-700 hover:text-emerald-900 font-semibold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.resendOtp}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setActiveOtpSession(null);
                    setSmsBanner(null);
                  }}
                  className="text-[14px] text-slate-500 hover:text-slate-800 font-medium"
                >
                  {t.cancel}
                </button>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[16px] shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.verifyAndLogin}</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Dedicated Shop QR Standee & Customer Self-Pay Hub Modal */}
      {qrModalStallKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md paper-card-elevated rounded-3xl p-5 sm:p-6 bg-white text-slate-900 space-y-4 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setQrModalStallKey(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Close Standee Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hub Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <h3 className="text-[20px] font-semibold text-[#062E38]">
                  {t.customerQrTitle}
                </h3>
              </div>
              <p className="text-[14px] text-slate-500 font-normal mt-0.5">
                {t.customerQrSubtitle}
              </p>
            </div>

            {/* 5 Stall Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {REGISTERED_STALLS.map((col) => {
                const isSelected = qrModalStallKey === col.key;
                const Icon = col.icon;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => setQrModalStallKey(col.key)}
                    className={`px-3 py-2 rounded-xl text-[14px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-[#062E38] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{col.tag}</span>
                  </button>
                );
              })}
            </div>

            {/* Authentic Standee Component for Selected Stall */}
            <ShopQRCodeStandee 
              stallKey={qrModalStallKey}
              onEnterCustomerPortal={(key) => {
                setQrModalStallKey(null);
                handleOpenCustomerModal(key);
              }}
              onClose={() => setQrModalStallKey(null)}
            />

          </div>
        </div>
      )}

      {/* Customer Registration Modal with Full Language Support */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm paper-card-elevated rounded-3xl p-5 sm:p-6 bg-white text-slate-900 space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => setIsCustomerModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#062E38]">
                  {t.customerModalTitle}
                </h3>
                <p className="text-[14px] text-slate-500 font-normal">
                  {t.shoppingAt.replace('{stall}', CATEGORY_PROFILES[targetStallForCustomer]?.defaultBusinessName || 'Stall')}
                </p>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 font-normal">
              💡 {t.customerNotice}
            </p>

            <form onSubmit={handleCustomerLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1">
                  {t.yourName}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-3 min-h-[48px] rounded-xl bg-slate-50 border border-slate-300 text-[16px] font-normal focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-[14px] font-semibold text-slate-700 block mb-1">
                  {t.mobileNumber} (10 Digits)
                </label>
                <div className="relative rounded-xl flex shadow-2xs">
                  <div className="px-3.5 min-h-[48px] bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-700 text-[16px] font-semibold flex items-center">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile No."
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                      if (customerPhoneError) setCustomerPhoneError('');
                    }}
                    className="w-full px-3.5 min-h-[48px] rounded-r-xl bg-slate-50 border border-slate-300 text-[16px] font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
                {customerPhoneError && (
                  <p className="text-[12px] text-rose-700 font-semibold mt-1">
                    {customerPhoneError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[16px] shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t.continueCheckout}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Bottom Features Strip with Translations */}
      <footer className="max-w-7xl mx-auto w-full pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-[14px] text-slate-500 gap-3">
        <div className="flex flex-wrap items-center gap-4 text-[14px] font-medium">
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Mic className="w-4 h-4 text-emerald-700" />
            {t.voiceExpense}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Radio className="w-4 h-4 text-emerald-700" />
            {t.soundboxActive}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <TrendingUp className="w-4 h-4 text-teal-700" />
            {t.mandiArbitrage}
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <Scale className="w-4 h-4 text-emerald-700" />
            {t.profitAnalytics}
          </span>
        </div>

        <div className="text-[14px] text-slate-500 font-normal">
          VendorAI • Built for Indian Street Vendors & Micro-Retailers
        </div>
      </footer>

    </div>
  );
}
