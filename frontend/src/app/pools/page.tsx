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
          <h1 className="text-3xl font-bold mb-2">Lending Pools</h1>
          <p className="text-gray-500">Provide liquidity to institutional private credit deals.</p>
        </div>
        <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
          My Deposits
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Pool Name / Borrower</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Risk Tier</th>
              <th className="px-6 py-4 font-semibold text-gray-600">APY</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Pool Size (TVL)</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockPools.map((pool, index) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                key={pool.id} 
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">{pool.name}</div>
                  <div className="text-sm text-gray-500">{pool.borrower}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold 
                    ${pool.riskTier === 'Senior' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                  `}>
                    {pool.riskTier}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-green-600">{pool.apy}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{pool.tvl}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${pool.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm font-medium">{pool.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link 
                    href={`/pools/${pool.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
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
