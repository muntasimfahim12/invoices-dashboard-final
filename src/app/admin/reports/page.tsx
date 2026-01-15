/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, DollarSign, Download, 
  ArrowUpRight, ArrowDownRight, History, Zap
} from "lucide-react";

export default function ReportsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("Year");

  // API URL from .env
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${API_URL}/invoices`);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [API_URL]);

  // ক্যালকুলেশন লজিক
  const stats = useMemo(() => {
    if (!invoices.length) return { totalRev: 0, totalRec: 0, pending: 0, monthlyData: Array(12).fill(0), statusCounts: { paid: 0, pending: 0, partial: 0 } };

    let totalRev = 0;
    let totalRec = 0;
    const monthlyData = Array(12).fill(0);
    const statusCounts = { paid: 0, pending: 0, partial: 0 };

    invoices.forEach((inv) => {
      const revenue = Number(inv.grandTotal || 0);
      const received = Number(inv.receivedAmount || 0);
      
      totalRev += revenue;
      totalRec += received;

      // চার্টের জন্য মাস ভিত্তিক ডাটা
      const date = new Date(inv.createdAt);
      if (!isNaN(date.getTime())) {
        monthlyData[date.getMonth()] += received;
      }

      // স্ট্যাটাস রেশিও
      if (inv.status?.toLowerCase() === "paid") statusCounts.paid++;
      else if (inv.status?.toLowerCase() === "pending") statusCounts.pending++;
      else statusCounts.partial++;
    });

    return { totalRev, totalRec, pending: totalRev - totalRec, monthlyData, statusCounts };
  }, [invoices]);

  // টপ ক্লায়েন্ট ক্যালকুলেশন
  const topClients = useMemo(() => {
    const groups: any = {};
    invoices.forEach(inv => {
      const name = inv.clientName || inv.client?.name || "Unknown Client";
      groups[name] = (groups[name] || 0) + Number(inv.receivedAmount || 0);
    });

    return Object.entries(groups)
      .map(([name, income]: any) => ({ name, income }))
      .sort((a, b) => b.income - a.income)
      .slice(0, 4);
  }, [invoices]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-[#4177BC] border-slate-200 rounded-full animate-spin" />
          <p className="font-black italic text-slate-400 uppercase tracking-widest text-xs">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto pb-32 md:pb-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#4177BC]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC]">Real-time Insights</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter italic uppercase leading-none">
              Invo<span className="text-[#4177BC]">ly</span> Analytics
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
              {["Today", "7D", "Month", "Year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                    timeRange === range ? "bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/30" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <StatCard title="Total Revenue" value={`$${stats.totalRev.toLocaleString()}`} trend="+12%" isUp icon={<DollarSign size={22}/>} />
          <StatCard title="Net Collected" value={`$${stats.totalRec.toLocaleString()}`} trend="+8%" isUp icon={<TrendingUp size={22}/>} />
          <StatCard title="Total Pending" value={`$${stats.pending.toLocaleString()}`} trend="-2%" isUp={false} icon={<History size={22}/>} />
          <StatCard title="Invoices" value={invoices.length.toString()} trend="+5%" isUp icon={<FileText size={22}/>} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* REVENUE TREND CHART */}
          <section className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em] mb-1">Performance</h3>
                <p className="text-xl font-black text-slate-800 uppercase italic">Monthly Collections</p>
              </div>
            </div>

            <div className="h-72 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {stats.monthlyData.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="w-full relative h-full flex items-end">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(val / (Math.max(...stats.monthlyData) || 1)) * 100}%` }} 
                      className="w-full bg-blue-50 group-hover/bar:bg-[#4177BC] transition-all duration-500 rounded-t-xl relative"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover/bar:scale-100 transition-all bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded-lg">
                        ${(val/1000).toFixed(1)}k
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase">
                    {new Date(0, i).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* STATUS RATIO */}
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em] mb-10">Invoice Status</h3>
              <div className="space-y-8">
                <StatusItem label="Paid" count={stats.statusCounts.paid} total={invoices.length} color="bg-[#4177BC]" />
                <StatusItem label="Pending" count={stats.statusCounts.pending} total={invoices.length} color="bg-amber-400" />
                <StatusItem label="Partial" count={stats.statusCounts.partial} total={invoices.length} color="bg-rose-400" />
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50/50 rounded-[30px] border border-blue-100/50">
              <div className="flex items-center gap-3 mb-3 text-[#4177BC]">
                <Zap size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">Growth Tip</span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed">
                {stats.pending > stats.totalRec ? "Warning: Your pending dues are high. Send reminders!" : "Great! Your collection rate is healthy this season."}
              </p>
            </div>
          </section>
        </div>

        {/* TOP CLIENTS */}
        <section className="mt-8 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/20">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em]">Top Contributing Clients</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {topClients.map((client: any, i) => (
               <div key={i} className="p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl rounded-[30px] transition-all group border border-transparent hover:border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[12px] font-black text-[#4177BC]">{client.name[0]}</div>
                    <span className="text-[9px] font-black text-emerald-500">+LIVE</span>
                  </div>
                  <h5 className="text-xs font-black text-slate-700 uppercase italic mb-1 truncate">{client.name}</h5>
                  <p className="text-lg font-black text-slate-900 tracking-tighter">${client.income.toLocaleString()}</p>
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

function StatCard({ title, value, trend, isUp, icon }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-7 rounded-[35px] border border-slate-100 shadow-xl shadow-slate-200/30 relative group transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 rounded-2xl bg-blue-50 text-[#4177BC]">{icon}</div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{title}</p>
      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
    </motion.div>
  );
}

function StatusItem({ label, count, total, color }: any) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-700 uppercase italic tracking-widest">{label}</span>
        <span className="text-xs font-black text-slate-900">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1 }} className={`h-full ${color} rounded-full`} />
      </div>
    </div>
  );
}

function FileText(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
}