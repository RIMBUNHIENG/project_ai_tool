import { useEffect, useRef } from 'react';

export default function CurlyCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };
    let points: { x: number; y: number; vx: number; vy: number }[] = [];
    const numPoints = 25;

    // Initialize points
    for (let i = 0; i < numPoints; i++) {
      points.push({ x: width / 2, y: height / 2, vx: 0, vy: 0 });
    }

    const mouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    // Touch support
    const touchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('touchmove', touchMove, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    let animationId: number;

    const spring = 0.45;
    const friction = 0.5;

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      let leader = { x: mouse.x, y: mouse.y };

      points.forEach((p) => {
        p.vx += (leader.x - p.x) * spring;
        p.vy += (leader.y - p.y) * spring;
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;
        leader = { x: p.x, y: p.y };
      });

      // Draw thick trailing path
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const xc = (points[i].x + points[i - 1].x) / 2;
        const yc = (points[i].y + points[i - 1].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
      }
      ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;

      // Fun gradient from brand colors
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#0000ceff'); // Indigo (brand accent)
      gradient.addColorStop(0.5, '#eb0000ff'); // Purple

      ctx.strokeStyle = gradient;
      ctx.stroke();

      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: 0.8 }} // no mixBlendMode for better visibility across everything
    />
  );
}
