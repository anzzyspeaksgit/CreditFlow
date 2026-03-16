"use client";

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, erc20Abi } from 'viem';
import CreditPoolABI from '../../../abis/CreditPool.json';
import { CONTRACT_ADDRESSES } from '../../../config/contracts';
import { ShieldCheck, TrendingUp, AlertCircle, BarChart3, Coins } from 'lucide-react';

const mockUsdcAbi = [
  ...erc20Abi,
  {
    type: "function",
    name: "mint",
    inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export default function PoolDetailsPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [txState, setTxState] = useState<'idle' | 'approving' | 'depositing' | 'minting' | 'success'>('idle');

  // Pool read metrics
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

  // User USDC metrics
  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_USDC,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address ? [address, CONTRACT_ADDRESSES.CREDIT_POOL] : undefined,
    query: { enabled: !!address }
  });

  const { writeContractAsync } = useWriteContract();

  const handleMint = async () => {
    if (!address) return;
    try {
      setTxState('minting');
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: mockUsdcAbi,
        functionName: 'mint',
        args: [address, parseUnits("10000", 18)],
      });
      // In a real app we'd wait for receipt, simplifying for demo
      setTimeout(() => refetchBalance(), 4000);
      setTxState('idle');
    } catch (e) {
      console.error(e);
      setTxState('idle');
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !address) return;
    
    const parsedAmount = parseUnits(amount, 18);
    const currentAllowance = allowance ? (allowance as bigint) : 0n;

    try {
      if (currentAllowance < parsedAmount) {
        setTxState('approving');
        await writeContractAsync({
          address: CONTRACT_ADDRESSES.MOCK_USDC,
          abi: erc20Abi,
          functionName: 'approve',
          args: [CONTRACT_ADDRESSES.CREDIT_POOL, parsedAmount],
        });
        // Simplification: wait a bit to refetch
        setTimeout(() => refetchAllowance(), 4000);
        setTxState('idle');
        return;
      }

      setTxState('depositing');
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.CREDIT_POOL,
        abi: CreditPoolABI,
        functionName: 'deposit',
        args: [parsedAmount],
      });
      setTxState('success');
      setAmount('');
    } catch (error) {
      console.error(error);
      setTxState('idle');
    }
  };

  const tvl = totalAssets ? Number(formatUnits(totalAssets as bigint, 18)) : 0;
  const borrowed = totalBorrowed ? Number(formatUnits(totalBorrowed as bigint, 18)) : 0;
  const utilization = tvl > 0 ? ((borrowed / tvl) * 100).toFixed(1) : "0.0";
  
  const parsedAmount = amount ? parseUnits(amount, 18) : 0n;
  const currentAllowance = allowance ? (allowance as bigint) : 0n;
  const needsApproval = parsedAmount > 0n && currentAllowance < parsedAmount;
  const userBalance = usdcBalance ? (usdcBalance as bigint) : 0n;

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
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-bold">Deposit USDC</h3>
              {isConnected && (
                <div className="text-sm text-gray-500">
                  Balance: <span className="font-medium text-gray-900">{formatUnits(userBalance, 18)} USDC</span>
                </div>
              )}
            </div>
            
            {!isConnected ? (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">Please connect your wallet using the button in the top right to deposit into this pool.</p>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-4">
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

                {userBalance === 0n && parsedAmount > 0n && (
                  <div className="flex items-center gap-2 mb-2 text-amber-600 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Insufficient USDC balance. 
                    <button type="button" onClick={handleMint} className="underline ml-1 hover:text-amber-800">
                      Mint Test USDC
                    </button>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={txState !== 'idle' || !amount || (userBalance < parsedAmount && !needsApproval)}
                  className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {txState === 'approving' ? 'Approving USDC...' : 
                   txState === 'depositing' ? 'Depositing Funds...' : 
                   needsApproval ? 'Approve USDC' : 'Deposit Funds'}
                </button>
                
                {txState === 'success' && (
                  <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm font-medium text-center border border-green-200 mt-4">
                    Deposit successful! Shares minted.
                  </div>
                )}
              </form>
            )}

            {isConnected && userBalance === 0n && amount === '' && (
              <div className="mt-6 border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">Testing the protocol?</p>
                <button 
                  onClick={handleMint}
                  disabled={txState === 'minting'}
                  className="flex items-center justify-center gap-2 w-full border border-gray-300 bg-white text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Coins className="w-4 h-4" />
                  {txState === 'minting' ? 'Minting...' : 'Mint 10,000 Test USDC'}
                </button>
              </div>
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
