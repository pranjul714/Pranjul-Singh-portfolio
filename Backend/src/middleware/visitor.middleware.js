import { Visitor } from "../models/visitor.model.js";

export const trackVisitor = async (req, res, next) => {
  try {
    // Skip non-GET requests, assets, and admin routes
    if (req.method !== "GET" || req.url.includes('.') || req.url.startsWith('/api/admin')) {
      return next();
    }

    // Extract IP address
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

    const userAgent = req.headers['user-agent'] || "Unknown";
    const referrer = req.headers['referer'] || "Direct";

    // Parse User Agent for OS, Browser, and Device
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

    // Deduplication: Check if this IP AND this specific Device/Browser visited in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await Visitor.findOne({ 
      ip, 
      browser, 
      os,
      createdAt: { $gte: thirtyMinutesAgo } 
    });

    if (recentVisit) {
      // Update last seen and move on
      recentVisit.set({ updatedAt: new Date() });
      recentVisit.save().catch(() => {});
      return next();
    }

    // Skip geo-lookup for localhost
    let geoData = {};
    if (ip && !["127.0.0.1", "::1", "localhost"].includes(ip)) {
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        if (response.ok) geoData = await response.json();
      } catch (err) {
        console.error("Geo lookup failed:", err.message);
      }
    } else {
      geoData = { city: "Localhost", regionName: "Internal", country: "Local" };
    }

    // Create new visitor entry
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
    });

    // Production-ready Socket Notification: 
    // Emit only to the admin-side if possible, or use a generic event
    const io = req.app.get("io");
    if (io) {
      io.emit("new_visitor", {
        city: newVisitor.city,
        country: newVisitor.country,
        device: newVisitor.deviceType,
        os: newVisitor.os
      });
    }

    next();
  } catch (error) {
    next();
  }
};
