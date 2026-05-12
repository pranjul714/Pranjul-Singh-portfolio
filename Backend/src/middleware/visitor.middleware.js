import { Visitor } from "../models/visitor.model.js";

export const trackVisitor = async (req, res, next) => {
  try {
    if (req.method !== "GET") return next();
    
    if (req.url.includes('.') || req.url.startsWith('/admin')) return next();

    // Extract IP address correctly, handling proxies and comma-separated lists
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    if (ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }
    // Remove IPv6 prefix if present
    if (ip.startsWith('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    const userAgent = req.headers['user-agent'] || "Unknown";
    const referrer = req.headers['referer'] || "Direct";

    // Skip geo-lookup for localhost
    let geoData = {};
    if (ip !== "::1" && ip !== "127.0.0.1" && ip !== "localhost" && ip !== "") {
      try {
        const response = await fetch(`http://ip-api.com/json/${ip}`);
        if (response.ok) {
          geoData = await response.json();
        }
      } catch (err) {
        console.error("Geo lookup failed for IP:", ip, err.message);
      }
    } else {
      geoData = { city: "Localhost", regionName: "Internal", country: "Local" };
    }

    // Create visitor entry asynchronously
    Visitor.create({
      ip: ip,
      city: geoData.city || "Unknown",
      region: geoData.regionName || "Unknown",
      country: geoData.country || "Unknown",
      browser: userAgent,
      referrer: referrer,
    }).catch(err => console.error("Error saving visitor:", err));

    next();
  } catch (error) {
    next();
  }
};
