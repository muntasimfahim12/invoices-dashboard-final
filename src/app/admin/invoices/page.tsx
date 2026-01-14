/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { 
    Plus, Search, FileText, Download, 
    CheckCircle2, Trash2, Loader2,
    Clock, AlertCircle, ArrowUpRight, ChevronRight,
    Copy, CheckSquare, Square, Share2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// TypeScript Interfaces
interface Client { 
    name: string; 
    email?: string; 
}

interface Invoice {
    _id: string;
    invoiceId: string;
    client: Client;
    projectTitle: string;
    createdAt: string;
    status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
    currency: string;
    grandTotal: number;
    receivedAmount: number;
    remainingDue: number;
    items?: any[]; 
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InvoicesPage() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

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

    useEffect(() => { fetchInvoices(); }, []);

    /** 📥 ফিক্সড ডাউনলোড লজিক: 
     * আপনার ব্যাকএন্ডে রাউট ছিল /invoices/:id/download, তাই এখানেও তাই রাখা হয়েছে 
     */
    const handleDownload = async (id: string, invoiceId: string) => {
        try {
            setActionLoading(id);
            const response = await axios.get(`${API_BASE}/invoices/${id}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download error:", error);
            alert("Could not download PDF. Check if backend route exists.");
        } finally {
            setActionLoading(null);
        }
    };

    /** 📧 ফিক্সড শেয়ার লজিক: 
     * ব্যাকএন্ডে পুরো ইনভয়েস অবজেক্ট পাঠানো হচ্ছে যাতে ইমেইল টেম্পলেট সব ডাটা পায় 
     */
    const handleShare = async (inv: Invoice) => {
        try {
            setActionLoading(inv._id);
            // ব্যাকএন্ডে পুরো অবজেক্ট (inv) পাঠানো হচ্ছে
            await axios.post(`${API_BASE}/invoices/send-email`, inv); 
            alert(`Invoice successfully sent to ${inv.client?.name || 'Client'}`);
        } catch (error) {
            console.error("Email error:", error);
            alert("Failed to send email. Check backend logs.");
        } finally {
            setActionLoading(null);
        }
    };

    // Bulk Delete Logic
    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedInvoices.length} selected invoices?`)) return;
        try {
            setActionLoading("bulk");
            await Promise.all(selectedInvoices.map(id => axios.delete(`${API_BASE}/invoices/${id}`)));
            setInvoices(prev => prev.filter(inv => !selectedInvoices.includes(inv._id)));
            setSelectedInvoices([]);
        } catch (error) {
            alert("Bulk delete failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const stats = useMemo(() => {
        const total = invoices.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
        const paid = invoices.reduce((acc, curr) => acc + (Number(curr.receivedAmount) || 0), 0);
        const pending = total - paid;
        const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;
        return { total, paid, pending, overdueCount };
    }, [invoices]);

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inv.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "All" || inv.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const toggleSelect = (id: string) => {
        setSelectedInvoices(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-slate-200/60 rounded-xl ${className}`} />
    );

    return (
        <div className="space-y-8 pb-10 min-h-screen px-4 md:px-0">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase">Invoices</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        Management Dashboard
                    </p>
                </div>
                <div className="flex gap-3">
                    <AnimatePresence>
                        {selectedInvoices.length > 0 && (
                            <motion.button 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                onClick={handleBulkDelete}
                                className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-rose-100 flex items-center gap-2"
                            >
                                {actionLoading === "bulk" ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                Delete ({selectedInvoices.length})
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <Link href="/admin/invoices/create" className="bg-[#4177BC] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#4177BC]/20 hover:scale-[1.02] transition-all flex items-center gap-2">
                        <Plus size={16} /> New Invoice
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {loading ? [1,2,3,4].map(i => <Skeleton key={i} className="h-28" />) : (
                    <>
                        <MiniStat label="Revenue" value={`$${stats.total.toLocaleString()}`} color="#4177BC" />
                        <MiniStat label="Collected" value={`$${stats.paid.toLocaleString()}`} color="#22c55e" />
                        <MiniStat label="Outstanding" value={`$${stats.pending.toLocaleString()}`} color="#EB9C2C" />
                        <MiniStat label="Overdue" value={stats.overdueCount.toString()} color="#ef4444" />
                    </>
                )}
            </div>

            {/* Table Area */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-100 focus:border-[#4177BC] transition-all text-sm font-bold outline-none shadow-sm" 
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-white border border-slate-100 rounded-xl overflow-x-auto">
                        {["All", "Paid", "Pending", "Partial", "Overdue"].map((status) => (
                            <button key={status} onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-[#4177BC] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-white border-b border-slate-50">
                            <tr>
                                <th className="pl-8 py-5 w-10">
                                    <button onClick={() => setSelectedInvoices(selectedInvoices.length === filteredInvoices.length ? [] : filteredInvoices.map(i => i._id))}>
                                        {selectedInvoices.length === filteredInvoices.length ? <CheckSquare size={16} className="text-[#4177BC]" /> : <Square size={16} className="text-slate-300" />}
                                    </button>
                                </th>
                                <th className="px-4 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Client & ID</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-center">Payment Progress</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-sm">
                            {loading ? [1,2,3].map(i => <tr key={i}><td colSpan={6} className="p-8"><Skeleton className="h-12 w-full" /></td></tr>) : 
                             filteredInvoices.map((inv) => {
                                const progress = Math.min((inv.receivedAmount / inv.grandTotal) * 100, 100) || 0;

                                return (
                                    <tr key={inv._id} className={`group transition-all ${selectedInvoices.includes(inv._id) ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}>
                                        <td className="pl-8 py-6">
                                            <button onClick={() => toggleSelect(inv._id)}>
                                                {selectedInvoices.includes(inv._id) ? <CheckSquare size={16} className="text-[#4177BC]" /> : <Square size={16} className="text-slate-300 group-hover:text-slate-400" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC] group-hover:text-white transition-all">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/admin/invoices/${inv._id}`} className="text-slate-900 font-black text-base hover:text-[#4177BC]">{inv.invoiceId}</Link>
                                                        <button onClick={() => copyToClipboard(inv.invoiceId)} className="text-slate-300 hover:text-slate-500 transition-colors"><Copy size={12} /></button>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">{inv.client?.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="w-full max-w-[120px] mx-auto space-y-1.5">
                                                <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                                                    <span>Paid</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className={`h-full ${progress === 100 ? 'bg-emerald-500' : 'bg-[#4177BC]'}`} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={inv.status} />
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-slate-900 font-[1000] text-base">{inv.currency} {inv.grandTotal?.toLocaleString()}</p>
                                            <p className={`text-[9px] uppercase font-black ${inv.remainingDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                {inv.remainingDue > 0 ? `Due: ${inv.remainingDue.toLocaleString()}` : 'Cleared'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button 
                                                    disabled={actionLoading === inv._id}
                                                    onClick={() => handleShare(inv)} 
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                                                >
                                                    {actionLoading === inv._id ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
                                                </button>
                                                <button 
                                                    disabled={actionLoading === inv._id}
                                                    onClick={() => handleDownload(inv._id, inv.invoiceId)} 
                                                    className="p-3 bg-slate-50 text-slate-400 hover:text-[#4177BC] hover:bg-[#4177BC]/10 rounded-xl transition-all"
                                                >
                                                    {actionLoading === inv._id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                                </button>
                                                <Link href={`/admin/invoices/${inv._id}`} className="p-3 bg-slate-50 text-slate-400 hover:text-white hover:bg-[#4177BC] rounded-xl transition-all">
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// MiniStat Component
function MiniStat({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] -mr-4 -mt-4 rounded-full" style={{ backgroundColor: color }} />
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">{label}</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
            <div className="h-1.5 w-12 mt-4 rounded-full" style={{ backgroundColor: color }} />
        </motion.div>
    );
}

// StatusBadge Component
function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Pending: "bg-amber-50 text-amber-600 border-amber-100",
        Partial: "bg-blue-50 text-blue-600 border-blue-100",
        Overdue: "bg-rose-50 text-rose-600 border-rose-100",
    };
    const icons: Record<string, React.ReactNode> = {
        Paid: <CheckCircle2 size={12} />,
        Pending: <Clock size={12} />,
        Partial: <ArrowUpRight size={12} />,
        Overdue: <AlertCircle size={12} />,
    };
    return (
        <span className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${styles[status] || styles.Pending}`}>
            {icons[status] || icons.Pending} {status}
        </span>
    );
}