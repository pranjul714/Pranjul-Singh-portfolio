import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

interface NavbarProps {
  scrollToSection: (id: string) => void;
  activeSection: string;
}

export default function Navbar({ scrollToSection, activeSection }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit">
      <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 px-8 py-3 rounded-full shadow-2xl flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`text-sm font-semibold transition-all relative ${
              activeSection === item.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
