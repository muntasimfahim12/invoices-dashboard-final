/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Briefcase, 
    Wallet, 
    Clock, 
    AlertCircle, 
    TrendingUp,
    CheckCircle2,
    ArrowUpRight,
    Target,
    Zap
} from "lucide-react";

// --- DYNAMIC PROGRESS STAT CARD ---
function StatCard({ title, value, icon, subtitle, colorClass, percent }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                {icon}
            </div>
            
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${colorClass} shadow-inner`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Real-time</span>
                    {percent && <p className="text-emerald-500 text-xs font-bold">+{percent}%</p>}
                </div>
            </div>

            <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-4xl font-[1000] text-slate-900 tracking-tighter italic leading-none">{value}</h3>
                <div className="flex items-center gap-2 mt-4">
                    <div className="h-1.5 flex-1 bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "70%" }}
                            className={`h-full ${colorClass.split(' ')[1].replace('text-', 'bg-')}`}
                        />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400">{subtitle}</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function ClientOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const response = await axios.get(`${API_BASE}/clinets`);
                const myProfile = response.data[response.data.length - 1];
                if (myProfile) setData(myProfile); else setError(true);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchOverviewData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#4177BC]/20 border-t-[#4177BC] rounded-full animate-spin" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Core...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-10 bg-red-50 rounded-[2rem] text-red-500 font-bold flex items-center gap-3 border border-red-100 mt-10">
            <AlertCircle /> Error establishing connection with the server.
        </div>
    );

    // Dynamic Calculations
    const activeProjects = data.projects || [];
    const totalPaid = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.paidAmount) || 0), 0);
    const totalBudget = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.budget) || 0), 0);
    const totalDue = totalBudget - totalPaid;
    const paymentProgress = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0;

    return (
        // CONTANER WITH PADDING FOR SIDEBAR (RESPONSIVE)
        <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
            
            {/* --- TOP HEADER AREA --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-50 text-[#4177BC] text-[10px] font-black rounded-full uppercase tracking-tighter">Verified Client</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 uppercase italic leading-none">
                        Pulse<span className="text-[#4177BC]">Control</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-3 italic">Welcome, {data.name}. Manage your assets and project velocity.</p>
                </motion.div>

                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#4177BC] transition-all flex items-center gap-2">
                        <Zap size={14} fill="currentColor" /> Quick Action
                    </button>
                </div>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Active Ventures" 
                    value={activeProjects.length} 
                    icon={<Briefcase />} 
                    subtitle="Live Cycles"
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatCard 
                    title="Liquidity Paid" 
                    value={`$${totalPaid.toLocaleString()}`} 
                    icon={<CheckCircle2 />} 
                    subtitle={`${paymentProgress}% Invoiced`}
                    percent={paymentProgress}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard 
                    title="Pending Due" 
                    value={`$${totalDue.toLocaleString()}`} 
                    icon={<Clock />} 
                    subtitle="Balance Drift"
                    colorClass="bg-orange-50 text-orange-600"
                />
            </div>

            {/* --- RECENT PROJECTS / ACTIVITY --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* PROJECT LIST TABLE */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-black italic text-slate-800 uppercase tracking-tighter">Active Projects</h4>
                        <button className="text-xs font-bold text-[#4177BC] hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {activeProjects.map((project: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-slate-50/50 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 border border-slate-100 group-hover:text-[#4177BC]">
                                        0{i+1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800 uppercase">{project.projectName || "New Project"}</p>
                                        <p className="text-[10px] font-bold text-slate-400">Due: {project.deadline || "TBA"}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-900">${project.budget}</p>
                                    <span className="text-[9px] font-black text-emerald-500 uppercase">Paid: ${project.paidAmount}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIDE ACTION CARD */}
                <div className="bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[80px]" />
                    <div>
                        <Target className="text-blue-400 mb-6" size={40} />
                        <h4 className="text-2xl font-black italic leading-tight mb-4 uppercase">
                            Your Project <br /> Health is <span className="text-[#4177BC]">Prime</span>
                        </h4>
                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed uppercase tracking-wider">
                            All your services are running at peak performance. No critical alerts found in your current cycle.
                        </p>
                    </div>
                    
                    <button className="mt-10 w-full py-5 bg-[#4177BC] hover:bg-blue-600 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-900/40">
                        Request New Service
                    </button>
                </div>

            </div>
        </div>
    );
}