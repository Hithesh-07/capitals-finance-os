'use client';

import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  Target, Plus, Calendar, Coins, Sparkles, X, Heart, ShieldAlert 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GoalsPage() {
  const { goals, addGoal, contributeToGoal } = useFinanceStore();

  useEffect(() => {
    document.title = "Goals | CapitalS";
  }, []);

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDueDate] = useState('');
  const [category, setCategory] = useState('Gadgets');
  const [icon, setIcon] = useState('smartphone');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(targetAmount);
    if (!name || target <= 0 || !deadline) return;

    // Calculate suggested monthly contribution
    const monthsDiff = Math.max(1, Math.round(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30.4)
    ));
    const suggested = Math.round(target / monthsDiff);

    await addGoal(name, target, deadline, suggested, category, icon);
    setShowAddForm(false);
    setName('');
    setTargetAmount('');
    setDueDate('');
  };

  const handleContribute = async (goalId: string, amount: number, currentSaved: number, target: number) => {
    await contributeToGoal(goalId, amount);
    
    // Check if adding this amount completes the goal
    if (currentSaved + amount >= target) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#63f7ff', '#dcb8ff', '#72ff70']
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Goals</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Capital Accumulation Targets</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Define Goal
        </button>
      </div>

      {/* ACTIVE GOALS GRID (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {goals.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <Target className="w-12 h-12 text-[#849495] animate-pulse" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">No active goals</h3>
              <p className="text-xs text-[#b9caca] mt-1 max-w-sm leading-relaxed">
                Add target goals like laptops, Goa trips, or Emergency funds to align your investment allocations.
              </p>
            </div>
          </div>
        ) : (
          goals.map(g => {
            const percent = Math.min(100, Math.round((Number(g.saved_amount) / Number(g.target_amount)) * 100));
            const isCompleted = percent >= 100;
            
            // Calculate remaining months
            const monthsLeft = g.deadline 
              ? Math.max(1, Math.ceil(
                  (new Date(g.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30.4)
                )) 
              : 1;

            const remainingAmount = Math.max(0, Number(g.target_amount) - Number(g.saved_amount));
            const suggestedContrib = Math.round(remainingAmount / monthsLeft);

            return (
              <div 
                key={g.id} 
                className={`glass-panel p-6 rounded-2xl flex flex-col gap-5 relative overflow-hidden border-l-4 ${
                  isCompleted 
                    ? 'border-l-tertiary-fixed bg-tertiary-fixed/2' 
                    : 'border-l-primary-fixed bg-primary-fixed/2'
                }`}
              >
                {/* Header details */}
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Target className="w-5 h-5 text-primary-fixed animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-display font-semibold text-white text-base">{g.name}</h3>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">{g.category || 'Personal'}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                    isCompleted 
                      ? 'bg-tertiary-fixed/10 border border-tertiary-fixed/30 text-tertiary-fixed' 
                      : 'bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed'
                  }`}>
                    {isCompleted ? 'Achieved' : 'In Progress'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 z-10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#849495]">{percent}% Saved</span>
                    <span className="text-white">₹{g.saved_amount} / ₹{g.target_amount}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isCompleted ? 'bg-tertiary-fixed' : 'liquid-bar'}`} 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* suggested contributions & actions */}
                <div className="flex justify-between items-center border-t border-white/5 pt-4 z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Suggested Contribution</span>
                    <span className="font-display font-semibold text-white mt-0.5">
                      {isCompleted ? 'N/A' : `₹${suggestedContrib}/mo`}
                    </span>
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleContribute(g.id, 500, Number(g.saved_amount), Number(g.target_amount))}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[10px] font-mono uppercase tracking-wider text-white hover:bg-white/5 transition-all"
                      >
                        + ₹500
                      </button>
                      <button
                        onClick={() => handleContribute(g.id, 1000, Number(g.saved_amount), Number(g.target_amount))}
                        className="magnetic-btn px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold active:scale-95 transition-all"
                      >
                        + ₹1,000
                      </button>
                    </div>
                  )}
                </div>

                {g.deadline && !isCompleted && (
                  <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant font-mono z-10">
                    <Calendar className="w-3.5 h-3.5" />
                    Target deadline: {new Date(g.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ({monthsLeft} months remaining)
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT COLUMN: Info panel & Form (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Goal Rule Info */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full bg-primary-fixed/5 blur-[50px] pointer-events-none" />
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
            <Heart className="w-5 h-5 text-primary-fixed animate-pulse" /> Compound Habits
          </h3>
          
          <div className="flex flex-col gap-3 text-xs text-[#b9caca] leading-relaxed">
            <p>
              Setting clear saving goals helps students defer **impulse desires** in favor of long-term targets (like buying a smartphone or paying for a vacation).
            </p>
            <p>
              Adding contributions directly deducts cash from your ledger balance and automatically registers the entry in your **Investments** logs.
            </p>
          </div>
        </div>

        {/* DEFINE GOAL FORM */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border-primary-fixed/30 bg-primary-fixed/2 flex flex-col gap-4 animate-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                Define Saving Goal
              </h4>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1 text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Goal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="OnePlus 13 or Goa trip"
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    placeholder="15000"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Target Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="Gadgets">Gadgets / Tech</option>
                    <option value="Travel">Travel</option>
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Goal Icon</label>
                  <select
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="smartphone">Smartphone</option>
                    <option value="laptop">Laptop</option>
                    <option value="flight_takeoff">Airplane</option>
                    <option value="shield_alert">Shield</option>
                    <option value="motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold"
              >
                Define Saving Goal
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
