"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Briefcase, TrendingUp } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      </div>

      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold text-white tracking-wide">CreditFlow</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/pools" className="text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors">
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
        <section className="py-32 px-6 max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6 pb-2"
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
              className="premium-button text-white rounded-2xl font-medium text-lg px-8 py-4 flex items-center justify-center gap-2"
            >
              Explore Pools <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/borrow" 
              className="px-8 py-4 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-slate-100 font-medium text-lg hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Apply for Credit
            </Link>
          </motion.div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all"
            >
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30">
                <ShieldCheck className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Verified Borrowers</h3>
              <p className="text-slate-400 leading-relaxed">All borrowers undergo strict KYC/AML and financial auditing before accessing credit lines.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all"
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 border border-blue-500/30">
                <TrendingUp className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Sustainable Yields</h3>
              <p className="text-slate-400 leading-relaxed">Earn consistent returns from real-world business activities, decoupled from crypto market volatility.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all"
            >
              <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Briefcase className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-100">Risk Tranches</h3>
              <p className="text-slate-400 leading-relaxed">Choose your risk profile with senior and junior tranches designed for different investment strategies.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-slate-500 border-t border-white/10 bg-white/5 backdrop-blur-xl mt-auto">
        <p>&copy; {new Date().getFullYear()} CreditFlow. Built for RWA Demo Day.</p>
      </footer>
    </div>
  );
}
