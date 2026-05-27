'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Sparkles, PieChart as PieIcon, TrendingUp, AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';

/* ─── Floating Particle Field ───────────────────────────────────────────── */
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 6,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary-fixed"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
      {/* Hex grid rotating background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.025]"
        style={{ animation: 'hexRotate 90s linear infinite' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hexGrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon
              points="30,2 58,17 58,43 30,58 2,43 2,17"
              fill="none"
              stroke="#63f7ff"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexGrid)" />
      </svg>
    </div>
  );
}

/* ─── 3D Extruded Bar Chart ─────────────────────────────────────────────── */
function Bar3D({ label, value, maxValue, color, delay }: {
  label: string; value: number; maxValue: number; color: string; delay: number;
}) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const heightPct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const barH = animated ? `${Math.max(heightPct, 4)}%` : '4%';

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      {/* Amount label */}
      <span className="font-mono text-[10px] text-white font-bold">
        ₹{value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString('en-IN')}
      </span>

      {/* 3D bar container */}
      <div className="relative flex-1 w-full flex items-end justify-center" style={{ minHeight: 120 }}>
        <div className="relative" style={{ width: 44, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
          {/* Main bar front face */}
          <div
            className="relative w-full transition-all overflow-hidden"
            style={{
              height: barH,
              background: `linear-gradient(180deg, ${color}cc 0%, ${color}66 100%)`,
              borderRadius: '4px 4px 0 0',
              boxShadow: `0 0 20px ${color}55, inset 0 1px 0 ${color}88`,
              transition: 'height 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Top shine */}
            <div
              className="absolute top-0 left-0 right-0 h-3"
              style={{ background: `linear-gradient(180deg, ${color}aa 0%, transparent 100%)` }}
            />
            {/* Scan line */}
            <div
              className="absolute inset-x-0 h-px"
              style={{
                background: `${color}cc`,
                top: '30%',
                animation: 'scanLine 3s linear infinite',
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          </div>

          {/* 3D top face */}
          <div
            className="absolute left-0 right-0"
            style={{
              height: 10,
              bottom: barH,
              background: `linear-gradient(135deg, ${color}ee 0%, ${color}44 100%)`,
              transform: 'perspective(60px) rotateX(45deg)',
              transformOrigin: 'bottom',
              transition: 'bottom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              borderRadius: '4px 4px 0 0',
            }}
          />

          {/* 3D right side face */}
          <div
            className="absolute right-0"
            style={{
              width: 8,
              bottom: 0,
              height: barH,
              background: `linear-gradient(180deg, ${color}55 0%, ${color}22 100%)`,
              transform: 'perspective(60px) rotateY(-45deg)',
              transformOrigin: 'left',
              transition: 'height 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Floor reflection */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: 20,
              background: `linear-gradient(180deg, ${color}22 0%, transparent 100%)`,
              transform: 'scaleY(-0.4)',
              transformOrigin: 'top',
              filter: 'blur(4px)',
              borderRadius: '0 0 4px 4px',
            }}
          />
        </div>
      </div>

      {/* Label */}
      <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">{label}</span>
    </div>
  );
}

/* ─── Arc Gauge (SVG cockpit dial) ──────────────────────────────────────── */
function ArcGauge({ label, value, total, color, delay }: {
  label: string; value: number; total: number; color: string; delay: number;
}) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0;
  const R = 36;
  const circumference = Math.PI * R; // semicircle
  const dash = animated ? (pct / 100) * circumference : 0;
  const gap = circumference - dash;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-14">
        <svg viewBox="0 0 80 45" className="w-full h-full overflow-visible">
          {/* Track */}
          <path
            d={`M 4 42 A ${R} ${R} 0 0 1 76 42`}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Active arc */}
          <path
            d={`M 4 42 A ${R} ${R} 0 0 1 76 42`}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            style={{
              transition: 'stroke-dasharray 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
          {/* Needle dot */}
          {pct > 0 && (
            <circle
              cx={4 + (72 * (pct / 100))}
              cy={42 - Math.sin((pct / 100) * Math.PI) * R}
              r="4"
              fill={color}
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
          )}
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="font-display font-bold text-white text-sm">{Math.round(pct)}%</span>
        </div>
      </div>

      <div className="text-center">
        <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color }}>{label}</div>
        <div className="font-display font-semibold text-white text-xs mt-0.5">
          ₹{value.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Stat Orb ─────────────────────────────────────────────────────── */
function HeroStat({ label, value, color, icon: Icon, delay }: {
  label: string; value: string; color: string; icon: any; delay: number;
}) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVis(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="relative flex flex-col gap-1 p-6 rounded-2xl border overflow-hidden transition-all duration-700"
      style={{
        borderColor: `${color}25`,
        background: `radial-gradient(ellipse at top left, ${color}10 0%, transparent 60%), rgba(10,10,10,0.6)`,
        backdropFilter: 'blur(20px)',
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-30"
        style={{ background: color }}
      />
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">{label}</span>
      </div>
      <span
        className="font-display font-black text-3xl md:text-4xl tracking-tight"
        style={{
          color,
          textShadow: `0 0 30px ${color}66`,
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Main Analytics Page ───────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const { expenses, incomes, insights } = useFinanceStore();
  const [mounted, setMounted] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    setMounted(true); 
    document.title = "Analytics | CapitalS";
  }, []);

  // Mouse parallax on scene
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -6;
    const ry = ((e.clientX - cx) / rect.width) * 6;
    sceneRef.current.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!sceneRef.current) return;
    sceneRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  }, []);

  // Data
  const totalIn = useMemo(() => incomes.reduce((a, c) => a + Number(c.amount), 0), [incomes]);
  const totalOut = useMemo(() => expenses.reduce((a, c) => a + Number(c.amount), 0), [expenses]);
  const netBalance = totalIn - totalOut;

  // Category chart
  const COLORS = ['#63f7ff', '#7701d0', '#72ff70', '#efdbff', '#dcb8ff', '#ffb4ab', '#00e639', '#849495'];
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });
  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  // Impulse tags
  const impulseTotals = { need: 0, want: 0, impulse: 0 };
  expenses.forEach(e => {
    if (e.tag) impulseTotals[e.tag as keyof typeof impulseTotals] = (impulseTotals[e.tag as keyof typeof impulseTotals] || 0) + Number(e.amount);
  });
  const tagTotal = impulseTotals.need + impulseTotals.want + impulseTotals.impulse;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-sm font-mono uppercase tracking-widest text-[#849495] gap-4">
        <div className="w-10 h-10 border-2 border-primary-fixed border-t-transparent rounded-full animate-spin" />
        Syncing Analytics...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes floatParticle {
          0% { transform: translateY(0px) scale(1); opacity: 0.1; }
          100% { transform: translateY(-30px) scale(1.4); opacity: 0.5; }
        }
        @keyframes hexRotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes scanLine {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes insightSlideIn {
          0% { opacity: 0; transform: translateX(-20px) translateZ(-40px); }
          100% { opacity: 1; transform: translateX(0) translateZ(0); }
        }
        .chart-tilt-container {
          perspective: 900px;
        }
        .chart-tilt-inner {
          transform: rotateX(-18deg) rotateY(2deg);
          transform-style: preserve-3d;
          transition: transform 0.4s ease;
        }
        .chart-tilt-container:hover .chart-tilt-inner {
          transform: rotateX(-10deg) rotateY(0deg);
        }
        .scene-wrapper {
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out;
          will-change: transform;
        }
      `}</style>

      <ParticleField />

      <div
        className="relative z-10 flex flex-col gap-8 w-full max-w-container-max mx-auto pb-12"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={sceneRef as any}
      >
        {/* ── TITLE ── */}
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">
            Analytics Terminal
          </h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">
            Deep Space Telemetry · Real-time financial dimension scan
          </p>
        </div>

        {/* ── HERO STATS ROW ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HeroStat
            label="Total Inflow"
            value={`₹${totalIn.toLocaleString('en-IN')}`}
            color="#72ff70"
            icon={TrendingUp}
            delay={0}
          />
          <HeroStat
            label="Total Outflow"
            value={`₹${totalOut.toLocaleString('en-IN')}`}
            color="#63f7ff"
            icon={Activity}
            delay={150}
          />
          <HeroStat
            label="Net Balance"
            value={`₹${Math.abs(netBalance).toLocaleString('en-IN')}`}
            color={netBalance >= 0 ? '#72ff70' : '#ffb4ab'}
            icon={netBalance >= 0 ? ShieldCheck : AlertTriangle}
            delay={300}
          />
        </div>

        {/* ── ROW 1: Tilted donut + 3D bar chart ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Category Donut — perspective tilted */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <PieIcon className="w-4 h-4 text-primary-fixed" />
              <h3 className="font-display font-semibold text-white text-sm">Outflow Category Split</h3>
            </div>

            <div className="chart-tilt-container">
              <div
                className="chart-tilt-inner glass-panel rounded-3xl p-6"
                style={{ background: 'radial-gradient(ellipse at center, rgba(99,247,255,0.04) 0%, rgba(10,10,10,0.8) 70%)' }}
              >
                <div 
                  style={{ height: 280 }}
                  role="img"
                  aria-label={categoryData.length > 0 ? "Outflow Category Split Pie Chart" : "No expense telemetry recorded"}
                >
                  <div className="sr-only">
                    {categoryData.length > 0 
                      ? `Outflow Category Split: ${categoryData.map(c => `${c.name}: ₹${c.value.toLocaleString('en-IN')}`).join(', ')}`
                      : "No expense telemetry recorded"}
                  </div>
                  {categoryData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-[#849495] font-mono uppercase">
                      No expense telemetry recorded
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          {categoryData.map((_, i) => (
                            <filter key={i} id={`glow-${i}`}>
                              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          ))}
                        </defs>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="48%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={3}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {categoryData.map((_, i) => (
                            <Cell
                              key={`cell-${i}`}
                              fill={COLORS[i % COLORS.length]}
                              style={{ filter: `drop-shadow(0 0 8px ${COLORS[i % COLORS.length]}88)` }}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#050505', borderColor: 'rgba(99,247,255,0.15)', borderRadius: '1rem', color: '#fff', fontFamily: 'monospace', fontSize: 11 }}
                          itemStyle={{ color: '#63f7ff' }}
                          formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          iconSize={7}
                          wrapperStyle={{ fontSize: '9px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#849495', paddingTop: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3D Extruded Cashflow Bar Chart */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <TrendingUp className="w-4 h-4 text-tertiary-fixed" />
              <h3 className="font-display font-semibold text-white text-sm">Cashflow 3D Comparison</h3>
            </div>

            <div
              className="glass-panel rounded-3xl p-6 flex flex-col"
              role="img"
              aria-label="Cashflow 3D Comparison Chart"
              style={{
                background: 'radial-gradient(ellipse at bottom center, rgba(114,255,112,0.04) 0%, rgba(10,10,10,0.8) 70%)',
                minHeight: 320,
              }}
            >
              <div className="sr-only">
                Cashflow 3D Comparison: Inflow is ₹{totalIn.toLocaleString('en-IN')}, Outflow is ₹{totalOut.toLocaleString('en-IN')}, Net is ₹{netBalance.toLocaleString('en-IN')} ({netBalance >= 0 ? 'Positive' : 'Negative'})
              </div>
              {/* Grid lines */}
              <div className="relative flex-1 flex flex-col justify-end">
                {[100, 75, 50, 25].map(pct => (
                  <div
                    key={pct}
                    className="absolute left-0 right-0 border-t border-white/3 flex items-center"
                    style={{ bottom: `${pct}%` }}
                  >
                    <span className="font-mono text-[8px] text-white/20 pr-2 -mt-2">
                      {pct}%
                    </span>
                  </div>
                ))}

                {/* Bars */}
                <div className="flex items-end gap-4 justify-center pt-8" style={{ height: 200 }}>
                  <Bar3D label="Income" value={totalIn} maxValue={Math.max(totalIn, totalOut, 1)} color="#72ff70" delay={400} />
                  <Bar3D label="Expenses" value={totalOut} maxValue={Math.max(totalIn, totalOut, 1)} color="#63f7ff" delay={600} />
                  <Bar3D label="Net" value={Math.abs(netBalance)} maxValue={Math.max(totalIn, totalOut, 1)} color={netBalance >= 0 ? '#efdbff' : '#ffb4ab'} delay={800} />
                </div>

                {/* Dark grid floor */}
                <div
                  className="w-full h-px mt-3"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,247,255,0.3) 50%, transparent 100%)' }}
                />
                <div className="flex justify-center gap-4 mt-4">
                  {[{ l: 'Inflow', c: '#72ff70' }, { l: 'Outflow', c: '#63f7ff' }, { l: 'Net', c: '#efdbff' }].map(({ l, c }) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                      <span className="font-mono text-[9px] uppercase text-[#849495]">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: Arc Gauge Dials + AI Insights ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Cockpit Arc Gauges — Impulse Guard */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Zap className="w-4 h-4 text-secondary" />
              <h3 className="font-display font-semibold text-white text-sm">Impulse Guard — Cockpit Dials</h3>
            </div>

            <div
              className="glass-panel rounded-3xl p-8 flex flex-col gap-6"
              role="img"
              aria-label="Impulse Guard Behavior Cockpit Dials"
              style={{
                background: 'radial-gradient(ellipse at top right, rgba(119,1,208,0.06) 0%, rgba(10,10,10,0.8) 70%)',
                minHeight: 280,
              }}
            >
              <div className="sr-only">
                {tagTotal > 0 
                  ? `Impulse Guard spending split: Needs are ₹${impulseTotals.need.toLocaleString('en-IN')}, Wants are ₹${impulseTotals.want.toLocaleString('en-IN')}, Impulse is ₹${impulseTotals.impulse.toLocaleString('en-IN')}. Total tagged spend is ₹${tagTotal.toLocaleString('en-IN')}.`
                  : "No tagged expenses logged"}
              </div>
              {tagTotal === 0 ? (
                <div className="flex-1 flex items-center justify-center flex-col gap-3 py-8">
                  <ShieldCheck className="w-8 h-8 text-tertiary-fixed animate-pulse" />
                  <span className="text-xs text-[#849495] font-mono uppercase">No tagged expenses logged</span>
                </div>
              ) : (
                <>
                  {/* Cockpit panel decoration */}
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#849495]">Behavior Analysis System</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="flex justify-around items-center">
                    <ArcGauge label="Need" value={impulseTotals.need} total={tagTotal} color="#63f7ff" delay={200} />
                    <ArcGauge label="Want" value={impulseTotals.want} total={tagTotal} color="#efdbff" delay={400} />
                    <ArcGauge label="Impulse" value={impulseTotals.impulse} total={tagTotal} color="#ffb4ab" delay={600} />
                  </div>

                  {/* Total spend bar beneath */}
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-[#849495]">
                      <span>Total Tagged Spend</span>
                      <span>₹{tagTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden bg-white/5 flex">
                      {[
                        { v: impulseTotals.need, c: '#63f7ff' },
                        { v: impulseTotals.want, c: '#efdbff' },
                        { v: impulseTotals.impulse, c: '#ffb4ab' }
                      ].map(({ v, c }, i) => (
                        <div
                          key={i}
                          style={{
                            width: `${tagTotal > 0 ? (v / tagTotal) * 100 : 0}%`,
                            background: c,
                            boxShadow: `0 0 8px ${c}88`,
                            transition: 'width 1s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* AI Insights — staggered depth cascade */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="w-4 h-4 text-primary-fixed" />
              <h3 className="font-display font-semibold text-white text-sm">AI Advisor Insights</h3>
            </div>

            <div
              className="glass-panel rounded-3xl p-6 flex flex-col gap-3 overflow-y-auto"
              style={{
                background: 'radial-gradient(ellipse at bottom left, rgba(99,247,255,0.04) 0%, rgba(10,10,10,0.8) 70%)',
                minHeight: 280,
                maxHeight: 380,
              }}
            >
              {insights.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
                  <ShieldCheck className="w-10 h-10 text-tertiary-fixed" style={{ animation: 'pulseGlow 2s ease-in-out infinite' }} />
                  <span className="text-xs text-[#849495] font-mono uppercase">No advisories triggered</span>
                  <span className="text-[10px] text-white/20 font-mono text-center max-w-[200px]">Financial health sensors nominal</span>
                </div>
              ) : (
                insights.map((ins, i) => (
                  <div
                    key={ins.id}
                    className={`p-4 rounded-xl border flex gap-3 ${
                      ins.type === 'warning'
                        ? 'border-red-500/20 bg-red-500/5'
                        : ins.type === 'safety'
                          ? 'border-yellow-500/20 bg-yellow-500/5'
                          : 'border-primary-fixed/15 bg-primary-fixed/5'
                    }`}
                    style={{
                      animation: `insightSlideIn 0.5s ${i * 0.1}s both ease-out`,
                      transform: `translateZ(${i * -8}px)`,
                    }}
                  >
                    {ins.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-primary-fixed shrink-0 mt-0.5" />
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-[#849495]">
                        {ins.type === 'warning' ? '⚠ Warning Alert' : ins.type === 'safety' ? '⬡ Behavior Alert' : '✦ System Tip'}
                      </span>
                      <p className="text-xs text-[#b9caca] leading-relaxed">{ins.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
