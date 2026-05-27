'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  PiggyBank, Plus, AlertOctagon, AlertTriangle, ShieldCheck, RefreshCw, X 
} from 'lucide-react';

export default function BudgetsPage() {
  const { budgets, addBudget, expenses } = useFinanceStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [category, setCategory] = useState('Food & Dining');
  const [limit, setLimit] = useState('');
  const [rollover, setRollover] = useState(false);

  const categories = [
    'Food & Dining', 'Travel', 'Education', 'Shopping', 'Subscriptions', 
    'Health', 'Housing', 'Social', 'Loans & EMI', 'Investments', 'Miscellaneous'
  ];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const l = Number(limit);
    if (l <= 0) return;

    const m = new Date().getMonth() + 1;
    const y = new Date().getFullYear();
    await addBudget(category, l, m, y, rollover);

    setShowAddForm(false);
    setLimit('');
    setRollover(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Budgets</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Monthly category limits</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Setup Limit
        </button>
      </div>

      {/* BUDGET PROGRESS CARDS (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {budgets.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <PiggyBank className="w-12 h-12 text-[#849495] animate-pulse" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">No active budgets</h3>
              <p className="text-xs text-[#b9caca] mt-1 max-w-sm leading-relaxed">
                Establish monthly category limits to control cash velocity and keep Brokeman Mode at bay.
              </p>
            </div>
          </div>
        ) : (
          budgets.map(b => {
            const percent = Math.min(100, Math.round((Number(b.spent) / Number(b.monthly_limit)) * 100));
            const isNearLimit = percent >= 80 && percent < 100;
            const isExceeded = percent >= 100;

            return (
              <div 
                key={b.id} 
                className={`glass-panel p-6 rounded-2xl flex flex-col gap-4 border-l-4 relative overflow-hidden ${
                  isExceeded 
                    ? 'border-l-red-500 bg-red-500/2' 
                    : isNearLimit 
                      ? 'border-l-yellow-500 bg-yellow-500/2' 
                      : 'border-l-primary-fixed bg-primary-fixed/2'
                }`}
              >
                {/* Header details */}
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col">
                    <h3 className="font-display font-semibold text-white text-base">{b.category}</h3>
                    <span className="text-[10px] text-[#849495] font-mono mt-0.5">
                      {b.rollover_enabled ? 'Rollover Enabled' : 'No Rollover'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExceeded ? (
                      <span className="px-2 py-0.5 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-[8px] uppercase tracking-wider flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3 text-red-400" /> Overspent
                      </span>
                    ) : isNearLimit ? (
                      <span className="px-2 py-0.5 rounded-lg border border-yellow-500/20 bg-yellow-500/10 text-yellow-400 font-mono text-[8px] uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-yellow-400" /> Near Limit
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-lg border border-primary-fixed/20 bg-primary-fixed/10 text-primary-fixed font-mono text-[8px] uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-primary-fixed" /> Safe
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 z-10">
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full ${
                        isExceeded ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'liquid-bar'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono mt-0.5">
                    <span className="text-[#849495]">{percent}% Used</span>
                    <span className="text-white">₹{b.spent} / ₹{b.monthly_limit}</span>
                  </div>
                </div>

                {/* Remaining metrics */}
                {Number(b.monthly_limit) - Number(b.spent) > 0 ? (
                  <div className="text-[10px] text-on-surface-variant font-mono z-10">
                    Remaining runway allowance: <span className="text-white font-semibold">₹{Number(b.monthly_limit) - Number(b.spent)}</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-red-400 font-mono z-10">
                    Exceeded by <span className="font-bold">₹{Math.abs(Number(b.monthly_limit) - Number(b.spent))}</span>. Will eat into savings!
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT COLUMN: Info panel & Form (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Budget Rule Info */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full bg-primary-fixed/5 blur-[50px] pointer-events-none" />
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
            <RefreshCw className="w-5 h-5 text-primary-fixed animate-spin" style={{ animationDuration: '20s' }} /> Rollover Logic
          </h3>
          
          <div className="flex flex-col gap-3 text-xs text-[#b9caca] leading-relaxed">
            <p>
              CapitalS supports **Budget Rollovers**. When rollover is enabled, any remaining surplus from the current month is automatically appended to the next month's category limits.
            </p>
            <p>
              Students who save on Food & Dining or Travel can rollover their surplus to create a luxury budget pool for weekend outings!
            </p>
          </div>
        </div>

        {/* SETUP BUDGET FORM */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border-primary-fixed/30 bg-primary-fixed/2 flex flex-col gap-4 animate-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                Configure Category Limit
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
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Monthly Limit (₹)</label>
                <input
                  type="number"
                  required
                  value={limit}
                  onChange={e => setLimit(e.target.value)}
                  placeholder="3000"
                  className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex items-center justify-between border border-white/5 p-3 rounded-xl bg-black/40">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Enable Rollover</span>
                  <span className="text-[9px] text-[#849495] font-mono">Transfer surplus to next month</span>
                </div>
                <input
                  type="checkbox"
                  checked={rollover}
                  onChange={e => setRollover(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-fixed focus:ring-primary-fixed"
                />
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold"
              >
                Register Limit
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
