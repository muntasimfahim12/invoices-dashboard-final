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
    ShieldCheck, Zap, Download, Layers
} from "lucide-react";

export default function AdvancedClientDashboard() {
    const router = useRouter();
    const [clientData, setClientData] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [paypalUrl, setPaypalUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // BRAND COLORS
    const COLORS = {
        white: "#FFFFFF",
        blue: "#4177BC",
        orange: "#EB9C2C"
    };

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userEmail = localStorage.getItem("user_email");
                if (!userEmail) { router.push("/"); return; }

                const [clientRes, settingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/clinets`),
                    axios.get(`${API_BASE}/settings`)
                ]);

                const myProfile = clientRes.data.find((c: any) => c.email === userEmail);
                if (settingsRes.data?.paypalLink) setPaypalUrl(settingsRes.data.paypalLink);

                if (myProfile) {
                    setClientData(myProfile);
                    if (myProfile.projects?.length > 0) setSelectedProject(myProfile.projects[0]);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [API_BASE, router]);

    const handlePayNow = (amount: number, note?: string) => {
        if (!paypalUrl) return alert("Payment link not configured.");
        let finalUrl = paypalUrl;
        if (finalUrl.includes("paypal.me")) {
            const cleanUrl = finalUrl.endsWith("/") ? finalUrl.slice(0, -1) : finalUrl;
            finalUrl = `${cleanUrl}/${amount}`;
        }
        window.open(finalUrl, "_blank");
    };

    if (loading) return <LoadingScreen colors={COLORS} />;
    if (error) return <ErrorState colors={COLORS} />;

    const budget = Number(selectedProject?.budget) || 0;
    const paid = Number(selectedProject?.paidAmount) || 0;
    const remaining = budget - paid;
    const progressPercent = budget > 0 ? Math.round((paid / budget) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#F4F7FA] text-slate-900 font-sans selection:bg-[#4177BC]/20">
            {/* Top Navigation Bar */}
           

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* --- LEFT SIDEBAR --- */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* PROJECT SELECTOR */}
                        <section className="bg-[#FFFFFF] rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-[11px] font-black text-[#4177BC] uppercase tracking-[0.2em]">Your Ecosystem</h3>
                                <div className="h-1 w-12 bg-[#EB9C2C] rounded-full" />
                            </div>
                            <div className="space-y-3">
                                {clientData?.projects?.map((p: any, i: number) => {
                                    const isActive = selectedProject?.projectName === p.projectName;
                                    return (
                                        <button 
                                            key={i}
                                            onClick={() => setSelectedProject(p)}
                                            className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                                                isActive ? 'bg-[#4177BC] text-white shadow-xl shadow-[#4177BC]/30 translate-x-2' : 'hover:bg-slate-50 text-slate-500'
                                            }`}
                                        >
                                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-[#FFFFFF]/20' : 'bg-slate-100'}`}>
                                                <LayoutGrid size={20} className={isActive ? 'text-[#FFFFFF]' : 'text-[#4177BC]'} />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-sm font-bold truncate">{p.projectName}</p>
                                                <p className={`text-[10px] font-medium opacity-60`}>ID: {p._id?.slice(-8).toUpperCase()}</p>
                                            </div>
                                            {isActive && <ChevronRight size={18} className="text-[#EB9C2C]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* TOTAL INVESTMENT CARD */}
                        <div className="bg-[#4177BC] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-[#4177BC]/40">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB9C2C] opacity-10 rounded-full -mr-16 -mt-16" />
                            <Zap className="absolute -right-4 -bottom-4 opacity-10" size={120} />
                            <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-2">Portfolio Value</p>
                            <h2 className="text-4xl font-light mb-8">${Number(clientData?.totalPaid || 0).toLocaleString()}</h2>
                            <div className="flex items-center gap-2 bg-[#FFFFFF]/10 w-fit px-4 py-2 rounded-xl backdrop-blur-md">
                                <div className="w-2 h-2 rounded-full bg-[#EB9C2C] animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Assets</span>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT CONTENT --- */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* MAIN PROJECT OVERVIEW */}
                        <div className="bg-[#FFFFFF] rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
                                <div>
                                    <span className="px-3 py-1 bg-[#EB9C2C]/10 text-[#EB9C2C] text-[10px] font-black uppercase rounded-lg mb-3 inline-block">Project Intelligence</span>
                                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{selectedProject?.projectName}</h2>
                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                                        <Clock size={14} className="text-[#4177BC]" /> Live sync active
                                    </p>
                                </div>
                                <div className="flex items-center gap-5 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Equity Paid</p>
                                        <p className="text-xl font-black text-[#4177BC]">{progressPercent}%</p>
                                    </div>
                                    <div className="relative w-14 h-14">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200" />
                                            <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={150.8} strokeDashoffset={150.8 - (150.8 * progressPercent) / 100} className="text-[#EB9C2C]" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                                <div className="p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-[#4177BC]/10 transition-colors">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Budget</p>
                                    <p className="text-2xl font-bold text-slate-800">${budget.toLocaleString()}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white border-2 border-slate-50 hover:border-[#4177BC]/10 transition-colors">
                                    <p className="text-[10px] font-black text-[#4177BC] uppercase tracking-widest mb-2">Contribution</p>
                                    <p className="text-2xl font-bold text-slate-800">${paid.toLocaleString()}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-[#EB9C2C]/5 border-2 border-[#EB9C2C]/20">
                                    <p className="text-[10px] font-black text-[#EB9C2C] uppercase tracking-widest mb-2">Outstanding</p>
                                    <p className="text-2xl font-bold text-[#EB9C2C]">${remaining.toLocaleString()}</p>
                                </div>
                            </div>

                            {remaining > 0 && (
                                <button 
                                    onClick={() => handlePayNow(remaining)}
                                    className="w-full py-5 bg-[#4177BC] text-[#FFFFFF] rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#35629c] transition-all shadow-xl shadow-[#4177BC]/20 group"
                                >
                                    <Lock size={16} className="group-hover:rotate-12 transition-transform" /> 
                                    Secure Settlement (${remaining.toLocaleString()})
                                </button>
                            )}
                        </div>

                        {/* ROADMAP SECTION */}
                        <div className="bg-[#FFFFFF] rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#EB9C2C] rounded-lg">
                                        <Target size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Project Milestones</h3>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-3 py-1 rounded-full uppercase">Step-by-Step Payment</span>
                            </div>

                            <div className="space-y-4">
                                {selectedProject?.milestones?.map((m: any, i: number) => {
                                    const isCompleted = m.isCompleted;
                                    return (
                                        <div key={i} className={`group flex flex-col md:flex-row items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                                            isCompleted ? 'bg-slate-50 border-transparent opacity-70' : 'bg-white border-slate-50 hover:border-[#4177BC]/20 shadow-sm'
                                        }`}>
                                            <div className="flex items-center gap-6 w-full md:w-auto">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black transition-all ${
                                                    isCompleted ? 'bg-[#4177BC] text-white' : 'bg-slate-100 text-[#4177BC] group-hover:bg-[#EB9C2C] group-hover:text-white'
                                                }`}>
                                                    {isCompleted ? <CheckCircle2 size={24} /> : `0${i + 1}`}
                                                </div>
                                                <div>
                                                    <h4 className={`text-base font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                        {m.title}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md ${isCompleted ? 'bg-slate-200 text-slate-500' : 'bg-[#4177BC]/10 text-[#4177BC]'}`}>
                                                            {isCompleted ? 'Paid' : 'Pending'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold">VALUED AT ${Number(m.amount).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full md:w-auto mt-6 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                                                {!isCompleted ? (
                                                    <button 
                                                        onClick={() => handlePayNow(Number(m.amount), m.title)}
                                                        className="px-8 py-3.5 bg-[#FFFFFF] border-2 border-[#4177BC] text-[#4177BC] hover:bg-[#4177BC] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-blue-50"
                                                    >
                                                        Initialize Payment <ArrowRight size={14} />
                                                    </button>
                                                ) : (
                                                    <button className="px-8 py-3.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                        <Download size={14} /> Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </div>
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

// --- PREMIUM SUPPORTING COMPONENTS ---

function LoadingScreen({ colors }: any) {
    return (
        <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-[#4177BC] border-r-[#EB9C2C] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-[#4177BC]" size={32} />
                </div>
            </div>
            <p className="mt-8 text-[11px] font-black uppercase tracking-[0.8em] text-slate-400 animate-pulse">Initializing Portal</p>
        </div>
    );
}

function ErrorState({ colors }: any) {
    return (
        <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-100">
                    <AlertCircle size={48} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">SECURITY ACCESS DENIED</h2>
                <p className="text-slate-500 mb-10 font-medium leading-relaxed">Your session could not be validated against our secure ledger. Please re-authenticate or contact technical support.</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="w-full bg-[#4177BC] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#EB9C2C] transition-all shadow-xl shadow-[#4177BC]/20"
                >
                    Reconnect to Server
                </button>
            </div>
        </div>
    );
}