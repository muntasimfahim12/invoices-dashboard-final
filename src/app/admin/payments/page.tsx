/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Trash2, Filter, Download, 
    ShieldCheck, ExternalLink, CheckCircle2, 
    RefreshCcw, FileText, ArrowRightLeft, 
    Edit3, CreditCard, X
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

const API_BASE = "http://localhost:5000";

export default function ProfessionalPaymentsManager() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<any>(null);
    const [newPaymentAmount, setNewPaymentAmount] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/clinets`);
            setClients(response.data);
        } catch (error) {
            console.error("Error fetching ledger:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // পেমেন্ট আপডেট করার ফাংশন (এডমিন যখন ক্লায়েন্টের কাছ থেকে টাকা পাবে)
    const handleUpdatePayment = async () => {
        if (!selectedClient || !newPaymentAmount) return;
        
        try {
            const updatedPaidAmount = Number(selectedClient.totalPaid || 0) + Number(newPaymentAmount);
            await axios.put(`${API_BASE}/clinets/${selectedClient._id}`, {
                totalPaid: updatedPaidAmount
            });
            setSelectedClient(null);
            setNewPaymentAmount("");
            fetchData(); // ডাটা রিফ্রেশ
            alert("Payment Logged Successfully!");
        } catch (error) {
            alert("Failed to update payment.");
        }
    };

    const stats = useMemo(() => {
        const totalRev = clients.reduce((acc, c) => acc + (Number(c.totalPaid) || 0), 0);
        const totalBudget = clients.reduce((acc, c) => acc + (Number(c.projects?.[0]?.budget) || 0), 0);
        return {
            collected: totalRev,
            pending: totalBudget - totalRev,
            clients: clients.length
        };
    }, [clients]);

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10">
            <div className="max-w-[1400px] mx-auto">
                
                {/* --- Header Area --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                            Revenue <span className="text-[#4177BC]">Control Center</span>
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest">System Live</span>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Admin ID: 00412</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/invoices/create" className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                            <FileText size={16} /> New Invoice
                        </Link>
                        <button onClick={fetchData} className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                            <RefreshCcw size={20} />
                        </button>
                    </div>
                </div>

                {/* --- Quick Analytics --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatBox label="Total Collections" value={`$${stats.collected.toLocaleString()}`} color="#10B981" />
                    <StatBox label="Outstanding Receivables" value={`$${stats.pending.toLocaleString()}`} color="#F59E0B" />
                    <StatBox label="Success Ratio" value="94.2%" color="#4177BC" />
                </div>

                {/* --- Ledger Table --- */}
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex flex-col md:row justify-between gap-4 md:flex-row">
                        <div className="relative flex-1 md:max-w-md">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                type="text" 
                                placeholder="Filter by entity or email..."
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 ring-blue-100 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Client Profile</th>
                                    <th className="px-8 py-5">Agreement Value</th>
                                    <th className="px-8 py-5">Paid Status</th>
                                    <th className="px-8 py-5">Net Due</th>
                                    <th className="px-8 py-5 text-right">Administrative Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((client) => {
                                    const budget = Number(client.projects?.[0]?.budget || 0);
                                    const paid = Number(client.totalPaid || 0);
                                    const due = budget - paid;

                                    return (
                                        <tr key={client._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#4177BC] text-white flex items-center justify-center font-black italic">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter italic">{client.name}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{client.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-black text-slate-600">${budget.toLocaleString()}</td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-emerald-600 tracking-tighter">${paid.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-black italic ${due > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                                                        ${due.toLocaleString()}
                                                    </span>
                                                    {due > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    {due > 0 ? (
                                                        <button 
                                                            onClick={() => setSelectedClient(client)}
                                                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:border-[#4177BC] hover:text-[#4177BC] transition-all"
                                                        >
                                                            <Edit3 size={14} /> Log Payment
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-emerald-50 rounded-lg">
                                                            <CheckCircle2 size={12} /> Full Paid
                                                        </div>
                                                    )}
                                                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Payment Logging Modal --- */}
                <AnimatePresence>
                    {selectedClient && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setSelectedClient(null)}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl"
                            >
                                <button onClick={() => setSelectedClient(null)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900"><X /></button>
                                
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-blue-50 text-[#4177BC] rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <CreditCard size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Log Collection</h3>
                                    <p className="text-slate-400 text-xs font-bold mt-1">Entity: {selectedClient.name}</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Received Amount ($)</label>
                                        <input 
                                            type="number"
                                            placeholder="Enter amount (e.g. 500)"
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-[#4177BC] rounded-2xl outline-none font-black text-slate-800 transition-all"
                                            value={newPaymentAmount}
                                            onChange={(e) => setNewPaymentAmount(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleUpdatePayment}
                                        className="w-full py-5 bg-[#4177BC] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-200 hover:bg-slate-900 transition-all"
                                    >
                                        Confirm Entry
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

function StatBox({ label, value, color }: any) {
    return (
        <div className="bg-white p-8 rounded-[35px] border border-slate-200 relative overflow-hidden group transition-all hover:shadow-xl hover:shadow-blue-900/5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase" style={{ color }}>{value}</h3>
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:scale-110 transition-transform">
                <CreditCard size={80} />
            </div>
        </div>
    );
}