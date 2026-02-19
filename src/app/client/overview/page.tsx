/* eslint-disable react-hooks/set-state-in-effect */
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
    Zap, LogOut, ChevronDown,
    Plus, PieChart, RefreshCw, 
    TrendingUp, ShieldAlert, Activity, ArrowRight, MoreHorizontal, Check
} from "lucide-react";

// BRAND COLORS FROM IMAGE
const PRIMARY = "#4177BC"; 
const ACCENT = "#EB9C2C"; 
const SUCCESS = "#10B981";

export default function ClientDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    // Logic: Same as original
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
            }, 800);
        } catch (err) {
            console.error("API Error");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverviewData();
    }, []);

    const handleLogout = () => {
        Cookies.remove("vault_token");
        localStorage.clear();
        router.push("/");
    };

    // Calculations: Same as original
    const activeProjects = data?.projects || [];
    const totalPaid = Number(data?.totalPaid) || 0;
    const totalBudget = activeProjects.reduce((acc: any, p: any) => acc + (Number(p.budget) || 0), 0);
    const lockedFunds = totalBudget - totalPaid;

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-[#FFFFF] text-slate-900 inter-font">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50 px-8 py-3">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Client Financial Sync</h1>
                        <p className="text-xs text-slate-400">Real-time view of assets, settled payments, and outstanding liquidity.</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                            {['Overview', 'Detailed View', 'Audit Log'].map((tab) => (
                                <button key={tab} className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${tab === 'Overview' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                        
                        <div className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                                    {data?.image ? <img src={data.image} alt="avatar" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-xs">{data?.name?.charAt(0)}</div>}
                                </div>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-44 bg-white shadow-2xl rounded-xl border border-slate-100 p-2">
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold">
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto p-8">
                {/* 4-Column Stat Grid (Direct Image Match) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatBox 
                        title="Total Asset Value" 
                        value={`$${totalBudget.toLocaleString()}`} 
                        subtitle="Gross value of all contracts" 
                        icon={<Briefcase className="text-[#4177BC]" />} 
                        trend="+12.5%" 
                    />
                    <StatBox 
                        title="Capital Settled" 
                        value={`$${totalPaid.toLocaleString()}`} 
                        subtitle="Successfully processed" 
                        icon={<CheckCircle2 className="text-[#10B981]" />} 
                        statusBadge="Verified"
                        borderColor="border-l-[#10B981]"
                    />
                    <StatBox 
                        title="Locked Liquidity" 
                        value={`$${lockedFunds.toLocaleString()}`} 
                        subtitle="Remaining dues in escrow" 
                        icon={<Clock className="text-[#EB9C2C]" />} 
                        statusBadge="Action Required"
                        badgeColor="bg-orange-50 text-orange-600"
                        borderColor="border-l-[#EB9C2C]"
                    />
                    <StatBox 
                        title="Operational Nodes" 
                        value={`${activeProjects.length} / 18`} 
                        subtitle="Active projects currently running" 
                        icon={<Activity className="text-purple-500" />} 
                        showDots 
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Revenue Analytics */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-lg font-bold text-slate-800">Revenue Analytics</h3>
                                <select className="text-[11px] font-bold text-slate-500 bg-slate-50 border-none rounded-md px-3 py-1">
                                    <option>Last 6 months</option>
                                </select>
                            </div>
                            <div className="h-[300px] w-full bg-[#FAFBFC] rounded-xl flex items-end justify-between px-4 pb-4 relative border-b border-slate-100">
                                {/* Visual Chart Representation matching image */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                     <PieChart size={120} className="text-slate-200" />
                                </div>
                                <div className="absolute top-1/2 left-[60%] -translate-y-1/2 bg-[#10B981] text-white px-3 py-1 rounded text-[10px] font-bold shadow-lg">
                                    $25,000 April
                                </div>
                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => (
                                    <span key={m} className="text-[10px] font-bold text-slate-300">{m}</span>
                                ))}
                            </div>
                        </div>

                        {/* Project Health & Asset Allocation Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-bold text-slate-800">Project Health</h3>
                                    <MoreHorizontal size={16} className="text-slate-300" />
                                </div>
                                <div className="h-40 flex items-center justify-center border-t border-slate-50 pt-4">
                                    <TrendingUp size={48} className="text-orange-400 opacity-20" />
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-sm font-bold text-slate-800">Asset Allocation</h3>
                                    <MoreHorizontal size={16} className="text-slate-300" />
                                </div>
                                <div className="flex justify-center py-4">
                                    <div className="w-32 h-32 rounded-full border-[12px] border-blue-500 border-t-green-500 border-r-purple-500 relative" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Milestone Log & Transactions */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-sm font-bold text-slate-800">Milestone Log</h3>
                                <span className="text-[10px] font-bold text-slate-300 uppercase">Real-time Feed</span>
                            </div>
                            
                            <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-50">
                                <MilestoneItem 
                                    title="Phase 3 Deployment" 
                                    desc="Core infrastructure setup complete." 
                                    time="Today, 10:42 AM" 
                                    amount="+$45,000 Released" 
                                    status="VERIFIED" 
                                    statusColor="text-green-500 bg-green-50"
                                    dotColor="bg-green-500"
                                />
                                <MilestoneItem 
                                    title="UX/UI Finalization" 
                                    desc="Design system approval signed off." 
                                    time="Feb 12, 2024" 
                                    amount="$28,500 Released" 
                                    status="SETTLED" 
                                    statusColor="text-slate-400 bg-slate-50"
                                    dotColor="bg-slate-200"
                                />
                                <MilestoneItem 
                                    title="API Integration" 
                                    desc="Third-party gateway connectivity." 
                                    status="PENDING" 
                                    statusColor="text-orange-500 bg-orange-50"
                                    dotColor="bg-orange-500 ring-4 ring-orange-100"
                                    isCurrent
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-sm font-bold text-slate-800">Recent Transactions</h3>
                                <button className="text-[10px] font-bold text-[#4177BC] hover:underline">View All</button>
                            </div>
                            <div className="space-y-4">
                                {activeProjects.slice(0, 3).map((proj: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-[11px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-50 rounded flex items-center justify-center font-black text-slate-400">
                                                {proj.projectName?.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-700">{proj.projectName}</span>
                                        </div>
                                        <span className="font-black text-slate-800">${Number(proj.budget).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// SUB-COMPONENTS
function StatBox({ title, value, subtitle, icon, trend, statusBadge, badgeColor, borderColor, showDots }: any) {
    return (
        <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden ${borderColor ? `border-l-4 ${borderColor}` : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                        <TrendingUp size={10} /> {trend}
                    </div>
                )}
                {statusBadge && (
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${badgeColor || 'text-green-500 bg-green-50'}`}>
                        {statusBadge}
                    </span>
                )}
                {showDots && <MoreHorizontal size={16} className="text-slate-200" />}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h2 className="text-2xl font-black text-slate-800 mb-1">{value}</h2>
            <p className="text-[10px] text-slate-400">{subtitle}</p>
            {/* Background design element from image */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-slate-50 rounded-full opacity-50" />
        </div>
    );
}

function MilestoneItem({ title, desc, time, amount, status, statusColor, dotColor, isCurrent }: any) {
    return (
        <div className="flex gap-4 relative">
            <div className={`w-4 h-4 rounded-full z-10 mt-1 shrink-0 ${dotColor}`} />
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h4 className="text-[12px] font-black text-slate-800 truncate">{title}</h4>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${statusColor}`}>{status}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                <div className="flex items-center gap-2 mt-2">
                    {time && <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1"><Clock size={10} /> {time}</span>}
                    {amount && <span className="text-[9px] font-black text-green-500">• {amount}</span>}
                </div>
                {isCurrent && (
                    <div className="mt-4 space-y-1">
                         <div className="flex items-center gap-2 text-[9px] font-bold text-orange-500 uppercase">
                            <ShieldAlert size={12} /> Awaiting Admin Approval
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-[70%]" />
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <RefreshCw size={40} className="text-[#4177BC] animate-spin" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing Assets...</p>
            </div>
        </div>
    );
}