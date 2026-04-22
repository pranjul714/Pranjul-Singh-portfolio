import React from "react";
import { motion } from "framer-motion";

export default function Navbar({ scrollToSection, activeSection }) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.div
      initial={{ y: -60, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 w-full flex justify-center z-50 px-6"
    >
      <nav
        className="relative flex items-center justify-between 
        w-full max-w-6xl px-8 py-3 
        bg-transparent backdrop-blur-md
        rounded-full"
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => scrollToSection("home")}
          className="font-semibold text-lg tracking-tight text-white cursor-pointer"
        >
          Pranjul <span className="text-emerald-400">Singh</span>
        </motion.div>

        {/* Navigation */}
        <div className="relative flex items-center gap-2 rounded-full p-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative px-6 py-2 rounded-full text-sm font-medium"
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive
                      ? "text-emerald-400"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </motion.div>
  );
}
