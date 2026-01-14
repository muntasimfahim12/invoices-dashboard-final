/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CreditCard, Download, Clock, CheckCircle2, 
    FileText, Wallet, ArrowUpRight, Zap, ArrowRight,
    Loader2, LayoutDashboard, Target, ShieldCheck, 
    Bell, ChevronRight, Info, Calendar, Mail, Phone, MapPin,
    TrendingUp
} from "lucide-react";

export default function ClientDashboard() {
    const [clientData, setClientData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
         
                const response = await axios.get(`${API_BASE}/clinets`); 
                
                const allClients = response.data;
                const myProfile = allClients[allClients.length - 1]; 
                
                if (myProfile) {
                    setClientData(myProfile);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Dashboard Fetch Error:", err);
                setError(true);
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorState />;

    const project = clientData?.projects?.[0] || {};
    const budget = Number(project.budget) || 0;
    const paid = Number(clientData.totalPaid) || 0;
    const due = budget - paid;
    const completionPercentage = budget > 0 ? Math.round((paid / budget) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#F0F4F8] text-[#1E293B] font-sans">
            
            {/* --- TOP PREMIUM NAV --- */}
            <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50">
                <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-[#4177BC] to-[#5D9CEC] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                            <LayoutDashboard size={24} />
                        </div>
                        <div>
                            <span className="block font-black text-2xl tracking-tighter uppercase italic leading-none">
                                CLIENT<span className="text-[#4177BC]">PORTAL</span>
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Workspace v2.0</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex flex-col text-right">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Project ID</p>
                            <p className="text-sm font-bold text-[#4177BC]">#{clientData._id?.slice(-8).toUpperCase()}</p>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200"></div>
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#4177BC] font-black">
                                {clientData.name?.charAt(0)}
                            </div>
                            <div className="pr-4">
                                <p className="text-xs font-black text-slate-800 leading-none">{clientData.name}</p>
                                <p className="text-[10px] font-bold text-green-500 uppercase mt-1">Online Now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-8 py-10">
                
                {/* --- WELCOME BANNER --- */}
                <div className="relative rounded-[50px] bg-[#4177BC] p-12 md:p-20 overflow-hidden mb-12 shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-[100px]"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                        <div className="text-center lg:text-left">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <span className="inline-block bg-white/10 backdrop-blur-md px-6 py-2 rounded-full text-blue-100 text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-white/20">
                                    Strategic Partner Dashboard
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                                    Unleash Your <br /> <span className="text-blue-200">Potential.</span>
                                </h1>
                                <p className="text-blue-100/70 mt-8 text-xl font-medium max-w-xl leading-relaxed">
                                    Hello {clientData.name?.split(' ')[0]}, your project <span className="text-white font-bold">&ldquo;{project.name}&#34;</span> is currently in the <span className="text-[#EB9C2C] underline decoration-2">{clientData.status}</span> phase.
                                </p>
                            </motion.div>
                        </div>

                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <button className="bg-[#EB9C2C] hover:bg-orange-500 text-white p-6 rounded-[25px] font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-3">
                                <Zap size={20} /> Project Brief
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white p-6 rounded-[25px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                                <FileText size={20} /> Download Assets
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCard label="Investment" value={`$${paid}`} sub="Total amount paid" icon={<Wallet />} color="blue" />
                    <StatCard label="Outstanding" value={`$${due}`} sub="Balance to clear" icon={<Clock />} color="orange" />
                    // eslint-disable-next-line react/jsx-no-comment-textnodes
                    <StatCard label="Total Budget" value={`$${budget}`} sub="Projected value" icon={<Target />} color="indigo" />
                    // eslint-disable-next-line react/jsx-no-undef, react/jsx-no-undef
                    <StatCard label="Efficiency" value={`${completionPercentage}%`} sub="Project milestone" icon={<TrendingUp />} color="green" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    
                    {/* --- LEFT: PROJECT ROADMAP --- */}
                    <div className="xl:col-span-8 space-y-10">
                        <section className="bg-white rounded-[45px] p-10 shadow-sm border border-slate-200/60">
                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Project Roadmap</h3>
                                    <p className="text-slate-400 font-bold text-sm">Real-time milestone tracking</p>
                                </div>
                                <div className="bg-blue-50 px-6 py-3 rounded-2xl text-[#4177BC] font-black text-xs uppercase tracking-widest border border-blue-100">
                                    Status: {clientData.status}
                                </div>
                            </div>

                            <div className="space-y-8 relative before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-100">
                                {project.milestones?.map((m: any, i: number) => (
                                    <MilestoneRow key={i} milestone={m} index={i} />
                                ))}
                            </div>
                        </section>

                        <section className="bg-white rounded-[45px] p-10 shadow-sm border border-slate-200/60">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Financial History</h3>
                            <div className="overflow-hidden rounded-3xl border border-slate-100">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Transaction</th>
                                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
                                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                                            <th className="p-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5 font-bold text-sm">Initial Project Payment</td>
                                            <td className="p-5 text-xs text-slate-500 font-bold">{new Date(clientData.createdAt).toLocaleDateString()}</td>
                                            <td className="p-5 font-black text-[#4177BC]">${paid}</td>
                                            <td className="p-5"><span className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Success</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* --- RIGHT: SIDEBAR --- */}
                    <div className="xl:col-span-4 space-y-8">
                        {/* PAYMENT TERMINAL */}
                        <div className="bg-[#1E293B] rounded-[50px] p-10 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4177BC] rounded-full -mr-16 -mt-16 blur-[80px]"></div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Secure Terminal</h4>
                            <p className="text-3xl font-black italic uppercase mb-8">Pay Balance</p>
                            
                            <div className="bg-white/5 border border-white/10 rounded-[30px] p-8 mb-8">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Current Due</p>
                                <p className="text-6xl font-black tracking-tighter text-[#EB9C2C]">${due}</p>
                            </div>

                            <button className="w-full bg-[#4177BC] hover:bg-[#EB9C2C] p-6 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20">
                                <CreditCard size={20} /> Proceed to Pay
                            </button>
                        </div>

                        {/* CONTACT & SUPPORT */}
                        <div className="bg-white rounded-[45px] p-10 border border-slate-200/60 shadow-sm">
                            <h4 className="text-lg font-black italic uppercase mb-8 flex items-center gap-2">
                                <ShieldCheck className="text-[#4177BC]" /> Identity Info
                            </h4>
                            <div className="space-y-6">
                                <InfoItem icon={<Mail size={16}/>} label="Primary Email" value={clientData.email} />
                                <InfoItem icon={<Phone size={16}/>} label="Phone Line" value={clientData.phone || "Not Set"} />
                                <InfoItem icon={<MapPin size={16}/>} label="Business Hub" value={clientData.address || "International"} />
                            </div>
                            <div className="mt-10 pt-8 border-t border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Support Manager</p>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                    <div>
                                        <p className="text-xs font-black">Admin Support</p>
                                        <p className="text-[10px] font-bold text-slate-400">Available 24/7</p>
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

/* --- REUSABLE UI COMPONENTS --- */

function StatCard({ label, value, sub, icon, color }: any) {
    const colorMap: any = {
        blue: "bg-blue-50 text-[#4177BC] border-blue-100",
        orange: "bg-orange-50 text-orange-500 border-orange-100",
        indigo: "bg-indigo-50 text-indigo-500 border-indigo-100",
        green: "bg-green-50 text-green-500 border-green-100"
    };

    return (
        <motion.div whileHover={{ y: -8 }} className="bg-white p-8 rounded-[40px] border border-slate-200/50 shadow-sm transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${colorMap[color]}`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tighter italic">{value}</h3>
            <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{sub}</p>
        </motion.div>
    );
}

function MilestoneRow({ milestone, index }: any) {
    return (
        <div className="relative pl-14 group">
            <div className="absolute left-0 top-0 w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center font-black text-slate-300 group-hover:border-[#4177BC] group-hover:text-[#4177BC] transition-all z-10">
                {index + 1}
            </div>
            <div className="bg-slate-50/50 group-hover:bg-white border border-transparent group-hover:border-slate-100 p-6 rounded-[30px] transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h4 className="font-black text-slate-800 uppercase italic tracking-tight">{milestone.title}</h4>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                <Calendar size={12}/> {milestone.dueDate}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-[10px] font-black text-[#EB9C2C] uppercase tracking-widest">In Progress</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-slate-800">${milestone.amount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Invoice Pending</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-[#4177BC] mb-4" size={50} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Establishing Secure Connection</p>
        </div>
    );
}

function ErrorState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-10">
            <div className="text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Info size={40} />
                </div>
                <h2 className="text-2xl font-black uppercase italic mb-2">Profile Not Found</h2>
                <p className="text-slate-500 font-medium mb-8">We couldnt locate your client profile in our records.</p>
                <button onClick={() => window.location.reload()} className="bg-[#4177BC] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Retry Sync</button>
            </div>
        </div>
    );
}