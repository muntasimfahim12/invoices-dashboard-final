/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Search, ArrowUpRight, DollarSign, Trash2, User,
    Filter, Download, X, Globe, Zap,
    ShieldCheck, Briefcase, Mail, Tag, ChevronDown, Menu
} from "lucide-react";
import Link from "next/link";

interface Payment {
    id: string;
    amount: number;
    payer: string;
    email: string;
    category: string;
    method: string;
    status: string;
    date: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [amount, setAmount] = useState("");
    const [payer, setPayer] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("SERVICE");

    useEffect(() => {
        const saved = localStorage.getItem("payments");
        if (saved) setPayments(JSON.parse(saved));
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const totalReceived = useMemo(() => payments.reduce((a, b) => a + b.amount, 0), [payments]);

    const filteredPayments = useMemo(() => {
        return payments.filter(p =>
            p.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [payments, searchQuery]);

    const createPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const newPayment: Payment = {
            id: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
            amount: Number(amount), payer, email, category, method: "BANK",
            status: "PAID",
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        const updated = [newPayment, ...payments];
        setPayments(updated);
        localStorage.setItem("payments", JSON.stringify(updated));
        setIsModalOpen(false);
        setAmount(""); setPayer(""); setEmail("");
    };

    const deletePayment = (id: string) => {
        const updated = payments.filter(p => p.id !== id);
        setPayments(updated);
        localStorage.setItem("payments", JSON.stringify(updated));
    };

    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-slate-200/60 rounded-3xl ${className}`} />
    );

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-40 md:pb-10">

            {/* --- Header --- */}
            <header className="sticky top-0 z-30   border-b border-slate-100/50 px-6 py-4 md:px-16 md:py-8 transition-all">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-full md:w-auto flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#4177BC] text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Live Ledger</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter italic uppercase">
                                Finance <span className="text-[#4177BC]">Hub</span>
                            </h1>
                        </div>
                        <button className="md:hidden p-3 bg-slate-50 rounded-2xl text-slate-400"><Menu size={20} /></button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search ledger..."
                                className="w-full pl-12 pr-6 py-4 md:py-5 bg-slate-50 md:bg-white border border-transparent md:border-slate-100 rounded-[20px] md:rounded-[25px] text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-blue-50 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="hidden md:flex px-8 py-5 bg-[#4177BC] text-white rounded-[25px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-400/30 hover:scale-105 transition-all items-center gap-3">
                            <Plus size={20} /> New Entry
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-16 pt-8 md:pt-12">

                {/* --- Dynamic Stats (Horizontal Scroll Preserved) --- */}
                <section className="flex md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto pb-6 md:pb-0 no-scrollbar">
                    {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="min-w-[280px] md:min-w-0 h-40 rounded-[40px]" />) : (
                        <>
                            <StatCard title="Total Revenue" value={`$${totalReceived.toLocaleString()}`} icon={<Globe />} color="#4177BC" />
                            <StatCard title="Total Count" value={payments.length} icon={<Zap />} color="#EB9C2C" />
                            <StatCard title="Average" value={`$${(totalReceived / (payments.length || 1)).toFixed(0)}`} icon={<Briefcase />} color="#4177BC" />
                            <StatCard title="Security" value="A+" icon={<ShieldCheck />} color="#EB9C2C" />
                        </>
                    )}
                </section>

                {/* --- Ledger View --- */}
                <div className="mt-12 mb-6 flex items-center justify-between">
                    <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight uppercase italic">Record <span className="text-[#4177BC]">Manifest</span></h3>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4177BC] transition-all"><Filter size={18} /></button>
                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#EB9C2C] transition-all"><Download size={18} /></button>
                    </div>
                </div>

                <div className="bg-white md:border border-slate-100 rounded-[35px] md:rounded-[50px] shadow-2xl shadow-blue-900/5 overflow-hidden">
                    <div className="md:hidden divide-y divide-slate-50">
                        {filteredPayments.map((p) => (
                            <Link href={`/admin/payments/${p.id}`} key={p.id} className="p-6 flex items-center justify-between active:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-[#4177BC] border border-slate-100">{p.payer.charAt(0)}</div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">{p.payer}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-800 text-base">${p.amount.toLocaleString()}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{p.date}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                                    <th className="px-10 py-6 text-left">Entity</th>
                                    <th className="px-10 py-6 text-left">Class</th>
                                    <th className="px-10 py-6 text-left">Amount</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredPayments.map((p) => (
                                    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={p.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-[#4177BC] shadow-sm group-hover:bg-[#4177BC] group-hover:text-white transition-all">
                                                    {p.payer.charAt(0)}
                                                </div>
                                                <p className="font-black text-slate-800 text-sm tracking-tight">{p.payer}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase border ${p.category === 'SERVICE' ? 'border-blue-100 text-[#4177BC]' : 'border-orange-100 text-[#EB9C2C]'}`}>{p.category}</span>
                                        </td>
                                        <td className="px-10 py-8 font-black text-slate-800 text-lg italic">${p.amount.toLocaleString()}</td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Link href={`/admin/payments/${p.id}`} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-[#4177BC] transition-all"><ArrowUpRight size={18} /></Link>
                                                <button onClick={() => deletePayment(p.id)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* --- Mobile Fixed Button (Moved up from bottom bar) --- */}
            {/* --- Mobile Floating Action Button (FAB) --- */}
            <div className="fixed bottom-24 right-6 md:hidden z-40">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-14 h-14 bg-[#4177BC] text-white rounded-full shadow-[0_10px_25px_rgba(65,119,188,0.4)] flex items-center justify-center active:scale-90 transition-all border-4 border-white"
                    aria-label="New Entry"
                >
                    <Plus size={28} strokeWidth={3} />
                </button>
            </div>

            {/* --- Modal --- */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 md:top-0 md:bottom-0 left-0 right-0 m-auto w-full md:max-w-xl h-[90vh] md:h-fit bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl z-[51] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 md:p-12 overflow-y-auto h-full no-scrollbar pb-32 md:pb-12">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Secure <span className="text-[#4177BC]">Entry</span></h2>
                                        <p className="text-[#EB9C2C] text-[9px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2"><ShieldCheck size={14} /> Encrypted Channel</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-full"><X size={20} /></button>
                                </div>

                                <form onSubmit={createPayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Identity</label>
                                        <div className="relative">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input required type="text" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none" value={payer} onChange={(e) => setPayer(e.target.value)} placeholder="Name" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input required type="email" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#EB9C2C]" size={18} />
                                            <input required type="number" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                        <div className="relative">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <select className="w-full pl-14 pr-10 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none appearance-none" value={category} onChange={(e) => setCategory(e.target.value)}>
                                                <option value="SERVICE">Service Fee</option>
                                                <option value="PRODUCT">Product Sale</option>
                                                <option value="REFUND">Adjustment</option>
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    {/* --- Modal Confirmation Button Fixed for Mobile --- */}
                                    <div className="md:col-span-2 pt-6 sticky bottom-0 bg-white pb-4 md:static md:pb-0">
                                        <button type="submit" className="w-full py-5 md:py-6 bg-[#4177BC] text-white rounded-[25px] text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-[#EB9C2C] transition-all">
                                            Confirm & Archive
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <motion.div whileHover={{ y: -5 }} className="min-w-[260px] md:min-w-0 bg-white p-8 md:p-10 rounded-[40px] border border-slate-100/50 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-all duration-700" style={{ color }}>
                {React.cloneElement(icon, { size: 100 })}
            </div>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[22px] mb-6 flex items-center justify-center shadow-lg" style={{ backgroundColor: `${color}10`, color }}>
                {React.cloneElement(icon, { size: 24 })}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter italic uppercase">{value}</h3>
        </motion.div>
    );
}