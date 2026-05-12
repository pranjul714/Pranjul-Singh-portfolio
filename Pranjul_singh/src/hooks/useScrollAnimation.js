import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  let timeoutId;
  const observer = new ResizeObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });
  // Wait for document.body to exist
  setTimeout(() => {
    if (document.body) observer.observe(document.body);
  }, 100);
}

export function useScrollReveal(selector = "[data-gsap]", options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none none",
            once: true,
          },
          ...options
        }
      );
    }, container);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}


export function useParallax(speed = 30) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: -speed,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return ref;
}

/**
 * useTextReveal — GSAP staggered text character/word reveal on scroll
 */
export function useTextReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * useStaggerCards — Stagger animation for a grid of cards
 */
export function useStaggerCards(selector = ".gsap-card", dependencies = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if elements actually exist in DOM yet (fixes async loading warnings)
    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(elements, 
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: {
            amount: 0.6,
            grid: "auto",
            from: "start",
          },
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [selector, ...dependencies]);

  return containerRef;
}

export default gsap;
