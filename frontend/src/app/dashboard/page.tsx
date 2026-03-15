import React from 'react';
import { DollarSign, Percent, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lender Dashboard</h1>
        <p className="text-gray-500">Track your private credit investments and yields.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Supplied</h3>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">$125,000.00</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Interest Earned</h3>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">+$4,250.50</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Active Positions</h3>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">2 Pools</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Your Positions</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Pool</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Supplied</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Earned</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Current APY</th>
              <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">SME Invoice Factoring</div>
                <div className="text-sm text-gray-500">InvoiceX Global</div>
              </td>
              <td className="px-6 py-4 font-medium">$75,000.00</td>
              <td className="px-6 py-4 font-medium text-green-600">+$2,800.25</td>
              <td className="px-6 py-4">12.5%</td>
              <td className="px-6 py-4 text-right">
                <button className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 mr-2">
                  Withdraw
                </button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-900">Real Estate Bridge</div>
                <div className="text-sm text-gray-500">PropFrac Capital</div>
              </td>
              <td className="px-6 py-4 font-medium">$50,000.00</td>
              <td className="px-6 py-4 font-medium text-green-600">+$1,450.25</td>
              <td className="px-6 py-4">18.0%</td>
              <td className="px-6 py-4 text-right">
                <button className="text-sm font-semibold border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 mr-2">
                  Withdraw
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
