"use client";

import React, { useState } from 'react';
import { ShieldCheck, UserCheck, AlertTriangle, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [approving, setApproving] = useState<string | null>(null);

  const borrowers = [
    { id: '1', name: 'InvoiceX Global', reg: 'UK-928374', limit: '$1,250,000', status: 'Approved' },
    { id: '2', name: 'PropFrac Capital', reg: 'US-102938', limit: '$800,000', status: 'Approved' },
    { id: '3', name: 'Acme Corp', reg: 'SG-882233', limit: '$500,000', status: 'Pending Review' },
  ];

  const handleApprove = (id: string) => {
    setApproving(id);
    setTimeout(() => {
      setApproving(null);
    }, 2000);
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
          <p className="text-3xl font-bold">2</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Pending Applications</h3>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">1</p>
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
                      onClick={() => handleApprove(b.id)}
                      disabled={approving === b.id}
                      className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      {approving === b.id ? 'Approving...' : 'Approve Borrower'}
                    </button>
                  ) : (
                    <button className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 text-red-600 hover:text-red-700">
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
