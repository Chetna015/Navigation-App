import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Mic, Send, X, Sparkles, Volume2, VolumeX, 
  MapPin, Rocket, Compass, ArrowRight, Navigation, 
  Footprints, Clock, CheckCircle2, Maximize2, Minimize2, 
  Eye, Coffee, Waves, BookOpen, AlertTriangle, Layers, 
  Building2, Flame, RefreshCw, Zap, Search, HeartHandshake
} from 'lucide-react';
import { MAP_LOCATIONS, STARTUP_STALLS, SESSIONS_DATA, SBM_INDOOR_DATA } from '../data/auditoriumData';
import { getMergedMapLocations } from '../utils/locationStore';
import { haversineDistanceMeters } from '../utils/haversine';
import { useNavigation } from '../context/NavigationContext';

/**
 * Helper to retrieve a polite, humble Indian Hindi female voice
 */
export function getHindiFemaleVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Look for explicit Hindi female voices (e.g. Swara, Heera, Kalpana, Google हिन्दी, etc.)
  const hindiFemale = voices.find(v => 
    (v.lang.includes('hi') || v.lang.includes('HI') || v.name.toLowerCase().includes('hindi')) &&
    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('swara') || v.name.toLowerCase().includes('heera') || v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural') || v.name.includes('हिन्दी'))
  );
  if (hindiFemale) return hindiFemale;

  // 2. Any Hindi voice (hi-IN, hi_IN)
  const anyHindi = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('hi-IN') || v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी'));
  if (anyHindi) return anyHindi;

  // 3. Indian English Female voice (e.g. Neerja, Priya, Google en-IN Female, etc.)
  const indianFemale = voices.find(v => 
    (v.lang.includes('en-IN') || v.lang.includes('en_IN')) &&
    (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('neerja') || v.name.toLowerCase().includes('priya') || v.name.toLowerCase().includes('google'))
  );
  if (indianFemale) return indianFemale;

  // 4. Any Indian English voice
  const anyIndian = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en_IN'));
  if (anyIndian) return anyIndian;

  // 5. Any natural female voice
  const anyFemale = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'));
  if (anyFemale) return anyFemale;

  return voices[0] || null;
}

export default function AIAssistantModal({
  isOpen,
  onClose,
  currentLocation,
  destination,
  onSelectLocation,
  onStartNavigation,
  onCancelNavigation,
  onOpenStalls,
  onOpenSessions,
  onOpen3DView,
  onOpenStreetView,
  onOpenSBMIndoor,
  onOpenParking,
  onOpenShuttle,
  onOpenCampusLife,
  onOpenEmergency
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome_msg',
      sender: 'ai',
      text: "नमस्ते जी! 🙏 छत्रपति शाहू जी महाराज विश्वविद्यालय (CSJMU) AI Summit 2026 में आपका हार्दिक एवं आत्मीय स्वागत है। मैं आपकी सहायक सहचरी हूँ। कृपया बताइए मैं आपकी क्या सेवा कर सकती हूँ? आप मुझसे किसी भी भवन, लैब, स्टॉल या पेयजल का रास्ता पूछ सकते हैं।",
      time: 'Just now',
      card: null
    }
  ]);
  const { voiceEnabled, toggleVoice } = useNavigation();
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState('normal'); // 'normal' | 'minimized' | 'expanded'

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        getHindiFemaleVoice();
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech output synthesizer with polite Hindi lady voice
  const speakText = (text, spokenHindi = null) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = spokenHindi || text;
      // Clean markdown stars, emojis, and punctuation for natural voice
      const cleanVoiceText = textToSpeak
        .replace(/[*#_`]/g, '')
        .replace(/[📍🏛️📚☕🏢💧🚻🚀🎤🚗🚌🧭🚶📷❌✅•🙏]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
      utterance.lang = 'hi-IN';
      utterance.pitch = 1.12; // Gentle, polite, soft female pitch
      utterance.rate = 0.92;  // Calm, respectful, polite speaking rate

      const voice = getHindiFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Hindi Speech synthesis error:", e);
    }
  };

  // Helper: Find Destination & Indoor Targets
  const resolveTargetDestination = (query) => {
    const q = query.toLowerCase().trim();
    const allLocations = getMergedMapLocations();

    // 1. Check SBM Indoor Rooms & Water Coolers
    if (SBM_INDOOR_DATA && SBM_INDOOR_DATA.floors) {
      for (const floor of SBM_INDOOR_DATA.floors) {
        // Rooms
        for (const room of floor.rooms || []) {
          const idMatch = q.includes(room.id.toLowerCase());
          const nameMatch = q.includes(room.name.toLowerCase().replace(room.id.toLowerCase() + ':', '').trim());
          const tagMatch = room.tags && room.tags.some(t => q.includes(t.toLowerCase()));
          const keywordMatch = 
            (q.includes('ml lab') && room.id === 'SBM-02') ||
            (q.includes('gpu lab') && room.id === 'SBM-102') ||
            (q.includes('pitch arena') && room.id === 'SBM-103') ||
            (q.includes('incubator') && room.id === 'SBM-201') ||
            (q.includes('keynote hall') && room.id === 'SBM-01');

          if (idMatch || nameMatch || tagMatch || keywordMatch) {
            return {
              type: 'indoor_room',
              id: room.id,
              name: room.name,
              category: room.type || 'SBM Indoor Room',
              floor: 'indoor',
              floorName: floor.name,
              lat: SBM_INDOOR_DATA.lat,
              lng: SBM_INDOOR_DATA.lng,
              x: room.coordinates?.x || 300,
              y: room.coordinates?.y || 200,
              description: `${floor.name} • क्षमता: ${room.capacity} • ${room.equipment}. कार्यक्रम: ${room.currentEvent}`,
              roomData: room
            };
          }
        }

        // Water coolers
        for (const wc of floor.waterCoolers || []) {
          const wcIdMatch = q.includes(wc.id.toLowerCase());
          const wcKwMatch = (q.includes('water cooler') || q.includes('drinking water') || q.includes('ro water') || q.includes('cold water') || q.includes('पानी') || q.includes('जल'));
          if (wcIdMatch || wcKwMatch) {
            return {
              type: 'water_cooler',
              id: wc.id,
              name: wc.name,
              category: 'स्मार्ट टचलेस आरओ शीतल पेयजल केंद्र',
              floor: 'indoor',
              floorName: floor.name,
              lat: SBM_INDOOR_DATA.lat,
              lng: SBM_INDOOR_DATA.lng,
              x: wc.coordinates?.x || 300,
              y: wc.coordinates?.y || 220,
              description: `${wc.type} • तापमान: ${wc.temperature} • शुद्धता: ${wc.purity} • ${wc.locationDescription}`,
              wcData: wc
            };
          }
        }
      }
    }

    // 2. Check Startup Stalls (S01 to S20)
    for (const stall of STARTUP_STALLS || []) {
      const sId = stall.id.toLowerCase();
      const sName = stall.name.toLowerCase();
      const sDomain = (stall.domain || '').toLowerCase();
      const sFounder = (stall.founder || '').toLowerCase();

      if (q.includes(sId) || q.includes(sName) || (q.includes('stall') && q.includes(sId.replace('s', ''))) || (q.includes('स्टॉल') && q.includes(sId.replace('s', '')))) {
        return {
          type: 'stall',
          id: stall.id,
          name: `स्टॉल ${stall.id}: ${stall.name}`,
          category: `स्टार्टअप मंडप • ${stall.domain}`,
          floor: 'indoor',
          lat: 26.504193,
          lng: 80.268463,
          x: stall.x,
          y: stall.y,
          description: `संस्थापक: ${stall.founder} (${stall.origin})। ${stall.description} • डेमो समय: ${stall.demoTiming}`,
          stallData: stall
        };
      }
    }

    // 3. Check Campus Buildings & Custom Plotted POIs
    const cleaned = q
      .replace(/^take me to\s+/i, '')
      .replace(/^i want to go to\s+/i, '')
      .replace(/^navigate to\s+/i, '')
      .replace(/^directions to\s+/i, '')
      .replace(/^show path to\s+/i, '')
      .replace(/^route to\s+/i, '')
      .replace(/^go to\s+/i, '')
      .replace(/^where is the\s+/i, '')
      .replace(/^where is\s+/i, '')
      .replace(/^how to reach\s+/i, '')
      .replace(/^find\s+/i, '')
      .replace(/^locate\s+/i, '')
      .replace(/^मुझे\s+/i, '')
      .replace(/\s+जाना है/i, '')
      .replace(/\s+कहाँ है/i, '')
      .replace(/\s+का रास्ता/i, '')
      .replace(/\s+दिखाइए/i, '')
      .replace(/\s+ले चलो/i, '')
      .trim();

    let bestMatch = null;
    let bestScore = 0;

    for (const loc of allLocations) {
      const locName = (loc.name || '').toLowerCase();
      const locCode = (loc.code || '').toLowerCase();
      const locCat = (loc.category || '').toLowerCase();
      const locDesc = (loc.description || '').toLowerCase();

      let score = 0;
      if (locName === cleaned || locCode === cleaned) score = 100;
      else if (locName.includes(cleaned) && cleaned.length >= 3) score = 85;
      else if (q.includes(locName) && locName.length >= 3) score = 75;
      else if (cleaned.includes(locName) && locName.length >= 3) score = 70;
      else if (locCode && q.includes(locCode)) score = 60;
      else if (locCat && q.includes(locCat)) score = 40;
      else if (locDesc && locDesc.includes(cleaned) && cleaned.length >= 4) score = 35;

      // Special Keyword Aliases
      if ((q.includes('uiet 4') || q.includes('uiet-4')) && locName.includes('uiet 4')) score = 95;
      else if ((q.includes('uiet') || q.includes('engineering') || q.includes('btech') || q.includes('यूआईईटी')) && locName.includes('uiet') && !locName.includes('uiet 4')) score = 92;
      else if ((q.includes('library') || q.includes('books') || q.includes('reading room') || q.includes('लाइब्रेरी') || q.includes('पुस्तकालय')) && locName.includes('library')) score = 95;
      else if ((q.includes('cafeteria') || q.includes('canteen') || q.includes('food') || q.includes('coffee') || q.includes('lunch') || q.includes('snacks') || q.includes('chai') || q.includes('कैंटीन') || q.includes('खाना') || q.includes('चाय')) && locName.includes('cafeteria')) score = 95;
      else if ((q.includes('sbm') || q.includes('business management') || q.includes('management block') || q.includes('mba') || q.includes('एसबीएम')) && locName.includes('sbm')) score = 95;
      else if ((q.includes('lecture hall') || q.includes('lhc') || q.includes('complex')) && locName.includes('lecture hall')) score = 95;
      else if ((q.includes('oat') || q.includes('open air') || q.includes('theatre')) && locName.includes('open air')) score = 95;
      else if ((q.includes('girls hostel') || q.includes('girl hostel') || q.includes('छात्राओं का हॉस्टल')) && locName.includes('girls hostel')) score = 95;
      else if ((q.includes('boys hostel') || q.includes('boy hostel') || q.includes('छात्रों का हॉस्टल')) && locName.includes('boys hostel')) score = 95;
      else if ((q.includes('auditorium') || q.includes('main stage') || q.includes('summit venue') || q.includes('main hall') || q.includes('ऑडिटोरियम') || q.includes('मंच')) && locName.includes('auditorium')) score = 95;
      else if ((q.includes('swimming') || q.includes('pool') || q.includes('aquatic') || q.includes('स्वीमिंग पूल')) && locName.includes('swimming')) score = 95;
      else if ((q.includes('gym') || q.includes('sports') || q.includes('fitness') || q.includes('workout') || q.includes('जिम') || q.includes('व्यायामशाला')) && locName.includes('gym')) score = 95;
      else if ((q.includes('admin') || q.includes('vc') || q.includes('secretariat') || q.includes('registrar') || q.includes('प्रशासन')) && locName.includes('admin')) score = 95;
      else if ((q.includes('metro') || q.includes('train') || q.includes('station') || q.includes('मेट्रो')) && locName.includes('metro')) score = 95;
      else if ((q.includes('main gate') || q.includes('entrance gate') || q.includes('gate 1') || q.includes('gt road') || q.includes('मुख्य द्वार') || q.includes('गेट')) && locName.includes('main gate')) score = 95;
      else if (q.includes('nataraj') && locName.includes('nataraj')) score = 95;
      else if (q.includes('namarta') && locName.includes('namarta')) score = 95;
      else if (q.includes('academics') && locName.includes('academics')) score = 95;

      if (score > bestScore) {
        bestScore = score;
        bestMatch = loc;
      }
    }

    if (bestMatch && bestScore >= 40) {
      return {
        type: 'campus_building',
        ...bestMatch,
        floor: bestMatch.floor || 'outdoor'
      };
    }

    return null;
  };

  // Helper: Nearest Facility Resolver
  const resolveNearestFacility = (type) => {
    const allLocs = getMergedMapLocations();
    if (type === 'washroom') {
      return {
        id: 'loc_washroom',
        name: 'केंद्रीय मुख्य शौचालय (महिला एवं पुरुष)',
        category: 'स्वच्छता एवं विश्राम गृह',
        lat: 26.503022,
        lng: 80.266371,
        floor: 'indoor',
        description: 'सेंसर युक्त नल, स्वच्छता डिस्पेंसर एवं दिव्यांगजन अनुकूल सुविधा।'
      };
    } else if (type === 'water') {
      return {
        id: 'SBM-WC-01',
        name: 'SBM वाटर कूलर #1 (केंद्रीय प्रांगण RO स्टेशन)',
        category: 'स्मार्ट टचलेस आरओ शीतल पेयजल',
        lat: 26.503022,
        lng: 80.266371,
        floor: 'indoor',
        description: '5-चरणीय RO + UV शुद्धीकरण (6.0°C शीतल जल, 99.9% शुद्धता)।'
      };
    } else if (type === 'cafeteria') {
      const cafe = allLocs.find(l => (l.name || '').toLowerCase().includes('cafeteria'));
      return cafe || {
        id: 'custom_bld_1786259290495',
        name: 'विश्वविद्यालय कैफेटेरिया एवं कैंटीन',
        category: 'भोजन एवं अल्पाहार केंद्र',
        lat: 26.499776,
        lng: 80.266065,
        floor: 'outdoor',
        description: 'गरम भोजन, अल्पाहार, चाय-कॉफी एवं बैठने की उत्तम व्यवस्था।'
      };
    } else if (type === 'parking') {
      return {
        id: 'loc_parking_area',
        name: 'मुख्य द्वार एवं वीआईपी वाहन पार्किंग',
        category: 'वाहन पार्किंग क्षेत्र',
        lat: 26.4980,
        lng: 80.2660,
        floor: 'outdoor',
        description: '350+ दोपहिया एवं चौपहिया वाहनों की क्षमता सहित ईवी फास्ट चार्जिंग सुविधा।'
      };
    } else if (type === 'shuttle') {
      return {
        id: 'loc_shuttle_station',
        name: 'केंद्रीय परिसर इलेक्ट्रिक शटल बस स्टॉप',
        category: 'हरित परिसर परिवहन',
        lat: 26.5010,
        lng: 80.2675,
        floor: 'outdoor',
        description: 'पर्यावरण-अनुकूल इलेक्ट्रिक बसें प्रत्येक 8 मिनट के अंतराल पर उपलब्ध।'
      };
    }
    return null;
  };

  // Helper: Where Am I / Spatial Context Analysis
  const analyzeCurrentPosition = () => {
    const allLocs = getMergedMapLocations();
    const uLat = currentLocation?.lat || 26.4970;
    const uLng = currentLocation?.lng || 80.2666;

    const ranked = allLocs.map(loc => ({
      ...loc,
      distMeters: haversineDistanceMeters(uLat, uLng, loc.lat, loc.lng)
    })).sort((a, b) => a.distMeters - b.distMeters);

    const closest = ranked[0] || { name: 'CSJM Main Gate', distMeters: 15, category: 'Entrance' };
    const nearby = ranked.slice(1, 4);

    return { closest, nearby, uLat, uLng };
  };

  // Process natural language user query
  const handleSendMessage = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      card: null
    };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent AI response & execute action
    setTimeout(() => {
      const q = textToSend.toLowerCase().trim();
      const uLat = currentLocation?.lat || 26.4970;
      const uLng = currentLocation?.lng || 80.2666;

      let responseText = "";
      let spokenHindi = "";
      let messageCard = null;

      // CASE 1: Current Location / "Where am I" Query
      if (
        q.includes('where i am') || 
        q.includes('where am i') || 
        q.includes('which building') || 
        q.includes('my location') || 
        q.includes('current location') ||
        q.includes('where am i right now') ||
        q.includes('my position') ||
        q.includes('my gps') ||
        q.includes('कहाँ हूँ') ||
        q.includes('कहा हू') ||
        q.includes('मेरी लोकेशन') ||
        q.includes('किस बिल्डिंग')
      ) {
        const { closest, nearby, uLat, uLng } = analyzeCurrentPosition();
        responseText = `📍 जी, आप इस समय **${closest.name}** के पास उपस्थित हैं (लगभग ${closest.distMeters} मीटर की दूरी पर)।\n• जीपीएस निर्देशांक: ${uLat.toFixed(5)}° N, ${uLng.toFixed(5)}° E\n• परिसर क्षेत्र: ${closest.category || 'विश्वविद्यालय परिसर'}\n\n**आपके निकटतम प्रमुख स्थान:**\n• ${nearby[0]?.name || 'Central Library'} (~${nearby[0]?.distMeters || 100} मीटर)\n• ${nearby[1]?.name || 'Cafeteria'} (~${nearby[1]?.distMeters || 200} मीटर)\n• ${nearby[2]?.name || 'UIET'} (~${nearby[2]?.distMeters || 300} मीटर)\n\nकृपया बताइए, आप कहाँ पधारना चाहते हैं? 🙏`;

        spokenHindi = `जी, आप इस समय ${closest.name} के पास उपस्थित हैं, जो कि यहाँ से लगभग ${closest.distMeters} मीटर दूर है। कृपया बताइए आप कहाँ जाना चाहते हैं?`;

        messageCard = {
          type: 'location_status',
          title: `वर्तमान स्थिति: ${closest.name} के समीप`,
          category: closest.category || 'परिसर स्थल',
          distanceMeters: closest.distMeters,
          description: `जीपीएस: ${uLat.toFixed(5)}° N, ${uLng.toFixed(5)}° E (${closest.category || 'मुख्य विश्वविद्यालय परिसर'})।`,
          nearbyList: nearby,
          actions: [
            {
              label: `🧭 ${nearby[0]?.name || 'सेंट्रल लाइब्रेरी'} का मार्ग`,
              primary: true,
              onClick: () => {
                if (nearby[0]) {
                  onSelectLocation(nearby[0]);
                  if (onStartNavigation) onStartNavigation('preview');
                }
              }
            },
            {
              label: `☕ कैंटीन / कैफेटेरिया`,
              primary: false,
              onClick: () => {
                const cafe = resolveNearestFacility('cafeteria');
                if (cafe) {
                  onSelectLocation(cafe);
                  if (onStartNavigation) onStartNavigation('preview');
                }
              }
            }
          ]
        };
      }
      // CASE 2: Emergency / SOS / Medical First-Aid
      else if (
        q.includes('emergency') || 
        q.includes('sos') || 
        q.includes('medical') || 
        q.includes('doctor') || 
        q.includes('ambulance') || 
        q.includes('help me') ||
        q.includes('first aid') ||
        q.includes('मदद') ||
        q.includes('डॉक्टर') ||
        q.includes('इलाज') ||
        q.includes('चोट') ||
        q.includes('दवाई')
      ) {
        const medLoc = {
          id: 'loc_medical_booth',
          name: 'Emergency Medical Booth & Ambulance Point',
          category: 'आपातकालीन चिकित्सा सहायता',
          lat: 26.4985,
          lng: 80.2665,
          floor: 'outdoor',
          description: 'प्राथमिक उपचार किट, डिफाइब्रिलेटर, ऑक्सीजन सिलेंडर एवं पैरामेडिकल चिकित्सकों की 24x7 उपस्थिति।'
        };
        onSelectLocation(medLoc);
        if (onOpenEmergency) onOpenEmergency();
        if (onStartNavigation) onStartNavigation('active');

        const dist = haversineDistanceMeters(uLat, uLng, medLoc.lat, medLoc.lng);
        responseText = `🚑 जी, आपातकालीन प्राथमिक चिकित्सा सहायता (Medical Booth) सक्रिय कर दी गई है! यह यहाँ से लगभग ${dist} मीटर दूर है। कृपया निश्चिंत रहें, स्वास्थ्य दल आपकी सहायता हेतु तैयार है।`;
        spokenHindi = `आपातकालीन चिकित्सा सहायता सक्रिय कर दी गई है। यह यहाँ से लगभग ${dist} मीटर दूर है। कृपया धैर्य रखें, स्वास्थ्य दल आपकी सहायता के लिए तैयार है।`;

        messageCard = {
          type: 'facility',
          title: medLoc.name,
          category: 'आपातकालीन चिकित्सा SOS',
          distanceMeters: dist,
          walkingMinutes: Math.max(1, Math.round(dist / 70)),
          steps: Math.round(dist / 0.75),
          description: medLoc.description,
          actions: [
            {
              label: '🏃 आपातकालीन मार्ग पर चलें',
              primary: true,
              onClick: () => {
                if (onStartNavigation) onStartNavigation('active');
                setViewMode('minimized');
              }
            }
          ]
        };
      }
      // CASE 3: Nearest Amenities Queries
      else if (q.includes('washroom') || q.includes('toilet') || q.includes('restroom') || q.includes('शौचालय') || q.includes('टॉयलेट') || q.includes('बाथरूम')) {
        const washroom = resolveNearestFacility('washroom');
        onSelectLocation(washroom);
        if (onStartNavigation) onStartNavigation('preview');
        const dist = haversineDistanceMeters(uLat, uLng, washroom.lat, washroom.lng);

        responseText = `🚻 जी हाँ, आपके सबसे निकटतम स्वच्छ शौचालय **${washroom.name}** में स्थित हैं (लगभग ${dist} मीटर की दूरी पर)।\nमैंने आपके मैप पर मार्ग दर्शा दिया है। कृपया सावधानीपूर्वक पधारें।`;
        spokenHindi = `जी हाँ, आपके निकटतम शौचालय ${washroom.name} में उपलब्ध हैं, जो लगभग ${dist} मीटर दूर है। मैप पर रास्ता दिखा दिया गया है।`;

        messageCard = {
          type: 'facility',
          title: washroom.name,
          category: 'स्वच्छता एवं विश्राम गृह',
          distanceMeters: dist,
          walkingMinutes: Math.max(1, Math.round(dist / 70)),
          steps: Math.round(dist / 0.75),
          description: washroom.description,
          actions: [
            {
              label: '🧭 मैप पर रास्ता देखें',
              primary: true,
              onClick: () => {
                onSelectLocation(washroom);
                setViewMode('minimized');
              }
            },
            {
              label: '🏢 आंतरिक तल योजना (Indoor Plan)',
              primary: false,
              onClick: () => {
                if (onOpenSBMIndoor) onOpenSBMIndoor();
              }
            }
          ]
        };
      }
      else if (q.includes('water') || q.includes('drinking') || q.includes('thirsty') || q.includes('cooler') || q.includes('purifier') || q.includes('पानी') || q.includes('जल') || q.includes('प्यास')) {
        const water = resolveNearestFacility('water');
        onSelectLocation(water);
        if (onStartNavigation) onStartNavigation('preview');
        const dist = haversineDistanceMeters(uLat, uLng, water.lat, water.lng);

        responseText = `💧 जी, शीतल एवं शुद्ध आरओ पेयजल की उत्तम व्यवस्था **${water.name}** पर उपलब्ध है (लगभग ${dist} मीटर दूरी)।\n• तापमान: 6.0°C (ठंडा जल) • शुद्धता: 99.9% RO+UV\nमैप पर मार्ग सक्रिय कर दिया गया है।`;
        spokenHindi = `जी, शुद्ध एवं शीतल पेयजल की सुविधा ${water.name} पर उपलब्ध है, जो यहाँ से लगभग ${dist} मीटर दूर है। रास्ता मैप पर दिखा दिया गया है।`;

        messageCard = {
          type: 'water_cooler',
          title: water.name,
          category: 'स्मार्ट टचलेस आरओ पेयजल',
          distanceMeters: dist,
          walkingMinutes: Math.max(1, Math.round(dist / 70)),
          steps: Math.round(dist / 0.75),
          description: water.description,
          actions: [
            {
              label: '🧭 मैप पर मार्ग देखें',
              primary: true,
              onClick: () => {
                onSelectLocation(water);
                setViewMode('minimized');
              }
            },
            {
              label: '🏢 SBM पेयजल केंद्र देखें',
              primary: false,
              onClick: () => {
                if (onOpenSBMIndoor) onOpenSBMIndoor();
              }
            }
          ]
        };
      }
      else if (q.includes('parking') || q.includes('car park') || q.includes('bike park') || q.includes('vehicle') || q.includes('पार्किंग') || q.includes('गाड़ी') || q.includes('कार')) {
        const parking = resolveNearestFacility('parking');
        onSelectLocation(parking);
        if (onStartNavigation) onStartNavigation('preview');
        const dist = haversineDistanceMeters(uLat, uLng, parking.lat, parking.lng);

        responseText = `🚗 जी, वाहनों के लिए सुरक्षित पार्किंग स्थल **${parking.name}** पर स्थित है (लगभग ${dist} मीटर दूरी)।\nयहाँ दोपहिया एवं चौपहिया वाहनों हेतु पर्याप्त स्थान एवं ईवी फास्ट चार्जिंग की सुविधा है।`;
        spokenHindi = `जी, वाहन पार्किंग स्थल यहाँ से लगभग ${dist} मीटर दूर है। रास्ता मैप पर अंकित कर दिया गया है।`;

        messageCard = {
          type: 'facility',
          title: parking.name,
          category: 'वाहन पार्किंग क्षेत्र',
          distanceMeters: dist,
          walkingMinutes: Math.max(1, Math.round(dist / 70)),
          steps: Math.round(dist / 0.75),
          description: parking.description,
          actions: [
            {
              label: '🧭 मैप पर रास्ता देखें',
              primary: true,
              onClick: () => {
                onSelectLocation(parking);
                setViewMode('minimized');
              }
            },
            {
              label: '🅿️ पार्किंग खोजक (Parking Finder)',
              primary: false,
              onClick: () => {
                if (onOpenParking) onOpenParking();
              }
            }
          ]
        };
      }
      else if (q.includes('shuttle') || q.includes('bus') || q.includes('transit') || q.includes('शटल') || q.includes('बस') || q.includes('गाड़ी')) {
        const shuttle = resolveNearestFacility('shuttle');
        onSelectLocation(shuttle);
        if (onStartNavigation) onStartNavigation('preview');
        const dist = haversineDistanceMeters(uLat, uLng, shuttle.lat, shuttle.lng);

        responseText = `🚌 जी, विश्वविद्यालय की निःशुल्क इलेक्ट्रिक शटल बस का स्टॉप **${shuttle.name}** पर है (लगभग ${dist} मीटर दूरी)। यह बस हर 8 मिनट के अंतराल पर उपलब्ध होती है।`;
        spokenHindi = `जी, परिसर शटल बस का स्टॉप लगभग ${dist} मीटर दूर है। यह बस हर आठ मिनट में उपलब्ध रहती है।`;

        messageCard = {
          type: 'facility',
          title: shuttle.name,
          category: 'परिसर शटल सेवा',
          distanceMeters: dist,
          walkingMinutes: Math.max(1, Math.round(dist / 70)),
          steps: Math.round(dist / 0.75),
          description: shuttle.description,
          actions: [
            {
              label: '🧭 मैप पर मार्ग देखें',
              primary: true,
              onClick: () => {
                onSelectLocation(shuttle);
                setViewMode('minimized');
              }
            },
            {
              label: '🚌 लाइव शटल समय सारिणी',
              primary: false,
              onClick: () => {
                if (onOpenShuttle) onOpenShuttle();
              }
            }
          ]
        };
      }
      // CASE 4: Sessions & Speakers
      else if (q.includes('session') || q.includes('schedule') || q.includes('who is speaking') || q.includes('speaker') || q.includes('talk') || q.includes('program') || q.includes('सत्र') || q.includes('भाषण') || q.includes('वक्ता') || q.includes('कार्यक्रम')) {
        const stageLoc = {
          id: 'custom_bld_1786300436659',
          name: 'CSJM Auditorium Main Stage',
          category: 'मुख्य शिखर सम्मेलन मंच',
          lat: 26.504193,
          lng: 80.268463,
          floor: 'outdoor',
          description: 'मुख्य सभागार में इस समय लाइव व्याख्यान, पैनल परिचर्चा एवं तकनीकी प्रस्तुतियां संचालित हो रही हैं।'
        };
        onSelectLocation(stageLoc);
        if (onStartNavigation) onStartNavigation('preview');
        const dist = haversineDistanceMeters(uLat, uLng, stageLoc.lat, stageLoc.lng);

        responseText = "🎤 जी, मुख्य मंच पर इस समय व्याख्यान चल रहा है: 'Generative AI & Multilingual LLMs for Public Governance' (वक्ता: डॉ. अनीश शर्मा)। मैं आपको मुख्य सभागार का मार्ग दिखा रही हूँ!";
        spokenHindi = "जी, मुख्य मंच पर इस समय जेनेरेटिव ए आई एवं भारतीय भाषाओं के एल एल एम पर डॉ अनीश शर्मा का व्याख्यान चल रहा है। चलिए मैं आपको मुख्य सभागार का रास्ता दिखाती हूँ।";

        messageCard = {
          type: 'sessions',
          title: 'CSJM ऑडिटोरियम मुख्य मंच',
          category: 'लाइव AI समिट मुख्य सत्र',
          distanceMeters: dist,
          walkingMinutes: Math.max(1, Math.round(dist / 70)),
          steps: Math.round(dist / 0.75),
          description: "सक्रिय सत्र: 'Generative AI & Multilingual LLMs for Public Governance' by Dr. Anish Sharma.",
          actions: [
            {
              label: '🧭 मुख्य मंच का मार्ग देखें',
              primary: true,
              onClick: () => {
                onSelectLocation(stageLoc);
                setViewMode('minimized');
              }
            },
            {
              label: '🎤 संपूर्ण कार्यक्रम सारिणी',
              primary: false,
              onClick: () => {
                if (onOpenSessions) onOpenSessions();
              }
            }
          ]
        };
      }
      // CASE 5: Targeted Destination Navigation (Buildings, Rooms, Stalls)
      else {
        const matched = resolveTargetDestination(textToSend);

        if (matched) {
          // AUTOMATICALLY ENTER DESTINATION ON MAP
          onSelectLocation(matched);
          if (onStartNavigation) onStartNavigation('preview');

          const dist = haversineDistanceMeters(uLat, uLng, matched.lat, matched.lng);
          const walkTime = Math.max(1, Math.round(dist / 70));
          const steps = Math.round(dist / 0.75);

          responseText = `🧭 जी बिल्कुल! 🙏 मैं आपको **${matched.name}** का मार्ग दिखा रही हूँ। यह यहाँ से लगभग ${dist} मीटर की दूरी पर है (लगभग ${walkTime} मिनट की पैदल यात्रा, ~${steps} कदम)।\n\n✅ *गंतव्य आपके मैप पर स्वतः दर्ज कर दिया गया है एवं मार्ग नीली रेखा से प्रदर्शित है।* आपकी यात्रा सुखद एवं ज्ञानवर्धक हो!`;
          spokenHindi = `जी बिल्कुल! मैं आपको ${matched.name} का मार्ग दिखा रही हूँ। यह यहाँ से लगभग ${dist} मीटर की दूरी पर है, जिसमें लगभग ${walkTime} मिनट लगेंगे। गंतव्य आपके मैप पर दर्ज कर दिया गया है। आपकी यात्रा सुखद हो!`;

          const cardActions = [
            {
              label: '🧭 मैप पर मार्ग देखें',
              primary: true,
              onClick: () => {
                onSelectLocation(matched);
                setViewMode('minimized');
              }
            },
            {
              label: '🚶 लाइव जीपीएस मार्गदर्शन शुरू करें',
              primary: false,
              onClick: () => {
                if (onStartNavigation) onStartNavigation('active');
                setViewMode('minimized');
              }
            }
          ];

          if (matched.type === 'indoor_room' || matched.type === 'water_cooler' || matched.name.includes('SBM')) {
            cardActions.push({
              label: '🏢 SBM आंतरिक तल योजना',
              primary: false,
              onClick: () => {
                if (onOpenSBMIndoor) onOpenSBMIndoor();
              }
            });
          }

          if (matched.type === 'stall') {
            cardActions.push({
              label: '🚀 स्टार्टअप प्रदर्शनी मंडप',
              primary: false,
              onClick: () => {
                if (onOpenStalls) onOpenStalls();
              }
            });
          }

          if (onOpenStreetView) {
            cardActions.push({
              label: '📷 360° पैनोरमा दर्शन',
              primary: false,
              onClick: () => {
                onOpenStreetView();
              }
            });
          }

          if (onCancelNavigation) {
            cardActions.push({
              label: '❌ मार्ग रद्द करें',
              primary: false,
              onClick: () => {
                onCancelNavigation();
              }
            });
          }

          messageCard = {
            type: matched.type,
            title: matched.name,
            category: matched.category || 'विश्वविद्यालय परिसर स्थल',
            distanceMeters: dist,
            walkingMinutes: walkTime,
            steps: steps,
            description: matched.description || 'CSJMU परिसर भवन एवं सुविधा',
            actions: cardActions
          };
        } else {
          // General Campus Information Fallback
          responseText = `जी, मैं आपकी सेवा में सदैव तत्पर हूँ! 🙏 आप मुझसे परिसर के किसी भी भवन (जैसे UIET, सेंट्रल लाइब्रेरी, SBM, कैंटीन, ऑडिटोरियम, हॉस्टल), इंडोर लैब (SBM-02 ML Lab), पीने के पानी अथवा शौचालय का रास्ता पूछ सकते हैं।`;
          spokenHindi = `जी, मैं आपकी सेवा में सदैव तत्पर हूँ। कृपया बताएं आप परिसर में कहाँ जाना चाहते हैं?`;

          messageCard = {
            type: 'suggestions',
            title: 'प्रमुख लोकप्रिय परिसर स्थल',
            category: 'त्वरित मार्ग चयन',
            actions: [
              {
                label: '🏛️ UIET इंजीनियरिंग ब्लॉक',
                primary: true,
                onClick: () => handleSendMessage('Take me to UIET')
              },
              {
                label: '📚 सेंट्रल लाइब्रेरी (पुस्तकालय)',
                primary: false,
                onClick: () => handleSendMessage('Take me to Central Library')
              },
              {
                label: '☕ कैंटीन / कैफेटेरिया',
                primary: false,
                onClick: () => handleSendMessage('Nearest Cafeteria')
              },
              {
                label: '💧 शीतल पेयजल स्टेशन',
                primary: false,
                onClick: () => handleSendMessage('Nearest water cooler')
              }
            ]
          };
        }
      }

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: messageCard
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(responseText, spokenHindi);
    }, 450);
  };

  // Web Speech API Voice Listening in Hindi (hi-IN)
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("आपके ब्राउज़र में वॉइस रिकॉग्निशन की सुविधा उपलब्ध नहीं है। कृपया लिखकर बताएं।");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Hindi + Hinglish recognition
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = (err) => {
      console.warn("Speech recognition error:", err);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  // Render Minimized Floating Bar (Map Peek Mode)
  if (viewMode === 'minimized') {
    return (
      <div 
        className="glass-panel ai-assistant-minimized-bar" 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 950,
          background: 'var(--colors-surface-card)',
          border: '1.5px solid var(--colors-primary)',
          borderRadius: '9999px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={() => setViewMode('normal')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981'
          }} />
          <Bot size={16} color="var(--colors-primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
            {destination ? `🧭 मार्ग: ${destination.name}` : "🤖 CSJMU AI सहायक (हिंदी)"}
          </span>
        </div>

        <button 
          className="ollama-btn-secondary" 
          style={{ padding: '3px 10px', fontSize: '11px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <Maximize2 size={12} /> विस्तृत करें ↗
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
          title="बंद करें"
        >
          <X size={15} color="var(--colors-body)" />
        </button>
      </div>
    );
  }

  // Normal & Expanded Modal
  const isExpanded = viewMode === 'expanded';

  return (
    <div className="glass-panel ai-assistant-modal" style={{
      position: 'fixed',
      bottom: '88px',
      right: '24px',
      width: isExpanded ? '460px' : '390px',
      maxWidth: 'calc(100vw - 32px)',
      height: isExpanded ? '640px' : '550px',
      maxHeight: 'calc(100vh - 110px)',
      borderRadius: '16px',
      zIndex: 950,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid var(--colors-hairline-strong)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
      background: 'var(--colors-surface-card)',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Terminal Assistant Header with macOS Traffic Lights */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--colors-surface-soft)',
        borderBottom: '1px solid var(--colors-hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* macOS Traffic Light Dots */}
          <div className="ollama-traffic-lights" style={{ display: 'flex', gap: '6px' }}>
            <div 
              className="ollama-traffic-light red" 
              onClick={onClose} 
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', cursor: 'pointer' }}
              title="बंद करें (Close)"
            />
            <div 
              className="ollama-traffic-light yellow" 
              onClick={() => setViewMode('minimized')} 
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', cursor: 'pointer' }}
              title="छोटा करें (Minimize / Peek Map)"
            />
            <div 
              className="ollama-traffic-light green" 
              onClick={() => setViewMode(isExpanded ? 'normal' : 'expanded')} 
              style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', cursor: 'pointer' }}
              title="बड़ा करें (Expand Window)"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'var(--colors-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              <Bot size={15} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>
                CSJMU AI सहायक सहचरी (हिंदी)
              </div>
              <div style={{ fontSize: '10px', color: 'var(--colors-body)', fontFamily: 'var(--font-code)' }}>
                {destination ? `📍 गंतव्य: ${destination.name}` : "स्मार्ट परिसर नेविगेशन एवं समिट गाइड"}
              </div>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => toggleVoice()}
            className="ollama-btn-secondary"
            style={{ width: '28px', height: '28px', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={voiceEnabled ? "आवाज़ बंद करें (Mute Hindi Voice)" : "आवाज़ चालू करें (Enable Hindi Voice)"}
          >
            {voiceEnabled ? <Volume2 size={14} color="#10B981" /> : <VolumeX size={14} color="var(--colors-body)" />}
          </button>

          <button
            onClick={() => setViewMode('minimized')}
            className="ollama-btn-secondary"
            style={{ width: '28px', height: '28px', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="मैप देखें (Peek Map)"
          >
            <Minimize2 size={13} color="var(--colors-ink)" />
          </button>

          <button
            onClick={() => setViewMode(isExpanded ? 'normal' : 'expanded')}
            className="ollama-btn-secondary"
            style={{ width: '28px', height: '28px', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={isExpanded ? "सामान्य आकार" : "बड़ा आकार"}
          >
            <Maximize2 size={13} color="var(--colors-ink)" />
          </button>

          <button
            onClick={onClose}
            className="modal-close-btn"
            style={{ width: '28px', height: '28px', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: 'pointer' }}
            title="सहायक बंद करें"
          >
            <X size={16} color="var(--colors-ink)" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'var(--colors-canvas)'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: msg.sender === 'user' ? '85%' : '94%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {/* Message Bubble Text */}
            <div style={{
              background: msg.sender === 'user' 
                ? 'var(--colors-primary)' 
                : 'var(--colors-surface-card)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--colors-hairline)',
              color: msg.sender === 'user' ? 'var(--colors-on-primary)' : 'var(--colors-ink)',
              padding: '10px 14px',
              borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
              fontSize: '13px',
              fontFamily: msg.sender === 'user' ? 'var(--font-main)' : 'system-ui, -apple-system, sans-serif',
              lineHeight: 1.55,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              whiteSpace: 'pre-line'
            }}>
              {msg.text}
            </div>

            {/* Embedded Rich Navigation Action Card */}
            {msg.card && (
              <div style={{
                marginTop: '8px',
                width: '100%',
                background: 'var(--colors-surface-soft)',
                border: '1.5px solid var(--colors-hairline-strong)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--colors-ink)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#1D4ED8" />
                    <span>{msg.card.title}</span>
                  </div>
                  {msg.card.category && (
                    <span style={{ fontSize: '10px', background: 'rgba(29, 78, 216, 0.12)', color: '#1D4ED8', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                      {msg.card.category}
                    </span>
                  )}
                </div>

                {/* Spatial Navigation Metrics Pill (Distance, Walk Time, Steps) */}
                {msg.card.distanceMeters !== undefined && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12px',
                    color: 'var(--colors-ink)',
                    background: 'var(--colors-surface-card)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--colors-hairline)',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 700 }}>
                      <Navigation size={13} /> {msg.card.distanceMeters} मीटर
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--colors-body)' }}>
                      <Clock size={13} /> ~{msg.card.walkingMinutes} मिनट
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--colors-body)' }}>
                      <Footprints size={13} /> ~{msg.card.steps} कदम
                    </span>
                  </div>
                )}

                {/* Description */}
                {msg.card.description && (
                  <div style={{ fontSize: '12px', color: 'var(--colors-body)', lineHeight: 1.4 }}>
                    {msg.card.description}
                  </div>
                )}

                {/* Nearby list if location status */}
                {msg.card.nearbyList && msg.card.nearbyList.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--colors-body)' }}>
                      निकटवर्ती स्थल:
                    </div>
                    {msg.card.nearbyList.map((nb, nIdx) => (
                      <div 
                        key={nIdx}
                        onClick={() => {
                          onSelectLocation(nb);
                          if (onStartNavigation) onStartNavigation('preview');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'var(--colors-surface-card)',
                          border: '1px solid var(--colors-hairline)',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontWeight: 600, color: 'var(--colors-ink)' }}>📍 {nb.name}</span>
                        <span style={{ color: '#10B981', fontWeight: 700 }}>~{nb.distMeters}m 🧭</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Action Buttons */}
                {msg.card.actions && msg.card.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {msg.card.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={act.onClick}
                        className={act.primary ? "ollama-btn-primary" : "ollama-btn-secondary"}
                        style={{
                          fontSize: '11px',
                          padding: '5px 12px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <span style={{ fontSize: '10px', color: 'var(--colors-body)', marginTop: '4px', padding: '0 4px', fontFamily: 'var(--font-code)' }}>
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Interactive Prompt Suggestion Chips in Hindi */}
      <div style={{
        padding: '8px 12px',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        background: 'var(--colors-surface-soft)',
        borderTop: '1px solid var(--colors-hairline)'
      }}>
        {[
          { label: "📍 मैं अभी कहाँ हूँ?", query: "मैं अभी कहाँ हूँ किस बिल्डिंग में" },
          { label: "🏛️ मुझे UIET जाना है", query: "मुझे UIET जाना है" },
          { label: "📚 सेंट्रल लाइब्रेरी", query: "सेंट्रल लाइब्रेरी का रास्ता" },
          { label: "☕ कैंटीन / कैफेटेरिया", query: "निकटतम कैफेटेरिया" },
          { label: "🏢 SBM बिल्डिंग", query: "स्कूल ऑफ बिजनेस मैनेजमेंट SBM" },
          { label: "🔬 SBM-02 ML लैब", query: "SBM-02 Machine Learning Lab" },
          { label: "💧 पीने का ठंडा पानी", query: "पीने का पानी कहाँ है" },
          { label: "🚻 निकटतम शौचालय", query: "निकटतम शौचालय कहाँ है" },
          { label: "🚀 स्टॉल S08 (BharatLang)", query: "Stall S08 BharatLang" },
          { label: "🎤 अभी कौन बोल रहा है?", query: "अभी मंच पर कौन बोल रहा है" },
          { label: "🚗 पार्किंग कहाँ है?", query: "गाड़ी की पार्किंग कहाँ है" },
          { label: "🚌 कैंपस शटल बस", query: "कैंपस शटल बस" }
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(item.query)}
            style={{
              flexShrink: 0,
              background: 'var(--colors-surface-card)',
              border: '1px solid var(--colors-hairline-strong)',
              color: 'var(--colors-ink)',
              fontSize: '11px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: '9999px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Voice & Text Chat Input Bar */}
      <div style={{
        padding: '10px 14px',
        background: 'var(--colors-surface-card)',
        borderTop: '1px solid var(--colors-hairline)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {/* Voice Input Button */}
        <button
          onClick={startVoiceInput}
          className="ollama-btn-secondary"
          style={{
            borderRadius: '9999px',
            width: '36px',
            height: '36px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            background: isListening ? '#FEE2E2' : 'var(--colors-surface-soft)',
            border: isListening ? '2px solid #EF4444' : '1px solid var(--colors-hairline)'
          }}
          title={isListening ? "सुन रही हूँ... (रोकने के लिए क्लिक करें)" : "बोलकर गंतव्य बताएं (हिंदी / English)"}
        >
          {isListening && (
            <div style={{
              position: 'absolute',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              border: '2px solid #EF4444',
              animation: 'ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
          )}
          <Mic size={16} color={isListening ? '#EF4444' : 'var(--colors-ink)'} />
        </button>

        {/* Query Input Box */}
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? "आपकी आवाज़ सुन रही हूँ, बोलिए..." : "पूछिए 'मैं कहाँ हूँ?' या 'UIET का रास्ता'..."}
          style={{
            flex: 1,
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '9999px',
            padding: '8px 14px',
            color: 'var(--colors-ink)',
            fontSize: '13px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            outline: 'none'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          className="ollama-btn-primary"
          style={{ width: '36px', height: '36px', borderRadius: '9999px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="पूछें (Send)"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
