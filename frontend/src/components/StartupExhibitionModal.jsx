import React, { useState } from 'react';
import { 
  Rocket, Search, ExternalLink, Bookmark, Navigation, 
  X, Filter, Clock, User, HeartPulse, Sprout, ShieldCheck, 
  Cpu, Bot, GraduationCap, Eye, Dna, Leaf, Plane, TrendingUp, 
  Zap, Truck, Mic, Activity, Sun, Layers, Lock, BrainCircuit, MessageSquare 
} from 'lucide-react';
import { STARTUP_STALLS } from '../data/auditoriumData';

const ICON_MAP = {
  HeartPulse, Sprout, ShieldCheck, Cpu, Bot, GraduationCap, 
  Eye, Dna, Leaf, Plane, TrendingUp, Zap, Truck, Mic, Activity, 
  Sun, Layers, Lock, BrainCircuit, MessageSquare
};

export default function StartupExhibitionModal({
  isOpen,
  onClose,
  onSelectStallDestination,
  bookmarks,
  onToggleBookmark
}) {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const domains = ['All', 'Healthcare AI', 'Agriculture AI', 'Generative AI', 'Cyber Security', 'Robotics', 'DeepTech', 'CleanTech'];

  const filteredStalls = STARTUP_STALLS.filter(stall => {
    const matchesDomain = selectedDomain === 'All' || stall.domain === selectedDomain;
    const matchesSearch = stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stall.founder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stall.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1080px',
        maxHeight: '90vh',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--colors-hairline-strong)',
        boxShadow: 'var(--shadow-md)',
        background: 'var(--colors-surface-card)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--colors-surface-soft)',
          borderBottom: '1px solid var(--colors-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: 'var(--colors-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Rocket size={18} color="var(--colors-on-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--colors-ink)', fontFamily: 'var(--font-heading)' }}>
                Startup Exhibition Arena (Stalls S01 - S20)
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--colors-body)', fontFamily: 'var(--font-main)' }}>
                Discover 20 High-Impact AI Startups at Chhatrapati Shahu Ji Maharaj University
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="modal-close-btn"
            title="Close Modal"
          >
            <X size={16} color="var(--colors-ink)" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          padding: '16px 24px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div className="glass-card" style={{
              flex: 1,
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)'
            }}>
              <Search size={18} color="var(--text-muted)" style={{ marginRight: '8px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search startups, founders, or stall #..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: '#FFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {domains.map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedDomain === domain ? 'linear-gradient(135deg, #10B981 0%, #00F0FF 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedDomain === domain ? '#FFF' : 'var(--text-muted)',
                  whiteSpace: 'nowrap'
                }}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Stalls Grid View */}
        <div style={{
          flex: 1,
          padding: '24px',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredStalls.map((stall) => {
            const IconComp = ICON_MAP[stall.logoIcon] || Rocket;
            const isBookmarked = bookmarks.includes(stall.id);

            return (
              <div
                key={stall.id}
                className="glass-card"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                {/* Stall Badge & Bookmark */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(0, 240, 255, 0.15)',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconComp size={20} color="var(--color-cyan)" />
                    </div>
                    <div>
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10B981',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        STALL {stall.id}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(stall.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Bookmark size={20} color={isBookmarked ? '#F59E0B' : 'var(--text-muted)'} fill={isBookmarked ? '#F59E0B' : 'none'} />
                  </button>
                </div>

                {/* Name & Domain */}
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>
                    {stall.name}
                  </h3>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '8px' }}>
                    {stall.domain}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {stall.description}
                  </p>
                </div>

                {/* Details Footer */}
                <div style={{
                  borderTop: '1px solid var(--border-glass)',
                  paddingTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={13} color="var(--text-dim)" /> Founder: <strong style={{ color: '#FFF' }}>{stall.founder}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="var(--text-dim)" /> Demo Slot: <strong style={{ color: '#FFF' }}>{stall.demoTiming}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      onSelectStallDestination(stall);
                      onClose();
                    }}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '8px' }}
                  >
                    <Navigation size={14} /> Navigate to Stall
                  </button>

                  <a
                    href={stall.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-glass"
                    style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)' }}
                  >
                    <ExternalLink size={14} color="var(--text-muted)" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
