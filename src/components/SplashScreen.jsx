import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  Sparkles, 
  Radio, 
  ArrowRight, 
  Zap,
  Volume2
} from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const hasTriggeredAudioRef = useRef(false);

  // Synthesize a rich, warm, harmonic welcoming chord using Web Audio API
  const playWarmWelcomeSound = () => {
    if (hasTriggeredAudioRef.current) return;
    hasTriggeredAudioRef.current = true;
    setHasPlayedSound(true);

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Warm pentatonic harmonic chord progression (C4 -> G4 -> C5 -> E5 -> G5)
      // Produces an elegant, high-end welcoming chime like Apple / Netflix / Swiggy
      const notes = [
        { freq: 261.63, time: 0.0, duration: 2.2, gain: 0.20 }, // C4
        { freq: 392.00, time: 0.18, duration: 2.4, gain: 0.24 }, // G4
        { freq: 523.25, time: 0.38, duration: 2.6, gain: 0.28 }, // C5
        { freq: 659.25, time: 0.58, duration: 2.8, gain: 0.24 }, // E5
        { freq: 783.99, time: 0.78, duration: 3.2, gain: 0.26 }  // G5
      ];

      // Warm analog-style lowpass filter to remove harshness
      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(2000, ctx.currentTime);
      masterFilter.connect(ctx.destination);

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Sine wave for pure, smooth bell warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

        // Subtle triangle overtone for lush texture
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(note.freq * 2, ctx.currentTime + note.time);

        const startTime = ctx.currentTime + note.time;
        
        // Soft envelope: gentle swell and long warm lingering tail
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(note.gain, startTime + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        overtoneGain.gain.setValueAtTime(0.001, startTime);
        overtoneGain.gain.exponentialRampToValueAtTime(note.gain * 0.22, startTime + 0.12);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration * 0.7);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(masterFilter);
        overtoneGain.connect(masterFilter);

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + note.duration);
        overtone.stop(startTime + note.duration);
      });

      // Warm voice welcoming speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Welcome to Vendor AI");
        utterance.rate = 1.05;
        utterance.volume = 0.85;
        utterance.lang = 'en-IN';
        
        // Speaks gently as the harmonic chord blossoms
        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch (e) {}
        }, 550);
      }
    } catch (e) {
      console.warn("Audio autoplay blocked by browser policy:", e);
    }
  };

  useEffect(() => {
    // Attempt automatic playback of the welcoming chord on mount
    playWarmWelcomeSound();

    // 5.0 Seconds Loading Bar:
    // 100 intervals of 50ms = 5,000ms = 5.0 Seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleComplete();
          return 100;
        }
        return Math.min(100, prev + 1);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleComplete = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onFinish();
    }, 450); // 450ms smooth dissolve fade
  };

  // Dynamic status text across the 5 seconds
  const loadingStatusText = (() => {
    if (progress < 25) return "📡 Connecting to Azadpur & APMC live mandi auction sheets...";
    if (progress < 55) return "📊 Calibrating 5 stall trade profiles & daily micro-P&Ls...";
    if (progress < 85) return "🔊 Syncing 4G UPI Soundbox & Customer Self-Pay Ledger...";
    return "✨ Welcome to VendorAI! Launching your stall workspace...";
  })();

  return (
    <div 
      onClick={() => {
        if (!hasPlayedSound) playWarmWelcomeSound();
      }}
      className={`fixed inset-0 z-[100] bg-[#0A1D37] text-white flex flex-col justify-between items-center p-6 sm:p-10 select-none transition-all duration-450 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 38%, #142E54 0%, #0A1D37 60%, #050E1B 100%)'
      }}
    >
      
      {/* Top Bar: Live Status & Controls */}
      <div className="w-full max-w-5xl flex items-center justify-between text-xs text-blue-200/70">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-[11px] tracking-wider uppercase text-blue-200">
            v2.0 • Live APMC Connected
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Welcoming Sound Status Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              hasTriggeredAudioRef.current = false;
              playWarmWelcomeSound();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-blue-200 text-xs font-bold transition active:scale-95 backdrop-blur-md"
            title="Play welcoming chime"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Warm Chime</span>
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleComplete();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition active:scale-95 backdrop-blur-md"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Stage: Swiggy-like Brand Animation */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto my-auto space-y-6">
        
        {/* Animated Brand Emblem with Concentric Expanding Rings */}
        <div className="relative flex items-center justify-center animate-splash-scale">
          {/* Concentric ambient pulse rings */}
          <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-blue-400/30 animate-pulse-ring" />
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-emerald-400/20 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />

          {/* Central Luxury Icon Card */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#0F2D57] to-[#1E4E8C] border-2 border-white/25 flex items-center justify-center shadow-2xl shadow-blue-900/60 backdrop-blur-xl">
            <Store className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            
            {/* Floating Sparkles Badge */}
            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-xl bg-blue-500 text-white flex items-center justify-center border-2 border-[#0A1D37] shadow-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </div>

            {/* Floating Soundbox Badge */}
            <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center border-2 border-[#0A1D37] shadow-md">
              <Radio className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>

        {/* Brand Name Animation */}
        <div className="space-y-3 animate-splash-fade-up">
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-none drop-shadow-lg">
            Vendor<span className="text-blue-400 font-black">AI</span>
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>AI-Native Profit Munshi • आपका डिजिटल मुंशी</span>
          </div>
        </div>

      </div>

      {/* Bottom 5-Second Progress Bar & Loading Indicator */}
      <div className="w-full max-w-md flex flex-col items-center space-y-2.5 pb-2">
        <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden backdrop-blur-md p-0.5 border border-white/10">
          <div 
            className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 h-full rounded-full transition-all duration-75 shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-full text-[11px] text-blue-200/80 font-medium">
          <span className="flex items-center gap-1.5 truncate max-w-[320px]">
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300 shrink-0" />
            <span>{loadingStatusText}</span>
          </span>
          <span className="font-mono font-bold text-white shrink-0 ml-2">
            {Math.round(progress)}% (5s)
          </span>
        </div>
      </div>

    </div>
  );
}
