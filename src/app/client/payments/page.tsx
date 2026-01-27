/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, Download, Clock, CheckCircle2,
    FileText, Wallet, Zap, Target,
    ShieldCheck, Info, Calendar, MessageSquare, 
    TrendingUp, ArrowRight, Lock, AlertCircle, RefreshCcw, ExternalLink
} from "lucide-react";

export default function ClientDashboard() {
    const router = useRouter();
    const [clientData, setClientData] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [paypalUrl, setPaypalUrl] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const userEmail = localStorage.getItem("user_email");
                
                if (!userEmail) {
                    router.push("/");
                    return;
                }

                // 1. Fetch Client Data & Settings concurrently
                const [clientRes, settingsRes] = await Promise.all([
                    axios.get(`${API_BASE}/clinets`),
                    axios.get(`${API_BASE}/settings`)
                ]);

                // 2. Filter data for current user
                const myProfile = clientRes.data.find((c: any) => c.email === userEmail);

                if (settingsRes.data?.paypalLink) {
                    setPaypalUrl(settingsRes.data.paypalLink);
                }

                if (myProfile) {
                    setClientData(myProfile);
                    // প্রজেক্ট লিস্ট থাকলে প্রথমটি সিলেক্ট করো
                    if (myProfile.projects && myProfile.projects.length > 0) {
                        setSelectedProject(myProfile.projects[0]);
                    }
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [API_BASE, router]);

    // Financial calculations based on dynamic data
    const budget = Number(selectedProject?.budget) || 0;
    const paid = Number(selectedProject?.paidAmount) || 0;
    const due = Math.max(0, budget - paid);
    const completionPercentage = budget > 0 ? Math.round((paid / budget) * 100) : 0;
    const nextMilestone = selectedProject?.milestones?.find((m: any) => !m.isCompleted);

    const handleSecurePayment = () => {
        if (!paypalUrl) {
            alert("Payment gateway is currently being updated. Please contact support.");
            return;
        }
        let finalPayUrl = paypalUrl;
        if (finalPayUrl.includes("paypal.me")) {
            const cleanUrl = finalPayUrl.endsWith("/") ? finalPayUrl.slice(0, -1) : finalPayUrl;
            finalPayUrl = `${cleanUrl}/${due}`;
        }
        window.open(finalPayUrl, "_blank");
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorState />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-[#4177BC]/10">
            <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
                
                {/* --- HEADER / PROJECT SELECTOR --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                            Project <span className="text-[#4177BC]">Control</span>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {selectedProject?._id?.slice(-8) || 'N/A'}</p>
                    </div>
                    
                    {/* যদি একাধিক প্রজেক্ট থাকে তবে এখানে সিলেক্টর দেখানো হবে */}
                    {clientData?.projects?.length > 1 && (
                        <select 
                            onChange={(e) => setSelectedProject(clientData.projects.find((p:any) => p.projectName === e.target.value))}
                            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 ring-[#4177BC]/20"
                        >
                            {clientData.projects.map((p: any, i: number) => (
                                <option key={i} value={p.projectName}>{p.projectName}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* --- HERO SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            className="h-full rounded-[3rem] bg-slate-900 p-10 md:p-14 relative overflow-hidden text-white shadow-2xl shadow-slate-200"
                        >
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#4177BC]/20 rounded-full blur-[100px]"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-widest mb-10 border border-white/10">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        {selectedProject?.status || 'Active Execution'}
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-[1000] tracking-tighter leading-[0.9] mb-10 uppercase italic">
                                        {selectedProject?.projectName || 'Project Title'}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button className="bg-[#4177BC] hover:bg-white hover:text-slate-950 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all shadow-xl shadow-[#4177BC]/20 flex items-center gap-3">
                                        <Zap size={18} fill="currentColor" /> Live Feed
                                    </button>
                                    <button className="bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] transition-all border border-white/10 flex items-center gap-3 group">
                                        <FileText size={18} /> Documentation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                        <StatCard label="Total Budget" value={`$${budget.toLocaleString()}`} icon={<Target />} color="indigo" trend="Fixed" />
                        <StatCard label="Total Paid" value={`$${paid.toLocaleString()}`} icon={<CheckCircle2 />} color="green" trend="Cleared" />
                        <StatCard label="Completion" value={`${completionPercentage}%`} icon={<TrendingUp />} color="blue" trend="Live" />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                    {/* --- ROADMAP --- */}
                    <div className="xl:col-span-8 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h3 className="text-3xl font-[1000] uppercase tracking-tighter italic text-slate-900">Project Roadmap</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Milestone Tracking</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {selectedProject?.milestones?.length > 0 ? (
                                    selectedProject.milestones.map((m: any, i: number) => (
                                        <MilestoneRow key={i} milestone={m} index={i} />
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">No Milestones Data Available</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <QuickAction icon={<MessageSquare size={20} />} label="Inquiry" sub="Talk to Expert" />
                            <QuickAction icon={<Clock size={20} />} label="Calendar" sub="View Deadlines" />
                            <QuickAction icon={<ShieldCheck size={20} />} label="Security" sub="Data Privacy" />
                        </div>
                    </div>

                    {/* --- PAYMENT HUB --- */}
                    <div className="xl:col-span-4 sticky top-32">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-2xl shadow-slate-200 overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-[#4177BC]"></div>
                            <div className="flex justify-between items-start mb-12">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Payment terminal</h4>
                                    <p className="text-sm font-black text-slate-900 italic">Financial Settlement</p>
                                </div>
                                <div className="bg-slate-900 p-3 rounded-2xl text-white"><Lock size={18} /></div>
                            </div>

                            <div className="mb-12">
                                <p className="text-[11px] font-black text-[#4177BC] uppercase tracking-widest mb-3">Amount to be Cleared</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-7xl font-[1000] tracking-tighter text-slate-950">${due.toLocaleString()}</span>
                                    <span className="text-slate-400 font-black text-lg italic uppercase">USD</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSecurePayment}
                                disabled={due <= 0}
                                className={`w-full group relative ${due <= 0 ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed border border-emerald-100' : 'bg-[#4177BC] text-white hover:bg-slate-950'} p-7 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500`}
                            >
                                <span className="flex items-center justify-center gap-3">
                                    {due <= 0 ? "Account Cleared" : "Proceed to Payment"}
                                    {due > 0 && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
                                </span>
                            </button>

                            <div className="mt-10 flex items-center justify-center gap-6 grayscale opacity-30">
                                <span className="text-[9px] font-black tracking-widest uppercase">SSL Secured</span>
                                <span className="text-[9px] font-black tracking-widest uppercase">PayPal Verified</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Sub-components stay essentially the same but with the #4177BC theme
function StatCard({ label, value, icon, color, trend }: any) {
    const colorMap: any = {
        indigo: "text-[#4177BC] bg-blue-50 border-blue-100",
        green: "text-emerald-600 bg-emerald-50 border-emerald-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100"
    };
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:border-[#4177BC]/30 transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${colorMap[color]} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(icon, { size: 28, strokeWidth: 2.5 })}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-[1000] text-slate-900 tracking-tighter italic mt-1 leading-none">{value}</h3>
            </div>
        </div>
    );
}

function MilestoneRow({ milestone, index }: any) {
    const isDone = milestone.isCompleted;
    return (
        <div className={`p-6 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 border-2 ${isDone ? 'bg-slate-50/50 border-transparent' : 'bg-white border-slate-100 hover:border-[#4177BC]/20 hover:shadow-xl hover:shadow-slate-100'} transition-all`}>
            <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${isDone ? 'bg-[#4177BC] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {isDone ? <CheckCircle2 size={24} /> : index + 1}
                </div>
                <div>
                    <h4 className={`text-sm font-black uppercase italic ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{milestone.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Target: {milestone.dueDate || 'ASAP'}</p>
                </div>
            </div>
            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <p className={`text-xl font-black ${isDone ? 'text-slate-300' : 'text-slate-950'}`}>${Number(milestone.amount).toLocaleString()}</p>
                <span className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest border ${isDone ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {isDone ? 'Finished' : 'Upcoming'}
                </span>
            </div>
        </div>
    );
}

function QuickAction({ icon, label, sub }: any) {
    return (
        <button className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-[#4177BC]/30 hover:shadow-lg transition-all text-left w-full group">
            <div className="p-4 rounded-2xl bg-slate-50 group-hover:bg-[#4177BC]/5 group-hover:text-[#4177BC] text-slate-400 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-xs font-black text-slate-900 uppercase">{label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
            </div>
        </button>
    );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-4 border-slate-50 border-t-[#4177BC] rounded-full mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Syncing Project Data</p>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-10">
            <div className="text-center max-w-sm">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
                <h2 className="text-2xl font-black uppercase italic mb-2 text-slate-900">Access Denied</h2>
                <p className="text-slate-500 text-sm mb-8 font-medium">Could not retrieve project data for this account. Please verify your credentials.</p>
                <button onClick={() => window.location.reload()} className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Retry Session</button>
            </div>
        </div>
    );
}