import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Scale, 
  Check, 
  Coffee, 
  ShoppingBag,
  Flame,
  Store,
  Flower,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function MarginOptimizer({ categoryKey = 'produce', categoryProfile, currentLang = 'en' }) {
  const [selectedStallKey, setSelectedStallKey] = useState(categoryKey || 'produce');
  const [activeStrategyKey, setActiveStrategyKey] = useState('strategy1');

  // Keep selected stall in sync when parent passes a new stall
  useEffect(() => {
    if (categoryKey && SHOP_OPTIMIZERS[categoryKey]) {
      setSelectedStallKey(categoryKey);
    }
  }, [categoryKey]);

  // Comprehensive shop-specific strategies for each of the 5 stalls in 3 languages
  const SHOP_OPTIMIZERS = {
    produce: {
      alertBadge: currentLang === 'hi' 
        ? "मंडी अलर्ट: टमाटर व प्याज थोक दर में तेजी (+22%)"
        : currentLang === 'ta'
        ? "மண்டி எச்சரிக்கை: தக்காளி & வெங்காய விலை உயர்வு (+22%)"
        : "Mandi Alert: Tomato & Onion Wholesale Surge (+22%)",
      icon: ShoppingBag,
      stallTag: currentLang === 'hi' ? "फल व ताज़ा सब्ज़ी" : currentLang === 'ta' ? "பழங்கள் & காய்கறிகள்" : "Fruits & Fresh Vegetables",
      strategies: {
        strategy1: {
          title: currentLang === 'hi' ? "1. सब्ज़ी बास्केट कॉम्बो" : currentLang === 'ta' ? "1. காம்போ கூடை" : "1. Basket Pairing",
          shortDesc: currentLang === 'hi' 
            ? "आलू-प्याज के साथ हरी मिर्च-धनिया का कॉम्बो बनाएं।" 
            : currentLang === 'ta'
            ? "உருளை-வெங்காயத்துடன் மிளகாய்-கொத்தமல்லி காம்போ."
            : "Pair staples with high-margin Green Chilli & Coriander pack.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: 'दैनिक सब्ज़ी बास्केट + मुफ़्त तड़का पैक' @ ₹95"
            : currentLang === 'ta'
            ? "பரிந்துரை: 'தினசரி காய்கறி கூடை + தாளிப்பு பேக்' @ ₹95"
            : 'Recommended: "Daily Veggie Basket + Tadka Pouch" @ ₹95',
          profitImpact: "38% Margin (+₹28/Basket)",
          details: currentLang === 'hi'
            ? "अकेले टमाटर का मंडी भाव ₹34/किलो तक बढ़ गया है (मुनाफ़ा केवल ₹6)। 1 किलो आलू + 1 किलो प्याज + 1 किलो टमाटर के साथ ₹15 का 'हरी मिर्च, धनिया व अदरक तड़का पैक' मिलाकर ₹95 का कॉम्बो बास्केट बेचें। ग्राहक को मुफ़्त तड़के का अहसास होगा और आपकी प्रति बास्केट कमाई ₹28 (38% शुद्ध मुनाफ़ा) हो जाएगी!"
            : currentLang === 'ta'
            ? "தக்காளி கொள்முதல் விலை கிலோ ₹34 ஆக உயர்ந்துள்ளது (லாபம் ₹6 மட்டுமே). 1 கிலோ உருளை + 1 கிலோ வெங்காயம் + 1 கிலோ தக்காளி உடன் ₹15 மதிப்புள்ள 'பச்சை மிளகாய், கொத்தமல்லி தாளிப்பு பேக்' சேர்த்து ₹95-க்கு விற்கவும். வாடிக்கையாளருக்கு இலவச தாளிப்பு திருப்தி கிடைக்கும், உங்களுக்கு கூடைக்கு ₹28 லாபம் (38% நிகர லாபம்) உயரும்!"
            : "Standalone tomato wholesale jumped to ₹34/kg (yielding only ₹6 profit). By bundling 1kg Potatoes + 1kg Onions + 1kg Tomatoes with a ₹15 'Green Chilli, Ginger & Coriander Tadka Pouch' for ₹95, shoppers perceive high value while your cart profit rises to ₹28 net cash per customer (38% margin)!"
        },
        strategy2: {
          title: currentLang === 'hi' ? "2. शाम की वेस्टेज क्लीयरेंस" : currentLang === 'ta' ? "2. அழுகல் கழிவு தவிர்" : "2. Rot & Spoilage Defense",
          shortDesc: currentLang === 'hi' 
            ? "शाम 7:00 बजे पके माल को फेंकने के बजाय आधे दाम पर निकालें।" 
            : currentLang === 'ta'
            ? "மாலை 7 மணிக்கு பழுத்த பொருட்களை தள்ளுபடி விலையில் விற்கவும்."
            : "Liquidate soft produce at 7 PM for dining mess buyers.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: शाम का 'क्लीयरेंस बास्केट' सड़न नुकसान 80% कम करेगा"
            : currentLang === 'ta'
            ? "பரிந்துரை: மாலை 'தள்ளுபடி கூடை' அழுகல் நஷ்டத்தை 80% குறைக்கும்"
            : 'Recommended: Evening 7 PM "Clearance Basket" Cuts Rot by 80%',
          profitImpact: "Recovers ₹4,200/Month",
          details: currentLang === 'hi'
            ? "सब्ज़ी के ठेले पर औसतन ₹140 का माल रोज़ाना गलकर खराब होता है। शाम 7:00 बजे पके हुए टमाटर और केले को फेंकने के बजाय ₹15/किलो में ढाबों या मेस वालों को बेचें। इससे सड़न का नुकसान रुककर महीने का ₹4,200 सीधा नकद बचता है!"
            : currentLang === 'ta'
            ? "காய்கறி கடைகளில் தினமும் சுமார் ₹140 மதிப்புள்ள தக்காளி மற்றும் பழங்கள் அழுகி வீணாகிறது. மாலை 7 மணிக்கு பழுத்த பொருட்களை தூக்கி எறியாமல் கிலோ ₹15-க்கு உணவகங்களுக்கு விற்கவும். இது அழுகல் நஷ்டத்தை தடுத்து மாதத்திற்கு ₹4,200 ரொக்க லாபம் தரும்!"
            : "The average vegetable cart loses ₹140 daily to overripe tomatoes, soft bananas, and wilting greens. Liquidating ripe produce at 7 PM for ₹15-20/kg to local dhabas and mess buyers recovers your wholesale cost and puts ₹4,200 back in your monthly take-home drawer!"
        },
        strategy3: {
          title: currentLang === 'hi' ? "3. सीधे 25kg क्रेट नीलामी" : currentLang === 'ta' ? "3. 25kg கூடை கொள்முதல்" : "3. Direct 25kg Crate Buy",
          shortDesc: currentLang === 'hi' 
            ? "बिचौलियों से नहीं, सीधे आज़ादपुर मंडी से 25kg क्रेट खरीदें।" 
            : currentLang === 'ta'
            ? "இடைத்தரகரை தவிர்த்து, மண்டியில் 25kg கூடை நேரடி ஏலம்."
            : "Bypass middlemen; buy 25kg wooden crates at Mandi auction.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: मंडी नीलामी से क्रेट खरीदकर ₹150 प्रति क्रेट बचाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: மண்டி நேரடி கொள்முதலில் கூடைக்கு ₹150 மிச்சம்"
            : 'Recommended: APMC Mandi Auction Direct Crate Sourcing',
          profitImpact: "Saves ₹150/Crate",
          details: currentLang === 'hi'
            ? "लोकल सप्लायर खुली बोरी में ₹34/किलो चार्ज करते हैं। सुबह 5:30 बजे APMC मंडी नीलामी से सीधे 25kg लकड़ी का क्रेट ₹28/किलो में मिलता है। केवल टमाटर के एक क्रेट पर ₹150 (महीने का ₹4,500) की सीधी बचत होगी!"
            : currentLang === 'ta'
            ? "உள்ளூர் இடைத்தரகர்கள் கிலோ ₹34 என விற்கிறார்கள். காலை 5:30 மணிக்கு APMC மண்டி ஏலத்தில் நேரடியாக 25kg கூடை வாங்கினால் கிலோ ₹28 மட்டுமே. ஒரு கூடைக்கு ₹150 (மாதம் ₹4,500) மிச்சமாகும்!"
            : "Local sub-wholesalers charge ₹34/kg in loose sacks. Buying standard 25kg wooden crates directly at the 5:30 AM APMC mandi auction costs ₹28/kg modal rate. Saves ₹150 on every single crate (over ₹4,500 monthly) on tomato stock alone!"
        }
      }
    },

    street_food: {
      alertBadge: currentLang === 'hi' 
        ? "सामग्री अलर्ट: रिफाइंड तेल व मैदा दर में तेजी (+18%)"
        : currentLang === 'ta'
        ? "பொருட்கள் எச்சரிக்கை: சமையல் எண்ணெய் & மைதா விலை உயர்வு (+18%)"
        : "Ingredient Alert: Refined Oil & Maida Spike (+18%)",
      icon: Flame,
      stallTag: currentLang === 'hi' ? "स्ट्रीट फ़ूड व चाट" : currentLang === 'ta' ? "சாட் & சமோசா கடை" : "Street Food & Chaat Stall",
      strategies: {
        strategy1: {
          title: currentLang === 'hi' ? "1. समोसा + चाय कॉम्बो" : currentLang === 'ta' ? "1. சமோசா + டீ காம்போ" : "1. Samosa + Chai Combo",
          shortDesc: currentLang === 'hi' 
            ? "समोसे के साथ हाई-मार्जिन कटिंग चाय (82% मार्जिन) जोड़ें।" 
            : currentLang === 'ta'
            ? "சமோசாவுடன் அதிக லாபம் தரும் டீ (82% லாபம்) இணையுங்கள்."
            : "Pair Samosa with High-Margin Cutting Chai (82% margin).",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: 'समोसा + चाय' सुबह का कॉम्बो @ ₹25"
            : currentLang === 'ta'
            ? "பரிந்துரை: 'சமோசா + டீ' காலை காம்போ @ ₹25"
            : 'Recommended: "Samosa + Chai" Morning Breakfast Combo @ ₹25',
          profitImpact: "54.4% Combined Margin",
          details: currentLang === 'hi'
            ? "रिफाइंड तेल महंगा होने से समोसे की लागत ₹9.20 हो गई (मुनाफ़ा केवल ₹5.80)। चाय की लागत मात्र ₹2.20 है और बिकती ₹10 में है (₹7.80 मुनाफा)। दोनों को ₹25 में साथ बेचने पर कंबाइंड मार्जिन 54.4% (₹13.60 शुद्ध नकद) हो जाता है, जो तेल की महंगाई से स्टॉल को पूरी सुरक्षा देता है!"
            : currentLang === 'ta'
            ? "எண்ணெய் விலை உயர்வால் சமோசா தயாரிப்பு செலவு ₹9.20 ஆனது (லாபம் ₹5.80 மட்டுமே). டீ தயாரிக்க ₹2.20 செலவாகி ₹10-க்கு விற்கிறது (₹7.80 லாபம்). இரண்டையும் சேர்த்து ₹25-க்கு விற்கும்போது மொத்த லாபம் 54.4% (₹13.60 நிகர ரொக்கம்) உயர்ந்து எண்ணெய் விலை உயர்வை ஈடுகட்டும்!"
            : "Standalone Samosa cost jumped to ₹9.20 (yielding only ₹5.80 profit). Cutting Chai costs ₹2.20 to brew and sells for ₹10 (₹7.80 profit). Sold together for ₹25, your combined margin reaches 54.4% (₹13.60 take-home cash), completely shielding your stall from the edible oil rally!"
        },
        strategy2: {
          title: currentLang === 'hi' ? "2. 175°C तेल तापमान व चटनी माप" : currentLang === 'ta' ? "2. 175°C எண்ணெய் சூடு & அளவு" : "2. Temperature & Portion Sizing",
          shortDesc: currentLang === 'hi' 
            ? "175°C पर तलने से 12% तेल कम सोखता है, 40ml चटनी मापें।" 
            : currentLang === 'ta'
            ? "175°C-ல் பொரித்தால் 12% எண்ணெய் மிச்சம், 40ml சட்னி கரண்டி."
            : "Fry at 175°C to cut oil soak; standardize 40ml chutney ladle.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: 175°C तापमान और 40ml चटनी चम्मच से ₹110 रोज़ बचाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: 175°C சூடு மற்றும் 40ml சட்னி கரண்டியால் தினமும் ₹110 மிச்சம்"
            : 'Recommended: Calibrated 175°C Frying & 40ml Chutney Ladle',
          profitImpact: "Saves ₹110 Daily",
          details: currentLang === 'hi'
            ? "ठंडी कढ़ाई (160°C से कम) में समोसा 12% अधिक तेल सोख लेता है। तेल का तापमान ठीक 175°C रखने और सोंठ/हरी चटनी के लिए 40ml का स्टैंडर्ड चम्मच इस्तेमाल करने से रोज़ाना ₹110 की सीधी बचत होती है और स्वाद भी एक समान रहता है।"
            : currentLang === 'ta'
            ? "குறைந்த சூட்டில் (160°C-க்கு கீழ்) சமோசா 12% கூடுதல் எண்ணெயை உறிஞ்சும். 175°C சரியான சூட்டில் பொரிப்பதன் மூலமும், சட்னிக்கு 40ml நிலையான கரண்டியை பயன்படுத்துவதன் மூலமும் தரத்தை குறைக்காமல் தினமும் ₹110 மிச்சப்படுத்தலாம்."
            : "Frying below 160°C causes samosa crust to soak 12% more oil. Keeping frying temperature strictly at 175°C and using standardized 40ml portion scoops for saunth chutney saves ₹110 daily without customers noticing any drop in taste."
        },
        strategy3: {
          title: currentLang === 'hi' ? "3. 15L थोक टिन ग्रुप खरीद" : currentLang === 'ta' ? "3. 15L மொத்த டின் கூட்டு கொள்முதல்" : "3. 15L Commercial Tin Bulk Buy",
          shortDesc: currentLang === 'hi' 
            ? "1L पाउच के बजाय 15L कमर्शियल टिन खरीदकर ₹5,400 बचाएं।" 
            : currentLang === 'ta'
            ? "1L பாக்கெட்டுகளை தவிர்த்து 15L மொத்த டின் வாங்கி ₹5,400 மிச்சம்."
            : "Switch from 1L grocery pouches to 15L wholesale commercial tin.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: पास के स्टॉल के साथ 15L टिन शेयर कर थोक रेट पाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: பக்கத்து கடையுடன் 15L டின் பகிர்ந்து மொத்த விலை பெறுங்கள்"
            : 'Recommended: Wholesale Commercial Tin Sourcing',
          profitImpact: "Saves ₹5,400/Year",
          details: currentLang === 'hi'
            ? "किराना दुकान से 1L पाउच ₹130/लीटर (5 लीटर = ₹650) में मिलता है। थोक में 15L टिन ₹1,770 (₹118/लीटर) में आता है। पड़ोस के स्टॉल के साथ मिलकर 3 दिन में एक टिन बांटने से साल का ₹5,400 सीधे बचता है।"
            : currentLang === 'ta'
            ? "1L பாக்கெட் லிட்டருக்கு ₹130 (5L = ₹650). 15L மொத்த டின் ₹1,770 (லிட்டருக்கு ₹118). பக்கத்து கடைக்காரருடன் சேர்ந்து 3 நாட்களுக்கு ஒரு டின் வாங்கினால் ஆண்டுக்கு ₹5,400 மிச்சமாகும்."
            : "Buying 1L retail pouches costs ₹130/L. A 15L wholesale commercial tin costs ₹1,770 (₹118/L). Partnering with an adjacent cart vendor to split tins saves your stall ₹5,400 annually."
        }
      }
    },

    chai_tea: {
      alertBadge: currentLang === 'hi' 
        ? "डेयरी अलर्ट: भैंस का दूध व छोटी इलायची दर में उछाल (+15%)"
        : currentLang === 'ta'
        ? "பால் எச்சரிக்கை: எருமைப் பால் & ஏலக்காய் விலை உயர்வு (+15%)"
        : "Dairy Alert: Buffalo Milk & Cardamom Surge (+15%)",
      icon: Coffee,
      stallTag: currentLang === 'hi' ? "चाय व नाश्ता कॉर्नर" : currentLang === 'ta' ? "டீ & சிற்றுண்டி கடை" : "Chai & Snacks Corner",
      strategies: {
        strategy1: {
          title: currentLang === 'hi' ? "1. कुल्हड़ चाय + बन मस्का" : currentLang === 'ta' ? "1. குல்ஹத் டீ + பன் மஸ்கா" : "1. Kulhad Chai + Bun Maska",
          shortDesc: currentLang === 'hi' 
            ? "चाय के साथ ताज़ा बन मस्का या उस्मानिया बिस्कुट का कॉम्बो।" 
            : currentLang === 'ta'
            ? "டீயுடன் பன் மஸ்கா அல்லது பிஸ்கட் காம்போ இணையுங்கள்."
            : "Bundle Special Kulhad Chai with Bun Maska or Osmania Biscuits.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: 'स्पेशल कुल्हड़ चाय + बन मस्का' सुबह का कॉम्बो @ ₹30"
            : currentLang === 'ta'
            ? "பரிந்துரை: 'ஸ்பெஷல் டீ + பன் மஸ்கா' காலை காம்போ @ ₹30"
            : 'Recommended: "Special Kulhad Chai + Bun Maska" Combo @ ₹30',
          profitImpact: "62% Margin (+₹18.70 Profit)",
          details: currentLang === 'hi'
            ? "कुल्हड़ चाय ₹15 में बिकती है और ₹6.80 लागत आती है (मुनाफ़ा ₹8.20)। साथ में ₹15 का बन मस्का (लागत ₹4.50) जोड़ने पर कुल बिक्री ₹30 और कुल मुनाफ़ा ₹18.70 (62% मार्जिन) हो जाता है! सुबह का औसत ग्राहक बिल दोगुना हो जाता है।"
            : currentLang === 'ta'
            ? "குல்ஹத் டீ ₹15-க்கு விற்று ₹6.80 செலவாகிறது (லாபம் ₹8.20). இதனுடன் ₹15 பன் மஸ்கா (செலவு ₹4.50) இணைக்கும்போது மொத்த விற்பனை ₹30, நிகர லாபம் ₹18.70 (62% லாபம்) ஆக உயரும்!"
            : "Kulhad Chai sells for ₹15 with a ₹6.80 cost (₹8.20 profit). Adding a ₹15 Bun Maska (cost ₹4.50) brings total sale to ₹30 and total profit to ₹18.70 (62% margin). Doubles average ticket size during morning rush hours!"
        },
        strategy2: {
          title: currentLang === 'hi' ? "2. पानी में इलायची का काढ़ा" : currentLang === 'ta' ? "2. தண்ணீரில் ஏலக்காய் சாறு" : "2. Water-Phase Spice Extraction",
          shortDesc: currentLang === 'hi' 
            ? "उबलते पानी में इलायची कूटकर डालें, 25% इलायची बचेगी।" 
            : currentLang === 'ta'
            ? "கொதிக்கும் நீரில் ஏலக்காய் கொதிக்க வைத்தால் 25% மிச்சம்."
            : "Crush cardamom in boiling water first to extract maximum aroma.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: पानी में मसाले उबालने से 25% इलायची की बचत (₹65 रोज़)"
            : currentLang === 'ta'
            ? "பரிந்துரை: தண்ணீரில் மசாலா கொதிக்க வைப்பதால் 25% ஏலக்காய் மிச்சம்"
            : 'Recommended: Water-Phase Extraction Saves 25% Cardamom',
          profitImpact: "Saves ₹65 Daily",
          details: currentLang === 'hi'
            ? "दूध में सीधे इलायची पाउडर डालने से उसकी सुगंध दूध की मलाई में फँस जाती है। पानी के उबलने के दौरान कुटी हुई इलायची और अदरक डालने से 35% अधिक महक आती है और 25% कम इलायची लगती है, जिससे रोज़ाना ₹65 बचते हैं।"
            : currentLang === 'ta'
            ? "பாலில் நேரடியாக ஏலக்காய் போடுவதால் நறுமணம் வீணாகிறது. தண்ணீரில் இஞ்சி மற்றும் ஏலக்காயை கொதிக்க வைத்து சாறு எடுக்கும்போது 35% கூடுதல் நறுமணம் கிடைப்பதுடன் 25% ஏலக்காய் மிச்சமாகி தினமும் ₹65 சேமிக்கலாம்."
            : "Adding cardamom directly to milk traps essential oils in butterfat. Boiling crushed cardamom and ginger in rolling water first extracts 35% more aroma with 25% fewer pods, saving ₹65 daily on expensive green elaichi."
        },
        strategy3: {
          title: currentLang === 'hi' ? "3. डेयरी फार्म से 20L दूध केन" : currentLang === 'ta' ? "3. பண்ணை நேரடி 20L பால் கேன்" : "3. Direct Dairy Farm Cans",
          shortDesc: currentLang === 'hi' 
            ? "पैकेट दूध ₹66 के बजाय डेयरी केन से ₹52/L में लें।" 
            : currentLang === 'ta'
            ? "பாக்கெட் பால் ₹66-க்கு பதில் நேரடி கேன் பாலில் லிட்டருக்கு ₹52."
            : "Source 20L unbranded buffalo milk cans directly from dairy farm.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: डेयरी केन दूध से ₹280 प्रतिदिन का सीधा मुनाफ़ा बढ़ाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: நேரடி பண்ணை கேன் பாலில் தினமும் ₹280 கூடுதல் லாபம்"
            : 'Recommended: Direct Dairy Farm Supply @ ₹52/L',
          profitImpact: "Adds ₹280 Daily Profit",
          details: currentLang === 'hi'
            ? "ब्रांडेड पैकेट दूध ₹66/लीटर मिलता है। शहर के पास डेयरी फार्म से 20 लीटर ताज़ा भैंस का दूध केन में ₹52/लीटर के हिसाब से लेने पर प्रतिदिन ₹280 का शुद्ध मुनाफ़ा सीधे आपके गल्ले में जुड़ता है।"
            : currentLang === 'ta'
            ? "பாக்கெட் பால் லிட்டர் ₹66. பண்ணையிலிருந்து நேரடியாக 20L கேனில் லிட்டர் ₹52-க்கு வாங்கினால் தினசரி ₹280 கூடுதல் லாபம் உங்கள் கல்லாவில் சேரும்."
            : "Branded milk pouches retail at ₹66/L. Sourcing fresh 20L buffalo milk cans directly from peri-urban dairy farms costs ₹52/L, immediately adding ₹280 daily profit directly to your morning register."
        }
      }
    },

    kirana: {
      alertBadge: currentLang === 'hi' 
        ? "FMCG अलर्ट: आटा व दाल के ब्रांडेड पैकेट में मार्जिन घटा (+12%)"
        : currentLang === 'ta'
        ? "மளிகை எச்சரிக்கை: பாக்கெட் பிராண்டுகளில் லாப வரம்பு குறைந்தது (+12%)"
        : "FMCG Alert: Branded Staples Margin Squeeze (+12%)",
      icon: Store,
      stallTag: currentLang === 'hi' ? "माइक्रो किराना व जनरल स्टोर" : currentLang === 'ta' ? "மளிகை & பொது அங்காடி" : "Micro Kirana & Kiosk Grocery",
      strategies: {
        strategy1: {
          title: currentLang === 'hi' ? "1. मासिक राशन किट कॉम्बो" : currentLang === 'ta' ? "1. மாத குடும்ப மளிகை பேக்" : "1. Monthly Ration Basket",
          shortDesc: currentLang === 'hi' 
            ? "5kg आटा + 1kg दाल + 1L तेल के साथ मुफ़्त 100g नमक।" 
            : currentLang === 'ta'
            ? "5kg மாவு + 1kg பருப்பு + 1L எண்ணெய் காம்போ."
            : "Bundle 5kg Flour + 1kg Pulses + 1L Oil with free salt.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: 'रसोई समाधान' राशन किट से ₹92 प्रति ग्राहक कमाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: 'சமையல் காம்போ' பேக்கில் வாடிக்கையாளருக்கு ₹92 லாபம்"
            : 'Recommended: "Complete Kitchen Essentials" Basket @ ₹480',
          profitImpact: "₹92 Pure Profit / Kit",
          details: currentLang === 'hi'
            ? "मॉल और सुपरमार्केट केवल पैकेट पर डिस्काउंट देते हैं। आप चक्की का ताज़ा आटा + अरहर दाल + सरसों तेल को ₹10 के मुफ़्त नमक के साथ ₹480 में दें। ग्राहक सुपरमार्केट छोड़ आपके पास आएंगे और आपको प्रति किट ₹92 का शुद्ध मुनाफ़ा मिलेगा!"
            : currentLang === 'ta'
            ? "சூப்பர் மார்க்கெட்டுகள் பாக்கெட்டுகளுக்கு மட்டுமே தள்ளுபடி தரும். நீங்கள் பிரெஷ் சக்கி மாவு + துவரம் பருப்பு + நல்லெண்ணெய் உடன் ₹10 உப்பு இலவசமாக ₹480-க்கு கொடுத்தால் வாடிக்கையாளர் நிரந்தரமாவார். கிட்டுக்கு ₹92 லாபம் கிடைக்கும்!"
            : "Supermarkets discount branded flour, but you win on convenience and freshness. Bundling local Chakki Fresh Atta with Toor Dal and Mustard Oil with a free ₹10 Tata Salt brings in ₹92 pure profit per kit while keeping colony families loyal!"
        },
        strategy2: {
          title: currentLang === 'hi' ? "2. काउंटर पर खुले खड़े मसाले" : currentLang === 'ta' ? "2. கவுண்டரில் மொத்த மசாலா" : "2. Counter-Level High-Margin Spices",
          shortDesc: currentLang === 'hi' 
            ? "साबुन को नीचे रखें, 35% मार्जिन वाले खड़े मसाले ऊपर काउंटर पर रखें।" 
            : currentLang === 'ta'
            ? "சோப்பை கீழே வைத்து 35% லாபம் தரும் மசாலாவை மேலே வையுங்கள்."
            : "Place 35% margin loose whole spices at eye-level counter.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: बिलिंग काउंटर पर खड़े मसाले व टॉफ़ी से 35% मार्जिन"
            : currentLang === 'ta'
            ? "பரிந்துரை: பில்லிங் கவுண்டரில் மசாலா பாக்கெட்டுகளால் 35% லாபம்"
            : 'Recommended: Eye-Level Placement for 35% Margin Spices',
          profitImpact: "35% Spices Margin",
          details: currentLang === 'hi'
            ? "ब्रांडेड साबुन और सर्फ पर केवल 5-8% मार्जिन मिलता है। उन्हें नीचे की रैक में रखें। बिलिंग काउंटर के पास जीरा, लौंग, दालचीनी और 50g गरम मसाले के छोटे पाउच (35-45% मार्जिन) रखें जो तुरंत बिकते हैं।"
            : currentLang === 'ta'
            ? "பிராண்டட் சோப்புகளில் 5-8% லாபமே கிடைக்கும். அவற்றை கீழ்த்தட்டில் வையுங்கள். பில்லிங் கவுண்டர் அருகில் சீரகம், கிராம்பு, பட்டை மற்றும் 50g கரம் மசாலா பாக்கெட்டுகளை (35-45% லாபம்) வைத்தால் உடனடி விற்பனை அதிகரிக்கும்."
            : "Branded soaps and detergents yield only a 5-8% margin. Move them to lower racks. Place high-margin loose spices (jeera, cloves, garam masala pouches @ 35% margin) right on the counter to capture quick impulse basket additions."
        },
        strategy3: {
          title: currentLang === 'hi' ? "3. 50kg बोरी से डायरेक्ट पैकिंग" : currentLang === 'ta' ? "3. 50kg நேரடி மூட்டை கொள்முதல்" : "3. 50kg Wholesale Bori Direct",
          shortDesc: currentLang === 'hi' 
            ? "1kg ब्रांडेड पैकेट छोड़ सीधे 50kg कट्टे से 26% मार्जिन पाएं।" 
            : currentLang === 'ta'
            ? "1kg பாக்கெட்டுகளுக்கு பதில் 50kg மூட்டை வாங்கி 26% லாபம்."
            : "Buy 50kg unbranded sacks directly from wholesale grain mandis.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: अनाज मंडी से 50kg कट्टा खरीदकर ₹1,500 प्रति बोरी बचाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: மண்டி 50kg மூட்டையில் மூட்டைக்கு ₹1,500 கூடுதல் லாபம்"
            : 'Recommended: Direct Grain Mandi 50kg Sack Sourcing',
          profitImpact: "Increases Margin 8% → 26%",
          details: currentLang === 'hi'
            ? "1kg का ब्रांडेड पैकेट दाल ₹142/किलो में आता है। खारी बावली / गल्ला मंडी से 50kg की थोक बोरी ₹112/किलो में मिलती है। दुकान में पारदर्शी 1kg थैली में पैक करने से दाल का मार्जिन 8% से बढ़कर 26% हो जाता है (प्रति बोरी ₹1,500 की बचत)!"
            : currentLang === 'ta'
            ? "1kg பாக்கெட் பருப்பு ₹142. மொத்த தானிய மண்டியில் 50kg மூட்டை வாங்கினால் கிலோ ₹112 மட்டுமே. கடையில் 1kg பைகளில் பேக் செய்து விற்றால் பருப்பு லாபம் 8%-லிருந்து 26% ஆக உயர்ந்து மூட்டைக்கு ₹1,500 லாபம் தரும்!"
            : "1kg pre-packaged branded pulses cost ₹142/kg. Buying a 50kg wholesale bori directly from grain mandis costs ₹112/kg. Packing in transparent 1kg bags in-store increases your pulse margin from 8% to 26%, earning ₹1,500 extra per sack!"
        }
      }
    },

    flowers: {
      alertBadge: currentLang === 'hi' 
        ? "त्योहार अलर्ट: गेंदा व गुलाब के थोक भाव में उछाल (+30%)"
        : currentLang === 'ta'
        ? "பண்டிகை எச்சரிக்கை: சாமந்தி & ரோஜா மொத்த விலை உயர்வு (+30%)"
        : "Festival Alert: Marigold & Rose Auction Spike (+30%)",
      icon: Flower,
      stallTag: currentLang === 'hi' ? "फूल व पूजा सामग्री स्टॉल" : currentLang === 'ta' ? "பூ & பூஜை பொருட்கள் கடை" : "Flower & Pooja Essentials Stall",
      strategies: {
        strategy1: {
          title: currentLang === 'hi' ? "1. मंदिर पूजा किट कॉम्बो" : currentLang === 'ta' ? "1. கோவில் பூஜை தட்டு காம்போ" : "1. Mandir Darshan Kit",
          shortDesc: currentLang === 'hi' 
            ? "माला के साथ 2 कपूर, 5 अगरबत्ती और रोली का ₹40 किट बनाएं।" 
            : currentLang === 'ta'
            ? "மாலையுடன் கற்பூரம், ஊதுபத்தி, குங்குமம் சேர்த்து ₹40 பேக்."
            : "Bundle Garland with Camphor, Incense & Roli Chandan for ₹40.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: 'दैनिक मंदिर दर्शन किट' से ₹22 प्रति किट कमाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: 'கோவில் பூஜை கிட்' மூலம் கிட்டுக்கு ₹22 லாபம்"
            : 'Recommended: "Complete Mandir Pooja Kit" @ ₹40',
          profitImpact: "55% Margin (+₹22/Kit)",
          details: currentLang === 'hi'
            ? "अकेली गेंदे की माला बेचने पर सिर्फ ₹8 का मुनाफा होता है। माला के साथ 2 कपूर की टिक्की, 5 अगरबत्ती और रोली-चंदन का ₹40 का रेडीमेड किट बनाएं। इस पर ₹22 का शुद्ध मुनाफा (55% मार्जिन) होता है और भक्त बिना दो बार लाइन में लगे तुरंत खरीद लेते हैं!"
            : currentLang === 'ta'
            ? "தனி மாலை விற்றால் ₹8 மட்டுமே லாபம். மாலையுடன் 2 கற்பூரம், 5 ஊதுபத்தி மற்றும் குங்குமம் சேர்த்து ₹40-க்கு ரெடிமேட் பூஜை கிட் கொடுங்கள். இதில் ₹22 நிகர லாபம் (55% லாபம்) கிடைக்கும். பக்தர்கள் காத்திருக்காமல் உடனே வாங்குவர்!"
            : "Selling a single marigold garland yields just ₹8 profit. Combining it with 2 camphor tablets, 5 incense sticks, and roli-chandan for a ₹40 ready-made Mandir kit generates ₹22 profit (55% margin). Devotees prefer taking the ready kit without queuing twice!"
        },
        strategy2: {
          title: currentLang === 'hi' ? "2. गीली बोरी शेडिंग (मुरझाने से बचाव)" : currentLang === 'ta' ? "2. ஈர சாக்கு குளிர்ச்சி (வாடல் தவிர்)" : "2. Moisture Wilt Defense",
          shortDesc: currentLang === 'hi' 
            ? "गीली टाट की बोरी में रखने से फूल 6 घंटे अधिक ताज़ा रहेंगे।" 
            : currentLang === 'ta'
            ? "ஈர சணல் சாக்கில் வைத்தால் பூக்கள் 6 மணிநேரம் வாடாது."
            : "Wet jute hessian sacks prevent delicate petals from drying out.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: गीली बोरी नमी से ₹4,800 प्रति माह की फूलों की बर्बादी रोकें"
            : currentLang === 'ta'
            ? "பரிந்துரை: ஈர சாக்கு குளிர்ச்சியால் மாதம் ₹4,800 பூ வீணாவதை தவிர்"
            : 'Recommended: Jute Mist Cooling Extends Petals by 6 Hours',
          profitImpact: "Saves ₹4,800/Month",
          details: currentLang === 'hi'
            ? "दोपहर की धूप में गेंदा और मोगरा सूखकर काला पड़ जाता है, जिससे रोज़ ₹160 के फूल फेंकने पड़ते हैं। स्टॉक को भीगी टाट की बोरी में लपेटकर और ठंडे पानी का छिड़काव करने से फूल शाम तक ताज़ा रहते हैं और महीने का ₹4,800 का नुकसान बचता है!"
            : currentLang === 'ta'
            ? "மதிய வெயிலில் சாமந்தி மற்றும் மல்லிகை காய்ந்து போவதால் தினமும் ₹160 மதிப்புள்ள பூக்கள் வீணாகிறது. பூக்களை ஈர சணல் துணியில் சுற்றி லேசாக தண்ணீர் தெளித்து வைத்தால் மாலை வரை வாடாமல் இருந்து மாதம் ₹4,800 சேமிக்கலாம்!"
            : "Afternoon heat causes marigold and jasmine petals to brown, destroying up to ₹160 in stock daily. Wrapping stock in damp jute cloth and misting cold water extends freshness by 6 hours, saving ₹4,800 monthly in wilt write-offs!"
        },
        strategy3: {
          title: currentLang === 'hi' ? "3. सुबह 04:30 AM किसान नीलामी" : currentLang === 'ta' ? "3. அதிகாலை 04:30 ஏலம்" : "3. 04:30 AM Farmer Auction",
          shortDesc: currentLang === 'hi' 
            ? "सुबह 04:30 बजे फूल मंडी जाकर दलालों के 35% कमीशन से बचें।" 
            : currentLang === 'ta'
            ? "காலை 04:30 மணிக்கு பூ மண்டி சென்று 35% கமிஷனை தவிருங்கள்."
            : "Arrive at wholesale flower mandi early before secondary markups.",
          recommendedTitle: currentLang === 'hi'
            ? "सिफारिश: किसान की सीधी गाड़ी से बोरी खरीदकर ₹220 प्रति चक्कर बचाएं"
            : currentLang === 'ta'
            ? "பரிந்துரை: விவசாயியிடம் நேரடியாக வாங்கி பயணத்திற்கு ₹220 சேமி"
            : 'Recommended: Pre-Dawn Direct Farmer Sack Sourcing',
          profitImpact: "Saves ₹220/Morning",
          details: currentLang === 'hi'
            ? "मंडी के गेट पर खड़े दलाल सुबह 7:00 बजे तक फूलों का रेट 35% बढ़ा देते हैं। सुबह 04:30 बजे ग़ाज़ीपुर या कोयम्बेडु फूल मंडी में सीधे किसानों की गाड़ी से 10kg का बोरा लेने पर प्रति ट्रिप ₹220 की सीधी बचत होती है!"
            : currentLang === 'ta'
            ? "காலை 7 மணிக்கு இடைத்தரகர்கள் பூக்களின் விலையை 35% ஏற்றி விடுகிறார்கள். அதிகாலை 04:30 மணிக்கே கோயம்பேடு பூ மண்டி சென்று விவசாயிகளின் வாகனத்திலிருந்து நேரடியாக 10kg மூட்டை வாங்கினால் தினமும் ₹220 மிச்சமாகும்!"
            : "Gate middlemen mark up flower prices by 35% by 7:00 AM. Arriving at the wholesale flower mandi by 04:30 AM allows you to buy fresh 10kg flower sacks directly from incoming farmer trucks, saving ₹220 on every morning trip!"
        }
      }
    }
  };

  const activeStallData = SHOP_OPTIMIZERS[selectedStallKey] || SHOP_OPTIMIZERS.produce;
  const currentStrategy = activeStallData.strategies[activeStrategyKey] || activeStallData.strategies.strategy1;
  const StallIcon = activeStallData.icon;

  const STALL_NAV_TABS = [
    { key: 'produce', labelEn: 'Fruits & Veg', labelHi: 'फल व सब्ज़ी', labelTa: 'பழங்கள் & காய்கறி', icon: ShoppingBag, color: 'text-emerald-700' },
    { key: 'street_food', labelEn: 'Street Food', labelHi: 'स्ट्रीट फ़ूड', labelTa: 'சாட் & சமோசா', icon: Flame, color: 'text-amber-700' },
    { key: 'chai_tea', labelEn: 'Chai & Snacks', labelHi: 'चाय व नाश्ता', labelTa: 'டீ & சிற்றுண்டி', icon: Coffee, color: 'text-orange-700' },
    { key: 'kirana', labelEn: 'Micro Kirana', labelHi: 'माइक्रो किराना', labelTa: 'மளிகைக் கடை', icon: Store, color: 'text-blue-700' },
    { key: 'flowers', labelEn: 'Flower & Pooja', labelHi: 'फूल व पूजा', labelTa: 'பூ & பூஜை', icon: Flower, color: 'text-rose-700' }
  ];

  return (
    <div className="paper-card p-4 sm:p-6 rounded-3xl text-slate-900 space-y-4">
      
      {/* 5 Stall Selector Bar: Allows Instant Switching Across All 5 Trades */}
      <div className="space-y-2 pb-3 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-1 text-[12px]">
          <span className="font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {currentLang === 'hi' 
                ? 'दुकान चुनें (5 अलग-अलग ट्रेड के मार्जिन नियम):' 
                : currentLang === 'ta' 
                ? 'கடை தேர்வு (5 வெவ்வேறு வணிக லாப வழிகள்):' 
                : 'Select Stall (Custom Margin Strategy for each trade):'}
            </span>
          </span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {currentLang === 'hi' ? 'दुकान अनुसार अलग नियम' : currentLang === 'ta' ? 'கடைக்கு ஏற்ப தனி காம்போ' : 'Trade-Specific Strategies'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STALL_NAV_TABS.map((tab) => {
            const isTabActive = selectedStallKey === tab.key;
            const TabIcon = tab.icon;
            const tabLabel = currentLang === 'hi' ? tab.labelHi : currentLang === 'ta' ? tab.labelTa : tab.labelEn;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSelectedStallKey(tab.key);
                  setActiveStrategyKey('strategy1');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl min-h-[44px] text-[14px] font-semibold transition active:scale-95 whitespace-nowrap shadow-2xs ${
                  isTabActive
                    ? 'bg-[#062E38] text-white ring-2 ring-emerald-500 shadow-sm'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                <TabIcon className={`w-4 h-4 ${isTabActive ? 'text-emerald-400' : tab.color}`} />
                <span>{tabLabel}</span>
                {isTabActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#062E38] flex items-center justify-center text-emerald-400 shadow-md">
            <StallIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] font-semibold text-[#062E38]">
                {currentLang === 'hi' 
                  ? "मुनाफ़ा सलाहकार (मार्जिन ऑप्टिमाइज़र)" 
                  : currentLang === 'ta' 
                  ? "லாப ஆலோசகர் (மார்ஜின் ஆப்டிமைசர்)" 
                  : "Margin & Portion Advisor"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[12px] font-semibold border border-emerald-200">
                {activeStallData.stallTag}
              </span>
            </div>
            <p className="text-[14px] text-slate-500 font-normal">
              {currentLang === 'hi'
                ? "कच्चे माल की महंगाई के समय बिना ग्राहक खोए अपना मुनाफ़ा सुरक्षित रखें"
                : currentLang === 'ta'
                ? "பொருட்கள் விலை உயரும் போது வாடிக்கையாளரை இழக்காமல் லாபத்தை பாதுகாக்கவும்"
                : "Protect your take-home cash when wholesale prices spike without losing customers"}
            </p>
          </div>
        </div>

        {/* Live Market Price Surge Alert Badge */}
        <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[12px] font-semibold flex items-center gap-1.5 shadow-2xs">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{activeStallData.alertBadge}</span>
        </span>
      </div>

      {/* 3 Strategy Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Object.entries(activeStallData.strategies).map(([sKey, strat]) => {
          const isSelected = activeStrategyKey === sKey;
          return (
            <button
              key={sKey}
              type="button"
              onClick={() => setActiveStrategyKey(sKey)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-slate-50 border-emerald-600 shadow-md ring-1 ring-emerald-600'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[16px] font-semibold ${isSelected ? 'text-[#062E38]' : 'text-slate-800'}`}>
                  {strat.title}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                  {strat.profitImpact}
                </span>
              </div>
              <p className="text-[14px] text-slate-500 line-clamp-2 leading-relaxed font-normal">
                {strat.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Action Details Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 text-[14px] space-y-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2 font-semibold text-[#062E38] text-[16px]">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>{currentStrategy.recommendedTitle}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 font-mono text-[12px] font-bold">
            {currentStrategy.profitImpact}
          </span>
        </div>

        <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed font-medium">
          {currentStrategy.details}
        </p>

        <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 font-bold border-t border-[#F0EAE1]">
          <span className="flex items-center gap-1 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Stall Defense Active for {activeStallData.stallTag}</span>
          </span>
          <span className="text-stone-400">
            VendorAI Profit Engine
          </span>
        </div>
      </div>

    </div>
  );
}
