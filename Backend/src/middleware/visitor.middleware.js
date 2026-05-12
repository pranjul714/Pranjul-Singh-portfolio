import { Visitor } from "../models/visitor.model.js";

export const trackVisitor = async (req, res, next) => {
  try {
    // Only track page visits (usually the main frontend requests or specific API pings)
    // We avoid tracking every single static file or preflight request
    if (req.method !== "GET") return next();
    
    // Skip common internal/static requests if needed
    if (req.url.includes('.') || req.url.startsWith('/admin')) return next();

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "";
    const userAgent = req.headers['user-agent'] || "Unknown";
    const referrer = req.headers['referer'] || "Direct";

    // Approximate Location fetch using ip-api.com (Native Fetch)
    // Note: Localhost (::1 or 127.0.0.1) will return "Reserved Range"
    let geoData = {};
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      if (response.ok) {
        geoData = await response.json();
      }
    } catch (err) {
      console.error("Geo lookup failed:", err.message);
    }

    // Create visitor entry asynchronously so it doesn't block the response
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
    // Silent error to ensure website still loads
    next();
  }
};
