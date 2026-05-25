'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { Coffee, Plane, Film, LayoutGrid } from 'lucide-react';

export default function ExpenseOrbit() {
  const { expenses } = useFinanceStore();
  const [isPaused, setIsPaused] = useState(false);

  // Group expenses by major categories
  const getCategoryTotal = (cat: string) => {
    return expenses
      .filter(e => e.category.toLowerCase().includes(cat.toLowerCase()))
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  };

  const foodTotal = getCategoryTotal('Food');
  const travelTotal = getCategoryTotal('Travel');
  const subsTotal = getCategoryTotal('Subscription');
  
  // Misc totals (everything else)
  const miscTotal = expenses
    .filter(e => {
      const c = e.category.toLowerCase();
      return !c.includes('food') && !c.includes('travel') && !c.includes('subscription');
    })
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="w-full relative flex items-center justify-center min-h-[500px] overflow-hidden rounded-3xl border border-white/5 bg-[radial-gradient(circle_at_center,rgba(99,247,255,0.03)_0%,transparent_75%)]">
      
      {/* Central Node */}
      <div className="absolute w-28 h-28 rounded-full glass-panel flex flex-col items-center justify-center z-10 shadow-[0_0_40px_rgba(99,247,255,0.15)] border-primary-fixed/20">
        <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Core</span>
      </div>

      {/* Food Orbit (Inner) */}
      <div 
        className={`orbit-track orbit-rotate ${isPaused ? 'paused' : ''}`}
        style={{ animationDuration: '20s' }}
      >
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="orb w-36 h-36 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer border-tertiary-fixed/30 bg-tertiary-fixed/5 backdrop-blur-md"
          style={{ transform: 'translate3d(140px, -20px, 0)' }}
        >
          <Coffee className="w-5 h-5 text-tertiary-fixed mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-tertiary-fixed">Food</span>
          
          <div className="orb-content absolute inset-0 rounded-full bg-black/95 flex flex-col items-center justify-center p-3 text-center">
            <span className="font-display font-bold text-white text-base">₹{foodTotal.toLocaleString('en-IN')}</span>
            <span className="font-mono text-[8px] text-[#849495] mt-1">Zomato / Mess</span>
          </div>
        </div>
      </div>

      {/* Subs Orbit (Mid) */}
      <div 
        className={`orbit-track orbit-rotate-reverse ${isPaused ? 'paused' : ''}`}
        style={{ animationDuration: '28s' }}
      >
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="orb w-32 h-32 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer border-secondary/30 bg-secondary/5 backdrop-blur-md"
          style={{ transform: 'translate3d(-180px, 30px, 0)' }}
        >
          <Film className="w-4 h-4 text-secondary mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-secondary">Subs</span>
          
          <div className="orb-content absolute inset-0 rounded-full bg-black/95 flex flex-col items-center justify-center p-3 text-center">
            <span className="font-display font-bold text-white text-sm">₹{subsTotal.toLocaleString('en-IN')}</span>
            <span className="font-mono text-[8px] text-[#849495] mt-1">Streaming/Apps</span>
          </div>
        </div>
      </div>

      {/* Travel Orbit (Outer) */}
      <div 
        className={`orbit-track orbit-rotate ${isPaused ? 'paused' : ''}`}
        style={{ animationDuration: '35s' }}
      >
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="orb w-40 h-40 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer border-primary-fixed/30 bg-primary-fixed/5 backdrop-blur-md"
          style={{ transform: 'translate3d(100px, 200px, 0)' }}
        >
          <Plane className="w-6 h-6 text-primary-fixed mb-1" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-primary-fixed">Travel</span>
          
          <div className="orb-content absolute inset-0 rounded-full bg-black/95 flex flex-col items-center justify-center p-4 text-center">
            <span className="font-display font-bold text-white text-base">₹{travelTotal.toLocaleString('en-IN')}</span>
            <span className="font-mono text-[8px] text-[#849495] mt-1">Uber / Metro</span>
          </div>
        </div>
      </div>

      {/* Misc Orbit (Small, Fast) */}
      <div 
        className={`orbit-track orbit-rotate-reverse ${isPaused ? 'paused' : ''}`}
        style={{ animationDuration: '15s' }}
      >
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="orb w-24 h-24 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer border-[#849495]/30 bg-[#849495]/5 backdrop-blur-md"
          style={{ transform: 'translate3d(-100px, -150px, 0)' }}
        >
          <LayoutGrid className="w-4 h-4 text-[#849495] mb-1" />
          <span className="font-mono text-[8px] uppercase tracking-wider text-[#849495]">Misc</span>
          
          <div className="orb-content absolute inset-0 rounded-full bg-black/95 flex flex-col items-center justify-center p-2 text-center">
            <span className="font-display font-bold text-white text-xs">₹{miscTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
