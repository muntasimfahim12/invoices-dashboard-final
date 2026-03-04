/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Search, Download, Trash2, ChevronRight,
    DollarSign, Clock, CheckCircle2, Plus,
    ReceiptText, ChevronLeft, ExternalLink,
    TrendingUp, ShieldCheck, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 8;

export default function AdminInvoiceManagement() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

    const fetchAllInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/invoices`, {
                params: { role: 'admin' }
            });
            setInvoices(response.data || []);
        } catch (error) {
            toast.error("Failed to sync invoice ledger");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllInvoices(); }, [fetchAllInvoices]);

    const handleDownloadInvoice = async (invoiceId: string) => {
        try {
            const loadingToast = toast.loading("Preparing your PDF document...");
            const response = await axios.get(`${API_BASE}/invoices/download/${invoiceId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${invoiceId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.dismiss(loadingToast);
            toast.success("Invoice downloaded successfully");
        } catch (error) {
            toast.error("Failed to download PDF. Please try again.");
        }
    };

    const analytics = useMemo(() => {
        return invoices.reduce((acc, inv) => {
            const total = Number(inv.grandTotal || inv.amount) || 0;
            const received = Number(inv.receivedAmount || (inv.status === 'Paid' ? total : 0)) || 0;
            acc.totalRevenue += total;
            acc.collected += received;
            acc.pending += (total - received);
            return acc;
        }, { totalRevenue: 0, collected: 0, pending: 0 });
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv =>
            inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.invoiceId?.includes(searchTerm) ||
            inv.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [invoices, searchTerm]);

    const paginatedInvoices = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredInvoices, currentPage]);

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedInvoices.length} selected invoices?`)) return;
        try {
            await axios.post(`${API_BASE}/invoices/bulk-delete`, { ids: selectedInvoices });
            toast.success("Invoices removed successfully");
            setSelectedInvoices([]);
            fetchAllInvoices();
        } catch (error) {
            toast.error("Bulk action failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#1A1C1E] pb-20 selection:bg-[#4177BC]/20 inter-medium">
            <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-8 py-5 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-5">
                        <div>
                            <h1 className="text-2xl judson-bold tracking-tight text-[#1A1C1E]">All Invoice List</h1>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-[10px] uppercase tracking-[0.2em] inter-bold text-slate-400">System Live </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                        <div className="relative group flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4177BC] transition-colors" size={18} />
                            <input
                                type="text" placeholder="Filter by ID, Project or Client..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 ring-[#4177BC]/5 focus:border-[#4177BC]/30 transition-all outline-none shadow-sm inter-medium"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Link href="/admin/invoices/create" className="bg-[#4177BC] text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-[#2D3135] transition-all flex items-center gap-2 shadow-xl shadow-black/10 active:scale-95 inter-bold">
                            <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Create Invoice</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-8 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <StatCard label="Total Revenue" amount={analytics.totalRevenue} type="primary" icon={<TrendingUp size={20} />} subText="Gross project value" />
                    <StatCard label="Collected" amount={analytics.collected} type="success" icon={<ShieldCheck size={20} />} subText="Settled transactions" />
                    <StatCard label="Outstanding" amount={analytics.pending} type="danger" icon={<Zap size={20} />} subText="Awaiting settlement" />
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="judson-bold">
                        <h2 className="text-3xl text-[#1A1C1E]">Transaction History</h2>
                        <p className="inter-medium text-slate-500 text-sm mt-1">Detailed breakdown of all issued settlement requests</p>
                    </div>
                    <AnimatePresence>
                        {selectedInvoices.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 px-5 py-2.5 rounded-xl inter-bold text-xs shadow-sm hover:bg-rose-100 transition-all"
                            >
                                <Trash2 size={16} /> VOID SELECTED ({selectedInvoices.length})
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden transition-all">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-5 w-10">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-slate-300 text-[#1A1C1E] focus:ring-0 transition-all cursor-pointer accent-[#1A1C1E]"
                                            onChange={(e) => e.target.checked ? setSelectedInvoices(invoices.map(i => i._id)) : setSelectedInvoices([])}
                                        />
                                    </th>
                                    <th className="px-6 py-5 text-[11px] inter-bold uppercase text-slate-400 tracking-[0.15em]">Invoice & Project</th>
                                    <th className="px-6 py-5 text-[11px] inter-bold uppercase text-slate-400 tracking-[0.15em]">Client Entity</th>
                                    <th className="px-6 py-5 text-[11px] inter-bold uppercase text-slate-400 tracking-[0.15em]">Settlement</th>
                                    <th className="px-6 py-5 text-[11px] inter-bold uppercase text-slate-400 tracking-[0.15em] text-right">Grand Total</th>
                                    <th className="px-6 py-5 text-[11px] inter-bold uppercase text-slate-400 tracking-[0.15em] text-center">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-32 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin"></div>
                                                <p className="judson-regular-italic text-slate-400 text-lg">Synchronizing data streams...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedInvoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-[#F8FAFC] transition-all group">
                                        <td className="px-8 py-6">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-slate-300 text-[#1A1C1E] focus:ring-0 cursor-pointer accent-[#1A1C1E]"
                                                checked={selectedInvoices.includes(inv._id)}
                                                onChange={() => setSelectedInvoices(prev => prev.includes(inv._id) ? prev.filter(id => id !== inv._id) : [...prev, inv._id])}
                                            />
                                        </td>
                                        <td className="px-6 py-6">
                                            {/* ID এবং Project Title এর ওপর ক্লিক করলে ডিটেইলস পেজে যাবে */}
                                            <Link href={`/admin/invoices/${inv._id}`} className="flex flex-col gap-1 cursor-pointer group/item">
                                                <span className="judson-bold text-lg text-[#1A1C1E] group-hover:text-[#4177BC] transition-colors leading-none">
                                                    #{inv.invoiceId || inv._id.slice(-6)}
                                                </span>
                                                <span className="text-xs inter-medium text-slate-400 truncate w-56 tracking-tight group-hover/item:text-slate-600">{inv.projectTitle}</span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center judson-bold text-sm shadow-lg shadow-black/5">
                                                    {inv.clientName?.charAt(0)}
                                                </div>
                                                <span className="text-sm inter-semibold text-slate-700">{inv.clientName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <StatusBadge status={inv.status} />
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="judson-bold text-xl text-[#1A1C1E]">${(inv.grandTotal || inv.amount).toLocaleString()}</span>
                                                <span className="text-[10px] inter-bold text-slate-300 uppercase tracking-widest">USD Tethered</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleDownloadInvoice(inv._id)}
                                                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-[#4177BC] hover:border-[#4177BC]/20 hover:shadow-md rounded-xl transition-all"
                                                    title="Archive Download"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                {/* External Link আইকনটিও ডিটেইলস পেজে নিয়ে যাবে */}
                                                <Link href={`/admin/invoices/${inv._id}`} className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-[#1A1C1E] hover:border-slate-200 hover:shadow-md rounded-xl transition-all" title="Review Context">
                                                    <ExternalLink size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-8 py-6 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] inter-bold text-slate-400 uppercase tracking-[0.2em]">Data Navigation</span>
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm">
                                <span className="text-xs inter-bold text-[#1A1C1E]">{currentPage}</span>
                                <span className="mx-2 text-slate-300 text-xs">/</span>
                                <span className="text-xs inter-bold text-slate-400">{Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl inter-bold text-xs disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                            >
                                <ChevronLeft size={14} strokeWidth={3} /> BACK
                            </button>
                            <button
                                disabled={currentPage >= Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="px-5 py-2.5 bg-[#1A1C1E] text-white rounded-xl inter-bold text-xs disabled:opacity-30 hover:bg-[#2D3135] transition-all shadow-lg shadow-black/5 active:scale-95 flex items-center gap-2"
                            >
                                NEXT <ChevronRight size={14} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- Specialized Internal Components ---

function StatCard({ label, amount, type, icon, subText }: any) {
    const config: any = {
        primary: { color: "#4177BC", bg: "bg-blue-500", lightBg: "bg-blue-50/50" },
        success: { color: "#10B981", bg: "bg-emerald-500", lightBg: "bg-emerald-50/50" },
        danger: { color: "#F43F5E", bg: "bg-rose-500", lightBg: "bg-rose-50/50" }
    };
    const current = config[type];

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 transition-all group relative overflow-hidden">
            <div className="flex flex-col relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${current.lightBg} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`} style={{ color: current.color }}>
                        {icon}
                    </div>
                    <div className={`h-1.5 w-12 rounded-full ${current.bg} opacity-20`}></div>
                </div>
                <p className="text-[10px] inter-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h3 className="judson-bold text-4xl text-[#1A1C1E] leading-tight mb-2 tracking-tight">
                    <span className="text-xl mr-1 font-normal text-slate-300">$</span>
                    {amount.toLocaleString()}
                </h3>
                <p className="text-xs inter-medium text-slate-400">{subText}</p>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                {React.cloneElement(icon, { size: 120 })}
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        Paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
        Unpaid: "text-rose-600 bg-rose-50 border-rose-100",
        Pending: "text-amber-600 bg-amber-50 border-amber-100",
        Overdue: "text-slate-500 bg-slate-50 border-slate-200"
    };
    return (
        <span className={`px-3 py-1.5 rounded-xl text-[10px] inter-bold uppercase tracking-widest border shadow-sm ${styles[status] || styles.Unpaid}`}>
            {status}
        </span>
    );
}