"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, CheckCircle, AlertCircle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import CreditPoolABI from '../../abis/CreditPool.json';
import { CONTRACT_ADDRESSES } from '../../config/contracts';
import { formatUnits, parseUnits, erc20Abi } from 'viem';

export default function BorrowPage() {
  const { address, isConnected } = useAccount();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [borrowAmount, setBorrowAmount] = useState('');
  const [repayAmount, setRepayAmount] = useState('');

  // Check if connected address is an approved borrower
  const { data: isApproved } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_POOL,
    abi: CreditPoolABI,
    functionName: 'approvedBorrowers',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: totalBorrowed } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_POOL,
    abi: CreditPoolABI,
    functionName: 'totalBorrowed',
  });

  const { data: usdcBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.CREDIT_POOL,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [CONTRACT_ADDRESSES.CREDIT_POOL],
  });

  const { data: userUsdcAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.CREDIT_POOL] : undefined,
    query: { enabled: !!address }
  });

  const { writeContractAsync } = useWriteContract();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 2000);
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowAmount) return;
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CREDIT_POOL,
        abi: CreditPoolABI,
        functionName: 'borrow',
        args: [parseUnits(borrowAmount, 18)],
      });
      setBorrowAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repayAmount) return;
    try {
      const parsedAmount = parseUnits(repayAmount, 18);
      const currentAllowance = userUsdcAllowance ? (userUsdcAllowance as bigint) : 0n;
      
      if (currentAllowance < parsedAmount) {
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.MOCK_USDC,
          abi: erc20Abi,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.CREDIT_POOL, parsedAmount],
        });
        return; // User has to click again after approval for simplicity
      }

      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CREDIT_POOL,
        abi: CreditPoolABI,
        functionName: 'repay',
        // Assuming repaying full principal and 0 interest for simple UI, or split
        // For hackathon UI, let's treat the input as principal and add 5% interest
        args: [parsedAmount, parsedAmount * 5n / 100n],
      });
      setRepayAmount('');
    } catch (err) {
      console.error(err);
    }
  };

  const availableLiquidity = usdcBalance ? Number(formatUnits(usdcBalance as bigint, 18)) : 0;
  const globalBorrowed = totalBorrowed ? Number(formatUnits(totalBorrowed as bigint, 18)) : 0;

  if (isConnected && isApproved) {
    return (
      <div className="flex flex-col min-h-screen text-slate-100 overflow-hidden relative">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        </div>

        <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            <a href="/" className="text-xl font-bold text-white tracking-wide">CreditFlow</a>
          </div>
          <div className="text-sm font-medium text-slate-400 tracking-wider uppercase">Active Credit Line</div>
        </header>

        <main className="flex-1 relative z-10 max-w-6xl mx-auto w-full px-6 py-12">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-3">Borrower Dashboard</h1>
            <p className="text-slate-400 text-lg font-light">Manage your institutional credit lines and active drawdowns.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="glass-card p-10 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8">Drawdown Capital</h3>
              <div className="mb-8 p-6 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400 font-medium">Available Pool Liquidity</span>
                  <span className="text-2xl font-bold text-white">{availableLiquidity.toFixed(2)} <span className="text-sm text-slate-500">USDC</span></span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2.5 rounded-full w-full"></div>
                </div>
              </div>
              <form onSubmit={handleBorrow} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Amount to Borrow</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={borrowAmount}
                      onChange={(e) => setBorrowAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white text-xl transition-all group-hover:bg-white/10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold tracking-wider">USDC</span>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!borrowAmount || Number(borrowAmount) > availableLiquidity}
                  className="w-full premium-button text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                  <ArrowDownRight className="w-5 h-5" /> Drawdown Funds
                </button>
              </form>
            </div>

            <div className="glass-card p-10 rounded-3xl shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8">Make Repayment</h3>
              <div className="mb-8 p-6 bg-black/20 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-400 font-medium">Global Outstanding Debt</span>
                  <span className="text-2xl font-bold text-red-400">{globalBorrowed.toFixed(2)} <span className="text-sm text-slate-500">USDC</span></span>
                </div>
              </div>
              <form onSubmit={handleRepay} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Principal Repayment</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={repayAmount}
                      onChange={(e) => setRepayAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-white text-xl transition-all group-hover:bg-white/10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold tracking-wider">USDC</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-4 text-slate-400 text-sm font-medium bg-black/20 p-3 rounded-lg border border-white/5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                    <p>A 5% interest fee will be automatically calculated and appended to this repayment for the lenders.</p>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!repayAmount}
                  className="w-full bg-white/10 border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-md"
                >
                  <ArrowUpRight className="w-5 h-5 text-green-400" /> Repay & Accrue Interest
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-slate-100 overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
      </div>

      <header className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-purple-400" />
          <a href="/" className="text-xl font-bold text-white tracking-wide">CreditFlow</a>
        </div>
        <div className="text-sm font-medium text-slate-400 tracking-wider uppercase">Borrower Portal</div>
      </header>

      <main className="flex-1 relative z-10 max-w-4xl mx-auto w-full px-6 py-12">
        {!isConnected && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-5 rounded-2xl flex gap-4 items-start mb-8 backdrop-blur-xl"
          >
            <AlertCircle className="w-6 h-6 shrink-0 text-blue-400" />
            <p className="text-sm font-medium leading-relaxed">Connect your wallet. If you are whitelisted by the risk committee, you will access the active credit line dashboard directly.</p>
          </motion.div>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8 md:p-10 border-b border-white/10 bg-black/40">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Apply for Credit Line</h1>
            <p className="text-slate-400 font-light text-lg">Institutional borrowing requires strict KYC, AML, and collateral verification.</p>
          </div>

          <div className="p-8 md:p-10">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">1</div>
                  <h2 className="text-2xl font-bold text-white">Company Details</h2>
                </div>
                <form onSubmit={() => setStep(2)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Company Name</label>
                      <input type="text" required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white transition-all hover:bg-white/10" placeholder="Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Registration Number</label>
                      <input type="text" required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white transition-all hover:bg-white/10" placeholder="123456789" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Requested Credit Limit (USDC)</label>
                    <input type="number" required className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white transition-all hover:bg-white/10" placeholder="500,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Business Description</label>
                    <textarea required rows={4} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white transition-all hover:bg-white/10 resize-none" placeholder="Describe your business model and use of funds..."></textarea>
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="w-full premium-button text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      Continue to KYC
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">2</div>
                  <h2 className="text-2xl font-bold text-white">Documentation & KYC</h2>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-5 rounded-2xl flex gap-4 items-start mb-8">
                  <AlertCircle className="w-6 h-6 shrink-0 text-blue-400" />
                  <p className="text-sm leading-relaxed">To comply with international regulations, you must upload audited financials and pass our identity verification process.</p>
                </div>
                
                <form onSubmit={handleApply} className="space-y-8">
                  <div className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center hover:bg-white/5 transition-colors cursor-pointer bg-white/[0.02]">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-lg font-bold text-white">Upload Financial Statements</p>
                    <p className="text-sm text-slate-500 mt-2 font-medium">PDF, DOCX up to 10MB</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button type="button" onClick={() => setStep(1)} className="w-full sm:w-1/3 bg-white/5 border border-white/10 text-white font-bold text-lg py-4 rounded-xl hover:bg-white/10 transition-colors">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-2/3 premium-button text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50">
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-4">Application Submitted!</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg leading-relaxed font-light">
                  Your application for a credit line has been submitted. Our risk committee will review your documents within 48-72 hours.
                </p>
                <a href="/" className="inline-flex items-center justify-center bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-md">
                  Return to Homepage
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
