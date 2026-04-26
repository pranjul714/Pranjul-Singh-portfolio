import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const PARTICLE_NUM = 400; 
    const PARTICLE_BASE_RADIUS = 1.4;
    const FL = 500;
    const DEFAULT_SPEED = 2.0; 
    const CONNECTION_DIST = 190; 

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;

    let canvasWidth, canvasHeight;
    let centerX, centerY;
    let mouseX = null;
    let mouseY = null;
    let speed = DEFAULT_SPEED;
    const targetSpeed = DEFAULT_SPEED;
    const particles = [];

    let currentCenterX = window.innerWidth * 0.5;
    let currentCenterY = window.innerHeight * 0.5;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
      context.setTransform(1, 0, 0, 1, 0, 0); 
      context.scale(dpr, dpr); 
      centerX = canvasWidth * 0.5;
      centerY = canvasHeight * 0.5;
    };

    const randomizeParticle = (p) => {
      p.x = Math.random() * canvasWidth;
      p.y = Math.random() * canvasHeight;
      p.z = Math.random() * 1500 + 500;
      p.vx = (Math.random() - 0.5) * 0.2;
      p.vy = (Math.random() - 0.5) * 0.2;
      p.screenX = 0;
      p.screenY = 0;
      p.pastZ = 0;
      p.radius = 0;
      return p;
    };

    function createParticle(x = 0, y = 0, z = 0) {
      return {
        x, y, z,
        vx: 0, vy: 0,
        pastZ: 0,
        screenX: 0, screenY: 0,
        radius: 0
      };
    }

    const loop = () => {
      // Set to solid black to match background
      context.fillStyle = '#000000'; 
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      speed += (targetSpeed - speed) * 0.06;

      // Smoothly follow mouse
      if (mouseX !== null && mouseY !== null) {
        currentCenterX += (centerX + (mouseX - centerX) * 0.2 - currentCenterX) * 0.08;
        currentCenterY += (centerY + (mouseY - centerY) * 0.2 - currentCenterY) * 0.08;
      } else {
        currentCenterX += (centerX - currentCenterX) * 0.08;
        currentCenterY += (centerY - currentCenterY) * 0.08;
      }

      for (let i = 0; i < PARTICLE_NUM; i++) {
        const p = particles[i];
        p.pastZ = p.z;
        p.z -= speed;

        if (mouseX !== null && mouseY !== null) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            p.x += dx * 0.01;
            p.y += dy * 0.01;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.z <= 0) {
          randomizeParticle(p);
          continue;
        }

        const f = FL / p.z;
        p.screenX = currentCenterX + (p.x - centerX) * f;
        p.screenY = currentCenterY + (p.y - centerY) * f;
        p.radius = PARTICLE_BASE_RADIUS * f;
      }

      // Connections
      context.lineWidth = 0.5;
      for (let i = 0; i < PARTICLE_NUM; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < PARTICLE_NUM; j++) {
          const p2 = particles[j];
          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            const alpha = 1 - (Math.sqrt(distSq) / CONNECTION_DIST);
            context.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.15})`; 
            context.beginPath();
            context.moveTo(p1.screenX, p1.screenY);
            context.lineTo(p2.screenX, p2.screenY);
            context.stroke();
          }
        }
      }

      // Particles
      for (let i = 0; i < PARTICLE_NUM; i++) {
        const p = particles[i];
        if (p.z <= 0) continue;
        
        context.beginPath();
        context.fillStyle = 'rgba(255, 255, 255, 0.7)';
        context.arc(p.screenX, p.screenY, p.radius, 0, Math.PI * 2);
        context.fill();
      }
    };

    let animationFrameId;
    const animate = () => {
      loop();
      animationFrameId = requestAnimationFrame(animate);
    };

    const init = () => {
      resize();
      
      for (let i = 0; i < PARTICLE_NUM; i++) {
        const p = randomizeParticle(createParticle());
        p.z -= 500 * Math.random();
        particles.push(p);
      }

      window.addEventListener('resize', resize);
      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      window.addEventListener('mousemove', handleMouseMove);

      animate();
      
      return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
      };
    };

    const cleanup = init();
    return cleanup;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default ParticleBackground;
