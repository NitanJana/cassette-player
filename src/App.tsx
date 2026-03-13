import { animate } from "motion/react";
import { useState } from "react";
import demoImg from "./assets/demo.png";

interface Point {
  x: number;
  y: number;
}

interface TapeConfig {
  topSag: number;
  topBumpOut: number;
  topBumpUp: number;
  bottomSag: number;
  bottomSpread: number;
  leftBottomAngle: number;
  rightBottomAngle: number;
  leftTopAngle: number;
  rightTopAngle: number;
}

function getPointOnCircle(center: Point, radius: number, angle: number): Point {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpConfig(a: TapeConfig, b: TapeConfig, t: number): TapeConfig {
  return {
    topSag: lerp(a.topSag, b.topSag, t),
    topBumpOut: lerp(a.topBumpOut, b.topBumpOut, t),
    topBumpUp: lerp(a.topBumpUp, b.topBumpUp, t),
    bottomSag: lerp(a.bottomSag, b.bottomSag, t),
    bottomSpread: lerp(a.bottomSpread, b.bottomSpread, t),
    leftBottomAngle: lerp(a.leftBottomAngle, b.leftBottomAngle, t),
    rightBottomAngle: lerp(a.rightBottomAngle, b.rightBottomAngle, t),
    leftTopAngle: lerp(a.leftTopAngle, b.leftTopAngle, t),
    rightTopAngle: lerp(a.rightTopAngle, b.rightTopAngle, t),
  };
}

const LOOSE: TapeConfig = {
  topSag: 15,
  topBumpOut: 28,
  topBumpUp: 12,
  bottomSag: 25,
  bottomSpread: 60,
  leftBottomAngle: Math.PI / 2 + 0.35,
  rightBottomAngle: Math.PI / 2 - 0.35,
  leftTopAngle: -Math.PI / 2 - 0.25,
  rightTopAngle: -Math.PI / 2 + 0.25,
};

const TIGHT: TapeConfig = {
  topSag: 0,
  topBumpOut: 4,
  topBumpUp: 2,
  bottomSag: 15,
  bottomSpread: 30,
  leftBottomAngle: Math.PI / 2 + 0.2,
  rightBottomAngle: Math.PI / 2 - 0.2,
  leftTopAngle: -Math.PI / 2 - 0.15,
  rightTopAngle: -Math.PI / 2 + 0.15,
};

const LEFT_REEL: Point = { x: 150, y: 160 };
const RIGHT_REEL: Point = { x: 330, y: 160 };
const REEL_RADIUS = 56;

export default function App() {
  const [t, setT] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function toggle(): void {
  setIsPlaying(prev => {
    animate(t, prev ? 0 : 1, {
      duration: 0.6,
      ease: "easeInOut",
      onUpdate: setT,
    });
    return !prev;
  });
}

  const cfg = lerpConfig(LOOSE, TIGHT, t);

  const bottomLeft = getPointOnCircle(LEFT_REEL, REEL_RADIUS, cfg.leftBottomAngle);
  const bottomRight = getPointOnCircle(RIGHT_REEL, REEL_RADIUS, cfg.rightBottomAngle);
  const topLeft = getPointOnCircle(LEFT_REEL, REEL_RADIUS, cfg.leftTopAngle);
  const topRight = getPointOnCircle(RIGHT_REEL, REEL_RADIUS, cfg.rightTopAngle);

  const midX = (bottomLeft.x + bottomRight.x) / 2;

  const bottomTape = `M ${bottomLeft.x} ${bottomLeft.y}
    C ${midX - cfg.bottomSpread} ${bottomLeft.y + cfg.bottomSag},
      ${midX + cfg.bottomSpread} ${bottomRight.y + cfg.bottomSag},
      ${bottomRight.x} ${bottomRight.y}`;

  const topTape = `M ${topLeft.x} ${topLeft.y}
    C ${topLeft.x + cfg.topBumpOut} ${topLeft.y - cfg.topBumpUp},
      ${midX - 40} ${topLeft.y + cfg.topSag},
      ${midX} ${topLeft.y + cfg.topSag}
    C ${midX + 40} ${topRight.y + cfg.topSag},
      ${topRight.x - cfg.topBumpOut} ${topRight.y - cfg.topBumpUp},
      ${topRight.x} ${topRight.y}`;

  return (
    <main className="min-h-screen flex flex-col gap-8 p-4 bg-background">
      <section className="flex gap-8">
        <img src={demoImg} alt="demo" className="w-md aspect-auto" />
        <div className="rounded-3xl w-lg h-80 bg-background border-border border relative">
          <svg role="img" aria-label="Cassette tape animation" className="absolute inset-0 w-full h-full" viewBox="0 0 480 320">
            <circle cx={LEFT_REEL.x}  cy={LEFT_REEL.y}  r={REEL_RADIUS} fill="none" stroke="white" strokeWidth="2" />
            <circle cx={RIGHT_REEL.x} cy={RIGHT_REEL.y} r={REEL_RADIUS} fill="none" stroke="white" strokeWidth="2" />
            <path d={bottomTape} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d={topTape}    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </section>
      <button
        type="button"
        onClick={toggle}
        className="self-start px-6 py-2 rounded-full border border-white text-white hover:bg-white hover:text-black transition-colors"
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
    </main>
  );
}