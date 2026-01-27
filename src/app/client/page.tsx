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
    CreditCard, LayoutDashboard, TrendingUp,
    ShieldCheck, Mail, Phone, ExternalLink,
    Layout, ArrowRight, Sparkles, Plus,
    Globe, Activity, PieChart, CreditCardIcon,
    Wallet, History, HelpCircle
} from "lucide-react";

// --- ULTRA MODERN STAT CARD ---
function StatCard({ title, value, icon, subtitle, color, progress }: any) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.01 }}
            className="relative group bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
        >
            <div className="flex justify-between items-start mb-8">
                <div 
                    className="p-4 rounded-2xl shadow-sm group-hover:rotate-6 transition-transform duration-500" 
                    style={{ backgroundColor: `${color}10`, color: color }}
                >
                    {React.cloneElement(icon, { size: 26, strokeWidth: 2 })}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{progress}% Growth</span>
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
                <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{subtitle}</p>
                </div>
            </div>

            {/* Decorative Background Element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: color }} />
        </motion.div>
    );
}

export default function ClientOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    // Scroll effect for Navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        Cookies.remove("vault_token");
        localStorage.clear();
        router.push("/");
    };

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const userEmail = localStorage.getItem("user_email");
                const response = await axios.get(`${API_BASE}/clinets`);
                const myProfile = response.data.find((c: any) => c.email === userEmail);
                if (myProfile) setData(myProfile);
            } catch (err) {
                console.error("Connection Error");
            } finally {
                setLoading(false);
            }
        };
        fetchOverviewData();
    }, []);

    if (loading) return <LoadingScreen />;

    const activeProjects = data?.projects || [];
    const totalPaid = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.paidAmount) || 0), 0);
    const totalBudget = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.budget) || 0), 0);
    const paymentProgress = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#4177BC]/10">
            {/* Background Ambient Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4177BC]/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-orange-500/5 blur-[120px]" />
            </div>

            <div className="flex flex-col w-full max-w-[1600px] mx-auto min-h-screen relative z-10">

                {/* --- ULTRA-MODERN NAVBAR --- */}
                <header className={`w-full px-8 py-5 flex items-center justify-between sticky top-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl py-4 shadow-[0_10px_40px_rgba(0,0,0,0.03)]' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-12">
                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 cursor-pointer group" 
                            onClick={() => router.push('/dashboard/client')}
                        >
                            <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-900/20 group-hover:bg-[#4177BC] transition-colors duration-500">
                                <Zap size={22} fill="currentColor" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">VAULT<span className="text-[#4177BC]">SYNC</span></span>
                        </motion.div>

                        <div className="hidden lg:flex items-center bg-white rounded-2xl px-5 py-3 w-80 border border-slate-100 shadow-sm focus-within:ring-4 focus-within:ring-[#4177BC]/5 focus-within:border-[#4177BC]/20 transition-all duration-500">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Search resources..." className="bg-transparent border-none outline-none px-4 text-sm font-semibold w-full placeholder:text-slate-300" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2">
                            <NavIcon icon={<Bell size={20} />} hasBadge />
                            <NavIcon icon={<Settings size={20} />} />
                        </div>

                        {/* PREMIUM PROFILE DROPDOWN */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                                className="flex items-center gap-3 p-1.5 rounded-2xl bg-white border border-slate-100 pr-4 hover:shadow-lg transition-all duration-500 group"
                            >
                                <div className="w-9 h-9 rounded-xl overflow-hidden shadow-inner ring-2 ring-slate-50">
                                    {data?.image ? <img src={data.image} alt="profile" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#4177BC] flex items-center justify-center text-white"><User size={18}/></div>}
                                </div>
                                <div className="text-left hidden sm:block">
                                    <p className="text-[11px] font-black text-slate-900 leading-none">{data?.name?.split(' ')[0]}</p>
                                    <p className="text-[9px] font-bold text-[#4177BC] uppercase tracking-tighter mt-1">Diamond Client</p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-4 z-[101] overflow-hidden"
                                    >
                                        <div className="p-4 bg-slate-50 rounded-2xl mb-2 flex items-center gap-3 border border-slate-100">
                                            <ShieldCheck className="text-[#4177BC]" size={20} />
                                            <div>
                                                <p className="text-xs font-black text-slate-900">Verified Identity</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data?.email?.split('@')[0]}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <ProfileMenuBtn icon={<User size={16}/>} label="Personal Profile" onClick={() => router.push('/dashboard/client/profile')} />
                                            <ProfileMenuBtn icon={<Wallet size={16}/>} label="Billing & Payouts" />
                                            <ProfileMenuBtn icon={<History size={16}/>} label="Activity Logs" />
                                            <div className="h-[1px] bg-slate-100 my-2 mx-2" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-black uppercase tracking-wider">
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8 lg:p-12">
                    {/* Hero Branding */}
                    <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-3 py-1 bg-[#4177BC]/10 rounded-full text-[10px] font-black text-[#4177BC] uppercase tracking-widest">Active Session</span>
                                <span className="text-[10px] font-bold text-slate-300">/</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Dashboard</span>
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                                High Fidelity  
                                <span className="text-[#4177BC]">Operations.</span>
                            </h2>
                        </div>
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#4177BC] transition-all shadow-2xl shadow-slate-200 group"
                        >
                            <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" /> Start New Deployment
                        </motion.button>
                    </div>

                    {/* Stats Bento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        <StatCard title="Portfolio Value" value={`$${totalBudget.toLocaleString()}`} icon={<PieChart />} subtitle="Managed Capital" progress={100} color="#4177BC" />
                        <StatCard title="Settled" value={`$${totalPaid.toLocaleString()}`} icon={<CheckCircle2 />} subtitle="Paid Invoices" progress={paymentProgress} color="#10B981" />
                        <StatCard title="Locked" value={`$${(totalBudget - totalPaid).toLocaleString()}`} icon={<Clock />} subtitle="Awaiting Release" progress={100 - paymentProgress} color="#F59E0B" />
                        <StatCard title="Workload" value={`${activeProjects.length} Units`} icon={<Briefcase />} subtitle="Active Threads" progress={78} color="#8B5CF6" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Project Feed */}
                        <div className="lg:col-span-8">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Project Portfolio</h3>
                                <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4177BC] transition-colors">
                                    Detailed View <ArrowRight size={14} />
                                </button>
                            </div>
                            
                            <div className="space-y-5">
                                {activeProjects.map((project: any, i: number) => (
                                    <motion.div 
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-7 rounded-[2.2rem] bg-white border border-slate-100 hover:border-[#4177BC]/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer group"
                                        onClick={() => router.push(`/dashboard/client/${project._id || project.id}`)}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-[1.2rem] flex items-center justify-center font-black text-slate-300 text-xl group-hover:bg-[#4177BC] group-hover:text-white transition-all duration-700">
                                                {i + 1 < 10 ? `0${i + 1}` : i + 1}
                                            </div>
                                            <div>
                                                <p className="text-xl font-black text-slate-800 group-hover:text-[#4177BC] transition-colors tracking-tight">{project.projectName}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                        <Clock size={12} /> {project.deadline || "In Progress"}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Operational</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right mt-4 sm:mt-0">
                                            <p className="text-2xl font-black text-slate-900 tracking-tight">${project.budget.toLocaleString()}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Budget Allocation</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Smart Sidebar */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Insight Card */}
                            <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white relative overflow-hidden group">
                                <Sparkles className="absolute top-8 right-8 text-[#4177BC] opacity-30 group-hover:rotate-12 group-hover:scale-125 transition-all duration-700" size={40} />
                                <h4 className="text-3xl font-black mb-4 leading-none relative z-10">Network<br />Insights</h4>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 relative z-10">AI suggests diversifying your deployment for 12% faster delivery.</p>
                                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#4177BC] hover:text-white transition-all shadow-xl relative z-10">
                                    Run Optimization
                                </button>
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#4177BC]/20 rounded-full blur-[60px]" />
                            </div>

                            {/* Help & Support */}
                            <div className="bg-white rounded-[2.8rem] border border-slate-100 p-8 shadow-sm">
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center justify-between">
                                    Concierge <div className="flex gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /></div>
                                </h4>
                                <div className="space-y-4">
                                    <SidebarAction icon={<Mail />} label="Live Support" sub="24/7 Priority" color="#4177BC" />
                                    <SidebarAction icon={<HelpCircle />} label="Documentation" sub="Self Help" color="#F59E0B" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <div className="h-20" /> {/* Bottom Spacer */}
            </div>
        </div>
    );
}

// --- REUSABLE MICRO-COMPONENTS ---

function NavIcon({ icon, hasBadge }: any) {
    return (
        <button className="p-3 text-slate-400 hover:bg-white hover:text-slate-900 rounded-2xl transition-all relative border border-transparent hover:border-slate-100 group">
            {icon}
            {hasBadge && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-slate-50 group-hover:border-white" />}
        </button>
    );
}

function ProfileMenuBtn({ icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-3 p-3.5 text-slate-600 hover:bg-slate-50 rounded-xl transition-all text-xs font-bold tracking-tight group">
            <span className="text-slate-400 group-hover:text-[#4177BC] transition-colors">{icon}</span> {label}
        </button>
    );
}

function SidebarAction({ icon, label, sub, color }: any) {
    return (
        <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group">
            <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110" style={{ color: color }}>
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <div className="text-left">
                    <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">{label}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
                </div>
            </div>
            <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
        </button>
    );
}

function LoadingScreen() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC]">
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white"
            >
                <Zap size={30} fill="currentColor" />
            </motion.div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Synchronizing Vault</p>
        </div>
    );
}