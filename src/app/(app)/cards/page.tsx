'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  CreditCard as CardIcon, Plus, Trash2, CalendarClock, ChevronRight, X, 
  AlertTriangle, ShieldCheck, Sparkles, TrendingUp, History, Info, Compass, Sparkle
} from 'lucide-react';

export default function CreditCardsPage() {
  const { creditCards, expenses, addCreditCard, deleteCreditCard, payCardBill } = useFinanceStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Form States
  const [cardName, setCardName] = useState('');
  const [bankName, setBankName] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [statementDate, setStatementDate] = useState('');
  const [cardNetwork, setCardNetwork] = useState('visa');
  const [cardTheme, setCardTheme] = useState('dark_metal');

  // Bill Clearance Modal States
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState('');

  // Active Card determination
  const activeCard = creditCards.find(c => c.id === selectedCardId) || creditCards[0] || null;

  // Sync selected card state if card gets deleted
  React.useEffect(() => {
    if (creditCards.length > 0 && !selectedCardId) {
      setSelectedCardId(creditCards[0].id);
    } else if (creditCards.length === 0) {
      setSelectedCardId(null);
    }
  }, [creditCards, selectedCardId]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limit = Number(cardLimit);
    if (!cardName || !bankName || limit <= 0 || !dueDate || !statementDate) return;

    await addCreditCard(cardName, bankName, limit, dueDate, statementDate, cardNetwork, cardTheme);
    setShowAddForm(false);
    setCardName('');
    setBankName('');
    setCardLimit('');
    setDueDate('');
    setStatementDate('');
    setCardNetwork('visa');
    setCardTheme('dark_metal');
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCard) return;
    const amount = Number(payAmount);
    if (amount <= 0) return;

    await payCardBill(activeCard.id, amount);
    setShowPayModal(false);
    setPayAmount('');
  };

  // Card Mouse Interaction handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Maximum 15 degree rotation
    const rx = -(y - yc) / 10;
    const ry = (x - xc) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Set dynamic glare position
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    card.style.setProperty('--glare-x', `${px}%`);
    card.style.setProperty('--glare-y', `${py}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.setProperty('--glare-x', '50%');
    card.style.setProperty('--glare-y', '50%');
  };

  // Get active card expenses
  const activeCardExpenses = activeCard 
    ? expenses.filter(e => e.linked_credit_card_id === activeCard.id)
    : [];

  // Theme styling helpers
  const getThemeClass = (theme: string, isActive: boolean) => {
    let base = "relative w-full h-48 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-xl border cursor-pointer transition-all duration-300 ";
    
    if (isActive) {
      base += "border-primary-fixed/40 ring-1 ring-primary-fixed/30 scale-102 ";
    } else {
      base += "border-white/5 opacity-70 hover:opacity-100 hover:scale-[1.01] ";
    }

    if (theme === 'dark_metal') {
      return base + "bg-gradient-to-br from-[#232526] via-[#151617] to-[#0f1011] text-white";
    }
    if (theme === 'glass_cyber') {
      return base + "bg-white/[0.02] backdrop-blur-2xl text-[#efdbff] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]";
    }
    if (theme === 'holo_foil') {
      return base + "bg-gradient-to-br from-[#ffc4ec] via-[#a8e6ff] to-[#bdffc9] text-[#141d26]";
    }
    if (theme === 'gold_royal') {
      return base + "bg-gradient-to-br from-[#d4af37] via-[#aa7c11] to-[#6d4c00] text-amber-50";
    }
    return base;
  };

  const getUtilColor = (ratio: number) => {
    if (ratio >= 0.8) return 'text-red-400 border-red-500/20 bg-red-500/5';
    if (ratio >= 0.3) return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5';
    return 'text-tertiary-fixed border-tertiary-fixed/20 bg-tertiary-fixed/5';
  };

  const getUtilProgressColor = (ratio: number) => {
    if (ratio >= 0.8) return '#ef4444'; // red
    if (ratio >= 0.3) return '#facc15'; // yellow
    return '#72ff70'; // tertiary green
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Cards Sentinel</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Credit Limits & Balances Dashboard</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      {/* LEFT COLUMN: 3D Cards list & Utilization Gauge (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Card list */}
        {creditCards.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <Compass className="w-12 h-12 text-primary-fixed animate-spin" style={{ animationDuration: '10s' }} />
            <div>
              <h3 className="font-display text-lg font-bold text-white">No credit cards monitored</h3>
              <p className="text-xs text-[#b9caca] mt-1 max-w-sm leading-relaxed">
                Add your credit cards here to track utilization ratios, billing statements, and receive warnings before bills degrade your credit rating.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creditCards.map(card => {
              const isActive = selectedCardId === card.id;
              const ratio = card.outstanding_balance / card.card_limit;
              
              return (
                <div 
                  key={card.id} 
                  className={getThemeClass(card.card_theme, isActive)}
                  onClick={() => setSelectedCardId(card.id)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease' }}
                >
                  {/* Holographic light shine effect */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-25 mix-blend-color-dodge transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.8) 0%, transparent 60%)'
                    }}
                  />

                  {/* Card top */}
                  <div className="flex justify-between items-start" style={{ transform: 'translateZ(20px)' }}>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest opacity-60">{card.bank_name}</span>
                      <h4 className="font-display font-semibold text-sm tracking-tight">{card.card_name}</h4>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-lg border border-white/10 bg-black/10">
                      {card.card_network}
                    </span>
                  </div>

                  {/* Card mid chip decal */}
                  <div className="w-8 h-6 bg-yellow-600/30 rounded border border-yellow-500/20 flex flex-col gap-0.5 p-1" style={{ transform: 'translateZ(10px)' }}>
                    <div className="h-full w-full border-t border-b border-yellow-500/20 flex divide-x divide-yellow-500/20">
                      <div className="flex-1" />
                      <div className="flex-1" />
                    </div>
                  </div>

                  {/* Card bottom */}
                  <div className="flex justify-between items-end" style={{ transform: 'translateZ(30px)' }}>
                    <div>
                      <span className="font-mono text-xs tracking-widest opacity-60">•••• •••• •••• 8842</span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-mono text-[8px] uppercase tracking-wider opacity-60">Utilized:</span>
                        <span className="font-mono text-xs font-semibold">₹{card.outstanding_balance.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[8px] uppercase tracking-wider block opacity-60">Limit</span>
                      <span className="font-display font-bold text-xs">₹{card.card_limit.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Utilization gauge & info */}
        {activeCard && (
          <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Round Gauge */}
            <div className="md:col-span-4 flex justify-center flex-col items-center">
              <span className="font-mono text-[9px] uppercase tracking-wider text-on-surface-variant mb-2">Utilized Ratio</span>
              
              <div className="relative w-28 h-28">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeWidth="8"
                  />
                  {/* Active gauge */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke={getUtilProgressColor(activeCard.outstanding_balance / activeCard.card_limit)} 
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(2 * Math.PI * 40) * (1 - Math.min(1, activeCard.outstanding_balance / activeCard.card_limit))}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <span className="font-display font-bold text-lg text-white">
                    {Math.round((activeCard.outstanding_balance / activeCard.card_limit) * 100)}%
                  </span>
                  <span className="font-mono text-[7px] uppercase tracking-widest text-[#849495]">Limit Used</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="md:col-span-8 flex flex-col gap-4">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${getUtilColor(activeCard.outstanding_balance / activeCard.card_limit)}`}>
                  {activeCard.outstanding_balance / activeCard.card_limit >= 0.8 
                    ? 'Critical Utilization' 
                    : activeCard.outstanding_balance / activeCard.card_limit >= 0.3 
                    ? 'Warning Utilization' 
                    : 'Safe Credit utilization'}
                </span>
                <h3 className="font-display font-bold text-lg text-white mt-1.5">{activeCard.bank_name} {activeCard.card_name} Status</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Total Available Limit</span>
                  <span className="font-display font-semibold text-white mt-0.5">₹{(activeCard.card_limit - activeCard.outstanding_balance).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Due Reminders</span>
                  <span className="font-display font-semibold text-white mt-0.5">{activeCard.due_date}</span>
                </div>
              </div>

              {/* Safety warning */}
              <div className="flex items-start gap-2 bg-white/2 border border-white/5 rounded-xl p-3">
                <Info className="w-4 h-4 text-primary-fixed shrink-0 mt-0.5" />
                <p className="text-[10px] text-on-surface-variant leading-relaxed font-sans">
                  {activeCard.outstanding_balance / activeCard.card_limit >= 0.3 
                    ? "Your utilization exceeds 30%, which can negatively affect your credit score. Consider clearing some of the outstanding balance today." 
                    : "Excellent! Your utilization is below 30%. Keeping card limits clean like this maximizes credit rating scores."
                  }
                </p>
              </div>

              {/* Delete action */}
              <div className="flex justify-end">
                <button
                  onClick={() => deleteCreditCard(activeCard.id)}
                  className="px-3.5 py-1.5 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 text-on-surface-variant hover:text-red-400 rounded-xl font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Card Sentinel
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* RIGHT COLUMN: Payments & Spends Log (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Bill clearance panel */}
        {activeCard && (
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full bg-primary-fixed/5 blur-[50px] pointer-events-none" />
            
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
              <CalendarClock className="w-5 h-5 text-primary-fixed" /> Statement Billing
            </h3>

            <div className="p-4 rounded-xl bg-black/60 border border-white/5 flex justify-between items-center z-10">
              <div className="flex flex-col">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">Next Statement Date</span>
                <span className="font-mono text-sm font-semibold text-white mt-1 tracking-tight">{activeCard.statement_date}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">Payment Due Date</span>
                <span className="font-mono text-sm font-bold text-red-400 mt-1 tracking-tight">{activeCard.due_date}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono text-[#849495]">
                <span>Outstanding Balance:</span>
                <span className="text-white font-semibold">₹{activeCard.outstanding_balance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs font-mono text-[#849495] border-t border-white/5 pt-2">
                <span>Safe Limit Buffer:</span>
                <span className="text-tertiary-fixed font-semibold">₹{Math.max(0, activeCard.card_limit * 0.3).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPayAmount(String(activeCard.outstanding_balance));
                setShowPayModal(true);
              }}
              disabled={activeCard.outstanding_balance === 0}
              className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold text-center transition-all ${
                activeCard.outstanding_balance > 0 
                  ? 'magnetic-btn' 
                  : 'bg-white/5 border border-white/10 text-on-surface-variant/40 cursor-not-allowed'
              }`}
            >
              Clear Statement Bill
            </button>

          </div>
        )}

        {/* Recent Card Spends log */}
        {activeCard && (
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
              <History className="w-5 h-5 text-primary-fixed" /> Card Spend Ledger
            </h3>

            {activeCardExpenses.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center text-on-surface-variant gap-2">
                <Sparkles className="w-6 h-6 text-white/10" />
                <span className="font-mono text-[10px] uppercase tracking-wider">No card charges logged</span>
                <span className="text-[9px] max-w-[200px] leading-relaxed">Choose this credit card under the payment modes when adding standard expenses.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {activeCardExpenses.map(exp => (
                  <div key={exp.id} className="p-3 rounded-xl border border-white/5 bg-black/40 flex justify-between items-center text-xs">
                    <div className="flex flex-col overflow-hidden pr-2">
                      <span className="font-semibold text-white truncate">{exp.category}</span>
                      <span className="text-[9px] text-on-surface-variant font-mono mt-0.5">{exp.date} {exp.note ? `• ${exp.note}` : ''}</span>
                    </div>
                    <span className="font-display font-semibold text-white shrink-0">₹{exp.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* SETUP CARD DRAWER OVERLAY */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="fixed inset-0 cursor-default"
            onClick={() => setShowAddForm(false)}
          />
          
          <div className="glass-panel p-6 rounded-3xl w-full max-w-md relative z-10 border-primary-fixed/20 bg-[#0A0A0A] flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                <Sparkle className="w-4 h-4 text-primary-fixed animate-pulse" /> Configure Card Sentinel
              </h4>
              <button 
                onClick={() => setShowAddForm(false)}
                className="p-1 text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Card Name</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder="Millennia"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="HDFC"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Total Card Limit (₹)</label>
                  <input
                    type="number"
                    required
                    value={cardLimit}
                    onChange={e => setCardLimit(e.target.value)}
                    placeholder="150000"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Network Provider</label>
                  <select
                    value={cardNetwork}
                    onChange={e => setCardNetwork(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="rupay">RuPay</option>
                    <option value="amex">Amex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Billing Statement Date</label>
                  <input
                    type="date"
                    required
                    value={statementDate}
                    onChange={e => setStatementDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Payment Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Card Theme Style</label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {[
                    { val: 'dark_metal', label: 'Obsidian' },
                    { val: 'glass_cyber', label: 'Glassmorphism' },
                    { val: 'holo_foil', label: 'Holographic' },
                    { val: 'gold_royal', label: 'Golden' }
                  ].map(themeOpt => (
                    <button
                      key={themeOpt.val}
                      type="button"
                      onClick={() => setCardTheme(themeOpt.val)}
                      className={`py-2 px-1 text-[9px] font-mono uppercase tracking-wider rounded-xl border text-center transition-all ${
                        cardTheme === themeOpt.val 
                          ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                          : 'border-white/5 text-on-surface-variant bg-black'
                      }`}
                    >
                      {themeOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold mt-2"
              >
                Register Card Sentinel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BILL CLEARANCE MODAL */}
      {showPayModal && activeCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="fixed inset-0 cursor-default"
            onClick={() => setShowPayModal(false)}
          />
          
          <div className="glass-panel p-6 rounded-3xl w-full max-w-sm relative z-10 border-primary-fixed/20 bg-[#0A0A0A] flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                Settle Statement Balance
              </h4>
              <button 
                onClick={() => setShowPayModal(false)}
                className="p-1 text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] uppercase tracking-wider text-[#849495]">Card Outstandings</span>
                <span className="text-lg font-bold text-white font-mono">₹{activeCard.outstanding_balance.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Payment Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  placeholder="₹1500"
                  max={activeCard.outstanding_balance}
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex items-start gap-2 bg-white/2 border border-white/5 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-tertiary-fixed shrink-0 mt-0.5" />
                <p className="text-[9px] text-on-surface-variant leading-relaxed font-sans">
                  Clearing this outstanding balance will automatically log a transaction of category "Loans & EMI" (Credit Card Bill) in your ledger today.
                </p>
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold mt-1"
              >
                Confirm Bill Clearance
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
