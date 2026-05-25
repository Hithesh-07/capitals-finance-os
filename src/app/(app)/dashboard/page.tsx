'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFinanceStore } from '@/store/useFinanceStore';
import ExpenseOrbit from '@/components/dashboard/ExpenseOrbit';
import { 
  ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Coins, 
  Sparkles, PiggyBank, Plus, RefreshCw, Send, AlertTriangle, ShieldCheck, Flame
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    incomes, expenses, loans, sips, budgets, subscriptions, 
    insights, savingsStreak, getBrokemanTelemetry, markReminderPaid, reminders
  } = useFinanceStore();

  const [telemetry, setTelemetry] = useState<any>({
    totalBalance: 0,
    daysRemainingInMonth: 0,
    dailyDisposableRunway: 0,
    burnRate7D: 0,
    runwayDays: 999,
    exhaustionDate: 'N/A',
    isCritical: false
  });

  // Calculate live countdowns
  const [loanCountdown, setLoanCountdown] = useState('');
  const [sipCountdown, setSipCountdown] = useState('');

  useEffect(() => {
    // Calculate initial telemetry
    setTelemetry(getBrokemanTelemetry());
    
    // Setup countdown timer
    const interval = setInterval(() => {
      // Find next loan due date
      const activeLoan = loans.find(l => l.status === 'active');
      if (activeLoan) {
        const diff = new Date(activeLoan.due_date).getTime() - new Date().getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setLoanCountdown(`${days}d ${hours}h ${mins}m`);
        } else {
          setLoanCountdown('Overdue');
        }
      } else {
        setLoanCountdown('No active loans');
      }

      // Find next SIP date
      const activeSip = sips.find(s => s.status === 'active');
      if (activeSip) {
        const diff = new Date(activeSip.next_payment_date).getTime() - new Date().getTime();
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setSipCountdown(`${days}d ${hours}h ${mins}m`);
        } else {
          setSipCountdown('Due today');
        }
      } else {
        setSipCountdown('No active SIPs');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [incomes, expenses, loans, sips, getBrokemanTelemetry]);

  // Aggregate metrics
  const totalIn = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalOut = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  // Total Invested = sips investments total + goals savings total
  const totalInvested = sips.reduce((acc, curr) => acc + Number(curr.total_invested), 0);
  const outstandingLoans = loans.reduce((acc, curr) => acc + Number(curr.remaining_balance), 0);

  // Safe to Spend = (Income this month - Investments - loan EMIs) - expenses this month
  const monthlyAllowance = incomes
    .filter(i => i.source === 'parent_allowance')
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 12000;
  
  const monthlyInvested = sips.reduce((acc, curr) => acc + Number(curr.monthly_amount), 0);
  const monthlyEmi = loans.reduce((acc, curr) => acc + Number(curr.emi_amount), 0);
  const safeToSpend = Math.max(0, monthlyAllowance - totalOut - monthlyInvested - monthlyEmi);

  // Weekly spending details for Spending Pulse SVG
  const getWeeklySpend = (weekNum: number) => {
    // Mocking partition of monthly expenses into 4 weeks
    const partitionIndex = [1500, 2300, 1800, 3100];
    return partitionIndex[weekNum - 1] || 1200;
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* HEADER OVERVIEW */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant font-sans mt-1">Capital telemetry and predictive cashflow indices.</p>
        </div>
        
        {/* Quick actions row */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/transactions?action=add" className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-white/3 text-[#e5e2e1] transition-all">
            <Plus className="w-3.5 h-3.5 text-primary-fixed" /> Add Transaction
          </Link>
          <Link href="/split" className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-white/3 text-[#e5e2e1] transition-all">
            <Send className="w-3.5 h-3.5 text-secondary" /> Split Bill
          </Link>
          <Link href="/trips" className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:bg-white/3 text-[#e5e2e1] transition-all">
            <Sparkles className="w-3.5 h-3.5 text-tertiary-fixed" /> Create Trip
          </Link>
        </div>
      </section>

      {/* CORE STATS GRID */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Stat 1: Income */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495] flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-tertiary-fixed" /> Inflow (30D)
          </span>
          <div className="flex flex-col mt-2">
            <span className="font-display text-xl md:text-2xl font-bold text-white">₹{totalIn.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stat 2: Outflow */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495] flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-red-400" /> Outflow (30D)
          </span>
          <div className="flex flex-col mt-2">
            <span className="font-display text-xl md:text-2xl font-bold text-white">₹{totalOut.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stat 3: Total Balance */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495] flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-primary-fixed" /> Ledger Balance
          </span>
          <div className="flex flex-col mt-2">
            <span className="font-display text-xl md:text-2xl font-bold text-white">₹{telemetry.totalBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stat 4: Total Invested */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-primary-fixed" /> Total Invested
          </span>
          <div className="flex flex-col mt-2">
            <span className="font-display text-xl md:text-2xl font-bold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stat 5: Outstanding Loan */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[110px]">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495] flex items-center gap-1">
            <Coins className="w-3.5 h-3.5 text-secondary" /> Active Loans
          </span>
          <div className="flex flex-col mt-2">
            <span className="font-display text-xl md:text-2xl font-bold text-white">₹{outstandingLoans.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Stat 6: Safe-to-spend */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[110px] border-primary-fixed/20 bg-primary-fixed/2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-primary-fixed flex items-center gap-1">
            <PiggyBank className="w-3.5 h-3.5 text-primary-fixed" /> Safe-to-Spend
          </span>
          <div className="flex flex-col mt-2">
            <span className="font-display text-xl md:text-2xl font-bold text-white">₹{safeToSpend.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </section>

      {/* BROKEMAN PREDICTIVE TELEMETRY PANEL */}
      <section className={`glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 ${
        telemetry.isCritical ? 'border-l-red-500 bg-red-500/2' : 'border-l-primary-fixed bg-primary-fixed/2'
      }`}>
        <div className="flex items-start gap-4">
          {telemetry.isCritical ? (
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary-fixed" />
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="font-display font-bold text-white text-base">
              {telemetry.isCritical ? 'CRITICAL CASH RUNWAY ALERT' : 'BROKEMAN MODE PREDICTION'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-xl">
              {telemetry.isCritical 
                ? `Burn velocity is critical. You will exhaust your balance in ${telemetry.runwayDays} days on ${telemetry.exhaustionDate}. Restrict all want/impulse spending immediately.`
                : `Your cash runway is healthy. Financial exhaustion is projected for ${telemetry.exhaustionDate} based on your 7-day rolling burn rate.`
              }
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-center shrink-0 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 w-full md:w-auto justify-around">
          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">Runway Runway</span>
            <span className="font-display text-xl font-bold text-white mt-1">
              {telemetry.runwayDays > 365 ? '∞' : `${telemetry.runwayDays} Days`}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">Daily Disposable</span>
            <span className="font-display text-xl font-bold text-primary-fixed mt-1">₹{telemetry.dailyDisposableRunway.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">7D Burn Rate</span>
            <span className="font-display text-xl font-bold text-white mt-1">₹{telemetry.burnRate7D.toLocaleString('en-IN')}<span className="text-xs font-normal text-on-surface-variant">/d</span></span>
          </div>
        </div>
      </section>

      {/* DUAL CANVAS PANELS (Orbit vs Pulse Graph) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        
        {/* Left 7 cols: 3D Expense Orbit */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-display text-lg font-bold text-white">Expense Orbit</h2>
            <span className="font-mono text-[10px] uppercase text-on-surface-variant">Hover spheres to expand telemetry</span>
          </div>
          <ExpenseOrbit />
        </div>

        {/* Right 5 cols: Spending Pulse & Budgets */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Spending Pulse Chart (mocked identical to design) */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
              <h3 className="font-display font-semibold text-white text-sm">Spending Pulse</h3>
              <span className="font-mono text-[9px] uppercase text-tertiary-fixed border border-tertiary-fixed/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed animate-pulse" /> Live Telemetry
              </span>
            </div>
            
            <div className="relative h-44 flex items-end">
              {/* SVG path mapping weeks */}
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g-glow" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#72ff70" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#72ff70" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path 
                  d="M 0,180 C 50,160 100,170 150,130 C 200,90 250,110 300,70 C 350,30 400,120 450,40 L 450,200 L 0,200 Z" 
                  fill="url(#g-glow)" 
                />
                {/* Stroke path */}
                <path 
                  className="pulse-line"
                  d="M 0,180 C 50,160 100,170 150,130 C 200,90 250,110 300,70 C 350,30 400,120 450,40" 
                  fill="none" 
                  stroke="#72ff70" 
                  strokeWidth="3.5" 
                />
                
                {/* Week dots */}
                <circle cx="150" cy="130" r="5" fill="#000" stroke="#72ff70" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all" />
                <circle cx="300" cy="70" r="5" fill="#000" stroke="#72ff70" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all" />
                <circle cx="450" cy="40" r="5" fill="#000" stroke="#72ff70" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all" />
              </svg>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant px-1 mt-4">
              <span>W1 (₹1.5k)</span>
              <span>W2 (₹2.3k)</span>
              <span>W3 (₹1.8k)</span>
              <span>W4 (₹3.1k)</span>
            </div>
          </div>

          {/* Budget Limits */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
            <h3 className="font-display font-semibold text-white text-sm">Budget Utilizations</h3>
            <div className="flex flex-col gap-4">
              {budgets.slice(0, 3).map(b => {
                const percent = Math.min(100, Math.round((Number(b.spent) / Number(b.monthly_limit)) * 100));
                return (
                  <div key={b.id} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
                      <span className="text-white">{b.category}</span>
                      <span className="text-[#849495]">₹{b.spent} / ₹{b.monthly_limit}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full liquid-bar rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* COUNTDOWN WIDGETS, RECURRING & STREAK */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Countdown EMI */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(119,1,208,0.03),transparent_70%)]" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495] flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-secondary animate-pulse" /> Sentinel countdown
            </span>
            <h4 className="font-display text-lg font-bold text-white mt-1">Next EMI Due</h4>
            <span className="font-mono text-2xl font-semibold text-secondary-fixed mt-2 tracking-tight">{loanCountdown}</span>
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono mt-4">
            mPokket loan balance: ₹{outstandingLoans}
          </span>
        </div>

        {/* Countdown SIP */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,220,229,0.03),transparent_70%)]" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-primary-fixed animate-pulse" /> SIP Growth Vault
            </span>
            <h4 className="font-display text-lg font-bold text-white mt-1">Next SIP Payment</h4>
            <span className="font-mono text-2xl font-semibold text-primary-fixed mt-2 tracking-tight">{sipCountdown}</span>
          </div>
          <span className="text-[10px] text-on-surface-variant font-mono mt-4">
            SIP destination: Quant Small Cap
          </span>
        </div>

        {/* Savings Streak Scorecard */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[140px] border-tertiary-fixed/15 bg-tertiary-fixed/2">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495] flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> Savings streaks
            </span>
            <h4 className="font-display text-lg font-bold text-white mt-1">Streak Scorecard</h4>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-mono text-3xl font-semibold text-tertiary-fixed tracking-tight">{savingsStreak} Days</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full ${
                      i <= savingsStreak ? 'bg-tertiary-fixed shadow-[0_0_8px_#72ff70]' : 'bg-white/5'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-[#849495] font-mono mt-4">
            Skip impulse purchases tomorrow to hit 4 days!
          </span>
        </div>

      </section>

      {/* SUBSCRIPTION RENEWALS & REMINDERS LIST */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Reminder scheduler list */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-white text-sm">Unified Reminder Sentinel</h3>
            <Link href="/reminders" className="font-mono text-[9px] uppercase text-primary-fixed hover:underline">
              Manage Reminders
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {reminders.slice(0, 3).map(rem => (
              <div key={rem.id} className="flex justify-between items-center p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-white">{rem.title}</span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    Due: {new Date(rem.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} | ₹{rem.amount}
                  </span>
                </div>
                {rem.status === 'pending' ? (
                  <button 
                    onClick={() => markReminderPaid(rem.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-primary-fixed/20 hover:border-primary-fixed/40 text-[10px] font-mono uppercase tracking-wider text-primary-fixed hover:bg-primary-fixed/5 active:scale-95 transition-all"
                  >
                    Pay / Clear
                  </button>
                ) : (
                  <span className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-tertiary-fixed bg-tertiary-fixed/5 rounded-lg border border-tertiary-fixed/10">
                    Settled
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Subscription splits */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-white text-sm">Active Subscription Splits</h3>
            <span className="font-mono text-[9px] uppercase text-on-surface-variant">Auto-shares active</span>
          </div>

          <div className="flex flex-col gap-3">
            {subscriptions.map(sub => (
              <div key={sub.id} className="flex justify-between items-center p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-white text-sm font-mono">
                    {sub.name[0]}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-white">{sub.name}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      Renewal: {new Date(sub.renewal_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-white block">₹{sub.amount}/mo</span>
                  <span className="text-[9px] text-[#849495] font-mono">
                    {sub.shared_with && sub.shared_with.length > 0 
                      ? `Split with ${sub.shared_with.join(', ')}` 
                      : 'Personal'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
