/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Search, ArrowUpRight, CheckCircle2,
    AlertCircle, DollarSign, Calendar, RefreshCcw, CreditCard,
    ArrowLeft, Filter
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const PRIMARY = "#4177BC";
const ACCENT = "#EB9C2C";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientInvoiceList() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [mounted, setMounted] = useState(false);

    const clientEmail = typeof window !== "undefined" ? localStorage.getItem("user_email") : null;

    useEffect(() => { setMounted(true); }, []);

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
            setInvoices(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    }, [clientEmail]);

    useEffect(() => { if (mounted) fetchInvoices(); }, [mounted, fetchInvoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || inv.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            const milestones = inv.milestonesSnapshot || [];
            milestones.forEach((m: any) => {
                if (m.status === "Paid") acc.totalPaid += Number(m.amount) || 0;
                else acc.totalDue += Number(m.amount) || 0;
            });
            return acc;
        }, { totalDue: 0, totalPaid: 0 });
    }, [invoices]);

    if (!mounted) return null;
    if (loading && invoices.length === 0) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-white pb-24 selection:bg-[#4177BC] selection:text-white">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 mb-12">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/dashboard" className="p-3 rounded-full hover:bg-slate-50 transition-all text-slate-400 hover:text-[#4177BC]">
                        <ArrowLeft size={20} />
                    </Link>
                    <span className="text-2xl font-black tracking-tighter text-[#4177BC] judson-bold italic">Financial Ledger</span>
                    <button onClick={fetchInvoices} className="p-3 rounded-full bg-slate-50 text-[#4177BC] hover:rotate-180 transition-all duration-700">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-end">
                    <div className="lg:col-span-1">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4177BC]/5 rounded-full mb-4 border border-[#4177BC]/10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] inter-bold">Billing History</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tighter judson-bold">Invoices</h1>
                    </div>
                    <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6">
                        <StatCard label="Outstanding Balance" amount={stats.totalDue} icon={<AlertCircle size={22} />} color="#F43F5E" />
                        <StatCard label="Total Settled" amount={stats.totalPaid} icon={<CheckCircle2 size={22} />} color="#10B981" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 mb-10">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search invoices..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-[20px] py-4 pl-14 pr-6 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#4177BC]/10 transition-all inter-medium placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-slate-50 p-1.5 rounded-[22px] border border-slate-100 w-full md:w-auto">
                        {["All", "Paid", "Unpaid"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-wider transition-all inter-bold ${statusFilter === s
                                    ? "bg-white text-[#4177BC] shadow-sm"
                                    : "text-slate-400 hover:text-slate-600"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredInvoices.map((inv, idx) => (
                            <motion.div
                                key={inv._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <InvoiceCard inv={inv} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function InvoiceCard({ inv }: { inv: any }) {
    const milestones = inv.milestonesSnapshot || [];
    const totalProjectAmount = milestones.reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0) || 1;
    const totalPaidAmount = milestones.filter((m: any) => m.status === "Paid")
        .reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0);

    const progress = Math.min(100, Math.round((totalPaidAmount / totalProjectAmount) * 100));
    const isPaid = inv.status?.toLowerCase() === 'paid';

    return (
        <div className="group bg-white rounded-[40px] border border-slate-100 p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} inter-bold`}>
                    {inv.status}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase inter-bold">
                    <Calendar size={14} className="text-[#4177BC]" />
                    {new Date(inv.paymentDate || inv.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
            </div>

            <div className="mb-6 flex-1">
                <h3 className="text-2xl font-bold text-[#0F172A] judson-bold leading-tight group-hover:text-[#4177BC] transition-colors mb-2">
                    {inv.projectTitle}
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest inter-bold">ID: {inv.invoiceId?.slice(-8)}</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tighter inter-bold">
                        <CreditCard size={12} /> {inv.method || 'Bank'}
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between text-[9px] font-black uppercase mb-3 inter-bold tracking-widest">
                    <span className="text-slate-400">Coverage</span>
                    <span className="text-[#4177BC]">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-[#4177BC] rounded-full"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-[#F8FAFC] rounded-[28px] border border-slate-50 mb-8">
                <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 inter-bold">Amount</p>
                    <p className="text-xl font-black text-[#0F172A] inter-bold">${inv.amount?.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 inter-bold">Total Project</p>
                    <p className="text-xl font-black text-[#4177BC] inter-bold">${Math.round(totalProjectAmount).toLocaleString()}</p>
                </div>
            </div>

            {/* Path corrected here to match your dashboard URL */}
            <Link
                href={`/client/invoices/${inv._id}`}
                className="w-full group/btn flex items-center justify-center gap-2 py-4 rounded-[18px] border border-slate-100 bg-slate-50/50 hover:bg-[#4177BC]/5 hover:border-[#4177BC]/20 hover:text-[#4177BC] transition-all duration-300 text-[10px] font-black uppercase tracking-widest text-slate-500 inter-bold"
            >
                View Details
                <ArrowUpRight size={14} className="group-hover/btn:translate-x-1.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Link>

            <DollarSign className="absolute -bottom-10 -right-8 text-slate-50 opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" size={140} />
        </div>
    );
}

function StatCard({ label, amount, icon, color }: any) {
    return (
        <div className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6 flex-1 min-w-[240px] hover:border-[#4177BC]/20 transition-all">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:rotate-6" style={{ backgroundColor: `${color}10`, color: color }}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 inter-bold">{label}</p>
                <p className="text-2xl font-black text-[#0F172A] tracking-tighter inter-bold">
                    ${amount.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-16 h-16 border-[3px] border-slate-50 border-t-[#4177BC] rounded-full animate-spin" />
            <h2 className="mt-8 text-[10px] font-black text-[#4177BC] uppercase tracking-[0.5em] inter-bold">Syncing Ledgers</h2>
        </div>
    );
}