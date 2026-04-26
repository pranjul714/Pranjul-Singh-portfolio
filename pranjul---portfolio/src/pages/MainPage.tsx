import React from "react";
import { Download, Rocket, Globe } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import images from "../assets/img";
import myCV from "../assets/Pranjul_Singh.pdf";

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

  function handleMouseMove(e: React.MouseEvent) {
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
    { size: "w-4 h-4", color: "bg-zinc-100", pos: "top-0 left-1/2 -translate-x-1/2" },
    { size: "w-3 h-3", color: "bg-zinc-400", pos: "bottom-0 left-1/2 -translate-x-1/2" },
    { size: "w-2 h-2", color: "bg-white", pos: "top-1/2 right-0 -translate-y-1/2" },
    { size: "w-2.5 h-2.5", color: "bg-zinc-300", pos: "top-1/2 left-0 -translate-y-1/2" },
  ];

  return (
    <section
      className="relative min-h-[80vh] w-full flex items-center justify-center px-6 lg:px-24 py-20"
    >
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-zinc-500/5 rounded-full blur-3xl -z-10 animate-breathe" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-100/5 rounded-full blur-3xl -z-10 animate-floatSlow" />

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
            className="inline-block bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full w-fit"
          >
            <p className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Rocket size={14} className="text-white" /> Available for Freelance & Full-Time
            </p>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl lg:text-7xl font-extrabold text-white leading-tight"
          >
            Hi, I'm{" "}
            <span className="text-zinc-400">
              Pranjul
            </span>{" "}
            👋
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg text-zinc-400 max-w-lg"
          >
            Full-Stack Engineer specializing in React and Node.js/Express,
            building scalable applications with clean architecture.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-5 pt-4">
            <motion.a
              href={myCV}
              download
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white hover:bg-zinc-200 text-black px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <Download size={20} />
              Download CV
            </motion.a>
          </motion.div>
        </motion.div>

        {/* RIGHT IMAGE */}
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
                  className={`absolute ${p.size} ${p.color} ${p.pos} rounded-full opacity-40`}
                />
              ))}
              <div className="absolute inset-0 border border-white/5 rounded-full" />
            </motion.div>

            {/* Image Card */}
            <motion.div
            
              className="relative z-10 w-full h-full backdrop-blur-md border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-4 bg-white/5"
            >
              <img
                src={images.Pranjulimg}
                alt="Pranjul"
                className="h-full w-full object-cover rounded-[30px] filter grayscale-0 opacity-100 transition-all hover:grayscale-0 hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </motion.div>

         

          </div>
        </motion.div>
      </div>
    </section>
  );
}
