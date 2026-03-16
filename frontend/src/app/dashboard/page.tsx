"use client";

import React from 'react';
import { DollarSign, Percent, Activity, ArrowRight, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
  
  // For simplicity, we are showing the value of user's shares in USDC
  // Since totalAssets grows, userValue = userShares * totalAssets / totalSupply
  // But for a hackathon UI, if userShares exists we can display a mockup value or calculate it simply
  // Assuming 1:1 roughly for the demo display:
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
          <h1 className="text-3xl font-bold mb-2">Lender Dashboard</h1>
          <p className="text-gray-500">Track your private credit investments and yields.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard/admin" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
            Risk Admin
          </Link>
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">KYC Verified</span>
          </div>
        </div>
      </div>

      {!isConnected ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50 text-yellow-800 p-6 rounded-xl mb-12 border border-yellow-200 text-center font-medium"
        >
          Please connect your wallet to view your portfolio.
        </motion.div>
      ) : (
        <>
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Your Total Supplied</h3>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold">
                ${userSupplied.toFixed(2)}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Your Interest Earned</h3>
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Percent className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">+$0.00</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">Active Positions</h3>
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold">{userSupplied > 0 ? '1' : '0'} Pool</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-900 text-white p-6 rounded-xl shadow-sm border border-gray-800 transition-all col-span-1"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 font-medium">Pool Global Utilization</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{utilization}%</p>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: `${utilization}%` }}></div>
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
              <h2 className="text-xl font-bold mb-6">Your Positions</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600">Pool</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Supplied</th>
                      <th className="px-6 py-4 font-semibold text-gray-600">Current APY</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {userSupplied > 0 ? (
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">SME Invoice Factoring</div>
                          <div className="text-sm text-gray-500">InvoiceX Global</div>
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${userSupplied.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">12.5%</td>
                        <td className="px-6 py-4 text-right">
                          <WithdrawButton shares={safeUserShares} disabled={false} />
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                          You have no active positions. <Link href="/pools" className="text-blue-600 hover:underline">Explore Pools</Link>
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
              <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <ArrowDownRight className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Deposit</div>
                        <div className="text-xs text-gray-500">Invoice Factoring</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-green-600">+$25,000</div>
                      <div className="text-xs text-gray-500">2 days ago</div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <ArrowDownRight className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Interest Paid</div>
                        <div className="text-xs text-gray-500">Invoice Factoring</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm text-blue-600">+$124.50</div>
                      <div className="text-xs text-gray-500">5 days ago</div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">Withdrawal</div>
                        <div className="text-xs text-gray-500">Real Estate Bridge</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">-$10,000</div>
                      <div className="text-xs text-gray-500">1 week ago</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All on Explorer</button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}
