'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  TrendingUp, Plus, Calculator, CalendarClock, ChevronRight, X, Percent, Compass, Calendar, Trash2
} from 'lucide-react';

export default function SipsPage() {
  const { sips, addSip, updateSipValue, deleteSip } = useFinanceStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [fundName, setFundName] = useState('');
  const [fundType, setFundType] = useState('mutual_fund');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [nextPaymentDate, setNextPaymentDate] = useState('');

  // Compound Calculator States
  const [calcMonthly, setCalcMonthly] = useState(1500);
  const [calcReturn, setCalcReturn] = useState(15);
  const [calcYears, setCalcYears] = useState(5);
  const [calcInflation, setCalcInflation] = useState(6);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(monthlyAmount);
    if (!fundName || amt <= 0 || !nextPaymentDate) return;

    await addSip(fundName, amt, startDate, nextPaymentDate, fundType);
    setShowAddForm(false);
    setFundName('');
    setMonthlyAmount('');
    setNextPaymentDate('');
  };

  // Countdown timer
  const getCountdown = (dueDateStr: string) => {
    const diff = new Date(dueDateStr).getTime() - new Date().getTime();
    if (diff <= 0) return 'Due today';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  // Compound Interest Calculator Logic
  // Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  // where i = interest rate per period (monthly), n = total number of periods (months)
  const calculateWealth = () => {
    const P = calcMonthly;
    const i = (calcReturn / 100) / 12;
    const n = calcYears * 12;

    if (i === 0) {
      const total = P * n;
      const realValue = total / Math.pow(1 + calcInflation / 100, calcYears);
      return { 
        invested: P * n, 
        total: P * n, 
        gains: 0,
        realValue: Math.round(realValue),
        realGains: Math.max(0, Math.round(realValue) - (P * n))
      };
    }

    const total = P * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const invested = P * n;
    const gains = Math.max(0, total - invested);
    const realValue = total / Math.pow(1 + calcInflation / 100, calcYears);
    const realGains = Math.max(0, realValue - invested);

    return {
      invested: Math.round(invested),
      total: Math.round(total),
      gains: Math.round(gains),
      realValue: Math.round(realValue),
      realGains: Math.round(realGains)
    };
  };

  const wealth = calculateWealth();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">SIP Vault</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Investment & Asset Telemetry</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/calendar"
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-primary-fixed/30 text-[#b9caca] hover:text-primary-fixed font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
          >
            <Calendar className="w-4 h-4" /> Payment Calendar
          </Link>
          <button
            onClick={() => setShowAddForm(true)}
            className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Setup SIP
          </button>
        </div>
      </div>

      {/* LEFT COLUMN: Active SIP cards (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {sips.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <Compass className="w-12 h-12 text-primary-fixed animate-spin" style={{ animationDuration: '10s' }} />
            <div>
              <h3 className="font-display text-lg font-bold text-white">No active SIPs found</h3>
              <p className="text-xs text-[#b9caca] mt-1 max-w-sm leading-relaxed">
                You have no active mutual funds logs. Start investing even as little as ₹500/month to build compounding habits!
              </p>
            </div>
          </div>
        ) : (
          sips.map(sip => {
            const gain = Number(sip.current_value) - Number(sip.total_invested);
            const gainPercent = sip.total_invested > 0 ? Math.round((gain / Number(sip.total_invested)) * 100) : 0;
            const countdown = getCountdown(sip.next_payment_date);

            return (
              <div key={sip.id} className="glass-panel p-6 rounded-2xl flex flex-col gap-5 relative overflow-hidden border-l-4 border-l-primary-fixed bg-primary-fixed/2">
                
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary-fixed" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-display font-semibold text-white text-base">{sip.fund_name}</h3>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">{sip.fund_type?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${
                    gain >= 0 
                      ? 'border-tertiary-fixed/30 bg-tertiary-fixed/5 text-tertiary-fixed' 
                      : 'border-red-500/30 bg-red-500/5 text-red-400'
                  }`}>
                    {gain >= 0 ? '+' : ''} {gainPercent}%
                  </span>
                </div>

                {/* Countdown payment */}
                {sip.status === 'active' && (
                  <div className="p-4 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center z-10">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">Next Auto-Debit In</span>
                      <span className="font-mono text-xl font-bold text-white mt-1 tracking-tight">{countdown}</span>
                    </div>
                    <CalendarClock className="w-5 h-5 text-[#849495]" />
                  </div>
                )}

                {/* Growth stats + delete */}
                <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Monthly SIP</span>
                      <span className="font-display font-semibold text-white mt-0.5">₹{sip.monthly_amount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Total Invested</span>
                      <span className="font-display font-semibold text-white mt-0.5">₹{sip.total_invested}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Current Value</span>
                      <span className="font-display font-semibold text-primary-fixed mt-0.5">₹{sip.current_value}</span>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => deleteSip(sip.id)}
                      title="Delete SIP"
                      className="p-2 rounded-xl border border-white/5 hover:border-red-500/30 text-on-surface-variant hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove SIP
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* RIGHT COLUMN: Wealth calculator (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Compound interest simulator */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full bg-primary-fixed/5 blur-[50px] pointer-events-none" />
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
            <Calculator className="w-5 h-5 text-primary-fixed" /> Compound Estimator
          </h3>

          <div className="flex flex-col gap-4">
            
            {/* Input Slider 1: Monthly investment */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#849495]">Monthly Investment</span>
                <span className="text-white font-semibold">₹{calcMonthly.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range"
                min="500"
                max="25000"
                step="500"
                value={calcMonthly}
                onChange={e => setCalcMonthly(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-fixed"
              />
            </div>

            {/* Input Slider 2: Rate of return */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#849495]">Expected Return (p.a.)</span>
                <span className="text-primary-fixed font-semibold">{calcReturn}%</span>
              </div>
              <input 
                type="range"
                min="5"
                max="30"
                step="1"
                value={calcReturn}
                onChange={e => setCalcReturn(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-fixed"
              />
            </div>

            {/* Input Slider 3: Years */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#849495]">Time Horizon</span>
                <span className="text-white font-semibold">{calcYears} Years</span>
              </div>
              <input 
                type="range"
                min="1"
                max="25"
                step="1"
                value={calcYears}
                onChange={e => setCalcYears(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-fixed"
              />
            </div>

            {/* Input Slider 4: Inflation */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#849495]">Expected Inflation Rate</span>
                <span className="text-red-400 font-semibold">{calcInflation}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="15"
                step="1"
                value={calcInflation}
                onChange={e => setCalcInflation(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-fixed"
              />
            </div>
          </div>

          <div className="h-[1px] bg-white/10 w-full" />

          {/* Calculator projections */}
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex justify-between text-[#849495]">
              <span>Invested Amount:</span>
              <span className="text-white">₹{wealth.invested.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="border-t border-white/5 pt-2 flex flex-col gap-2">
              <div className="flex justify-between text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                <span>Nominal Returns (Non-Adjusted)</span>
              </div>
              <div className="flex justify-between text-[#849495]">
                <span>Est. Capital Gains:</span>
                <span className="text-tertiary-fixed">₹{wealth.gains.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">Total Value:</span>
                <span className="text-primary-fixed">₹{wealth.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="border-t border-white/5 pt-2 flex flex-col gap-2 bg-white/2 p-2.5 rounded-xl border border-white/5">
              <div className="flex justify-between text-[10px] text-[#efdbff] uppercase tracking-wider font-semibold">
                <span>Real Returns (Inflation Adjusted)</span>
              </div>
              <div className="flex justify-between text-[#849495]">
                <span>Real Capital Gains:</span>
                <span className="text-[#dcb8ff]">₹{wealth.realGains.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#efdbff]">Real Purchasing Power:</span>
                <span className="text-[#dcb8ff]">₹{wealth.realValue.toLocaleString('en-IN')}</span>
              </div>
              <span className="text-[9px] text-[#849495] leading-normal font-sans italic">
                * Adjusted for an annual inflation rate of {calcInflation}%, which reflects the equivalent purchasing power of your money today.
              </span>
            </div>
          </div>
        </div>

        {/* Setup SIP Form */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border-primary-fixed/30 bg-primary-fixed/2 flex flex-col gap-4 animate-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                Register New SIP
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
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Fund / Stock Name</label>
                <input
                  type="text"
                  required
                  value={fundName}
                  onChange={e => setFundName(e.target.value)}
                  placeholder="Quant Small Cap Fund"
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Asset Type</label>
                  <select
                    value={fundType}
                    onChange={e => setFundType(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="mutual_fund">Mutual Fund</option>
                    <option value="stock">Equity / Stock</option>
                    <option value="digital_gold">Digital Gold</option>
                    <option value="fixed_deposit">Fixed Deposit</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Monthly Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={monthlyAmount}
                    onChange={e => setMonthlyAmount(e.target.value)}
                    placeholder="1500"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">SIP Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Next Auto-Debit Date</label>
                  <input
                    type="date"
                    required
                    value={nextPaymentDate}
                    onChange={e => setNextPaymentDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold"
              >
                Register Asset SIP
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
