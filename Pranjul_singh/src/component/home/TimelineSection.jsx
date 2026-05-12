import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap, Code } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function TimelineSection() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  const timelineData = [
    
    {
      id: 1,
      type: "education",
      title: "Bachelor of Technology",
      subtitle: "Computer Science & Engineering",
      date: "2020 - 2026",
      description: "Graduated with honors. Specialized in Web Technologies, Data Structures, and System Design.",
      icon: <GraduationCap size={20} />,
    },
    {
      id: 2,
      type: "Internship",
      title: "Internship",
      subtitle: "Full stack Developer",
      date: "Feb 2026 - present",
      description: " Engineered scalable backend modules using Node.js and Express.js, reducing API response latency by 15% hrough query optimization and efficient middleware design",
      icon: <Code size={20} />,
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical line drawing down
      gsap.fromTo(
        lineRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1, // Smooth scrub
          },
        }
      );

      // Animate the cards popping in
      const cards = gsap.utils.toArray(".timeline-card");
      cards.forEach((card, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(
          card,
          { 
            opacity: 0, 
            x: isLeft ? -50 : 50,
            y: 50 
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
      
      // Animate the icons popping in
      const icons = gsap.utils.toArray(".timeline-icon");
      icons.forEach((icon) => {
        gsap.fromTo(
          icon,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: icon,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full py-32 px-6 overflow-hidden min-h-screen">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
            My <span className="text-emerald-400">Journey</span>
          </h2>
          <p className="text-emerald-100/60 text-lg">
            A timeline of my education, experience, and growth.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full flex flex-col items-center">
          
          {/* The Vertical Line (Background) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-white/10 rounded-full" />
          
          {/* The Vertical Line (Animated Fill) */}
          <div 
            ref={lineRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-1 bg-gradient-to-b from-emerald-400 to-blue-500 rounded-full origin-top"
          />

          {/* Timeline Items */}
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;

            return (
              <div key={item.id} className={`relative w-full flex justify-center mb-16 ${isLeft ? 'lg:justify-start' : 'lg:justify-end'}`}>
                
                {/* Center Icon */}
                <div className="timeline-icon absolute left-1/2 -translate-x-1/2 top-0 w-12 h-12 bg-[#0A0A0A] border-4 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 z-20 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                  {item.icon}
                </div>

                {/* Card */}
                <div className={`timeline-card w-full max-w-md bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2rem] p-8 shadow-2xl mt-16 lg:mt-0 ${isLeft ? 'lg:mr-12' : 'lg:ml-12'}`}>
                  
                  {/* Date Badge */}
                  <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest mb-4">
                    {item.date}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                  <h4 className="text-sm font-semibold text-emerald-100/50 mb-4 uppercase tracking-wider">{item.subtitle}</h4>
                  
                  <p className="text-emerald-100/70 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
