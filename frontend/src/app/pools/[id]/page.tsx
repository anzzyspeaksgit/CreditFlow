"use client";

import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import CreditPoolABI from '../../../abis/CreditPool.json';
import { ShieldCheck, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';

const POOL_ADDRESS = "0x0000000000000000000000000000000000000000"; // Placeholder

export default function PoolDetailsPage({ params }: { params: { id: string } }) {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState('');

  const { data: totalDeposits } = useReadContract({
    address: POOL_ADDRESS,
    abi: CreditPoolABI,
    functionName: 'totalDeposits',
  });

  const { data: totalBorrowed } = useReadContract({
    address: POOL_ADDRESS,
    abi: CreditPoolABI,
    functionName: 'totalBorrowed',
  });

  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    
    writeContract({
      address: POOL_ADDRESS,
      abi: CreditPoolABI,
      functionName: 'deposit',
      args: [parseUnits(amount, 18)],
    });
  };

  const tvl = totalDeposits ? Number(formatUnits(totalDeposits as bigint, 18)) : 0;
  const borrowed = totalBorrowed ? Number(formatUnits(totalBorrowed as bigint, 18)) : 0;
  const utilization = tvl > 0 ? ((borrowed / tvl) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-8 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">Senior Tranche</span>
              <h1 className="text-3xl font-bold">SME Invoice Factoring</h1>
              <p className="text-gray-500 mt-2">Borrower: InvoiceX Global</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 font-medium">Fixed APY</div>
              <div className="text-3xl font-bold text-green-600">12.5%</div>
            </div>
          </div>
          
          <p className="text-gray-700 mt-4 max-w-2xl">
            This pool provides short-term working capital to verified SMEs by factoring their outstanding invoices.
            All invoices are insured and verified by our oracle network before funding.
          </p>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="p-8 border-r border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold mb-4">Deposit USDC</h3>
            {!isConnected ? (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">Please connect your wallet using the button in the top right to deposit into this pool.</p>
              </div>
            ) : (
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USDC)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">USDC</span>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isPending || isConfirming || !amount}
                  className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? 'Confirming in Wallet...' : isConfirming ? 'Processing Transaction...' : 'Deposit Funds'}
                </button>
                
                {isConfirmed && (
                  <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm font-medium text-center border border-green-200 mt-4">
                    Deposit successful! Shares minted.
                  </div>
                )}
              </form>
            )}
          </div>
          
          <div className="p-8">
            <h3 className="text-lg font-bold mb-6">Pool Highlights</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Capital Utilization: {utilization}%</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${utilization}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    High utilization indicates active borrowing and consistent yield generation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Capital Protection</h4>
                  <p className="text-sm text-gray-600 mt-1">Senior tranche is protected by 20% first-loss capital from the borrower.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Real-World Yield</h4>
                  <p className="text-sm text-gray-600 mt-1">Interest is generated directly from physical business operations and invoice repayment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
