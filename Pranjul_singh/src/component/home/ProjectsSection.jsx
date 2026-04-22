import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Code2, Rocket, Globe } from "lucide-react";

export default function ProjectsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const projects = [
    {
      title: "Music Player",
      desc: "Basic",
      tech: ["Html", "Css", "JavaScript"],
      icon: <Rocket className="text-emerald-400" size={24} />,
      github: "https://github.com/pranjul714/Music-Player",
      live: "#"
    },
    {
      title: "Diagnostic Tests Booking app",
      desc: "",
      tech: ["React", "Express", "Node"],
      icon: <Code2 className="text-blue-400" size={24} />,
      github: "https://github.com/pranjul714/Diagnostic-Lab-Tests-Booking-app",
      live: "#"
    },
    {
      title: "Road Trip Planner",
      desc: "",
      tech: ["React", "Tailwind", "Node"],
      icon: <Globe className="text-purple-400" size={24} />,
      github: "https://github.com/pranjul714/ROADTRIP",
      live: "https://road-trip-planner-alpha.vercel.app/register"
    }
  ];

  return (
    <section className="relative min-h-screen w-full px-6 lg:px-24 py-32 overflow-hidden
      bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#021f1a]">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Featured <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Projects</span>
          </h2>
          <p className="text-emerald-100/60 text-lg max-w-2xl mx-auto font-medium">
            Innovative digital solutions crafted with modern full-stack architectures.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ y: -12 }}
              className="group relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 
                         rounded-[2.5rem] p-8 transition-all duration-500 hover:border-emerald-500/30 
                         hover:bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
              {/* Card Header: Icon & Links */}
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-white/[0.05] rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                  {project.icon}
                </div>
                <div className="flex gap-3">
                  <a href={project.github} className="p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all">
                    <Github size={20} />
                  </a>
                  <a href={project.live} className="p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-emerald-100/60 leading-relaxed mb-8 text-sm">
                {project.desc}
              </p>

              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 
                               text-emerald-400 px-4 py-1.5 rounded-xl border border-emerald-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
