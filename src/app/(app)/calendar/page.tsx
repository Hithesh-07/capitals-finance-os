'use client';

import React, { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, AlertTriangle, Check
} from 'lucide-react';

export default function CalendarPage() {
  const { reminders, markReminderPaid } = useFinanceStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(
    new Date().toISOString().split('T')[0]
  );

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calendar generation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Create calendar cells array (35 or 42 cells)
  const calendarCells: (Date | null)[] = [];
  
  // Empty cells for padding
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }

  // Actual day dates
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(new Date(year, month, d));
  }

  // Format key
  const getFormattedKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if date has reminders
  const getRemindersForDate = (dateStr: string) => {
    return reminders.filter(r => r.due_date === dateStr);
  };

  const selectedDateReminders = selectedDateStr ? getRemindersForDate(selectedDateStr) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-container-max mx-auto pb-12">
      
      {/* Title */}
      <div className="lg:col-span-12">
        <h1 className="font-display text-2xl md:text-4xl font-bold text-white tracking-tight">Calendar</h1>
        <p className="text-xs text-on-surface-variant font-mono uppercase mt-1">Due Schedule Map</p>
      </div>

      {/* LEFT COLUMN: The Interactive Calendar Grid (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
          
          {/* Calendar header */}
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-white text-base">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={prevMonth}
                className="p-2 rounded-lg border border-white/5 hover:border-white/15 text-[#b9caca] hover:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-2 rounded-lg border border-white/5 hover:border-white/15 text-[#b9caca] hover:text-white transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center font-mono text-[9px] uppercase tracking-widest text-[#849495] border-b border-white/5 pb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((dateObj, idx) => {
              if (dateObj === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const dateStr = getFormattedKey(dateObj);
              const dayReminders = getRemindersForDate(dateStr);
              const hasReminders = dayReminders.length > 0;
              const isSelected = selectedDateStr === dateStr;
              
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <button
                  type="button"
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-between p-2 transition-all relative ${
                    isSelected 
                      ? 'border-primary-fixed bg-primary-fixed/5 text-primary-fixed' 
                      : isToday
                        ? 'border-white/20 bg-white/3 text-white'
                        : 'border-white/5 hover:border-white/15 text-[#b9caca]'
                  }`}
                >
                  <span className="font-mono text-xs">{dateObj.getDate()}</span>
                  
                  {/* Marker dots */}
                  {hasReminders && (
                    <div className="flex gap-1 justify-center w-full">
                      {dayReminders.slice(0, 3).map(rem => (
                        <div 
                          key={rem.id} 
                          className={`w-1 h-1 rounded-full ${
                            rem.status === 'paid' ? 'bg-tertiary-fixed' : 'bg-primary-fixed shadow-[0_0_4px_#63f7ff]'
                          }`} 
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: Day Breakdown Drawer (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 min-h-[300px]">
          
          {/* Header */}
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-display font-semibold text-white text-base">
              {selectedDateStr 
                ? new Date(selectedDateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'Select a Date'
              }
            </h3>
            <span className="font-mono text-[9px] uppercase text-[#849495] mt-0.5">Dues Scheduled</span>
          </div>

          {/* Reminders List for Selected Date */}
          <div className="flex flex-col gap-3">
            {selectedDateReminders.length === 0 ? (
              <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider py-8 text-center">
                No alerts scheduled for this date.
              </p>
            ) : (
              selectedDateReminders.map(rem => (
                <div 
                  key={rem.id} 
                  className={`p-4 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-3 border-l-4 ${
                    rem.status === 'paid' ? 'border-l-tertiary-fixed' : 'border-l-primary-fixed'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-white">{rem.title}</span>
                      <span className="text-[9px] text-[#849495] font-mono mt-0.5 uppercase">{rem.type}</span>
                    </div>
                    {rem.amount && (
                      <span className="font-mono font-bold text-xs text-white">
                        ₹{rem.amount}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    {rem.status === 'paid' ? (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-tertiary-fixed bg-tertiary-fixed/5 px-2.5 py-1.5 rounded-lg border border-tertiary-fixed/20">
                        Cleared
                      </span>
                    ) : (
                      <button
                        onClick={() => markReminderPaid(rem.id)}
                        className="magnetic-btn px-4 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-semibold active:scale-95 transition-all"
                      >
                        Clear Bill
                      </button>
                    )}
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
