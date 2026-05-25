'use client';

import React, { useState, useEffect } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Sparkles, PieChart as PieIcon, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const { expenses, incomes, insights } = useFinanceStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Category Chart Data
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#63f7ff', '#7701d0', '#72ff70', '#efdbff', '#dcb8ff', '#eeffe6', '#00e639', '#849495'];

  // 2. Income vs Expense Data
  const totalIn = incomes.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalOut = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

  const cashflowData = [
    { name: 'Telemetry', Inflow: totalIn, Outflow: totalOut }
  ];

  // 3. Impulse Guard Data
  const impulseTotals = { need: 0, want: 0, impulse: 0 };
  expenses.forEach(e => {
    if (e.tag) {
      impulseTotals[e.tag] = (impulseTotals[e.tag] || 0) + Number(e.amount);
    }
  });

  const impulseData = [
    { name: 'Need', Value: impulseTotals.need, fill: '#63f7ff' },
    { name: 'Want', Value: impulseTotals.want, fill: '#efdbff' },
    { name: 'Impulse', Value: impulseTotals.impulse, fill: '#ffb4ab' }
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-sm font-mono uppercase tracking-widest text-[#849495] gap-4">
        <div className="w-10 h-10 border-2 border-primary-fixed border-t-transparent rounded-full animate-spin" />
        Syncing Analytics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Analytics Terminal</h1>
        <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Telemetry telemetry index logs</p>
      </div>

      {/* CHART 1: Category Outflow Distribution (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col h-[400px]">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5 mb-4">
            <PieIcon className="w-4 h-4 text-primary-fixed" /> Outflow Category Share
          </h3>
          
          <div className="flex-grow w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#849495] font-mono uppercase">
                No expense telemetry recorded
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem', color: '#fff' }}
                    itemStyle={{ color: '#63f7ff' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase', color: '#b9caca' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* CHART 2: Cashflow Inflow vs Outflow (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col h-[400px]">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5 mb-4">
            <TrendingUp className="w-4 h-4 text-primary-fixed" /> Inflow vs Outflow comparison
          </h3>

          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                <XAxis dataKey="name" stroke="#849495" fontSize={10} tickLine={false} />
                <YAxis stroke="#849495" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}
                />
                <Legend 
                  iconSize={10} 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }} 
                />
                <Bar dataKey="Inflow" fill="#72ff70" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Outflow" fill="#63f7ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHART 3: Impulse Guard Behavior (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col h-[400px]">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-secondary" /> Impulse Guard Tagging Share
          </h3>

          <div className="flex-grow w-full">
            {impulseTotals.need === 0 && impulseTotals.want === 0 && impulseTotals.impulse === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#849495] font-mono uppercase">
                No tagged expense logs found.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impulseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                  <XAxis type="number" stroke="#849495" fontSize={10} tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#849495" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}
                  />
                  <Bar dataKey="Value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* AI INSIGHTS SENTINEL (6 cols) */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="glass-panel p-6 rounded-3xl flex flex-col min-h-[400px]">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
            <Sparkles className="w-5 h-5 text-primary-fixed" /> AI Advisor Insights
          </h3>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            {insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center gap-2 py-12">
                <ShieldCheck className="w-8 h-8 text-tertiary-fixed animate-pulse" />
                <span className="text-xs text-[#849495] font-mono uppercase">No warning advisories triggered</span>
              </div>
            ) : (
              insights.map(ins => (
                <div 
                  key={ins.id} 
                  className={`p-4 rounded-xl border flex gap-3 ${
                    ins.type === 'warning' 
                      ? 'border-red-500/20 bg-red-500/5 text-[#e5e2e1]' 
                      : ins.type === 'safety'
                        ? 'border-yellow-500/20 bg-yellow-500/5 text-[#e5e2e1]'
                        : 'border-primary-fixed/20 bg-primary-fixed/5 text-[#e5e2e1]'
                  }`}
                >
                  {ins.type === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-primary-fixed shrink-0 mt-0.5" />
                  )}
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-semibold text-white uppercase font-mono text-[9px] tracking-wider">
                      {ins.type === 'warning' ? 'Warning Alert' : ins.type === 'safety' ? 'Behavior Alert' : 'System Tip'}
                    </span>
                    <p className="text-[#b9caca] leading-relaxed mt-0.5">{ins.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
