import React from 'react';
import { Home, Map, Bot, Building2, Star } from 'lucide-react';

export default function MobileBottomNav({
  currentPage,
  onNavigateTab,
  onOpenAIAssistant,
  onOpenIndoor,
  onOpenSaved,
  hasActiveRoute
}) {
  return (
    <nav className="mobile-bottom-nav">
      {/* 1. Home Tab */}
      <button
        type="button"
        className={`mobile-nav-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => onNavigateTab('home')}
        title="Home"
      >
        <div className="mobile-nav-icon-wrap">
          <Home size={20} />
        </div>
        <span className="mobile-nav-label">Home</span>
      </button>

      {/* 2. Map Tab */}
      <button
        type="button"
        className={`mobile-nav-item ${currentPage === 'map' ? 'active' : ''}`}
        onClick={() => onNavigateTab('map')}
        title="Campus Map"
      >
        <div className="mobile-nav-icon-wrap">
          <Map size={20} />
          {hasActiveRoute && <span className="mobile-nav-badge-dot" />}
        </div>
        <span className="mobile-nav-label">Map</span>
      </button>

      {/* 3. AI Assistant Tab */}
      <button
        type="button"
        className="mobile-nav-item mobile-nav-item-ai"
        onClick={onOpenAIAssistant}
        title="AI Campus Guide"
      >
        <div className="mobile-nav-icon-wrap mobile-ai-icon-pulse">
          <Bot size={22} color="#FFFFFF" />
        </div>
        <span className="mobile-nav-label">AI Guide</span>
      </button>

      {/* 4. Indoor Rooms & Water Coolers Tab */}
      <button
        type="button"
        className="mobile-nav-item"
        onClick={onOpenIndoor}
        title="Indoor Floorplans & Rooms"
      >
        <div className="mobile-nav-icon-wrap">
          <Building2 size={20} />
        </div>
        <span className="mobile-nav-label">Indoor</span>
      </button>

      {/* 5. Saved Places / Bookmarks Tab */}
      <button
        type="button"
        className="mobile-nav-item"
        onClick={onOpenSaved}
        title="Saved & Favorite Places"
      >
        <div className="mobile-nav-icon-wrap">
          <Star size={20} />
        </div>
        <span className="mobile-nav-label">Saved</span>
      </button>
    </nav>
  );
}
