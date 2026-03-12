import demoImg from "./assets/demo.png";

function getTangentPoint(center, radius, angle) {
  return {
    x: center.x + radius * Math.cos(angle),
    y: center.y + radius * Math.sin(angle),
  };
}

export default function App() {
  const left  = { x: 152, y: 155 };
  const right = { x: 328, y: 155 };
  const r = 56;

  // Bottom
  const leftBottomAngle  = Math.PI / 2 + 0.35;
  const rightBottomAngle = Math.PI / 2 - 0.35;
  const lb = getTangentPoint(left,  r, leftBottomAngle);
  const rb = getTangentPoint(right, r, rightBottomAngle);

  // Top
  const leftTopAngle  = -Math.PI / 2 - 0.25;
  const rightTopAngle = -Math.PI / 2 + 0.25;
  const lt = getTangentPoint(left,  r, leftTopAngle);
  const rt = getTangentPoint(right, r, rightTopAngle);

  const midX = (lb.x + rb.x) / 2;

  // Bottom sag
  const bottomSag = 25;
  const bottomCurve = `M ${lb.x} ${lb.y} C ${midX - 60} ${lb.y + bottomSag}, ${midX + 60} ${rb.y + bottomSag}, ${rb.x} ${rb.y}`;

  // Top curve config
  const topSag = 15;       // how much the middle sags down
  const bumpOut = 38;      // how far outward the end bump pushes
  const bumpUp = 12;       // how high the end bump rises

  const topCurve = `M ${lt.x} ${lt.y} C ${lt.x + bumpOut} ${lt.y - bumpUp}, ${midX - 40} ${lt.y + topSag}, ${midX} ${lt.y + topSag}
    C ${midX + 40} ${rt.y + topSag}, ${rt.x - bumpOut} ${rt.y - bumpUp}, ${rt.x} ${rt.y}`;

  return (
    <main className="min-h-screen flex gap-8 p-4 bg-background">
      <section>
        <img src={demoImg} alt="demo" className="w-md aspect-auto" />
      </section>
      <section>
        <div className="rounded-3xl w-lg h-80 bg-background border-border border relative">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 480 320">
            <circle cx={left.x}  cy={left.y}  r={r} fill="none" stroke="white" strokeWidth="2" />
            <circle cx={right.x} cy={right.y} r={r} fill="none" stroke="white" strokeWidth="2" />
            <path d={bottomCurve} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d={topCurve}    fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </section>
    </main>
  );
}