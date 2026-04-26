import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import MainPage from "../pages/MainPage";
import About from "../components/About";
import Contact from "../components/Contact";
import ProjectsSection from "../components/ProjectsSection";
import SkillsSection from "../components/SkillsSection";
import ParticleBackground from "../components/ParticleBackground";

type SectionId = "home" | "about" | "projects" | "skills" | "contact";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("home");

  const sectionRefs: Record<SectionId, React.RefObject<HTMLElement | null>> = {
    home: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    skills: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  const scrollToSection = (sectionId: string) => {
    const targetRef = sectionRefs[sectionId as SectionId];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.3,
      rootMargin: "-10% 0px -10% 0px",
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const SocialLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, x: 8, color: "#ffffff" }}
      whileTap={{ scale: 0.9 }}
      className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-zinc-500 transition-all hover:border-white/50"
      aria-label={label}
    >
      <Icon size={22} />
    </motion.a>
  );

  return (
    <div className="relative min-h-screen font-sans text-white">
      
      {/* MONOCHROME PREMIUM BACKGROUND */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-100/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/5 blur-[120px] rounded-full" />
      </div>

      <ParticleBackground />

      {/* FIXED SOCIALS SIDEBAR */}
      <div className="fixed left-8 bottom-0 z-50 hidden lg:flex flex-col gap-5 mb-10">
        <SocialLink href="https://github.com/pranjul714" icon={Github} label="GitHub" />
        <SocialLink href="https://www.linkedin.com/in/pranjulsingh714/" icon={Linkedin} label="LinkedIn" />
        <SocialLink href="mailto:pranjulsingh38@gmail.com" icon={Mail} label="Email" />
        <div className="w-px h-24 bg-gradient-to-t from-white/20 to-transparent mx-auto mt-2" />
      </div>

      <Navbar scrollToSection={scrollToSection} activeSection={activeSection} />

      <main className="relative z-10 px-4 lg:px-12 py-24 max-w-[1500px] mx-auto space-y-32">
        
        <section id="home" ref={sectionRefs.home as any} className="section-style min-h-screen flex items-center">
          <MainPage />
        </section>

        <section id="about" ref={sectionRefs.about as any} className="section-style">
          <About />
        </section>

        <section id="projects" ref={sectionRefs.projects as any} className="section-style">
          <ProjectsSection />
        </section>

        <section id="skills" ref={sectionRefs.skills as any} className="section-style">
          <SkillsSection />
        </section>

        <section id="contact" ref={sectionRefs.contact as any} className="section-style">
          <Contact />
        </section>
      </main>

      <style>{`
        .section-style {
          width: 100%;
          min-height: 90vh;
          border-radius: 3.5rem;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(30px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          scroll-margin-top: 6rem;
          transition: border-color 0.3s ease;
        }
        .section-style:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
