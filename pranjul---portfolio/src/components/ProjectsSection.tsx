import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code } from "lucide-react";
import ParticleBackground from "./ParticleBackground";

export default function ProjectsSection() {
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

  return (
    <section className="py-32 px-6 lg:px-24 bg-black">
      <div className="max-w-7xl mx-auto">
         <ParticleBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white">Selected <span className="text-zinc-600">Works</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 hover:bg-zinc-900 transition-all cursor-pointer shadow-xl"
            >
              <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:bg-white group-hover:text-black transition-all">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
              <p className="text-zinc-500 mb-6 line-clamp-2">{project.desc}</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest font-black text-zinc-400 border border-white/5 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all"><ExternalLink size={18} /></a>
                <a href="#" className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-all"><Github size={18} /></a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
