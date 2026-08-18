import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Mic, Send, X, Sparkles, Volume2, VolumeX, 
  MapPin, Rocket, Mic2, Compass, ArrowRight 
} from 'lucide-react';
import { MAP_LOCATIONS, STARTUP_STALLS, SESSIONS_DATA } from '../data/auditoriumData';

export default function AIAssistantModal({
  isOpen,
  onClose,
  onSelectLocation,
  onOpenStalls,
  onOpenSessions
}) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Namaste! Welcome to Chhatrapati Shahu Ji Maharaj University AI Summit 2026. I am your Smart Venue Navigation AI Companion. How may I assist your visit today?",
      time: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSynthesize, setVoiceSynthesize] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech output synthesizer
  const speakText = (text) => {
    if (!voiceSynthesize || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Process natural language user query
  const handleSendMessage = (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate smart response logic
    setTimeout(() => {
      let responseText = "";
      const q = textToSend.toLowerCase();

      if (q.includes('stage')) {
        responseText = "Walk straight for 30 meters. Turn left after Registration Counter R1. Continue past VIP Seating. Main Stage & Screen is directly ahead.";
        const loc = MAP_LOCATIONS.find(l => l.id === 'loc_stage');
        if (loc) onSelectLocation(loc);
      } else if (q.includes('registration')) {
        responseText = "Registration & Badging Counters R1-R4 are in the Main Entrance Foyer. Turn right from the entrance gates.";
        const loc = MAP_LOCATIONS.find(l => l.id === 'loc_registration');
        if (loc) onSelectLocation(loc);
      } else if (q.includes('washroom') || q.includes('toilet') || q.includes('restroom')) {
        responseText = "The nearest washrooms are located near the west indoor foyer beside the Drinking Water dispenser.";
        const loc = MAP_LOCATIONS.find(l => l.id === 'loc_washroom');
        if (loc) onSelectLocation(loc);
      } else if (q.includes('food') || q.includes('coffee') || q.includes('lunch')) {
        responseText = "The Indoor Food & Refreshment Lounge is at the south wing of the auditorium foyer, serving hot chai, snacks, and express lunch.";
        const loc = MAP_LOCATIONS.find(l => l.id === 'loc_food_court');
        if (loc) onSelectLocation(loc);
      } else if (q.includes('stall') || q.includes('startup')) {
        // Try match specific stall ID e.g. S08
        const matchStall = STARTUP_STALLS.find(s => q.includes(s.id.toLowerCase()) || q.includes(s.name.toLowerCase()));
        if (matchStall) {
          responseText = `${matchStall.id} (${matchStall.name} by ${matchStall.founder}) is located at ${matchStall.stallLocation}. Demo time: ${matchStall.demoTiming}. Directing you on map!`;
          onSelectLocation({ id: matchStall.id, name: `Stall ${matchStall.id}: ${matchStall.name}`, floor: matchStall.floor, x: matchStall.x, y: matchStall.y, description: matchStall.description });
        } else {
          responseText = "We have 20 innovative AI Startups exhibiting today across Healthcare, AgriTech, GenAI, and Robotics! Opening the Exhibition Pavilion for you.";
          onOpenStalls();
        }
      } else if (q.includes('session') || q.includes('speak') || q.includes('talk')) {
        responseText = "Currently Live on Stage: 'Generative AI & Multilingual LLMs for Public Governance' by Dr. Anish Sharma. Opening today's summit schedule!";
        onOpenSessions();
      } else if (q.includes('guest house') || q.includes('hotel')) {
        responseText = "The CSJMU University Guest House is located outdoors, 250 meters south of the Auditorium Building.";
        const loc = MAP_LOCATIONS.find(l => l.id === 'loc_guest_house');
        if (loc) onSelectLocation(loc);
      } else {
        responseText = `I have logged your request "${textToSend}". Let me guide you to the nearest venue desk or auditorium main stage!`;
      }

      const aiMsg = { sender: 'ai', text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      speakText(responseText);
    }, 600);
  };

  // Web Speech API Voice Listening
  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser engine.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  if (!isOpen) return null;

  return (
    <div className="glass-panel" style={{
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      width: '380px',
      maxWidth: 'calc(100vw - 32px)',
      height: '540px',
      maxHeight: 'calc(100vh - 120px)',
      borderRadius: 'var(--radius-lg)',
      zIndex: 900,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid var(--colors-hairline-strong)',
      boxShadow: 'var(--shadow-md)',
      background: 'var(--colors-surface-card)',
      borderRadius: '12px'
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
          {/* Ollama macOS Traffic Light Dots */}
          <div className="ollama-traffic-lights">
            <div className="ollama-traffic-light red" />
            <div className="ollama-traffic-light yellow" />
            <div className="ollama-traffic-light green" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
            <Bot size={16} color="var(--colors-ink)" />
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
              CSJMU Gemini AI Terminal
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setVoiceSynthesize(!voiceSynthesize)}
            className="ollama-btn-secondary"
            style={{ width: '28px', height: '28px', borderRadius: '9999px', padding: 0 }}
          >
            {voiceSynthesize ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close Assistant"
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
        gap: '12px',
        background: 'var(--colors-canvas)'
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              background: msg.sender === 'user' 
                ? 'var(--colors-primary)' 
                : 'var(--colors-surface-soft)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--colors-hairline)',
              color: msg.sender === 'user' ? 'var(--colors-on-primary)' : 'var(--colors-ink)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: msg.sender === 'user' ? 'var(--font-main)' : 'var(--font-code)',
              lineHeight: 1.5
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--colors-body)', marginTop: '4px', padding: '0 4px', fontFamily: 'var(--font-code)' }}>
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Command Tags */}
      <div style={{
        padding: '8px 16px',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        background: 'var(--colors-surface-soft)',
        borderTop: '1px solid var(--colors-hairline)'
      }}>
        {[
          "Take me to Stage",
          "Where is Registration?",
          "Stall S08",
          "Nearest Washroom",
          "Who is speaking now?"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            style={{
              flexShrink: 0,
              background: 'var(--colors-canvas)',
              border: '1px solid var(--colors-hairline-strong)',
              color: 'var(--colors-ink)',
              fontSize: '12px',
              fontFamily: 'var(--font-code)',
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            $ {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--colors-surface-card)',
        borderTop: '1px solid var(--colors-hairline)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={startVoiceInput}
          className="ollama-btn-secondary"
          style={{
            borderRadius: '9999px',
            width: '34px',
            height: '34px',
            padding: 0
          }}
        >
          <Mic size={15} color={isListening ? '#EF4444' : 'var(--colors-ink)'} />
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type command or query..."
          style={{
            flex: 1,
            background: 'var(--colors-surface-soft)',
            border: '1px solid var(--colors-hairline)',
            borderRadius: '9999px',
            padding: '8px 14px',
            color: 'var(--colors-ink)',
            fontSize: '13px',
            fontFamily: 'var(--font-code)',
            outline: 'none'
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          className="ollama-btn-primary"
          style={{ width: '34px', height: '34px', borderRadius: '9999px', padding: 0 }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
