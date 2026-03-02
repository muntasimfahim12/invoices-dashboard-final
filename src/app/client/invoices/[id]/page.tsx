/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Download, Calendar, Hash,
    CheckCircle2, FileText, Activity, CreditCard,
    ExternalLink, ShieldCheck, Target, Clock
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InvoiceDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`${API_BASE}/invoices/${id}`);
                setInvoice(response.data);
            } catch (error) {
                toast.error("Records synchronized failed.");
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };
        if (id) fetchInvoice();
    }, [id]);

    const handleDownload = async () => {
        if (isExporting) return;
        setIsExporting(true);
        const tId = toast.loading('Preparing document...');
        try {
            const res = await axios.get(`${API_BASE}/invoices/download/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `INV-${invoice?.invoiceId?.slice(-6)}.pdf`);
            document.body.appendChild(link);
            link.click();
            toast.success('Ready for print', { id: tId });
        } catch (e) {
            toast.error('Sync error', { id: tId });
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    const projectTotalValue = invoice?.milestonesSnapshot?.reduce((acc: number, curr: any) => acc + Number(curr.amount), 0) || 0;
    const amountPaid = Number(invoice.amount) || 0;
    const coveragePercentage = Math.round((amountPaid / projectTotalValue) * 100);

    return (
        <div className="min-h-screen bg-white text-[#0F172A] selection:bg-[#4177BC]/10 inter-medium">
            <Toaster position="top-center" />

            {/* Premium Sticky Nav */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100/80">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/client/invoices')}
                        className="group flex items-center gap-3 text-slate-400 hover:text-[#0F172A] transition-all text-[11px] font-black tracking-[0.2em] uppercase cursor-pointer"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="inter-bold">Back to Ledger</span>
                    </button>
                    
                    <button
                        onClick={handleDownload}
                        disabled={isExporting}
                        className="bg-[#0F172A] text-white px-8 py-3 rounded-2xl text-[11px] inter-bold tracking-widest hover:bg-[#4177BC] transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 cursor-pointer shadow-[0_10px_25px_rgba(15,23,42,0.15)]"
                    >
                        {isExporting ? <Activity size={16} className="animate-spin" /> : <Download size={16} />}
                        EXPORT PDF
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12">
                <AnimatePresence mode="wait">
                    {!invoice ? (
                        <NotFoundState onBack={() => router.push('/client/invoices')} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                        >
                            {/* Left Column: Details Container */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.02)] overflow-hidden">
                                    
                                    {/* Header Section */}
                                    <div className="p-12 md:p-16 bg-[#F8FAFC]/50 border-b border-slate-100">
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-3">
                                                <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                                    <span className="text-[10px] inter-bold tracking-[0.2em] uppercase">{invoice.status}</span>
                                                </div>
                                            </div>
                                            
                                            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#0F172A] judson-bold leading-[1.1]">
                                                {invoice.projectTitle}
                                            </h1>

                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                                                    <Hash size={14} className="text-[#4177BC]" />
                                                    <span className="text-xs inter-bold text-slate-500 tracking-tighter uppercase">{invoice.invoiceId?.slice(-10)}</span>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
                                                    <Calendar size={14} className="text-[#4177BC]" />
                                                    <span className="text-xs inter-bold text-slate-500 uppercase">
                                                        {new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Billing Info */}
                                    <div className="p-12 md:p-16 space-y-20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                            <div className="space-y-5">
                                                <p className="text-[10px] inter-bold text-slate-300 tracking-[0.3em] uppercase">Client Entity</p>
                                                <div className="space-y-1">
                                                    <p className="text-2xl judson-bold text-[#0F172A]">{invoice.clientName}</p>
                                                    <p className="text-slate-400 text-sm font-medium inter-medium underline decoration-slate-100 underline-offset-4">{invoice.clientEmail}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-5 md:text-right">
                                                <p className="text-[10px] inter-bold text-slate-300 tracking-[0.3em] uppercase">Gateway</p>
                                                <div className="space-y-1">
                                                    <p className="text-2xl judson-bold text-[#4177BC]">{invoice.method || 'Digital Ledger'}</p>
                                                    <p className="text-emerald-500 text-[10px] inter-bold uppercase tracking-[0.15em]">E2E Verified</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Milestone List */}
                                        <div className="space-y-10">
                                            <div className="flex items-center gap-6">
                                                <p className="text-[10px] inter-bold text-slate-300 tracking-[0.3em] uppercase whitespace-nowrap">Allocation Breakdown</p>
                                                <div className="h-[1px] w-full bg-slate-100" />
                                            </div>

                                            <div className="grid gap-4">
                                                {invoice.milestonesSnapshot?.map((m: any, idx: number) => {
                                                    const isPaid = m.status?.toLowerCase() === 'paid';
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            whileHover={{ scale: 1.01 }}
                                                            className={`flex items-center justify-between p-7 rounded-[32px] border transition-all ${isPaid ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/40 border-dashed border-slate-200 opacity-60'}`}
                                                        >
                                                            <div className="flex items-center gap-6">
                                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm inter-bold transition-colors ${isPaid ? 'bg-[#4177BC]/10 text-[#4177BC]' : 'bg-slate-200 text-slate-400'}`}>
                                                                    {String(idx + 1).padStart(2, '0')}
                                                                </div>
                                                                <div>
                                                                    <p className={`text-lg judson-bold ${isPaid ? 'text-slate-800' : 'text-slate-500'}`}>{m.name}</p>
                                                                    <div className="flex items-center gap-2 mt-1">
                                                                        <Clock size={12} className="text-slate-300" />
                                                                        <p className="text-[10px] inter-bold text-slate-400 uppercase tracking-tight">{m.dueDate || 'Standard Term'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className={`text-xl judson-bold ${isPaid ? 'text-[#0F172A]' : 'text-slate-400'}`}>
                                                                    ${Number(m.amount).toLocaleString()}
                                                                </p>
                                                                <div className={`flex items-center justify-end gap-2 mt-1 inter-bold text-[9px] uppercase tracking-widest ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                                    {isPaid ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                                                                    {isPaid ? 'Settled' : 'Pending'}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Financial IQ */}
                            <div className="lg:col-span-4 space-y-8">
                                <div className="relative group bg-white rounded-[48px] p-1 border border-slate-200/60 shadow-[0_30px_80px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_40px_100px_rgba(65,119,188,0.08)] overflow-hidden">
                                    
                                    {/* Glass Orbs */}
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4177BC]/5 blur-[80px] rounded-full group-hover:bg-[#4177BC]/10 transition-colors" />
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full" />

                                    <div className="relative z-10 p-10 space-y-12">
                                        <div className="flex justify-between items-center">
                                            <div className="w-14 h-14 bg-slate-50 rounded-[22px] flex items-center justify-center border border-slate-100 shadow-inner">
                                                <Target size={24} className="text-[#4177BC]" />
                                            </div>
                                            <div className="px-4 py-1.5 bg-blue-50/50 rounded-full border border-blue-100">
                                                <p className="text-[9px] inter-bold text-[#4177BC] uppercase tracking-widest">Real-time Intel</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <p className="text-[11px] inter-bold text-slate-400 uppercase tracking-[0.2em]">Settled Amount</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-3xl judson-regular text-slate-300">$</span>
                                                    <h3 className="text-7xl judson-bold tracking-tighter text-[#0F172A]">
                                                        {amountPaid.toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Progress Coverage */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-[10px] inter-bold uppercase tracking-widest">
                                                    <span className="text-slate-400">Project Coverage</span>
                                                    <span className="text-[#4177BC]">{coveragePercentage}%</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${coveragePercentage}%` }}
                                                        transition={{ duration: 1.5, ease: "circOut" }}
                                                        className="h-full bg-gradient-to-r from-[#4177BC] to-[#2D5A92] rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-50">
                                            <div className="space-y-2">
                                                <p className="text-[9px] inter-bold text-slate-400 uppercase tracking-widest">Gross Value</p>
                                                <p className="text-xl judson-bold text-slate-700">${projectTotalValue.toLocaleString()}</p>
                                            </div>
                                            <div className="space-y-2 text-right">
                                                <p className="text-[9px] inter-bold text-slate-400 uppercase tracking-widest">Unpaid</p>
                                                <p className="text-xl judson-bold text-amber-500">${(projectTotalValue - amountPaid).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modern Security Block */}
                                <div className="bg-[#F8FAFC] rounded-[48px] p-10 border border-slate-200/50 space-y-8">
                                    <div className="flex items-center gap-5">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-white rounded-[22px] flex items-center justify-center shadow-sm border border-slate-100">
                                                <ShieldCheck size={28} className="text-emerald-500" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-[#F8FAFC] rounded-full" />
                                        </div>
                                        <div>
                                            <p className="text-sm inter-bold text-[#0F172A] uppercase tracking-tight">Financial Vault</p>
                                            <p className="text-[11px] text-slate-400 inter-medium">Immutable Ledger Synced</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button className="group w-full py-5 bg-white hover:bg-[#0F172A] hover:text-white transition-all duration-500 rounded-[24px] text-[11px] inter-bold uppercase tracking-[0.2em] text-[#0F172A] shadow-sm border border-slate-100 flex items-center justify-center gap-3 cursor-pointer">
                                            <FileText size={16} className="group-hover:text-[#4177BC]" />
                                            Verify Transaction
                                        </button>
                                        <div className="flex gap-4">
                                            <button className="flex-1 py-4 bg-slate-200/40 hover:bg-slate-200 transition-colors rounded-[20px] text-[10px] inter-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                                                Support
                                            </button>
                                            <button className="flex-1 py-4 bg-slate-200/40 hover:bg-slate-200 transition-colors rounded-[20px] text-[10px] inter-bold uppercase tracking-widest text-slate-600 cursor-pointer">
                                                Audit
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// --- High Performance UI Components ---

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-[2px] border-slate-100 border-t-[#4177BC] rounded-full"
            />
            <h2 className="mt-8 text-[11px] inter-bold text-slate-400 uppercase tracking-[0.6em] animate-pulse">Establishing Nodes</h2>
        </div>
    );
}

function NotFoundState({ onBack }: { onBack: () => void }) {
    return (
        <div className="max-w-xl mx-auto py-40 text-center">
            <div className="w-28 h-28 bg-slate-50 rounded-[48px] flex items-center justify-center mx-auto mb-10 border border-slate-100">
                <FileText size={56} className="text-slate-200" />
            </div>
            <h2 className="text-4xl judson-bold text-[#0F172A] mb-5 leading-tight">Record De-synchronized</h2>
            <p className="text-slate-400 inter-medium text-base mb-12 leading-relaxed px-10">
                The requested invoice record is either archived or the link has expired. Please check your dashboard for active entries.
            </p>
            <button
                onClick={onBack}
                className="bg-[#0F172A] text-white px-12 py-5 rounded-[24px] text-[11px] inter-bold tracking-[0.2em] uppercase active:scale-95 transition-all shadow-2xl shadow-slate-200 cursor-pointer"
            >
                Return to Ledger
            </button>
        </div>
    );
}