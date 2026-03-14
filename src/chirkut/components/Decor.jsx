import { C } from "../constants";

export function PaperTexture() {
  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.055,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter="url(#noise)"
        style={{ animation: "grain 1s steps(1) infinite", mixBlendMode: "multiply" }}
      />
    </svg>
  );
}

export function CoffeeStain({ style }) {
  return (
    <svg viewBox="0 0 120 120" style={{ ...style, opacity: 0.14, pointerEvents: "none" }}>
      <ellipse cx="60" cy="60" rx="55" ry="52" fill="none" stroke="#6B4F3B" strokeWidth="8" opacity="0.6" />
      <ellipse cx="60" cy="60" rx="40" ry="37" fill="none" stroke="#6B4F3B" strokeWidth="3" opacity="0.4" />
    </svg>
  );
}

export function FloatingParticles() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${8 + i * 9}%`,
    delay: `${i * 0.7}s`,
    dur: `${7 + i * 0.5}s`,
  }));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            bottom: "-30px",
            left: p.left,
            width: 10,
            height: 12,
            background: `linear-gradient(135deg, ${C.paper} 0%, ${C.light} 100%)`,
            border: `1px solid ${C.kraft}`,
            borderRadius: "3px",
            animation: `drift ${p.dur} ${p.delay} ease-in infinite`,
            "--dx": `${-20 + Math.sin(p.id) * 35}px`,
            "--r": `${-15 + p.id * 6}deg`,
          }}
        />
      ))}
    </div>
  );
}

export function LandingScene() {
  return (
    <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D5C4" />
          <stop offset="100%" stopColor="#F5EDE4" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky)" />
      <ellipse cx="200" cy="265" rx="210" ry="25" fill="#BBA081" opacity="0.45" />
      <rect x="80" y="186" width="180" height="12" rx="2" fill="#C8A882" stroke="#6B4F3B" />
      <rect x="85" y="164" width="170" height="10" rx="2" fill="#C8A882" stroke="#6B4F3B" />
      <rect x="95" y="198" width="12" height="62" rx="2" fill="#A87850" stroke="#6B4F3B" />
      <rect x="233" y="198" width="12" height="62" rx="2" fill="#A87850" stroke="#6B4F3B" />
      <rect x="298" y="170" width="42" height="52" rx="4" fill="#CC3333" stroke="#8B2222" strokeWidth="1.5" />
      <ellipse cx="319" cy="170" rx="21" ry="8" fill="#CC3333" stroke="#8B2222" strokeWidth="1.5" />
      <rect x="305" y="195" width="28" height="4" rx="2" fill="#8B2222" />
      <rect x="314" y="222" width="10" height="42" fill="#8B5030" stroke="#6B3820" strokeWidth="1" />
      <ellipse cx="200" cy="140" rx="130" ry="80" fill="#FFD080" opacity="0.08" />
    </svg>
  );
}

export function SleepingCatSvg() {
  return (
    <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <ellipse cx="92" cy="91" rx="47" ry="8.5" fill="#2A2A2A" opacity="0.22" />

      <g style={{ animation: "catBreath 3.2s ease-in-out infinite" }} stroke="#57504A" strokeLinecap="round" strokeLinejoin="round">
        {/* main curled body */}
        <ellipse cx="95" cy="76.5" rx="40" ry="17.5" fill="#D6D0C4" strokeWidth="1.2" />
        <path d="M62 77 q16 -19 49 -13 q18 3 24 16 q-6 8 -19 9 q-8 -14 -28 -14 q-13 0 -26 8 z" fill="#CBC5B9" strokeWidth="1.05" />
        {/* belly */}
        <ellipse cx="90" cy="80" rx="23" ry="9.5" fill="#E1DBD0" stroke="#6A615A" strokeWidth="0.9" opacity="0.88" />
        {/* head */}
        <ellipse cx="62" cy="70.5" rx="15.8" ry="11.4" fill="#D9D3C7" strokeWidth="1.1" />
        {/* ears */}
        <path d="M51.5 64 l-4.6 -8.3 l7.3 3 z" fill="#D9D3C7" strokeWidth="0.95" />
        <path d="M72.8 63.8 l4.8 -8.2 l-7.4 3.1 z" fill="#D9D3C7" strokeWidth="0.95" />
        <path d="M52.8 61.8 l-2.5 -4.2 l4.1 2 z" fill="#E8A56A" stroke="none" opacity="0.8" />
        <path d="M71.6 61.7 l2.4 -4.2 l-4 2 z" fill="#E8A56A" stroke="none" opacity="0.8" />
        {/* closed eyes + face */}
        <path d="M57 71 q2.6 -1.2 5.2 0" fill="none" strokeWidth="0.95" />
        <path d="M65 71 q2.6 -1.2 5.2 0" fill="none" strokeWidth="0.95" />
        <circle cx="63.8" cy="74.4" r="1.05" fill="#D56A2C" stroke="none" />
        <path d="M62.9 75.4 q0.9 1 1.8 0 q0.9 1 1.9 0" fill="none" strokeWidth="0.85" />
        {/* whiskers */}
        <path d="M54.3 73.8 l-8.7 -1.1" strokeWidth="0.82" />
        <path d="M54.4 76.1 l-8 0.2" strokeWidth="0.78" />
        <path d="M73 73.8 l8.7 -1.1" strokeWidth="0.82" />
        <path d="M72.9 76.1 l8 0.2" strokeWidth="0.78" />
        {/* paws */}
        <ellipse cx="53.4" cy="82.2" rx="5.8" ry="3.15" fill="#ECE6DB" stroke="#6A615A" strokeWidth="0.7" />
        <ellipse cx="61.5" cy="82.3" rx="5.8" ry="3.15" fill="#ECE6DB" stroke="#6A615A" strokeWidth="0.7" />
        {/* tabby stripes */}
        <path d="M86 88 q0 -8 2.6 -11.8" fill="none" stroke="#D56A2C" strokeWidth="1.1" />
        <path d="M95.8 89 q0 -8 2.7 -11.8" fill="none" stroke="#D56A2C" strokeWidth="1.1" />
        <path d="M106 87.8 q0 -7.1 2.5 -10.6" fill="none" stroke="#D56A2C" strokeWidth="1.02" />
      </g>

      <g style={{ transformOrigin: "135px 77px", animation: "tailSwish 2.6s ease-in-out infinite" }} stroke="#57504A" strokeWidth="1.1">
        <path d="M122 77 q27 -13 34 5 q-9 12 -34 9 q5 -4 3 -14z" fill="#D2CBC0" />
      </g>
    </svg>
  );
}
