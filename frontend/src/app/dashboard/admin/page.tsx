"use client";

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Users } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import CreditPoolABI from '../../../abis/CreditPool.json';
import { CONTRACT_ADDRESSES } from '../../../config/contracts';

export default function AdminDashboard() {
  const { address } = useAccount();
  const [approving, setApproving] = useState<string | null>(null);
  
  // Real implementation: We'd likely have a backend or subgraph feeding us the list of borrowers.
  // For the hackathon demo, we hardcode the list and tie the actions to on-chain calls.
  // We'll allow the admin to approve the "Acme Corp" dummy borrower.
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
      
      // Optimistically update UI
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
      
      // Optimistically update UI
      setBorrowers(prev => prev.map(b => b.id === id ? { ...b, status: 'Pending Review' } : b));
      setApproving(null);
    } catch (error) {
      console.error(error);
      setApproving(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Risk & Admin Dashboard</h1>
          <p className="text-gray-500">Manage KYC, borrowers, and global risk metrics.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Verified Borrowers</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {borrowers.filter(b => b.status === 'Approved').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Pending Applications</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">
            {borrowers.filter(b => b.status === 'Pending Review').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Global Risk Alerts</h3>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Borrower Management (KYC)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Company</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Registration</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Credit Limit</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {borrowers.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{b.name}</td>
                <td className="px-6 py-4 text-gray-600">{b.reg}</td>
                <td className="px-6 py-4 font-medium">{b.limit}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    b.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {b.status === 'Pending Review' ? (
                    <button 
                      onClick={() => handleApprove(b.id, b.address)}
                      disabled={approving === b.id}
                      className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      {approving === b.id ? 'Confirming in Wallet...' : 'Approve Borrower'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRevoke(b.id, b.address)}
                      disabled={approving === b.id}
                      className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      {approving === b.id ? 'Processing...' : 'Revoke'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center text-sm text-gray-500">
        <p>Note: In a production environment, this dashboard is heavily restricted via OpenZeppelin's `AccessControl` and `Ownable` contracts.</p>
      </div>
    </div>
  );
}
