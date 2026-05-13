import React from "react";
import { trackAction } from "../../services/tracking.js";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import images from "../../assets/img";
import { getHomeData } from "../../services/api";

export default function MainPage({ scrollToSection }) {
  const [homeData, setHomeData] = React.useState({
    hero_title: "Full-Stack Engineer",
    hero_subtitle: "Based in New Delhi, India."
  });

  React.useEffect(() => {
    const fetchHome = async () => {
      try {
        const { data } = await getHomeData();
        if (data) setHomeData(data);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      }
    };
    fetchHome();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-10 overflow-hidden backdrop-blur-[4px]">
      
      {/* Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[140px] -z-10" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl w-full flex flex-col items-center text-center z-10 px-6 relative mt-16 lg:mt-12"
      >
        {/* 1. TOP TYPOGRAPHY */}
        <h1 className="sr-only">Pranjul Singh - Full-Stack Developer</h1>
        <motion.div
          aria-hidden="true"
          variants={item}
          className="text-[15vw] lg:text-[13vw] font-black text-white leading-[0.8] tracking-tighter uppercase z-0 mb-[-2vw]"
        >
          Full-Stack
        </motion.div>

        {/* 2. CENTER PIECE (Image & Overlapping Developer Text) */}
        <div className="relative flex items-center justify-center w-full mt-3 lg:mt-10">
          
       
          
          {/* "DEVE" - Behind Layer */}
          <div className="text-[11vw] lg:text-[13vw] font-black text-outline uppercase z-0 -mr-[4vw] lg:-mr-[4vw] tracking-tighter opacity-90">
            DEVE
          </div>

          {/* PROFILE IMAGE - Middle Layer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -10, 0] 
            }}
            transition={{ 
              initial: { delay: 0.8, duration: 1 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10 flex items-center justify-center"
          >
            {/* Main Image - Now Transparent & Clean with Rounded Bottom */}
            <div className="relative w-[360px] lg:w-[480px] rounded-[150px] overflow-hidden shadow-2xl">
              <img
                src={homeData?.profile_image || images?.Pranjulimg}
                alt="Pranjul Singh"
                className="w-full h-full object-cover relative z-20"
              />
            </div>
            
            {/* Floating Interaction Icon */}
            <div className="absolute bottom-0 -right-4 lg:-right-8 z-40">
               <motion.div
                whileHover={{ scale: 1.1, rotate: 90 }}
                className="w-12 h-12 lg:w-16 lg:h-16 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-xl bg-white/5 cursor-pointer shadow-2xl"
              >
                <ArrowUpRight size={24} className="text-emerald-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* "LOPER" - Front Layer */}
          <div aria-hidden="true" className="text-[11vw] lg:text-[13vw] font-black text-outline uppercase z-20 -ml-[4vw] lg:-ml-[6vw] pointer-events-none tracking-tighter">
            LOPER
          </div>

         
        </div>

        {/* 3. SUBTITLE (Dynamic bio from API) */}
        <motion.div variants={item} className="flex flex-col items-center gap-8 mt-10 z-40">
          

          {/* 4. ACTIONS */}
          <div className="flex flex-wrap gap-5 w-full justify-center">
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => {
                 trackAction('click', 'Main Visit Site');
                 scrollToSection?.('projects');
               }}
               className="group relative overflow-hidden bg-white text-black px-12 py-5 rounded-full font-bold flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
             >
               <span className="relative z-10">EXPLORE PROJECTS</span>
               <div className="bg-emerald-400 w-8 h-8 rounded-full flex items-center justify-center group-hover:w-full group-hover:rounded-none absolute right-2 transition-all duration-500 z-0 opacity-20 group-hover:opacity-100" />
               <ArrowUpRight size={20} className="relative z-10 group-hover:rotate-45 transition-transform duration-300" />
             </motion.button>

             <motion.a 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               href={homeData?.resume_url || "#"} 
               target="_blank" 
               rel="noreferrer"
               download
               onClick={() => trackAction('click', 'Main Download CV')}
               className="border-2 border-white/10 backdrop-blur-xl text-white px-12 py-5 rounded-full font-bold hover:border-white transition-all flex items-center justify-center tracking-widest text-xs"
             >
               DOWNLOAD CV
             </motion.a>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
