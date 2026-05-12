import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quickTo for highly performant tracking
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

    const handleMouseMove = (e) => {
      // Offset by half the width/height to center the cursor (w/h is 32px)
      xTo(e.clientX - 16);
      yTo(e.clientY - 16);
    };

    const handleMouseEnter = () => {
      gsap.to(cursor, {
        scale: 1.5,
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        borderColor: "rgba(52, 211, 153, 0)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        borderColor: "rgba(52, 211, 153, 0.5)",
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Attach mouse move
    window.addEventListener("mousemove", handleMouseMove);

    // Attach hover effects to all clickable elements
    const clickables = document.querySelectorAll("a, button, input, textarea, [data-cursor='pointer']");
    clickables.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-400/50 pointer-events-none z-[9999] hidden lg:block mix-blend-difference"
      style={{ transform: "translate(-100px, -100px)" }}
    />
  );
}
