import React from "react";
import { getProjects } from "../../services/api";
import { trackAction } from "../../services/tracking.js";
import { ExternalLink, Github, Code2, Rocket, Globe } from "lucide-react";
import { useTextReveal, useStaggerCards } from "../../hooks/useScrollAnimation";

export default function ProjectsSection() {
  const headerRef = useTextReveal();
  
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const gridRef = useStaggerCards(".gsap-card", [projects]);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects();
        setProjects(data);
      } catch (error) {
        // Data loads on page visit — no action needed on error
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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
    <section className="relative min-h-screen w-full px-6 lg:px-24 py-20 lg:py-32 overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div
          ref={headerRef}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Featured <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Projects</span>
          </h2>
          <p className="text-emerald-100/60 text-base lg:text-lg max-w-2xl mx-auto font-medium">
            Innovative digital solutions crafted with modern full-stack architectures.
          </p>
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-20"
        >
          {loading ? (
            // Project Skeletons
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 animate-pulse">
                <div className="w-full h-40 lg:h-48 bg-white/5 rounded-2xl mb-6"></div>
                <div className="h-6 w-3/4 bg-white/5 rounded mb-4"></div>
                <div className="h-4 w-full bg-white/5 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-white/5 rounded mb-8"></div>
              </div>
            ))
          ) : projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={index}
                className="gsap-card group relative bg-white/[0.03] backdrop-blur-md border border-white/10 
                           rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/30 
                           hover:bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col"
              >
                {/* Project Image Container */}
                {project.image && (
                  <div className="relative w-full h-40 lg:h-48 mb-6 overflow-hidden rounded-2xl border border-white/5">
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
                  <div className="p-3 lg:p-4 bg-white/[0.05] rounded-2xl group-hover:bg-emerald-500/10 transition-colors">
                    <IconRenderer iconName={project.icon} />
                  </div>
                  <div className="flex gap-2 lg:gap-3">
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 lg:p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
                        onClick={() => trackAction('click', `Project GitHub: ${project.title}`)}
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.live && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 lg:p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
                        onClick={() => trackAction('click', `Project Live: ${project.title}`)}
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-emerald-100/60 leading-relaxed mb-8 text-sm flex-grow line-clamp-3">
                  {project.desc}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {project.tech?.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 
                                 text-emerald-400 px-3 lg:px-4 py-1.5 rounded-xl border border-emerald-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2.5rem]">
               <p className="text-emerald-100/40 text-lg">No projects found. Add some in your Admin Panel!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
