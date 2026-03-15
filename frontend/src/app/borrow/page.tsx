"use client";

import React, { useState } from 'react';
import { Briefcase, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BorrowPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
    }, 2000);
  };

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
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
