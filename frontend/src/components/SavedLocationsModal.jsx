import React, { useState } from 'react';
import { Bookmark, Star, MapPin, ArrowRight, Trash2, X, Plus, Search, Footprints } from 'lucide-react';
import { getMergedMapLocations } from '../utils/locationStore';
import { haversineDistanceMeters } from '../utils/haversine';

export default function SavedLocationsModal({
  isOpen,
  onClose,
  bookmarks = [],
  onToggleBookmark,
  onNavigateToLocation,
  currentLocation
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddSheet, setShowAddSheet] = useState(false);

  if (!isOpen) return null;

  const allLocations = getMergedMapLocations();

  // Bookmarked location objects
  const bookmarkedLocations = allLocations.filter(loc => 
    bookmarks.includes(loc.id) || bookmarks.includes(loc.code)
  );

  // Available locations to add
  const availableToAdd = allLocations.filter(loc => 
    !bookmarks.includes(loc.id) && !bookmarks.includes(loc.code) &&
    (searchQuery.trim() === '' || 
     loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (loc.category && loc.category.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleNavigate = (loc) => {
    onNavigateToLocation(loc);
    onClose();
  };

  return (
    <div className="mobile-map-search-overlay" onClick={onClose}>
      <div 
        className="mobile-map-search-sheet animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '82vh' }}
      >
        <div className="search-sheet-handle" />

        {/* Header */}
        <div className="search-sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF'
            }}>
              <Star size={16} fill="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', margin: 0 }}>Saved Places</h3>
              <p style={{ fontSize: '11px', color: 'var(--colors-body)', margin: 0 }}>
                Your bookmarked campus locations ({bookmarkedLocations.length})
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="search-sheet-close"
              onClick={() => setShowAddSheet(!showAddSheet)}
              title={showAddSheet ? 'View Saved' : 'Add Place'}
              style={{
                width: 'auto',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: showAddSheet ? 'var(--colors-primary)' : 'var(--colors-surface-soft)',
                color: showAddSheet ? 'var(--colors-on-primary)' : 'var(--colors-ink)',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {showAddSheet ? 'Done' : <><Plus size={13} /> Add</>}
            </button>

            <button 
              type="button"
              className="search-sheet-close"
              onClick={onClose}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Mode 1: Add new bookmarks */}
        {showAddSheet ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="search-sheet-input-row">
              <Search size={15} color="var(--colors-body)" />
              <input
                type="text"
                placeholder="Search location to bookmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <X size={15} color="var(--colors-body)" />
                </button>
              )}
            </div>

            <div className="search-sheet-results" style={{ maxHeight: '50vh' }}>
              {availableToAdd.map(loc => (
                <div key={loc.id} className="search-sheet-item">
                  <div className="sheet-item-icon">
                    <MapPin size={16} color="var(--colors-primary)" />
                  </div>
                  <div className="sheet-item-info">
                    <div className="sheet-item-name">{loc.name}</div>
                    <div className="sheet-item-category">{loc.category || 'Campus Facility'}</div>
                  </div>
                  <button
                    type="button"
                    className="sheet-item-go-btn"
                    onClick={() => onToggleBookmark(loc.id)}
                    style={{ background: 'var(--colors-surface-soft)', color: 'var(--colors-ink)', border: '1px solid var(--colors-hairline-strong)' }}
                  >
                    + Save ⭐
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Mode 2: List of saved places */
          <div className="search-sheet-results" style={{ maxHeight: '55vh' }}>
            {bookmarkedLocations.length > 0 ? (
              bookmarkedLocations.map(loc => {
                let dist = 150;
                if (currentLocation && loc.lat && loc.lng) {
                  dist = Math.round(haversineDistanceMeters(
                    currentLocation.lat || 26.4970,
                    currentLocation.lng || 80.2666,
                    loc.lat,
                    loc.lng
                  ));
                }

                return (
                  <div key={loc.id} className="search-sheet-item" onClick={() => handleNavigate(loc)}>
                    <div className="sheet-item-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
                      <Star size={16} color="#D97706" fill="#D97706" />
                    </div>
                    <div className="sheet-item-info">
                      <div className="sheet-item-name">{loc.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span className="sheet-item-category">{loc.category || 'Facility'}</span>
                        <span style={{ fontSize: '10px', color: 'var(--colors-body)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Footprints size={10} /> {dist}m
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(loc.id);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--colors-mute)',
                          cursor: 'pointer',
                          padding: '6px'
                        }}
                        title="Remove bookmark"
                      >
                        <Trash2 size={15} />
                      </button>

                      <button
                        type="button"
                        className="sheet-item-go-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavigate(loc);
                        }}
                      >
                        Go ➔
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '30px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>No Saved Places Yet</h4>
                <p style={{ fontSize: '11px', color: 'var(--colors-body)', marginBottom: '14px' }}>
                  Bookmark your favorite classrooms, hostel, library, or cafes for 1-tap navigation.
                </p>
                <button
                  type="button"
                  className="mobile-ask-ai-quick-btn"
                  onClick={() => setShowAddSheet(true)}
                >
                  <Plus size={14} /> Bookmark a Location
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
