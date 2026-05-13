import React, { useEffect, useRef } from 'react';

const VisitorMap = ({ visitors }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    // Wait for Leaflet to load from CDN
    if (!window.L || mapInstance.current) return;

    // Initialize Map
    mapInstance.current = window.L.map('visitor-map', {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false
    });

    // Add Light Mode Tiles (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!window.L || !mapInstance.current) return;

    // Filter visitors with valid coordinates
    const activeVisitors = visitors.filter(v => v.lat && v.lon);

    // Update markers
    activeVisitors.forEach((visitor, index) => {
      const id = visitor._id || `${visitor.lat}-${visitor.lon}`;
      
      if (!markersRef.current[id]) {
        // Create custom glowing marker
        const icon = window.L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="marker-pin"></div><div class="marker-pulse"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = window.L.marker([visitor.lat, visitor.lon], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>${visitor.city}, ${visitor.country}</b><br/>${visitor.browser} on ${visitor.os}`);
        
        markersRef.current[id] = marker;
      }
    });

    // Reliable Auto-focus on the LATEST active visitor
    if (activeVisitors.length > 0 && mapInstance.current) {
      const latest = activeVisitors[0];
      const latestMarker = markersRef.current[latest._id || `${latest.lat}-${latest.lon}`];
      
      mapInstance.current.setView([latest.lat, latest.lon], 6, { animate: true });
      if (latestMarker) latestMarker.openPopup();
    }

    // Cleanup old markers (if needed)
  }, [visitors]);

  return (
    <div className="visitor-map-container glass-card">
      <div className="section-header">
        <h3>Real-time Visitor Map</h3>
        <span className="live-indicator">
          <span className="dot"></span> LIVE
        </span>
      </div>
      
      <div id="visitor-map" style={{ height: '400px', width: '100%', borderRadius: '12px', background: '#f5f5f5' }}></div>

      <style dangerouslySetInnerHTML={{ __html: `
        .visitor-map-container {
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .custom-div-icon {
          background: none;
          border: none;
        }
        .marker-pin {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          position: absolute;
          left: 6px;
          top: 6px;
          box-shadow: 0 0 10px #10b981;
          z-index: 2;
        }
        .marker-pulse {
          width: 20px;
          height: 20px;
          background: rgba(16, 185, 129, 0.4);
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 0;
          animation: map-pulse 2s infinite;
          z-index: 1;
        }
        @keyframes map-pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .leaflet-container {
          background: #fff !important;
        }
      `}} />
    </div>
  );
};

export default VisitorMap;
