/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Plus, Search, FileText, CheckCircle2, Trash2, Loader2,
    AlertCircle, TrendingUp, LayoutGrid, List,
    ChevronRight, Copy, ChevronLeft, Filter
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 6;

interface Client {
    name: string;
    email?: string;
}

interface Invoice {
    _id: string;
    invoiceId: string;
    clientName?: string;
    clientEmail?: string;
    client?: Client;
    projectTitle: string;
    createdAt: string;
    status: 'Paid' | 'Pending' | 'Overdue' | 'Partial' | 'Unpaid' | 'Sent';
    currency: string;
    grandTotal: number;
    receivedAmount: number;
    remainingDue: number;
}

export default function InvoicesPage() {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string>("client");
    const [mounted, setMounted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setMounted(true);
        setUserEmail(localStorage.getItem("user_email"));
        setUserRole(localStorage.getItem("user_role") || "client");
    }, []);

    const fetchInvoices = useCallback(async (signal?: AbortSignal) => {
        if (!userEmail) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/invoices`, {
                params: {
                    email: userEmail,
                    role: userRole,
                    search: searchTerm,
                    status: filterStatus === "All" ? "" : filterStatus
                },
                signal
            });
            setInvoices(Array.isArray(response.data) ? response.data : []);
            setCurrentPage(1);
        } catch (error: any) {
            if (error.name !== "CanceledError") console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, [userEmail, userRole, searchTerm, filterStatus]);

    useEffect(() => {
        if (!mounted || !userEmail) return;
        const controller = new AbortController();
        fetchInvoices(controller.signal);
        return () => controller.abort();
    }, [mounted, userEmail, fetchInvoices]);

    const handleDeleteSelected = async () => {
        if (selectedInvoices.length === 0) return;

        if (!window.confirm(`Are you sure you want to delete ${selectedInvoices.length} invoices globally?`)) return;

        try {
            setLoading(true);
            await axios.post(`${API_BASE}/invoices/bulk-delete`, {
                ids: selectedInvoices
            });

            
            setInvoices(prev => prev.filter(inv => !selectedInvoices.includes(inv._id)));
            setSelectedInvoices([]);

            alert("✅ Deleted globally from Admin and Client panels!");
        } catch (error: any) {
            alert("❌ Error deleting invoices");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
    const paginatedInvoices = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return invoices.slice(start, start + ITEMS_PER_PAGE);
    }, [invoices, currentPage]);

    const stats = useMemo(() => {
        const total = invoices.reduce((acc, curr) => acc + (curr.grandTotal || 0), 0);
        const paid = invoices.reduce((acc, curr) => acc + (Number(curr.receivedAmount) || 0), 0);
        const pending = total - paid;
        const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;
        return { total, paid, pending, overdueCount };
    }, [invoices]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#FFFFFF] selection:bg-[#4177BC]/20 inter-medium text-slate-600 pb-20">
            {/* Header / Navbar */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#4177BC] to-[#2A5298] rounded-2xl flex items-center justify-center shadow-lg shadow-[#4177BC]/20">
                            <FileText className="text-white" size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-3xl text-slate-900 leading-none judson-bold tracking-tight">
                                Invoice<span className="text-[#4177BC]">List</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest inter-bold">
                                    {userRole} Workspace
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <AnimatePresence>
                            {selectedInvoices.length > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={handleDeleteSelected} // <--- ফাংশনটি এখানে যুক্ত করা হয়েছে
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl border border-red-100 text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 size={16} /> <span className="hidden sm:inline">Delete Selected</span> ({selectedInvoices.length})
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {userRole === 'admin' && (
                            <Link href="/admin/invoices/create" className="bg-[#4177BC] text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl shadow-slate-900/10 hover:opacity-90 transition-all">
                                <Plus size={18} /> New Invoice
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-8 lg:mt-12 grid grid-cols-12 gap-8">
                {/* Left Sidebar */}
                <div className="col-span-12 lg:col-span-3 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        <StatCard label="Total Revenue" value={`$${stats.total.toLocaleString()}`} icon={<TrendingUp />} color="#4177BC" />
                        <StatCard label="Collected" value={`$${stats.paid.toLocaleString()}`} icon={<CheckCircle2 />} color="#10B981" />
                        <StatCard label="Overdue" value={stats.overdueCount.toString()} icon={<AlertCircle />} color="#EF4444" />
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden lg:block">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <Filter size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-widest inter-bold">Filter Status</h3>
                        </div>
                        <div className="space-y-1">
                            {["All", "Paid", "Pending", "Overdue", "Sent"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-semibold transition-all border border-transparent ${filterStatus === status
                                        ? 'bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/30'
                                        : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    <span className={filterStatus === status ? "inter-bold" : "inter-medium"}>{status}</span>
                                    {filterStatus === status && <ChevronRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="col-span-12 lg:col-span-9 space-y-6">
                    <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search invoices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-sm font-medium focus:ring-0 outline-none inter-medium text-slate-700"
                            />
                        </div>
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden min-h-[600px] flex flex-col justify-between">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 border-b border-slate-100">
                                <tr>
                                    <th className="pl-8 py-6 w-14">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-[#4177BC] cursor-pointer"
                                            checked={selectedInvoices.length === paginatedInvoices.length && paginatedInvoices.length > 0}
                                            onChange={() => setSelectedInvoices(selectedInvoices.length === paginatedInvoices.length ? [] : paginatedInvoices.map(i => i._id))}
                                        />
                                    </th>
                                    <th className="px-6 py-5 text-[11px] uppercase inter-bold text-slate-400 tracking-widest">Details</th>
                                    <th className="px-6 py-5 text-[11px] uppercase inter-bold text-slate-400 tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[11px] uppercase inter-bold text-slate-400 tracking-widest text-right">Financials</th>
                                    <th className="pr-8 py-5 text-[11px] uppercase inter-bold text-slate-400 tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-[#4177BC]" size={40} /></td>
                                        </motion.tr>
                                    ) : paginatedInvoices.length === 0 ? (
                                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="py-32 text-center text-slate-400 italic">No invoices found.</td>
                                        </motion.tr>
                                    ) : paginatedInvoices.map((inv) => (
                                        <motion.tr key={inv._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="pl-8 py-6">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInvoices.includes(inv._id)}
                                                    onChange={() => setSelectedInvoices(prev => prev.includes(inv._id) ? prev.filter(i => i !== inv._id) : [...prev, inv._id])}
                                                    className="w-4 h-4 rounded border-slate-300 text-[#4177BC] cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC] group-hover:text-white transition-all shadow-sm">
                                                        <FileText size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="inter-bold text-slate-900 text-sm flex items-center gap-2">
                                                            {inv.invoiceId}
                                                            <button onClick={() => navigator.clipboard.writeText(inv.invoiceId)} className="opacity-0 group-hover:opacity-100 text-[#4177BC] transition-all"><Copy size={12} /></button>
                                                        </p>
                                                        <p className="text-xs text-slate-500">{inv.clientName || "Unknown Client"}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{inv.projectTitle}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6"><StatusBadge status={inv.status} /></td>
                                            <td className="px-6 py-6 text-right">
                                                <p className="judson-bold text-lg text-slate-900">{inv.currency} {inv.grandTotal.toLocaleString()}</p>
                                                <p className={`text-[10px] font-bold uppercase ${inv.remainingDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                    {inv.remainingDue > 0 ? `Due: ${inv.currency}${inv.remainingDue}` : 'Fully Paid'}
                                                </p>
                                            </td>
                                            <td className="pr-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`${userRole === 'admin' ? '/admin' : '/dashboard'}/invoices/${inv._id}`}
                                                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-[#4177BC] transition-all"
                                                    >
                                                        <ChevronRight size={16} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={invoices.length} />
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4">
                        {paginatedInvoices.map((inv) => (
                            <div key={inv._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 bg-[#4177BC]/10 rounded-lg flex items-center justify-center text-[#4177BC]"><FileText size={18} /></div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedInvoices.includes(inv._id)}
                                                    onChange={() => setSelectedInvoices(prev => prev.includes(inv._id) ? prev.filter(i => i !== inv._id) : [...prev, inv._id])}
                                                    className="w-4 h-4 rounded border-slate-300 text-[#4177BC]"
                                                />
                                                <p className="inter-bold text-slate-900">{inv.invoiceId}</p>
                                            </div>
                                            <p className="text-xs text-slate-500">{inv.clientName}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={inv.status} />
                                </div>
                                <div className="flex justify-between items-end border-t border-slate-100 pt-4 mt-2">
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold">Total Amount</p>
                                        <p className="judson-bold text-xl text-slate-900">{inv.currency} {inv.grandTotal.toLocaleString()}</p>
                                    </div>
                                    <Link href={`${userRole === 'admin' ? '/admin' : '/dashboard'}/invoices/${inv._id}`} className="p-2 bg-slate-900 text-white rounded-lg">
                                        <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <div className="bg-white p-4 rounded-xl border border-slate-200">
                            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={invoices.length} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---
function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3.5 rounded-2xl" style={{ backgroundColor: `${color}15`, color }}>
                    {React.cloneElement(icon, { size: 22, strokeWidth: 2 })}
                </div>
            </div>
            <div className="relative z-10">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest inter-bold mb-1">{label}</p>
                <p className="text-3xl judson-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        Paid: { bg: "bg-emerald-50 border-emerald-200/60 text-emerald-700", dot: "bg-emerald-500" },
        Pending: { bg: "bg-amber-50 border-amber-200/60 text-amber-700", dot: "bg-amber-500" },
        Overdue: { bg: "bg-red-50 border-red-200/60 text-red-700", dot: "bg-red-500" },
        Sent: { bg: "bg-blue-50 border-blue-200/60 text-blue-700", dot: "bg-blue-500" },
        Default: { bg: "bg-slate-50 border-slate-200 text-slate-600", dot: "bg-slate-400" }
    };
    const style = config[status] || config.Default;
    return (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${style.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            <span className="inter-bold">{status}</span>
        </span>
    );
}

function Pagination({ currentPage, totalPages, setCurrentPage, totalItems }: any) {
    return (
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 inter-medium">
                Showing <span className="text-slate-900 font-bold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-slate-900 font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of <span className="text-slate-900 font-bold">{totalItems}</span>
            </p>
            <div className="flex items-center gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p: any) => p - 1)} className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 transition-all shadow-sm"><ChevronLeft size={16} /></button>
                <div className="hidden sm:flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-[#4177BC] text-white' : 'text-slate-500 hover:bg-slate-100'}`}>{i + 1}</button>
                    ))}
                </div>
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p: any) => p + 1)} className="p-2 rounded-lg border border-slate-200 bg-white disabled:opacity-50 transition-all shadow-sm"><ChevronRight size={16} /></button>
            </div>
        </div>
    );
}