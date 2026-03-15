"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Briefcase, TrendingUp } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">CreditFlow</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/pools" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Lending Pools
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          <Link href="/borrow" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Borrow
          </Link>
        </nav>
        <ConnectButton />
      </header>

      <main className="flex-1">
        <section className="py-20 px-6 max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6"
          >
            Institutional-Grade <br className="hidden md:block" />
            <span className="text-blue-600">Private Credit</span> on Chain
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Provide liquidity to verified real-world businesses and earn sustainable yields. 
            CreditFlow bridges traditional finance with DeFi efficiency.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              href="/pools" 
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Explore Pools <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/borrow" 
              className="px-8 py-4 bg-white text-black border border-gray-300 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Apply for Credit
            </Link>
          </motion.div>
        </section>

        <section className="py-16 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Borrowers</h3>
              <p className="text-gray-600">All borrowers undergo strict KYC/AML and financial auditing before accessing credit lines.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainable Yields</h3>
              <p className="text-gray-600">Earn consistent returns from real-world business activities, decoupled from crypto market volatility.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Risk Tranches</h3>
              <p className="text-gray-600">Choose your risk profile with senior and junior tranches designed for different investment strategies.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-gray-500 border-t mt-auto">
        <p>&copy; {new Date().getFullYear()} CreditFlow. Built for RWA Demo Day.</p>
      </footer>
    </div>
  );
}
