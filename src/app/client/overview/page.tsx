/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    Wallet, ShieldCheck, Zap, Bell, Settings, CircleUserRound, Activity
} from "lucide-react";

// The "Genie" Design Toolkit
const PRIMARY = "#4177BC";
const ACCENT = "#EB9C2C";

/** 1️⃣ Genie Style Stat Card **/
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

    const fetchOverviewData = useCallback(async (showSkeleton = true) => {
        if (showSkeleton) setLoading(true);
        else setRefreshing(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
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
        return { 
            activeProjects: projects, 
            totalBudget: budget, 
            currentPaid: paid, 
            lockedFunds: (budget - paid) < 0 ? 0 : (budget - paid) 
        };
    }, [data]);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans text-[#0F172A] selection:bg-[#4177BC] selection:text-white">
            {/* 2.0 Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50">
                <div className="max-w-360 mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <span className="text-2xl font-black tracking-tighter text-[#4177BC] judson-bold">Genie oVerview</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => fetchOverviewData(false)}
                            className={`p-3 rounded-full transition-all hover:bg-slate-50 ${refreshing ? 'animate-spin text-[#4177BC]' : 'text-slate-400'}`}
                        >
                            <RefreshCw size={18} />
                        </button>
                        
                        <div className="w-px h-8 bg-slate-100 mx-2 hidden md:block"></div>

                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 p-1 bg-white rounded-full border border-slate-200 transition-all hover:shadow-md active:scale-95"
                            >
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#4177BC] to-[#2D5A91] flex items-center justify-center text-white text-xs font-black inter-bold">
                                    {data?.name?.substring(0, 2).toUpperCase()}
                                </div>
                            </button>

                            <AnimatePresence>
                                {showProfileMenu && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-72 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-4 z-50"
                                    >
                                        <div className="px-4 py-4 mb-3 bg-slate-50 rounded-[20px]">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 inter-bold">Verified Client</p>
                                            <p className="text-sm font-extrabold text-[#0F172A] truncate inter-semibold">{data?.name}</p>
                                        </div>
                                        <nav className="space-y-1">
                                            <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#4177BC] hover:bg-[#4177BC]/5 rounded-xl transition-all inter-medium">
                                                <CircleUserRound size={18} /> Profile Details
                                            </button>
                                            <div className="h-px bg-slate-100 my-2 mx-2"></div>
                                            <button onClick={() => { Cookies.remove("vault_token"); localStorage.clear(); router.push("/"); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-extrabold text-red-500 hover:bg-red-50 rounded-xl transition-all inter-bold">
                                                <LogOut size={18} /> Sign Out
                                            </button>
                                        </nav>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-360 mx-auto px-6 mt-12">
                {/* 2.0 Hero Section */}
                <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                    <div className="animate-scaleIn">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4177BC]/5 rounded-full mb-8 border border-[#4177BC]/10">
                            <span className="w-2 h-2 bg-[#4177BC] rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] inter-bold">Client Portal v2.0</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-[#0F172A] tracking-tighter leading-[0.9] mb-8 judson-bold">
                            Welcome
                            <span className="text-slate-300 block">{data?.name?.split(' ')[0]}.</span>
                        </h1>
                        <p className="max-w-md text-slate-500 text-xl font-medium leading-relaxed inter-medium">
                            You currently have <span className="text-[#0F172A] font-bold">{stats.activeProjects.length} strategic projects</span> active in your portfolio.
                        </p>
                    </div>

                    <div className="hidden lg:flex justify-end">
                        <div className="relative w-80 h-80 bg-slate-50 rounded-[60px] flex items-center justify-center border border-slate-100 rotate-3">
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#EB9C2C] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#4177BC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                            <div className="text-center p-8">
                                <p className="text-5xl font-black text-[#0F172A] judson-bold">${stats.totalBudget.toLocaleString()}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 inter-bold">Total Portfolio Value</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    <StatCard title="Capital Invested" value={`$${stats.totalBudget.toLocaleString()}`} icon="wallet" color={PRIMARY} />
                    <StatCard title="Settled Amount" value={`$${stats.currentPaid.toLocaleString()}`} icon="shield" color="#10B981" />
                    <StatCard title="Pending Balance" value={`$${stats.lockedFunds.toLocaleString()}`} icon="clock" color={ACCENT} />
                    <StatCard title="Active Projects" value={stats.activeProjects.length} icon="briefcase" color="#8B5CF6" />
                </div>

                {/* Projects Section */}
                <div className="space-y-32">
                    {stats.activeProjects.length > 0 ? stats.activeProjects.map((project: any, i: number) => (
                        <div key={i} className="animate-scaleIn">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                <div>
                                    <h2 className="text-4xl font-bold tracking-tighter text-[#0F172A] judson-bold">{project.name || project.projectName}</h2>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 inter-bold">Contract ID: {project._id?.slice(-8).toUpperCase()}</p>
                                </div>
                                <div className="px-8 py-4 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 inter-bold">Project Budget</p>
                                    <p className="text-2xl font-black text-[#0F172A] inter-bold">${Number(project.budget).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {project.milestones?.map((m: any, idx: number) => {
                                    const isPaid = m.status === 'Paid' || m.status === 'paid' || m.paidDate;
                                    return (
                                        <div key={idx} className="group bg-white p-10 rounded-[50px] border border-slate-100 hover:border-[#4177BC]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-100">
                                            <div className="flex justify-between items-start mb-10">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:-rotate-6 ${isPaid ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                                                    {isPaid ? <CheckCircle2 size={22} /> : <Activity size={22} />}
                                                </div>
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                                    {isPaid ? 'Completed' : 'In Progress'}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold tracking-tight mb-2 judson-bold">{m.name}</h3>
                                            <div className="text-4xl font-black text-[#0F172A] mb-8 inter-bold">${Number(m.amount).toLocaleString()}</div>
                                            
                                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest inter-bold">
                                                    <Calendar size={14} />
                                                    {isPaid ? (m.paidDate || "Processed") : (m.dueDate || "Scheduled")}
                                                </div>
                                                {!isPaid && <ArrowUpRight size={18} className="text-slate-200 group-hover:text-[#4177BC] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )) : (
                        <div className="bg-[#F8FAFC] rounded-[60px] p-24 text-center border border-dashed border-slate-200">
                            <AlertCircle className="text-slate-200 mx-auto mb-6" size={64} />
                            <h3 className="text-3xl font-bold text-[#0F172A] judson-bold mb-2">No Active Records</h3>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] inter-bold">New projects will manifest here upon initialization</p>
                        </div>
                    )}
                </div>
            </main>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-white p-12 space-y-16 animate-pulse">
            <div className="h-16 w-full bg-slate-50 rounded-[20px]" />
            <div className="h-64 w-2/3 bg-slate-50 rounded-[60px]" />
            <div className="grid grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[40px]" />)}
            </div>
        </div>
    );
}