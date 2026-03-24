import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface InteractiveBackgroundProps {
  theme?: 'light' | 'dark';
}

export default function InteractiveBackground({ theme = 'dark' }: InteractiveBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Matter.js setup
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // Set gravity (Google Antigravity style)
    world.gravity.y = 1;

    const render = Matter.Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio,
      }
    });
    renderRef.current = render;

    // Colors based on theme
    const colors = theme === 'dark'
      ? ['#6366f1', '#818cf8', '#4f46e5', '#a5b4fc', '#c084fc']
      : ['#4338ca', '#4f46e5', '#6366f1', '#3730a3', '#7c3aed'];

    // Create particles (Google Antigravity style)
    const particles: Matter.Body[] = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const size = Math.random() * 30 + 10;
      const color = colors[Math.floor(Math.random() * colors.length)];

      let body;
      const type = Math.random();

      if (type < 0.4) {
        // Circle
        body = Matter.Bodies.circle(x, y, size / 2, {
          restitution: 0.6,
          friction: 0.1,
          render: { fillStyle: color, opacity: theme === 'dark' ? 0.4 : 0.2 }
        });
      } else if (type < 0.8) {
        // Rectangle (looks like a button/UI element)
        body = Matter.Bodies.rectangle(x, y, size * 2, size, {
          restitution: 0.5,
          friction: 0.2,
          chamfer: { radius: 8 },
          render: { fillStyle: color, opacity: theme === 'dark' ? 0.4 : 0.2 }
        });
      } else {
        // Triangle
        body = Matter.Bodies.polygon(x, y, 3, size / 2, {
          restitution: 0.5,
          friction: 0.1,
          render: { fillStyle: color, opacity: theme === 'dark' ? 0.4 : 0.2 }
        });
      }

      particles.push(body);
    }

    // Boundaries (Floor and Walls)
    const wallThickness = 100;
    const floor = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      window.innerHeight + wallThickness / 2,
      window.innerWidth * 2,
      wallThickness,
      { isStatic: true, render: { visible: false } }
    );
    const leftWall = Matter.Bodies.rectangle(
      -wallThickness / 2,
      window.innerHeight / 2,
      wallThickness,
      window.innerHeight * 2,
      { isStatic: true, render: { visible: false } }
    );
    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth + wallThickness / 2,
      window.innerHeight / 2,
      wallThickness,
      window.innerHeight * 2,
      { isStatic: true, render: { visible: false } }
    );

    Matter.World.add(world, [...particles, floor, leftWall, rightWall]);

    // Mouse constraint (for "tossing" and "grabbing")
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Matter.World.add(world, mouseConstraint);

    // Keep mouse in sync with scrolling
    render.mouse = mouse;

    // Run the engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    runnerRef.current = runner;

    // Resize handler
    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Matter.Body.setPosition(floor, { x: window.innerWidth / 2, y: window.innerHeight + wallThickness / 2 });
      Matter.Body.setPosition(rightWall, { x: window.innerWidth + wallThickness / 2, y: window.innerHeight / 2 });
    };

    // Gooey Mouse Pointer Trail Logic
    const pointerParams = {
        pointsNumber: 40,
        widthFactor: 0.3,
        spring: 0.4,
        friction: 0.5
    };
    const pointerTrail = new Array(pointerParams.pointsNumber).fill(null).map(() => ({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        dx: 0,
        dy: 0,
    }));

    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;
      let mouseX = mouse.position.x;
      let mouseY = mouse.position.y;

      // Intro motion if mouse hasn't moved yet
      if (mouseX === 0 && mouseY === 0) {
          const t = engine.timing.timestamp;
          mouseX = (.5 + .3 * Math.cos(.002 * t) * (Math.sin(.005 * t))) * window.innerWidth;
          mouseY = (.5 + .2 * (Math.cos(.005 * t)) + .1 * Math.cos(.01 * t)) * window.innerHeight;
      }

      // Update trail physics
      pointerTrail.forEach((p, pIdx) => {
          const prev = pIdx === 0 ? { x: mouseX, y: mouseY } : pointerTrail[pIdx - 1];
          const spring = pIdx === 0 ? 0.4 * pointerParams.spring : pointerParams.spring;
          p.dx += (prev.x - p.x) * spring;
          p.dy += (prev.y - p.y) * spring;
          p.dx *= pointerParams.friction;
          p.dy *= pointerParams.friction;
          p.x += p.dx;
          p.y += p.dy;
      });

      // Draw gooey trail
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(pointerTrail[0].x, pointerTrail[0].y);

      for (let i = 1; i < pointerTrail.length - 1; i++) {
          const xc = 0.5 * (pointerTrail[i].x + pointerTrail[i + 1].x);
          const yc = 0.5 * (pointerTrail[i].y + pointerTrail[i + 1].y);
          context.quadraticCurveTo(pointerTrail[i].x, pointerTrail[i].y, xc, yc);
          context.lineWidth = pointerParams.widthFactor * (pointerParams.pointsNumber - i);
          context.strokeStyle = theme === 'dark' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(67, 56, 202, 0.8)';
          context.stroke();
      }
      context.lineTo(pointerTrail[pointerTrail.length - 1].x, pointerTrail[pointerTrail.length - 1].y);
      context.stroke();

      // Draw an anti-gravity field effect (subtle ring)
      if (mouse.position.x !== 0 || mouse.position.y !== 0) {
        context.beginPath();
        context.arc(mouse.position.x, mouse.position.y, 250, 0, 2 * Math.PI);
        context.strokeStyle = theme === 'dark' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(79, 70, 229, 0.05)';
        context.lineWidth = 2;
        context.stroke();
      }
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden"
      style={{ mixBlendMode: theme === 'dark' ? 'screen' : 'multiply' }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
