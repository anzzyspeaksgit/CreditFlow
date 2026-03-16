"use client";

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Users } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import CreditPoolABI from '../../../abis/CreditPool.json';
import { CONTRACT_ADDRESSES } from '../../../config/contracts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function AdminDashboard() {
  const { address } = useAccount();
  const [approving, setApproving] = useState<string | null>(null);
  
  const MOCK_BORROWER_ADDRESS = "0x0000000000000000000000000000000000000001"; // Generic mock

  const [borrowers, setBorrowers] = useState([
    { id: '1', name: 'InvoiceX Global', reg: 'UK-928374', limit: '$1,250,000', status: 'Approved', address: '0x123...' },
    { id: '2', name: 'PropFrac Capital', reg: 'US-102938', limit: '$800,000', status: 'Approved', address: '0x456...' },
    { id: '3', name: 'Acme Corp', reg: 'SG-882233', limit: '$500,000', status: 'Pending Review', address: MOCK_BORROWER_ADDRESS },
  ]);

  const { data: hash, writeContractAsync } = useWriteContract();

  const handleApprove = async (id: string, borrowerAddress: string) => {
    try {
      setApproving(id);
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CREDIT_POOL,
        abi: CreditPoolABI,
        functionName: 'approveBorrower',
        args: [borrowerAddress, true],
      });
      
      setBorrowers(prev => prev.map(b => b.id === id ? { ...b, status: 'Approved' } : b));
      setApproving(null);
    } catch (error) {
      console.error(error);
      setApproving(null);
    }
  };

  const handleRevoke = async (id: string, borrowerAddress: string) => {
    try {
      setApproving(id);
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CREDIT_POOL,
        abi: CreditPoolABI,
        functionName: 'approveBorrower',
        args: [borrowerAddress, false],
      });
      
      setBorrowers(prev => prev.map(b => b.id === id ? { ...b, status: 'Pending Review' } : b));
      setApproving(null);
    } catch (error) {
      console.error(error);
      setApproving(null);
    }
  };

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
        <div className="text-sm font-medium text-slate-400 tracking-wider uppercase">Admin Portal</div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 relative z-10"
      >
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-3">Risk & Admin Dashboard</h1>
            <p className="text-slate-400 text-lg font-light">Manage KYC verifications, borrowers, and global risk metrics.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-400 font-medium">Verified Borrowers</h3>
              <div className="w-14 h-14 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                <UserCheck className="w-7 h-7 text-green-400" />
              </div>
            </div>
            <p className="text-5xl font-bold text-white">
              {borrowers.filter(b => b.status === 'Approved').length}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-400 font-medium">Pending Applications</h3>
              <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
                <Users className="w-7 h-7 text-yellow-400" />
              </div>
            </div>
            <p className="text-5xl font-bold text-yellow-400">
              {borrowers.filter(b => b.status === 'Pending Review').length}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card p-8 rounded-3xl shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-400 font-medium">Global Risk Alerts</h3>
              <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
            </div>
            <p className="text-5xl font-bold text-red-400">0</p>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">Borrower Management (KYC)</h2>
        <div className="glass-card rounded-3xl shadow-2xl overflow-hidden mb-12">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-8 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Company</th>
                <th className="px-8 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Registration</th>
                <th className="px-8 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Credit Limit</th>
                <th className="px-8 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase">Status</th>
                <th className="px-8 py-5 font-semibold text-slate-400 text-sm tracking-wider uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {borrowers.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 font-bold text-white text-base group-hover:text-purple-300 transition-colors">{b.name}</td>
                  <td className="px-8 py-6 text-slate-400">{b.reg}</td>
                  <td className="px-8 py-6 font-medium text-white text-lg">{b.limit}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                      b.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {b.status === 'Pending Review' ? (
                      <button 
                        onClick={() => handleApprove(b.id, b.address)}
                        disabled={approving === b.id}
                        className="text-sm font-bold bg-white text-black px-6 py-3 rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
                      >
                        {approving === b.id ? 'Confirming in Wallet...' : 'Approve Borrower'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleRevoke(b.id, b.address)}
                        disabled={approving === b.id}
                        className="text-sm font-bold border border-red-500/30 bg-red-500/10 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        {approving === b.id ? 'Processing...' : 'Revoke Access'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center text-sm text-slate-500 max-w-2xl mx-auto bg-black/20 p-4 rounded-xl border border-white/5">
          <p>Note: In a production environment, this dashboard is heavily restricted via OpenZeppelin's <code className="font-mono text-purple-400">AccessControl</code> and <code className="font-mono text-purple-400">Ownable</code> contracts.</p>
        </div>
      </motion.main>
    </div>
  );
}
