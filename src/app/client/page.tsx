/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Added for navigation
import Cookies from "js-cookie"; // Added for session management
import { motion, AnimatePresence } from "framer-motion";
import { 
    Briefcase, Clock, AlertCircle, CheckCircle2,
    ArrowUpRight, Target, Zap, Bell, Search,
    Settings, LogOut, User, ChevronDown, 
    CreditCard, LayoutDashboard
} from "lucide-react";

// --- STAT CARD COMPONENT ---
function StatCard({ title, value, icon, subtitle, color, progress }: any) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.02)] group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500"
        >
            <div className="flex justify-between items-start">
                <div className={`p-4 rounded-2xl bg-slate-50 text-[${color}] group-hover:scale-110 transition-transform duration-500`} 
                     style={{ color: color }}>
                    {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Analytics</span>
                    <div className="flex items-center gap-1 text-[#EB9C2C] mt-1">
                        <TrendingUp size={12} />
                        <span className="text-[11px] font-bold">Live</span>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <p className="text-[13px] font-medium text-slate-500">{title}</p>
                <h3 className="text-4xl font-bold text-slate-900 tracking-tight mt-1">{value}</h3>
                
                <div className="mt-6 flex items-center gap-3">
                    <div className="h-1.5 flex-1 bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                        />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">{progress}%</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">{subtitle}</p>
            </div>
        </motion.div>
    );
}

function TrendingUp({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
}

export default function ClientOverview() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    // ✅ লগআউট ফাংশন
    const handleLogout = () => {
        Cookies.remove("vault_token");
        Cookies.remove("user_role");
        localStorage.clear();
        router.push("/");
    };

    useEffect(() => {
        const fetchOverviewData = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const userEmail = localStorage.getItem("user_email");
                
                // শুধুমাত্র বর্তমান ইউজারের ডাটা নিয়ে আসার জন্য কুয়েরি (Backend অনুযায়ী ফিল্টার হবে)
                const response = await axios.get(`${API_BASE}/clinets`);
                
                // যদি ব্যাকএন্ডে ইমেইল দিয়ে ফিল্টার করার অপশন না থাকে, তবে এখানে ফিল্টার করছি
                const myProfile = response.data.find((c: any) => c.email === userEmail) || response.data[response.data.length - 1];
                
                if (myProfile) setData(myProfile);
            } catch (err) {
                console.error("Connection Error");
            } finally {
                setLoading(false);
            }
        };
        fetchOverviewData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-10 h-10 border-2 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
        </div>
    );

    const activeProjects = data?.projects || [];
    const totalPaid = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.paidAmount) || 0), 0);
    const totalBudget = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.budget) || 0), 0);
    const paymentProgress = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            {/* ================= PREMIUM TOP NAVBAR ================= */}
            <header className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-slate-50 px-6 md:px-12 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 w-80">
                            <Search size={18} className="text-slate-400" />
                            <input type="text" placeholder="Search projects..." className="bg-transparent border-none outline-none px-3 text-sm font-medium w-full text-slate-600 placeholder:text-slate-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#EB9C2C] rounded-full border-2 border-white" />
                        </button>

                        <div className="h-10 w-[1px] bg-slate-100 mx-2" />

                        {/* PROFILE DROPDOWN */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#4177BC] flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                    <User size={20} />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-[12px] font-bold text-slate-900 leading-tight">{data?.name || "Client"}</p>
                                    <p className="text-[10px] font-bold text-[#4177BC] uppercase">Pro Client</p>
                                </div>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-[100]"
                                    >
                                        <div className="space-y-1">
                                            <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-[#4177BC] hover:bg-blue-50 rounded-2xl transition-all text-sm font-bold">
                                                <User size={18} /> My Profile
                                            </button>
                                            <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:text-[#4177BC] hover:bg-blue-50 rounded-2xl transition-all text-sm font-bold">
                                                <Settings size={18} /> Settings
                                            </button>
                                            <div className="h-[1px] bg-slate-50 my-2" />
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all text-sm font-bold"
                                            >
                                                <LogOut size={18} /> Logout Session
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* ================= MAIN CONTENT AREA ================= */}
            <main className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 text-slate-900">
                
                {/* WELCOME HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
                            Pulse<span className="text-[#4177BC]">Control</span> Center
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 font-medium">System operational. Managing <span className="text-slate-900 font-bold">{activeProjects.length} active projects</span> with high velocity.</p>
                    </motion.div>
                    
                    <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-[#4177BC] transition-all flex items-center gap-3 shadow-xl shadow-slate-200">
                        <Zap size={20} fill="currentColor" /> Initialize New Venture
                    </button>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard 
                        title="Venture Count" 
                        value={activeProjects.length} 
                        icon={<Briefcase />} 
                        subtitle="Ongoing cycles"
                        progress={75}
                        color="#4177BC"
                    />
                    <StatCard 
                        title="Settled Capital" 
                        value={`$${totalPaid.toLocaleString()}`} 
                        icon={<CreditCard />} 
                        subtitle="Investment cleared"
                        progress={paymentProgress}
                        color="#10B981"
                    />
                    <StatCard 
                        title="Budget Reserve" 
                        value={`$${(totalBudget - totalPaid).toLocaleString()}`} 
                        icon={<Clock />} 
                        subtitle="Awaiting clearance"
                        progress={100 - paymentProgress}
                        color="#EB9C2C"
                    />
                </div>

                {/* ACTIVITY GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* PROJECTS TABLE */}
                    <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-50 p-10 shadow-sm shadow-slate-100/50">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-[#4177BC] rounded-full" />
                                <h4 className="text-xl font-bold text-slate-900">Recent Projects</h4>
                            </div>
                            <button className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <ArrowUpRight size={20} className="text-[#4177BC]" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {activeProjects.length > 0 ? activeProjects.map((project: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 border border-transparent hover:border-slate-50 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-slate-300 border border-slate-50 group-hover:text-[#4177BC] group-hover:border-blue-100 transition-all">
                                            {i + 1 < 10 ? `0${i+1}` : i+1}
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-bold text-slate-800 tracking-tight">{project.projectName}</p>
                                            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{project.deadline || "In Progress"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <p className="text-[16px] font-bold text-slate-900">${project.budget.toLocaleString()}</p>
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-emerald-100">Paid: ${project.paidAmount}</span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-slate-400 font-medium">No projects found.</p>
                            )}
                        </div>
                    </div>

                    {/* STATUS CARD */}
                    <div className="space-y-8">
                        <div className="bg-[#4177BC] rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <Target size={48} className="mb-8 opacity-20" />
                            <h4 className="text-2xl font-bold leading-tight mb-4">
                                Strategic <br /> Goal Status
                            </h4>
                            <p className="text-blue-50 text-sm font-medium leading-relaxed opacity-80 mb-8">
                                All project trajectories are aligned with the quarterly roadmap. No deviations detected.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                    <CheckCircle2 size={18} className="text-white" />
                                    <span className="text-xs font-bold">Cloud Deployment: 100%</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                                    <Clock size={18} className="text-white/50" />
                                    <span className="text-xs font-bold text-white/60">Next Review: 24h</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                             <h5 className="text-sm font-bold text-slate-900 mb-4">Quick Support</h5>
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                     <LayoutDashboard size={20} className="text-slate-400" />
                                 </div>
                                 <p className="text-xs font-medium text-slate-500 leading-snug">Need technical assistance? Our experts are online.</p>
                             </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}  