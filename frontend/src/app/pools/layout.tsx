import React from 'react';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      </div>

      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-400" />
          <Link href="/" className="text-xl font-bold text-white tracking-wide">CreditFlow</Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/pools" className="text-sm font-medium text-purple-400">
            Lending Pools
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/borrow" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors">
            Borrow
          </Link>
        </nav>
        <ConnectButton />
      </header>
      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}
