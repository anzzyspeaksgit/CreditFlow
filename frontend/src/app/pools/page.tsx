"use client";

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const mockPools = [
  {
    id: '0x1',
    name: 'SME Invoice Factoring',
    apy: '12.5%',
    tvl: '$1,250,000',
    borrower: 'InvoiceX Global',
    riskTier: 'Senior',
    status: 'Active',
  },
  {
    id: '0x2',
    name: 'Real Estate Bridge',
    apy: '18.0%',
    tvl: '$800,000',
    borrower: 'PropFrac Capital',
    riskTier: 'Mezzanine',
    status: 'Funding',
  },
  {
    id: '0x3',
    name: 'Gold Mining Equipment',
    apy: '14.2%',
    tvl: '$2,100,000',
    borrower: 'GoldVault Resources',
    riskTier: 'Senior',
    status: 'Active',
  }
];

export default function PoolsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Lending Pools</h1>
          <p className="text-slate-400">Provide liquidity to institutional private credit deals.</p>
        </div>
        <Link href="/dashboard" className="bg-white/10 backdrop-blur-md text-purple-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors border border-white/5">
          My Deposits
        </Link>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="border-b border-white/10">
            <tr>
              <th className="px-6 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Pool Name / Borrower</th>
              <th className="px-6 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Risk Tier</th>
              <th className="px-6 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">APY</th>
              <th className="px-6 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Pool Size (TVL)</th>
              <th className="px-6 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Status</th>
              <th className="px-6 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {mockPools.map((pool, index) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                key={pool.id} 
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">{pool.name}</div>
                  <div className="text-sm text-slate-500 mt-1">{pool.borrower}</div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider
                    ${pool.riskTier === 'Senior' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}
                  `}>
                    {pool.riskTier}
                  </span>
                </td>
                <td className="px-6 py-5 font-bold text-green-400 text-lg">{pool.apy}</td>
                <td className="px-6 py-5 text-slate-300 font-medium">{pool.tvl}</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${pool.status === 'Active' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]'}`}></div>
                    <span className="text-sm font-medium text-slate-300">{pool.status}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <Link 
                    href={`/pools/${pool.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold premium-button text-white px-5 py-2.5 rounded-xl transition-all"
                  >
                    Deposit <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
