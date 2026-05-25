'use client';

import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  Coins, Plus, Calendar, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, X
} from 'lucide-react';

export default function LoansPage() {
  const { loans, addLoan, payLoanEmi } = useFinanceStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [lenderName, setLenderName] = useState('mPokket');
  const [customLender, setCustomLender] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('24');
  const [emiAmount, setEmiAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  
  // Tick state to update countdowns
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalLender = lenderName === 'Custom' ? customLender : lenderName;
    const princ = Number(principal);
    const emi = Number(emiAmount);
    const rate = Number(interestRate);

    if (!finalLender || princ <= 0 || emi <= 0 || !dueDate) return;

    const todayStr = new Date().toISOString().split('T')[0];
    await addLoan(finalLender, princ, rate, emi, todayStr, dueDate, 'app');
    
    setShowAddForm(false);
    setPrincipal('');
    setEmiAmount('');
    setDueDate('');
  };

  // Countdown formatter
  const getCountdown = (dueDateStr: string) => {
    const diff = new Date(dueDateStr).getTime() - new Date().getTime();
    if (diff <= 0) return { text: 'Overdue', isOverdue: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return { 
      text: `${days}d ${hours}h ${mins}m ${secs}s`, 
      isOverdue: false 
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Loan Sentinel</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Active Debt Tracker</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Register Loan
        </button>
      </div>

      {/* ACTIVE LOANS GRID (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        {loans.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <ShieldCheck className="w-12 h-12 text-tertiary-fixed animate-pulse" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">No active loans found</h3>
              <p className="text-xs text-[#b9caca] mt-1 max-w-sm leading-relaxed">
                You have an excellent balance telemetry with zero app debts. Keep it clean to avoid high interest charges!
              </p>
            </div>
          </div>
        ) : (
          loans.map(loan => {
            const countdown = getCountdown(loan.due_date);
            const percentPaid = Math.min(100, Math.round((Number(loan.total_paid) / Number(loan.principal)) * 100));

            return (
              <div 
                key={loan.id} 
                className={`glass-panel p-6 rounded-2xl flex flex-col gap-5 relative overflow-hidden border-l-4 ${
                  countdown.isOverdue && loan.status !== 'paid' 
                    ? 'border-l-red-500 bg-red-500/2' 
                    : loan.status === 'paid' 
                      ? 'border-l-tertiary-fixed bg-tertiary-fixed/2' 
                      : 'border-l-secondary bg-secondary-container/2'
                }`}
              >
                {/* Background neon mesh glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(119,1,208,0.03),transparent_70%)] pointer-events-none" />

                {/* Top header */}
                <div className="flex justify-between items-start z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <Coins className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-display font-semibold text-white text-base">{loan.lender_name}</h3>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">Interest Rate: {loan.interest_rate}% APR</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                    loan.status === 'paid' 
                      ? 'bg-tertiary-fixed/10 border border-tertiary-fixed/30 text-tertiary-fixed' 
                      : countdown.isOverdue 
                        ? 'bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse'
                        : 'bg-secondary-container/20 border border-secondary/20 text-secondary'
                  }`}>
                    {loan.status}
                  </span>
                </div>

                {/* Countdown clock */}
                {loan.status !== 'paid' && (
                  <div className="p-4 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center z-10">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">Repayment Deadline</span>
                      <span className={`font-mono text-xl font-bold mt-1 tracking-tight ${
                        countdown.isOverdue ? 'text-red-400' : 'text-white'
                      }`}>
                        {countdown.text}
                      </span>
                    </div>
                    {countdown.isOverdue ? (
                      <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
                    ) : (
                      <Calendar className="w-5 h-5 text-[#849495]" />
                    )}
                  </div>
                )}

                {/* Progress bar */}
                <div className="flex flex-col gap-1.5 z-10">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#849495]">Repayment Progress</span>
                    <span className="text-white">₹{loan.total_paid} / ₹{loan.principal} ({percentPaid}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-secondary-container to-secondary rounded-full" 
                      style={{ width: `${percentPaid}%` }}
                    />
                  </div>
                </div>

                {/* Bottom details */}
                <div className="flex justify-between items-center border-t border-white/5 pt-4 z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">EMI Amount</span>
                    <span className="font-display font-semibold text-white mt-0.5">₹{loan.emi_amount}</span>
                  </div>

                  <div className="flex flex-col text-right">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Remaining Balance</span>
                    <span className="font-display font-semibold text-secondary-fixed mt-0.5">₹{loan.remaining_balance}</span>
                  </div>

                  {loan.status !== 'paid' && (
                    <button
                      onClick={() => payLoanEmi(loan.id, loan.emi_amount)}
                      className="magnetic-btn px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold active:scale-95 transition-all"
                    >
                      Pay EMI
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT COLUMN: Info Panel & Add Form (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Loan Sentinel Info Card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full bg-secondary-container/5 blur-[50px] pointer-events-none" />
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
            <AlertTriangle className="w-5 h-5 text-secondary animate-pulse" /> Debt Warning Terminal
          </h3>
          
          <div className="flex flex-col gap-3 text-xs text-[#b9caca] leading-relaxed">
            <p>
              Micro-loan applications (like mPokket, KreditBee, Slice) offer quick cash disbursements but carry extremely high annual percentage rates (typically <span className="text-secondary-fixed font-semibold">24% - 36% APR</span>).
            </p>
            <p>
              The **Loan Sentinel** runs continuous tracking. It calculates repayment velocities and warns you when due dates conflict with expected allowance payouts.
            </p>
            <div className="p-3 rounded-xl border border-white/5 bg-white/2 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary animate-ping shrink-0" />
              <span className="font-mono text-[10px] uppercase text-white font-semibold">Keep debts under 20% of monthly allowance</span>
            </div>
          </div>
        </div>

        {/* ADD LOAN MODAL DIALOG (Inline) */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border-primary-fixed/30 bg-primary-fixed/2 flex flex-col gap-4 animate-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                Register New Debt
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
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Lender Name</label>
                <select
                  value={lenderName}
                  onChange={e => setLenderName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                >
                  <option value="mPokket">mPokket</option>
                  <option value="KreditBee">KreditBee</option>
                  <option value="Slice">Slice</option>
                  <option value="Custom">Custom Lender</option>
                </select>
              </div>

              {lenderName === 'Custom' && (
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Custom Lender</label>
                  <input
                    type="text"
                    required
                    value={customLender}
                    onChange={e => setCustomLender(e.target.value)}
                    placeholder="Friend / Relative name"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Principal (₹)</label>
                  <input
                    type="number"
                    required
                    value={principal}
                    onChange={e => setPrincipal(e.target.value)}
                    placeholder="3000"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">EMI Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={emiAmount}
                    onChange={e => setEmiAmount(e.target.value)}
                    placeholder="1050"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Interest Rate (% APR)</label>
                  <input
                    type="number"
                    required
                    value={interestRate}
                    onChange={e => setInterestRate(e.target.value)}
                    placeholder="24"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold"
              >
                Register Debt
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
