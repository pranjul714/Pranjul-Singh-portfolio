import React from "react";
import { trackAction } from "../../services/tracking.js";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import images from "../../assets/img";
import { getHomeData } from "../../services/api";
import TextType from "./text_animation/TextType";
import RotatingText from "./text_animation/RotatingText";

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
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center pt-10 overflow-hidden">

      {/* Background Aura */}
      <div className="" />

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
          className="text-[9vw] lg:text-[13vw] font-black text-white leading-[0.8] tracking-tighter uppercase z-0 mb-[-2vw]"
        >
          <TextType 
            text={["Full-Stack ","React"]}
            typingSpeed={100}
            showCursor={false}
          />
        </motion.div>

        {/* 2. CENTER PIECE (Image & Overlapping Developer Text) */}
        <div className="relative flex items-center justify-center w-full mt-1 lg:mt-5">



          {/* "DEVE" - Behind Layer */}
          <div className="text-[9vw] lg:text-[8vw] font-black text-outline uppercase z-0 -mr-[2vw] lg:-mr-[3vw] tracking-tighter opacity-90">
            <TextType 
              text={["DEVELOPER", "ENGINEER", "PROGRAMMER"]}
              initialDelay={500}
              typingSpeed={100}
              deletingSpeed={50}
              pauseDuration={2000}
              showCursor={true}
              cursorCharacter="_"
              loop={true}
            />
          </div>



        </div>

        {/* 3. SUBTITLE & SKILLS SHOWCASE */}
        <motion.div variants={item} className="flex flex-col items-center gap-6 mt-10 z-40">
          
          {/* React & React Native Showcase */}
          <div className="flex items-center gap-3 text-lg lg:text-2xl font-semibold bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <span className="text-gray-300">Work in</span>
            <RotatingText
              texts={['React JS', 'React Native', 'Full-Stack']}
              mainClassName="px-3 sm:px-4 md:px-5 bg-emerald-500/20 text-emerald-400 overflow-hidden py-1 sm:py-2 md:py-2 justify-center rounded-lg font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={3000}
            />
          </div>

          <p className="text-gray-400 text-center max-w-2xl text-sm lg:text-base font-medium px-4 mt-2">
            {homeData?.bio || "I am a Full Stack Developer passionate about creating beautiful and functional web applications."}
          </p>

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
