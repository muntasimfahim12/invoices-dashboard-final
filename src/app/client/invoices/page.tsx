/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
    Search, FileText, ArrowUpRight, CheckCircle2, 
    AlertCircle, DollarSign, Calendar, RefreshCcw
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientInvoiceList() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const clientEmail = typeof window !== "undefined"
        ? localStorage.getItem("user_email")
        : null;

    // ১. ব্যাকএন্ড থেকে ইনভয়েস ফেচ করা
    const fetchInvoices = async () => {
        if (!clientEmail) return;
        try {
            setLoading(true);
            // ব্যাকএন্ডে আমরা ইমেইল দিয়ে কুয়েরি করছি যাতে শুধু এই ক্লায়েন্টের ডেটা আসে
            const response = await axios.get(`${API_BASE}/invoices`, {
                params: { email: clientEmail }
            });
            
            // ডেটা আসার পর আমরা সেটাকে লেটেস্ট ডেট অনুযায়ী সর্ট করে নিচ্ছি
            const sortedData = Array.isArray(response.data) 
                ? response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                : [];
                
            setInvoices(sortedData);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [clientEmail]);

    // ২. ফিল্টারিং লজিক (Search + Status)
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = 
                inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    // ৩. টোটাল সামারি ক্যালকুলেশন (Ledger Stats)
    const stats = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            acc.totalDue += (Number(inv.remainingDue) || 0);
            acc.totalPaid += (Number(inv.grandTotal) - Number(inv.remainingDue) || 0);
            return acc;
        }, { totalDue: 0, totalPaid: 0 });
    }, [invoices]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* --- Header & Summary Cards --- */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase">
                            Financial <span className="text-[#4177BC]">Ledger</span>
                        </h1>
                        <p className="text-slate-500 font-medium italic">Secure billing history for {clientEmail}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <StatCard 
                            label="Total Outstanding" 
                            amount={stats.totalDue} 
                            icon={<AlertCircle size={18} />} 
                            color="rose" 
                        />
                        <StatCard 
                            label="Total Settled" 
                            amount={stats.totalPaid} 
                            icon={<CheckCircle2 size={18} />} 
                            color="emerald" 
                        />
                        <button 
                            onClick={fetchInvoices}
                            className="h-14 w-14 bg-white border border-slate-100 rounded-3xl flex items-center justify-center hover:rotate-180 transition-all duration-500 shadow-sm"
                        >
                            <RefreshCcw size={20} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* --- Search & Filters --- */}
                <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by ID or Project Name..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 ring-[#4177BC]/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
                        {["All", "Paid", "Unpaid"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    statusFilter === s 
                                    ? "bg-[#4177BC] text-white shadow-md" 
                                    : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Invoices Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredInvoices.map((inv) => (
                        <InvoiceCard key={inv._id} inv={inv} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredInvoices.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <FileText className="mx-auto text-slate-200 mb-4" size={64} />
                        <h3 className="font-black text-slate-400 uppercase text-sm tracking-[0.3em]">No Transactions Recorded</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- হেল্পার কম্পোনেন্ট: স্ট্যাট কার্ড ---
function StatCard({ label, amount, icon, color }: any) {
    const colorStyles: any = {
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
    };
    return (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 px-7">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colorStyles[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-slate-900">${amount.toLocaleString()}</p>
            </div>
        </div>
    );
}

// --- হেল্পার কম্পোনেন্ট: ইনভয়েস কার্ড ---
function InvoiceCard({ inv }: { inv: any }) {
    // পেমেন্ট ক্যালকুলেশন: (মোট পেইড / গ্র্যান্ড টোটাল) * ১০০
    const totalPaid = Number(inv.grandTotal) - Number(inv.remainingDue);
    const progress = Math.min(100, Math.round((totalPaid / (Number(inv.grandTotal) || 1)) * 100));

    return (
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    inv.status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                }`}>
                    {inv.status}
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px]">
                    <Calendar size={12} /> {new Date(inv.createdAt).toLocaleDateString('en-GB')}
                </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-[#4177BC] transition-colors">
                {inv.projectTitle || "Project Milestone"}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 mb-6 tracking-widest uppercase">ID: {inv.invoiceId}</p>

            {/* Progress Visualization */}
            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter">
                    <span className="text-slate-400">Payment Progress</span>
                    <span className="text-slate-900">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-700 ${inv.status === 'Paid' ? 'bg-emerald-500' : 'bg-[#4177BC]'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3 mb-8 bg-slate-50/50 p-4 rounded-2xl">
                <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase">Grand Total</span>
                    <span className="text-slate-900">${inv.grandTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-3 border-t border-slate-200/50">
                    <span className="text-slate-900 uppercase">Balance Due</span>
                    <span className={inv.remainingDue > 0 ? "text-rose-500" : "text-emerald-500"}>
                        ${inv.remainingDue?.toLocaleString()}
                    </span>
                </div>
            </div>

            <Link
                href={`/client/invoices/${inv._id}`}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#4177BC] transition-all"
            >
                View Details <ArrowUpRight size={14} />
            </Link>

            <DollarSign className="absolute -bottom-6 -right-6 text-slate-100 opacity-20 group-hover:scale-110 transition-transform" size={120} />
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-[#4177BC] rounded-full animate-spin" />
            <p className="mt-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Ledger...</p>
        </div>
    );
}