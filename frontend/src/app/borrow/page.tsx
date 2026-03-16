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
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
          <div className="flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <a href="/" className="text-xl font-bold">CreditFlow</a>
          </div>
          <div className="text-sm font-medium text-gray-500">Active Credit Line</div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Borrower Dashboard</h1>
            <p className="text-gray-500">Manage your active credit lines and repayments.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-6">Drawdown Capital</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Available Pool Liquidity</span>
                  <span className="font-medium">{availableLiquidity.toFixed(2)} USDC</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                </div>
              </div>
              <form onSubmit={handleBorrow} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount to Borrow (USDC)</label>
                  <input
                    type="number"
                    value={borrowAmount}
                    onChange={(e) => setBorrowAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!borrowAmount || Number(borrowAmount) > availableLiquidity}
                  className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDownRight className="w-4 h-4" /> Drawdown Funds
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold mb-6">Make Repayment</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Global Outstanding Debt</span>
                  <span className="font-medium text-red-600">{globalBorrowed.toFixed(2)} USDC</span>
                </div>
              </div>
              <form onSubmit={handleRepay} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Principal Repayment (USDC)</label>
                  <input
                    type="number"
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Note: A 5% interest fee will be automatically calculated and appended to this repayment for the lenders.</p>
                </div>
                <button
                  type="submit"
                  disabled={!repayAmount}
                  className="w-full border border-gray-300 bg-white text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" /> Repay & Accrue Interest
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <a href="/" className="text-xl font-bold">CreditFlow</a>
        </div>
        <div className="text-sm font-medium text-gray-500">Borrower Portal</div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
        {!isConnected && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 items-start mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">Connect your wallet. If you are whitelisted, you will access the active credit line dashboard directly.</p>
          </div>
        )}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-2">Apply for Credit Line</h1>
            <p className="text-gray-400">Institutional borrowing requires strict KYC, AML, and collateral verification.</p>
          </div>

          <div className="p-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">Step 1: Company Details</h2>
                <form onSubmit={() => setStep(2)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                      <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="123456789" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested Credit Limit (USDC)</label>
                    <input type="number" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="500,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                    <textarea required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe your business model and use of funds..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Continue to KYC
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6">Step 2: Documentation & KYC</h2>
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 items-start mb-6">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">To comply with international regulations, you must upload audited financials and pass our identity verification process.</p>
                </div>
                
                <form onSubmit={handleApply} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-900">Upload Financial Statements</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 10MB</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-gray-100 text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-200 transition-colors">
                      Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="w-2/3 bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Your application for a credit line has been submitted. Our risk committee will review your documents within 48-72 hours.
                </p>
                <a href="/" className="text-blue-600 font-medium hover:underline">
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
