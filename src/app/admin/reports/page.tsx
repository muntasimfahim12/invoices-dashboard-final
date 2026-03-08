/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, DollarSign, History, Zap, Search, 
  FileSpreadsheet, Activity, ArrowRight, ShieldCheck
} from "lucide-react";

// API URL Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("Year");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const storedEmail = localStorage.getItem("user_email");
      const storedRole = localStorage.getItem("user_role") || "admin";

      // আপনার আগের backend লজিক অনুযায়ী API কল
      const response = await axios.get(`${API_URL}/invoices`, {
        params: { email: storedEmail, role: storedRole }
      });

      const data = Array.isArray(response.data) ? response.data : 
                   (response.data?.invoices || []);
      
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- CSV Export ---
  const exportData = () => {
    const headers = ["Invoice ID,Client,Date,Amount,Status\n"];
    const rows = filteredData.map(inv => 
      `${inv.invoiceId},${inv.clientName || 'N/A'},${new Date(inv.createdAt).toLocaleDateString()},${inv.grandTotal || inv.amount},${inv.status}`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Report_${timeRange}.csv`;
    a.click();
  };

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    const now = new Date();
    return invoices.filter(inv => {
      const invDate = new Date(inv.createdAt || inv.date);
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch = (inv.clientName?.toLowerCase().includes(searchStr)) || 
                           (inv.invoiceId?.toLowerCase().includes(searchStr));
      
      let matchesTime = true;
      if (timeRange === "Today") matchesTime = invDate.toDateString() === now.toDateString();
      if (timeRange === "Month") matchesTime = invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
      
      return matchesSearch && matchesTime;
    });
  }, [invoices, timeRange, searchTerm]);

  // --- Stats Calculation (Fixing NaN) ---
  const stats = useMemo(() => {
    let gross = 0;
    let collected = 0;
    const monthlyData = Array(12).fill(0);

    filteredData.forEach(inv => {
      // হ্যান্ডেলিং grandTotal অথবা amount (আপনার ডিবি অনুযায়ী)
      const val = Number(inv.grandTotal) || Number(inv.amount) || 0;
      gross += val;

      if (inv.status?.toLowerCase() === "paid") {
        collected += val;
      }

      const date = new Date(inv.createdAt || inv.date);
      if (!isNaN(date.getTime())) {
        monthlyData[date.getMonth()] += val;
      }
    });

    const efficiency = gross > 0 ? Math.round((collected / gross) * 100) : 0;

    return { gross, collected, pending: gross - collected, efficiency, monthlyData };
  }, [filteredData]);

  if (loading) return <ReportSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans text-[#0F172A]">
      <main className="max-w-[1400px] mx-auto px-6 mt-12">
        
        {/* --- Hero Section --- */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4177BC]/5 rounded-full mb-6 border border-[#4177BC]/10">
              <span className="w-2 h-2 bg-[#4177BC] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] inter-bold">Global Reports</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-8 judson-bold">
              Business
              <span className="text-slate-300"> Intelligence.</span>
            </h1>
            <p className="max-w-md text-slate-500 text-lg font-medium leading-relaxed inter-medium">
              Real-time monitoring of your capital flow and collection efficiency.
            </p>
          </motion.div>

          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC]" size={20} />
              <input 
                type="text" 
                placeholder="Search Client or Invoice ID..." 
                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-[25px] text-md focus:ring-4 focus:ring-[#4177BC]/5 transition-all outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                {["Today", "Month", "Year"].map((r) => (
                  <button key={r} onClick={() => setTimeRange(r)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === r ? "bg-white shadow-md text-[#4177BC]" : "text-slate-400"}`}>{r}</button>
                ))}
              </div>
              <button onClick={exportData} className="flex-1 flex items-center justify-center gap-3 py-4 bg-[#0F172A] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-[#4177BC] transition-all">
                <FileSpreadsheet size={16} /> Export CSV
              </button>
            </div>
          </div>
        </section>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ReportStatCard title="Gross Capital" value={`$${stats.gross.toLocaleString()}`} icon={<DollarSign />} color="#4177BC" />
          <ReportStatCard title="Net Collected" value={`$${stats.collected.toLocaleString()}`} icon={<ShieldCheck />} color="#10B981" />
          <ReportStatCard title="Outstanding" value={`$${stats.pending.toLocaleString()}`} icon={<History />} color="#EB9C2C" />
          <ReportStatCard title="Efficiency" value={`${stats.efficiency}%`} icon={<Activity />} color="#6366F1" />
        </div>

        {/* --- Analytics & Health --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[45px] p-10 shadow-sm overflow-hidden group">
             <div className="flex justify-between items-end mb-12">
                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC] mb-2">Portfolio Momentum</h3>
                   <p className="judson-bold text-3xl italic text-[#0F172A]">Revenue Velocity</p>
                </div>
             </div>

             <div className="h-64 w-full flex items-end justify-between gap-3">
                {stats.monthlyData.map((val, i) => {
                   const max = Math.max(...stats.monthlyData) || 1;
                   const height = (val / max) * 100;
                   return (
                      <div key={i} className="flex-1 h-full flex flex-col items-center group/bar relative">
                         <motion.div 
                            initial={{ height: 0 }} animate={{ height: `${height}%` }}
                            transition={{ duration: 1 }}
                            className="w-full max-w-[12px] bg-slate-50 group-hover/bar:bg-[#4177BC] rounded-t-full transition-all"
                         />
                         <span className="mt-4 text-[8px] font-black text-slate-300 uppercase">
                            {new Date(0, i).toLocaleString('en', { month: 'short' })}
                         </span>
                      </div>
                   )
                })}
             </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0F172A] p-10 rounded-[40px] text-white">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC] mb-8">Asset Integrity</h3>
               <div className="space-y-6">
                  <HealthBar label="Collection Ratio" percent={stats.efficiency} color="#4177BC" />
                  <HealthBar label="System Health" percent={98} color="#10B981" />
               </div>
               <p className="mt-10 text-[11px] text-slate-400 italic leading-relaxed">
                 Analytics based on current fiscal data cycle.
               </p>
            </div>

            <button className="w-full group flex items-center justify-between p-6 bg-slate-50 rounded-[30px] hover:bg-white border border-transparent hover:border-slate-100 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#4177BC] shadow-sm">
                     <Zap size={20} />
                  </div>
                  <div className="text-left">
                     <p className="text-md font-bold text-[#0F172A] judson-bold">Sync Ledger</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Audit</p>
                  </div>
               </div>
               <ArrowRight className="text-slate-300 group-hover:text-[#4177BC] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* --- Transaction Ledger Table --- */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold tracking-tighter text-[#0F172A] judson-bold mb-8">Audit Ledger</h2>
          <div className="overflow-hidden rounded-[35px] border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Entity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Timestamp</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400">Net Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.length > 0 ? filteredData.slice(0, 10).map((inv, idx) => (
                  <tr key={idx} className="group hover:bg-slate-50/40 transition-all">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[#4177BC] font-black text-xs">
                          {inv.clientName?.[0] || "C"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">{inv.clientName || "Private Client"}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold">{inv.invoiceId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500">
                      {new Date(inv.createdAt || inv.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-[#0F172A]">
                      ${(Number(inv.grandTotal) || Number(inv.amount) || 0).toLocaleString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`text-[9px] px-3 py-1.5 rounded-lg font-black uppercase ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {inv.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 text-sm">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Judson:wght@400;700&family=Inter:wght@400;500;700;800&display=swap');
        .judson-bold { font-family: 'Judson', serif; }
        .inter-bold { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}

// --- Helper Components ---

function ReportStatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${color}10`, color }}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{title}</p>
      <h2 className="text-2xl font-black text-[#0F172A] tracking-tighter">{value}</h2>
    </div>
  );
}

function HealthBar({ label, percent, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase text-slate-400">{label}</span>
        <span className="text-xs font-black" style={{ color }}>{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="min-h-screen bg-white p-12 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Intelligence...</p>
    </div>
  );
}