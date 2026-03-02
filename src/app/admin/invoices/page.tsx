/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Plus, Search, FileText, CheckCircle2, Trash2, Loader2,
    AlertCircle, TrendingUp, ChevronRight, Copy, ChevronLeft, Filter
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const ITEMS_PER_PAGE = 6;

// ডাটাবেস থেকে আসা নতুন ডাটা স্ট্রাকচার অনুযায়ী ইন্টারফেস আপডেট
interface Invoice {
    _id: string;
    invoiceId: string;
    clientName?: string;
    clientEmail?: string;
    projectTitle: string;
    createdAt: string;
    status: string; 
    currency?: string;
    amount?: number; // বর্তমান পেমেন্ট এমাউন্ট
    milestonesSnapshot?: any[]; // সব মাইলস্টোনের লিস্ট
    remainingDue?: number; 
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
        const email = localStorage.getItem("user_email");
        const role = localStorage.getItem("user_role") || "client";
        setUserEmail(email);
        setUserRole(role);
    }, []);

    // 🧮 ক্যালকুলেশন লজিক: মাইলস্টোন থেকে এমাউন্ট বের করা
    const getFinancials = (inv: any) => {
        const milestones = inv.milestonesSnapshot || [];
        const grandTotal = milestones.reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0);
        const paidAmount = milestones
            .filter((m: any) => m.status === "Paid")
            .reduce((sum: number, m: any) => sum + (Number(m.amount) || 0), 0);
        const remainingDue = grandTotal - paidAmount;
        
        return {
            total: grandTotal || Number(inv.amount) || 0,
            paid: paidAmount,
            due: remainingDue > 0 ? remainingDue : 0
        };
    };

    const fetchInvoices = useCallback(async (signal?: AbortSignal) => {
        if (!userEmail) return;
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/invoices`, {
                params: {
                    email: userEmail.toLowerCase().trim(),
                    role: userRole,
                    search: searchTerm,
                    status: filterStatus === "All" ? "" : filterStatus
                },
                signal
            });
            setInvoices(Array.isArray(response.data) ? response.data : []);
        } catch (error: any) {
            if (error.name !== "CanceledError") {
                console.error("Fetch Error:", error);
                toast.error("Failed to load invoices");
            }
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
        if (!window.confirm(`Are you sure you want to delete ${selectedInvoices.length} items?`)) return;

        try {
            setLoading(true);
            await axios.post(`${API_BASE}/invoices/bulk-delete`, { ids: selectedInvoices });
            setInvoices(prev => prev.filter(inv => !selectedInvoices.includes(inv._id)));
            setSelectedInvoices([]);
            toast.success("Invoices deleted successfully!");
        } catch (error: any) {
            toast.error("Error deleting invoices");
        } finally {
            setLoading(false);
        }
    }

    const totalPages = Math.ceil(invoices.length / ITEMS_PER_PAGE);
    const paginatedInvoices = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return invoices.slice(start, start + ITEMS_PER_PAGE);
    }, [invoices, currentPage]);

    const stats = useMemo(() => {
        let total = 0;
        let paid = 0;
        invoices.forEach(inv => {
            const fin = getFinancials(inv);
            total += fin.total;
            paid += fin.paid;
        });
        const overdueCount = invoices.filter(inv => inv.status?.toLowerCase() === 'overdue').length;
        return { total, paid, overdueCount };
    }, [invoices]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#FFFFFF] selection:bg-[#4177BC]/20 inter-medium text-slate-600 pb-20">
            <Toaster position="top-right" />
            
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
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={handleDeleteSelected}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl border border-red-100 text-xs font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span> ({selectedInvoices.length})
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
                            {["All", "Paid", "Pending", "Overdue", "Unpaid"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {setFilterStatus(status); setCurrentPage(1);}}
                                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-semibold transition-all border border-transparent ${filterStatus === status ? 'bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/30' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <span className={filterStatus === status ? "inter-bold" : "inter-medium"}>{status}</span>
                                    {filterStatus === status && <ChevronRight size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-9 space-y-6">
                    <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text" placeholder="Search by ID, Project or Client..." value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent border-none pl-12 pr-4 py-3 text-sm font-medium focus:ring-0 outline-none text-slate-700"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden min-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/80 border-b border-slate-100">
                                <tr>
                                    <th className="pl-8 py-6 w-14">
                                        <input
                                            type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#4177BC] cursor-pointer"
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
                                        <motion.tr key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="py-32 text-center"><Loader2 className="animate-spin mx-auto text-[#4177BC]" size={40} /></td>
                                        </motion.tr>
                                    ) : paginatedInvoices.length === 0 ? (
                                        <motion.tr key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <td colSpan={5} className="py-32 text-center text-slate-400 italic font-medium">No invoices found matching your criteria.</td>
                                        </motion.tr>
                                    ) : (
                                        paginatedInvoices.map((inv) => {
                                            const fin = getFinancials(inv);
                                            return (
                                                <motion.tr key={inv._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="pl-8 py-6">
                                                        <input
                                                            type="checkbox" checked={selectedInvoices.includes(inv._id)}
                                                            onChange={() => setSelectedInvoices(prev => prev.includes(inv._id) ? prev.filter(i => i !== inv._id) : [...prev, inv._id])}
                                                            className="w-4 h-4 rounded border-slate-300 text-[#4177BC] cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC] group-hover:text-white transition-all duration-300">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="inter-bold text-slate-900 text-sm">{inv.invoiceId || "N/A"}</p>
                                                                    <button onClick={() => {navigator.clipboard.writeText(inv.invoiceId); toast.success("ID Copied!");}} className="opacity-0 group-hover:opacity-100 text-[#4177BC] transition-all"><Copy size={12} /></button>
                                                                </div>
                                                                <p className="text-xs text-slate-500 font-semibold">{inv.clientName || "Unknown Client"}</p>
                                                                <p className="text-[10px] text-slate-400 mt-1 font-bold">{inv.projectTitle}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6"><StatusBadge status={inv.status} /></td>
                                                    <td className="px-6 py-6 text-right">
                                                        <p className="judson-bold text-lg text-slate-900 mb-1">
                                                            {inv.currency || "$"} {fin.total.toLocaleString()}
                                                        </p>
                                                        <p className={`text-[10px] font-bold uppercase ${fin.due > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                            {fin.due > 0 ? `Due: ${inv.currency || "$"}${fin.due.toLocaleString()}` : 'Fully Paid'}
                                                        </p>
                                                    </td>
                                                    <td className="pr-8 py-6 text-right">
                                                        <Link href={`${userRole === 'admin' ? '/admin' : '/dashboard'}/invoices/${inv._id}`} className="w-9 h-9 inline-flex items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-[#4177BC] transition-all shadow-sm">
                                                            <ChevronRight size={16} />
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            )
                                        })
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={invoices.length} />
                    </div>

                    <div className="md:hidden space-y-4">
                        {paginatedInvoices.map((inv) => {
                            const fin = getFinancials(inv);
                            return (
                                <div key={inv._id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3">
                                            <input
                                                type="checkbox" checked={selectedInvoices.includes(inv._id)}
                                                onChange={() => setSelectedInvoices(prev => prev.includes(inv._id) ? prev.filter(i => i !== inv._id) : [...prev, inv._id])}
                                                className="w-4 h-4 rounded border-slate-300 text-[#4177BC]"
                                            />
                                            <div>
                                                <p className="inter-bold text-slate-900">{inv.invoiceId}</p>
                                                <p className="text-xs text-slate-500 font-bold">{inv.clientName || "Unknown"}</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={inv.status} />
                                    </div>
                                    <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Amount</p>
                                            <p className="judson-bold text-xl text-slate-900">{inv.currency || "$"} {fin.total.toLocaleString()}</p>
                                        </div>
                                        <Link href={`${userRole === 'admin' ? '/admin' : '/dashboard'}/invoices/${inv._id}`} className="p-2.5 bg-slate-900 text-white rounded-xl">
                                            <ChevronRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} totalItems={invoices.length} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// 📌 Internal Components (আগের মতোই রাখা হয়েছে)
function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="p-3.5 rounded-2xl w-fit mb-4" style={{ backgroundColor: `${color}15`, color }}>
                {React.cloneElement(icon, { size: 22 })}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl judson-bold text-slate-900">{value}</p>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase() || 'unpaid';
    const config: any = {
        paid: "bg-emerald-50 border-emerald-200 text-emerald-700",
        pending: "bg-amber-50 border-amber-200 text-amber-700",
        overdue: "bg-red-50 border-red-200 text-red-700",
        unpaid: "bg-slate-100 border-slate-200 text-slate-600",
        sent: "bg-blue-50 border-blue-200 text-blue-700",
    };
    return (
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config[s] || config.unpaid}`}>
            {status || 'Unpaid'}
        </span>
    );
}

function Pagination({ currentPage, totalPages, setCurrentPage, totalItems }: any) {
    if (totalPages <= 1) return null;
    return (
        <div className="px-8 py-5 bg-slate-50/50 border-t flex items-center justify-between mt-auto">
            <p className="text-xs text-slate-500 font-semibold inter-medium">
                Showing {Math.min(totalItems, (currentPage - 1) * ITEMS_PER_PAGE + 1)}-{Math.min(totalItems, currentPage * ITEMS_PER_PAGE)} of {totalItems}
            </p>
            <div className="flex gap-2">
                <button 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage((p: any) => p - 1)} 
                    className="p-2 border bg-white rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors shadow-sm"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage((p: any) => p + 1)} 
                    className="p-2 border bg-white rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors shadow-sm"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}