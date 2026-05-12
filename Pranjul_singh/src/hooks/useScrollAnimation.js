import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal — GSAP ScrollTrigger hook
 * Animates elements into view as user scrolls.
 *
 * @param {string} selector  - CSS selector of elements to animate inside the container
 * @param {object} options   - GSAP animation options
 * @returns {ref}            - Attach to the container element
 */
export function useScrollReveal(selector = "[data-gsap]", options = {}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    if (!elements.length) return;

    const defaults = {
      opacity: 0,
      y: 60,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    };

    const ctx = gsap.context(() => {
      gsap.from(elements, { ...defaults, ...options });
    }, container);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}

/**
 * useParallax — Subtle parallax scroll effect on an element
 * @param {number} speed - Parallax intensity (default 30px)
 */
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
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return ref;
}

/**
 * useStaggerCards — Stagger animation for a grid of cards
 */
export function useStaggerCards(selector = ".gsap-card") {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.from(selector, {
        opacity: 0,
        y: 80,
        scale: 0.95,
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
      });
    }, container);

    return () => ctx.revert();
  }, [selector]);

  return containerRef;
}

export default gsap;
