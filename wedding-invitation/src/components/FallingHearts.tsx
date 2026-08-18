import React, { useEffect, useRef } from 'react';

interface Heart {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  sway: number;
  swaySpeed: number;
  color: string;
}

export const FallingHearts: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
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

    const heartColors = [
      'rgba(255, 215, 120, 0.72)',
      'rgba(255, 182, 193, 0.65)',
      'rgba(255, 255, 255, 0.5)',
      'rgba(232, 90, 106, 0.55)',
      'rgba(250, 224, 165, 0.7)',
    ];

    const heartCount = Math.min(8, Math.max(4, Math.floor(window.innerWidth / 160)));
    const hearts: Heart[] = Array.from({ length: heartCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: Math.random() * 0.7 + 0.35,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.2,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.008,
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
    }));

    const drawHeart = (h: Heart) => {
      ctx.save();
      ctx.translate(h.x, h.y);
      ctx.rotate((h.rotation * Math.PI) / 180);
      ctx.fillStyle = h.color;
      ctx.shadowColor = h.color;
      ctx.shadowBlur = 8;

      const s = h.size;
      ctx.beginPath();
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.15, -s * 0.15, -s * 0.55, -s * 0.1, -s * 0.5, s * 0.2);
      ctx.bezierCurveTo(-s * 0.45, s * 0.55, 0, s * 0.85, 0, s);
      ctx.bezierCurveTo(0, s * 0.85, s * 0.45, s * 0.55, s * 0.5, s * 0.2);
      ctx.bezierCurveTo(s * 0.55, -s * 0.1, s * 0.15, -s * 0.15, 0, s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      hearts.forEach((h) => {
        h.sway += h.swaySpeed;
        h.x += h.speedX + Math.sin(h.sway) * 0.55;
        h.y += h.speedY;
        h.rotation += h.rotationSpeed;

        if (h.y > height + 24) {
          h.y = -24;
          h.x = Math.random() * width;
        }
        if (h.x > width + 24) h.x = -24;
        if (h.x < -24) h.x = width + 24;

        drawHeart(h);
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
      id="falling-hearts-canvas"
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
    />
  );
};
