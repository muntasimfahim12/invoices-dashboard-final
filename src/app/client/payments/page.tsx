/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, Download, Clock, CheckCircle2,
    FileText, Wallet, Zap, LayoutDashboard, Target,
    ShieldCheck, Info, Calendar, Mail, Phone,
    TrendingUp, ChevronDown, Layers, ArrowRight,
    Lock, AlertCircle, RefreshCcw, ExternalLink,
    MessageSquare, Bell
} from "lucide-react";
import Link from "next/link";

export default function ClientDashboard() {
    const router = useRouter();
    const [clientData, setClientData] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const response = await axios.get(`${API_BASE}/clinets`);
                // Amra ekhane shudhu shesh client-ti nicchi jemon apnar logic-e chilo
                const myProfile = response.data[response.data.length - 1];

                if (myProfile) {
                    setClientData(myProfile);
                    if (myProfile.projects?.length > 0) {
                        setSelectedProject(myProfile.projects[0]);
                    }
                } else { setError(true); }
            } catch (err) {
                console.error("Critical API Error:", err);
                setError(true);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorState />;

    // Financial calculations
    const budget = Number(selectedProject?.budget) || 0;
    const paid = Number(selectedProject?.paidAmount) || 0;
    const due = budget - paid;
    const completionPercentage = budget > 0 ? Math.round((paid / budget) * 100) : 0;
    const nextMilestone = selectedProject?.milestones?.find((m: any) => !m.isCompleted);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
            
            {/* --- ULTRA-MODERN NAV --- */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-200/60 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="w-11 h-11 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-slate-300 group-hover:scale-105 transition-transform">
                                <LayoutDashboard size={22} strokeWidth={2.5} />
                            </div>
                            <h1 className="font-[1000] text-2xl tracking-tighter uppercase italic">
                                CORE<span className="text-[#4177BC]">HUB</span>
                            </h1>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 hidden lg:block"></div>
                        <div className="hidden lg:flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Secure Server Connected
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Dot */}
                        <button className="p-3 hover:bg-slate-100 rounded-full transition-colors relative text-slate-500">
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="relative group">
                            <button className="flex items-center gap-3 bg-white hover:border-[#4177BC] px-4 py-2 rounded-2xl transition-all border-2 border-slate-100 shadow-sm hover:shadow-md">
                                <Layers size={18} className="text-[#4177BC]" />
                                <div className="text-left hidden sm:block">
                                    <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Current Stack</p>
                                    <p className="text-sm font-black truncate max-w-[150px] italic">{selectedProject?.name}</p>
                                </div>
                                <ChevronDown size={16} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                            </button>
                            
                            <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] p-4">
                                <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">Switch Workspace</p>
                                {clientData.projects?.map((proj: any) => (
                                    <button
                                        key={proj._id}
                                        onClick={() => setSelectedProject(proj)}
                                        className={`w-full text-left p-4 rounded-2xl mb-1 flex items-center gap-4 transition-all ${selectedProject?._id === proj._id ? 'bg-blue-50/50 text-[#4177BC]' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-2.5 h-2.5 rounded-full ${selectedProject?._id === proj._id ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'bg-slate-200'}`} />
                                        <span className="text-sm font-bold">{proj.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
                
                {/* --- HERO DASHBOARD --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            className="h-full rounded-[3rem] bg-slate-900 p-10 md:p-14 relative overflow-hidden text-white shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)]"
                        >
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-widest mb-10 border border-white/10">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        {selectedProject?.status || 'In Progress'} Phase
                                    </div>
                                    <h2 className="text-5xl md:text-8xl font-[1000] tracking-tighter leading-[0.85] mb-10">
                                        Elevating <br /> <span className="text-[#4177BC] italic">{selectedProject?.name}</span>
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-[#4177BC] hover:bg-white hover:text-slate-950 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-2xl shadow-blue-500/30 flex items-center gap-3">
                                        <Zap size={18} fill="currentColor" /> Request Update
                                    </button>
                                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all border border-white/10 flex items-center gap-3 group">
                                        <FileText size={18} /> Review Assets <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                        <StatCard label="Contract Value" value={`$${budget.toLocaleString()}`} icon={<Target />} color="indigo" trend="+2.4%" />
                        <StatCard label="Amount Settled" value={`$${paid.toLocaleString()}`} icon={<CheckCircle2 />} color="green" trend="Live" />
                        <StatCard label="Milestone Completion" value={`${completionPercentage}%`} icon={<TrendingUp />} color="blue" trend="On Track" />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                    
                    {/* --- LEFT: MILESTONES --- */}
                    <div className="xl:col-span-8 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h3 className="text-3xl font-[1000] uppercase tracking-tighter italic text-slate-900">Project Roadmap</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Verified Delivery Schedule</p>
                                </div>
                                <div className="hidden md:flex gap-2">
                                    <button className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"><Download size={18} /></button>
                                    <button className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"><ExternalLink size={18} /></button>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {selectedProject?.milestones?.map((m: any, i: number) => (
                                    <MilestoneRow key={i} milestone={m} index={i} />
                                ))}
                            </div>
                        </div>

                        {/* QUICK ACTION BAR */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <QuickAction icon={<MessageSquare size={20} />} label="Live Chat" sub="Speak to PM" color="blue" />
                            <QuickAction icon={<Clock size={20} />} label="Timeline" sub="View Calendar" color="slate" />
                            <QuickAction icon={<ShieldCheck size={20} />} label="Security" sub="Review Terms" color="emerald" />
                        </div>
                    </div>

                    {/* --- RIGHT: FINANCIAL TERMINAL --- */}
                    <div className="xl:col-span-4 sticky top-32">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-[#4177BC] to-indigo-500"></div>
                            
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Financial Hub</h4>
                                    <p className="text-sm font-black text-slate-900 italic">Settlement Portal</p>
                                </div>
                                <div className="bg-slate-900 p-3 rounded-2xl text-white"><Lock size={20} /></div>
                            </div>

                            <div className="mb-12">
                                <p className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-3">Outstanding Balance</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-[1000] tracking-tighter text-slate-950">${due.toLocaleString()}</span>
                                    <span className="text-slate-400 font-bold text-lg italic uppercase">USD</span>
                                </div>
                                {nextMilestone && (
                                     <div className="mt-6 flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                                        <Info size={16} className="text-blue-500" />
                                        <p className="text-[10px] font-bold uppercase text-blue-700 italic leading-tight">Allocation: {nextMilestone.title}</p>
                                     </div>
                                )}
                            </div>

                            <button
                                onClick={() => router.push(`/client/payments`)}
                                disabled={due === 0}
                                className={`w-full group relative ${due === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#4177BC] text-white hover:bg-slate-950'} p-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl shadow-blue-500/10`}
                            >
                                <span className="flex items-center justify-center gap-3 relative z-10">
                                    {due === 0 ? "Account Fully Settled" : "Initiate Secure Payment"}
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>

                            <div className="mt-10 flex items-center justify-center gap-6 grayscale opacity-40">
                                <span className="text-[10px] font-black tracking-widest">VISA</span>
                                <span className="text-[10px] font-black tracking-widest">STRIPE</span>
                                <span className="text-[10px] font-black tracking-widest">PAYPAL</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- REUSABLE COMPONENTS ---

function StatCard({ label, value, icon, color, trend }: any) {
    const colors: any = {
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        green: "text-emerald-600 bg-emerald-50 border-emerald-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100"
    };
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-blue-200 transition-colors">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${colors[color]} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
            </div>
            <div>
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
                    <span className="text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500">{trend}</span>
                </div>
                <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter italic mt-1 leading-none">{value}</h3>
            </div>
        </div>
    );
}

function MilestoneRow({ milestone, index }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
            className={`group p-6 rounded-[2.5rem] transition-all flex flex-col md:flex-row justify-between items-center gap-6 border-2 ${milestone.isCompleted ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5'}`}
        >
            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base ${milestone.isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'} transition-colors`}>
                    {milestone.isCompleted ? <CheckCircle2 size={24} strokeWidth={3} /> : index + 1}
                </div>
                <div>
                    <h4 className={`text-sm font-black uppercase tracking-tight italic ${milestone.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {milestone.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                        <Calendar size={12} className="text-slate-300" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due: {milestone.dueDate || 'TBD'}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                    <p className={`text-xl font-[1000] tracking-tighter ${milestone.isCompleted ? 'text-slate-300' : 'text-slate-950'}`}>${milestone.amount?.toLocaleString()}</p>
                </div>
                <div className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border ${milestone.isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-500 border-slate-200'}`}>
                    {milestone.isCompleted ? 'Finalized' : 'Payable'}
                </div>
            </div>
        </motion.div>
    );
}

function QuickAction({ icon, label, sub, color }: any) {
    return (
        <button className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all text-left w-full group">
            <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 transition-colors`}>
                {icon}
            </div>
            <div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
            </div>
        </button>
    );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-[3px] border-slate-50 border-t-[#4177BC] rounded-full"
                />
                <div className="absolute font-black text-[10px] italic">CH</div>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 animate-pulse">Establishing Secure Session</p>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-10 text-center font-sans">
            <div className="max-w-md">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertCircle size={44} strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-[1000] uppercase tracking-tighter text-slate-900 mb-4">Auth Sync Failed</h2>
                <p className="text-slate-500 font-medium leading-relaxed mb-10">We couldnt securely handshake with the core server. This might be due to a network interruption.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-3 bg-slate-950 text-white px-10 py-5 rounded-2xl mx-auto font-black text-xs uppercase tracking-widest hover:bg-[#4177BC] transition-all shadow-2xl shadow-slate-300"
                >
                    <RefreshCcw size={18} /> Re-establish Connection
                </button>
            </div>
        </div>
    );
}