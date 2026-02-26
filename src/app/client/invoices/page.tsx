/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
    Search, FileText, ArrowUpRight, CheckCircle2, 
    AlertCircle, DollarSign, Calendar, RefreshCcw, CreditCard
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientInvoiceList() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [mounted, setMounted] = useState(false);

    const clientEmail = typeof window !== "undefined" ? localStorage.getItem("user_email") : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchInvoices = useCallback(async () => {
        if (!clientEmail) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/invoices`, {
                params: { 
                    email: clientEmail.toLowerCase().trim(),
                    role: 'client' 
                }
            });
            
            const data = Array.isArray(response.data) ? response.data : [];
            const sortedData = data.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setInvoices(sortedData);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }, [clientEmail]);

    useEffect(() => {
        if (mounted) fetchInvoices();
    }, [mounted, fetchInvoices]);

    // ৩. ফিল্টারিং লজিক
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = 
                inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === "All" || 
                inv.status?.toLowerCase() === statusFilter.toLowerCase();
            
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    // ৪. মাইলস্টোন স্ন্যাপশট থেকে স্ট্যাটস ক্যালকুলেশন
    const stats = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            const milestones = inv.milestonesSnapshot || [];
            
            milestones.forEach((m: any) => {
                if (m.status === "Paid") {
                    acc.totalPaid += Number(m.amount) || 0;
                } else {
                    acc.totalDue += Number(m.amount) || 0;
                }
            });
            
            return acc;
        }, { totalDue: 0, totalPaid: 0 });
    }, [invoices]);

    if (!mounted) return null;
    if (loading && invoices.length === 0) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 selection:bg-[#4177BC]/20">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- Header Section --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase">
                            Financial <span className="text-[#4177BC]">Ledger</span>
                        </h1>
                        <p className="text-slate-500 font-medium italic mt-1">
                            Secured billing for {clientEmail}
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <StatCard 
                            label="Outstanding" 
                            amount={stats.totalDue} 
                            icon={<AlertCircle size={20} />} 
                            color="rose" 
                        />
                        <StatCard 
                            label="Settled" 
                            amount={stats.totalPaid} 
                            icon={<CheckCircle2 size={20} />} 
                            color="emerald" 
                        />
                        <button 
                            onClick={fetchInvoices}
                            className="h-16 w-16 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center hover:rotate-180 transition-all duration-700 shadow-sm active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCcw size={22} className={`${loading ? 'animate-spin' : ''} text-[#4177BC]`} />
                        </button>
                    </div>
                </div>

                {/* --- Search & Filters --- */}
                <div className="bg-white p-3 rounded-[2.5rem] border border-slate-200/60 shadow-sm flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[280px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search project or invoice ID..."
                            className="w-full bg-slate-50/50 border-none rounded-[1.8rem] py-5 pl-16 pr-6 text-sm font-bold outline-none focus:ring-2 ring-[#4177BC]/20 transition-all placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2 bg-slate-100/50 p-2 rounded-[1.8rem]">
                        {["All", "Paid", "Unpaid"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-8 py-3 rounded-[1.4rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === s 
                                    ? "bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/30 scale-105" 
                                    : "text-slate-400 hover:text-slate-600 hover:bg-white"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Invoices Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredInvoices.map((inv, idx) => (
                            <motion.div
                                key={inv._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <InvoiceCard inv={inv} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// --- হেল্পার কম্পোনেন্ট: ইনভয়েস কার্ড ---
function InvoiceCard({ inv }: { inv: any }) {
    // মাইলস্টোন স্ন্যাপশট থেকে ডেটা ক্যালকুলেট করা
    const milestones = inv.milestonesSnapshot || [];
    const totalProjectAmount = milestones.reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0);
    const totalPaidAmount = milestones.filter((m: any) => m.status === "Paid")
                                      .reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0);
    
    const progress = Math.min(100, Math.round((totalPaidAmount / (totalProjectAmount || 1)) * 100));

    const getStatusStyle = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'paid': return "bg-emerald-50 text-emerald-600 border-emerald-100";
            default: return "bg-amber-50 text-amber-600 border-amber-100";
        }
    };

    return (
        <div className="group bg-white rounded-[3rem] border border-slate-200/50 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(inv.status)}`}>
                    {inv.status}
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl">
                        <Calendar size={14} className="text-[#4177BC]" /> 
                        {new Date(inv.paymentDate || inv.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            <div className="min-h-[80px]">
                <h3 className="text-2xl font-[1000] text-slate-900 mb-2 leading-tight group-hover:text-[#4177BC] transition-colors line-clamp-2">
                    {inv.projectTitle}
                </h3>
                <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold text-slate-400 tracking-[0.15em] uppercase">Ref: {inv.invoiceId}</p>
                    <span className="text-slate-200">|</span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase">
                        <CreditCard size={12} className="text-slate-400" /> {inv.method}
                    </div>
                </div>
            </div>

            {/* Progress Bar Area */}
            <div className="mt-8 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase mb-3">
                    <span className="text-slate-400 tracking-widest">Project Settlement</span>
                    <span className="text-[#4177BC]">{progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full p-0.5 overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5 }}
                        className="h-full rounded-full bg-[#4177BC] shadow-[0_0_15px_rgba(65,119,188,0.4)]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50/80 p-5 rounded-3xl border border-slate-100">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Current Paid</p>
                    <p className="text-lg font-black text-slate-900">${inv.amount?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Project Total</p>
                    <p className="text-lg font-black text-[#4177BC]">
                        ${totalProjectAmount.toLocaleString()}
                    </p>
                </div>
            </div>

            <Link
                href={`/dashboard/invoices/${inv._id}`}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-[#4177BC] hover:shadow-xl hover:shadow-[#4177BC]/20 transition-all active:scale-95"
            >
                View Details <ArrowUpRight size={18} />
            </Link>

            <DollarSign className="absolute -bottom-10 -right-8 text-slate-100 opacity-30 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700" size={160} />
        </div>
    );
}

// StatCard and LoadingSpinner components remain the same...
function StatCard({ label, amount, icon, color }: any) {
    const theme = color === "rose" 
        ? "bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50" 
        : "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50";

    return (
        <div className="bg-white p-4 rounded-[2.2rem] border border-slate-100 shadow-sm flex items-center gap-5 px-8 flex-1 min-w-[200px]">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${theme} shadow-inner`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none">
                    ${amount.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            <div className="w-20 h-20 border-[6px] border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
            <h2 className="mt-10 text-sm font-black text-slate-900 uppercase tracking-[0.5em]">Syncing Ledger</h2>
        </div>
    );
}