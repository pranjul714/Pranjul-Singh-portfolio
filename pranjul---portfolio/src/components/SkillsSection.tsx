import React from "react";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";

export default function SkillsSection() {
  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis"] },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Vite", "Figma"] },
  ];

  return (
    <section className="py-32 px-6 lg:px-24 bg-black">
      <div className="max-w-7xl mx-auto">
         <ParticleBackground />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-7xl font-extrabold text-white leading-tight">My <span className="text-zinc-400">Toolkit</span></h2>
            <p className="text-xl text-zinc-500 max-w-lg">
              Constantly evolving my stack to build the future of the web with cutting-edge technologies.
            </p>
          </motion.div>

          <div className="space-y-12">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.category}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-xs uppercase tracking-[0.3em] font-black text-white/40">{skill.category}</h3>
                <div className="flex flex-wrap gap-3">
                  {skill.items.map((item) => (
                    <motion.div
                      key={item}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)", color: "#000" }}
                      className="px-6 py-3 bg-zinc-900 border border-white/5 rounded-2xl text-white font-bold transition-all text-sm cursor-default"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
