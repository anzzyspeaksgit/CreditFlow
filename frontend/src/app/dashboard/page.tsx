"use client";

import React from 'react';
import { DollarSign, Percent, Activity, ArrowRight, ShieldCheck, ArrowUpRight, ArrowDownRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useAccount, useReadContract } from 'wagmi';
import CreditPoolABI from '../../abis/CreditPool.json';
import { formatUnits, erc20Abi } from 'viem';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESSES } from '../../config/contracts';
import { WithdrawButton } from './WithdrawButton';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();

  const { data: totalAssets } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_POOL,
    abi: CreditPoolABI,
    functionName: 'totalAssets',
  });

  const { data: totalBorrowed } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_POOL,
    abi: CreditPoolABI,
    functionName: 'totalBorrowed',
  });

  const { data: userShares } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_TOKEN,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });

  const tvl = totalAssets ? Number(formatUnits(totalAssets as bigint, 18)) : 0;
  const borrowed = totalBorrowed ? Number(formatUnits(totalBorrowed as bigint, 18)) : 0;
  const utilization = tvl > 0 ? ((borrowed / tvl) * 100).toFixed(1) : "0.0";
  
  const userSupplied = userShares ? Number(formatUnits(userShares as bigint, 18)) : 0;
  const safeUserShares = (userShares as bigint) || 0n;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Lender Dashboard</h1>
          <p className="text-slate-400">Track your private credit investments and yields.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/admin" className="bg-white/5 border border-white/10 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 hover:text-white transition-colors backdrop-blur-xl">
            Risk Admin
          </Link>
          <div className="bg-blue-500/10 border border-blue-500/20 px-5 py-2.5 rounded-xl flex items-center gap-2 backdrop-blur-xl">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">KYC Verified</span>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-500/10 text-yellow-400 p-8 rounded-2xl mb-12 border border-yellow-500/20 text-center font-medium backdrop-blur-xl"
        >
          Please connect your wallet using the top right button to view your portfolio.
        </motion.div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-2xl transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Your Total Supplied</h3>
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">
                ${userSupplied.toFixed(2)}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-2xl transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Your Interest Earned</h3>
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                  <Percent className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400">+$0.00</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-2xl transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-400 font-medium">Active Positions</h3>
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{userSupplied > 0 ? '1' : '0'} <span className="text-xl text-slate-500 font-normal">Pool</span></p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-black/40 border border-white/5 transition-all col-span-1 shadow-inner relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="w-24 h-24 text-green-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-400 font-medium">Pool Global Utilization</h3>
                </div>
                <p className="text-4xl font-extrabold mb-3 text-white">{utilization}<span className="text-2xl text-slate-500">%</span></p>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-full rounded-full" style={{ width: `${utilization}%` }}></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2"
            >
              <h2 className="text-xl font-bold mb-6 text-white">Your Positions</h2>
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="px-6 py-5 font-semibold text-slate-400 text-sm uppercase tracking-wider">Pool</th>
                      <th className="px-6 py-5 font-semibold text-slate-400 text-sm uppercase tracking-wider">Supplied</th>
                      <th className="px-6 py-5 font-semibold text-slate-400 text-sm uppercase tracking-wider">Current APY</th>
                      <th className="px-6 py-5 font-semibold text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userSupplied > 0 ? (
                      <tr className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="font-bold text-white text-base">SME Invoice Factoring</div>
                          <div className="text-sm text-slate-500 mt-1">InvoiceX Global</div>
                        </td>
                        <td className="px-6 py-5 font-bold text-lg text-white">
                          ${userSupplied.toFixed(2)}
                        </td>
                        <td className="px-6 py-5 font-bold text-green-400 text-lg">12.5%</td>
                        <td className="px-6 py-5 text-right">
                          <WithdrawButton shares={safeUserShares} disabled={false} />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-slate-400">
                          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <Briefcase className="w-8 h-8 text-slate-500" />
                          </div>
                          You have no active positions.<br />
                          <Link href="/pools" className="text-purple-400 hover:text-purple-300 transition-colors font-medium mt-2 inline-block">Explore Lending Pools &rarr;</Link>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1"
            >
              <h2 className="text-xl font-bold mb-6 text-white">Recent Transactions</h2>
              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[calc(100%-3rem)]">
                <div className="divide-y divide-white/5 flex-1">
                  <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <ArrowDownRight className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm mb-1">Deposit</div>
                        <div className="text-xs text-slate-500">Invoice Factoring</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-green-400">+$25,000</div>
                      <div className="text-xs text-slate-500 mt-1">2 days ago</div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <ArrowDownRight className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm mb-1">Interest Paid</div>
                        <div className="text-xs text-slate-500">Invoice Factoring</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-blue-400">+$124.50</div>
                      <div className="text-xs text-slate-500 mt-1">5 days ago</div>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <ArrowUpRight className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm mb-1">Withdrawal</div>
                        <div className="text-xs text-slate-500">Real Estate Bridge</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm text-white">-$10,000</div>
                      <div className="text-xs text-slate-500 mt-1">1 week ago</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10 bg-white/[0.02] text-center mt-auto">
                  <button className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider">View Block Explorer</button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
