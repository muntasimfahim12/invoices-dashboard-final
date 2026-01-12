/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
    Plus, Search, FileText, Download, 
    Filter, CheckCircle2, 
    Clock, AlertCircle, ArrowUpRight, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";

// API Base URL from .env
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InvoicesPage() {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Fetch Data from API
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/invoices`);
                setInvoices(response.data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    // 2. Calculate Real-time Stats
    const stats = useMemo(() => {
        const total = invoices.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
        const paid = invoices.reduce((acc, curr) => acc + (curr.receivedAmount || 0), 0);
        const pending = invoices.reduce((acc, curr) => acc + (curr.remainingDue || 0), 0);
        const overdue = invoices.filter(inv => inv.status === 'Overdue').reduce((acc, curr) => acc + (curr.remainingDue || 0), 0);
        
        return { total, paid, pending, overdue };
    }, [invoices]);

    // 3. Filter Logic
    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-slate-200/60 rounded-xl ${className}`} />
    );

    return (
        <div className="space-y-8 pb-10 min-h-screen px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase">Invoices</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        Financial Billing Ledger
                    </p>
                </div>
                <Link 
                    href="/admin/invoices/create" 
                    className="bg-[#4177BC] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#4177BC]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Plus size={16} /> Create New Invoice
                </Link>
            </div>

            {/* Billing Stats (Dynamic) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading ? (
                    [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)
                ) : (
                    <>
                        <MiniStat label="Total Invoiced" value={`$${stats.total.toLocaleString()}`} color="#4177BC" />
                        <MiniStat label="Paid / Received" value={`$${stats.paid.toLocaleString()}`} color="#22c55e" />
                        <MiniStat label="Remaining Due" value={`$${stats.pending.toLocaleString()}`} color="#EB9C2C" />
                        <MiniStat label="System Overdue" value={`$${stats.overdue.toLocaleString()}`} color="#ef4444" />
                    </>
                )}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                {/* Filters Row */}
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Client or Project..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-100 focus:border-[#4177BC] transition-all text-sm font-bold outline-none shadow-sm" 
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px] md:min-w-full">
                        <thead className="bg-white border-b border-slate-50">
                            <tr>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Invoice Details</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest hidden sm:table-cell">Project</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Total</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-sm">
                            {loading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i}><td colSpan={5} className="px-8 py-6"><Skeleton className="h-14 w-full" /></td></tr>
                                ))
                            ) : filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv) => (
                                    <tr key={inv._id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC] group-hover:text-white transition-all shadow-inner">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <Link href={`/admin/invoices/${inv._id}`}>
                                                        <p className="text-slate-900 leading-none mb-1 font-black text-base hover:text-[#4177BC] transition-colors">
                                                            {inv.invoiceId}
                                                        </p>
                                                    </Link>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">
                                                        {inv.client?.name} • {new Date(inv.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={inv.status} />
                                        </td>
                                        <td className="px-8 py-6 hidden sm:table-cell">
                                            <p className="text-slate-600 text-[11px] font-black uppercase flex items-center gap-1 group-hover:text-[#4177BC] transition-colors cursor-pointer">
                                                {inv.projectTitle} <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-slate-900 font-[1000] text-base">
                                                {inv.currency} {inv.grandTotal?.toLocaleString()}
                                            </p>
                                            <p className="text-[9px] text-amber-600 uppercase font-black">
                                                Due: {inv.remainingDue}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button className="p-3 bg-slate-50 text-slate-400 hover:text-[#4177BC] hover:bg-[#4177BC]/10 rounded-xl transition-all shadow-sm">
                                                    <Download size={16} />
                                                </button>
                                                <Link 
                                                    href={`/admin/invoices/${inv._id}`}
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-white hover:bg-[#4177BC] rounded-xl transition-all shadow-sm flex items-center gap-2 group/btn"
                                                >
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                        No invoices found in registry
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function MiniStat({ label, value, color }: any) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] -mr-4 -mt-4 rounded-full" style={{ backgroundColor: color }} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
            <div className="h-1.5 w-12 mt-4 rounded-full" style={{ backgroundColor: color }} />
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        Paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Pending: "bg-amber-50 text-amber-600 border-amber-100",
        Overdue: "bg-rose-50 text-rose-600 border-rose-100",
    };
    const icons: any = {
        Paid: <CheckCircle2 size={12} />,
        Pending: <Clock size={12} />,
        Overdue: <AlertCircle size={12} />,
    };

    return (
        <span className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${styles[status] || styles.Pending}`}>
            {icons[status] || icons.Pending} {status}
        </span>
    );
}