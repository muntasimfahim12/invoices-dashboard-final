/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, TrendingUp, Users, Wallet, X, Loader2,
    ArrowUpRight, Briefcase, ArrowRightLeft, ChevronDown
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "http://localhost:5000";

export default function ProfessionalPaymentsManager() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal & Selection States
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
    const [newPaymentAmount, setNewPaymentAmount] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/clinets`);
            setClients(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to sync with ledger.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleLogPaymentClick = (client: any) => {
        setSelectedClient(client);

        const firstProject = client.projects && client.projects.length > 0 ? client.projects[0] : null;

        if (firstProject) {
            setSelectedProject(firstProject);
            const unpaidMilestones = firstProject.milestones?.filter(
                (m: any) => m.status?.toLowerCase() !== "paid"
            ) || [];

            if (unpaidMilestones.length > 0) {
                const firstUnpaid = unpaidMilestones[0];
                setSelectedInvoice(firstUnpaid);
                setNewPaymentAmount(firstUnpaid.amount?.toString() || "");
            } else {
                setSelectedInvoice(null);
                setNewPaymentAmount("");
            }
        }
    };

    // --- প্রোজেক্ট ম্যানুয়ালি চেঞ্জ করলে মাইলস্টোন এবং অ্যামাউন্ট আপডেট ---
    const handleProjectChange = (proj: any) => {
        setSelectedProject(proj);
        const unpaidMilestones = proj.milestones?.filter(
            (m: any) => m.status?.toLowerCase() !== "paid"
        ) || [];

        if (unpaidMilestones.length > 0) {
            const firstUnpaid = unpaidMilestones[0];
            setSelectedInvoice(firstUnpaid);
            setNewPaymentAmount(firstUnpaid.amount?.toString() || "");
        } else {
            setSelectedInvoice(null);
            setNewPaymentAmount("");
        }
    };

    // --- মাইলস্টোন ড্রপডাউন থেকে সিলেক্ট করলে অ্যামাউন্ট অটো-ফিল ---
    const handleMilestoneChange = (milestoneId: string) => {
        if (!milestoneId) {
            setSelectedInvoice(null);
            setNewPaymentAmount("");
            return;
        }

        const milestone = selectedProject?.milestones?.find((m: any) => m._id === milestoneId);
        if (milestone) {
            setSelectedInvoice(milestone);
            setNewPaymentAmount(milestone.amount?.toString() || "");
        }
    };

    const closePaymentModal = () => {
        setSelectedClient(null);
        setSelectedProject(null);
        setSelectedInvoice(null);
        setNewPaymentAmount("");
        setPaymentMethod("Bank Transfer");
    };

    const handleUpdatePayment = async () => {
        if (!selectedClient || !selectedProject || !selectedInvoice || !newPaymentAmount) {
            toast.error("Please ensure a project and milestone are selected.");
            return;
        }

        setIsUpdating(true);
        try {
            const payload = {
                projectId: selectedProject._id,
                invoiceId: selectedInvoice._id,
                amount: Number(newPaymentAmount),
                method: paymentMethod,
                date: new Date().toISOString()
            };

            // ব্যাকএন্ডে পেমেন্ট আপডেট কল
            await axios.put(`${API_BASE}/clinets/${selectedClient._id}/payment`, payload);

            toast.success(`Payment successful for ${selectedInvoice.name || 'Milestone'}`);

            // ১. লেটেস্ট ডাটা ফেচ করা
            const response = await axios.get(`${API_BASE}/clinets`);
            const updatedClients = Array.isArray(response.data) ? response.data : [];
            setClients(updatedClients);

            // ২. কারেন্ট ক্লায়েন্ট এবং প্রজেক্ট খুঁজে বের করা
            const currentClient = updatedClients.find((c: any) => c._id === selectedClient._id);
            if (currentClient) {
                const currentProject = currentClient.projects?.find((p: any) => p._id === selectedProject._id);

                if (currentProject) {
                    const remainingUnpaid = currentProject.milestones?.filter(
                        (m: any) => m.status?.toLowerCase() !== "paid"
                    ) || [];

                    if (remainingUnpaid.length > 0) {
                        // পরবর্তী আনপেইড মাইলস্টোন সেট করা
                        setSelectedClient(currentClient);
                        setSelectedProject(currentProject);
                        setSelectedInvoice(remainingUnpaid[0]);
                        setNewPaymentAmount(remainingUnpaid[0].amount?.toString() || "");
                        setPaymentMethod("Bank Transfer");
                    } else {
                        // সব পেইড হয়ে গেলে মোডাল বন্ধ
                        closePaymentModal();
                    }
                } else {
                    closePaymentModal();
                }
            } else {
                closePaymentModal();
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Payment update failed.");
        } finally {
            setIsUpdating(false);
        }
    };

    // Stats Logic
    const stats = useMemo(() => {
        let collected = 0;
        let totalBudget = 0;
        clients.forEach(c => {
            collected += Number(c.totalPaid || 0);
            c.projects?.forEach((p: any) => totalBudget += Number(p.budget || 0));
        });
        return { collected, pending: Math.max(0, totalBudget - collected), count: clients.length };
    }, [clients]);

    const filteredClients = useMemo(() => {
        return clients.filter(c =>
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [clients, searchQuery]);

    return (
        <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-10 text-slate-900 selection:bg-[#4177BC]/10">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto">

                {/* --- HEADER --- */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-full bg-[#4177BC]/10 text-[#4177BC] text-[10px] uppercase tracking-widest font-bold">
                                Enterprise Ledger v2.0
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                            All <span className="text-[#4177BC] font-normal italic">Payments</span>
                        </h1>
                    </motion.div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4177BC]" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="pl-12 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none w-64 focus:ring-2 ring-[#4177BC]/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                {/* --- STATS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard label="Total Collected" value={`$${stats.collected.toLocaleString()}`} icon={<TrendingUp />} color="text-[#4177BC]" />
                    <StatCard label="Pending Receivables" value={`$${stats.pending.toLocaleString()}`} icon={<ArrowRightLeft />} color="text-orange-500" />
                    <StatCard label="Active Clients" value={stats.count.toString()} icon={<Users />} color="text-slate-800" />
                </div>

                {/* --- CLIENTS TABLE --- */}
                <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Client Identity</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Portfolio</th>
                                    <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Financials</th>
                                    <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={4} className="py-24 text-center"><Loader2 className="animate-spin mx-auto text-[#4177BC]" size={32} /></td></tr>
                                ) : filteredClients.map((client, cIdx) => {
                                    const budget = client.projects?.reduce((sum: any, p: any) => sum + (Number(p.budget) || 0), 0) || 0;
                                    const paid = Number(client.totalPaid || 0);
                                    const due = Math.max(0, budget - paid);

                                    return (
                                        <tr key={client._id || `client-${cIdx}`} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                        {client.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">{client.name}</p>
                                                        <p className="text-xs text-slate-400">{client.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={14} className="text-slate-300" />
                                                    <span className="text-xs font-medium text-slate-600">{client.projects?.length || 0} active nodes</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-emerald-600">${paid.toLocaleString()}</span>
                                                    <span className="text-sm font-bold text-orange-500">${due.toLocaleString()} Due</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button
                                                    onClick={() => handleLogPaymentClick(client)}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs hover:border-[#4177BC] hover:text-[#4177BC] transition-all"
                                                >
                                                    <Wallet size={14} /> Log Payment
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- MODAL --- */}
                <AnimatePresence>
                    {selectedClient && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => !isUpdating && closePaymentModal()}
                                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                                className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-white"
                            >
                                <div className="bg-[#4177BC] p-8 text-white relative">
                                    <button onClick={closePaymentModal} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
                                    <h3 className="text-3xl font-bold mb-1">Settlement Entry</h3>
                                    <p className="text-white/70 text-sm uppercase tracking-widest">Client: {selectedClient.name}</p>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* 1. Project Selection */}
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">1. Select Portfolio (Project)</label>
                                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                            {selectedClient.projects?.map((proj: any, pIdx: number) => (
                                                <button
                                                    key={proj._id || `proj-${pIdx}`}
                                                    onClick={() => handleProjectChange(proj)}
                                                    className={`shrink-0 px-4 py-3 rounded-2xl border transition-all text-left ${selectedProject?._id === proj._id ? 'border-[#4177BC] bg-[#4177BC]/5 ring-2 ring-[#4177BC]/10' : 'border-slate-100 bg-slate-50'}`}
                                                >
                                                    <p className={`text-xs font-bold ${selectedProject?._id === proj._id ? 'text-[#4177BC]' : 'text-slate-600'}`}>{proj.name}</p>
                                                    <p className="text-[10px] text-slate-400">Budget: ${proj.budget}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Milestone Selection */}
                                    {selectedProject && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">2. Select Unpaid Milestone</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedInvoice?._id || ""}
                                                    onChange={(e) => handleMilestoneChange(e.target.value)}
                                                    className="w-full appearance-none p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-[#4177BC]/10"
                                                >
                                                    <option value="">Choose Milestone...</option>
                                                    {selectedProject?.milestones
                                                        ?.filter((m: any) => m.status?.toLowerCase() !== "paid")
                                                        .map((mile: any, mIdx: number) => (
                                                            <option key={mile._id || `mile-${mIdx}`} value={mile._id}>
                                                                {mile.name || 'Task'} — ${mile.amount}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                            </div>
                                            {selectedProject.milestones?.filter((m: any) => m.status?.toLowerCase() !== "paid").length === 0 && (
                                                <p className="text-[10px] text-emerald-600 mt-2 font-medium">✓ All milestones are fully paid for this project.</p>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* 3. Method & Amount */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</label>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none"
                                            >
                                                <option>Bank Transfer</option>
                                                <option>bKash</option>
                                                <option>Nagad</option>
                                                <option>Cash</option>
                                                <option>Payoneer</option>
                                                <option>Crypto</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount ($)</label>
                                            <input
                                                type="number"
                                                value={newPaymentAmount}
                                                onChange={(e) => setNewPaymentAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-[#4177BC] outline-none focus:ring-2 ring-[#4177BC]/10"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isUpdating || !selectedInvoice || !newPaymentAmount}
                                        onClick={handleUpdatePayment}
                                        className="w-full py-5 bg-slate-900 hover:bg-[#4177BC] text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
                                    >
                                        {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <>Execute Payment <ArrowUpRight size={18} /></>}
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

// --- সাহায্যকারী কম্পোনেন্ট (StatCard) ---
function StatCard({ label, value, icon, color }: any) {
    return (
        <motion.div whileHover={{ y: -5 }} className="p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm relative group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                {React.cloneElement(icon, { size: 60 })}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
            <h3 className={`text-4xl font-bold tracking-tight ${color} mb-4`}>{value}</h3>
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Live System Sync</span>
            </div>
        </motion.div>
    );
}