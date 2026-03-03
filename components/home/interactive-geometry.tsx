"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  Five geometric states — each maps to a studio layer:
    0  Business    → rectangle (structured, strategic)
    1  Service     → hexagon (interconnected touchpoints)
    2  Spatial     → rotated square / diamond (architectural form)
    3  Interaction → circle (interface, digital)
    4  Performance → triangle (measurement, upward direction)
*/

const SHAPE_COUNT = 5;
const LABELS = ["Business", "Service", "Spatial", "Interaction", "Performance"];
const TRANSITION_MS = 900;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Return vertices for each shape, normalised to -1..1 space. */
function shapeVertices(index: number, sides: number = 64): [number, number][] {
  switch (index) {
    case 0: {
      // Rectangle
      const w = 0.82,
        h = 0.95;
      return [
        [-w, -h],
        [w, -h],
        [w, h],
        [-w, h],
      ];
    }
    case 1: {
      // Hexagon
      const pts: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        pts.push([Math.cos(a) * 0.88, Math.sin(a) * 0.88]);
      }
      return pts;
    }
    case 2: {
      // Diamond (rotated square)
      const s = 0.92;
      return [
        [0, -s],
        [s, 0],
        [0, s],
        [-s, 0],
      ];
    }
    case 3: {
      // Circle (many-sided polygon)
      const pts: [number, number][] = [];
      for (let i = 0; i < sides; i++) {
        const a = ((Math.PI * 2) / sides) * i - Math.PI / 2;
        pts.push([Math.cos(a) * 0.85, Math.sin(a) * 0.85]);
      }
      return pts;
    }
    case 4: {
      // Triangle
      return [
        [0, -0.95],
        [0.88, 0.72],
        [-0.88, 0.72],
      ];
    }
    default:
      return [[0, 0]];
  }
}

/** Resample a polygon to have exactly `n` evenly-spaced vertices. */
function resamplePolygon(
  pts: [number, number][],
  n: number
): [number, number][] {
  if (pts.length === 0) return Array.from({ length: n }, () => [0, 0] as [number, number]);

  // Calculate total perimeter
  let perimeter = 0;
  for (let i = 0; i < pts.length; i++) {
    const next = pts[(i + 1) % pts.length];
    const dx = next[0] - pts[i][0];
    const dy = next[1] - pts[i][1];
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  const step = perimeter / n;
  const result: [number, number][] = [];
  let edgeIdx = 0;
  let edgeT = 0;
  let accumulated = 0;

  for (let i = 0; i < n; i++) {
    const target = step * i;
    while (accumulated + edgeLengthAt(pts, edgeIdx) * (1 - edgeT) < target && edgeIdx < pts.length) {
      accumulated += edgeLengthAt(pts, edgeIdx) * (1 - edgeT);
      edgeIdx = (edgeIdx + 1) % pts.length;
      edgeT = 0;
    }
    const remaining = target - accumulated;
    const eLen = edgeLengthAt(pts, edgeIdx);
    const t = eLen > 0 ? edgeT + remaining / eLen : 0;
    const a = pts[edgeIdx];
    const b = pts[(edgeIdx + 1) % pts.length];
    result.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
    edgeT = t;
    accumulated = target;
  }
  return result;
}

function edgeLengthAt(pts: [number, number][], i: number): number {
  const a = pts[i % pts.length];
  const b = pts[(i + 1) % pts.length];
  return Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
}

const VERTEX_COUNT = 128;

export function InteractiveGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  const stateRef = useRef({
    currentShape: 0,
    targetShape: 0,
    transitionProgress: 1,
    transitionStart: 0,
    mouseX: 0,
    mouseY: 0,
    mouseInside: false,
    currentVertices: resamplePolygon(shapeVertices(0), VERTEX_COUNT),
    targetVertices: resamplePolygon(shapeVertices(0), VERTEX_COUNT),
    startVertices: resamplePolygon(shapeVertices(0), VERTEX_COUNT),
  });

  const [activeLabel, setActiveLabel] = useState(LABELS[0]);

  const handleClick = useCallback(() => {
    const s = stateRef.current;
    const next = (s.targetShape + 1) % SHAPE_COUNT;
    s.currentShape = s.targetShape;
    s.targetShape = next;
    s.startVertices = s.currentVertices.map((v) => [...v] as [number, number]);
    s.targetVertices = resamplePolygon(shapeVertices(next), VERTEX_COUNT);
    s.transitionProgress = 0;
    s.transitionStart = performance.now();
    setActiveLabel(LABELS[next]);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    stateRef.current.mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    stateRef.current.mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    stateRef.current.mouseInside = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    stateRef.current.mouseInside = false;
  }, []);

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

    const olive = { r: 74, g: 90, b: 67 }; // #4A5A43
    const charcoal = { r: 28, g: 28, b: 28 }; // #1C1C1C
    const border = { r: 216, g: 212, b: 206 }; // #D8D4CE

    function draw(time: number) {
      if (!canvas || !ctx) return;

      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Update transition
      if (s.transitionProgress < 1) {
        const elapsed = time - s.transitionStart;
        s.transitionProgress = Math.min(elapsed / TRANSITION_MS, 1);
      }

      const t = easeInOutCubic(s.transitionProgress);

      // Interpolate vertices
      for (let i = 0; i < VERTEX_COUNT; i++) {
        s.currentVertices[i] = [
          lerp(s.startVertices[i][0], s.targetVertices[i][0], t),
          lerp(s.startVertices[i][1], s.targetVertices[i][1], t),
        ];
      }

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.38;

      // Mouse influence — subtle distortion
      const mxInfluence = s.mouseInside ? s.mouseX * 0.06 : 0;
      const myInfluence = s.mouseInside ? s.mouseY * 0.06 : 0;

      // Draw subtle grid lines in background (architectural reference)
      ctx.strokeStyle = `rgba(${border.r}, ${border.g}, ${border.b}, 0.3)`;
      ctx.lineWidth = dpr * 0.5;
      const gridSize = Math.min(w, h) * 0.1;
      for (let x = cx % gridSize; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = cy % gridSize; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw cross-hair at center
      ctx.strokeStyle = `rgba(${border.r}, ${border.g}, ${border.b}, 0.5)`;
      ctx.lineWidth = dpr * 0.75;
      const crossSize = scale * 0.15;
      ctx.beginPath();
      ctx.moveTo(cx - crossSize, cy);
      ctx.lineTo(cx + crossSize, cy);
      ctx.moveTo(cx, cy - crossSize);
      ctx.lineTo(cx, cy + crossSize);
      ctx.stroke();

      // Draw main shape
      ctx.beginPath();
      for (let i = 0; i < VERTEX_COUNT; i++) {
        const [vx, vy] = s.currentVertices[i];

        // Apply mouse displacement per vertex (closer vertices move more)
        const dist = Math.sqrt(
          (vx - mxInfluence * 2) ** 2 + (vy - myInfluence * 2) ** 2
        );
        const influence = s.mouseInside
          ? Math.max(0, 1 - dist * 0.5) * 0.12
          : 0;

        const px = cx + (vx + mxInfluence + s.mouseX * influence) * scale;
        const py = cy + (vy + myInfluence + s.mouseY * influence) * scale;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Fill with subtle olive
      ctx.fillStyle = `rgba(${olive.r}, ${olive.g}, ${olive.b}, 0.06)`;
      ctx.fill();

      // Stroke main shape
      ctx.strokeStyle = `rgba(${charcoal.r}, ${charcoal.g}, ${charcoal.b}, 0.7)`;
      ctx.lineWidth = dpr * 1.5;
      ctx.stroke();

      // Draw inner smaller shape (echo / architectural plan reference)
      ctx.beginPath();
      const innerScale = 0.55;
      for (let i = 0; i < VERTEX_COUNT; i++) {
        const [vx, vy] = s.currentVertices[i];
        const px = cx + vx * scale * innerScale;
        const py = cy + vy * scale * innerScale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${olive.r}, ${olive.g}, ${olive.b}, 0.35)`;
      ctx.lineWidth = dpr * 1;
      ctx.stroke();

      // Draw vertices as small dots on main shape at key intervals
      const dotInterval = Math.floor(VERTEX_COUNT / (s.targetShape === 3 ? 12 : Math.max(3, shapeVertices(s.targetShape).length)));
      ctx.fillStyle = `rgba(${olive.r}, ${olive.g}, ${olive.b}, 0.6)`;
      for (let i = 0; i < VERTEX_COUNT; i += dotInterval) {
        const [vx, vy] = s.currentVertices[i];
        const px = cx + (vx + mxInfluence) * scale;
        const py = cy + (vy + myInfluence) * scale;
        ctx.beginPath();
        ctx.arc(px, py, dpr * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Diagonal construction line
      ctx.strokeStyle = `rgba(${border.r}, ${border.g}, ${border.b}, 0.25)`;
      ctx.lineWidth = dpr * 0.5;
      ctx.setLineDash([dpr * 4, dpr * 4]);
      ctx.beginPath();
      ctx.moveTo(cx - scale * 1.1, cy - scale * 1.1);
      ctx.lineTo(cx + scale * 1.1, cy + scale * 1.1);
      ctx.stroke();
      ctx.setLineDash([]);

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
      aria-label={`Interactive geometric shape representing the ${activeLabel} layer. Click to morph between shapes.`}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Layer label */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <span className="block h-px w-6 bg-foreground/30" aria-hidden="true" />
        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-all duration-500">
          {activeLabel}
        </span>
      </div>

      {/* Shape index indicators */}
      <div className="absolute right-6 top-6 flex flex-col gap-1.5">
        {LABELS.map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-2 transition-opacity duration-500"
            style={{ opacity: activeLabel === label ? 1 : 0.25 }}
          >
            <span className="block h-px w-3 bg-foreground" />
            <span className="sr-only">{label}</span>
          </div>
        ))}
      </div>

      {/* Click hint */}
      <p className="absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
        Click to transform
      </p>
    </div>
  );
}
