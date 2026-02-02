/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Trash2, Download,
    CheckCircle2, RefreshCcw, FileText,
    Plus, CreditCard, X, Loader2, ArrowUpRight, TrendingUp, Users,
    ChevronLeft, ChevronRight, MoreHorizontal
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

const API_BASE = "http://localhost:5000";

export default function ProfessionalPaymentsManager() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [newPaymentAmount, setNewPaymentAmount] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/clinets`);
            setClients(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching ledger:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdatePayment = async () => {
        if (!selectedClient || !newPaymentAmount || isUpdating) return;
        setIsUpdating(true);
        try {
            const currentPaid = Number(selectedClient.totalPaid || 0);
            const addedAmount = Number(newPaymentAmount);
            const updatedTotal = currentPaid + addedAmount;

            await axios.put(`${API_BASE}/clinets/${selectedClient._id}`, {
                totalPaid: updatedTotal
            });

            setSelectedClient(null);
            setNewPaymentAmount("");
            fetchData();
        } catch (error) {
            alert("Failed to update payment.");
        } finally {
            setIsUpdating(false);
        }
    };

    const stats = useMemo(() => {
        const totalRev = clients.reduce((acc, c) => acc + (Number(c.totalPaid) || 0), 0);
        const totalBudget = clients.reduce((acc, c) => acc + (Number(c.projects?.[0]?.budget) || 0), 0);
        return {
            collected: totalRev,
            pending: totalBudget - totalRev,
            count: clients.length
        };
    }, [clients]);

    const filteredClients = useMemo(() => {
        return clients.filter(c =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clients, searchQuery]);

    // Pagination Calculation
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-[#FFFFFF] p-6 md:p-12 text-slate-900 selection:bg-[#4177BC]/10">
            <div className="max-w-[1400px] mx-auto">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#4177BC] animate-pulse" />
                            <span className="text-[10px] inter-bold uppercase tracking-[0.3em] text-[#4177BC]">Financial Intelligence</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900 judson-bold">
                            Capital <span className="text-[#4177BC] text-5xl font-black tracking-tighter judson-bold">Ledger</span>
                        </h1>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <button onClick={fetchData} className="group p-4 bg-white border border-slate-200 rounded-2xl hover:border-[#4177BC]/30 transition-all shadow-sm active:scale-95">
                            <RefreshCcw size={20} className={`${loading ? "animate-spin text-[#4177BC]" : "text-slate-400 group-hover:rotate-180 transition-transform duration-700"}`} />
                        </button>
                        <Link href="/admin/invoices/create" className="flex items-center gap-3 px-8 py-4 bg-[#4177BC] text-white rounded-2xl inter-bold text-[11px] uppercase tracking-widest hover:bg-[#4177BC] transition-all shadow-2xl shadow-slate-200 active:scale-95">
                            <Plus size={18} /> Add Statement
                        </Link>
                    </div>
                </div>

                {/* --- ANALYTICS GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <StatCard label="Total Settlement" value={`$${stats.collected.toLocaleString()}`} icon={<TrendingUp />} trend="+12.5%" />
                    <StatCard label="Receivables" value={`$${stats.pending.toLocaleString()}`} icon={<Loader2 />} trend="Net Due" color="text-amber-500" />
                    <StatCard label="Live Portfolios" value={stats.count.toString()} icon={<Users />} trend="Active" />
                </div>

                {/* --- DATA TABLE CONTAINER --- */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/30">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search client directory..."
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm inter-medium outline-none focus:border-[#4177BC] focus:ring-4 ring-[#4177BC]/5 transition-all"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-5 py-3 text-slate-400 inter-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] inter-bold text-slate-400 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-10 py-6 w-20 text-center">ID</th>
                                    <th className="px-6 py-6">Identity</th>
                                    <th className="px-6 py-6">Valuation</th>
                                    <th className="px-6 py-6">Cleared</th>
                                    <th className="px-6 py-6">Balance</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-40 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="animate-spin text-[#4177BC]" size={32} />
                                                <p className="inter-bold text-[10px] text-slate-400 uppercase tracking-widest">Refreshing Ledger...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedClients.map((client, idx) => {
                                    const budget = Number(client.projects?.[0]?.budget || 0);
                                    const paid = Number(client.totalPaid || 0);
                                    const due = budget - paid;

                                    return (
                                        <motion.tr
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            key={client._id}
                                            className="group hover:bg-slate-50/80 transition-colors"
                                        >
                                            <td className="px-10 py-7 text-center">
                                                <span className="text-xs inter-bold text-slate-300">{(idx + 1 + (currentPage - 1) * itemsPerPage).toString().padStart(2, '0')}</span>
                                            </td>
                                            <td className="px-6 py-7">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-[#4177BC] flex items-center justify-center text-white judson-bold italic text-lg shadow-lg">
                                                        {client.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm inter-bold text-slate-900 uppercase tracking-tight">{client.name}</p>
                                                        <p className="text-[11px] inter-medium text-slate-400">{client.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-7 text-sm inter-bold text-slate-600">${budget.toLocaleString()}</td>
                                            <td className="px-6 py-7 text-sm inter-bold text-emerald-600">${paid.toLocaleString()}</td>
                                            <td className="px-6 py-7">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm inter-bold italic ${due > 0 ? 'text-amber-500' : 'text-slate-200'}`}>
                                                        ${due.toLocaleString()}
                                                    </span>
                                                    {due > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                </div>
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <div className="flex justify-end items-center gap-3">
                                                    {due > 0 ? (
                                                        <button
                                                            onClick={() => setSelectedClient(client)}
                                                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl inter-bold text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 shadow-sm"
                                                        >
                                                            <CreditCard size={14} /> Log Payment
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-emerald-500 inter-bold text-[9px] uppercase tracking-widest px-4 py-2 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                                            <CheckCircle2 size={12} /> Settled
                                                        </div>
                                                    )}
                                                    <button className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* --- MODERN PAGINATION --- */}
                    <div className="p-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-[11px] inter-semibold text-slate-400">
                            Showing <span className="text-slate-900">{paginatedClients.length}</span> of <span className="text-slate-900">{filteredClients.length}</span> entities
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl inter-bold text-xs transition-all ${currentPage === i + 1 ? 'bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/20' : 'text-slate-400 hover:bg-slate-50'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- MODERN TRANSACTION MODAL --- */}
                <AnimatePresence>
                    {selectedClient && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => !isUpdating && setSelectedClient(null)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                className="relative bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl border border-slate-100"
                            >
                                <button onClick={() => setSelectedClient(null)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900">
                                    <X size={24} />
                                </button>

                                <div className="text-center mb-10">
                                    <div className="w-20 h-20 bg-[#4177BC]/10 text-[#4177BC] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter judson-bold italic uppercase">Collection Entry</h3>
                                    <p className="text-slate-400 text-[10px] inter-bold mt-2 uppercase tracking-[0.2em]">Agent: {selectedClient.name}</p>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[10px] inter-bold text-slate-400 uppercase tracking-widest block mb-3 px-1">Settlement Amount ($)</label>
                                        <div className="relative">
                                            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-3xl inter-bold text-[#4177BC]">$</span>
                                            <input
                                                autoFocus
                                                type="number"
                                                className="w-full pl-16 pr-8 py-7 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none inter-bold text-slate-900 focus:bg-white focus:ring-4 ring-[#4177BC]/5 focus:border-[#4177BC] transition-all text-4xl"
                                                value={newPaymentAmount}
                                                onChange={(e) => setNewPaymentAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isUpdating || !newPaymentAmount}
                                        onClick={handleUpdatePayment}
                                        className="w-full py-6 bg-slate-900 hover:bg-[#4177BC] text-white rounded-[1.5rem] inter-bold uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {isUpdating ? <Loader2 className="animate-spin" size={20} /> : (
                                            <>Confirm Entry <ArrowUpRight size={18} /></>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, trend, color = "text-[#4177BC]", isPrimary = false }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`p-10 rounded-[2.5rem] border relative overflow-hidden group transition-all duration-500 ${isPrimary ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200' : 'bg-white border-slate-200/60 shadow-sm hover:shadow-xl'}`}
        >
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className={`text-[10px] inter-bold uppercase tracking-[0.2em] mb-4 ${isPrimary ? 'text-slate-400' : 'text-slate-400'}`}>{label}</p>
                    <h3 className={`text-5xl judson-bold italic tracking-tighter uppercase ${isPrimary ? 'text-white' : color}`}>{value}</h3>
                </div>
                <div className={`p-4 rounded-2xl transition-all ${isPrimary ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-[#4177BC] group-hover:text-white'}`}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
                <span className={`text-[10px] inter-bold px-2 py-1 rounded-md ${isPrimary ? 'bg-white/10 text-emerald-400' : 'bg-emerald-50 text-emerald-500'}`}>{trend}</span>
                <span className={`text-[10px] inter-medium tracking-wide ${isPrimary ? 'text-slate-500' : 'text-slate-300'}`}>Live Update</span>
            </div>

            <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transition-all duration-700 pointer-events-none ${isPrimary ? 'text-white' : 'text-slate-900'}`}>
                <FileText size={140} />
            </div>
        </motion.div>
    );
}