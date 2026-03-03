"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  A particle-based architectural shape morphing system.
  Hundreds of particles form geometric shapes representing the 5 studio layers,
  auto-cycling with organic motion and reacting dramatically to the mouse.
*/

const LABELS = ["Business", "Service", "Spatial", "Interaction", "Performance"];
const PARTICLE_COUNT = 320;
const AUTO_CYCLE_MS = 4500;
const MORPH_DURATION = 1800;

/* ── Utility ───────────────────────────────────────────── */

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/* ── Shape generators (return normalised -1..1 positions) ── */

function generateShape(index: number, count: number): [number, number][] {
  const pts: [number, number][] = [];

  switch (index) {
    case 0: {
      // Nested rectangles — Business (structured, layered)
      const layers = 4;
      const perLayer = Math.floor(count / layers);
      for (let l = 0; l < layers; l++) {
        const s = 0.35 + l * 0.18;
        for (let i = 0; i < perLayer; i++) {
          const t = i / perLayer;
          const perim = t * 4;
          let x = 0, y = 0;
          if (perim < 1) { x = lerp(-s, s, perim); y = -s; }
          else if (perim < 2) { x = s; y = lerp(-s, s, perim - 1); }
          else if (perim < 3) { x = lerp(s, -s, perim - 2); y = s; }
          else { x = -s; y = lerp(s, -s, perim - 3); }
          pts.push([x, y]);
        }
      }
      break;
    }
    case 1: {
      // Hexagonal lattice — Service (interconnected network)
      const rings = 5;
      let idx = 0;
      for (let ring = 0; ring <= rings && idx < count; ring++) {
        if (ring === 0) {
          pts.push([0, 0]);
          idx++;
        } else {
          const pointsInRing = ring * 6;
          for (let i = 0; i < pointsInRing && idx < count; i++) {
            const side = Math.floor(i / ring);
            const pos = i % ring;
            const a1 = (Math.PI / 3) * side - Math.PI / 2;
            const a2 = (Math.PI / 3) * ((side + 1) % 6) - Math.PI / 2;
            const scale = ring * 0.17;
            const x1 = Math.cos(a1) * scale, y1 = Math.sin(a1) * scale;
            const x2 = Math.cos(a2) * scale, y2 = Math.sin(a2) * scale;
            pts.push([lerp(x1, x2, pos / ring), lerp(y1, y2, pos / ring)]);
            idx++;
          }
        }
      }
      while (pts.length < count) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.5 + Math.random() * 0.35;
        pts.push([Math.cos(a) * r, Math.sin(a) * r]);
      }
      break;
    }
    case 2: {
      // Rotating diamond with inner cross — Spatial (architectural, structural)
      const outerCount = Math.floor(count * 0.5);
      const crossCount = Math.floor(count * 0.3);
      const innerCount = count - outerCount - crossCount;
      // Outer diamond
      for (let i = 0; i < outerCount; i++) {
        const t = i / outerCount;
        const perim = t * 4;
        let x = 0, y = 0;
        const s = 0.85;
        if (perim < 1) { x = lerp(0, s, perim); y = lerp(-s, 0, perim); }
        else if (perim < 2) { x = lerp(s, 0, perim - 1); y = lerp(0, s, perim - 1); }
        else if (perim < 3) { x = lerp(0, -s, perim - 2); y = lerp(s, 0, perim - 2); }
        else { x = lerp(-s, 0, perim - 3); y = lerp(0, -s, perim - 3); }
        pts.push([x, y]);
      }
      // Cross lines
      for (let i = 0; i < crossCount; i++) {
        const t = (i / crossCount) * 2;
        if (t < 1) pts.push([lerp(-0.65, 0.65, t), 0]);
        else pts.push([0, lerp(-0.65, 0.65, t - 1)]);
      }
      // Inner diamond
      for (let i = 0; i < innerCount; i++) {
        const t = i / innerCount;
        const perim = t * 4;
        let x = 0, y = 0;
        const s = 0.4;
        if (perim < 1) { x = lerp(0, s, perim); y = lerp(-s, 0, perim); }
        else if (perim < 2) { x = lerp(s, 0, perim - 1); y = lerp(0, s, perim - 1); }
        else if (perim < 3) { x = lerp(0, -s, perim - 2); y = lerp(s, 0, perim - 2); }
        else { x = lerp(-s, 0, perim - 3); y = lerp(0, -s, perim - 3); }
        pts.push([x, y]);
      }
      break;
    }
    case 3: {
      // Concentric circles — Interaction (rippling, digital)
      const rings = 5;
      for (let i = 0; i < count; i++) {
        const ring = Math.floor((i / count) * rings);
        const r = 0.18 + ring * 0.16;
        const ringCount = Math.floor(count / rings);
        const angle = ((i % ringCount) / ringCount) * Math.PI * 2 + ring * 0.3;
        pts.push([Math.cos(angle) * r, Math.sin(angle) * r]);
      }
      break;
    }
    case 4: {
      // Triangle with internal subdivisions — Performance (precision, upward)
      const triPts: [number, number][] = [
        [0, -0.9],
        [0.82, 0.65],
        [-0.82, 0.65],
      ];
      const outerCount = Math.floor(count * 0.45);
      const innerCount = count - outerCount;
      // Outer triangle
      for (let i = 0; i < outerCount; i++) {
        const t = i / outerCount;
        const perim = t * 3;
        const side = Math.floor(perim);
        const sideT = perim - side;
        const a = triPts[side % 3];
        const b = triPts[(side + 1) % 3];
        pts.push([lerp(a[0], b[0], sideT), lerp(a[1], b[1], sideT)]);
      }
      // Internal subdivisions
      const midTri: [number, number][] = [
        [0, -0.3],
        [0.35, 0.3],
        [-0.35, 0.3],
      ];
      for (let i = 0; i < innerCount; i++) {
        const t = i / innerCount;
        const perim = t * 3;
        const side = Math.floor(perim);
        const sideT = perim - side;
        const a = midTri[side % 3];
        const b = midTri[(side + 1) % 3];
        pts.push([lerp(a[0], b[0], sideT), lerp(a[1], b[1], sideT)]);
      }
      break;
    }
  }

  // Pad to exact count
  while (pts.length < count) {
    pts.push([
      (Math.random() - 0.5) * 0.4,
      (Math.random() - 0.5) * 0.4,
    ]);
  }

  return pts.slice(0, count);
}

/* ── Particle type ──────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  phase: number; // Individual animation offset
  connections: number[]; // Indices of nearby particles to draw lines to
}

export function InteractiveGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef({
    shapeIndex: 0,
    morphProgress: 1,
    morphStart: 0,
    lastCycleTime: 0,
    mouseX: 0,
    mouseY: 0,
    mouseInside: false,
    mousePressed: false,
    ripples: [] as { x: number; y: number; time: number; strength: number }[],
    time: 0,
  });

  const [activeLabel, setActiveLabel] = useState(LABELS[0]);
  const [shapeIdx, setShapeIdx] = useState(0);

  /* ── Initialise particles ──────────────────────────── */
  useEffect(() => {
    const initialShape = generateShape(0, PARTICLE_COUNT);
    particlesRef.current = initialShape.map(([x, y], i) => ({
      x, y,
      targetX: x,
      targetY: y,
      startX: x,
      startY: y,
      vx: 0,
      vy: 0,
      size: 1.5 + Math.random() * 1.5,
      baseSize: 1.5 + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
      connections: [],
    }));
  }, []);

  /* ── Morph to next shape ───────────────────────────── */
  const morphTo = useCallback((nextIndex: number) => {
    const s = stateRef.current;
    const particles = particlesRef.current;
    const newShape = generateShape(nextIndex, PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles[i].startX = particles[i].x;
      particles[i].startY = particles[i].y;
      particles[i].targetX = newShape[i][0];
      particles[i].targetY = newShape[i][1];
    }

    s.shapeIndex = nextIndex;
    s.morphProgress = 0;
    s.morphStart = performance.now();
    setActiveLabel(LABELS[nextIndex]);
    setShapeIdx(nextIndex);
  }, []);

  /* ── Click = advance shape + add ripple ─────────── */
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const my = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    stateRef.current.ripples.push({
      x: mx, y: my,
      time: performance.now(),
      strength: 1.2,
    });

    const next = (stateRef.current.shapeIndex + 1) % LABELS.length;
    stateRef.current.lastCycleTime = performance.now();
    morphTo(next);
  }, [morphTo]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    stateRef.current.mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    stateRef.current.mouseInside = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    stateRef.current.mouseInside = false;
  }, []);

  /* ── Main render loop ──────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    function resize() {
      if (!canvas || !containerRef.current) return;
      dpr = window.devicePixelRatio || 1;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    }

    resize();
    window.addEventListener("resize", resize);

    stateRef.current.lastCycleTime = performance.now();

    /* Colors */
    const olive = [74, 90, 67];
    const charcoal = [28, 28, 28];

    function draw(time: number) {
      if (!canvas || !ctx) return;
      const s = stateRef.current;
      const particles = particlesRef.current;
      s.time = time;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      /* Auto-cycle */
      if (s.morphProgress >= 1 && time - s.lastCycleTime > AUTO_CYCLE_MS) {
        s.lastCycleTime = time;
        const next = (s.shapeIndex + 1) % LABELS.length;
        // Trigger morph
        const newShape = generateShape(next, PARTICLE_COUNT);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles[i].startX = particles[i].x;
          particles[i].startY = particles[i].y;
          particles[i].targetX = newShape[i][0];
          particles[i].targetY = newShape[i][1];
        }
        s.shapeIndex = next;
        s.morphProgress = 0;
        s.morphStart = time;
        setActiveLabel(LABELS[next]);
        setShapeIdx(next);
      }

      /* Update morph progress */
      if (s.morphProgress < 1) {
        const elapsed = time - s.morphStart;
        s.morphProgress = Math.min(elapsed / MORPH_DURATION, 1);
      }

      const morphT = easeInOutQuart(s.morphProgress);

      /* Clean up old ripples */
      s.ripples = s.ripples.filter((r) => time - r.time < 1500);

      /* ── Update particles ──────────────────────── */
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Base position from morph
        let baseX = lerp(p.startX, p.targetX, morphT);
        let baseY = lerp(p.startY, p.targetY, morphT);

        // Organic floating motion
        const floatX = Math.sin(time * 0.0008 + p.phase) * 0.012;
        const floatY = Math.cos(time * 0.0006 + p.phase * 1.3) * 0.012;
        baseX += floatX;
        baseY += floatY;

        // Mouse repulsion force field
        if (s.mouseInside) {
          const dx = baseX - s.mouseX;
          const dy = baseY - s.mouseY;
          const d = Math.sqrt(dx * dx + dy * dy);
          const radius = 0.45;
          if (d < radius && d > 0.001) {
            const force = (1 - d / radius) * 0.18;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }

          // Mouse attraction ring (particles orbit mouse at distance)
          const orbitRadius = 0.25;
          if (d > orbitRadius * 0.8 && d < orbitRadius * 1.5) {
            const tangentX = -dy / d;
            const tangentY = dx / d;
            p.vx += tangentX * 0.003;
            p.vy += tangentY * 0.003;
          }
        }

        // Ripple displacement
        for (const ripple of s.ripples) {
          const age = (time - ripple.time) / 1500;
          const rippleRadius = age * 1.8;
          const dx = baseX - ripple.x;
          const dy = baseY - ripple.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const ringDist = Math.abs(d - rippleRadius);
          if (ringDist < 0.2 && d > 0.001) {
            const intensity = (1 - age) * ripple.strength * (1 - ringDist / 0.2);
            p.vx += (dx / d) * intensity * 0.08;
            p.vy += (dy / d) * intensity * 0.08;
          }
        }

        // Apply velocity with damping
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x = baseX + p.vx;
        p.y = baseY + p.vy;

        // Particle size pulses
        const sizePulse = 1 + Math.sin(time * 0.002 + p.phase) * 0.3;
        p.size = p.baseSize * sizePulse;

        // Mouse proximity glow
        if (s.mouseInside) {
          const md = dist(p.x, p.y, s.mouseX, s.mouseY);
          p.opacity = lerp(0.4 + Math.random() * 0.1, 1, Math.max(0, 1 - md / 0.5));
          p.size *= lerp(1, 1.8, Math.max(0, 1 - md / 0.35));
        } else {
          p.opacity = 0.45 + Math.sin(time * 0.001 + p.phase) * 0.2;
        }
      }

      /* ── Draw connections ──────────────────────── */
      const connectionDist = 0.14;
      ctx.lineWidth = dpr * 0.5;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const a = particles[i];
        const ax = cx + a.x * scale;
        const ay = cy + a.y * scale;

        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          const b = particles[j];
          const d = dist(a.x, a.y, b.x, b.y);

          if (d < connectionDist) {
            const alpha = (1 - d / connectionDist) * 0.2;
            const bx = cx + b.x * scale;
            const by = cy + b.y * scale;
            ctx.strokeStyle = `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }

        // Mouse connection lines
        if (s.mouseInside) {
          const mx = cx + s.mouseX * scale;
          const my = cy + s.mouseY * scale;
          const md = dist(a.x, a.y, s.mouseX, s.mouseY);
          if (md < 0.35) {
            const alpha = (1 - md / 0.35) * 0.35;
            ctx.strokeStyle = `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, ${alpha})`;
            ctx.lineWidth = dpr * 0.75;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(mx, my);
            ctx.stroke();
            ctx.lineWidth = dpr * 0.5;
          }
        }
      }

      /* ── Draw ripple rings ─────────────────────── */
      for (const ripple of s.ripples) {
        const age = (time - ripple.time) / 1500;
        const r = age * scale * 1.8;
        const alpha = (1 - age) * 0.25 * ripple.strength;
        ctx.strokeStyle = `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, ${alpha})`;
        ctx.lineWidth = dpr * 1.5 * (1 - age);
        ctx.beginPath();
        ctx.arc(cx + ripple.x * scale, cy + ripple.y * scale, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* ── Draw particles ────────────────────────── */
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;

        // Glow for nearby-to-mouse particles
        if (s.mouseInside) {
          const md = dist(p.x, p.y, s.mouseX, s.mouseY);
          if (md < 0.25) {
            const glowAlpha = (1 - md / 0.25) * 0.15;
            const gradient = ctx.createRadialGradient(px, py, 0, px, py, p.size * dpr * 4);
            gradient.addColorStop(0, `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, ${glowAlpha})`);
            gradient.addColorStop(1, `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, 0)`);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(px, py, p.size * dpr * 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Main particle dot
        ctx.fillStyle = `rgba(${charcoal[0]}, ${charcoal[1]}, ${charcoal[2]}, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ── Mouse cursor glow ─────────────────────── */
      if (s.mouseInside) {
        const mx = cx + s.mouseX * scale;
        const my = cy + s.mouseY * scale;
        const cursorGlow = ctx.createRadialGradient(mx, my, 0, mx, my, scale * 0.12);
        cursorGlow.addColorStop(0, `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, 0.08)`);
        cursorGlow.addColorStop(1, `rgba(${olive[0]}, ${olive[1]}, ${olive[2]}, 0)`);
        ctx.fillStyle = cursorGlow;
        ctx.beginPath();
        ctx.arc(mx, my, scale * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] w-full cursor-pointer select-none"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={`Interactive particle system representing the ${activeLabel} layer of the studio model. Click to transform.`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Layer label with animated underline */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="block h-[1px] bg-primary transition-all duration-700 ease-out"
            style={{ width: `${20 + shapeIdx * 8}px` }}
            aria-hidden="true"
          />
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground/80 transition-all duration-700">
            {activeLabel}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40">
          {"Layer"} {shapeIdx + 1} / {LABELS.length}
        </span>
      </div>

      {/* Shape progress dots */}
      <div className="absolute right-8 top-8 flex flex-col gap-2">
        {LABELS.map((label, i) => (
          <button
            key={label}
            onClick={(e) => {
              e.stopPropagation();
              stateRef.current.lastCycleTime = performance.now();
              morphTo(i);
            }}
            className="group flex items-center gap-2 transition-all duration-500"
            aria-label={`Switch to ${label} shape`}
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: shapeIdx === i ? 20 : 6,
                height: 6,
                backgroundColor: shapeIdx === i
                  ? "rgba(74, 90, 67, 0.8)"
                  : "rgba(74, 90, 67, 0.2)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Subtle hint */}
      <p className="absolute bottom-8 right-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/30 transition-opacity duration-500 hover:text-muted-foreground/60">
        {"Interact to explore"}
      </p>
    </div>
  );
}
