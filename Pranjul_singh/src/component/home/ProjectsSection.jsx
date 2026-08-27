import React from "react";
import { createPortal } from "react-dom";
import { getProjects } from "../../services/api";
import { trackAction } from "../../services/tracking.js";
import { ExternalLink, Github, Code2, Rocket, Globe, X } from "lucide-react";
import { useTextReveal, useStaggerCards } from "../../hooks/useScrollAnimation";

export default function ProjectsSection() {
  const headerRef = useTextReveal();
  
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedProject, setSelectedProject] = React.useState(null);

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

  React.useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);


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
                onClick={() => setSelectedProject(project)}
                className="gsap-card group relative bg-white/[0.03] backdrop-blur-md border border-white/10 
                           rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 transition-all duration-500 hover:-translate-y-3 hover:border-emerald-500/30 
                           hover:bg-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col cursor-pointer"
              >
                {/* Project Image Container */}
                {project.image && (
                  <div className="relative w-full h-40 lg:h-48 mb-6 overflow-hidden rounded-2xl border border-white/5 bg-black/20">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
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
                        className="p-2 lg:p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all z-10 relative"
                        onClick={(e) => { e.stopPropagation(); trackAction('click', `Project GitHub: ${project.title}`); }}
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {project.live && (
                      <a 
                        href={project.live} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 lg:p-2.5 text-emerald-100/50 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all z-10 relative"
                        onClick={(e) => { e.stopPropagation(); trackAction('click', `Project Live: ${project.title}`); }}
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

      {/* Premium Project Modal */}
      {selectedProject && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop with strong blur and fade-in */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-500 cursor-pointer"
            onClick={() => setSelectedProject(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(16,211,153,0.15)] z-10 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-white/5 hover:bg-white/20 hover:scale-110 rounded-full text-white/70 hover:text-white transition-all z-20 backdrop-blur-md border border-white/10"
            >
              <X size={20} />
            </button>

            {/* Left Column: Image Area */}
            {selectedProject.image && (
              <div className="w-full md:w-1/2 h-64 md:h-auto bg-black/40 relative flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-white/5 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-50"></div>
                {/* Decorative glow behind image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            )}

            {/* Right Column: Content Area */}
            <div className={`w-full ${selectedProject.image ? 'md:w-1/2' : 'max-w-2xl mx-auto'} flex flex-col p-8 md:p-10 lg:p-12 overflow-y-auto`}>
              
              {/* Category & Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,211,153,0.1)]">
                  <IconRenderer iconName={selectedProject.icon} />
                </div>
                <span className="text-emerald-400 font-semibold tracking-widest uppercase text-xs">
                  {selectedProject.category || 'Featured Project'}
                </span>
              </div>
              
              {/* Title */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
                {selectedProject.title}
              </h3>
              
              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedProject.tech?.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/[0.03] 
                               text-emerald-100/80 px-4 py-2 rounded-lg border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Description */}
              <div className="text-emerald-100/60 leading-relaxed text-base md:text-lg mb-10 whitespace-pre-line flex-grow font-medium">
                {selectedProject.desc}
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                {selectedProject.live && (
                  <a 
                    href={selectedProject.live} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex justify-center items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 rounded-xl text-zinc-950 font-bold transition-all shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:-translate-y-1"
                    onClick={(e) => { e.stopPropagation(); trackAction('click', `Modal Live: ${selectedProject.title}`); }}
                  >
                    <ExternalLink size={20} />
                    <span>Live Preview</span>
                  </a>
                )}
                {selectedProject.github && (
                  <a 
                    href={selectedProject.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex justify-center items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all hover:-translate-y-1"
                    onClick={(e) => { e.stopPropagation(); trackAction('click', `Modal GitHub: ${selectedProject.title}`); }}
                  >
                    <Github size={20} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
