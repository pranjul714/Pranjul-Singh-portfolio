import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar"; 
import { Tooltip } from "react-tooltip"; 
import "react-tooltip/dist/react-tooltip.css";
import { useScrollReveal } from "../../hooks/useScrollAnimation";
import { Github, ExternalLink } from "lucide-react";

export default function GithubGraph({ username = "pranjul714" }) {
  const containerRef = useScrollReveal();
  const [blockSize, setBlockSize] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBlockSize(11); 
      } else {
        setBlockSize(14); 
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Official GitHub Dark Theme Colors
  const explicitTheme = {
    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'], 
  };

  return (
    <section 
      ref={containerRef} 
      className="w-full flex flex-col items-center justify-center py-24 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div data-gsap className="text-center mb-10">
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
          Code <span className="text-emerald-400">Contributions</span>
        </h2>
        <div className="w-20 h-1.5 bg-emerald-500 rounded-full mx-auto" />
      </div>

      {/* GitHub Card Container */}
      <div 
        data-gsap
        className="w-full max-w-5xl bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 hover:border-[#8b949e] group"
      >
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-[#30363d] bg-[#161b22]">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="p-3 bg-white/5 rounded-full border border-white/10 group-hover:bg-emerald-500/20 transition-colors">
              <Github size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-wide">@{username}</h3>
              <p className="text-sm text-gray-400">Live GitHub Activity</p>
            </div>
          </div>
          
          <a 
            href={`https://github.com/${username}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            View Profile <ExternalLink size={16} />
          </a>
        </div>

        {/* Calendar Body */}
        <div 
          className="w-full overflow-x-auto flex justify-start lg:justify-center p-6 md:p-10 bg-[#0d1117] hide-scroll-override"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.hide-scroll-override::-webkit-scrollbar { display: none; }`}</style>
          <div className="min-w-[700px]">
            <GitHubCalendar 
              username={username} 
              blockSize={blockSize}
              blockMargin={5}
              colorScheme="dark"
              theme={explicitTheme}
              fontSize={14}
              renderBlock={(block, activity) => (
                React.cloneElement(block, {
                  "data-tooltip-id": "github-tooltip",
                  "data-tooltip-content": `${activity.count} contributions on ${activity.date}`,
                })
              )}
            />
          </div>
        </div>
        
        {/* Tooltip Component */}
        <Tooltip 
          id="github-tooltip" 
          style={{ 
            backgroundColor: '#161b22', 
            color: '#c9d1d9', 
            borderRadius: '6px',
            border: '1px solid #30363d',
            fontSize: '12px',
            padding: '8px 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }} 
        />
      </div>
    </section>
  );
}