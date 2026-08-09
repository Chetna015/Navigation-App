import React, { useState, useEffect } from 'react';
import { 
  X, Upload, Image as ImageIcon, MapPin, Compass, Plus, Trash2, 
  Edit3, Save, CheckCircle, AlertCircle, RefreshCw, Key, Layers, ArrowRight, Eye
} from 'lucide-react';
import { 
  upload360ImageFile, save360CampusNode, delete360CampusNode, getStored360Nodes 
} from '../utils/firebaseLocationStore';

export default function Admin360DashboardModal({
  isOpen,
  onClose,
  onOpenPreview360
}) {
  const [activeTab, setActiveTab] = useState('add_node'); // 'add_node' | 'manage' | 'config'
  const [allNodes, setAllNodes] = useState(() => getStored360Nodes());
  
  // Form State for New/Edit Node
  const [nodeId, setNodeId] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [category, setCategory] = useState('Academic Block');
  const [lat, setLat] = useState('26.4970');
  const [lng, setLng] = useState('80.2666');
  const [description, setDescription] = useState('');
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Hotspots Editor State
  const [hotspots, setHotspots] = useState([]);
  const [newHsTarget, setNewHsTarget] = useState('');
  const [newHsText, setNewHsText] = useState('');
  const [newHsYaw, setNewHsYaw] = useState(0);
  const [newHsPitch, setNewHsPitch] = useState(0);

  // Status Message
  const [statusMsg, setStatusMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAllNodes(getStored360Nodes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Image File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
      if (!nodeId) {
        const cleanName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        setNodeId(`node_${cleanName.slice(0, 20)}`);
      }
    }
  };

  // Add Hotspot to list
  const handleAddHotspot = () => {
    if (!newHsTarget) {
      alert("Please select a target destination node for the walking arrow.");
      return;
    }
    const newHs = {
      targetNodeId: newHsTarget,
      text: newHsText || `Walk to ${allNodes[newHsTarget]?.name || newHsTarget}`,
      yaw: parseInt(newHsYaw, 10) || 0,
      pitch: parseInt(newHsPitch, 10) || 0
    };
    setHotspots(prev => [...prev, newHs]);
    setNewHsTarget('');
    setNewHsText('');
    setNewHsYaw(0);
    setNewHsPitch(0);
  };

  const handleRemoveHotspot = (index) => {
    setHotspots(prev => prev.filter((_, i) => i !== index));
  };

  // Use Current GPS Location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(6));
          setLng(pos.coords.longitude.toFixed(6));
          setStatusMsg({ type: 'success', text: "📍 Acquired active GPS coordinates!" });
        },
        () => {
          alert("Could not fetch current GPS location. Please enter latitude/longitude manually.");
        }
      );
    }
  };

  // Form Submission (Upload & Save Node to Firebase/Store)
  const handleSubmitNode = async (e) => {
    e.preventDefault();
    if (!nodeName || (!previewUrl && !selectedFile)) {
      alert("Please provide a Location Name and select a 360 photo.");
      return;
    }

    const finalNodeId = nodeId.trim() || `node_${Date.now()}`;
    setIsUploading(true);
    setStatusMsg({ type: 'info', text: "Uploading 360 panoramic photo to storage..." });

    try {
      let finalPanoramaUrl = previewUrl;
      if (selectedFile) {
        finalPanoramaUrl = await upload360ImageFile(selectedFile, (progress) => {
          setUploadProgress(progress);
        });
      }

      const nodeData = {
        id: finalNodeId,
        name: nodeName,
        category: category,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        panoramaUrl: finalPanoramaUrl,
        description: description,
        hotspots: hotspots
      };

      await save360CampusNode(nodeData);

      setAllNodes(getStored360Nodes());
      setStatusMsg({ type: 'success', text: `✅ Successfully saved "${nodeName}" to 360 Campus Store!` });

      // Reset form
      setNodeId('');
      setNodeName('');
      setSelectedFile(null);
      setPreviewUrl('');
      setDescription('');
      setHotspots([]);
      setUploadProgress(0);

    } catch (err) {
      console.error("Save node error:", err);
      setStatusMsg({ type: 'error', text: `Failed to save node: ${err.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  // Delete node
  const handleDeleteNode = async (id) => {
    if (window.confirm(`Are you sure you want to delete node "${allNodes[id]?.name || id}"?`)) {
      await delete360CampusNode(id);
      setAllNodes(getStored360Nodes());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(9, 14, 26, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'var(--font-main)',
      color: '#FFFFFF'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        background: '#0F172A',
        border: '1.5px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
            }}>
              <Upload size={22} color="#FFF" />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>
                  CSJMU 360° Campus Admin Dashboard
                </h2>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.4)'
                }}>
                  DATABASE CONNECTED
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                Upload custom 360° panoramas & define interactive walking arrow hotspots.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: '#090E1A',
          padding: '0 24px'
        }}>
          <button
            onClick={() => setActiveTab('add_node')}
            style={{
              padding: '14px 20px',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'add_node' ? '#00F0FF' : '#94A3B8',
              fontWeight: activeTab === 'add_node' ? 800 : 600,
              fontSize: '13px',
              borderBottom: activeTab === 'add_node' ? '2.5px solid #00F0FF' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            <span>Upload New 360 Location</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            style={{
              padding: '14px 20px',
              border: 'none',
              background: 'transparent',
              color: activeTab === 'manage' ? '#00F0FF' : '#94A3B8',
              fontWeight: activeTab === 'manage' ? 800 : 600,
              fontSize: '13px',
              borderBottom: activeTab === 'manage' ? '2.5px solid #00F0FF' : '2.5px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Layers size={16} />
            <span>Manage 360 Nodes ({Object.keys(allNodes).length})</span>
          </button>
        </div>

        {/* Status Notification Toast */}
        {statusMsg && (
          <div style={{
            padding: '10px 24px',
            background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: statusMsg.type === 'error' ? '#F87171' : '#34D399',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span>{statusMsg.text}</span>
            <button onClick={() => setStatusMsg(null)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {/* Tab 1: Upload New Node Form */}
        {activeTab === 'add_node' && (
          <form onSubmit={handleSubmitNode} style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. File Upload Box */}
            <div style={{
              border: '2px dashed rgba(0, 240, 255, 0.4)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              background: 'rgba(0, 240, 255, 0.03)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
              />
              <ImageIcon size={36} color="#00F0FF" style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>
                {selectedFile ? `Selected: ${selectedFile.name}` : "Click or Drag & Drop 360° Equirectangular Image File"}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                Supports JPG, PNG (Recommended resolution: 4096×2048 or higher)
              </div>

              {previewUrl && (
                <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', height: '120px', position: 'relative' }}>
                  <img src={previewUrl} alt="360 Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: '6px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', color: '#00F0FF' }}>
                    360° Photo Loaded
                  </div>
                </div>
              )}

              {isUploading && (
                <div style={{ marginTop: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', overflow: 'hidden', height: '8px' }}>
                  <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #0066FF, #00F0FF)', transition: 'width 0.3s' }} />
                </div>
              )}
            </div>

            {/* 2. Metadata Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UIET Robotics Lab Entrance"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '13px' }}
                >
                  <option value="Academic Block">Academic Block</option>
                  <option value="Auditorium & Summit Venue">Auditorium & Summit Venue</option>
                  <option value="Administrative Block">Administrative Block</option>
                  <option value="Library Block">Library Block</option>
                  <option value="Hostels & Canteen">Hostels & Canteen</option>
                  <option value="Campus Gateway">Campus Gateway</option>
                  <option value="Grounds & Lawns">Grounds & Lawns</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>Latitude & Longitude</label>
                  <button type="button" onClick={handleUseCurrentLocation} style={{ background: 'transparent', border: 'none', color: '#00F0FF', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                    📍 Auto GPS
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" style={{ flex: 1, background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px', color: '#FFF', fontSize: '13px' }} />
                  <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" style={{ flex: 1, background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px', color: '#FFF', fontSize: '13px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'block', marginBottom: '6px' }}>
                  Node Unique ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. uiet_robotics_360"
                  value={nodeId}
                  onChange={(e) => setNodeId(e.target.value)}
                  style={{ width: '100%', background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#FFF', fontSize: '13px' }}
                />
              </div>
            </div>

            {/* 3. Hotspot Walking Arrow Linker */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#00F0FF', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={16} />
                <span>Add Walking Arrow Hotspots to Adjacent Nodes</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                <select
                  value={newHsTarget}
                  onChange={(e) => setNewHsTarget(e.target.value)}
                  style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px', color: '#FFF', fontSize: '12px' }}
                >
                  <option value="">Select Destination Node...</option>
                  {Object.values(allNodes).map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Arrow Tooltip (e.g. Walk to Library)"
                  value={newHsText}
                  onChange={(e) => setNewHsText(e.target.value)}
                  style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px', color: '#FFF', fontSize: '12px' }}
                />

                <input
                  type="number"
                  placeholder="Yaw (0-360°)"
                  value={newHsYaw}
                  onChange={(e) => setNewHsYaw(e.target.value)}
                  style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px', color: '#FFF', fontSize: '12px' }}
                  title="Horizontal angle in 360 space (0 = North, 90 = East, etc.)"
                />

                <input
                  type="number"
                  placeholder="Pitch (-45 to 45°)"
                  value={newHsPitch}
                  onChange={(e) => setNewHsPitch(e.target.value)}
                  style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '8px', color: '#FFF', fontSize: '12px' }}
                  title="Vertical height angle (-10 for ground arrow)"
                />

                <button
                  type="button"
                  onClick={handleAddHotspot}
                  style={{ background: '#0066FF', color: '#FFF', border: 'none', borderRadius: '8px', padding: '8px 14px', fontWeight: 800, cursor: 'pointer', fontSize: '12px' }}
                >
                  + Add Link
                </button>
              </div>

              {/* Added Hotspots Table */}
              {hotspots.length > 0 && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {hotspots.map((hs, idx) => (
                    <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                      <div>
                        <strong>➡️ {hs.text}</strong> → Destination: <span style={{ color: '#00F0FF' }}>{allNodes[hs.targetNodeId]?.name || hs.targetNodeId}</span> (Yaw: {hs.yaw}°, Pitch: {hs.pitch}°)
                      </div>
                      <button type="button" onClick={() => handleRemoveHotspot(idx)} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading}
              style={{
                padding: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                color: '#FFF',
                border: 'none',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              <Save size={20} />
              <span>{isUploading ? "Uploading & Saving 360 Location..." : "Publish 360 Location to Platform"}</span>
            </button>
          </form>
        )}

        {/* Tab 2: Manage Existing Nodes */}
        {activeTab === 'manage' && (
          <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.values(allNodes).map((node) => (
              <div
                key={node.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={node.panoramaUrl}
                    alt={node.name}
                    style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '10px', color: '#00F0FF', fontWeight: 800, textTransform: 'uppercase' }}>{node.category}</span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#FFF' }}>{node.name}</h4>
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                      GPS: {node.lat}, {node.lng} • Hotspots: {node.hotspots?.length || 0}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {onOpenPreview360 && (
                    <button
                      onClick={() => onOpenPreview360(node)}
                      style={{ background: 'rgba(0, 240, 255, 0.15)', border: '1px solid #00F0FF', color: '#00F0FF', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={14} /> Preview 360
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNode(node.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
