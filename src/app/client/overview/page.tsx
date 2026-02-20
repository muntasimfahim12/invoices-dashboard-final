/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Clock, LogOut, RefreshCw, Activity,
    Wallet, ShieldCheck, Zap, History, Check, ArrowDownLeft
} from "lucide-react";

const PRIMARY = "#4177BC";
const ACCENT = "#EB9C2C";

/** 1️⃣ Stat Card Component **/
function StatCard({ title, value, icon, color }: any) {
    const iconMap: any = {
        wallet: <Wallet size={20} />,
        shield: <ShieldCheck size={20} />,
        clock: <Clock size={20} />,
        briefcase: <Briefcase size={20} />
    };

    return (
        <div className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-50 transition-colors" />
            <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-6 shadow-sm" style={{ backgroundColor: `${color}10`, color: color }}>
                    {iconMap[icon] || icon}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 inter-bold">{title}</p>
                <h3 className="text-3xl font-black text-[#0F172A] tracking-tighter inter-bold">{value}</h3>
            </div>
        </div>
    );
}

export default function ClientOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const router = useRouter();

    // 🚀 FIXED: Fetching specifically from /profile/me as per your backend
    const fetchOverviewData = useCallback(async (showSkeleton = true) => {
        if (showSkeleton) setLoading(true);
        else setRefreshing(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
            const userEmail = localStorage.getItem("user_email");
            
            if (!userEmail) {
                router.push("/login"); // Fixed: direct to login if no email
                return;
            }

            // Using your Master Profile Route which already includes 'recentStatement'
            const response = await axios.get(`${API_BASE}/clinets/profile/me`, {
                params: { email: userEmail }
            });
            
            if (response.data) {
                setData(response.data);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router]);

    useEffect(() => { fetchOverviewData(); }, [fetchOverviewData]);

    /** 📊 Calculated Stats **/
    const stats = useMemo(() => {
        const projects = data?.projects || [];
        const totalBudget = projects.reduce((acc: number, p: any) => acc + (Number(p.budget) || 0), 0);
        const currentPaid = data?.totalPaid || 0;
        
        return {
            activeProjects: projects,
            totalBudget: totalBudget,
            currentPaid: currentPaid,
            lockedFunds: Math.max(0, totalBudget - currentPaid)
        };
    }, [data]);

    /** 💸 Transaction Mapping (Syncing with your backend's Statement logic) **/
    const transactions = useMemo(() => {
        return (data?.recentStatement || []).map((st: any) => ({
            id: st.id || Math.random().toString(36).substr(2, 9),
            projectName: st.project, // Mapping backend 'project' to UI
            milestoneName: st.description, // Mapping backend 'description' to UI
            amount: st.amount,
            date: new Date(st.date),
            method: st.method
        }));
    }, [data]);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans text-[#0F172A] selection:bg-[#4177BC] selection:text-white">
            {/* Header Section */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50">
                <div className="max-w-360 mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-2xl font-black tracking-tighter text-[#4177BC] judson-bold">Genie oVerview</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => fetchOverviewData(false)} className={`p-3 rounded-full transition-all hover:bg-slate-50 ${refreshing ? 'animate-spin text-[#4177BC]' : 'text-slate-400'}`}>
                            <RefreshCw size={18} />
                        </button>
                        <div className="relative">
                            <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-3 p-1 bg-white rounded-full border border-slate-200 transition-all hover:shadow-md active:scale-95">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#4177BC] to-[#2D5A91] flex items-center justify-center text-white text-xs font-black inter-bold">
                                    {data?.name?.substring(0, 2).toUpperCase()}
                                </div>
                            </button>
                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 mt-4 w-72 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-4 z-50">
                                        <div className="px-4 py-4 mb-3 bg-slate-50 rounded-[20px]">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 inter-bold">Verified Client</p>
                                            <p className="text-sm font-extrabold text-[#0F172A] truncate inter-semibold">{data?.name}</p>
                                        </div>
                                        <button onClick={() => { Cookies.remove("vault_token"); localStorage.clear(); router.push("/"); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-extrabold text-red-500 hover:bg-red-50 rounded-xl transition-all inter-bold">
                                            <LogOut size={18} /> Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-360 mx-auto px-6 mt-12">
                {/* Welcome Section */}
                <section className="mb-20">
                    <div className="animate-scaleIn">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4177BC]/5 rounded-full mb-8 border border-[#4177BC]/10">
                            <span className="w-2 h-2 bg-[#4177BC] rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] inter-bold">Client Portal v2.0</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] tracking-tighter leading-tight judson-bold">
                            Welcome <span className="text-slate-300">{data?.name?.split(' ')[0].toLowerCase() || 'genie'}</span>
                        </h1>
                    </div>
                </section>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    <StatCard title="Capital Invested" value={`$${stats.totalBudget.toLocaleString()}`} icon="wallet" color={PRIMARY} />
                    <StatCard title="Settled Amount" value={`$${stats.currentPaid.toLocaleString()}`} icon="shield" color="#10B981" />
                    <StatCard title="Pending Balance" value={`$${stats.lockedFunds.toLocaleString()}`} icon="clock" color={ACCENT} />
                    <StatCard title="Active Projects" value={stats.activeProjects.length} icon="briefcase" color="#8B5CF6" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
                    {/* Left: Project Roadmap */}
                    <div className="xl:col-span-2 space-y-24">
                        <div className="flex items-center gap-4 mb-2">
                            <Activity size={20} className="text-[#4177BC]" />
                            <h3 className="text-xl font-black uppercase tracking-widest text-[#0F172A] inter-bold">Project Roadmap</h3>
                        </div>
                        {stats.activeProjects.map((project: any, i: number) => {
                            const milestones = project.milestones || [];
                            const paidCount = milestones.filter((m: any) => m.status?.toLowerCase() === 'paid').length;
                            const ratio = milestones.length > 0 ? Math.round((paidCount / milestones.length) * 100) : 0;

                            return (
                                <div key={i} className="animate-scaleIn group">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 px-4">
                                        <div>
                                            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] judson-bold">{project.name}</h2>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] inter-bold">Ref: {project._id?.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <div className="px-6 py-3 bg-[#4177BC]/5 rounded-2xl border border-[#4177BC]/10">
                                            <p className="text-[8px] font-black text-[#4177BC] uppercase tracking-widest mb-1 inter-bold">Settlement</p>
                                            <p className="text-lg font-black text-[#4177BC] inter-bold">{ratio}%</p>
                                        </div>
                                    </div>

                                    <div className="relative ml-4 md:ml-10">
                                        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-slate-200 ml-[18px]" style={{ backgroundImage: 'linear-gradient(to bottom, #e2e8f0 50%, transparent 50%)', backgroundSize: '1px 8px' }} />
                                        <div className="space-y-6 relative z-10">
                                            {milestones.map((m: any, idx: number) => {
                                                const isPaid = m.status?.toLowerCase() === 'paid';
                                                return (
                                                    <div key={idx} className="flex items-center gap-6 group/item">
                                                        <div className={`w-9 h-9 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 transition-all ${isPaid ? 'bg-emerald-500 scale-110' : 'bg-slate-100'}`}>
                                                            {isPaid ? <Check size={14} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                                                        </div>
                                                        <div className={`flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-[28px] border transition-all ${isPaid ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/60 border-slate-100'}`}>
                                                            <div className="flex items-center gap-5">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isPaid ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                                                                    <Zap size={20} />
                                                                </div>
                                                                <div>
                                                                    <h4 className={`text-lg font-bold judson-bold ${isPaid ? 'text-slate-400' : 'text-[#0F172A]'}`}>{m.name}</h4>
                                                                    <span className="text-xl font-black text-[#0F172A] inter-bold">${Number(m.amount).toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-100'}`}>
                                                                {isPaid ? 'Verified' : 'Action Required'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: bKash Style Statement */}
                    <div className="xl:col-span-1">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <History size={20} className="text-[#4177BC]" />
                                    <h3 className="text-xl font-black uppercase tracking-widest text-[#0F172A] inter-bold">Statement</h3>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Last 30 Days</span>
                            </div>

                            <div className="bg-[#F8FAFC] rounded-[40px] border border-slate-100 p-2">
                                <div className="bg-white rounded-[32px] overflow-hidden border border-slate-50 shadow-sm">
                                    {transactions.length > 0 ? (
                                        <div className="divide-y divide-slate-50">
                                            {transactions.map((tx: any) => (
                                                <div key={tx.id} className="p-6 hover:bg-slate-50/50 transition-colors group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                                                <ArrowDownLeft size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest inter-bold">Payment Settled</p>
                                                                <h4 className="font-bold text-[#0F172A] truncate w-32 md:w-40 inter-semibold">{tx.projectName}</h4>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-black text-emerald-600 inter-bold">+${tx.amount.toLocaleString()}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 inter-medium">
                                                                {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(tx.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="ml-13 flex items-center gap-2">
                                                        <div className="px-2 py-0.5 bg-slate-50 rounded-md text-[8px] font-bold text-slate-400 border border-slate-100">
                                                            {tx.milestoneName}
                                                        </div>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                        <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter inter-bold">{tx.method || 'System'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-20 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                                <RefreshCw size={24} className="text-slate-200" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity in 30 days</p>
                                        </div>
                                    )}
                                    <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                                        <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4177BC] hover:border-[#4177BC]/30 transition-all inter-bold">
                                            View Full Ledger
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-white p-12 space-y-16 animate-pulse">
            <div className="h-16 w-full bg-slate-50 rounded-[20px]" />
            <div className="grid grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[40px]" />)}
            </div>
            <div className="flex gap-16">
                <div className="flex-2 h-96 bg-slate-50 rounded-[60px] w-full" />
                <div className="flex-1 h-96 bg-slate-50 rounded-[60px] w-full" />
            </div>
        </div>
    );
}