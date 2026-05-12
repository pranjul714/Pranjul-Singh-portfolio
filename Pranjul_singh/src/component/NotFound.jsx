import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center space-y-8 max-w-lg"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl inline-block">
            <AlertTriangle size={56} className="text-emerald-400" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <div className="space-y-3">
          <h1 className="text-8xl font-black text-white">
            4<span className="text-emerald-400">0</span>4
          </h1>
          <h2 className="text-2xl font-bold text-white/80">Page Not Found</h2>
          <p className="text-emerald-100/50 text-lg font-medium">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-10 py-4 rounded-2xl shadow-xl transition-colors"
        >
          <Home size={20} />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}
