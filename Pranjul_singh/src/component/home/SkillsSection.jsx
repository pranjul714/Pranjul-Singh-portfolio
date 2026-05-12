import React from "react";
import { getSkills } from "../../services/api";
import { Cpu, Code2, Database, Layout, Terminal, Globe, ShieldCheck } from "lucide-react";
import { useTextReveal, useStaggerCards } from "../../hooks/useScrollAnimation";

export default function SkillsSection() {
  const headerRef = useTextReveal();
  
  const [skills, setSkills] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const gridRef = useStaggerCards(".gsap-card", [skills]);

  const iconMap = {
    Layout: <Layout size={18} />,
    Terminal: <Terminal size={18} />,
    Cpu: <Cpu size={18} />,
    Database: <Database size={18} />,
    Globe: <Globe size={18} />,
    ShieldCheck: <ShieldCheck size={18} />,
    Code2: <Code2 size={18} />,
  };

  React.useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await getSkills();
        setSkills(data);
      } catch (error) {
        // Data loads on page visit — no action needed on error
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section className="relative min-h-screen w-full px-6 lg:px-24 py-20 lg:py-32 overflow-hidden">

      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div
          ref={headerRef}
          className="mb-16 lg:mb-20 space-y-4"
        >
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
            Technical <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Arsenal</span>
          </h2>
          <div className="w-24 h-1.5 bg-emerald-500 rounded-full mx-auto" />
          <p className="text-emerald-100/60 text-base lg:text-lg pt-4 font-medium">
            The modern stack I use to bring digital ideas to life.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5 relative z-20"
        >
          {loading ? (
            // Skeleton Loaders
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl py-4 lg:py-5 px-6 animate-pulse">
                <div className="w-10 h-10 bg-white/5 rounded-xl"></div>
                <div className="h-4 w-20 bg-white/5 rounded"></div>
              </div>
            ))
          ) : skills.length > 0 ? (
            skills?.map((skill, index) => (
              <div
                key={index}
                className="gsap-card group flex items-center gap-4 bg-white/[0.03] backdrop-blur-md border border-white/10
                rounded-2xl py-4 lg:py-5 px-6 shadow-2xl transition-all duration-300 cursor-default hover:-translate-y-2 hover:scale-105 hover:border-emerald-500/50 hover:bg-white/[0.06]"
              >
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 group-hover:bg-emerald-400 group-hover:text-emerald-950 transition-colors">
                  {skill.icon && iconMap[skill.icon] ? iconMap[skill.icon] : <Code2 size={18} />}
                </div>
                <span className="font-bold text-sm lg:text-base text-emerald-50/90 group-hover:text-white transition-colors tracking-wide">
                  {skill.name}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
               <p className="text-emerald-100/40 font-medium">No skills added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
