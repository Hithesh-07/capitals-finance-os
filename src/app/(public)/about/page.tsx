import React from 'react';
import { HelpCircle, Users, Trophy } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Our Mission</span>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-white">About CapitalS</h1>
        <p className="font-sans text-base text-on-surface-variant leading-relaxed">
          Traditional fintech is built for salaried adults with predictable cashflows. CapitalS was engineered to solve the complex financial realities of college students, freelancers, and young adults.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20">
            <Users className="w-6 h-6 text-primary-fixed" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Student-First Focus</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            We focus exclusively on non-fixed income types: parent allowances, internship stipends, side-hustles, and micro-loans.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20">
            <HelpCircle className="w-6 h-6 text-primary-fixed" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Interactive Telemetry</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Using kinetic layouts and 3D Expense Orbits, we transform finance from static sheets into a living, responsive ecosystem.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20">
            <Trophy className="w-6 h-6 text-primary-fixed" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Healthy Habits</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Through streak tracking, gamification, and Brokeman Mode warnings, we guide students toward financial freedom.
          </p>
        </div>
      </div>
    </div>
  );
}
