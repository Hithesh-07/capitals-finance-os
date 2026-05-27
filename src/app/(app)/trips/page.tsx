'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  Map, Plus, Calendar, MapPin, DollarSign, Users, X, Info, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function TripsPage() {
  const { trips, tripExpenses, addTrip, addTripExpense, friends } = useFinanceStore();

  const [showAddTrip, setShowAddTrip] = useState(false);
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  
  // Trip Expense states
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expPaidBy, setExpPaidBy] = useState('You');
  const [expSplitBetween, setExpSplitBetween] = useState<string[]>([]);

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    const b = Number(budget);
    if (!tripName || b <= 0 || participants.length === 0) return;

    await addTrip(
      tripName,
      destination || undefined,
      startDate || undefined,
      endDate || undefined,
      b,
      participants
    );

    setShowAddTrip(false);
    setTripName('');
    setDestination('');
    setBudget('');
    setParticipants([]);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(expAmount);
    if (!selectedTripId || amt <= 0 || !expPaidBy || expSplitBetween.length === 0) return;

    await addTripExpense(
      selectedTripId,
      amt,
      'Travel',
      expDesc,
      expPaidBy,
      expSplitBetween
    );

    setShowAddExpense(false);
    setExpAmount('');
    setExpDesc('');
    setExpPaidBy('You');
    setExpSplitBetween([]);
  };

  const toggleParticipantSelection = (name: string) => {
    if (participants.includes(name)) {
      setParticipants(participants.filter(p => p !== name));
    } else {
      setParticipants([...participants, name]);
    }
  };

  const toggleSplitSelection = (name: string) => {
    if (expSplitBetween.includes(name)) {
      setExpSplitBetween(expSplitBetween.filter(p => p !== name));
    } else {
      setExpSplitBetween([...expSplitBetween, name]);
    }
  };

  // Compile calculations for selected trip
  const activeTrip = trips.find(t => t.id === selectedTripId) || trips[0];
  const activeTripExpenses = selectedTripId 
    ? tripExpenses.filter(te => te.trip_id === selectedTripId) 
    : [];

  const totalSpent = activeTripExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const remainingBudget = activeTrip ? Number(activeTrip.total_budget) - totalSpent : 0;
  
  // Per person shares calculation
  const totalParticipantsCount = activeTrip ? ['You', ...activeTrip.participants].length : 1;
  const perPersonCost = totalSpent / totalParticipantsCount;

  // Simple resolution of balances for selected trip
  const tripBalances: Record<string, number> = {};
  if (activeTrip) {
    const list = ['You', ...activeTrip.participants];
    list.forEach(p => { tripBalances[p] = 0; });

    activeTripExpenses.forEach(te => {
      const share = te.amount / te.split_between.length;
      
      // Payer gets credit
      tripBalances[te.paid_by] = (tripBalances[te.paid_by] || 0) + te.amount;
      
      // Participants get debited
      te.split_between.forEach(p => {
        tripBalances[p] = (tripBalances[p] || 0) - share;
      });
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Trips Module</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Group travel budget ledger</p>
        </div>
        <button
          onClick={() => setShowAddTrip(true)}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Trip
        </button>
      </div>

      {/* TRIP SELECTOR SIDEBAR (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <h3 className="font-display font-semibold text-white text-sm">Active & Planned Trips</h3>
        
        {trips.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center flex flex-col gap-2">
            <p className="text-xs text-on-surface-variant">No trips registered.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map(trip => {
              const isSelected = selectedTripId === trip.id || (!selectedTripId && trips[0].id === trip.id);
              return (
                <button
                  type="button"
                  key={trip.id}
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`glass-panel p-4 rounded-xl flex items-center justify-between text-left transition-all border ${
                    isSelected ? 'border-primary-fixed bg-primary-fixed/5' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                      <MapPin className="w-4 h-4 text-primary-fixed" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{trip.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">{trip.destination || 'Unspecified'}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#849495]" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* TRIP DETAILS & EXPENSE LEDGER (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {activeTrip ? (
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-[-100px] right-[-100px] w-64 h-64 rounded-full bg-primary-fixed/5 blur-[80px] pointer-events-none" />

            {/* Trip banner details */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4 z-10">
              <div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">{activeTrip.name}</h2>
                <div className="flex items-center gap-4 text-[10px] text-on-surface-variant font-mono uppercase tracking-wider mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary-fixed" /> {activeTrip.destination || 'N/A'}</span>
                  {activeTrip.start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {new Date(activeTrip.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setExpSplitBetween(['You', ...activeTrip.participants]);
                  setShowAddExpense(true);
                }}
                className="magnetic-btn px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-semibold active:scale-95 transition-all"
              >
                Log Cost
              </button>
            </div>

            {/* Projections Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10">
              <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Total Budget</span>
                <span className="font-display font-semibold text-white block mt-0.5">₹{activeTrip.total_budget}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Total Spent</span>
                <span className="font-display font-semibold text-white block mt-0.5">₹{totalSpent}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Remaining</span>
                <span className={`font-display font-semibold block mt-0.5 ${remainingBudget >= 0 ? 'text-primary-fixed' : 'text-red-400'}`}>
                  ₹{remainingBudget}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Per-Person Cost</span>
                <span className="font-display font-semibold text-secondary-fixed block mt-0.5">₹{Math.round(perPersonCost)}</span>
              </div>
            </div>

            {/* Budget track progress */}
            <div className="flex flex-col gap-1.5 z-10">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#849495]">Budget Consumption</span>
                <span className="text-white">
                  {Math.min(100, Math.round((totalSpent / Number(activeTrip.total_budget)) * 100))}% Used
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary-fixed to-secondary rounded-full" 
                  style={{ width: `${Math.min(100, (totalSpent / Number(activeTrip.total_budget)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Net travel settlement registry */}
            <div className="flex flex-col gap-3 border-t border-white/5 pt-4 z-10">
              <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
                <Info className="w-4 h-4 text-primary-fixed" /> Net Travel Debt Balances
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(tripBalances).map(([name, balance]) => {
                  if (balance === 0) return null;
                  const owes = balance < 0;
                  return (
                    <div key={name} className="p-2.5 rounded-xl border border-white/5 bg-black/40 flex justify-between items-center text-xs">
                      <span className="text-white font-semibold">{name}</span>
                      <span className={`font-mono font-bold ${owes ? 'text-red-400' : 'text-tertiary-fixed'}`}>
                        {owes ? 'Owes' : 'Owed'} ₹{Math.round(Math.abs(balance))}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center text-on-surface-variant font-mono uppercase">
            Create or select a trip to initialize panel view.
          </div>
        )}
      </div>

      {/* CREATE TRIP MODAL DIALOG (Inline) */}
      {showAddTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-margin-mobile">
          <div className="w-full max-w-[500px] glass-panel rounded-2xl p-6 relative border-white/5 bg-black/90 flex flex-col gap-4">
            
            <button 
              onClick={() => setShowAddTrip(false)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-semibold text-white text-lg">Create Group Trip</h3>
            <div className="h-[1px] bg-white/10 w-full" />

            <form onSubmit={handleAddTrip} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Trip / Title Name</label>
                <input
                  type="text"
                  required
                  value={tripName}
                  onChange={e => setTripName(e.target.value)}
                  placeholder="Goa Trip 2026"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="Goa, India"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Total Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value).toString())}
                    placeholder="25000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Select Participants</label>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {friends.map(f => {
                    const selected = participants.includes(f.friend_name);
                    return (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => toggleParticipantSelection(f.friend_name)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all ${
                          selected 
                            ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                            : 'border-white/10 hover:border-white/20 text-[#b9caca]'
                        }`}
                      >
                        {f.friend_name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={participants.length === 0}
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold mt-2"
              >
                Register Trip
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL DIALOG (Inline) */}
      {showAddExpense && activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-margin-mobile">
          <div className="w-full max-w-[500px] glass-panel rounded-2xl p-6 relative border-white/5 bg-black/90 flex flex-col gap-4">
            
            <button 
              onClick={() => setShowAddExpense(false)}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-semibold text-white text-lg">Log Trip Cost</h3>
            <div className="h-[1px] bg-white/10 w-full" />

            <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Expense Description</label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={e => setExpDesc(e.target.value)}
                  placeholder="Hotel stay booking"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value)}
                    placeholder="8500"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Paid By</label>
                  <select
                    value={expPaidBy}
                    onChange={e => setExpPaidBy(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="You">You</option>
                    {activeTrip.participants.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Split Between</label>
                <div className="flex flex-wrap gap-2">
                  {['You', ...activeTrip.participants].map(p => {
                    const selected = expSplitBetween.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => toggleSplitSelection(p)}
                        className={`px-3 py-1.5 rounded-xl border text-[10px] font-mono uppercase tracking-wider transition-all ${
                          selected 
                            ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                            : 'border-white/10 hover:border-white/20 text-[#b9caca]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={expSplitBetween.length === 0}
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold mt-2"
              >
                Log Trip Expense
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
