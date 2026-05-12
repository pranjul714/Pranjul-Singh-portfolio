import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar({ scrollToSection, activeSection }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id) => {
    scrollToSection(id);
    setIsOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ y: -60, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 lg:top-6 left-0 w-full flex justify-center z-50 px-0 lg:px-6"
      >
        <nav
          className="relative flex items-center justify-between 
          w-full max-w-6xl px-6 lg:px-8 py-4 lg:py-3 
          bg-black/50 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-md
          rounded-none lg:rounded-full border-b lg:border border-white/5 lg:border-white/10"
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("home")}
            className="font-bold text-xl tracking-tight text-white cursor-pointer z-50"
          >
            Pranjul <span className="text-emerald-400">Singh</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 rounded-full p-1">
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

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-white z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl lg:hidden flex flex-col items-center justify-center gap-8"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavClick(item.id)}
                className={`text-3xl font-bold transition-all ${
                  activeSection === item.id ? "text-emerald-400" : "text-white/50"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
