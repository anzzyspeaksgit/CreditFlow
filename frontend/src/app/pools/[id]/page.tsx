"use client";

import React, { useState } from 'react';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits, erc20Abi } from 'viem';
import CreditPoolABI from '../../../abis/CreditPool.json';
import { CONTRACT_ADDRESSES } from '../../../config/contracts';
import { ShieldCheck, TrendingUp, AlertCircle, BarChart3, Coins, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
      await writeContractAsync({
        address: CONTRACT_ADDRESSES.MOCK_USDC,
        abi: mockUsdcAbi,
        functionName: 'mint',
        args: [address, parseUnits("10000", 18)],
      });
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-6 py-12"
    >
      <div className="glass-card rounded-3xl overflow-hidden mb-8 shadow-2xl">
        <div className="p-8 md:p-10 border-b border-white/10 bg-white/[0.02]">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div>
              <span className="px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-bold uppercase tracking-widest mb-4 inline-block">Senior Tranche</span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">SME Invoice Factoring</h1>
              <p className="text-slate-400 flex items-center gap-2">
                Borrower: <span className="text-white font-medium">InvoiceX Global</span>
                <a href="#" className="text-slate-500 hover:text-purple-400 transition-colors"><ExternalLink className="w-4 h-4" /></a>
              </p>
            </div>
            <div className="md:text-right p-6 rounded-2xl bg-white/5 border border-white/10 shrink-0 min-w-[200px]">
              <div className="text-sm text-slate-400 font-medium mb-1 uppercase tracking-wider">Fixed APY</div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">12.5%</div>
            </div>
          </div>
          
          <p className="text-slate-300 mt-2 max-w-3xl leading-relaxed text-lg font-light">
            This pool provides short-term working capital to verified SMEs by factoring their outstanding invoices.
            All invoices are fully insured and cryptographically verified by our oracle network before funding.
          </p>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="p-8 md:p-10 border-r border-white/10 bg-black/20">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-bold text-white">Deposit USDC</h3>
              {isConnected && (
                <div className="text-sm text-slate-400 font-medium">
                  Balance: <span className="text-white">{formatUnits(userBalance, 18)}</span>
                </div>
              )}
            </div>
            
            {!isConnected ? (
              <div className="bg-purple-500/10 border border-purple-500/20 text-purple-200 p-5 rounded-2xl flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 shrink-0 text-purple-400" />
                <p className="text-sm leading-relaxed">Please connect your wallet using the button in the top right to provide liquidity to this pool.</p>
              </div>
            ) : (
              <form onSubmit={handleAction} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Amount</label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-white text-xl transition-all group-hover:bg-white/10"
                    />
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold tracking-wider">USDC</span>
                    </div>
                  </div>
                </div>

                {userBalance === 0n && parsedAmount > 0n && (
                  <div className="flex items-center gap-2 mb-2 text-yellow-400 text-sm font-medium bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                    <AlertCircle className="w-4 h-4" />
                    Insufficient USDC. 
                    <button type="button" onClick={handleMint} className="underline hover:text-yellow-300 ml-1">
                      Mint Test USDC
                    </button>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={txState !== 'idle' || !amount || (userBalance < parsedAmount && !needsApproval)}
                  className="w-full premium-button text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {txState === 'approving' ? 'Approving USDC...' : 
                   txState === 'depositing' ? 'Depositing Funds...' : 
                   needsApproval ? 'Approve USDC' : 'Deposit Funds'}
                </button>
                
                {txState === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/10 text-green-400 p-4 rounded-xl text-sm font-bold text-center border border-green-500/20"
                  >
                    Deposit successful! Shares minted to your wallet.
                  </motion.div>
                )}
              </form>
            )}

            {isConnected && userBalance === 0n && amount === '' && (
              <div className="mt-8 border-t border-white/10 pt-8 text-center">
                <p className="text-sm text-slate-400 mb-4">Testing the protocol on testnet?</p>
                <button 
                  onClick={handleMint}
                  disabled={txState === 'minting'}
                  className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 group"
                >
                  <Coins className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  {txState === 'minting' ? 'Minting...' : 'Mint 10,000 Test USDC'}
                </button>
              </div>
            )}
          </div>
          
          <div className="p-8 md:p-10">
            <h3 className="text-2xl font-bold text-white mb-8">Pool Analytics</h3>
            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold text-white text-lg">Capital Utilization</h4>
                    <span className="text-purple-400 font-bold">{utilization}%</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 border border-white/10 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full relative" style={{ width: `${utilization}%` }}>
                      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    High utilization indicates active borrowing and consistent yield generation for lenders.
                  </p>
                </div>
              </div>
              
              <div className="w-full h-px bg-white/10" />

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Capital Protection</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">The Senior tranche is protected by a 20% first-loss capital buffer deposited directly by the borrower.</p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/30">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Real-World Yield</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Interest is generated directly from physical business operations, completely decoupled from crypto volatility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
