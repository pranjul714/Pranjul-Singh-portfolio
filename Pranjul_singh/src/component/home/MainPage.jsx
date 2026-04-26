import React from "react";
import { Download, Rocket, Code2, Globe } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import images from "../../assets/img";
import myCV from "../../assets/Pranjul_Singh.pdf";
import { NavLink } from "react-router-dom";

export default function MainPage() {

  /* ---------------- PREMIUM STAGGER ---------------- */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  /* ---------------- 3D PARALLAX ---------------- */
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [8, -8]);
  const rotateY = useTransform(x, [-200, 200], [-8, 8]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const particles = [
    { size: "w-4 h-4", color: "bg-emerald-400", pos: "top-0 left-1/2 -translate-x-1/2" },
    { size: "w-3 h-3", color: "bg-blue-400", pos: "bottom-0 left-1/2 -translate-x-1/2" },
    { size: "w-2 h-2", color: "bg-white", pos: "top-1/2 right-0 -translate-y-1/2" },
    { size: "w-2.5 h-2.5", color: "bg-emerald-300", pos: "top-1/2 left-0 -translate-y-1/2" },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center justify-center px-6 lg:px-24 py-20 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">

        {/* LEFT CONTENT */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col space-y-8"
        >
          <motion.div
            variants={item}
            className="inline-block bg-emerald-400/10 backdrop-blur-xl border border-emerald-400/20 px-4 py-2 rounded-full w-fit"
          >
            <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <Rocket size={14} /> Available for Freelance & Full-Time
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl lg:text-7xl font-extrabold text-white"
          >
            Hi, I'm{" "}
            <span className="text-emerald-400">
              Pranjul
            </span>{" "}
            👋
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg text-emerald-100/70 max-w-lg"
          >
            Full-Stack Engineer specializing in React and Node.js/Express,
            building scalable applications with clean architecture.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-5 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-10 py-4 rounded-2xl font-bold flex items-center gap-2"
            >
              
                 <a
              href={myCV}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-emerald-950 font-semibold w-fit"
            >
              <Download size={20} />
              Download CV
            </a>
            </motion.button>

         
          </motion.div>

          {/* DOWNLOAD CV */}
        
        </motion.div>

     
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-[320px] h-[380px] lg:w-[440px] lg:h-[540px] flex items-center justify-center">

            {/* Orbit Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[115%] h-[115%]"
            >
              {particles.map((p, i) => (
                <div
                  key={i}
                  className={`absolute ${p.size} ${p.color} ${p.pos} rounded-full`}
                />
              ))}
              <div className="absolute inset-0 border border-emerald-500/10 rounded-full" />
            </motion.div>

            {/* Image Card */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY }}
              className="relative z-10 w-full h-full backdrop-blur-md border border-emerald-500/20 rounded-[40px] shadow-2xl overflow-hidden p-6 bg-white/5"
            >
              <img
                src={images?.Pranjulimg}
                alt="Pranjul"
                className="h-full w-full object-cover rounded-[30px]"
              />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              animate={{ x: [0, 12, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -right-6 top-20 bg-emerald-500 text-emerald-950 px-5 py-2 rounded-2xl font-black shadow-2xl text-[10px] flex items-center gap-2"
            >
              <Globe size={12} /> FULL-STACK
            </motion.div>

          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
