/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase, Clock, CheckCircle2,
    ArrowUpRight, Target, Zap, Bell, Search,
    Settings, LogOut, User, ChevronDown,
    Plus, PieChart, Sparkles, ArrowRight,
    Mail, HelpCircle, ShieldCheck, Wallet, History, RefreshCw
} from "lucide-react";

//  BRAND COLORS 
const PRIMARY = "#4177BC"; 
const ACCENT = "#EB9C2C";  
const WHITE = "#FFFFFF";

//  FOODPANDA STYLE BOX SKELETON LOADING 
function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-200 bg-[#FDFEFF] overflow-hidden">
            {/* Fake Navbar Skeleton */}
            <div className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
                    <div className="h-6 w-24 bg-slate-100 rounded-md animate-pulse" />
                </div>
                <div className="w-32 h-10 bg-slate-100 rounded-full animate-pulse" />
            </div>

            <div className="max-w-360 mx-auto px-6 py-8 lg:px-10">
                {/* Hero Skeleton */}
                <div className="mb-10 flex justify-between items-end">
                    <div className="space-y-3">
                        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                        <div className="h-12 w-64 bg-slate-100 rounded-xl animate-pulse" />
                    </div>
                    <div className="h-14 w-40 bg-slate-100 rounded-2xl animate-pulse" />
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-4xl border border-slate-100 h-44 space-y-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                                <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="h-6 w-40 bg-slate-100 rounded mb-6 animate-pulse" />
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-5 rounded-[1.8rem] bg-white border border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-slate-50 rounded-xl animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                                        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-10 w-20 bg-slate-50 rounded-xl animate-pulse" />
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-4">
                        <div className="h-64 bg-slate-100 rounded-[2.2rem] animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

//  STAT CARD 
function StatCard({ title, value, icon, subtitle, color, progress }: any) {
    return (
        <motion.div
            whileHover={{ y: -6 }}
            className="bg-white p-6 rounded-4xl border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-6">
                <div 
                    className="p-3.5 rounded-2xl" 
                    style={{ backgroundColor: `${color}10`, color: color }}
                >
                    {React.cloneElement(icon, { size: 22 })}
                </div>
                <div className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{progress}% Growth</span>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-1">{title}</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
                <p className="text-[9px] font-bold text-slate-500 uppercase mt-3 tracking-tighter">{subtitle}</p>
            </div>
        </motion.div>
    );
}

export default function ClientOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const fetchOverviewData = async () => {
        setLoading(true);
        try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const userEmail = localStorage.getItem("user_email");
            const response = await axios.get(`${API_BASE}/clinets`);
            const myProfile = response.data.find((c: any) => c.email === userEmail);
            
            setTimeout(() => {
                if (myProfile) setData(myProfile);
                setLoading(false);
            }, 1200);
        } catch (err) {
            console.error("Connection Error");
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOverviewData();
    }, []);

    const handleLogout = () => {
        Cookies.remove("vault_token");
        localStorage.clear();
        router.push("/");
    };

    const activeProjects = data?.projects || [];
    const totalPaid = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.paidAmount) || 0), 0);
    const totalBudget = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.budget) || 0), 0);
    const paymentProgress = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#FDFEFF] text-slate-800 selection:bg-[#4177BC]/10 judson-bold">
            <AnimatePresence>
                {loading && <LoadingScreen key="loader" />}
            </AnimatePresence>

            {/* Ambient Background Lights */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4177BC]/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-[#EB9C2C]/5 blur-[100px]" />
            </div>

            <div className="flex flex-col w-full max-w-360 mx-auto relative z-10">
                
                {/* Navbar */}
                <header className={`w-full px-6 py-4 flex items-center justify-between sticky top-0 z-100 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={fetchOverviewData}>
                        <div className="w-10 h-10 bg-[#4177BC] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100 transition-transform group-active:scale-95">
                            <Zap size={20} fill="white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">Welc<span className="text-[#4177BC]">Sync</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={fetchOverviewData} className="p-2 text-slate-400 hover:text-[#4177BC] transition-colors">
                            <RefreshCw size={18} />
                        </button>
                        <div className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2.5 p-1 rounded-full bg-white border border-slate-100 pr-3 hover:shadow-sm transition-all">
                                <div className="w-8 h-8 rounded-full bg-[#4177BC] flex items-center justify-center text-white overflow-hidden text-xs font-bold">
                                    {data?.image ? <img src={data.image} alt="profile" className="w-full h-full object-cover" /> : data?.name?.charAt(0) || <User size={16} />}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-[11px] font-bold leading-none">{data?.name?.split(' ')[0]}</p>
                                    <p className="text-[8px] font-bold text-[#4177BC] uppercase mt-0.5 tracking-wider">Client</p>
                                </div>
                                <ChevronDown size={12} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-3 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl p-2 z-110"
                                    >
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <main className="px-6 py-8 lg:px-10">
                    {/* Hero Section */}
                    <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Console</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-slate-900">Welcome<span className="text-[#4177BC]">GenieHack</span></h2>
                        </div>
                        <button className="flex items-center gap-2 bg-[#4177BC] text-white px-7 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-blue-100">
                            <Plus size={16} strokeWidth={3} /> Create Request
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                        <StatCard title="Assets Value" value={`$${totalBudget.toLocaleString()}`} icon={<PieChart />} subtitle="Portfolio Cap" progress={100} color={PRIMARY} />
                        <StatCard title="Capital Paid" value={`$${totalPaid.toLocaleString()}`} icon={<CheckCircle2 />} subtitle="Invoices Settled" progress={paymentProgress} color="#10B981" />
                        <StatCard title="Locked Funds" value={`$${(totalBudget - totalPaid).toLocaleString()}`} icon={<Clock />} subtitle="In-Escrow" progress={100 - paymentProgress} color={ACCENT} />
                        <StatCard title="Active Projects" value={activeProjects.length} icon={<Briefcase />} subtitle="Running Threads" progress={82} color="#8B5CF6" />
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Project List */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-lg font-bold text-slate-800">Deployment Logs</h3>
                                <button className="text-[10px] font-bold text-[#4177BC] uppercase hover:underline">View All</button>
                            </div>
                            <div className="space-y-3">
                                {activeProjects.length > 0 ? activeProjects.map((project: any, i: number) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        className="p-5 rounded-[1.8rem] bg-white border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-[#4177BC]/20 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center font-bold text-sm group-hover:bg-[#4177BC] group-hover:text-white transition-all">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 group-hover:text-[#4177BC] transition-colors">{project.projectName}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{project.deadline || 'Ongoing'}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-800">${project.budget?.toLocaleString()}</p>
                                            <div className="flex items-center gap-1.5 justify-end mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Live</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="p-12 bg-white rounded-4xl border border-dashed border-slate-200 text-center">
                                        <p className="text-slate-400 font-medium text-sm">No active deployments found.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-[#4177BC] rounded-[2.2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-100">
                                <Sparkles className="absolute -top-2 -right-2 text-white opacity-10" size={100} />
                                <div className="relative z-10">
                                    <h4 className="text-xl font-bold mb-2">Vault Insights</h4>
                                    <p className="text-blue-100/70 text-[11px] leading-relaxed mb-6 font-medium">Optimization check complete. No vulnerabilities detected in your 3 active nodes.</p>
                                    <button className="w-full py-3.5 bg-white text-[#4177BC] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                                        Launch System Audit
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-4xl border border-slate-100 p-6 shadow-sm">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">Quick Support</h4>
                                <div className="space-y-2">
                                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-[#4177BC]/5 transition-colors group">
                                        <span className="text-[10px] font-bold text-slate-600">Help Documentation</span>
                                        <ArrowRight size={14} className="text-slate-400 group-hover:text-[#4177BC]" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}