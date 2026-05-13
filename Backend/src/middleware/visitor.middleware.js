import { Visitor } from "../models/visitor.model.js";

export const trackVisitor = async (req, res, next) => {
  try {
    // Skip non-GET requests, assets, and admin routes
    if (req.method !== "GET" || req.url.includes('.') || req.url.startsWith('/api/admin')) {
      return next();
    }

    // Aggressive IP Extraction (Priority: X-Forwarded-For -> req.ip -> remoteAddress)
    let ip = (req.headers['x-forwarded-for'] || "").split(',')[0].trim() || 
             req.ip || 
             req.socket.remoteAddress || 
             "";
    
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    const userAgent = req.headers['user-agent'] || "Unknown";
    const referrer = req.headers['referer'] || "Direct";

    // ... (Browser/OS detection logic stays the same) ...
    let browser = "Unknown Browser";
    let os = "Unknown OS";
    let deviceType = "Desktop";

    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";
    else if (userAgent.includes("Edge")) browser = "Edge";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";

    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac OS")) os = "Mac OS";
    else if (userAgent.includes("Android")) { os = "Android"; deviceType = "Mobile"; }
    else if (userAgent.includes("iPhone")) { os = "iOS"; deviceType = "Mobile"; }
    else if (userAgent.includes("Linux")) os = "Linux";

    // Deduplication (30 mins)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await Visitor.findOne({ 
      ip, 
      browser, 
      os,
      createdAt: { $gte: thirtyMinutesAgo } 
    });

    if (recentVisit) {
      recentVisit.lastActive = new Date();
      // Add a heartbeat/resume action if not already present in the last 5 minutes
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentAction = recentVisit.actions.find(a => a.timestamp >= fiveMinsAgo);
      
      if (!recentAction) {
        recentVisit.actions.push({ actionType: 'view', name: 'Session Active', timestamp: new Date() });
      }
      
      await recentVisit.save().catch(() => {});
      return next();
    }

    // Geo-lookup Fallback for Development
    let geoData = {};
    let targetIp = ip;
    if (!ip || ["127.0.0.1", "::1", "localhost", "34.82.84.118"].includes(ip)) {
      // If IP is local or server IP (like the Google IP you saw), use a fallback for testing
      targetIp = "122.161.192.1"; 
    }

    try {
      const response = await fetch(`http://ip-api.com/json/${targetIp}`);
      if (response.ok) geoData = await response.json();
    } catch (err) {
      console.error("Geo lookup failed:", err.message);
    }

    // Create new visitor entry with INITIAL lastActive and DEFAULT action
    const newVisitor = await Visitor.create({
      ip,
      city: geoData.city || "Unknown",
      region: geoData.regionName || "Unknown",
      country: geoData.country || "Unknown",
      browser,
      os,
      deviceType,
      referrer,
      lat: geoData.lat,
      lon: geoData.lon,
      lastActive: new Date(),
      actions: [{ actionType: 'view', name: 'Website Visit', timestamp: new Date() }]
    });

    // Production-ready Socket Notification: 
    // Emit only to the admin-side if possible, or use a generic event
    const io = req.app.get("io");
    if (io) {
      io.emit("new_visitor", {
        _id: newVisitor._id,
        city: newVisitor.city,
        country: newVisitor.country,
        device: newVisitor.deviceType,
        os: newVisitor.os,
        lat: newVisitor.lat,
        lon: newVisitor.lon
      });
    }

    next();
  } catch (error) {
    next();
  }
};
