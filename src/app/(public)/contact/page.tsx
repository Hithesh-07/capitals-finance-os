import React from 'react';
import { Mail, Shield, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col gap-12">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <span className="font-mono text-xs uppercase text-primary-fixed tracking-widest">Support Portal</span>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tighter text-white">Get in Touch</h1>
        <p className="font-sans text-base text-on-surface-variant leading-relaxed">
          Need help setting up your Supabase credentials or linking your Groww account? Our engineering team is ready to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto w-full mt-8">
        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20">
            <Mail className="w-6 h-6 text-primary-fixed" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">Email Support</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Direct telemetry issues or feature requests.
          </p>
          <a href="mailto:support@capitals.co" className="font-mono text-sm text-primary-fixed mt-auto hover:underline">
            support@capitals.co
          </a>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20">
            <MessageSquare className="w-6 h-6 text-primary-fixed" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">WhatsApp Helper</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Split balances or link settlements assistance.
          </p>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="font-mono text-sm text-primary-fixed mt-auto hover:underline">
            +91 99999 99999
          </a>
        </div>

        <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-center items-center">
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/10 flex items-center justify-center border border-primary-fixed/20">
            <Shield className="w-6 h-6 text-primary-fixed" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">Discord Guild</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Interact with our developer community.
          </p>
          <a href="#" className="font-mono text-sm text-primary-fixed mt-auto hover:underline">
            discord.gg/capitals
          </a>
        </div>
      </div>
    </div>
  );
}
