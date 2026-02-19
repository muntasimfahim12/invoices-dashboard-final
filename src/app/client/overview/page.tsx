/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Clock, CheckCircle2,
    LogOut, ChevronDown, Plus, 
    Calendar, AlertCircle, 
    RefreshCw, Layers, ArrowUpRight,
    Wallet, ShieldCheck, Zap
} from "lucide-react";

const PRIMARY = "#4177BC";
const ACCENT = "#EB9C2C";

/** 1️⃣ Minimal Loading **/
function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
                <p className="text-[10px] tracking-[0.2em] text-slate-400 font-medium">SECURE LOADING</p>
            </div>
        </div>
    );
}

/** 2️⃣ Clean Stat Card **/
function StatCard({ title, value, icon, subtitle, color, progress }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${color}08`, color: color }}>
                    {React.cloneElement(icon, { size: 18, strokeWidth: 2 })}
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                    {progress}%
                </span>
            </div>
            
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
            
            <div className="mt-4 w-full h-1 bg-slate-50 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </motion.div>
    );
}

export default function ClientOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    const fetchOverviewData = useCallback(async (showSkeleton = true) => {
        if (showSkeleton) setLoading(true);
        else setRefreshing(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const userEmail = localStorage.getItem("user_email");
            if (!userEmail) { router.push("/"); return; }

            const response = await axios.get(`${API_BASE}/clinets`);
            const myProfile = response.data.find((c: any) => c.email === userEmail || c.portalEmail === userEmail);
            if (myProfile) setData(myProfile);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useEffect(() => { fetchOverviewData(); }, [fetchOverviewData]);

    const stats = useMemo(() => {
        const projects = data?.projects || [];
        let budget = 0, paid = 0;
        projects.forEach((project: any) => {
            budget += Number(project.budget) || 0;
            project.milestones?.forEach((m: any) => {
                if (m.status === 'Paid' || m.status === 'paid' || m.paidDate) {
                    paid += Number(m.amount) || 0;
                }
            });
        });
        const locked = budget - paid;
        const progress = budget > 0 ? Math.round((paid / budget) * 100) : 0;
        return { activeProjects: projects, totalBudget: budget, currentPaid: paid, lockedFunds: locked, paymentProgress: progress };
    }, [data]);

    if (loading) return <LoadingScreen />;

    return (
        <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-50">
            {/* Header */}
            <nav className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-[100]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#4177BC] rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                            <Layers className="text-white" size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">Client </h1>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Project Management</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => fetchOverviewData(false)}
                            className={`p-2 rounded-lg hover:bg-slate-50 transition-colors ${refreshing ? 'animate-spin text-blue-500' : 'text-slate-400'}`}
                        >
                            <RefreshCw size={18} />
                        </button>
                        
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-100 hover:bg-slate-50 transition-all"
                            >
                                <span className="text-[11px] font-bold text-slate-600 ml-1">{data?.name?.split(' ')[0]}</span>
                                <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden">
                                    {data?.image ? <img src={data.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-bold">{data?.name?.charAt(0)}</div>}
                                </div>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 8 }} 
                                        animate={{ opacity: 1, y: 0 }} 
                                        exit={{ opacity: 0, y: 8 }} 
                                        className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border border-slate-100 p-2 z-[110]"
                                    >
                                        <div className="px-4 py-3 border-b border-slate-50">
                                            <p className="text-xs font-bold text-slate-900">{data?.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{data?.email}</p>
                                        </div>
                                        <button 
                                            onClick={() => { Cookies.remove("vault_token"); localStorage.clear(); router.push("/"); }}
                                            className="w-full flex items-center justify-between px-4 py-3 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Sign Out <LogOut size={14} />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Minimal Hero */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2 judson-bold">
                            Welcome back, <span className="text-[#4177BC]">{data?.name?.split(' ')[0]}</span>
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            You have <span className="text-slate-900 font-bold">{stats.activeProjects.length} active projects</span> currently in progress.
                        </p>
                    </div>
                    
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-all">
                        <Plus size={16} /> New Project Request
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    <StatCard title="Total Budget" value={`$${stats.totalBudget.toLocaleString()}`} icon={<Wallet />} progress={100} color={PRIMARY} />
                    <StatCard title="Total Paid" value={`$${stats.currentPaid.toLocaleString()}`} icon={<ShieldCheck />} progress={stats.paymentProgress} color="#10B981" />
                    <StatCard title="Remaining" value={`$${stats.lockedFunds.toLocaleString()}`} icon={<Clock />} progress={100 - stats.paymentProgress} color={ACCENT} />
                    <StatCard title="Active Projects" value={stats.activeProjects.length} icon={<Briefcase />} progress={100} color="#8B5CF6" />
                </div>

                {/* Projects Section */}
                <div className="space-y-16">
                    {stats.activeProjects.length > 0 ? stats.activeProjects.map((project: any, i: number) => (
                        <div key={i}>
                            <div className="flex items-center justify-between mb-8 border-l-4 border-[#4177BC] pl-6">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{project.name || project.projectName}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {project._id?.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</p>
                                    <p className="text-xl font-bold text-slate-900">${Number(project.budget).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {project.milestones?.map((m: any, idx: number) => {
                                    const isPaid = m.status === 'Paid' || m.status === 'paid' || m.paidDate;
                                    return (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ y: -4 }}
                                            className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-6">
                                                <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-md ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                                    {isPaid ? 'Completed' : 'Pending'}
                                                </span>
                                                {isPaid && <CheckCircle2 size={14} className="text-emerald-500" />}
                                            </div>

                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{m.name}</p>
                                            <p className="text-2xl font-bold text-slate-900 mb-6">${Number(m.amount).toLocaleString()}</p>

                                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px]">
                                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                    <Calendar size={13} />
                                                    {isPaid ? (m.paidDate || "Paid") : (m.dueDate || "TBD")}
                                                </div>
                                                {!isPaid && <ArrowUpRight size={14} className="text-slate-300" />}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )) : (
                        <div className="py-20 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">
                            <AlertCircle className="text-slate-300 mx-auto mb-3" size={32} />
                            <h3 className="text-sm font-bold text-slate-900">No Projects Found</h3>
                            <p className="text-xs text-slate-400 mt-1">When you start a project, it will appear here.</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-slate-50 flex justify-between items-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">© 2026 Secure Portal</p>
                <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <a href="#" className="hover:text-slate-900">Privacy</a>
                    <a href="#" className="hover:text-slate-900">Support</a>
                </div>
            </footer>
        </div>
    );
}