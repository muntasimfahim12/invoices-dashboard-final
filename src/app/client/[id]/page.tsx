/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard, Download, Clock, CheckCircle2,
    FileText, Wallet, Zap, Target,
    ShieldCheck, Info, Calendar, MessageSquare, 
    TrendingUp, ArrowRight, Lock, AlertCircle, 
    RefreshCcw, ExternalLink, ChevronRight, PieChart
} from "lucide-react";

export default function ClientDynamicDashboard() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // ১. ক্লায়েন্টের সব প্রজেক্ট থেকে নির্দিষ্ট প্রজেক্ট ফিল্টার করা
                const clientRes = await axios.get(`${API_BASE}/clinets`);
                // আপনার ডাটাবেজ স্ট্রাকচার অনুযায়ী ইমেইল বা আইডি দিয়ে ফিল্টার
                const userEmail = localStorage.getItem("user_email");
                const currentClient = clientRes.data.find((c: any) => c.email === userEmail);
                
                // নির্দিষ্ট প্রজেক্ট খুঁজে বের করা
                const currentProject = currentClient?.projects?.find((p: any) => p._id === id || p.id === id);

                // ২. গ্লোবাল সেটিংস (পেমেন্ট গেটওয়ে লিঙ্কের জন্য)
                const settingsRes = await axios.get(`${API_BASE}/settings`);
                
                if (currentProject) {
                    setProject(currentProject);
                    setSettings(settingsRes.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id, API_BASE]);

    // Financial calculations
    const budget = Number(project?.budget) || 0;
    const paid = Number(project?.paidAmount) || 0;
    const due = Math.max(0, budget - paid);
    const progress = budget > 0 ? Math.round((paid / budget) * 100) : 0;

    // পেমেন্ট হ্যান্ডলার (ডায়নামিক অ্যামাউন্ট সহ)
    const handlePayment = (amount: number, note: string) => {
        if (!settings?.paypalLink) {
            alert("Payment gateway not configured by admin.");
            return;
        }
        let url = settings.paypalLink;
        // PayPal.me হলে অটোমেটিক অ্যামাউন্ট যোগ করা
        if (url.includes("paypal.me")) {
            url = `${url.endsWith("/") ? url : url + "/"}${amount}`;
        }
        window.open(url, "_blank");
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorState />;

    return (
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 pb-20">
            {/* TOP NAVIGATION BAR */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-8 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <Target size={18} />
                        </div>
                        <span className="font-black uppercase tracking-tighter italic text-lg">Project<span className="text-blue-600">Sync</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Project ID</p>
                            <p className="text-xs font-bold text-slate-900">#{id?.toString().slice(-8).toUpperCase()}</p>
                        </div>
                        <button onClick={() => router.back()} className="p-3 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
                            <RefreshCcw size={18} className="text-slate-500" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 mt-10">
                
                {/* --- HEADER SECTION --- */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-6xl font-[1000] tracking-tighter italic leading-none text-slate-900">
                            {project?.projectName || project?.name}
                        </h1>
                        <div className="flex items-center gap-4 mt-4">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                {project?.status || 'In Execution'}
                            </span>
                            <p className="text-slate-400 text-sm font-medium">Started on {project?.startDate || 'Recent'}</p>
                        </div>
                    </motion.div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
                            Download Agreement
                        </button>
                    </div>
                </header>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <QuickStat label="Total Budget" value={`$${budget}`} sub="Fixed Contract" icon={<Wallet className="text-blue-500"/>} />
                    <QuickStat label="Paid Amount" value={`$${paid}`} sub="Verified" icon={<CheckCircle2 className="text-emerald-500"/>} />
                    <QuickStat label="Balance Due" value={`$${due}`} sub="Outstanding" icon={<Clock className="text-amber-500"/>} />
                    <QuickStat label="Execution" value={`${progress}%`} sub="Real-time" icon={<TrendingUp className="text-indigo-500"/>} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* --- LEFT COLUMN: ROADMAP --- */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black italic tracking-tight">Delivery Roadmap</h3>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                                    <PieChart size={16} className="text-blue-600" />
                                    <span className="text-[10px] font-black uppercase text-slate-500">Milestone Track</span>
                                </div>
                            </div>

                            <div className="relative space-y-6">
                                {project?.milestones?.map((m: any, idx: number) => (
                                    <MilestoneCard 
                                        key={idx} 
                                        milestone={m} 
                                        index={idx} 
                                        onPay={() => handlePayment(m.amount, m.title)} 
                                    />
                                ))}
                            </div>
                        </section>

                        {/* SUPPORT TOOLS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                <MessageSquare className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-700" />
                                <h4 className="text-xl font-black italic mb-2">Direct Message</h4>
                                <p className="text-blue-100 text-xs mb-6 leading-relaxed">Need a quick update or have technical questions? Chat with your manager.</p>
                                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Start Conversation</button>
                             </div>
                             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                                <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-125 transition-transform duration-700" />
                                <h4 className="text-xl font-black italic mb-2">Quality Assurance</h4>
                                <p className="text-slate-400 text-xs mb-6 leading-relaxed">Every milestone is strictly verified against our high-quality delivery standards.</p>
                                <button className="bg-white/10 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-white/10">View Standards</button>
                             </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: PAYMENT TERMINAL --- */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                                <div className="mb-10 flex justify-between items-center">
                                    <p className="font-black italic text-slate-900">Financial Summary</p>
                                    <Lock size={18} className="text-slate-300" />
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Total Contract</span>
                                        <span className="text-xl font-black tracking-tighter">${budget.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-slate-50 pb-4">
                                        <span className="text-[10px] font-black uppercase text-slate-400">Settled to Date</span>
                                        <span className="text-xl font-black tracking-tighter text-emerald-600">-${paid.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Total Outstanding</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-[1000] tracking-tighter text-slate-950">${due.toLocaleString()}</span>
                                            <span className="text-sm font-bold text-slate-300 uppercase italic">USD</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handlePayment(due, "Full Clearance")}
                                    disabled={due <= 0}
                                    className={`w-full p-7 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl ${due <= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-600 text-white hover:bg-slate-950 shadow-blue-500/20'}`}
                                >
                                    {due <= 0 ? 'All Clear ✓' : 'Clear Full Balance'}
                                </button>
                                
                                <p className="text-center text-[9px] font-bold text-slate-400 mt-6 uppercase tracking-widest">
                                    Secured via {settings?.paypalLink?.includes('paypal') ? 'PayPal Gateway' : 'Global Settings'}
                                </p>
                            </motion.div>

                            {/* PROJECT INFO CARD */}
                            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                                <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Execution Team</h5>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center font-black text-blue-600">P</div>
                                    <div>
                                        <p className="text-xs font-black text-slate-900">Vault Project Manager</p>
                                        <p className="text-[10px] font-bold text-slate-400">Response time: ~2 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- SUB COMPONENTS ---

function QuickStat({ label, value, sub, icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <span className="text-[8px] font-black bg-slate-100 px-2 py-1 rounded-md text-slate-400 uppercase tracking-widest">Live</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{label}</p>
            <h4 className="text-3xl font-black tracking-tighter italic text-slate-950 mt-1">{value}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{sub}</p>
        </div>
    );
}

function MilestoneCard({ milestone, index, onPay }: any) {
    const isDone = milestone.isCompleted;
    return (
        <div className={`group flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all ${isDone ? 'bg-slate-50/50 border-transparent opacity-70' : 'bg-white border-slate-100 hover:border-blue-100'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${isDone ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all'}`}>
                {isDone ? <CheckCircle2 size={24} /> : index + 1}
            </div>
            
            <div className="flex-1 text-center md:text-left">
                <h4 className={`text-sm font-black uppercase tracking-tight italic ${isDone ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{milestone.title}</h4>
                <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Calendar size={12} /> {milestone.dueDate || 'TBD'}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">${Number(milestone.amount).toLocaleString()}</span>
                </div>
            </div>

            <div className="w-full md:w-auto">
                {isDone ? (
                    <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        Finalized
                    </div>
                ) : (
                    <button 
                        onClick={onPay}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                    >
                        Pay Now <ChevronRight size={14} />
                    </button>
                )}
            </div>
        </div>
    );
}

// LOADING & ERROR STATES (Keep from previous implementation)
function LoadingScreen() { return <div className="h-screen flex flex-col items-center justify-center bg-white"><div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" /><p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Syncing Global Data</p></div>; }
function ErrorState() { return <div className="h-screen flex items-center justify-center p-10 text-center bg-white"><div><AlertCircle size={60} className="text-red-500 mx-auto mb-6" /><h2 className="text-4xl font-black italic tracking-tighter">Sync Failed</h2><p className="text-slate-500 mt-2 mb-8">Could not retrieve project data from the core engine.</p><button onClick={() => window.location.reload()} className="bg-slate-950 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest">Retry Connection</button></div></div>; }