'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Coffee, Plane, Film, LayoutGrid, ShoppingBag, Heart, BookOpen, Home } from 'lucide-react';

/* ─── Category config ───────────────────────────────────────────────────── */
const ORBIT_CATEGORIES = [
  {
    key: 'food',
    label: 'Food',
    filter: (c: string) => c.toLowerCase().includes('food') || c.toLowerCase().includes('dining'),
    icon: Coffee,
    color: '#72ff70',
    orbitR: 120,
    size: 64,
    speed: 22,
    startAngle: 0,
    reverse: false,
    sub: 'Zomato / Mess',
  },
  {
    key: 'travel',
    label: 'Travel',
    filter: (c: string) => c.toLowerCase().includes('travel'),
    icon: Plane,
    color: '#63f7ff',
    orbitR: 180,
    size: 72,
    speed: 34,
    startAngle: 110,
    reverse: true,
    sub: 'Uber / Metro',
  },
  {
    key: 'subs',
    label: 'Subs',
    filter: (c: string) => c.toLowerCase().includes('subscri'),
    icon: Film,
    color: '#efdbff',
    orbitR: 230,
    size: 60,
    speed: 45,
    startAngle: 220,
    reverse: false,
    sub: 'Netflix / Apps',
  },
  {
    key: 'shopping',
    label: 'Shop',
    filter: (c: string) => c.toLowerCase().includes('shop'),
    icon: ShoppingBag,
    color: '#ffb4ab',
    orbitR: 155,
    size: 54,
    speed: 28,
    startAngle: 180,
    reverse: true,
    sub: 'Amazon / Myntra',
  },
  {
    key: 'health',
    label: 'Health',
    filter: (c: string) => c.toLowerCase().includes('health'),
    icon: Heart,
    color: '#ff6b8a',
    orbitR: 200,
    size: 50,
    speed: 38,
    startAngle: 50,
    reverse: false,
    sub: 'Pharmacy / Clinic',
  },
  {
    key: 'misc',
    label: 'Misc',
    filter: (_: string) => true, // catches rest (applied last)
    icon: LayoutGrid,
    color: '#849495',
    orbitR: 255,
    size: 46,
    speed: 55,
    startAngle: 300,
    reverse: true,
    sub: 'Other spends',
  },
];

/* ─── Star particle component ────────────────────────────────────────────── */
function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 2.5 + 0.5,
      o: Math.random() * 0.6 + 0.1,
      d: Math.random() * 4 + 2,
    })), []);

  return (
    <>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            opacity: s.o,
            animation: `starTwinkle ${s.d}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </>
  );
}

/* ─── Animated planet that orbits via requestAnimationFrame ─────────────── */
function OrbitPlanet({
  cat, amount, totalOut, isPaused,
}: {
  cat: typeof ORBIT_CATEGORIES[0];
  amount: number;
  totalOut: number;
  isPaused: boolean;
}) {
  const angleRef = useRef(cat.startAngle);
  const rafRef = useRef<number>(0);
  const planetRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const pct = totalOut > 0 ? Math.round((amount / totalOut) * 100) : 0;

  // Use angle ref for RAF to avoid stale closures
  const isPausedRef = useRef(isPaused || hovering);
  isPausedRef.current = isPaused || hovering;

  useEffect(() => {
    const SPEED = 360 / (cat.speed * 60); // degrees per frame at 60fps
    const R = cat.orbitR;
    const dir = cat.reverse ? -1 : 1;

    const animate = () => {
      if (!isPausedRef.current) {
        angleRef.current = (angleRef.current + SPEED * dir + 360) % 360;
      }
      if (planetRef.current) {
        const rad = (angleRef.current * Math.PI) / 180;
        const x = Math.cos(rad) * R;
        const y = Math.sin(rad) * R * 0.45; // elliptical (squash Y for perspective)
        planetRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        // Depth illusion: scale up when "near", down when "far"
        const depth = (Math.sin(rad) + 1) / 2; // 0..1
        const scale = 0.75 + depth * 0.45;
        const zIndex = Math.round(depth * 10);
        planetRef.current.style.zIndex = String(zIndex);
        (planetRef.current.firstChild as HTMLElement | null)!.style.transform = `scale(${scale})`;
        (planetRef.current.firstChild as HTMLElement | null)!.style.opacity = String(0.55 + depth * 0.45);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cat]);

  const Icon = cat.icon;

  return (
    <div
      ref={planetRef}
      className="absolute top-1/2 left-1/2 cursor-pointer"
      style={{ transition: 'z-index 0s' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative" style={{ transition: 'transform 0.3s ease, opacity 0.3s ease' }}>
        {/* Planet body */}
        <div
          className="rounded-full flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            width: cat.size,
            height: cat.size,
            background: `radial-gradient(circle at 35% 30%, ${cat.color}55 0%, ${cat.color}18 50%, transparent 100%)`,
            border: `1.5px solid ${cat.color}60`,
            boxShadow: hovering
              ? `0 0 30px ${cat.color}88, 0 0 60px ${cat.color}44, inset 0 0 20px ${cat.color}22`
              : `0 0 12px ${cat.color}55, inset 0 0 10px ${cat.color}15`,
            backdropFilter: 'blur(8px)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Planet surface shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 25%, ${cat.color}30 0%, transparent 60%)`,
            }}
          />

          {/* Planet ring */}
          <div
            className="absolute"
            style={{
              width: cat.size * 1.6,
              height: cat.size * 0.25,
              border: `1px solid ${cat.color}30`,
              borderRadius: '50%',
              transform: 'rotateX(70deg)',
            }}
          />

          <Icon
            style={{
              width: cat.size * 0.28,
              height: cat.size * 0.28,
              color: cat.color,
              filter: `drop-shadow(0 0 4px ${cat.color})`,
              position: 'relative',
              zIndex: 1,
            }}
          />
          <span
            className="font-mono uppercase tracking-wider relative z-10"
            style={{ fontSize: cat.size * 0.11, color: cat.color, marginTop: 2 }}
          >
            {cat.label}
          </span>
        </div>

        {/* Hover tooltip card */}
        {hovering && (
          <div
            className="absolute left-1/2 z-50 flex flex-col gap-1 pointer-events-none"
            style={{
              bottom: cat.size + 8,
              transform: 'translateX(-50%)',
              background: 'rgba(5,5,5,0.95)',
              border: `1px solid ${cat.color}40`,
              borderRadius: 12,
              padding: '8px 12px',
              minWidth: 120,
              boxShadow: `0 0 20px ${cat.color}33`,
              backdropFilter: 'blur(20px)',
              animation: 'tooltipIn 0.15s ease-out',
            }}
          >
            <span
              className="font-mono text-[8px] uppercase tracking-widest"
              style={{ color: cat.color }}
            >
              {cat.label} · {pct}%
            </span>
            <span className="font-display font-bold text-white text-base">
              ₹{amount.toLocaleString('en-IN')}
            </span>
            <span className="font-mono text-[9px] text-[#849495]">{cat.sub}</span>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
              <div
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: cat.color,
                  boxShadow: `0 0 6px ${cat.color}`,
                  borderRadius: '9999px',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Elliptical orbit ring SVG ─────────────────────────────────────────── */
function OrbitRing({ r, color }: { r: number; color: string }) {
  return (
    <svg
      className="absolute top-1/2 left-1/2"
      style={{ transform: 'translate(-50%, -50%)', overflow: 'visible', pointerEvents: 'none' }}
      width={r * 2 + 40}
      height={r * 0.9 + 20}
    >
      <ellipse
        cx={r + 20}
        cy={(r * 0.45) + 10}
        rx={r}
        ry={r * 0.45}
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeDasharray="4 8"
        opacity={0.3}
      />
    </svg>
  );
}

/* ─── Main ExpenseOrbit Component ───────────────────────────────────────── */
export default function ExpenseOrbit() {
  const { expenses } = useFinanceStore();
  const [isPaused, setIsPaused] = useState(false);
  const [totalOut, setTotalOut] = useState(0);

  const categoryAmounts = useMemo(() => {
    const assigned = new Set<string>();
    const amounts: Record<string, number> = {};

    // Process all categories except misc first
    ORBIT_CATEGORIES.filter(c => c.key !== 'misc').forEach(cat => {
      const matched = expenses.filter(e => cat.filter(e.category));
      amounts[cat.key] = matched.reduce((a, e) => a + Number(e.amount), 0);
      matched.forEach(e => assigned.add(e.id));
    });

    // Misc = everything not yet assigned
    amounts['misc'] = expenses
      .filter(e => !assigned.has(e.id))
      .reduce((a, e) => a + Number(e.amount), 0);

    const out = expenses.reduce((a, e) => a + Number(e.amount), 0);
    setTotalOut(out);
    return amounts;
  }, [expenses]);

  return (
    <>
      <style>{`
        @keyframes starTwinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes nucleusPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(99,247,255,0.3), 0 0 80px rgba(99,247,255,0.1); transform: scale(1); }
          50% { box-shadow: 0 0 60px rgba(99,247,255,0.5), 0 0 120px rgba(99,247,255,0.2); transform: scale(1.04); }
        }
        @keyframes coronaRing1 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.7); opacity: 0; }
        }
        @keyframes coronaRing2 {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
        @keyframes tooltipIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(6px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes orbitFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden rounded-3xl border border-white/5"
        style={{
          minHeight: 520,
          background: 'radial-gradient(ellipse at center, rgba(99,247,255,0.04) 0%, rgba(5,0,15,0.95) 70%)',
        }}
        onMouseEnter={() => setIsPaused(false)}
      >
        {/* Starfield */}
        <div className="absolute inset-0">
          <Stars />
        </div>

        {/* Nebula bloom behind nucleus */}
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(99,247,255,0.07) 0%, rgba(119,1,208,0.04) 50%, transparent 80%)',
            pointerEvents: 'none',
          }}
        />

        {/* Orbit ring trails (SVG ellipses) */}
        {ORBIT_CATEGORIES.map(cat => (
          <OrbitRing key={cat.key} r={cat.orbitR} color={cat.color} />
        ))}

        {/* Planets */}
        {ORBIT_CATEGORIES.map(cat => (
          <OrbitPlanet
            key={cat.key}
            cat={cat}
            amount={categoryAmounts[cat.key] ?? 0}
            totalOut={totalOut}
            isPaused={isPaused}
          />
        ))}

        {/* Central Nucleus Sun */}
        <div
          className="absolute top-1/2 left-1/2 z-20"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          {/* Corona rings */}
          <div
            className="absolute rounded-full border border-primary-fixed/30"
            style={{
              width: 130,
              height: 130,
              top: '50%',
              left: '50%',
              animation: 'coronaRing1 3s ease-out infinite',
            }}
          />
          <div
            className="absolute rounded-full border border-primary-fixed/20"
            style={{
              width: 130,
              height: 130,
              top: '50%',
              left: '50%',
              animation: 'coronaRing2 3s 1.5s ease-out infinite',
            }}
          />

          {/* Nucleus body */}
          <div
            className="w-28 h-28 rounded-full flex flex-col items-center justify-center relative"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(99,247,255,0.25) 0%, rgba(10,10,10,0.95) 70%)',
              border: '1.5px solid rgba(99,247,255,0.4)',
              animation: 'nucleusPulse 4s ease-in-out infinite',
            }}
          >
            <span className="font-mono text-[8px] uppercase tracking-widest text-primary-fixed">Core</span>
            <span className="font-display font-bold text-white text-lg mt-0.5">
              ₹{totalOut >= 1000 ? `${(totalOut / 1000).toFixed(1)}k` : totalOut}
            </span>
            <span className="font-mono text-[7px] uppercase text-[#849495] mt-0.5">Total Spend</span>
          </div>
        </div>

        {/* Pause overlay hint */}
        <div className="absolute bottom-4 right-4 z-30">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="font-mono text-[8px] uppercase tracking-widest text-[#849495] border border-white/5 px-3 py-1.5 rounded-lg hover:border-primary-fixed/30 hover:text-primary-fixed transition-all bg-black/50 backdrop-blur-sm"
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'} Orbit
          </button>
        </div>
      </div>
    </>
  );
}
