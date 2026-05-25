'use my-client'; // Note: Server components can render this, but let's make it simple. We can use a client component for navigation and menu toggles.
import React from 'react';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-black text-[#e5e2e1] relative">
      {/* 3D background glows */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-primary-fixed/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-secondary-container/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-2xl border-b border-white/5 z-50 transition-all duration-300">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-gutter w-full max-w-container-max mx-auto h-20">
          {/* Logo */}
          <Link href="/" className="font-display text-primary-fixed tracking-tighter brightness-125 text-2xl md:text-3xl font-bold select-none hover:opacity-80 transition-opacity">
            CapitalS
          </Link>
          
          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-[#b9caca]">
            <Link href="/#features" className="hover:text-primary-fixed transition-colors">
              Features
            </Link>
            <Link href="/about" className="hover:text-primary-fixed transition-colors">
              About
            </Link>
            <Link href="/pricing" className="hover:text-primary-fixed transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-primary-fixed transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="font-mono text-xs uppercase tracking-wider text-white hover:text-primary-fixed transition-colors hidden sm:inline-block">
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="magnetic-btn px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider font-semibold active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-black border-t border-white/5 z-10 relative">
        <div className="flex flex-col items-center justify-center gap-6 px-margin-desktop w-full max-w-container-max mx-auto">
          <div className="font-display text-[#3a3939] text-3xl font-bold select-none opacity-40">CapitalS</div>
          <nav className="flex flex-wrap justify-center gap-8 font-mono text-xs uppercase tracking-widest text-on-surface-variant">
            <Link href="/privacy" className="hover:text-primary-fixed transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-primary-fixed transition-colors">
              About Us
            </Link>
            <Link href="/pricing" className="hover:text-primary-fixed transition-colors">
              Pricing Plan
            </Link>
            <Link href="/contact" className="hover:text-primary-fixed transition-colors">
              Support Contact
            </Link>
          </nav>
          <p className="font-sans text-xs text-[#849495] text-center mt-2">
            © {new Date().getFullYear()} CapitalS. Engineered for the Future of Student Finance.
          </p>
        </div>
      </footer>
    </div>
  );
}
