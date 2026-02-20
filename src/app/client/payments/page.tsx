/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
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

export default function AdvancedClientDashboard() {
    const router = useRouter();
    const [clientData, setClientData] = useState<any>(null);
    const [selectedProjectIndex, setSelectedProjectIndex] = useState(0); 
    const [paypalUrl, setPaypalUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchDashboardData = async (isAutoRefresh = false) => {
        try {
            const userEmail = localStorage.getItem("user_email");
            if (!userEmail) { router.push("/"); return; }

            // ট্যাগিং র্যান্ডম টাইমস্ট্যাম্প যাতে ক্যাশ থেকে ডাটা না আসে
            const [clientRes, settingsRes] = await Promise.all([
                axios.get(`${API_BASE}/projects?email=${userEmail}&t=${new Date().getTime()}`),
                axios.get(`${API_BASE}/settings`)
            ]);

            if (settingsRes.data?.paypalLink) setPaypalUrl(settingsRes.data.paypalLink);

            if (clientRes.data && Array.isArray(clientRes.data)) {
                setClientData({
                    name: clientRes.data[0]?.clientName || "Client",
                    projects: clientRes.data
                });
            } else if (!isAutoRefresh) {
                setError(true);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
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

    const selectedProject = clientData?.projects ? clientData.projects[selectedProjectIndex] : null;

    // --- পেমেন্ট লজিক ---
    const handlePayNow = (amount: number, title?: string) => {
        if (!paypalUrl) return alert("Payment link not configured.");
        let finalUrl = paypalUrl;
        if (finalUrl.includes("paypal.me")) {
            const cleanUrl = finalUrl.endsWith("/") ? finalUrl.slice(0, -1) : finalUrl;
            finalUrl = `${cleanUrl}/${amount}`;
        }
        window.open(finalUrl, "_blank");
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorState />;

    const budget = Number(selectedProject?.budget) || 0;
    const paid = Number(selectedProject?.paidAmount) || 0; 
    const remaining = Math.max(0, budget - paid);
    
    // প্রগ্রেস বার ক্যালকুলেশন
    const progressPercent = budget > 0 ? Math.min(100, Math.round((paid / budget) * 100)) : 0;
    const isProjectFullyPaid = remaining <= 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#4177BC]/20">
            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- বাম পাশের প্রজেক্ট লিস্ট --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-[11px] font-black text-[#4177BC] uppercase tracking-[0.2em]">Active Ecosystem</h3>
                                <div className="h-1.5 w-8 bg-[#EB9C2C] rounded-full" />
                            </div>
                            <div className="space-y-3">
                                {clientData?.projects?.map((p: any, i: number) => (
                                    <button 
                                        key={i}
                                        onClick={() => setSelectedProjectIndex(i)}
                                        className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                                            selectedProjectIndex === i 
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
                                ${Number(clientData?.projects?.reduce((acc:any, curr:any) => acc + Number(curr.budget || 0), 0)).toLocaleString()}
                            </h2>
                            <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md border border-white/20">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] font-black uppercase">Verified Assets</span>
                            </div>
                        </div>
                    </div>

                    {/* --- ডান পাশের প্রজেক্ট ডিটেইলস --- */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            {isProjectFullyPaid && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white px-10 py-2 rotate-45 translate-x-8 translate-y-4 shadow-md">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Completed</span>
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                                <div>
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg mb-3 inline-block ${isProjectFullyPaid ? 'bg-green-100 text-green-600' : 'bg-[#EB9C2C]/10 text-[#EB9C2C]'}`}>
                                        {isProjectFullyPaid ? "Asset Fully Secured" : "Project Intelligence"}
                                    </span>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedProject?.title || selectedProject?.projectName || "Select Project"}</h2>
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-medium">
                                        <Clock size={14} className="text-[#4177BC]" /> 
                                        {isProjectFullyPaid ? "All payments cleared successfully" : "Real-time payment tracking active"}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-5 bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Equity Paid</p>
                                        <p className={`text-2xl font-black ${isProjectFullyPaid ? 'text-green-600' : 'text-[#4177BC]'}`}>{progressPercent}%</p>
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
                                                animate={{ strokeDashoffset: 175.9 - (175.9 * progressPercent) / 100 }}
                                                className={isProjectFullyPaid ? "text-green-500" : "text-[#EB9C2C]"} 
                                                strokeLinecap="round" 
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {isProjectFullyPaid ? <Check size={20} className="text-green-600" /> : <Sparkles size={16} className="text-[#EB9C2C]" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                <StatCard label="Total Budget" value={budget} />
                                <StatCard label="Contribution" value={paid} highlight />
                                <div className={`p-6 rounded-3xl border-2 transition-all ${isProjectFullyPaid ? 'bg-green-50 border-green-200' : 'bg-[#EB9C2C]/5 border-[#EB9C2C]/20'}`}>
                                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isProjectFullyPaid ? 'text-green-600' : 'text-[#EB9C2C]'}`}>
                                        {isProjectFullyPaid ? "Payment Status" : "Outstanding"}
                                    </p>
                                    <p className={`text-2xl font-bold ${isProjectFullyPaid ? 'text-green-600' : 'text-slate-800'}`}>
                                        {isProjectFullyPaid ? "SUCCESSFUL" : `$${remaining.toLocaleString()}`}
                                    </p>
                                </div>
                            </div>

                            {!isProjectFullyPaid ? (
                                <button 
                                    onClick={() => handlePayNow(remaining, "Project Settlement")}
                                    className="w-full py-5 bg-[#4177BC] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#35629c] transition-all shadow-xl shadow-[#4177BC]/20 group"
                                >
                                    <Lock size={16} className="group-hover:rotate-12 transition-transform" /> 
                                    Secure Settlement (${remaining.toLocaleString()})
                                </button>
                            ) : (
                                <div className="w-full py-5 bg-green-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl shadow-green-200">
                                    <PartyPopper size={20} /> Project Fully Funded
                                </div>
                            )}
                        </div>

                        {/* --- মাইলস্টোন সেকশন --- */}
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
                                {selectedProject?.milestones?.length > 0 ? (
                                    selectedProject.milestones.map((m: any, i: number) => {
                                        const isCompleted = m.isCompleted === true || m.isCompleted === "true" || m.status?.toLowerCase() === "paid" || m.status?.toLowerCase() === "completed";
                                        
                                        return (
                                            <div key={i} className={`group flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                                                isCompleted ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-50 hover:border-[#4177BC]/20 shadow-sm'
                                            }`}>
                                                <div className="flex items-center gap-6 w-full md:w-auto">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                                                        isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-100 text-[#4177BC]'
                                                    }`}>
                                                        {isCompleted ? <CheckCircle2 size={24} /> : `0${i + 1}`}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-base font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                            {m.name || m.title}
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-[#4177BC]/10 text-[#4177BC]'}`}>
                                                                {isCompleted ? 'SUCCESSFUL' : 'PENDING'}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Valued at ${Number(m.amount).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                                                    {!isCompleted ? (
                                                        <button 
                                                            onClick={() => handlePayNow(Number(m.amount), m.name || m.title)}
                                                            className="px-8 py-3.5 bg-white border-2 border-[#4177BC] text-[#4177BC] hover:bg-[#4177BC] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                                                        >
                                                            Pay Now <ArrowRight size={14} />
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-1.5 text-green-600">
                                                                <ShieldCheck size={14} />
                                                                <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                                                            </div>
                                                            <button className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                                                                <Download size={16} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
                                        <Layers className="mx-auto text-slate-200 mb-4" size={48} />
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No Milestones Recorded</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- হেল্পার কম্পোনেন্ট ---
function StatCard({ label, value, highlight }: any) {
    return (
        <div className="p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-slate-100 transition-colors">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${highlight ? 'text-[#4177BC]' : 'text-slate-400'}`}>{label}</p>
            <p className="text-2xl font-bold text-slate-800">${Number(value).toLocaleString()}</p>
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
                <p className="text-slate-500 mb-8 text-sm font-medium">We couldnot verify your project credentials. This might be due to a network error or missing data.</p>
                <button onClick={() => window.location.reload()} className="w-full bg-[#4177BC] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg">Retry Connection</button>
            </div>
        </div>
    );
}