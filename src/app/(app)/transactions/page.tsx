'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  Plus, Search, Filter, Tag, ArrowUpRight, ArrowDownRight, 
  Trash2, Edit2, X, FileImage, Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const { 
    expenses, incomes, addExpense, addIncome, deleteExpense, deleteIncome, editExpense, editIncome, isPreviewMode 
  } = useFinanceStore();

  const [activeTab, setActiveTab] = useState<'all' | 'expense' | 'income'>('all');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');

  // Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formType, setFormType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [source, setSource] = useState('pocket_money');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [venueName, setVenueName] = useState('');
  const [tag, setTag] = useState<'need' | 'want' | 'impulse'>('need');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Receipt Scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      handleOpenAddModal();
    }
  }, [searchParams]);

  // Combine and sort transactions
  const allTransactions = [
    ...expenses.map(e => ({ ...e, type: 'expense' as const, source: undefined })),
    ...incomes.map(i => ({ ...i, type: 'income' as const, category: 'Inflow', tag: undefined, venue_name: i.client_name }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filtered transactions
  const filteredTransactions = allTransactions.filter(tx => {
    const matchesTab = activeTab === 'all' || tx.type === activeTab;
    const matchesSearch = tx.note?.toLowerCase().includes(search.toLowerCase()) || 
                          tx.category.toLowerCase().includes(search.toLowerCase()) ||
                          tx.venue_name?.toLowerCase().includes(search.toLowerCase()) ||
                          tx.source?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = catFilter === 'all' || tx.category === catFilter;
    const matchesTag = tagFilter === 'all' || (tx.type === 'expense' && tx.tag === tagFilter);
    return matchesTab && matchesSearch && matchesCat && matchesTag;
  });

  const categories = [
    'Food & Dining', 'Travel', 'Education', 'Shopping', 'Subscriptions', 
    'Health', 'Housing', 'Social', 'Loans & EMI', 'Investments', 'Miscellaneous'
  ];

  const handleOpenAddModal = () => {
    setEditingId(null);
    setAmount('');
    setNote('');
    setVenueName('');
    setScannedResult(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSubmitError(null);
    setDate(new Date().toISOString().split('T')[0]);
    setFormType('expense');
    setPaymentMode('UPI');
    setTag('need');
    setShowAddModal(true);
  };

  const handleEditClick = (tx: any) => {
    setEditingId(tx.id);
    setFormType(tx.type);
    setAmount(String(tx.amount));
    setDate(tx.date);
    setNote(tx.note || '');
    setPaymentMode(tx.payment_mode || 'UPI');
    if (tx.type === 'expense') {
      setCategory(tx.category);
      setTag(tx.tag || 'need');
      setVenueName(tx.venue_name || '');
    } else {
      setSource(tx.source || 'pocket_money');
    }
    setSubmitError(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setAmount('');
    setNote('');
    setVenueName('');
    setScannedResult(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSubmitError(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!amount || Number(amount) <= 0) return;

    try {
      if (editingId) {
        if (formType === 'expense') {
          await editExpense(
            editingId,
            Number(amount),
            category,
            note,
            paymentMode,
            date,
            tag
          );
        } else {
          await editIncome(
            editingId,
            Number(amount),
            source,
            note,
            paymentMode,
            date
          );
        }
      } else {
        if (formType === 'expense') {
          await addExpense(
            Number(amount),
            category,
            undefined,
            note,
            paymentMode,
            venueName || undefined,
            tag,
            undefined,
            undefined,
            date
          );
        } else {
          await addIncome(
            Number(amount),
            source,
            note,
            paymentMode,
            false,
            undefined,
            venueName || undefined,
            undefined,
            date
          );
        }
      }

      handleCloseModal();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err?.message || 'Failed to save transaction. Please try again.');
    }
  };

  // MOCK OCR SCANNER
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      triggerScanAnimation();
    }
  };

  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScannedResult(null);
    
    // Simulate OCR scanning duration
    setTimeout(() => {
      setIsScanning(false);
      // Generate mock extraction details
      const isUpiScreenshot = Math.random() > 0.4;
      const extracted = isUpiScreenshot ? {
        merchant: 'Zomato Delivery',
        amount: 450,
        category: 'Food & Dining',
        paymentMethod: 'UPI (GPay)',
        date: new Date().toISOString().split('T')[0],
        tag: 'want'
      } : {
        merchant: 'CMRL Metro Station',
        amount: 100,
        category: 'Travel',
        paymentMethod: 'UPI (PhonePe)',
        date: new Date().toISOString().split('T')[0],
        tag: 'need'
      };

      setScannedResult(extracted);
      
      // Auto populate form
      setFormType('expense');
      setAmount(extracted.amount.toString());
      setCategory(extracted.category);
      setVenueName(extracted.merchant);
      setPaymentMode('UPI');
      setTag(extracted.tag as any);
      setNote(`AI Scanned Receipt from ${extracted.merchant}`);
    }, 2500);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-container-max mx-auto pb-12">
      
      {/* HEADER SECTION */}
      <section className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Ledger Operations</h1>
          <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Telemetry registry log</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="magnetic-btn px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </section>

      {/* FILTER CONTROLS BAR */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-4 relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes, categories, merchants..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary-fixed/40 transition-colors"
          />
        </div>

        {/* Tab triggers */}
        <div className="md:col-span-3 flex border border-white/5 rounded-xl p-1 bg-white/2">
          {(['all', 'expense', 'income'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed' 
                  : 'text-[#b9caca] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="md:col-span-3 relative flex items-center">
          <Filter className="absolute left-3 w-3.5 h-3.5 text-on-surface-variant" />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-[10px] font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary-fixed/40"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div className="md:col-span-2 relative flex items-center">
          <Tag className="absolute left-3 w-3.5 h-3.5 text-on-surface-variant" />
          <select
            value={tagFilter}
            onChange={e => setTagFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0A0A0A] border border-white/5 rounded-xl text-[10px] font-mono uppercase tracking-wider text-white focus:outline-none focus:border-primary-fixed/40"
          >
            <option value="all">All Tags</option>
            <option value="need">Need</option>
            <option value="want">Want</option>
            <option value="impulse">Impulse</option>
          </select>
        </div>
      </section>

      {/* LEDGER TABLE */}
      <section className="glass-panel rounded-2xl overflow-hidden border-white/5 bg-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/2 font-mono text-[9px] uppercase tracking-widest text-[#849495]">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Description / Note</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Payment mode</th>
                <th className="py-4 px-6">Tag</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/3 font-sans text-xs">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-white/1 transition-all group">
                    <td className="py-4 px-6 font-mono text-[10px] text-[#849495]">
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{tx.note || 'Unspecified ledger note'}</span>
                        {tx.venue_name && <span className="text-[10px] text-on-surface-variant font-mono">{tx.venue_name}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase tracking-wider ${
                        tx.type === 'income' 
                          ? 'border-tertiary-fixed/30 bg-tertiary-fixed/5 text-tertiary-fixed' 
                          : 'border-white/5 bg-white/2 text-[#b9caca]'
                      }`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px] text-on-surface-variant uppercase">{tx.payment_mode || 'UPI'}</td>
                    <td className="py-4 px-6">
                      {tx.type === 'expense' && tx.tag ? (
                        <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-mono uppercase tracking-wider ${
                          tx.tag === 'need' 
                            ? 'border-primary-fixed/20 text-primary-fixed'
                            : tx.tag === 'want' 
                              ? 'border-secondary/20 text-secondary'
                              : 'border-red-500/20 text-red-400 bg-red-500/5'
                        }`}>
                          {tx.tag}
                        </span>
                      ) : (
                        <span className="text-white/20">-</span>
                      )}
                    </td>
                    <td className={`py-4 px-6 text-right font-display font-bold text-sm ${
                      tx.type === 'income' ? 'text-tertiary-fixed' : 'text-white'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handleEditClick(tx)}
                          title="Edit Transaction"
                          className="p-1.5 rounded-lg border border-white/5 hover:border-primary-fixed/30 text-on-surface-variant hover:text-primary-fixed hover:bg-primary-fixed/5 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete this ${tx.type}?`)) {
                              if (tx.type === 'expense') {
                                deleteExpense(tx.id);
                              } else {
                                deleteIncome(tx.id);
                              }
                            }
                          }}
                          title="Delete Transaction"
                          className="p-1.5 rounded-lg border border-white/5 hover:border-red-500/30 text-on-surface-variant hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center font-mono text-[#849495] uppercase tracking-wider text-xs">
                    No transactions registered matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD / EDIT TRANSACTION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-margin-mobile">
          <div className="w-full max-w-[750px] glass-panel rounded-2xl relative border-white/5 bg-black/90 flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Header bar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 shrink-0">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495]">
                {editingId ? 'Edit Ledger Entry' : 'New Ledger Entry'}
              </span>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-on-surface-variant hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex flex-col md:flex-row gap-6 overflow-y-auto p-6">

            {/* LEFT COLUMN: Receipt OCR Scanner (only visible in creation mode, disabled in edit mode) */}
            {!editingId ? (
              <div className="flex-1 border-r border-white/5 pr-0 md:pr-6 flex flex-col gap-4">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#849495] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary-fixed" /> AI Screenshot Scanner
                </span>
                <h3 className="font-display font-semibold text-white text-base">UPI / Receipt OCR</h3>
                
                <label className="border border-dashed border-white/10 hover:border-primary-fixed/30 rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/1 transition-all relative overflow-hidden h-48">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  
                  {previewUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <img src={previewUrl} alt="Preview" className="h-full w-full object-contain" />
                      {isScanning && (
                        <div className="absolute inset-0 bg-primary-fixed/10 flex flex-col items-center justify-center gap-2">
                          {/* Scanner Laser Bar */}
                          <div className="w-full h-1 bg-primary-fixed shadow-[0_0_10px_#63f7ff] absolute top-0 left-0 animate-[bounce_2.5s_infinite_linear]" />
                          <span className="font-mono text-[10px] uppercase tracking-widest text-primary-fixed drop-shadow-sm font-semibold animate-pulse">Running OCR Extract...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <FileImage className="w-8 h-8 text-[#849495]" />
                      <div className="text-center">
                        <span className="text-xs text-white font-semibold block">Upload Receipt / Screenshot</span>
                        <span className="text-[10px] text-on-surface-variant block mt-1">Supports GPay, PhonePe, Paytm screenshot formats</span>
                      </div>
                    </>
                  )}
                </label>

                {scannedResult && (
                  <div className="p-3 rounded-xl border border-tertiary-fixed/20 bg-tertiary-fixed/5 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs text-tertiary-fixed font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> AI Telemetry Extracted
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#b9caca]">
                      <div>Merchant: <span className="text-white font-semibold">{scannedResult.merchant}</span></div>
                      <div>Amount: <span className="text-white font-semibold">₹{scannedResult.amount}</span></div>
                      <div>Category: <span className="text-white font-semibold">{scannedResult.category}</span></div>
                      <div>Method: <span className="text-white font-semibold">{scannedResult.paymentMethod}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 pr-0 md:pr-6 flex flex-col gap-4 justify-center items-center text-center p-6 border-r border-white/5">
                <div className="w-12 h-12 bg-primary-fixed/15 border border-primary-fixed/20 rounded-full flex items-center justify-center mb-2">
                  <Edit2 className="w-6 h-6 text-primary-fixed" />
                </div>
                <h3 className="font-display font-semibold text-white text-base">Editing Ledger Entry</h3>
                <p className="text-xs text-on-surface-variant max-w-[200px]">Adjust telemetry for ID: <span className="font-mono text-[10px] text-primary-fixed block truncate mt-1">{editingId}</span></p>
              </div>
            )}

            {/* RIGHT COLUMN: Standard Input Form */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="font-display font-semibold text-white text-base">
                  {editingId ? 'Modify Details' : 'Standard Input Form'}
                </h3>
                
                {/* Full-width segmented tab toggle */}
                <div className="flex border border-white/5 rounded-xl p-1 bg-white/2 w-full">
                  <button
                    type="button"
                    disabled={!!editingId}
                    onClick={() => setFormType('expense')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                      formType === 'expense' 
                        ? 'bg-primary-fixed/15 border border-primary-fixed/30 text-primary-fixed font-bold' 
                        : 'text-[#b9caca] hover:text-white'
                    } ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    disabled={!!editingId}
                    onClick={() => setFormType('income')}
                    className={`flex-1 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                      formType === 'income' 
                        ? 'bg-primary-fixed/15 border border-primary-fixed/30 text-primary-fixed font-bold' 
                        : 'text-[#b9caca] hover:text-white'
                    } ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="250"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                {formType === 'expense' ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Category</label>
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
                      <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Expense Type Tag</label>
                      <div className="flex gap-2">
                        {([
                          { id: 'need', label: 'Need' },
                          { id: 'want', label: 'Want' },
                          { id: 'impulse', label: 'Impulse' }
                        ] as const).map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTag(t.id)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider border transition-all ${
                              tag === t.id
                                ? 'bg-primary-fixed/10 border-primary-fixed/40 text-primary-fixed font-bold'
                                : 'border-white/10 text-[#b9caca] hover:text-white'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Income Source</label>
                    <select
                      value={source}
                      onChange={e => setSource(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                    >
                      <option value="parent_allowance">Parents / Allowance</option>
                      <option value="pocket_money">Pocket Money</option>
                      <option value="freelancing">Freelancing</option>
                      <option value="internship_stipend">Internship Stipend</option>
                      <option value="part_time_job">Part-time Job</option>
                      <option value="scholarship">Scholarship</option>
                      <option value="gift">Gift</option>
                      <option value="refund">Refund / Cashback</option>
                      <option value="side_hustle">Side Hustle</option>
                      <option value="friend_repayment">Friend Repayment</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Payment Mode</label>
                    <select
                      value={paymentMode}
                      onChange={e => setPaymentMode(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                      <option value="NetBanking">NetBanking</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                </div>

                {formType === 'expense' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Merchant / Venue Name (Optional)</label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={e => setVenueName(e.target.value)}
                      placeholder="Swiggy, CMRL, Nescafe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[9px] uppercase text-[#849495] tracking-wider">Note (Optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Detailed note about transaction..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-primary-fixed"
                  />
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-mono">
                    ⚠ {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  className="magnetic-btn w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 mt-2"
                >
                  {editingId ? 'Update Ledger Entry' : 'Confirm Ledger Transaction'}
                </button>
              </form>
            </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
