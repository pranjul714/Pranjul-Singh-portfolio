import React from "react";
import { motion } from "framer-motion";
import { getProjects } from "../../services/api";
import { ExternalLink, Github, Code2, Rocket, Globe } from "lucide-react";
import { io } from "socket.io-client";

export default function ProjectsSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects();
        setProjects(data);
      } catch (error) {
        // Silently handle or use a UI toast if needed
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    const socketUrl = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "");
    const socket = io(socketUrl);
    
    socket.on("data_updated", (data) => {
      if (data.type === "projects") fetchProjects();
    });

    return () => socket.disconnect();
  }, []);


  const IconRenderer = ({ iconName }) => {
    const icons = {
      Rocket: <Rocket size={24} />,
      Globe: <Globe size={24} />,
      Code2: <Code2 size={24} />,
      ExternalLink: <ExternalLink size={24} />,
      Github: <Github size={24} />
    };
    return icons[iconName] || <Code2 size={24} />;
  };

  return (
    <section className="relative min-h-screen w-full px-6 lg:px-24 py-32 overflow-hidden">

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
          viewport={{ once: true, amount: 0.05 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20"
        >
          {loading ? (
            // Project Skeletons
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 animate-pulse">
                <div className="w-full h-48 bg-white/5 rounded-2xl mb-6"></div>
                <div className="h-6 w-3/4 bg-white/5 rounded mb-4"></div>
                <div className="h-4 w-full bg-white/5 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-white/5 rounded mb-8"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                  <div className="h-6 w-16 bg-white/5 rounded-full"></div>
                </div>
              </div>
            ))
          ) : projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ y: -12 }}
                className="group relative bg-white/[0.03] backdrop-blur-md border border-white/10 
                           rounded-[2.5rem] p-8 transition-all duration-500 hover:border-emerald-500/30 
                           hover:bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col"
              >
                {/* Project Image Container */}
                {project.image && (
                  <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl border border-white/5">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                       <span className="text-white font-bold text-xs uppercase tracking-widest">{project.category || 'Portfolio Project'}</span>
                    </div>
                  </div>
                )}

                {/* Card Header: Icon & Links */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-white/[0.05] rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                    <IconRenderer iconName={project.icon} />
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all">
                        <Github size={20} />
                      </a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer" className="p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-emerald-100/60 leading-relaxed mb-8 text-sm flex-grow">
                  {project.desc}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {project.tech?.map((tech, i) => (
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
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
               <p className="text-emerald-100/40 text-lg">No projects found. Add some in your Admin Panel!</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
