import { Visitor } from "../models/visitor.model.js";

// ──────────────────────────────────────────────
// GEO LOOKUP — 3-Layer Fallback System
// Layer 1: ipinfo.io  (HTTPS, 50k free/month)
// Layer 2: ip-api.com (HTTP,  45 req/min)
// Layer 3: ipapi.co   (HTTPS, 1k free/day)
// ──────────────────────────────────────────────
const getGeoData = async (ip) => {
  // ── Layer 1: ipinfo.io ───────────────────────
  try {
    const token = process.env.IPINFO_TOKEN || ""; // Optional: add token for higher limits
    const url = token
      ? `https://ipinfo.io/${ip}/json?token=${token}`
      : `https://ipinfo.io/${ip}/json`;

    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.city && data.city !== "Unknown") {
        // ipinfo returns "lat,lon" as a single string in data.loc
        const [lat, lon] = (data.loc || ",").split(",").map(Number);
        return {
          city:       data.city       || "Unknown",
          regionName: data.region     || "Unknown",
          country:    data.country    || "Unknown",
          lat:        lat             || null,
          lon:        lon             || null,
          source:     "ipinfo"
        };
      }
    }
  } catch (_) {}

  // ── Layer 2: ip-api.com ──────────────────────
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,regionName,country,lat,lon`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.status === "success") {
        return {
          city:       data.city       || "Unknown",
          regionName: data.regionName || "Unknown",
          country:    data.country    || "Unknown",
          lat:        data.lat        || null,
          lon:        data.lon        || null,
          source:     "ip-api"
        };
      }
    }
  } catch (_) {}

  // ── Layer 3: ipapi.co ────────────────────────
  try {
    const res = await fetch(
      `https://ipapi.co/${ip}/json/`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error && data.city) {
        return {
          city:       data.city                || "Unknown",
          regionName: data.region              || "Unknown",
          country:    data.country_name        || "Unknown",
          lat:        data.latitude            || null,
          lon:        data.longitude           || null,
          source:     "ipapi.co"
        };
      }
    }
  } catch (_) {}

  // ── All layers failed ────────────────────────
  return { city: "Unknown", regionName: "Unknown", country: "Unknown", lat: null, lon: null, source: "none" };
};


export const trackVisitor = async (req, res, next) => {
  try {
    // Skip non-GET requests, static assets, and admin routes
    if (
      req.method !== "GET" ||
      req.url.includes(".") ||
      req.url.startsWith("/api/admin")
    ) {
      return next();
    }

    // ── IP Extraction ──────────────────────────
    let ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
             req.ip ||
             req.socket.remoteAddress ||
             "";

    if (ip.startsWith("::ffff:")) ip = ip.replace("::ffff:", "");

    // ── User Agent Parsing ─────────────────────
    const userAgent = req.headers["user-agent"] || "Unknown";
    const referrer  = req.headers["referer"]    || "Direct";

    let browser    = "Unknown Browser";
    let os         = "Unknown OS";
    let deviceType = "Desktop";

    if      (userAgent.includes("Firefox"))                   browser = "Firefox";
    else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";
    else if (userAgent.includes("Edge"))                      browser = "Edge";
    else if (userAgent.includes("Chrome"))                    browser = "Chrome";
    else if (userAgent.includes("Safari"))                    browser = "Safari";

    if      (userAgent.includes("Windows"))  os = "Windows";
    else if (userAgent.includes("Mac OS"))   os = "Mac OS";
    else if (userAgent.includes("Android"))  { os = "Android"; deviceType = "Mobile"; }
    else if (userAgent.includes("iPhone"))   { os = "iOS";     deviceType = "Mobile"; }
    else if (userAgent.includes("iPad"))     { os = "iPadOS";  deviceType = "Tablet"; }
    else if (userAgent.includes("Linux"))    os = "Linux";

    // ── Deduplication (30 min window) ──────────
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const recentVisit = await Visitor.findOne({
      ip,
      browser,
      os,
      createdAt: { $gte: thirtyMinutesAgo },
    });

    if (recentVisit) {
      recentVisit.lastActive = new Date();
      const fiveMinsAgo    = new Date(Date.now() - 5 * 60 * 1000);
      const recentAction   = recentVisit.actions.find(a => a.timestamp >= fiveMinsAgo);
      if (!recentAction) {
        recentVisit.actions.push({
          actionType: "view",
          name:       "Session Active",
          timestamp:  new Date(),
        });
      }
      await recentVisit.save().catch(() => {});
      return next();
    }

    // ── Geo Lookup ─────────────────────────────
    // Use a real public IP for local development testing
    const isLocalIp = !ip || ["127.0.0.1", "::1", "localhost"].includes(ip);
    const targetIp  = isLocalIp ? "122.161.192.1" : ip; // fallback: Delhi IP for local dev

    const geoData = await getGeoData(targetIp);

    if (isLocalIp) {
      console.log(`[Visitor] Local dev mode — using fallback IP. Geo: ${geoData.city}, ${geoData.country} (via ${geoData.source})`);
    } else {
      console.log(`[Visitor] New visitor ${ip} → ${geoData.city}, ${geoData.country} (via ${geoData.source})`);
    }

    // ── Create Visitor Record ──────────────────
    const newVisitor = await Visitor.create({
      ip,
      city:       geoData.city,
      region:     geoData.regionName,
      country:    geoData.country,
      browser,
      os,
      deviceType,
      referrer,
      lat:        geoData.lat,
      lon:        geoData.lon,
      lastActive: new Date(),
      actions: [{ actionType: "view", name: "Website Visit", timestamp: new Date() }],
    });

    // ── Real-time Socket Notification ──────────
    const io = req.app.get("io");
    if (io) {
      io.emit("new_visitor", {
        _id:     newVisitor._id,
        ip:      isLocalIp ? "Dev/Local" : ip,
        city:    newVisitor.city,
        country: newVisitor.country,
        device:  newVisitor.deviceType,
        os:      newVisitor.os,
        lat:     newVisitor.lat,
        lon:     newVisitor.lon,
      });
    }

    next();
  } catch (error) {
    console.error("[Visitor Middleware Error]", error.message);
    next();
  }
};
