import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col gap-8 max-w-3xl">
      <h1 className="font-display text-4xl font-bold text-white tracking-tight">Privacy Policy</h1>
      <p className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Effective date: May 26, 2026</p>
      
      <div className="flex flex-col gap-6 text-[#b9caca] leading-relaxed text-sm">
        <p>
          At CapitalS, we take your financial privacy extremely seriously. This policy describes how we collect, protect, and process your financial telemetry.
        </p>

        <h2 className="font-display text-xl font-bold text-white mt-4">1. Data Storage & Local Persistence</h2>
        <p>
          If you are running in Preview Mode, all of your financial entries, transaction details, budgets, splits, and user profiles are stored locally in your browser's Local Storage. We have no access to this data.
        </p>

        <h2 className="font-display text-xl font-bold text-white mt-4">2. Database Syncing</h2>
        <p>
          Once you configure and log in to a Supabase database instance, your records are transmitted and synchronized to your private PostgreSQL tables. All queries and mutations are secured via Row Level Security (RLS) policies.
        </p>

        <h2 className="font-display text-xl font-bold text-white mt-4">3. UPI & Receipt Images</h2>
        <p>
          Any UPI screenshot or receipt upload processed in the scanner tool is extracted locally via simulated OCR algorithms or through secured endpoints. We do not store, catalog, or resell your image files.
        </p>
      </div>
    </div>
  );
}
