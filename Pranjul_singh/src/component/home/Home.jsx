import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Navbar from "../Navbar/Navbar.jsx";
import MainPage from "./MainPage.jsx";
import About from "./About.jsx";
import Contact from "./Contact.jsx";
import ProjectsSection from "./ProjectsSection.jsx";
import SkillsSection from "./SkillsSection.jsx";
import ParticleBackground from "../ParticleBackground.jsx";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");

  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    projects: useRef(null),
    skills: useRef(null),
    contact: useRef(null),
  };

  const scrollToSection = (sectionId) => {
    const targetRef = sectionRefs[sectionId];
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

    const observerCallback = (entries) => {
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

  // Updated Social Link for Dark Theme
  const SocialLink = ({ href, icon: Icon, label }) => (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, x: 8, color: "#34d399" }}
      whileTap={{ scale: 0.9 }}
      className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-emerald-100/70 transition-all hover:border-emerald-500/50"
      aria-label={label}
    >
      <Icon size={22} />
    </motion.a>
  );

  return (
    <div className="relative min-h-screen font-sans bg-black text-white">
      <ParticleBackground />

      {/* FIXED SOCIALS SIDEBAR */}
      <div className="fixed left-8 bottom-0 z-50 hidden lg:flex flex-col gap-5 mb-10">
        <SocialLink href="https://github.com/pranjul714" icon={Github} label="GitHub" />
        <SocialLink href="https://www.linkedin.com/in/pranjulsingh714/" icon={Linkedin} label="LinkedIn" />
        <SocialLink href="mailto:pranjulsingh38@email.com" icon={Mail} label="Email" />
        <div className="w-px h-24 bg-gradient-to-t from-emerald-500/50 to-transparent mx-auto mt-2" />
      </div>

      <Navbar scrollToSection={scrollToSection} activeSection={activeSection} />

      <main className="relative z-10 px-4 lg:px-12 py-24 max-w-[1500px] mx-auto space-y-24">
        
        <section id="home" ref={sectionRefs.home} className="section-style">
          <MainPage />
        </section>

        <section id="about" ref={sectionRefs.about} className="section-style">
          <About />
        </section>

        <section id="projects" ref={sectionRefs.projects} className="section-style">
          <ProjectsSection />
        </section>

        <section id="skills" ref={sectionRefs.skills} className="section-style">
          <SkillsSection />
        </section>

        <section id="contact" ref={sectionRefs.contact} className="section-style">
          <Contact />
        </section>
      </main>

      <style jsx>{`
        .section-style {
          width: 100%;
          min-height: 90vh;
          border-radius: 3.5rem;
          overflow: hidden;
          /* Clean Glass Effect */
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: none;
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          scroll-margin-top: 6rem;
          transition: border-color 0.3s ease;
        }
        .section-style:hover {
          border-color: rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </div>
  );
}
