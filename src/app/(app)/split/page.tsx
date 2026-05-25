'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  Users, Plus, Send, Phone, BadgePercent, CheckCircle2, MessageSquare, Check, X
} from 'lucide-react';

export default function SplitExpensesPage() {
  const { 
    friends, sharedExpenses, addFriend, addSharedExpense, settleSplitBill, user 
  } = useFinanceStore();

  const [friendName, setFriendName] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [friendUpi, setFriendUpi] = useState('');
  
  // Bill states
  const [billDesc, setBillDesc] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billPaidBy, setBillPaidBy] = useState('You');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  
  // Settlement states
  const [settlingExpenseId, setSettlingExpenseId] = useState<string | null>(null);
  const [settlingFriend, setSettlingFriend] = useState('');
  const [settleAmount, setSettleAmount] = useState('');

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName) return;
    await addFriend(friendName, friendPhone || undefined, friendUpi || undefined);
    setFriendName('');
    setFriendPhone('');
    setFriendUpi('');
  };

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(billAmount);
    if (!billDesc || amt <= 0 || selectedFriends.length === 0) return;

    // Split includes paid_by or You + selected friends
    const participants = ['You', ...selectedFriends];
    await addSharedExpense(billPaidBy, amt, billDesc, participants);

    setBillDesc('');
    setBillAmount('');
    setBillPaidBy('You');
    setSelectedFriends([]);
  };

  const toggleSelectFriend = (name: string) => {
    if (selectedFriends.includes(name)) {
      setSelectedFriends(selectedFriends.filter(f => f !== name));
    } else {
      setSelectedFriends([...selectedFriends, name]);
    }
  };

  // Compile Net Balances
  // Maps Friend Name -> Net Balance (+ they owe you, - you owe them)
  const netBalances: Record<string, number> = {};
  
  friends.forEach(f => {
    netBalances[f.friend_name] = 0;
  });

  sharedExpenses.forEach(se => {
    if (se.settled) return;
    const splitCount = se.split_between.length;
    const share = se.amount / splitCount;

    if (se.paid_by === 'You') {
      se.split_between.forEach(p => {
        if (p !== 'You') {
          netBalances[p] = (netBalances[p] || 0) + share;
        }
      });
    } else {
      // Someone else paid
      const payer = se.paid_by;
      if (se.split_between.includes('You')) {
        netBalances[payer] = (netBalances[payer] || 0) - share;
      }
    }
  });

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingExpenseId || !settlingFriend || !settleAmount) return;
    
    await settleSplitBill(
      settlingExpenseId,
      settlingFriend,
      'You',
      Number(settleAmount)
    );

    setSettlingExpenseId(null);
    setSettlingFriend('');
    setSettleAmount('');
  };

  // Generate WhatsApp Remind Link
  const generateWhatsAppLink = (friendName: string, balance: number) => {
    const friend = friends.find(f => f.friend_name === friendName);
    const phoneNum = friend?.phone ? (friend.phone.startsWith('+91') ? friend.phone : `+91${friend.phone}`) : '';
    const myUpi = friend?.upi_id || user?.name?.toLowerCase().replace(/\s/g, '') + '@okaxis';

    const textMessage = `Hey ${friendName}, hope you're good! Could you please settle the ₹${Math.round(balance)} you owe on CapitalS? You can UPI directly to my ID: ${myUpi}. Thanks!`;
    return `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(textMessage)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Split Ledger</h1>
        <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Multi-peer bill sharing engine</p>
      </div>

      {/* LEFT COLUMN: Friend Add & Split Form (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-8">
        
        {/* Split Bill form */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-fixed" /> Record Group Expense
          </h3>

          <form onSubmit={handleAddBill} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Expense Description</label>
              <input
                type="text"
                required
                value={billDesc}
                onChange={e => setBillDesc(e.target.value)}
                placeholder="Hostel Room Biryani party"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Total amount (₹)</label>
                <input
                  type="number"
                  required
                  value={billAmount}
                  onChange={e => setBillAmount(e.target.value)}
                  placeholder="1200"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Paid By</label>
                <select
                  value={billPaidBy}
                  onChange={e => setBillPaidBy(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                >
                  <option value="You">You</option>
                  {friends.map(f => (
                    <option key={f.id} value={f.friend_name}>{f.friend_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Split with friends (equally)</label>
              
              {friends.length === 0 ? (
                <p className="text-xs text-on-surface-variant italic">Add friends below to start splitting.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {friends.map(f => {
                    const isSelected = selectedFriends.includes(f.friend_name);
                    return (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => toggleSelectFriend(f.friend_name)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          isSelected 
                            ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                            : 'border-white/10 hover:border-white/20 text-[#b9caca]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        {f.friend_name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={selectedFriends.length === 0}
              className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold mt-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              Add Shared Bill
            </button>
          </form>
        </div>

        {/* Add Friend Form */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Add Friend to Workspace
          </h3>

          <form onSubmit={handleAddFriend} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  required
                  value={friendName}
                  onChange={e => setFriendName(e.target.value)}
                  placeholder="Friend Name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={friendPhone}
                  onChange={e => setFriendPhone(e.target.value)}
                  placeholder="Phone (WhatsApp)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={friendUpi}
                  onChange={e => setFriendUpi(e.target.value)}
                  placeholder="UPI ID (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-[#b9caca] font-mono text-xs uppercase tracking-wider"
            >
              Register Friend
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: Net Balances & Settlements (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Net balances list */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
          <h3 className="font-display font-semibold text-white text-base border-b border-white/5 pb-3 flex items-center justify-between">
            Net Balances
            <span className="font-mono text-[9px] uppercase text-[#849495]">Summary metrics</span>
          </h3>

          <div className="flex flex-col gap-3">
            {Object.keys(netBalances).length === 0 ? (
              <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider py-4 text-center">No active balances.</p>
            ) : (
              Object.entries(netBalances).map(([name, balance]) => {
                if (balance === 0) return null;
                const userOwed = balance > 0;
                
                return (
                  <div key={name} className="flex justify-between items-center p-3 rounded-xl bg-white/3 border border-white/5">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{name}</span>
                      <span className={`text-[10px] font-mono uppercase tracking-wider mt-0.5 ${
                        userOwed ? 'text-tertiary-fixed' : 'text-red-400'
                      }`}>
                        {userOwed ? 'Owes you' : 'You owe'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-mono font-bold ${
                        userOwed ? 'text-tertiary-fixed' : 'text-red-400'
                      }`}>
                        ₹{Math.round(Math.abs(balance))}
                      </span>

                      {userOwed ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              // Find an active shared expense for this friend
                              const matchingExpense = sharedExpenses.find(se => !se.settled && se.split_between.includes(name));
                              if (matchingExpense) {
                                setSettlingExpenseId(matchingExpense.id);
                                setSettlingFriend(name);
                                setSettleAmount(Math.round(balance).toString());
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg border border-primary-fixed/20 hover:border-primary-fixed/40 text-[9px] font-mono uppercase tracking-wider text-primary-fixed hover:bg-primary-fixed/5 transition-all"
                          >
                            Settle
                          </button>
                          
                          <a
                            href={generateWhatsAppLink(name, balance)}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-white/5 hover:border-tertiary-fixed/30 hover:bg-tertiary-fixed/5 text-on-surface-variant hover:text-tertiary-fixed transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[9px] text-[#849495] font-mono uppercase">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* SETTLEMENT MODAL (Inline placeholder inside column if active) */}
        {settlingExpenseId && (
          <div className="glass-panel p-6 rounded-3xl border-primary-fixed/30 bg-primary-fixed/2 flex flex-col gap-4 animate-in">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h4 className="text-xs font-mono uppercase text-primary-fixed tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Settlement Ledger
              </h4>
              <button 
                onClick={() => setSettlingExpenseId(null)}
                className="p-1 text-on-surface-variant hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="flex flex-col gap-3">
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Registering a cash/UPI transaction from <span className="text-white font-semibold">{settlingFriend}</span> back to you.
              </p>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[8px] uppercase tracking-wider text-[#849495]">Settle Amount (₹)</label>
                <input 
                  type="number" 
                  value={settleAmount}
                  onChange={e => setSettleAmount(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                />
              </div>
              <button
                type="submit"
                className="magnetic-btn w-full py-2 rounded-xl font-mono text-[10px] uppercase tracking-wider font-bold"
              >
                Confirm Settlement
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
