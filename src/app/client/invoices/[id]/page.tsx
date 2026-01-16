/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, use } from "react"; // 'use' import koro
import { Download, Printer, ArrowLeft, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import axios from "axios";

// 1. Params-er interface define koro
interface PageProps {
    params: Promise<{ id: string }>;
}

export default function InvoiceDetails({ params }: PageProps) {
    // 2. Params-ke unwrap koro 'use' hook diye
    const resolvedParams = use(params);
    const invoiceId = resolvedParams.id;

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getInvoice = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                // 3. Dynamic ID use koro request-e
                const res = await axios.get(`${API_BASE}/invoices/${invoiceId}`);
                setInvoice(res.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        
        if (invoiceId) {
            getInvoice();
        }
    }, [invoiceId]); // 4. Dependency list-e unwrap kora ID daw

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#4177BC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Syncing Ledger...</p>
            </div>
        </div>
    );

    if (!invoice) return <div className="p-20 text-center font-bold">Invoice not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                
                {/* ACTIONS BAR */}
                <div className="flex justify-between items-center mb-8">
                    <Link href="/client" className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-all">
                        <ArrowLeft size={18} /> Dashboard
                    </Link>
                    <div className="flex gap-4">
                        <button onClick={() => window.print()} className="bg-white p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all">
                            <Printer size={20} className="text-slate-600" />
                        </button>
                        <button className="bg-[#4177BC] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg">
                            <Download size={18} /> PDF Export
                        </button>
                    </div>
                </div>

                {/* INVOICE DOCUMENT */}
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                    
                    {/* Brand Header */}
                    <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-gradient-to-r from-white to-slate-50/50">
                        <div>
                            <div className="w-14 h-14 bg-slate-900 rounded-2xl mb-6 flex items-center justify-center text-white font-black text-xl italic shadow-xl">YB</div>
                            <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter text-slate-900">YourBrand Inc.</h2>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Official Digital Receipt</p>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border ${invoice.remainingDue === 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                {invoice.remainingDue === 0 ? <CheckCircle size={14}/> : <Clock size={14}/>}
                                {invoice.remainingDue === 0 ? 'Settled' : 'Payment Due'}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Ref</p>
                            <h3 className="text-lg font-black font-mono text-slate-800">#{invoice.invoiceId}</h3>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Recipient Information</p>
                                <h4 className="text-xl font-black text-slate-800 tracking-tight">{invoice.clientName}</h4>
                                <p className="text-slate-500 text-sm font-bold leading-relaxed">{invoice.clientAddress || "Authorized Business Partner"}</p>
                            </div>
                        </div>
                        <div className="md:text-right space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Issued Date</p>
                                <h4 className="text-sm font-black text-slate-800 tracking-tight">
                                    {new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </h4>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="px-10 pb-10">
                        <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Description of Services</th>
                                        <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {invoice.items?.map((item: any, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="p-6">
                                                <p className="font-black text-slate-800 uppercase text-xs italic tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">Project Milestone Fulfillment</p>
                                            </td>
                                            <td className="p-6 text-right font-[1000] text-slate-900">${item.price.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end pt-10">
                            <div className="w-full max-w-xs space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-400">
                                    <span>Base Amount</span>
                                    <span className="text-slate-600">${invoice.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-t border-slate-100">
                                    <span className="text-xs font-black uppercase text-slate-900 tracking-widest">Grand Total</span>
                                    <span className="text-4xl font-[1000] text-[#4177BC] tracking-tighter italic">${invoice.grandTotal?.toLocaleString()}</span>
                                </div>
                                
                                <div className="space-y-2 pt-2">
                                    <div className="bg-emerald-50/50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest text-left">Verified <br/> Payments</span>
                                        <span className="font-black text-emerald-600">+${invoice.receivedAmount?.toLocaleString()}</span>
                                    </div>
                                    {invoice.remainingDue > 0 && (
                                        <div className="bg-rose-50/50 p-4 rounded-2xl flex justify-between items-center border border-rose-100/50 animate-pulse">
                                            <span className="text-[9px] font-black uppercase text-rose-600 tracking-widest">Balance <br/> Outstanding</span>
                                            <span className="font-black text-rose-600">${invoice.remainingDue?.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Digital Footer */}
                    <div className="p-10 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 italic">Legal Compliance</p>
                            <p className="text-[9px] font-bold text-slate-400 max-w-xs leading-relaxed">
                                This document is digitally verified. Unauthorized duplication is strictly prohibited. All payments are subject to the terms of service.
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="text-[20px] font-black italic tracking-tighter">YourBrand.</p>
                            <p className="text-[9px] font-black uppercase text-blue-500 tracking-[0.2em]">Validated Transaction</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}