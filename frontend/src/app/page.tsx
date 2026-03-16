"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Briefcase, TrendingUp } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-slate-100">
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 glass-card">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-400" />
          <span className="text-xl font-bold text-white tracking-wide">CreditFlow</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/pools" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
            Lending Pools
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/borrow" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
            Borrow
          </Link>
        </nav>
        <ConnectButton />
      </header>

      <main className="flex-1 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <section className="py-24 px-6 max-w-5xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Institutional-Grade <br className="hidden md:block" />
            Private Credit on Chain
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Provide liquidity to verified real-world businesses and earn sustainable yields. 
            CreditFlow bridges traditional finance with DeFi efficiency.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link 
              href="/pools" 
              className="premium-button text-white rounded-xl font-medium text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              Explore Pools <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/borrow" 
              className="px-8 py-4 glass-card text-slate-100 rounded-xl font-medium text-lg hover:bg-slate-800/50 transition-colors flex items-center justify-center"
            >
              Apply for Credit
            </Link>
          </motion.div>
        </section>

        <section className="py-20 px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-2xl transition-all"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
                <ShieldCheck className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Verified Borrowers</h3>
              <p className="text-slate-400 leading-relaxed">All borrowers undergo strict KYC/AML and financial auditing before accessing credit lines.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-2xl transition-all"
            >
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 border border-green-500/20">
                <TrendingUp className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Sustainable Yields</h3>
              <p className="text-slate-400 leading-relaxed">Earn consistent returns from real-world business activities, decoupled from crypto market volatility.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="glass-card p-8 rounded-2xl transition-all"
            >
              <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Briefcase className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Risk Tranches</h3>
              <p className="text-slate-400 leading-relaxed">Choose your risk profile with senior and junior tranches designed for different investment strategies.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 border-t border-slate-800 glass-card">
        <p>&copy; {new Date().getFullYear()} CreditFlow. Built for RWA Demo Day.</p>
      </footer>
    </div>
  );
}
