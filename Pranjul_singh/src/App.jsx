import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "./component/PageLoader.jsx";
import CustomCursor from "./component/CustomCursor.jsx";
import Floating3D from "./component/Floating3D.jsx";

// Lazy-loaded components
const Home = lazy(() => import("./component/home/Home.jsx"));
const NotFound = lazy(() => import("./component/NotFound.jsx"));
const TerminalEgg = lazy(() => import("./component/home/TerminalEgg.jsx"));

import { trackAction } from "./services/tracking.js";

export default function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Track initial landing
    trackAction('view', 'Portfolio Landing');

    // Session Heartbeat (Every 30 seconds)
    const heartbeat = setInterval(() => {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/heartbeat`, {
        method: 'POST',
      }).catch(() => {}); // Silent fail
    }, 30000);

    // Intro timer
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      setShowIntro(false);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(heartbeat);
    };
  }, []);

  return (
    <Router>
      <CustomCursor />
      <PageLoader isLoading={showIntro} />
      <Floating3D />
      <div style={{ opacity: showIntro ? 0 : 1, transition: "opacity 1s ease" }}>
        <Suspense fallback={<PageLoader isLoading={true} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <TerminalEgg />
        </Suspense>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
}