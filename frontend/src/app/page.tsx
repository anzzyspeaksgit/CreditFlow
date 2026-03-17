"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { ArrowRight, Shield, TrendingUp, Building2, Users, Lock, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0f0f2d] to-[#0a0a1a]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/20 via-purple-600/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 lg:px-12 py-5">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CreditFlow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pools" className="text-sm text-gray-400 hover:text-white transition-colors">
              Lending Pools
            </Link>
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/borrow" className="text-sm text-gray-400 hover:text-white transition-colors">
              For Borrowers
            </Link>
          </div>
          
          <ConnectButton />
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="px-6 lg:px-12 pt-20 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8"
              >
                <Lock className="w-4 h-4" />
                Institutional-Grade Security
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              >
                <span className="text-white">Private Credit</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  On-Chain
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed"
              >
                Access institutional-grade private credit opportunities. Earn sustainable yields 
                from verified real-world businesses while maintaining full transparency on-chain.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/pools"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                >
                  Start Lending
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/borrow"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
                >
                  Apply for Credit
                </Link>
              </motion.div>
            </div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {[
                { label: "Total Value Locked", value: "$12.4M" },
                { label: "Active Loans", value: "47" },
                { label: "Avg. APY", value: "8.2%" },
                { label: "Default Rate", value: "0.3%" },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 lg:px-12 py-24 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why CreditFlow?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Bridging traditional finance with DeFi efficiency
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Verified Borrowers",
                  description: "All borrowers undergo strict KYC/AML verification and financial auditing before accessing credit lines.",
                  color: "blue"
                },
                {
                  icon: TrendingUp,
                  title: "Sustainable Yields",
                  description: "Earn consistent returns from real-world business activities, decoupled from crypto market volatility.",
                  color: "purple"
                },
                {
                  icon: Users,
                  title: "Risk Tranches",
                  description: "Choose your risk profile with senior and junior tranches designed for different investment strategies.",
                  color: "indigo"
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 lg:px-12 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-white/10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to earn sustainable yields?</h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join institutional investors earning consistent returns from verified real-world credit opportunities.
              </p>
              <Link
                href="/pools"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Pools
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 CreditFlow. Built for RWA Demo Day.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Docs</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">GitHub</Link>
            <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
