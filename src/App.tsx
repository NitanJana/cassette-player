import { useState, useRef } from "react";
import demoImg from "./assets/demo.png";

interface Point {
  x: number;
  y: number;
}

interface TapeConfig {
  topSag: number;
  bumpOut: number;
  bumpUp: number;
  bottomSag: number;
  bottomSpread: number;
  leftBottomAngle: number;
  rightBottomAngle: number;
  leftTopAngle: number;
  rightTopAngle: number;
}

function getTangentPoint(center: Point, radius: number, angle: number): Point {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerpConfig(a: TapeConfig, b: TapeConfig, t: number): TapeConfig {
  return {
    topSag:           lerp(a.topSag,           b.topSag,           t),
    bumpOut:          lerp(a.bumpOut,          b.bumpOut,          t),
    bumpUp:           lerp(a.bumpUp,           b.bumpUp,           t),
    bottomSag:        lerp(a.bottomSag,        b.bottomSag,        t),
    bottomSpread:     lerp(a.bottomSpread,     b.bottomSpread,     t),
    leftBottomAngle:  lerp(a.leftBottomAngle,  b.leftBottomAngle,  t),
    rightBottomAngle: lerp(a.rightBottomAngle, b.rightBottomAngle, t),
    leftTopAngle:     lerp(a.leftTopAngle,     b.leftTopAngle,     t),
    rightTopAngle:    lerp(a.rightTopAngle,    b.rightTopAngle,    t),
  };
}

const DROOPY: TapeConfig = {
  topSag:           15,
  bumpOut:          28,
  bumpUp:           12,
  bottomSag:        25,
  bottomSpread:     60,
  leftBottomAngle:  Math.PI / 2 + 0.35,
  rightBottomAngle: Math.PI / 2 - 0.35,
  leftTopAngle:    -Math.PI / 2 - 0.25,
  rightTopAngle:   -Math.PI / 2 + 0.25,
};

const TIGHT: TapeConfig = {
  topSag:           0,
  bumpOut:          4,
  bumpUp:           2,
  bottomSag:        15,
  bottomSpread:     30,
  leftBottomAngle:  Math.PI / 2 + 0.2,
  rightBottomAngle: Math.PI / 2 - 0.2,
  leftTopAngle:    -Math.PI / 2 - 0.15,
  rightTopAngle:   -Math.PI / 2 + 0.15,
};

export default function App() {
  const left: Point  = { x: 152, y: 155 };
  const right: Point = { x: 328, y: 155 };
  const r = 56;

  const [progress, setProgress] = useState<number>(0);
  const [isTight, setIsTight] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);

  function animate(targetProgress: number): void {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startProgress = progressRef.current;
    startRef.current = null;

    function step(timestamp: number): void {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const duration = 600;
      const raw = Math.min(elapsed / duration, 1);
      const eased = easeInOut(raw);
      const current = lerp(startProgress, targetProgress, eased);
      progressRef.current = current;
      setProgress(current);
      if (raw < 1) animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);
  }

  function handleClick(): void {
    const next = !isTight;
    setIsTight(next);
    animate(next ? 1 : 0);
  }

  const cfg = lerpConfig(DROOPY, TIGHT, progress);

  const lb = getTangentPoint(left,  r, cfg.leftBottomAngle);
  const rb = getTangentPoint(right, r, cfg.rightBottomAngle);
  const lt = getTangentPoint(left,  r, cfg.leftTopAngle);
  const rt = getTangentPoint(right, r, cfg.rightTopAngle);

  const midX = (lb.x + rb.x) / 2;

  const bottomCurve = `M ${lb.x} ${lb.y} C ${midX - cfg.bottomSpread} ${lb.y + cfg.bottomSag}, ${midX + cfg.bottomSpread} ${rb.y + cfg.bottomSag}, ${rb.x} ${rb.y}`;
  const topCurve = `M ${lt.x} ${lt.y} C ${lt.x + cfg.bumpOut} ${lt.y - cfg.bumpUp}, ${midX - 40} ${lt.y + cfg.topSag}, ${midX} ${lt.y + cfg.topSag}
    C ${midX + 40} ${rt.y + cfg.topSag}, ${rt.x - cfg.bumpOut} ${rt.y - cfg.bumpUp}, ${rt.x} ${rt.y}`;

  return (
    <main className="min-h-screen flex flex-col gap-8 p-4 bg-background">
      <section className="flex gap-8">
        <img src={demoImg} alt="demo" className="w-md aspect-auto" />
        <div className="rounded-3xl w-lg h-80 bg-background border-border border relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 320">
            <circle cx={left.x}  cy={left.y}  r={r} fill="none" stroke="white" strokeWidth="2" />
            <circle cx={right.x} cy={right.y} r={r} fill="none" stroke="white" strokeWidth="2" />
            <path d={bottomCurve} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d={topCurve}    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </section>
      <button
        onClick={handleClick}
        className="self-start px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors"
      >
        {isTight ? "Loosen tape" : "Tighten tape"}
      </button>
    </main>
  );
}