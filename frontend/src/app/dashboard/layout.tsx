import React from 'react';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <Link href="/" className="text-xl font-bold">CreditFlow</Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/pools" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Lending Pools
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-blue-600">
            Dashboard
          </Link>
        </nav>
        <ConnectButton />
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
