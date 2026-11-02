import React, { useState, useEffect, useRef } from 'react';
import { 
  Store, 
  Sparkles, 
  Radio, 
  ArrowRight, 
  Zap,
  Volume2,
  Music
} from 'lucide-react';
import VyaparMitraLogo from './VyaparMitraLogo';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const hasTriggeredAudioRef = useRef(false);

  // Synthesize a soothing, uplifting, sweet melody music chime (No voice callout)
  const playMelodyMusic = () => {
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

      // Warm analog-style lowpass filter for sweet mellow marimba/bell harmonics
      const masterFilter = ctx.createBiquadFilter();
      masterFilter.type = 'lowpass';
      masterFilter.frequency.setValueAtTime(2200, ctx.currentTime);
      masterFilter.connect(ctx.destination);

      // 1. Gentle warm bass foundation note (C3)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
      bassGain.gain.setValueAtTime(0.001, ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.25);
      bassGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.2);
      bassOsc.connect(bassGain);
      bassGain.connect(masterFilter);
      bassOsc.start(ctx.currentTime);
      bassOsc.stop(ctx.currentTime + 4.2);

      // 2. Beautiful 9-note melody chime tune (C4 -> E4 -> G4 -> A4 -> C5 -> E5 -> D5 -> C5 -> G5)
      const melodyNotes = [
        { freq: 261.63, time: 0.05, duration: 1.8, gain: 0.22 }, // C4
        { freq: 329.63, time: 0.32, duration: 1.8, gain: 0.24 }, // E4
        { freq: 392.00, time: 0.58, duration: 2.0, gain: 0.26 }, // G4
        { freq: 440.00, time: 0.88, duration: 2.2, gain: 0.24 }, // A4
        { freq: 523.25, time: 1.20, duration: 2.4, gain: 0.28 }, // C5
        { freq: 659.25, time: 1.55, duration: 2.6, gain: 0.26 }, // E5
        { freq: 587.33, time: 1.95, duration: 2.4, gain: 0.22 }, // D5
        { freq: 523.25, time: 2.30, duration: 2.8, gain: 0.28 }, // C5
        { freq: 783.99, time: 2.70, duration: 3.5, gain: 0.25 }  // G5 (sweet lingering finish)
      ];

      melodyNotes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Sine wave for pure, round marimba/bell warmth
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

        // Subtle harmonic overtone for shimmering acoustic texture
        const overtone = ctx.createOscillator();
        const overtoneGain = ctx.createGain();
        overtone.type = 'triangle';
        overtone.frequency.setValueAtTime(note.freq * 2, ctx.currentTime + note.time);

        const startTime = ctx.currentTime + note.time;
        
        // Gentle strike with pleasant acoustic decay
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(note.gain, startTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        overtoneGain.gain.setValueAtTime(0.001, startTime);
        overtoneGain.gain.exponentialRampToValueAtTime(note.gain * 0.18, startTime + 0.04);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration * 0.6);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        gain.connect(masterFilter);
        overtoneGain.connect(masterFilter);

        osc.start(startTime);
        overtone.start(startTime);
        osc.stop(startTime + note.duration);
        overtone.stop(startTime + note.duration);
      });

    } catch (e) {
      console.warn("Audio autoplay blocked by browser policy:", e);
    }
  };

  useEffect(() => {
    // Attempt automatic playback of the welcoming melody music on mount
    playMelodyMusic();

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
    return "✨ Welcome to KamaiMitra! Launching your stall workspace...";
  })();

  return (
    <div 
      onClick={() => {
        if (!hasPlayedSound) playMelodyMusic();
      }}
      className={`fixed inset-0 z-[100] bg-[#062E38] text-white flex flex-col justify-between items-center p-6 sm:p-10 select-none transition-all duration-450 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at 50% 38%, #084350 0%, #062E38 60%, #03181E 100%)'
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
          {/* Melody Music Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              hasTriggeredAudioRef.current = false;
              playMelodyMusic();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-blue-200 text-xs font-bold transition active:scale-95 backdrop-blur-md"
            title="Play melody music"
          >
            <Music className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Melody Music</span>
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
          <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-teal-400/30 animate-pulse-ring" />
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-emerald-400/20 animate-pulse-ring" style={{ animationDelay: '0.6s' }} />

          {/* Central Luxury Custom Logo Emblem */}
          <VyaparMitraLogo size="xl" variant="dark" animated={true} />
        </div>

        {/* Brand Name Animation */}
        <div className="space-y-3 animate-splash-fade-up">
          <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-none drop-shadow-xl">
            Kamai<span className="text-emerald-400 font-extrabold">Mitra</span>
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs sm:text-sm font-semibold backdrop-blur-md shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Smart Daily Profit Intelligence for Local Retailers</span>
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
