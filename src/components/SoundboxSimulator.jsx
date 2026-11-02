import React, { useState } from 'react';
import { 
  Radio, 
  Volume2, 
  Smartphone, 
  CheckCircle2, 
  QrCode, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  X
} from 'lucide-react';

export default function SoundboxSimulator({ isOpen, onClose, onPaymentReceived }) {
  const [selectedProvider, setSelectedProvider] = useState('phonepe'); // 'phonepe' | 'paytm' | 'gpay'
  const [lastPayment, setLastPayment] = useState(null);
  const [isAnnouncing, setIsAnnouncing] = useState(false);

  if (!isOpen) return null;

  // Preset realistic street vendor customer transactions
  const PRESET_TRANSACTIONS = [
    { id: 1, amount: 25, itemDesc: "Chai + Samosa Combo", customer: "Rahul K.", time: "Just now" },
    { id: 2, amount: 40, itemDesc: "2 Plates Chaat", customer: "Pooja S.", time: "Just now" },
    { id: 3, amount: 80, itemDesc: "4 Plates Samosa (Parcel)", customer: "Amit V.", time: "Just now" },
    { id: 4, amount: 15, itemDesc: "1 Cutting Chai", customer: "Vikas M.", time: "Just now" },
    { id: 5, amount: 120, itemDesc: "Full Order (Family Snack)", customer: "Sunita G.", time: "Just now" }
  ];

  const handleSimulatePayment = (tx) => {
    setLastPayment(tx);
    setIsAnnouncing(true);

    // Speak announcement in Hindi/vernacular soundbox style
    const announcementText = selectedProvider === 'phonepe'
      ? `PhonePe par ${tx.amount} rupaye prapt hue.`
      : selectedProvider === 'paytm'
      ? `Paytm par ${tx.amount} rupaye prapt hue.`
      : `Google Pay par ${tx.amount} rupaye prapt hue.`;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(announcementText);
      utterance.lang = 'hi-IN';
      utterance.rate = 1.25; // Brisk & authentic soundbox chime rate
      utterance.onend = () => {
        setIsAnnouncing(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsAnnouncing(false), 1500);
    }

    // Deliver payment event to App state
    onPaymentReceived({
      amount: tx.amount,
      itemDesc: tx.itemDesc,
      customer: tx.customer,
      provider: selectedProvider,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg paper-card-elevated rounded-3xl p-5 sm:p-6 text-slate-900 overflow-hidden shadow-2xl bg-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#062E38] flex items-center justify-center text-emerald-400 shadow-md">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-[#062E38] flex items-center gap-2">
                <span>UPI Soundbox Simulator</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-semibold border border-emerald-200">
                  Zero Touch
                </span>
              </h2>
              <p className="text-[14px] text-slate-500 font-normal">
                Passive sales ingestion: QR payments sync directly into revenue
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realistic Soundbox Mockup Device */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Device Box Graphic */}
            <div className="w-16 h-16 rounded-2xl bg-[#062E38] border-2 border-teal-800 shadow-lg flex flex-col items-center justify-between p-2 text-white shrink-0">
              <div className="w-full flex justify-between items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-300">
                  {selectedProvider.toUpperCase()}
                </span>
              </div>
              {/* Speaker Grille Dots */}
              <div className="grid grid-cols-4 gap-1 opacity-70">
                {[...Array(12)].map((_, i) => (
                  <span key={i} className="w-1 h-1 rounded-full bg-white/40" />
                ))}
              </div>
              <Volume2 className="w-3.5 h-3.5 text-emerald-300" />
            </div>

            <div>
              <span className="text-[12px] uppercase font-semibold text-slate-400 tracking-wider">
                Active Soundbox Device
              </span>
              <div className="text-[16px] font-semibold text-slate-900 flex items-center gap-2">
                <span>Soundbox 4G Pro</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-[14px] text-slate-500 font-normal">
                Listens to notification broadcasts & increments Galla live
              </p>
            </div>
          </div>

          {/* Provider Selector Tabs */}
          <div className="flex sm:flex-col gap-1.5 w-full sm:w-auto">
            {['phonepe', 'paytm', 'gpay'].map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-[12px] font-semibold uppercase tracking-wider transition ${
                  selectedProvider === provider
                    ? 'bg-[#062E38] text-white shadow-sm'
                    : 'bg-white border border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
              >
                {provider === 'phonepe' ? 'PhonePe' : provider === 'paytm' ? 'Paytm' : 'Google Pay'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Announcement Alert */}
        {lastPayment && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[14px] animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <Volume2 className={`w-5 h-5 text-emerald-700 ${isAnnouncing ? 'animate-bounce' : ''}`} />
              <span className="text-emerald-950 font-medium">
                {isAnnouncing ? "Soundbox Announcing:" : "Last Captured Payment:"} <strong>₹{lastPayment.amount}</strong> ({lastPayment.itemDesc})
              </span>
            </div>
            <span className="text-[12px] text-emerald-800 font-bold uppercase">
              +₹{lastPayment.amount} Added
            </span>
          </div>
        )}

        {/* 1-Click Trigger Simulated Customer Payments */}
        <div>
          <label className="block text-[12px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Simulate Incoming Customer QR Scan:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_TRANSACTIONS.map((tx) => (
              <button
                key={tx.id}
                onClick={() => handleSimulatePayment(tx)}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-600 text-left transition flex items-center justify-between group shadow-2xs active:scale-98 min-h-[48px]"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-[14px] flex items-center gap-1.5">
                    <span>{tx.itemDesc}</span>
                  </div>
                  <div className="text-[12px] text-slate-500 font-normal">
                    {tx.customer} • QR Scan
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[16px] font-bold text-[#062E38] group-hover:text-emerald-700">
                    +₹{tx.amount}
                  </div>
                  <span className="text-[11px] text-slate-400 group-hover:text-slate-600">
                    Tap to pay
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interview Talking Point Note */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-[12px] text-slate-500 font-normal">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Zero Data Entry:</strong> In production, an Android BroadcastReceiver parses incoming notification text strings directly into SQLite/Supabase.
          </span>
        </div>

      </div>
    </div>
  );
}
