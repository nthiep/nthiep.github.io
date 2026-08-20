import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  sway: number;
  swaySpeed: number;
  fallSpeed: number;
  blowUntil: number;
  popAt: number;
}

interface Smoke {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  growth: number;
  born: number;
  life: number;
}

const BLOW_MS = 3000;
const SMOKE_MS = 3000;

const blowAngle = () => {
  const isMobile = window.innerWidth < 768;
  const deg = isMobile ? 120 : 150;
  return (deg * Math.PI) / 180;
};

const spawnBubble = (originX: number, originY: number, now: number): Bubble => {
  const spread = ((Math.random() - 0.5) * 16 * Math.PI) / 180;
  const angle = blowAngle() + spread;
  const speed = 3.15 + Math.random() * 2.4;
  return {
    x: originX,
    y: originY,
    size: 9 + Math.random() * 16,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.02 + 0.008,
    fallSpeed: Math.random() * 0.38 + 0.48,
    blowUntil: now + 580 + Math.random() * 320,
    popAt: (() => {
      const roll = Math.random();
      if (roll < 0.1) return now + 2800 + Math.random() * 2200;
      if (roll < 0.4) return now + 5500 + Math.random() * 3500;
      return now + 8500 + Math.random() * 5500;
    })(),
  };
};

const spawnSmoke = (x: number, y: number, now: number): Smoke[] =>
  Array.from({ length: 7 }, () => ({
    x: x + (Math.random() - 0.5) * 10,
    y: y + (Math.random() - 0.5) * 8,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -0.06 - Math.random() * 0.1,
    size: 10 + Math.random() * 16,
    growth: 0.028 + Math.random() * 0.025,
    born: now,
    life: SMOKE_MS - 200 + Math.random() * 400,
  }));

const getOrigin = () => {
  const vinyl = document.getElementById('hunbei-vinyl-music-btn')?.getBoundingClientRect();
  return {
    x: vinyl ? vinyl.left + vinyl.width / 2 : window.innerWidth - 40,
    y: vinyl ? vinyl.top + vinyl.height / 2 : 40,
  };
};

export const MusicBubbleFx: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wasActiveRef = useRef(false);
  const startBurstRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let raf = 0;
    let spawnTimer: number | null = null;
    let stopSpawnTimer: number | null = null;
    let looping = false;

    const bubbles: Bubble[] = [];
    const smokes: Smoke[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const drawBubble = (b: Bubble) => {
      const g = ctx.createRadialGradient(
        b.x - b.size * 0.22,
        b.y - b.size * 0.28,
        b.size * 0.08,
        b.x,
        b.y,
        b.size * 0.55
      );
      g.addColorStop(0, 'rgba(255,255,255,0.62)');
      g.addColorStop(0.32, 'rgba(255,255,255,0.22)');
      g.addColorStop(0.68, 'rgba(255,250,245,0.1)');
      g.addColorStop(1, 'rgba(255,255,255,0.32)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.42)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const drawSmoke = (s: Smoke, now: number) => {
      const t = Math.min(1, (now - s.born) / s.life);
      const alpha = (1 - t) * 0.62;
      const radius = s.size * 0.5;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, radius);
      g.addColorStop(0, `rgba(255,255,255,${alpha})`);
      g.addColorStop(0.45, `rgba(255,255,255,${alpha * 0.45})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    };

    const ensureLoop = () => {
      if (looping) return;
      looping = true;
      const tick = (now: number) => {
        ctx.clearRect(0, 0, width, height);

        for (let i = bubbles.length - 1; i >= 0; i -= 1) {
          const b = bubbles[i];
          if (now >= b.popAt) {
            smokes.push(...spawnSmoke(b.x, b.y, now));
            bubbles.splice(i, 1);
            continue;
          }

          b.sway += b.swaySpeed;
          if (now < b.blowUntil) {
            b.vx *= 0.994;
            b.vy *= 0.994;
            b.vy += 0.012;
          } else {
            b.vx *= 0.988;
            b.vy += (b.fallSpeed - b.vy) * 0.045;
          }
          b.x += b.vx + Math.sin(b.sway) * 0.42;
          b.y += b.vy;

          if (b.y > height + 30 || b.x < -30) {
            smokes.push(...spawnSmoke(Math.max(8, b.x), Math.min(height - 8, b.y), now));
            bubbles.splice(i, 1);
            continue;
          }

          drawBubble(b);
        }

        for (let i = smokes.length - 1; i >= 0; i -= 1) {
          const s = smokes[i];
          if (now - s.born >= s.life) {
            smokes.splice(i, 1);
            continue;
          }
          s.x += s.vx;
          s.y += s.vy;
          s.size += s.growth;
          drawSmoke(s, now);
        }

        if (bubbles.length > 0 || smokes.length > 0 || spawnTimer) {
          raf = requestAnimationFrame(tick);
        } else {
          looping = false;
          ctx.clearRect(0, 0, width, height);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    startBurstRef.current = () => {
      if (spawnTimer) window.clearInterval(spawnTimer);
      if (stopSpawnTimer) window.clearTimeout(stopSpawnTimer);
      const emit = () => {
        const origin = getOrigin();
        const now = performance.now();
        bubbles.push(spawnBubble(origin.x, origin.y, now));
        if (Math.random() < 0.45) {
          bubbles.push(spawnBubble(origin.x, origin.y, now));
        }
        ensureLoop();
      };
      emit();
      spawnTimer = window.setInterval(emit, 72);
      stopSpawnTimer = window.setTimeout(() => {
        if (spawnTimer) window.clearInterval(spawnTimer);
        spawnTimer = null;
      }, BLOW_MS);
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
      if (spawnTimer) window.clearInterval(spawnTimer);
      if (stopSpawnTimer) window.clearTimeout(stopSpawnTimer);
      startBurstRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (active && !wasActiveRef.current) {
      startBurstRef.current?.();
    }
    wasActiveRef.current = active;
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[45] h-full w-full"
      aria-hidden
    />
  );
};
