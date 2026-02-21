/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, CheckCircle2, Target,
    ArrowRight, Lock, AlertCircle,
    LayoutGrid, Calendar, Wallet,
    ChevronRight, Sparkles, Clock,
    ShieldCheck, Zap, Download, Layers, PartyPopper, Check
} from "lucide-react";

// --- Types ---
interface Milestone {
    name?: string;
    title?: string;
    amount: number | string;
    isCompleted?: boolean | string;
    status?: string;
    dueDate?: string; // ব্যাকএন্ড থেকে এই নামেই ডেটা আসছে
    isPayable?: boolean; // ব্যাকএন্ডের ক্যালকুলেটেড লজিক
    isLocked?: boolean;  // ব্যাকএন্ডের ক্যালকুলেটেড লজিক
}

interface Project {
    _id: string;
    projectName?: string;
    title?: string;
    clientName?: string;
    budget: number | string;
    paidAmount: number | string;
    milestones: Milestone[];
}

export default function AdvancedClientDashboard() {
    const router = useRouter();
    const [clientData, setClientData] = useState<{ name: string; projects: Project[] } | null>(null);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
    const [paypalUrl, setPaypalUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // বাটন অ্যাক্টিভ কিনা তা চেক করার জন্য হেল্পার ফাংশন
    const isDateActive = (dateString?: string) => {
        if (!dateString) return true;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const mDate = new Date(dateString);
        const milestoneTime = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate()).getTime();
        if (isNaN(milestoneTime)) return true;
        return today >= milestoneTime;
    };

    const fetchDashboardData = async (isAutoRefresh = false) => {
        try {
            const userEmail = typeof window !== 'undefined' ? localStorage.getItem("user_email") : null;
            if (!userEmail) {
                router.push("/");
                return;
            }

            const [clientRes, settingsRes] = await Promise.all([
                axios.get(`${API_BASE}/projects?email=${userEmail}&t=${new Date().getTime()}`),
                axios.get(`${API_BASE}/settings`)
            ]);

            if (settingsRes.data?.paypalLink) {
                setPaypalUrl(settingsRes.data.paypalLink);
            }

            if (clientRes.data && Array.isArray(clientRes.data) && clientRes.data.length > 0) {
                setClientData({
                    name: clientRes.data[0]?.clientName || "Client",
                    projects: clientRes.data
                });
                setError(false);
            } else if (!isAutoRefresh) {
                setError(true);
            }
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            if (!isAutoRefresh) setError(true);
        } finally {
            if (!isAutoRefresh) setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const syncInterval = setInterval(() => fetchDashboardData(true), 30000);
        return () => clearInterval(syncInterval);
    }, [API_BASE]);

    const selectedProject = useMemo(() => {
        return clientData?.projects[selectedProjectIndex] || clientData?.projects[0] || null;
    }, [clientData, selectedProjectIndex]);

    const stats = useMemo(() => {
        if (!selectedProject) return { budget: 0, paid: 0, remaining: 0, progress: 0, isFullyPaid: false };

        const budget = Number(selectedProject.budget) || 0;
        const paid = Number(selectedProject.paidAmount) || 0;
        const remaining = Math.max(0, budget - paid);
        const progress = budget > 0 ? Math.min(100, Math.round((paid / budget) * 100)) : 0;

        return { budget, paid, remaining, progress, isFullyPaid: remaining <= 0 };
    }, [selectedProject]);

    const totalPortfolioValue = useMemo(() => {
        return clientData?.projects?.reduce((acc, curr) => acc + Number(curr.budget || 0), 0) || 0;
    }, [clientData]);

    const handlePayNow = (amount: number, dueDate?: string) => {
        if (!isDateActive(dueDate)) {
            alert("This payment is scheduled for " + dueDate);
            return;
        }
        if (!paypalUrl) return alert("Payment gateway is not configured yet. Please contact admin.");

        let finalUrl = paypalUrl;
        if (finalUrl.includes("paypal.me")) {
            const cleanUrl = finalUrl.endsWith("/") ? finalUrl.slice(0, -1) : finalUrl;
            finalUrl = `${cleanUrl}/${amount}`;
        }
        window.open(finalUrl, "_blank");
    };

    if (loading) return <LoadingScreen />;
    if (error || !clientData) return <ErrorState />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#4177BC]/20">
            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- Left Sidebar --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-[11px] font-black text-[#4177BC] uppercase tracking-[0.2em]">Active Ecosystem</h3>
                                <div className="h-1.5 w-8 bg-[#EB9C2C] rounded-full" />
                            </div>
                            <div className="space-y-3">
                                {clientData.projects.map((p, i) => (
                                    <button
                                        key={p._id || i}
                                        onClick={() => setSelectedProjectIndex(i)}
                                        className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${selectedProjectIndex === i
                                            ? 'bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/30 translate-x-2'
                                            : 'hover:bg-slate-50 text-slate-500 border border-transparent hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedProjectIndex === i ? 'bg-white/20' : 'bg-slate-100'}`}>
                                            <LayoutGrid size={18} className={selectedProjectIndex === i ? 'text-white' : 'text-[#4177BC]'} />
                                        </div>
                                        <div className="text-left flex-1 truncate">
                                            <p className="text-sm font-bold truncate">{p.title || p.projectName}</p>
                                            <p className="text-[10px] opacity-60">ID: {p._id?.slice(-6).toUpperCase()}</p>
                                        </div>
                                        {selectedProjectIndex === i && <ChevronRight size={16} className="text-[#EB9C2C]" />}
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="bg-[#4177BC] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-[#4177BC]/30">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <Zap className="absolute -right-4 -bottom-4 opacity-10" size={120} />
                            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Total Portfolio Value</p>
                            <h2 className="text-4xl font-bold mb-8">
                                ${totalPortfolioValue.toLocaleString()}
                            </h2>
                            <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/20">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase">Verified Assets</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Content --- */}
                    <div className="lg:col-span-8 space-y-8">

                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            {stats.isFullyPaid && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white px-10 py-2 rotate-45 translate-x-8 translate-y-4 shadow-md z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                                <div>
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg mb-3 inline-block ${stats.isFullyPaid ? 'bg-green-100 text-green-600' : 'bg-[#EB9C2C]/10 text-[#EB9C2C]'}`}>
                                        {stats.isFullyPaid ? "Asset Fully Secured" : "Project Intelligence"}
                                    </span>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                                        {selectedProject?.title || selectedProject?.projectName || "Select Project"}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-medium">
                                        <Clock size={14} className="text-[#4177BC]" />
                                        {stats.isFullyPaid ? "All payments cleared successfully" : "Real-time payment tracking active"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Equity Paid</p>
                                        <p className={`text-2xl font-black ${stats.isFullyPaid ? 'text-green-600' : 'text-[#4177BC]'}`}>{stats.progress}%</p>
                                    </div>
                                    <div className="relative w-16 h-16">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200" />
                                            <motion.circle
                                                cx="32" cy="32" r="28"
                                                stroke="currentColor" strokeWidth="6"
                                                fill="transparent"
                                                strokeDasharray={175.9}
                                                initial={{ strokeDashoffset: 175.9 }}
                                                animate={{ strokeDashoffset: 175.9 - (175.9 * stats.progress) / 100 }}
                                                className={stats.isFullyPaid ? "text-green-500" : "text-[#EB9C2C]"}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {stats.isFullyPaid ? <Check size={20} className="text-green-600" /> : <Sparkles size={16} className="text-[#EB9C2C]" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                <StatCard label="Total Budget" value={stats.budget} />
                                <StatCard label="Contribution" value={stats.paid} highlight />
                                <div className={`p-6 rounded-3xl border-2 transition-all ${stats.isFullyPaid ? 'bg-green-50 border-green-200' : 'bg-[#EB9C2C]/5 border-[#EB9C2C]/20'}`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${stats.isFullyPaid ? 'text-green-600' : 'text-[#EB9C2C]'}`}>
                                        {stats.isFullyPaid ? "Payment Status" : "Outstanding"}
                                    </p>
                                    <p className={`text-2xl font-bold ${stats.isFullyPaid ? 'text-green-600' : 'text-slate-800'}`}>
                                        {stats.isFullyPaid ? "SUCCESSFUL" : `$${stats.remaining.toLocaleString()}`}
                                    </p>
                                </div>
                            </div>

                            {!stats.isFullyPaid && (
                                <button
                                    onClick={() => handlePayNow(stats.remaining)}
                                    className="w-full py-5 bg-[#4177BC] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#35629c] transition-all shadow-xl shadow-[#4177BC]/20 group"
                                >
                                    <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                                    Secure Settlement (${stats.remaining.toLocaleString()})
                                </button>
                            )}
                            {stats.isFullyPaid && (
                                <div className="w-full py-5 bg-green-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl shadow-green-200">
                                    <PartyPopper size={20} /> Project Fully Funded
                                </div>
                            )}
                        </div>

                        {/* --- Milestones Section --- */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#EB9C2C] rounded-lg">
                                        <Target size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Project Milestones</h3>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-1 rounded-full uppercase">Verified Ledger</span>
                            </div>

                            <div className="space-y-4">
                                {selectedProject?.milestones?.map((m, i) => {
                                    // BACKEND FIX: m.dueDate ব্যবহার করা হয়েছে
                                    const isCompleted = m.isCompleted === true || m.isCompleted === "true" || m.status?.toLowerCase() === "paid" || m.status?.toLowerCase() === "completed";
                                    
                                    // BACKEND FIX: সরাসরি ব্যাকএন্ড থেকে আসা isPayable লজিক ব্যবহার করা হয়েছে
                                    const canPay = m.isPayable; 
                                    const isLocked = m.isLocked;

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={i}
                                            className={`group flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${isCompleted ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-50 hover:border-[#4177BC]/20 shadow-sm'
                                                }`}
                                        >
                                            <div className="flex items-center gap-6 w-full md:w-auto">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-100 text-[#4177BC]'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle2 size={24} /> : `0${i + 1}`}
                                                </div>
                                                <div>
                                                    <h4 className={`text-base font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                        {m.name || m.title}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md ${isCompleted ? 'bg-green-100 text-green-600' : (canPay ? 'bg-blue-100 text-[#4177BC]' : 'bg-amber-100 text-amber-600')}`}>
                                                            {isCompleted ? 'SUCCESSFUL' : (isLocked ? 'LOCKED' : 'READY TO PAY')}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Valued at ${Number(m.amount).toLocaleString()}</span>
                                                        
                                                        {/* BACKEND FIX: m.dueDate এখানে ডিসপ্লে করা হচ্ছে */}
                                                        {!isCompleted && m.dueDate && (
                                                            <span className="text-[9px] text-[#EB9C2C] font-bold bg-[#EB9C2C]/10 px-2 py-0.5 rounded flex items-center gap-1">
                                                                <Calendar size={10} /> Schedule: {m.dueDate}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                                                {!isCompleted ? (
                                                    <button
                                                        disabled={!canPay}
                                                        onClick={() => handlePayNow(Number(m.amount), m.dueDate)}
                                                        className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm border-2 ${canPay
                                                            ? 'bg-white border-[#4177BC] text-[#4177BC] hover:bg-[#4177BC] hover:text-white cursor-pointer'
                                                            : 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed grayscale'
                                                            }`}
                                                    >
                                                        {canPay ? 'Pay Now' : <Lock size={12} />}
                                                        <ArrowRight size={14} className={canPay ? "translate-x-0" : "opacity-50"} />
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 text-green-600">
                                                            <ShieldCheck size={14} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                                        </div>
                                                        <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 shadow-sm">
                                                            <Download size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- Helper Components ---
function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-slate-100 transition-colors">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${highlight ? 'text-[#4177BC]' : 'text-slate-400'}`}>{label}</p>
            <p className="text-2xl font-bold text-slate-800">${value.toLocaleString()}</p>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-[#4177BC] border-r-[#EB9C2C] rounded-full animate-spin" />
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-[#4177BC] animate-pulse">Synchronizing Intelligence...</p>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Access Interrupted</h2>
                <p className="text-slate-500 mb-8 text-sm font-medium">We couldn&apos;t verify your project credentials.</p>
                <button onClick={() => window.location.reload()} className="w-full bg-[#4177BC] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg">
                    Retry Connection
                </button>
            </div>
        </div>
    );
}