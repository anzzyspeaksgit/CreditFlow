"use client";

import React from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import CreditPoolABI from '../../abis/CreditPool.json';
import { CONTRACT_ADDRESSES } from '../../config/contracts';

export function WithdrawButton({ shares, disabled }: { shares: bigint, disabled: boolean }) {
  const { data: hash, writeContract, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const handleWithdraw = () => {
    writeContract({
      address: CONTRACT_ADDRESSES.CREDIT_POOL,
      abi: CreditPoolABI,
      functionName: 'withdraw',
      args: [shares],
    });
  };

  if (isConfirmed) {
    return <span className="text-sm font-semibold text-green-400 mr-2">Withdrawn!</span>;
  }

  return (
    <button 
      onClick={handleWithdraw}
      disabled={disabled || isPending || isConfirming || shares === 0n}
      className="text-sm font-semibold border border-red-500/30 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors mr-2 disabled:opacity-50"
    >
      {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Withdraw All'}
    </button>
  );
}
