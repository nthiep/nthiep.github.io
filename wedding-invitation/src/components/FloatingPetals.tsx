import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
}

export const FloatingPetals: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const petalColors = [
      'rgba(244, 214, 210, 0.45)', // Rose blush
      'rgba(229, 211, 196, 0.4)',  // Soft champagne
      'rgba(219, 194, 185, 0.35)', // Dusty rose
      'rgba(196, 207, 184, 0.35)', // Soft sage leaf
    ];

    const petalCount = Math.min(25, Math.floor(window.innerWidth / 45));
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 9 + 6,
      speedX: (Math.random() - 0.5) * 0.8 + 0.3,
      speedY: Math.random() * 0.8 + 0.4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.5 + 0.3,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 2, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.x += p.speedX + Math.sin(p.y * 0.005) * 0.4;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      id="floating-petals-canvas"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
};
