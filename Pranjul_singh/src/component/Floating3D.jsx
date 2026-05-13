import React, { useEffect, useRef } from 'react';

const Floating3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let mouseX = 0, mouseY = 0;

    const shapes = [];
    const SHAPE_COUNT = 8;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    class Shape3D {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 400 - 200;
        this.size = Math.random() * 60 + 40;
        this.rotationX = Math.random() * Math.PI * 2;
        this.rotationY = Math.random() * Math.PI * 2;
        this.rotationZ = Math.random() * Math.PI * 2;
        this.speedX = (Math.random() - 0.5) * 0.015;
        this.speedY = (Math.random() - 0.5) * 0.015;
        this.type = Math.floor(Math.random() * 3);
      }

      update() {
        this.rotationX += this.speedX + (mouseY - height/2) * 0.00001;
        this.rotationY += this.speedY + (mouseX - width/2) * 0.00001;
        
        // Float movement
        this.y += Math.sin(Date.now() * 0.001 + this.x) * 0.2;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)'; 
        ctx.lineWidth = 1.5;

        const vertices = this.getVertices();
        const projected = vertices.map(v => this.project(v));

        // Draw edges
        this.getEdges().forEach(edge => {
          const v1 = projected[edge[0]];
          const v2 = projected[edge[1]];
          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.stroke();
        });

        ctx.restore();
      }

      project(v) {
        // Simple 3D to 2D projection
        let x = v.x;
        let y = v.y;
        let z = v.z;

        // Rotation X
        let tempY = y * Math.cos(this.rotationX) - z * Math.sin(this.rotationX);
        let tempZ = y * Math.sin(this.rotationX) + z * Math.cos(this.rotationX);
        y = tempY; z = tempZ;

        // Rotation Y
        let tempX = x * Math.cos(this.rotationY) + z * Math.sin(this.rotationY);
        z = -x * Math.sin(this.rotationY) + z * Math.cos(this.rotationY);
        x = tempX;

        const factor = 400 / (400 + z);
        return { x: x * factor, y: y * factor };
      }

      getVertices() {
        const s = this.size;
        if (this.type === 0) { // Cube
          return [
            {x:-s, y:-s, z:-s}, {x:s, y:-s, z:-s}, {x:s, y:s, z:-s}, {x:-s, y:s, z:-s},
            {x:-s, y:-s, z:s}, {x:s, y:-s, z:s}, {x:s, y:s, z:s}, {x:-s, y:s, z:s}
          ];
        } else { // Octahedron
          return [
            {x:0, y:-s*1.5, z:0}, {x:s, y:0, z:s}, {x:s, y:0, z:-s}, 
            {x:-s, y:0, z:-s}, {x:-s, y:0, z:s}, {x:0, y:s*1.5, z:0}
          ];
        }
      }

      getEdges() {
        if (this.type === 0) {
          return [
            [0,1], [1,2], [2,3], [3,0], [4,5], [5,6], [6,7], [7,4], [0,4], [1,5], [2,6], [3,7]
          ];
        } else {
          return [
            [0,1], [0,2], [0,3], [0,4], [5,1], [5,2], [5,3], [5,4], [1,2], [2,3], [3,4], [4,1]
          ];
        }
      }
    }

    for (let i = 0; i < SHAPE_COUNT; i++) {
      shapes.push(new Shape3D());
    }

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });
      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: 0.6
      }}
    />
  );
};

export default Floating3D;
