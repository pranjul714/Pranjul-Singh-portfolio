import React from "react";
import { motion } from "framer-motion";
import images from "../../assets/img";
import { User, Award, CheckCircle2 } from "lucide-react";

export default function About() {
  // Stats defined correctly to avoid "Unexpected token" error
  const statsData = [
    { label: "", value: "fresher", icon: <Award size={20} /> },
    { label: "Projects Completed", value: "4+", icon: <CheckCircle2 size={20} /> },
    { label: "Technologies", value: "6+", icon: <User size={20} /> },
  ];

  return (
    <section className="relative py-32 px-6 lg:px-24 bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#021f1a] overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* LEFT SIDE – Image with Orbital Particles */}
        <div className="relative flex justify-center order-2 lg:order-1">
          <div className="relative w-[320px] h-[380px] lg:w-[420px] lg:h-[500px] flex items-center justify-center">
            
            {/* ROTATING PARTICLE RING */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-[110%] h-[110%] z-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#fff]" />
              <div className="absolute inset-0 border border-emerald-500/10 rounded-full" />
            </motion.div>

            {/* DARK GLASS CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 h-full w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex items-center justify-center p-8 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent pointer-events-none" />
              <motion.img
                src={images.cartoon01}
                alt="About Me"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 max-h-[85%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-110"
              />
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE – Content */}
        <div className="space-y-8 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tight">
              About <span className="text-emerald-400">Me</span>
            </h2>
            <div className="w-20 h-1.5 bg-emerald-500 rounded-full" />
          </motion.div>

          <motion.p
            className="text-lg text-emerald-100/70 leading-relaxed max-w-xl font-medium"
          >
            I am a passionate Full-Stack Developer focused on building
            scalable web applications with clean architecture and elegant
            user experiences.
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, borderColor: "rgba(52,211,153,0.4)" }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center transition-all"
              >
                <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-2xl mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-xs text-emerald-200/50 uppercase tracking-widest mt-1 font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16,185,129,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-10 py-4 rounded-2xl font-bold shadow-xl transition-all"
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </section>
  );
}
