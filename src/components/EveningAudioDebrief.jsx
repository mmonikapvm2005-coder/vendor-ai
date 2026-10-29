import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Share2, 
  MessageSquare,
  Zap,
  RotateCcw
} from 'lucide-react';

export default function EveningAudioDebrief({ netTakeHome, totalRevenue, totalExpenses, categoryProfile }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activeLanguage, setActiveLanguage] = useState('hi');
  const [playbackSpeed, setPlaybackSpeed] = useState(1.25); // Fast 1.25x default

  const defaultHindiScript = categoryProfile?.audioScript || 
    `नमस्ते ${categoryProfile?.defaultOwner || "जी"}! आज कुल गल्ला ₹${totalRevenue.toLocaleString()} रहा, जिसमें ₹${totalExpenses.toLocaleString()} खर्चा काटकर आपकी जेब में ₹${netTakeHome.toLocaleString()} का असली मुनाफ़ा बचा है।`;

  const AUDIO_SCRIPTS = {
    hi: {
      lang: "हिंदी",
      title: `${categoryProfile?.label || "आज का मुंशी"} वॉयस नोट`,
      script: defaultHindiScript,
      duration: "0:18"
    },
    en: {
      lang: "English",
      title: "Daily Profit Voice Note",
      script: `Hello ${categoryProfile?.defaultOwner || "Vendor"}! Today's sales were ₹${totalRevenue.toLocaleString()}. After deducting expenses of ₹${totalExpenses.toLocaleString()}, your real take-home profit is ₹${netTakeHome.toLocaleString()}. Rest well!`,
      duration: "0:16"
    },
    ta: {
      lang: "தமிழ்",
      title: "தினசரி லாபக் குரல் குறிப்பு",
      script: `வணக்கம்! இன்று உங்கள் விற்பனை ₹${totalRevenue.toLocaleString()}. செலவு போக நிகர லாபம் ₹${netTakeHome.toLocaleString()}. நன்றி!`,
      duration: "0:15"
    }
  };

  const currentScript = AUDIO_SCRIPTS[activeLanguage];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      // Scale interval based on playback speed
      const stepTime = 400 / playbackSpeed;
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 4;
        });
      }, stepTime);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentScript.script);
        utterance.rate = playbackSpeed; // Use fast playback rate (1.25x)
        utterance.lang = activeLanguage === 'hi' ? 'hi-IN' : activeLanguage === 'ta' ? 'ta-IN' : 'en-IN';
        
        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(0);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setPlaybackProgress(0);
    }
  };

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-stone-900 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#EAE3D7]">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#0A1D37] flex items-center justify-center text-white shadow-sm">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900 flex items-center gap-2">
              <span>Evening WhatsApp Audio Debrief</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                Fast Playback
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              Zero-reading audio summary for {categoryProfile?.defaultOwner}
            </p>
          </div>
        </div>

        {/* Speed Controls & Language Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Toggle */}
          <div className="flex items-center bg-[#F5F1EB] p-1 rounded-xl border border-[#EAE3D7] text-xs font-bold">
            {[1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-2 py-1 rounded-lg transition text-[10px] font-bold ${
                  playbackSpeed === s
                    ? 'bg-[#0A1D37] text-white shadow-xs font-black'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F5F1EB] border border-[#EAE3D7] text-xs">
            {['hi', 'en', 'ta'].map((langKey) => (
              <button
                key={langKey}
                onClick={() => {
                  if (isPlaying) {
                    window.speechSynthesis?.cancel();
                    setIsPlaying(false);
                    setPlaybackProgress(0);
                  }
                  setActiveLanguage(langKey);
                }}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                  activeLanguage === langKey
                    ? 'bg-[#0A1D37] text-white shadow-xs font-extrabold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {AUDIO_SCRIPTS[langKey].lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Player Card (WhatsApp Style) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF8F5] border border-[#EAE3D7] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-xs font-bold text-stone-800">
              {currentScript.title}
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-stone-500">
            {currentScript.duration} • {playbackSpeed}x Fast
          </span>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayback}
            className="w-12 h-12 rounded-2xl bg-[#0A1D37] hover:bg-[#0E294B] text-white flex items-center justify-center shadow-md shrink-0 hover:scale-105 active:scale-95 transition"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Progress Bar & Soundwave */}
          <div className="flex-1 space-y-1.5">
            <div className="w-full bg-[#EAE3D7] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-200"
                style={{ width: `${playbackProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>{Math.round((playbackProgress / 100) * 18)}s</span>
              <span>18s</span>
            </div>
          </div>
        </div>

        {/* Spoken Text Transcript Card */}
        <div className="p-3 rounded-2xl bg-white border border-[#EAE3D7] text-xs text-stone-700 italic">
          "{currentScript.script}"
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE3D7] text-xs text-stone-500">
        <div className="flex items-center gap-1.5 text-[11px]">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span>Scheduled for daily 10:00 PM WhatsApp auto-dispatch</span>
        </div>

        <button 
          onClick={() => alert("Daily voice debrief forwarded to vendor's WhatsApp!")}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
        >
          <Share2 className="w-3 h-3" />
          <span>Share to WhatsApp</span>
        </button>
      </div>

    </div>
  );
}
