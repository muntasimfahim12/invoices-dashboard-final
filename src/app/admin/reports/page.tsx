/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, TrendingDown, DollarSign, Download, Filter, 
  Calendar, ArrowUpRight, ArrowDownRight, CreditCard, 
  Banknote, Users, History, FileText, ChevronRight,
  PieChart as PieIcon, BarChart3, RefreshCcw, Zap
} from "lucide-react";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("This Month");

  return (
    <div className="min-h-screen bg-[#F8FAFF] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto pb-32 md:pb-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#4177BC]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC]">Financial Analysis</span>
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
            <button className="p-3.5 bg-white border border-slate-100 rounded-2xl text-[#4177BC] hover:bg-blue-50 transition-all shadow-sm">
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* SWIPEABLE STAT CARDS (Mobile Responsive) */}
        <div className="relative mb-12">
          {/* Scroll indicators for mobile */}
          <div className="md:hidden flex justify-end gap-1 mb-2 px-1">
             <div className="w-4 h-1 rounded-full bg-[#4177BC]" />
             <div className="w-1 h-1 rounded-full bg-slate-200" />
             <div className="w-1 h-1 rounded-full bg-slate-200" />
          </div>
          
          <div className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto pb-4 md:pb-0 no-scrollbar snap-x snap-mandatory">
            <StatCard title="Total Revenue" value="$42,500" trend="+12%" isUp icon={<DollarSign size={22}/>} />
            <StatCard title="Net Profit" value="$38,200" trend="+8%" isUp icon={<TrendingUp size={22}/>} />
            <StatCard title="Pending" value="$4,300" trend="-2%" isUp={false} icon={<History size={22}/>} />
            <StatCard title="Refunds" value="$1,100" trend="+0.5%" isUp={false} icon={<TrendingDown size={22}/>} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* REVENUE TREND CHART */}
          <section className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em] mb-1">Performance</h3>
                <p className="text-xl font-black text-slate-800 uppercase italic">Revenue Stream</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#4177BC]"/> <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Incoming</span></div>
              </div>
            </div>

            <div className="h-72 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {[50, 30, 80, 60, 40, 90, 100, 70, 40, 85, 95, 75].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                  <div className="w-full relative h-full flex items-end">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${val}%` }} 
                      className="w-full bg-blue-50 group-hover/bar:bg-[#4177BC] transition-all duration-500 rounded-t-xl relative"
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 group-hover/bar:scale-100 transition-all bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded-lg">
                        ${val}k
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-[8px] font-black text-slate-300 uppercase">M{i+1}</span>
                </div>
              ))}
            </div>
          </section>

          {/* PAYMENT STATUS RATIO */}
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em] mb-10">Status Ratio</h3>
              <div className="space-y-8">
                <StatusItem label="Completed" percentage={82} color="bg-[#4177BC]" />
                <StatusItem label="Pending" percentage={12} color="bg-amber-400" />
                <StatusItem label="Refunded" percentage={6} color="bg-rose-400" />
              </div>
            </div>

            <div className="mt-12 p-6 bg-blue-50/50 rounded-[30px] border border-blue-100/50">
              <div className="flex items-center gap-3 mb-3 text-[#4177BC]">
                <Zap size={18} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Suggestion</span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 italic leading-relaxed">
                Your collection rate improved by <span className="text-[#4177BC]">5.4%</span> this week. Keep focus on pending bank transfers.
              </p>
            </div>
          </section>
        </div>

        {/* CLIENT LEADERBOARD */}
        <section className="mt-8 bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/20 overflow-hidden">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#4177BC]" /> Top Contributing Clients
              </h3>
              <span className="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Sorted by Net Income</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Acme Corp", income: "$12,400", change: "+12%" },
                { name: "Design Co", income: "$8,150", change: "+5%" },
                { name: "Webflow", income: "$5,200", change: "+18%" },
                { name: "SpaceX", income: "$4,900", change: "+2%" },
              ].map((client, i) => (
                <div key={i} className="p-6 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-[30px] border border-transparent hover:border-slate-100 transition-all group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[12px] font-black text-[#4177BC]">{client.name[0]}</div>
                      <span className="text-[9px] font-black text-emerald-500">{client.change}</span>
                   </div>
                   <h5 className="text-xs font-black text-slate-700 uppercase italic mb-1">{client.name}</h5>
                   <p className="text-lg font-black text-slate-900 tracking-tighter">{client.income}</p>
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
    <motion.div 
      whileHover={{ y: -8 }}
      className="min-w-[280px] md:min-w-0 snap-center bg-white p-7 rounded-[35px] border border-slate-100 shadow-xl shadow-slate-200/30 relative overflow-hidden group transition-all"
    >
      <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#4177BC] opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700" />
      <div className="flex justify-between items-start mb-6">
        <div className="p-3.5 rounded-2xl bg-blue-50 text-[#4177BC]">
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isUp ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{title}</p>
      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
    </motion.div>
  );
}

function StatusItem({ label, percentage, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-700 uppercase italic tracking-widest">{label}</span>
        <span className="text-xs font-black text-slate-900">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
}