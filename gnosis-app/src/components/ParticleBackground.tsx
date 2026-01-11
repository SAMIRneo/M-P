"use client";

import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Halftone dots configuration
    const dotSize = 2;
    const spacing = 8;
    
    // Draw static halftone pattern
    const drawHalftone = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Paper texture base
      ctx.fillStyle = "#f5f0e8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Halftone dots - creates comic book print effect
      ctx.fillStyle = "rgba(26, 26, 46, 0.04)";
      
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          // Vary dot size slightly for organic feel
          const size = dotSize * (0.8 + Math.random() * 0.4);
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // Add some larger scattered dots for variety
      ctx.fillStyle = "rgba(26, 26, 46, 0.02)";
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 3 + Math.random() * 5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Newspaper fold lines (subtle)
      ctx.strokeStyle = "rgba(26, 26, 46, 0.03)";
      ctx.lineWidth = 1;
      
      // Horizontal fold
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Vertical fold
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      
      // Add some ink splatter effects
      ctx.fillStyle = "rgba(26, 26, 46, 0.015)";
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = 10 + Math.random() * 30;
        
        ctx.beginPath();
        // Create irregular splatter shape
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2;
          const radius = size * (0.5 + Math.random() * 0.5);
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          if (j === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.fill();
      }
      
      // Grid lines like newspaper columns
      ctx.strokeStyle = "rgba(26, 26, 46, 0.02)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      
      const columns = 12;
      const columnWidth = canvas.width / columns;
      
      for (let i = 1; i < columns; i++) {
        ctx.beginPath();
        ctx.moveTo(i * columnWidth, 0);
        ctx.lineTo(i * columnWidth, canvas.height);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    };

    drawHalftone();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
}
