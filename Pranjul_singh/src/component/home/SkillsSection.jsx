import React from "react";
import { motion } from "framer-motion";
import { Cpu, Code2, Database, Layout, Terminal, Globe, ShieldCheck } from "lucide-react";

export default function SkillsSection() {
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const skills = [
    { name: "React.js", icon: <Layout size={18} /> },
    { name: "Node.js", icon: <Terminal size={18} /> },
    { name: "Express.js", icon: <Cpu size={18} /> },
    { name: "MongoDB", icon: <Database size={18} /> },
    { name: "Tailwind CSS", icon: <Globe size={18} /> },
    { name: "REST APIs", icon: <ShieldCheck size={18} /> },
    { name: "Redux", icon: <Code2 size={18} /> },
    { name: "JavaScript", icon: <Code2 size={18} /> },
    { name: "Java", icon: <Terminal size={18} /> },
    { name: "Git & GitHub", icon: <Code2 size={18} /> },
    { name: "Responsive Design", icon: <Layout size={18} /> },
    { name: "Next.js", icon: <Cpu size={18} /> },
  ];

  return (
    <section className="relative min-h-screen w-full px-6 lg:px-24 py-32 overflow-hidden
      bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#021f1a]">

      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-20 space-y-4"
        >
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
            Technical <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Arsenal</span>
          </h2>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto" />
          <p className="text-emerald-100/60 text-lg pt-4 font-medium">
            The modern stack I use to bring digital ideas to life.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                borderColor: "rgba(52,211,153,0.5)",
                backgroundColor: "rgba(255,255,255,0.06)"
              }}
              className="group flex items-center gap-4 bg-white/[0.03] backdrop-blur-2xl border border-white/10
              rounded-2xl py-5 px-6 shadow-2xl transition-all duration-300 cursor-default"
            >
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-400 group-hover:text-emerald-950 transition-colors">
                {skill.icon}
              </div>
              <span className="font-bold text-emerald-50/90 group-hover:text-white transition-colors tracking-wide">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
