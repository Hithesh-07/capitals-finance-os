'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  CalendarClock, Plus, Bell, AlertTriangle, ShieldCheck, X, Hourglass 
} from 'lucide-react';

export default function RemindersPage() {
  const { reminders, addReminder, markReminderPaid, isPreviewMode } = useFinanceStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [type, setType] = useState<'sip' | 'loan' | 'subscription' | 'rent' | 'recharge' | 'exam_fee' | 'custom'>('custom');
  const [reminderTime, setReminderTime] = useState('09:00');
  const [autopay, setAutopay] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    await addReminder(
      title,
      amount ? Number(amount) : undefined,
      dueDate,
      type,
      reminderTime + ':00',
      autopay
    );

    setShowAddForm(false);
    setTitle('');
    setAmount('');
    setDueDate('');
    setAutopay(false);
  };

  const handleSnooze = (id: string, currentDate: string) => {
    // Local storage / Zustand trigger snooze (adding 3 days to due date)
    const dateObj = new Date(currentDate);
    dateObj.setDate(dateObj.getDate() + 3);
    const newDateStr = dateObj.toISOString().split('T')[0];
    
    // In preview mode or full mode, update reminder state locally
    const { reminders: currentRems } = useFinanceStore.getState();
    const updated = currentRems.map(r => {
      if (r.id === id) {
        return { ...r, due_date: newDateStr, status: 'pending' as const };
      }
      return r;
    });

    useFinanceStore.setState({ reminders: updated });
    
    if (isPreviewMode) {
      const currentLocal = JSON.parse(localStorage.getItem('capitals_local_data_v1') || '{}');
      localStorage.setItem('capitals_local_data_v1', JSON.stringify({ ...currentLocal, reminders: updated }));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12 flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Reminders</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Unified Reminder Sentinel</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Setup Alert
        </button>
      </div>

      {/* REMINDERS LIST (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {reminders.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
            <CalendarClock className="w-12 h-12 text-[#849495] animate-pulse" />
            <div>
              <h3 className="font-display text-lg font-bold text-white">No active reminders</h3>
              <p className="text-xs text-[#b9caca] mt-1 max-w-sm leading-relaxed">
                Add alerts for recurring subscriptions, recharges, rent, exam fees, or mutual fund SIP payments.
              </p>
            </div>
          </div>
        ) : (
          reminders.map(rem => {
            const isPaid = rem.status === 'paid';
            const isOverdue = new Date(rem.due_date).getTime() < new Date().setHours(0,0,0,0) && !isPaid;

            return (
              <div 
                key={rem.id} 
                className={`glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-l-4 ${
                  isPaid 
                    ? 'border-l-tertiary-fixed bg-tertiary-fixed/2' 
                    : isOverdue 
                      ? 'border-l-red-500 bg-red-500/2' 
                      : 'border-l-primary-fixed bg-primary-fixed/2'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    <Bell className="w-5 h-5 text-primary-fixed animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-display font-semibold text-white text-sm">{rem.title}</h3>
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider mt-0.5">
                      Due: {new Date(rem.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {rem.amount ? ` | ₹${rem.amount}` : ''}
                      {rem.autopay ? ' | AutoPay Enabled' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {isPaid ? (
                    <span className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider text-tertiary-fixed bg-tertiary-fixed/5 rounded-lg border border-tertiary-fixed/25">
                      Settled
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSnooze(rem.id, rem.due_date)}
                        className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-[9px] font-mono uppercase tracking-wider text-[#b9caca] hover:bg-white/5 transition-all flex items-center gap-1"
                      >
                        <Hourglass className="w-3.5 h-3.5" /> Snooze 3d
                      </button>
                      <button
                        onClick={() => markReminderPaid(rem.id)}
                        className="magnetic-btn px-4 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold active:scale-95 transition-all"
                      >
                        Pay / Clear
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT COLUMN: Info panel & Form (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Info Box */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-[-100px] right-[-100px] w-48 h-48 rounded-full bg-primary-fixed/5 blur-[50px] pointer-events-none" />
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-1.5">
            <CalendarClock className="w-5 h-5 text-primary-fixed" /> Autopay Protocols
          </h3>
          
          <div className="flex flex-col gap-3 text-xs text-[#b9caca] leading-relaxed">
            <p>
              Reminders configured with **AutoPay** will automatically log cash outflows and clear dues on the designated dates.
            </p>
            <p>
              Snoozing a reminder shifts its timeline forward by 3 days, helping you align variable freelance payouts with billing due dates.
            </p>
          </div>
        </div>

        {/* SETUP ALERTS FORM */}
        {showAddForm && (
          <div className="glass-panel p-6 rounded-3xl border-primary-fixed/30 bg-primary-fixed/2 flex flex-col gap-4 animate-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                Configure Alert Parameter
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
                <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Alert Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Rent, recharge, Spotify, etc."
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="216 (optional)"
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Alert Type</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  >
                    <option value="custom">Custom Reminder</option>
                    <option value="sip">SIP Investment</option>
                    <option value="loan">Loan EMI</option>
                    <option value="subscription">Subscription Renewal</option>
                    <option value="rent">Hostel Rent</option>
                    <option value="recharge">Phone Recharge</option>
                    <option value="exam_fee">Exam Fee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase tracking-wider text-[#849495]">Preferred Time</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={e => setReminderTime(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border border-white/5 p-3 rounded-xl bg-black/40">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">Enable AutoPay</span>
                  <span className="text-[9px] text-[#849495] font-mono">Deduct ledger automatically on due date</span>
                </div>
                <input
                  type="checkbox"
                  checked={autopay}
                  onChange={e => setAutopay(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary-fixed focus:ring-primary-fixed"
                />
              </div>

              <button
                type="submit"
                className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold"
              >
                Register Alert Sentinel
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
