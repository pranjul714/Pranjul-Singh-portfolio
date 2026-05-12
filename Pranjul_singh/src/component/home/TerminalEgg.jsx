import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal as TerminalIcon, X, Maximize2, Minus } from "lucide-react";

export default function TerminalEgg() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { type: "output", text: "Welcome to PranjulOS v1.0.0" },
    { type: "output", text: "Type 'help' to see available commands." },
  ]);
  
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  // Lock scroll when terminal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleCommand = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const cmd = input.trim().toLowerCase();
      let output = "";

      switch (cmd) {
        case "help":
          output = "Available commands: help, about, skills, contact, clear, whoami, sudo rm -rf /";
          break;
        case "about":
          output = "Pranjul Singh: A Full-Stack Engineer passionate about React, Node.js, and clean architecture.";
          break;
        case "skills":
          output = "React, Node.js, Express, MongoDB, TailwindCSS, GSAP, Next.js";
          break;
        case "contact":
          output = "Email: pranjulsingh38@email.com | LinkedIn: /in/pranjulsingh714/";
          break;
        case "whoami":
          output = "guest_user_" + Math.floor(Math.random() * 1000);
          break;
        case "sudo rm -rf /":
          output = "Nice try. Permission denied. This incident will be reported. 🚨";
          break;
        case "clear":
          setHistory([]);
          setInput("");
          return;
        default:
          output = `Command not found: ${cmd}. Type 'help' for available commands.`;
      }

      setHistory([...history, { type: "input", text: cmd }, { type: "output", text: output }]);
      setInput("");
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-[9999] bg-emerald-950 border border-emerald-500/50 p-4 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.3)] text-emerald-400 cursor-pointer transition-all ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
      >
        <TerminalIcon size={24} />
      </motion.button>

      {/* Terminal Window & Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click-outside overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Terminal Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 lg:translate-x-0 lg:translate-y-0 lg:bottom-24 lg:right-8 z-[9999] w-[95vw] md:w-[600px] h-[450px] bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
            >
            {/* macOS Style Header */}
            <div className="bg-[#1A1A1A] px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
                <button className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400" />
                <button className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400" />
              </div>
              <p className="text-xs text-white/50 font-mono tracking-widest">guest@pranjul-portfolio:~</p>
              <div className="w-8" /> {/* Placeholder for balance */}
            </div>

            {/* Terminal Body */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm hide-scrollbar bg-black/50">
              {history.map((line, i) => (
                <div key={i} className="mb-2">
                  {line.type === "input" ? (
                    <div className="flex text-emerald-400">
                      <span className="mr-2">pranjul@portfolio:~$</span>
                      <span>{line.text}</span>
                    </div>
                  ) : (
                    <div className="text-emerald-100/70">{line.text}</div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Terminal Input */}
            <div className="p-4 bg-[#1A1A1A] border-t border-white/5 flex items-center font-mono text-sm">
              <span className="text-emerald-400 mr-2">pranjul@portfolio:~$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                autoFocus
                spellCheck="false"
                autoComplete="off"
                className="flex-1 bg-transparent border-none outline-none text-white caret-emerald-400"
              />
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
