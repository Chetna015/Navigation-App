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
      border: '1px solid var(--border-glass-light)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Assistant Header */}
      <div style={{
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.25) 0%, rgba(0, 240, 255, 0.15) 100%)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
          }}>
            <Bot size={20} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>
              CSJMU Gemini Assistant
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-cyan)' }}>
              Online • Conversational AI Guide
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setVoiceSynthesize(!voiceSynthesize)}
            className="btn-glass"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            {voiceSynthesize ? <Volume2 size={16} color="var(--color-cyan)" /> : <VolumeX size={16} color="var(--text-muted)" />}
          </button>
          <button
            onClick={onClose}
            className="btn-glass"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={16} color="var(--text-muted)" />
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
        gap: '12px'
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
                ? 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)' 
                : 'rgba(255, 255, 255, 0.07)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-glass)',
              color: '#FFF',
              padding: '10px 14px',
              borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              fontSize: '13px',
              lineHeight: 1.4,
              boxShadow: 'var(--shadow-sm)'
            }}>
              {msg.text}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '4px', padding: '0 4px' }}>
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div style={{
        padding: '8px 16px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderTop: '1px solid var(--border-glass)'
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
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              color: 'var(--color-cyan)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={startVoiceInput}
          style={{
            background: isListening ? 'var(--color-rose)' : 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Mic size={16} color={isListening ? '#FFF' : 'var(--color-cyan)'} />
        </button>

        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask AI where to go..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#FFF',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        <button
          onClick={() => handleSendMessage()}
          className="btn-primary"
          style={{ padding: '8px', borderRadius: '50%' }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
