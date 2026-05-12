import React, { useRef, useState, useEffect, Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import Navbar from "../Navbar/Navbar.jsx";
import ParticleBackground from "../ParticleBackground.jsx";

// Lazy Load Sections for Performance
const MainPage = lazy(() => import("./MainPage.jsx"));
const About = lazy(() => import("./About.jsx"));
const ProjectsSection = lazy(() => import("./ProjectsSection.jsx"));
const TimelineSection = lazy(() => import("./TimelineSection.jsx"));
const SkillsSection = lazy(() => import("./SkillsSection.jsx"));
const GithubGraph = lazy(() => import("./GithubGraph.jsx"));
const Contact = lazy(() => import("./Contact.jsx"));

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
    <div className="relative min-h-screen font-sans bg-black text-white overflow-x-hidden">
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
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-emerald-400">Loading...</div>}>
          <section id="home" ref={sectionRefs.home} className="section-style">
            <MainPage />
          </section>

          <section id="about" ref={sectionRefs.about} className="section-style">
            <About />
          </section>

          <TimelineSection />

          <section id="projects" ref={sectionRefs.projects} className="section-style">
            <ProjectsSection />
          </section>

          <section id="skills" ref={sectionRefs.skills} className="section-style">
            <SkillsSection />
            <GithubGraph />
          </section>

          <section id="contact" ref={sectionRefs.contact} className="section-style">
            <Contact />
          </section>
        </Suspense>
      </main>

    </div>
  );
}
