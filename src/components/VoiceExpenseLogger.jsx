import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Check, 
  X, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Store,
  RefreshCw,
  Calculator,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  Globe
} from 'lucide-react';
import { CATEGORY_PROFILES } from '../data/categoryData';

// Multi-language UI dictionary for Voice Assistant
const VOICE_TEXTS = {
  en: {
    title: "KamaiMitra Voice Assistant",
    subtitle: "Ask profit questions, tell sales & expenses, or log stock by speaking.",
    langBarLabel: "Choose Language / भाषा / மொழி:",
    salesLabel: "Today's Sales",
    expensesLabel: "Total Expenses",
    profitLabel: "Net Profit",
    tapToSpeak: "Tap to Speak Question or Amounts",
    listening: "🔴 Listening live... Speak now (English/Hinglish)",
    processing: "Calculating profit...",
    speakGuidance: "Tell sales and expenses, or ask for today's profit",
    whatYouSaid: "What you said:",
    recalculate: "Re-Calculate",
    hearVoice: "Hear Voice",
    stopVoice: "Stop Voice",
    sampleQuestionsHeader: "1-Tap Voice Questions for",
    orTypePlaceholder: "e.g. Sales 3000 expense 1200 profit kitna hai?",
    askVoiceBtn: "Ask Voice →",
    formulaNote: "Deterministic Formula: Profit = Sales - Expenses",
    doneBtn: "Done",
    savedToLedger: "Saved to Stall Ledger!",
    updateLedgerBtn: "Update Ledger",
    askConfirm: "Would you like to record these figures in today's ledger?",
    netProfitHeader: "Profit Calculation (Sales - Expenses)",
    todaySummaryHeader: "Today's Live Stall Summary",
    salesEntryHeader: "Sales Entry",
    expenseEntryHeader: "Expense Entry"
  },
  hi: {
    title: "कमाईमित्र वॉयस असिस्टेंट",
    subtitle: "बोलकर मुनाफ़ा पूछें, बिक्री और खर्चा दर्ज करें।",
    langBarLabel: "भाषा चुनें (Choose Language):",
    salesLabel: "आज की बिक्री",
    expensesLabel: "कुल खर्चा",
    profitLabel: "शुद्ध मुनाफ़ा",
    tapToSpeak: "बोलने के लिए टैप करें (मुनाफ़ा गणना)",
    listening: "🔴 लाइव सुन रहे हैं... बोलिए (हिन्दी)",
    processing: "मुनाफ़ा गणना हो रहा है...",
    speakGuidance: "बिक्री और खर्चा बताएं, या आज का मुनाफ़ा पूछें",
    whatYouSaid: "आपने क्या कहा:",
    recalculate: "पुनः गणना करें",
    hearVoice: "आवाज़ सुनें",
    stopVoice: "आवाज़ रोकें",
    sampleQuestionsHeader: "1-टैप वॉयस प्रश्न:",
    orTypePlaceholder: "जैसे: बिक्री 3000 खर्चा 1200 मुनाफ़ा कितना है?",
    askVoiceBtn: "पूछें →",
    formulaNote: "शुद्ध गणित: मुनाफ़ा = कुल बिक्री - कुल खर्चा",
    doneBtn: "हो गया",
    savedToLedger: "दुकान खाते में दर्ज हुआ!",
    updateLedgerBtn: "खाता अपडेट करें",
    askConfirm: "क्या आप इन आंकड़ों को आज के बहीखाते में दर्ज करना चाहते हैं?",
    netProfitHeader: "मुनाफ़ा गणना (बिक्री - खर्चा)",
    todaySummaryHeader: "आज का दुकान हिसाब",
    salesEntryHeader: "बिक्री रिकॉर्ड",
    expenseEntryHeader: "खर्चा रिकॉर्ड"
  },
  ta: {
    title: "காமாய் மித்ரா குரல் உதவியாளர்",
    subtitle: "பேசி லாபம் கணக்கிடுங்கள், விற்பனை & செலவு பதியுங்கள்.",
    langBarLabel: "மொழி தேர்வு (Choose Language):",
    salesLabel: "இன்றைய விற்பனை",
    expensesLabel: "மொத்த செலவு",
    profitLabel: "நிகர லாபம்",
    tapToSpeak: "பேச தட்டவும் (லாப கணக்கீடு)",
    listening: "🔴 கேட்கிறது... பேசுங்கள் (தமிழ்)",
    processing: "லாபம் கணக்கிடப்படுகிறது...",
    speakGuidance: "விற்பனை மற்றும் செலவை சொல்லுங்கள், அல்லது லாபத்தை கேளுங்கள்",
    whatYouSaid: "நீங்கள் கூறியது:",
    recalculate: "மீண்டும் கணக்கிடு",
    hearVoice: "குரல் கேட்க",
    stopVoice: "குரல் நிறுத்து",
    sampleQuestionsHeader: "1-தட்டு குரல் கேள்விகள்:",
    orTypePlaceholder: "எ.கா: விற்பனை 3000 செலவு 1200 லாபம் என்ன?",
    askVoiceBtn: "கேட்க →",
    formulaNote: "கணக்கீடு: லாபம் = விற்பனை - செலவு",
    doneBtn: "முடிந்தது",
    savedToLedger: "கணக்கில் பதிவானது!",
    updateLedgerBtn: "கணக்கை புதுப்பி",
    askConfirm: "இந்த தொகையை இன்றைய கணக்கில் பதிவு செய்ய வேண்டுமா?",
    netProfitHeader: "லாப கணக்கீடு (விற்பனை - செலவு)",
    todaySummaryHeader: "இன்றைய கடை கணக்கு",
    salesEntryHeader: "விற்பனை பதிவு",
    expenseEntryHeader: "செலவு பதிவு"
  }
};

// Curated shop-specific voice prompt samples in 3 languages
const SHOP_VOICE_SAMPLES = {
  produce: {
    en: [
      { text: "Today's sales are 4200 and expenses are 1650. What is my profit?", tag: "Calculate Profit" },
      { text: "What is Radheshyam Fresh Vegetables profit today?", tag: "Today's Profit" },
      { text: "Bought 1 crate tomatoes for 700 rupees and tempo 120 rupees", tag: "Log Expense" }
    ],
    hi: [
      { text: "आज का बिक्री ₹4200 और कुल खर्चा ₹1650 है, मुनाफ़ा कितना है?", tag: "मुनाफ़ा गणना" },
      { text: "आज सब्जी ठेले का कुल मुनाफ़ा और बिक्री कितना है?", tag: "आज का हिसाब" },
      { text: "सुबह 1 क्रेट टमाटर ₹700 और 50kg आलू ₹950 का लिया", tag: "खर्चा जोड़ें" }
    ],
    ta: [
      { text: "இன்றைய விற்பனை ₹4200 மற்றும் செலவு ₹1650. எனது லாபம் என்ன?", tag: "லாப கணக்கீடு" },
      { text: "காய்கறி கடையின் இன்றைய லாபம் மற்றும் விற்பனை என்ன?", tag: "இன்றைய நிலை" },
      { text: "தக்காளி பெட்டி ₹700 மற்றும் உருளைக்கிழங்கு ₹950 வாங்கினேன்", tag: "செலவு பதிவு" }
    ]
  },
  street_food: {
    en: [
      { text: "Samosa sales 2600 and oil and flour expenses 800. Calculate profit?", tag: "Calculate Profit" },
      { text: "What is today's net profit for Gupta Chaat Stall?", tag: "Today's Profit" },
      { text: "Bought 25kg potatoes for 500 and refined oil tin for 1770", tag: "Log Expense" }
    ],
    hi: [
      { text: "समोसा चाट बिक्री ₹2600 और तेल मैदा खर्चा ₹800, मुनाफ़ा कितना हुआ?", tag: "मुनाफ़ा गणना" },
      { text: "गुप्ता चाट स्टॉल का आज का शुद्ध मुनाफ़ा बताओ", tag: "आज का हिसाब" },
      { text: "25kg आलू ₹500 और रिफाइंड तेल ₹1770 का खर्चा लिखो", tag: "खर्चा जोड़ें" }
    ],
    ta: [
      { text: "சமோசா விற்பனை ₹2600, எண்ணெய் மாவு செலவு ₹800, லாபம் என்ன?", tag: "லாப கணக்கீடு" },
      { text: "சாட் கடையின் இன்றைய நிகர லாபம் எவ்வளவு?", tag: "இன்றைய நிலை" },
      { text: "உருளைக்கிழங்கு ₹500 மற்றும் எண்ணெய் ₹1770 செலவு பதிவு செய்", tag: "செலவு பதிவு" }
    ]
  },
  chai_tea: {
    en: [
      { text: "Chai sales 2200 and milk sugar expenses 750. What is my profit?", tag: "Calculate Profit" },
      { text: "What is today's net profit for Sharma Ji Chai Stall?", tag: "Today's Profit" },
      { text: "Bought 14 packets milk for 924 and 10kg sugar for 410", tag: "Log Expense" }
    ],
    hi: [
      { text: "कुल्हड़ चाय बिक्री ₹2200 और दूध चीनी खर्चा ₹750, मुनाफ़ा बताओ?", tag: "मुनाफ़ा गणना" },
      { text: "शर्मा जी चाय स्टॉल का आज का कुल मुनाफ़ा कितना है?", tag: "आज का हिसाब" },
      { text: "14 पैकेट दूध ₹924 और 10kg चीनी ₹410 का खर्चा जोड़ो", tag: "खर्चा जोड़ें" }
    ],
    ta: [
      { text: "டீ விற்பனை ₹2200, பால் சர்க்கரை செலவு ₹750, லாபம் என்ன?", tag: "லாப கணக்கீடு" },
      { text: "சர்மா ஜி டீ கடையின் இன்றைய மொத்த லாபம் எவ்வளவு?", tag: "இன்றைய நிலை" },
      { text: "14 பாக்கெட் பால் ₹924 மற்றும் சர்க்கரை ₹410 செலவு பதிவு செய்", tag: "செலவு பதிவு" }
    ]
  },
  kirana: {
    en: [
      { text: "Kirana sales 4800 and wholesale stock expenses 3200. Calculate profit?", tag: "Calculate Profit" },
      { text: "What is today's total sales and profit for Maa Durga Kirana?", tag: "Today's Profit" },
      { text: "Wholesale atta sacks 2880 and toor dal 1200 bought", tag: "Log Expense" }
    ],
    hi: [
      { text: "किराना बिक्री ₹4800 और होलसेल स्टॉक खर्चा ₹3200, मुनाफ़ा कितना है?", tag: "मुनाफ़ा गणना" },
      { text: "माँ दुर्गा किराना स्टोर का आज का कुल मुनाफ़ा बताओ", tag: "आज का हिसाब" },
      { text: "होलसेल से 8 बोरी आटा ₹2880 और दाल ₹1200 का खर्चा जोड़ो", tag: "खर्चा जोड़ें" }
    ],
    ta: [
      { text: "மளிகை விற்பனை ₹4800 மற்றும் சரக்கு செலவு ₹3200. லாபம் என்ன?", tag: "லாப கணக்கீடு" },
      { text: "மா துர்கா மளிகைக் கடையின் இன்றைய லாபம் எவ்வளவு?", tag: "இன்றைய நிலை" },
      { text: "மொத்த விற்பனை மாவு ₹2880 மற்றும் பருப்பு ₹1200 செலவு பதிவு செய்", tag: "செலவு பதிவு" }
    ]
  },
  flowers: {
    en: [
      { text: "Flower garland sales 2800 and mandi flower expenses 1200. What is profit?", tag: "Calculate Profit" },
      { text: "What is today's net profit for Shree Ganesh Flowers?", tag: "Today's Profit" },
      { text: "Bought 30kg marigold flowers for 960 and rose bundles for 550", tag: "Log Expense" }
    ],
    hi: [
      { text: "फूल माला बिक्री ₹2800 और मंडी फूल खर्चा ₹1200, मुनाफ़ा कितना हुआ?", tag: "मुनाफ़ा गणना" },
      { text: "श्री गणेश पूजा भंडार का आज का कुल मुनाफ़ा बताओ", tag: "आज का हिसाब" },
      { text: "30kg गेंदा फूल ₹960 और गुलाब ₹550 का खर्चा लिखो", tag: "खर्चा जोड़ें" }
    ],
    ta: [
      { text: "பூ மாலை விற்பனை ₹2800, பூ செலவு ₹1200, லாபம் என்ன?", tag: "லாப கணக்கீடு" },
      { text: "பூ கடையின் இன்றைய மொத்த லாபம் எவ்வளவு?", tag: "இன்றைய நிலை" },
      { text: "30கிகி சாமந்தி பூ ₹960 மற்றும் ரோஜா ₹550 செலவு பதிவு செய்", tag: "செலவு பதிவு" }
    ]
  }
};

export default function VoiceExpenseLogger({ 
  isOpen, 
  onClose, 
  onAddExpenses, 
  onAddSales,
  categoryProfile, 
  activeStallKey = 'produce',
  stallRevenues = {},
  stallExpenses = {},
  currentLanguage = 'en',
  onLanguageChange
}) {
  // Strictly isolated to the vendor's active logged-in shop!
  const selectedShop = activeStallKey || 'produce';

  // Active language state with 1-click toggling
  const [activeLang, setActiveLang] = useState(currentLanguage || 'en');

  // Sync activeLang if parent language changes
  useEffect(() => {
    if (currentLanguage) setActiveLang(currentLanguage);
  }, [currentLanguage]);

  const handleSwitchLang = (lang) => {
    setActiveLang(lang);
    if (onLanguageChange) onLanguageChange(lang);
    handleStopSpeaking();
    setErrorMessage('');
    setParsedResult(null);
    setSpokenText('');
  };

  const ui = VOICE_TEXTS[activeLang] || VOICE_TEXTS.en;

  // Voice recording & query states
  const [isRecording, setIsRecording] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micStatus, setMicStatus] = useState('idle'); // 'idle' | 'listening' | 'processing'
  const [errorMessage, setErrorMessage] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manual fallback input
  const [manualText, setManualText] = useState('');

  // Refs
  const recognitionRef = useRef(null);
  const spokenTextRef = useRef('');

  // Current shop data & deterministic metrics
  const currentShopProfile = CATEGORY_PROFILES[selectedShop] || CATEGORY_PROFILES.produce;
  const currentShopRevenue = stallRevenues[selectedShop] || currentShopProfile?.revenue || { cash: 0, upi: 0, total: 0 };
  const currentShopExpensesList = stallExpenses[selectedShop] || currentShopProfile?.initialExpenses || [];
  
  const currentShopSales = Math.max(0, Number(currentShopRevenue.total) || 0);
  const currentShopExpenses = currentShopExpensesList.reduce((sum, item) => {
    const amt = Number(item?.amount) || 0;
    return sum + (amt > 0 ? amt : 0);
  }, 0);
  const currentShopProfit = currentShopSales - currentShopExpenses;

  // Shop-specific voice questions in active language
  const currentSamples = (SHOP_VOICE_SAMPLES[selectedShop] && SHOP_VOICE_SAMPLES[selectedShop][activeLang]) 
    || SHOP_VOICE_SAMPLES[selectedShop]?.en 
    || [];

  // Cleanup speech recognition and synthesis on unmount or close
  useEffect(() => {
    return () => {
      stopMicrophone();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When modal closes, stop all audio
  useEffect(() => {
    if (!isOpen) {
      stopMicrophone();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setSpokenText('');
      setParsedResult(null);
      setErrorMessage('');
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const stopMicrophone = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setMicStatus('idle');
  };

  // Speaks aloud the generated answer in the vendor's chosen language
  const speakVoiceAnswer = (textToSpeak) => {
    if (!('speechSynthesis' in window) || !textToSpeak) return;

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      if (activeLang === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (activeLang === 'ta') {
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      // Match best voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langCode = activeLang === 'hi' ? 'hi' : activeLang === 'ta' ? 'ta' : 'en';
        const matched = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langCode));
        if (matched) utterance.voice = matched;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
      setIsSpeaking(false);
    }
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Pure Deterministic Voice Query Parser:
  // Profit = Total Sales - Total Expenses
  const parseAndAnswerQuery = (inputText) => {
    if (!inputText || !inputText.trim()) return;

    setMicStatus('processing');
    setSavedSuccess(false);
    const text = inputText.trim();
    const lower = text.toLowerCase();

    // 1. Extract all numbers
    const numberMatches = text.match(/\d+[\d,]*/g) || [];
    const numbers = numberMatches
      .map(n => Number(n.replace(/,/g, '')))
      .filter(n => !isNaN(n) && n > 0);

    const hasSalesKeyword = /sales?|bikri|selling|kamaai|collection|biki|வரவு|விற்பனை/i.test(lower);
    const hasExpenseKeyword = /expense|expenses|kharcha|kharch|lagat|kharid|cost|செலவு/i.test(lower);
    const hasProfitKeyword = /profit|munafa|fayda|bachat|kamai|gain|margin|net|லாபம்/i.test(lower);

    let result = null;

    // CASE 1: Vendor provides both Sales and Expenses to calculate profit
    // e.g., "sales 2500 and expenses 900" or "sales 3000 expense 1200 profit" or "बिक्री 2500 खर्चा 900"
    if ((hasSalesKeyword && hasExpenseKeyword && numbers.length >= 2) || (numbers.length >= 2 && hasProfitKeyword)) {
      let salesAmt = null;
      let expAmt = null;

      // Extract sales amount near sales keyword
      const salesMatch = /(?:sales?|bikri|selling|collection|விற்பனை)\D*(\d+[\d,]*)/i.exec(lower);
      const expenseMatch = /(?:expense|expenses|kharcha|kharch|lagat|kharid|செலவு)\D*(\d+[\d,]*)/i.exec(lower);

      if (salesMatch && salesMatch[1]) salesAmt = Number(salesMatch[1].replace(/,/g, ''));
      if (expenseMatch && expenseMatch[1]) expAmt = Number(expenseMatch[1].replace(/,/g, ''));

      // Fallback: assign largest number as sales, smaller as expense
      if (!salesAmt || !expAmt) {
        salesAmt = Math.max(numbers[0], numbers[1]);
        expAmt = Math.min(numbers[0], numbers[1]);
      }

      // Deterministic arithmetic: Profit = Sales - Expenses
      const profitAmt = salesAmt - expAmt;

      const voiceAnswer = activeLang === 'hi'
        ? `आपके ${currentShopProfile.defaultBusinessName || "दुकान"} का कुल बिक्री ₹${salesAmt.toLocaleString()} है और कुल खर्चा ₹${expAmt.toLocaleString()} है। आपका शुद्ध मुनाफ़ा ₹${profitAmt.toLocaleString()} है।`
        : activeLang === 'ta'
        ? `உங்கள் கடையின் மொத்த விற்பனை ₹${salesAmt.toLocaleString()}, செலவு ₹${expAmt.toLocaleString()}. உங்கள் நிகர லாபம் ₹${profitAmt.toLocaleString()} ஆகும்.`
        : `For ${currentShopProfile.defaultBusinessName || "your stall"}, total sales are ₹${salesAmt.toLocaleString()} and expenses are ₹${expAmt.toLocaleString()}. Your net profit is ₹${profitAmt.toLocaleString()}.`;

      result = {
        type: 'profit_calculation',
        headline: ui.netProfitHeader,
        sales: salesAmt,
        expenses: expAmt,
        profit: profitAmt,
        voiceText: voiceAnswer,
        details: `${salesAmt.toLocaleString()} - ${expAmt.toLocaleString()} = ₹${profitAmt.toLocaleString()}`,
        stallKey: selectedShop
      };
    }

    // CASE 2: Vendor asks about Today's Current Profit / Summary
    // e.g., "What is my profit today?" or "आज का मुनाफ़ा कितना है?"
    else if (hasProfitKeyword || /aaj ka|today|kiti|kitna|evalavu|status/i.test(lower)) {
      const salesAmt = currentShopSales;
      const expAmt = currentShopExpenses;
      const profitAmt = salesAmt - expAmt;

      const voiceAnswer = activeLang === 'hi'
        ? `आज ${currentShopProfile.defaultBusinessName || "आपकी दुकान"} का कुल बिक्री ₹${salesAmt.toLocaleString()} है, कुल खर्चा ₹${expAmt.toLocaleString()} है, और आपका शुद्ध मुनाफ़ा ₹${profitAmt.toLocaleString()} है।`
        : activeLang === 'ta'
        ? `இன்று ${currentShopProfile.defaultBusinessName || "உங்கள் கடையின்"} மொத்த விற்பனை ₹${salesAmt.toLocaleString()}, செலவு ₹${expAmt.toLocaleString()}, மற்றும் உங்கள் லாபம் ₹${profitAmt.toLocaleString()} ஆகும்.`
        : `Today for ${currentShopProfile.defaultBusinessName || "your stall"}, total sales are ₹${salesAmt.toLocaleString()}, total expenses are ₹${expAmt.toLocaleString()}, and your net profit is ₹${profitAmt.toLocaleString()}.`;

      result = {
        type: 'current_profit_query',
        headline: ui.todaySummaryHeader,
        sales: salesAmt,
        expenses: expAmt,
        profit: profitAmt,
        voiceText: voiceAnswer,
        details: `Live Ledger: Sales ₹${salesAmt.toLocaleString()} - Expenses ₹${expAmt.toLocaleString()} = Profit ₹${profitAmt.toLocaleString()}`,
        stallKey: selectedShop
      };
    }

    // CASE 3: Vendor adds/states Sales
    // e.g., "Add sales 1200" or "Cash sale 600" or "बिक्री ₹800"
    else if (hasSalesKeyword && numbers.length > 0) {
      const saleAmt = numbers[0];
      const newSales = currentShopSales + saleAmt;
      const newProfit = newSales - currentShopExpenses;

      const voiceAnswer = activeLang === 'hi'
        ? `₹${saleAmt.toLocaleString()} की बिक्री दर्ज की गई। अब ${currentShopProfile.defaultBusinessName} का कुल बिक्री ₹${newSales.toLocaleString()} और मुनाफ़ा ₹${newProfit.toLocaleString()} हो गया है।`
        : activeLang === 'ta'
        ? `₹${saleAmt.toLocaleString()} விற்பனை சேர்க்கப்பட்டது. புதிய விற்பனை ₹${newSales.toLocaleString()} மற்றும் லாபம் ₹${newProfit.toLocaleString()}.`
        : `Recorded ₹${saleAmt.toLocaleString()} sales for ${currentShopProfile.defaultBusinessName}. Updated sales is ₹${newSales.toLocaleString()} and profit is ₹${newProfit.toLocaleString()}.`;

      result = {
        type: 'add_sale',
        headline: ui.salesEntryHeader,
        amount: saleAmt,
        newSales: newSales,
        newProfit: newProfit,
        voiceText: voiceAnswer,
        details: `+₹${saleAmt.toLocaleString()} added to sales. New Profit = ₹${newProfit.toLocaleString()}`,
        stallKey: selectedShop
      };
    }

    // CASE 4: Vendor logs an Expense item
    // e.g., "Tamatar 400 rupaye" or "Refined tel 1770" or "खर्चा 500"
    else if (numbers.length > 0) {
      const expAmt = numbers[numbers.length - 1];
      const knownItems = currentShopProfile?.mandiData || [];
      const matched = knownItems.find(k => lower.includes(k.item.toLowerCase().split(' ')[0]));
      const itemName = matched ? matched.item : (text.replace(/\d+/g, '').replace(/(rupees|rupaye|rs|\?)/gi, '').trim() || "Stock Expense");

      const newExpenses = currentShopExpenses + expAmt;
      const newProfit = currentShopSales - newExpenses;

      const voiceAnswer = activeLang === 'hi'
        ? `${itemName} का ₹${expAmt.toLocaleString()} खर्चा दर्ज किया गया। अब कुल खर्चा ₹${newExpenses.toLocaleString()} और मुनाफ़ा ₹${newProfit.toLocaleString()} है।`
        : activeLang === 'ta'
        ? `${itemName} ₹${expAmt.toLocaleString()} செலவு சேர்க்கப்பட்டது. புதிய லாபம் ₹${newProfit.toLocaleString()}.`
        : `Recorded ${itemName} expense of ₹${expAmt.toLocaleString()}. Updated profit is ₹${newProfit.toLocaleString()}.`;

      result = {
        type: 'add_expense',
        headline: ui.expenseEntryHeader,
        item: {
          name: itemName,
          category: matched?.category || "Stock",
          qty: 1,
          unit: matched?.unit?.split(' ')[0] || "lot",
          amount: expAmt
        },
        newExpenses: newExpenses,
        newProfit: newProfit,
        voiceText: voiceAnswer,
        details: `+₹${expAmt.toLocaleString()} logged. New Profit = ₹${newProfit.toLocaleString()}`,
        stallKey: selectedShop
      };
    }

    // Default Fallback
    else {
      const salesAmt = currentShopSales;
      const expAmt = currentShopExpenses;
      const profitAmt = salesAmt - expAmt;

      const voiceAnswer = activeLang === 'hi'
        ? `आपके ${currentShopProfile.defaultBusinessName} का आज का कुल बिक्री ₹${salesAmt.toLocaleString()}, खर्चा ₹${expAmt.toLocaleString()}, और शुद्ध मुनाफ़ा ₹${profitAmt.toLocaleString()} है।`
        : activeLang === 'ta'
        ? `உங்கள் கடையின் மொத்த விற்பனை ₹${salesAmt.toLocaleString()}, செலவு ₹${expAmt.toLocaleString()}, உங்கள் லாபம் ₹${profitAmt.toLocaleString()}.`
        : `For ${currentShopProfile.defaultBusinessName}, today's total sales are ₹${salesAmt.toLocaleString()}, expenses are ₹${expAmt.toLocaleString()}, and profit is ₹${profitAmt.toLocaleString()}.`;

      result = {
        type: 'current_profit_query',
        headline: ui.todaySummaryHeader,
        sales: salesAmt,
        expenses: expAmt,
        profit: profitAmt,
        voiceText: voiceAnswer,
        details: `Profit = Sales (₹${salesAmt.toLocaleString()}) - Expenses (₹${expAmt.toLocaleString()}) = ₹${profitAmt.toLocaleString()}`,
        stallKey: selectedShop
      };
    }

    setParsedResult(result);
    setMicStatus('idle');

    // Automatically speak the answer aloud!
    speakVoiceAnswer(result.voiceText);
  };

  // Start live microphone listening with robust error handling
  const handleToggleRecord = () => {
    if (isRecording) {
      stopMicrophone();
      return;
    }

    // Stop existing speech synthesis if talking
    handleStopSpeaking();
    setErrorMessage('');
    setSavedSuccess(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage(
        activeLang === 'hi'
          ? "इस ब्राउज़र में लाइव माइक्रोफ़ोन समर्थित नहीं है। कृपया नीचे दिए गए 1-टैप प्रश्न बटन का उपयोग करें।"
          : activeLang === 'ta'
          ? "இந்த உலாவியில் மைக்ரோஃபோன் ஆதரிக்கப்படவில்லை. கீழே உள்ள 1-தட்டு கேள்விகளைப் பயன்படுத்தவும்."
          : "Speech recognition is not supported in this browser. Please use the 1-tap sample questions or type your query below."
      );
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Set recognition language dynamically based on active language
      if (activeLang === 'hi') recognition.lang = 'hi-IN';
      else if (activeLang === 'ta') recognition.lang = 'ta-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setMicStatus('listening');
        setSpokenText('');
        spokenTextRef.current = '';
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setSpokenText(transcript);
          spokenTextRef.current = transcript;
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
        setMicStatus('idle');

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorMessage(
            activeLang === 'hi'
              ? "माइक्रोफ़ोन अनुमति अस्वीकृत हो गई। कृपया ब्राउज़र में अनुमति दें या नीचे 1-टैप प्रश्न चुनें।"
              : activeLang === 'ta'
              ? "மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. அனுமதி வழங்கவும் அல்லது கீழே உள்ள கேள்விகளை தட்டவும்."
              : "Microphone permission was denied. Please allow microphone access in your browser address bar, or tap any sample question below."
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage(
            activeLang === 'hi'
              ? "कोई आवाज़ नहीं सुनी गई। कृपया माइक दबाकर साफ़ बोलें, या नीचे 1-टैप प्रश्न चुनें।"
              : activeLang === 'ta'
              ? "குரல் கேட்கவில்லை. மைக் தட்டி பேசவும் அல்லது கீழே உள்ள கேள்விகளை தட்டவும்."
              : "No voice was detected. Please tap the mic and speak clearly, or tap any sample question below."
          );
        } else if (event.error === 'network') {
          setErrorMessage(
            activeLang === 'hi'
              ? "वॉयस नेटवर्क कनेक्शन में समस्या है। आप नीचे दिए गए 1-टैप प्रश्न चुन सकते हैं या आंकड़े लिख सकते हैं।"
              : activeLang === 'ta'
              ? "குரல் நெட்வொர்க் இணைப்பு சிக்கல். கீழே உள்ள 1-தட்டு கேள்விகளை தட்டவும் அல்லது தட்டச்சு செய்யவும்."
              : "Voice network connection issue. You can tap any sample question or type your figures below."
          );
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        setMicStatus('idle');

        // Automatically process query once recording stops
        if (spokenTextRef.current && spokenTextRef.current.trim()) {
          parseAndAnswerQuery(spokenTextRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsRecording(false);
      setMicStatus('idle');
      setErrorMessage("Could not initialize microphone. Please tap any 1-tap question below or type your sales/expenses.");
    }
  };

  // 1-Tap Sample Voice Question Handler (Zero Artificial Latency)
  const handleSelectSample = (sample) => {
    handleStopSpeaking();
    setSpokenText(sample.text);
    spokenTextRef.current = sample.text;
    parseAndAnswerQuery(sample.text);
  };

  // Manual Text Submit
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualText.trim()) return;
    handleStopSpeaking();
    setSpokenText(manualText);
    spokenTextRef.current = manualText;
    parseAndAnswerQuery(manualText);
    setManualText('');
  };

  // Apply parsed action to the shop's actual ledger!
  const handleApplyToLedger = () => {
    if (!parsedResult) return;

    if (parsedResult.type === 'profit_calculation') {
      // Apply stated sales and expenses to selected shop
      if (onAddSales && parsedResult.sales > 0) {
        onAddSales(parsedResult.sales, selectedShop);
      }
      if (onAddExpenses && parsedResult.expenses > 0) {
        onAddExpenses([{
          name: activeLang === 'hi' ? "वॉयस द्वारा दर्ज खर्चा" : activeLang === 'ta' ? "குரல் மூலம் செலவு" : "Voice Calculated Expenses",
          category: "Stock",
          qty: 1,
          unit: "lot",
          amount: parsedResult.expenses
        }], selectedShop);
      }
      setSavedSuccess(true);
    } else if (parsedResult.type === 'add_sale') {
      if (onAddSales && parsedResult.amount > 0) {
        onAddSales(parsedResult.amount, selectedShop);
      }
      setSavedSuccess(true);
    } else if (parsedResult.type === 'add_expense') {
      if (onAddExpenses && parsedResult.item) {
        onAddExpenses([parsedResult.item], selectedShop);
      }
      setSavedSuccess(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl paper-card-elevated rounded-3xl p-4 sm:p-6 text-slate-900 overflow-hidden shadow-2xl bg-white max-h-[92vh] flex flex-col">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER                                                              */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#062E38] to-[#0A3B46] flex items-center justify-center text-emerald-400 shadow-sm shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#062E38] flex items-center gap-2">
                <span>{ui.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold border border-emerald-200">
                  {activeLang === 'hi' ? 'हिन्दी' : activeLang === 'ta' ? 'தமிழ்' : 'English'}
                </span>
              </h2>
              <p className="text-[13px] text-slate-500 font-normal">
                {ui.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PROMINENT LANGUAGE CHANGING BAR (VENDOR HELPER: HINDI • ENGLISH • TAMIL)  */}
        {/* ========================================================================= */}
        <div className="my-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-slate-700 pl-1">
            <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-[12px] font-bold">
              {ui.langBarLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => handleSwitchLang('en')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition flex items-center justify-center gap-1.5 min-h-[38px] ${
                activeLang === 'en'
                  ? 'bg-[#062E38] text-white shadow-sm ring-2 ring-[#062E38]/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>

            <button
              onClick={() => handleSwitchLang('hi')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition flex items-center justify-center gap-1.5 min-h-[38px] ${
                activeLang === 'hi'
                  ? 'bg-orange-600 text-white shadow-sm ring-2 ring-orange-400/30 font-extrabold'
                  : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-950 border border-slate-200'
              }`}
            >
              <span>🇮🇳</span>
              <span>हिन्दी (Hindi)</span>
            </button>

            <button
              onClick={() => handleSwitchLang('ta')}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition flex items-center justify-center gap-1.5 min-h-[38px] ${
                activeLang === 'ta'
                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/30 font-extrabold'
                  : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-950 border border-slate-200'
              }`}
            >
              <span>🌴</span>
              <span>தமிழ் (Tamil)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-1">

          {/* ========================================================================= */}
          {/* CURRENT SHOP LIVE FINANCIAL SNAPSHOT (STRICTLY ISOLATED TO THIS STALL)    */}
          {/* ========================================================================= */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800">
                {currentShopProfile.defaultBusinessName || "Your Stall"}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-500 text-[11px]">{ui.salesLabel}: </span>
                <span className="font-bold text-slate-800">₹{currentShopSales.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px]">{ui.expensesLabel}: </span>
                <span className="font-bold text-rose-700">₹{currentShopExpenses.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300">
                <span className="text-emerald-900 font-bold text-[11px]">{ui.profitLabel}: </span>
                <span className="font-extrabold text-emerald-950 text-sm">₹{currentShopProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BIG INTERACTIVE CENTERPIECE MICROPHONE ACTION BUTTON                      */}
          {/* ========================================================================= */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-emerald-50/30 border border-slate-200 relative overflow-hidden">
            
            {/* Pulsing Recording Ring / Wave */}
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-32 rounded-full bg-rose-400/20 animate-ping" />
              </div>
            )}

            <button
              onClick={handleToggleRecord}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 ${
                isRecording 
                  ? 'bg-rose-600 text-white scale-110 ring-4 ring-rose-200 shadow-rose-300/50' 
                  : 'bg-gradient-to-br from-[#062E38] to-[#0A3B46] hover:bg-[#0A3B46] text-white hover:scale-105 active:scale-95 shadow-teal-900/30'
              }`}
              title={isRecording ? "Tap to stop recording" : "Tap to speak question"}
            >
              {isRecording ? (
                <MicOff className="w-9 h-9" />
              ) : (
                <Mic className="w-9 h-9 text-emerald-400" />
              )}
            </button>

            {/* Status text */}
            <div className="mt-3 text-center">
              <span className="text-[16px] font-bold text-slate-800 block">
                {isRecording 
                  ? ui.listening 
                  : micStatus === 'processing' 
                  ? ui.processing
                  : ui.tapToSpeak}
              </span>
              <span className="text-[13px] text-slate-500 mt-0.5 block">
                "{ui.speakGuidance}"
              </span>
            </div>

            {/* Sound Wave Animation while recording */}
            {isRecording && (
              <div className="flex items-center gap-1.5 mt-3 h-8">
                <span className="w-1.5 bg-rose-600 rounded-full animate-wave-1" />
                <span className="w-1.5 bg-rose-600 rounded-full animate-wave-2" />
                <span className="w-1.5 bg-rose-600 rounded-full animate-wave-3" />
                <span className="w-1.5 bg-rose-600 rounded-full animate-wave-4" />
                <span className="w-1.5 bg-rose-600 rounded-full animate-wave-5" />
              </div>
            )}

            {/* Error banner if mic was blocked or network issue */}
            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[13px] flex items-start gap-2 max-w-md text-left">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* LIVE SPOKEN TRANSCRIPT                                                    */}
          {/* ========================================================================= */}
          {spokenText && (
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-[14px] shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  {ui.whatYouSaid}
                </span>
                {!isRecording && (
                  <button
                    onClick={() => parseAndAnswerQuery(spokenText)}
                    className="text-[12px] font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {ui.recalculate}
                  </button>
                )}
              </div>
              <p className="text-slate-900 font-medium italic">
                "{spokenText}"
              </p>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SMART VOICE ANSWER & PROFIT CALCULATION RESULT CARD                       */}
          {/* ========================================================================= */}
          {parsedResult && (
            <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 text-slate-900 space-y-3 shadow-md animate-fadeIn">
              
              {/* Header with Speak Aloud Audio Control */}
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-emerald-950">
                      {parsedResult.headline}
                    </h3>
                    <p className="text-[11px] text-emerald-800">
                      {currentShopProfile.defaultBusinessName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isSpeaking ? (
                    <button
                      onClick={handleStopSpeaking}
                      className="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-[12px] font-semibold flex items-center gap-1.5 transition"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>{ui.stopVoice}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => speakVoiceAnswer(parsedResult.voiceText)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold flex items-center gap-1.5 transition shadow-xs"
                      title="Listen to answer again"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{ui.hearVoice}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Profit Calculation Equation Box */}
              {parsedResult.type === 'profit_calculation' && (
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-white border border-emerald-200">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-500">{ui.salesLabel}</div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">₹{parsedResult.sales.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-rose-600">{ui.expensesLabel}</div>
                    <div className="text-base sm:text-lg font-bold text-rose-700">-₹{parsedResult.expenses.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-300">
                    <div className="text-[10px] uppercase font-bold text-emerald-900">{ui.profitLabel}</div>
                    <div className="text-base sm:text-lg font-black text-emerald-950">₹{parsedResult.profit.toLocaleString()}</div>
                  </div>
                </div>
              )}

              {/* Current Profit Query Box */}
              {parsedResult.type === 'current_profit_query' && (
                <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-white border border-emerald-200">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-slate-500">{ui.salesLabel}</div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">₹{parsedResult.sales.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="text-[10px] uppercase font-bold text-rose-600">{ui.expensesLabel}</div>
                    <div className="text-base sm:text-lg font-bold text-rose-700">-₹{parsedResult.expenses.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-300">
                    <div className="text-[10px] uppercase font-bold text-emerald-900">{ui.profitLabel}</div>
                    <div className="text-base sm:text-lg font-black text-emerald-950">₹{parsedResult.profit.toLocaleString()}</div>
                  </div>
                </div>
              )}

              {/* Spoken Voice Answer Text */}
              <div className="p-3 rounded-2xl bg-white/90 border border-emerald-200 text-[14px] text-slate-800 flex items-start gap-2.5">
                <Volume2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">
                  "{parsedResult.voiceText}"
                </p>
              </div>

              {/* 1-Tap Ledger Action */}
              <div className="pt-1 flex items-center justify-between gap-3">
                <span className="text-[12px] text-emerald-900 font-medium">
                  {savedSuccess ? `✓ ${ui.savedToLedger}` : ui.askConfirm}
                </span>

                {savedSuccess ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-[13px] font-bold shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{ui.savedToLedger}</span>
                  </span>
                ) : (
                  <button
                    onClick={handleApplyToLedger}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062E38] hover:bg-[#0A3B46] text-white text-[13px] font-semibold transition active:scale-95 shadow-sm"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>{ui.updateLedgerBtn}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1-TAP SAMPLE QUESTIONS TAILORED FOR THIS SHOP IN CHOSEN LANGUAGE          */}
          {/* ========================================================================= */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {ui.sampleQuestionsHeader} {currentShopProfile.defaultBusinessName}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {currentSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="text-left p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 transition group shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-bold text-slate-800 group-hover:text-emerald-900 flex items-center gap-2">
                      <span>{sample.tag}</span>
                    </span>
                    <span className="text-[12px] font-semibold text-emerald-700 group-hover:underline flex items-center gap-1">
                      <span>{ui.hearVoice}</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-600 italic">
                    "{sample.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MANUAL TEXT QUESTION FALLBACK (ALWAYS RELIABLE)                           */}
          {/* ========================================================================= */}
          <form onSubmit={handleManualSubmit} className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {activeLang === 'hi' 
                ? "या सीधे लिखकर पूछें (यदि माइक्रोफ़ोन काम न करे):" 
                : activeLang === 'ta'
                ? "அல்லது நேரடியாக தட்டச்சு செய்து கேட்கவும்:"
                : "Or type figures directly if microphone is busy:"}
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={ui.orTypePlaceholder}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
              <button
                type="submit"
                disabled={!manualText.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#062E38] hover:bg-[#0A3B46] disabled:opacity-50 text-white text-[13px] font-semibold transition"
              >
                {ui.askVoiceBtn}
              </button>
            </div>
          </form>

        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            {ui.formulaNote}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            {ui.doneBtn}
          </button>
        </div>

      </div>
    </div>
  );
}
