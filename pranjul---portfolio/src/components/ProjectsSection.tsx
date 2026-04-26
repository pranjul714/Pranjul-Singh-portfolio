import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code } from "lucide-react";

// Particle Background Component (Commonly missed or causes overlay issues)
const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a,black)]" />
    {/* Simple animated dots for visual effect */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/10 rounded-full"
        style={{
          width: Math.random() * 4 + "px",
          height: Math.random() * 4 + "px",
          left: Math.random() * 100 + "%",
          top: Math.random() * 100 + "%",
        }}
        animate={{
          y: [0, -30, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: Math.random() * 5 + 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

const projects = [
  {
    title: "E-Commerce System",
    desc: "Full-stack platform with real-time inventory and payment gateway integration.",
    tags: ["React", "Node.js", "MongoDB"],
    link: "#",
  },
  {
    title: "AI Analysis Tool",
    desc: "Data visualization dashboard for AI model performance and metrics.",
    tags: ["TypeScript", "D3.js", "Python"],
    link: "#",
  },
  {
    title: "Crypto Wallet",
    desc: "Secure decentralized wallet supporting multiple blockchain protocols.",
    tags: ["Next.js", "Web3.js", "Solidity"],
    link: "#",
  },
];

export default function ProjectsSection() {
  return (
    <section className="relative py-32 px-6 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white">
            Selected <span className="text-zinc-600">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 hover:bg-zinc-900/80 transition-all cursor-pointer shadow-2xl"
            >
              <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                <Code size={24} />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {project.title}
              </h3>
              
              <p className="text-zinc-500 mb-6 line-clamp-2 leading-relaxed">
                {project.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest font-black text-zinc-400 border border-white/10 px-3 py-1 rounded-full bg-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={project.link}
                  className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <ExternalLink size={18} />
                </a>
                <a
                  href="#"
                  className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Github size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
