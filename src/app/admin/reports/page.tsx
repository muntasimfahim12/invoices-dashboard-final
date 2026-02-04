/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, DollarSign, Download, History, Zap,
  FileText, Calendar, Filter, ArrowUpRight, ChevronRight,
  Activity, Globe, Search, MoreHorizontal
} from "lucide-react";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("Year"); // Today, Month, Year

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const storedEmail = localStorage.getItem("user_email");
        const storedRole = localStorage.getItem("user_role") || "admin";

        const response = await axios.get(`${API_URL}/invoices`, {
          params: { email: storedEmail, role: storedRole }
        });
        setInvoices(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [API_URL]);

  // --- ডায়নামিক ফিল্টারিং ও ক্যালকুলেশন ---
  const filteredData = useMemo(() => {
    const now = new Date();
    return invoices.filter(inv => {
      const invDate = new Date(inv.createdAt);
      if (timeRange === "Today") return invDate.toDateString() === now.toDateString();
      if (timeRange === "Month") return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
      return true; // Year
    });
  }, [invoices, timeRange]);

  const stats = useMemo(() => {
    let tr = 0, tc = 0;
    const md = Array(12).fill(0);
    const sc = { paid: 0, pending: 0, partial: 0 };

    filteredData.forEach((inv) => {
      const rev = Number(inv.grandTotal || 0);
      const rec = Number(inv.receivedAmount || 0);
      tr += rev; tc += rec;

      const date = new Date(inv.createdAt);
      if (!isNaN(date.getTime())) md[date.getMonth()] += rec;

      const s = inv.status?.toLowerCase();
      if (s === "paid") sc.paid++;
      else if (s === "pending" || s === "unpaid") sc.pending++;
      else sc.partial++;
    });

    return {
      totalRev: tr,
      totalRec: tc,
      pending: tr - tc,
      monthlyData: md,
      statusCounts: sc,
      count: filteredData.length
    };
  }, [filteredData]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 inter-medium pb-20">
       <main className="max-w-7xl mx-auto p-4 md:p-10 space-y-8">

        {/* Dynamic Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl judson-bold text-slate-900 italic">Financial Summary</h1>
            <p className="text-slate-400 text-sm inter-medium flex items-center gap-2">
              <Calendar size={14} className="text-[#4177BC]" /> Viewing metrics for <span className="text-slate-900 font-bold">{timeRange}</span>
            </p>
          </div>

          <div className="flex bg-blue-50/50 border border-blue-100 p-1.5 rounded-2xl w-full lg:w-fit overflow-x-auto">
            {["Today", "Month", "Year"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`flex-1 lg:flex-none px-8 py-2.5 rounded-xl text-[10px] inter-bold uppercase tracking-widest transition-all ${timeRange === r ? "bg-white shadow-md text-[#4177BC]" : "text-slate-400 hover:text-slate-600"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatBox title="Revenue" value={stats.totalRev} icon={<DollarSign />} color="blue" trend="+12.5%" />
          <StatBox title="Collected" value={stats.totalRec} icon={<TrendingUp />} color="emerald" trend="+8.2%" />
          <StatBox title="Pending" value={stats.pending} icon={<History />} color="rose" trend="-2.1%" />
          <StatBox title="Invoices" value={stats.count} icon={<FileText />} color="slate" trend="Live" isCurrency={false} />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- Ultra Modern Revenue Graph --- */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[3rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            {/* Background Decorative Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] -mr-32 -mt-32" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4177BC] animate-pulse" />
                  <h3 className="inter-bold text-[10px] uppercase tracking-[0.3em] text-[#4177BC]">Financial Flow</h3>
                </div>
                <p className="judson-bold text-3xl italic text-slate-900 tracking-tight">Revenue Analytics</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] inter-bold text-slate-400 uppercase tracking-widest">Peak Revenue</span>
                  <span className="text-sm font-black text-slate-900">${(Math.max(...stats.monthlyData) / 1000).toFixed(1)}k</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#4177BC] hover:text-white transition-all cursor-pointer">
                  <Activity size={18} />
                </div>
              </div>
            </div>

            {/* The Graph Canvas */}
            <div className="h-72 w-full relative flex items-end justify-between px-2 gap-1">
              {/* Grid Lines (Background) */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-50/80" />
                ))}
              </div>

              {stats.monthlyData.map((val, i) => {
                const height = (val / (Math.max(...stats.monthlyData) || 1)) * 100;
                return (
                  <div key={i} className="flex-1 h-full flex flex-col items-center group relative z-10">
                    <div className="w-full h-full flex items-end justify-center relative">

                      {/* Visual Line (Connecting Dot Look) */}
                      <div className="absolute bottom-0 w-px h-full bg-linear-to-t from-blue-100/50 to-transparent group-hover:from-[#4177BC]/20 transition-all" />

                      {/* Main Bar / Interactive Element */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: `${height}%`, opacity: 1 }}
                        transition={{ duration: 1.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-3 md:max-w-5 bg-slate-100/50 group-hover:bg-[#4177BC] rounded-full transition-all duration-500 relative"
                      >
                        {/* Glowing Dot at Top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-white border-2 md:border-[3px] border-[#4177BC] rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100" />
                      </motion.div>

                      {/* Modern Floating Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-top-14 transition-all duration-300 pointer-events-none">
                        <div className="bg-slate-900 text-white text-[10px] inter-bold py-2 px-3 rounded-xl shadow-2xl flex flex-col items-center gap-1">
                          <span className="text-blue-300 text-[8px] uppercase tracking-tighter">Collection</span>
                          ${val.toLocaleString()}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                        </div>
                      </div>
                    </div>

                    {/* X-Axis Labels */}
                    <span className="mt-6 text-[9px] inter-bold text-slate-300 group-hover:text-[#4177BC] transition-colors uppercase tracking-tighter">
                      {new Date(0, i).toLocaleString('en', { month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Info Bar */}
            <div className="mt-12 pt-8 border-t border-slate-50 flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4177BC]" />
                <span className="text-[10px] inter-bold text-slate-500 uppercase tracking-widest">Revenue Collected</span>
              </div>
              <div className="flex items-center gap-3 opacity-30">
                <div className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="text-[10px] inter-bold text-slate-500 uppercase tracking-widest">Projected Growth</span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Breakdown */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm h-full flex flex-col">
              <h3 className="inter-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-10 text-center">Invoicing Health</h3>

              <div className="flex-1 space-y-10">
                <ProgressItem label="Settled" count={stats.statusCounts.paid} total={stats.count} color="bg-emerald-500" />
                <ProgressItem label="Unpaid/Pending" count={stats.statusCounts.pending} total={stats.count} color="bg-[#4177BC]" />
                <ProgressItem label="Partial/Overdue" count={stats.statusCounts.partial} total={stats.count} color="bg-rose-400" />
              </div>

              <div className="mt-10 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 group hover:bg-[#4177BC] transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-400 transition-colors">
                    <Zap size={14} className="text-[#4177BC] group-hover:text-white" fill="currentColor" />
                  </div>
                  <span className="text-[10px] inter-bold uppercase text-[#4177BC] group-hover:text-white tracking-widest">Efficiency Tip</span>
                </div>
                <p className="text-[11px] text-slate-500 group-hover:text-white/80 judson-regular-italic leading-relaxed">
                  You have <span className="font-bold underline">${stats.pending.toLocaleString()}</span> in outstanding dues. Send automated reminders to improve cashflow.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Table Look */}
        <section className="bg-white border border-slate-100 rounded-[2.5rem] p-6 md:p-10 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="judson-bold text-xl italic text-slate-800">Recent Transactions</h3>
            <button className="text-[10px] inter-bold text-[#4177BC] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] inter-bold text-slate-400 uppercase tracking-widest">Entity</th>
                  <th className="pb-4 text-[10px] inter-bold text-slate-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
                  <th className="pb-4 text-[10px] inter-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="pb-4 text-[10px] inter-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.slice(0, 5).map((inv, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-50 text-[#4177BC] rounded-xl flex items-center justify-center text-xs font-black">
                          {inv.clientName?.[0] || 'C'}
                        </div>
                        <span className="text-xs font-bold text-slate-700">{inv.clientName || 'Private Client'}</span>
                      </div>
                    </td>
                    <td className="py-5 text-xs text-slate-400 hidden sm:table-cell">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-5 text-xs font-black text-slate-900">
                      ${Number(inv.grandTotal).toLocaleString()}
                    </td>
                    <td className="py-5 text-right">
                      <span className={`text-[9px] px-3 py-1 rounded-full inter-bold uppercase tracking-widest ${inv.status?.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

// --- Dynamic Helper Components ---

function StatBox({ title, value, icon, color, trend, isCurrency = true }: any) {
  const colorSchemes: any = {
    blue: "bg-blue-50 text-blue-600 shadow-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
    rose: "bg-rose-50 text-rose-600 shadow-rose-100",
    slate: "bg-slate-100 text-slate-600 shadow-slate-100"
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white border border-slate-100 p-7 rounded-[2.5rem] shadow-sm relative overflow-hidden transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:rotate-12 ${colorSchemes[color]}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <p className="text-[9px] inter-bold uppercase tracking-[0.25em] text-slate-400 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isCurrency ? `$${Number(value).toLocaleString()}` : value}
        </h2>
        <span className={`text-[9px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
}

function ProgressItem({ label, count, total, color }: any) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end px-1">
        <span className="text-[10px] inter-bold uppercase text-slate-700 tracking-wider">{label}</span>
        <span className="text-xs font-black text-slate-900">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${color} rounded-full shadow-lg shadow-current/20`}
        />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8FAFF] gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-[3px] border-slate-100 rounded-full" />
        <div className="w-16 h-16 border-[3px] border-t-[#4177BC] rounded-full animate-spin absolute top-0" />
      </div>
      <p className="text-[10px] inter-bold uppercase tracking-[0.5em] text-slate-900 animate-pulse">Syncing Intelligence</p>
    </div>
  );
}