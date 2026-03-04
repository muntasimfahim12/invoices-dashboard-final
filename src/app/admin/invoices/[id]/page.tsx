/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ChevronLeft, Download, CreditCard, User, Briefcase, 
    CheckCircle2, AlertCircle, Printer, Mail, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function InvoiceDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // ১. ডেটা ফেচিং (fetchData logic)
    const fetchInvoiceDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/invoices/${id}`);
            setInvoice(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to retrieve invoice specifications");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchInvoiceDetails(); }, [fetchInvoiceDetails]);

    // ২. ক্যালকুলেটেড ভ্যালু (Safe Calculations)
    const grandTotal = useMemo(() => invoice?.grandTotal || 0, [invoice]);
    const totalPaid = useMemo(() => invoice?.receivedAmount || 0, [invoice]);
    const balanceDue = useMemo(() => grandTotal - totalPaid, [grandTotal, totalPaid]);

    // ৩. পেমেন্ট আপডেট হ্যান্ডলার
    const handleUpdatePaymentStatus = async (milestone: any) => {
        try {
            setUpdatingId(milestone.id);
            const loadingToast = toast.loading("Syncing ledger & notifying client...");

            const payload = {
                projectId: invoice?.projectId,
                milestoneId: milestone.id,
                amount: milestone.amount,
                method: "Manual Admin Verification",
                clientDetails: {
                    id: invoice?.clientId,
                    name: invoice?.clientName,
                    email: invoice?.clientEmail
                },
                milestonesSnapshot: invoice?.milestones || []
            };

            const response = await axios.post(`${API_BASE}/handleUpdatePayment`, payload);

            if (response.status === 200) {
                toast.success("Payment verified & Invoice sent", { id: loadingToast });
                fetchInvoiceDetails();
            }
        } catch (error) {
            toast.error("Internal sync failed");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin"></div>
                <p className="judson-regular-italic text-slate-400">Archiving ledger details...</p>
            </div>
        </div>
    );

    if (!invoice) return <div className="p-20 text-center">No record found for ID: {id}</div>;

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#1A1C1E] pb-20 selection:bg-[#4177BC]/20 inter-medium">
            
            {/* Header: Executive Actions */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-black transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="inter-bold text-[11px] uppercase tracking-[0.2em]">Exit to Ledger</span>
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Printer size={20} /></button>
                        <button className="flex items-center gap-2 bg-[#1A1C1E] text-white px-6 py-2.5 rounded-xl inter-bold text-[11px] uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-[#4177BC] transition-all active:scale-95">
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto px-6 mt-12">
                {/* Banner Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="judson-bold text-5xl tracking-tight">#{invoice?.invoiceId || 'N/A'}</h1>
                            <div className={`px-4 py-1 rounded-full text-[10px] inter-bold uppercase tracking-widest border ${invoice?.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {invoice?.status}
                            </div>
                        </div>
                        <p className="text-slate-400 inter-medium flex items-center gap-2 text-lg">
                            <Briefcase size={18} className="text-[#4177BC]" /> {invoice?.projectTitle}
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-6 rounded-[2rem] flex items-center gap-8 shadow-sm">
                        <div className="text-right">
                            <p className="text-[10px] inter-bold text-slate-400 uppercase tracking-widest mb-1">Balance Due</p>
                            <p className="judson-bold text-3xl text-rose-600">${balanceDue.toLocaleString()}</p>
                        </div>
                        <div className="h-12 w-[1px] bg-slate-100"></div>
                        <div className="text-right">
                            <p className="text-[10px] inter-bold text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                            <p className="judson-bold text-3xl text-[#1A1C1E]">${grandTotal.toLocaleString()}</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-10">
                        
                        {/* Milestone Table */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
                            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h3 className="judson-bold text-2xl">Milestone Analysis</h3>
                                    <p className="text-xs text-slate-400 inter-medium">Detailed breakdown of project phases</p>
                                </div>
                                <Clock className="text-slate-200" size={32} />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] inter-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                                            <th className="px-10 py-5">Phase</th>
                                            <th className="px-6 py-5">Due Date</th>
                                            <th className="px-6 py-5 text-right">Amount</th>
                                            <th className="px-10 py-5 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {invoice?.milestones?.map((m: any, idx: number) => (
                                            <tr key={idx} className="group hover:bg-slate-50/30 transition-all">
                                                <td className="px-10 py-6">
                                                    <p className="inter-bold text-sm text-slate-800">{m.name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase mt-1">Ref: MST-0{idx+1}</p>
                                                </td>
                                                <td className="px-6 py-6 text-sm text-slate-500 inter-medium">{m.dueDate || 'No Date'}</td>
                                                <td className="px-6 py-6 text-right judson-bold text-lg text-[#1A1C1E]">
                                                    ${(m?.amount || 0).toLocaleString()}
                                                </td>
                                                <td className="px-10 py-6 text-center">
                                                    {m.status === 'Paid' ? (
                                                        <span className="inline-flex items-center gap-1.5 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[10px] inter-bold uppercase">
                                                            <CheckCircle2 size={12} /> Settled
                                                        </span>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleUpdatePaymentStatus(m)}
                                                            disabled={updatingId === m.id}
                                                            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] inter-bold uppercase hover:bg-[#4177BC] transition-all disabled:opacity-50 shadow-lg shadow-black/5"
                                                        >
                                                            {updatingId === m.id ? "Syncing..." : "Mark Paid"}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Audit Log */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10 shadow-sm">
                            <h3 className="judson-bold text-2xl mb-8">System Audit Log</h3>
                            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                                <ActivityItem icon={<Mail size={14}/>} title="Automated Dispatch" time="SYSTEM" desc={`Latest invoice version sent to ${invoice?.clientEmail}`} />
                                <ActivityItem icon={<CheckCircle2 size={14}/>} title="Ledger Entry Created" time={invoice?.createdAt} desc="Invoice generated via Admin Control Panel" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Client Identity */}
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm text-center relative overflow-hidden">
                            <div className="w-20 h-20 rounded-[2rem] bg-[#1A1C1E] text-white flex items-center justify-center judson-bold text-3xl mx-auto mb-6 shadow-2xl shadow-black/20">
                                {invoice?.clientName?.charAt(0)}
                            </div>
                            <h4 className="inter-bold text-xl text-[#1A1C1E]">{invoice?.clientName}</h4>
                            <p className="text-sm text-slate-400 mb-8">{invoice?.clientEmail}</p>
                            
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50 text-left">
                                <div>
                                    <p className="text-[9px] inter-bold text-slate-300 uppercase tracking-widest mb-1">Entity ID</p>
                                    <p className="text-xs inter-bold text-slate-600">#{invoice?.clientId?.slice(-6).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] inter-bold text-slate-300 uppercase tracking-widest mb-1">Gateway</p>
                                    <p className="text-xs inter-bold text-[#4177BC] uppercase">{invoice?.paymentMethod || "Direct"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <div className="bg-[#1A1C1E] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                                <CreditCard size={200} />
                            </div>
                            
                            <div className="relative z-10">
                                <h4 className="text-[10px] inter-bold text-slate-500 uppercase tracking-[0.3em] mb-10 text-center">Executive Summary</h4>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm inter-medium">Base Amount</span>
                                        <span className="judson-bold text-xl">${grandTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm inter-medium">Total Credits</span>
                                        <span className="judson-bold text-xl text-emerald-400">${totalPaid.toLocaleString()}</span>
                                    </div>
                                    <div className="h-[1px] bg-white/10 my-4"></div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="inter-bold text-[10px] uppercase tracking-widest text-slate-500">Balance Due</span>
                                        <span className="judson-bold text-4xl text-white">${balanceDue.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl inter-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                                    <AlertCircle size={16} /> Issue Remainder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ActivityItem({ icon, title, time, desc }: any) {
    return (
        <div className="flex gap-6 relative z-10">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[#4177BC] shadow-sm">
                {icon}
            </div>
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <p className="inter-bold text-sm text-slate-800 tracking-tight">{title}</p>
                    <span className="text-[9px] inter-bold text-slate-300 uppercase">{time}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}