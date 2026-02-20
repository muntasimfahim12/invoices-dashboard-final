/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Loader2, User, Plus,
    Trash2, AlertCircle, ShieldCheck,
    ReceiptText, Coins, Sparkles, Briefcase,
    ChevronRight, Wallet,
    Save
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfessionalLedgerEditor() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/invoices/${params.id}`);
                setInvoiceData(response.data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchInvoiceDetails();
    }, [params.id]);

    // রিয়েল-টাইম ক্যালকুলেশন লজিক
    const stats = useMemo(() => {
        if (!invoiceData) return { subtotal: 0, grandTotal: 0, totalPaidSoFar: 0, remaining: 0, currentBalance: 0 };
        
        // বর্তমান আইটেমগুলোর মোট যোগফল
        const total = invoiceData.items?.reduce((acc: number, item: any) =>
            acc + (Number(item.qty || 0) * Number(item.price || 0)), 0) || 0;
        
        // আগে কত পেমেন্ট করা হয়েছে (পুরানো ডাটা থেকে)
        const previousReceived = Number(invoiceData.receivedAmount || 0);
        
        // এই মুহূর্তে ডিউ কত (নতুন পেমেন্ট বাদে)
        const initialRemaining = total - previousReceived;
        
        // নতুন পেমেন্ট ইনপুট দেওয়ার পর বর্তমান ডিউ (যা স্ক্রিনে দেখাবে)
        const currentBalance = initialRemaining - newPaymentAmount;

        return { 
            subtotal: total, 
            grandTotal: total, 
            totalPaidSoFar: previousReceived,
            remaining: initialRemaining,
            currentBalance: currentBalance < 0 ? 0 : currentBalance // মাইনাস ভ্যালু রোধ করতে
        };
    }, [invoiceData, newPaymentAmount]);

    const updateField = (path: string, value: any) => {
        setInvoiceData((prev: any) => ({ ...prev, [path]: value }));
    };

    const addItem = () => {
        const newItem = { id: Date.now().toString(), name: "", qty: 1, price: 0 };
        setInvoiceData((prev: any) => ({ ...prev, items: [...(prev.items || []), newItem] }));
    };

    const removeItem = (id: any) => {
        setInvoiceData((prev: any) => ({
            ...prev,
            items: prev.items.filter((item: any) => (item.id || item._id) !== id)
        }));
    };

    const handleSave = async () => {
        try {
            setUpdating(true);
            
            // নতুন টোটাল রিসিভড অ্যামাউন্ট হিসাব
            const totalReceived = Number(invoiceData.receivedAmount || 0) + Number(newPaymentAmount);
            
            // স্ট্যাটাস নির্ধারণ
            let finalStatus = "Pending";
            if (totalReceived >= stats.grandTotal) {
                finalStatus = "Paid";
            } else if (totalReceived > 0) {
                finalStatus = "Partial";
            }

            const payload = {
                ...invoiceData,
                grandTotal: stats.grandTotal,
                receivedAmount: totalReceived,
                remainingDue: stats.currentBalance,
                status: finalStatus,
                updatedAt: new Date()
            };

            // ১. ইনভয়েস আপডেট করা
            await axios.patch(`${API_BASE}/invoices/${params.id}`, payload);
            
            // ২. যদি নতুন পেমেন্ট থাকে, তবে একটি ট্রানজেকশন রেকর্ড তৈরি করা (ঐচ্ছিক কিন্তু প্রফেশনাল)
            if (newPaymentAmount > 0) {
                await axios.post(`${API_BASE}/payments`, {
                    invoiceId: params.id,
                    clientId: invoiceData.client?._id,
                    amount: newPaymentAmount,
                    date: new Date(),
                    method: "Manual Update"
                });
            }

            router.push("/admin/invoices");
        } catch (error) {
            console.error(error);
            alert("Update failed. Please check your connection.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-[3px] border-slate-100 border-t-[#4177BC] rounded-full animate-spin"></div>
                <Sparkles className="absolute text-[#EB9C2C] animate-pulse" size={20} />
            </div>
            <p className="mt-6 text-slate-400 font-bold tracking-[0.3em] text-[9px] uppercase inter-medium">Synchronizing Ledger</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-slate-900 pb-20 selection:bg-[#4177BC]/10 inter-medium">
            {/* --- HEADER --- */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-350 mx-auto px-8 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/invoices" className="group">
                            <div className="p-3 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-200 shadow-sm group-active:scale-90">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform text-slate-600" />
                            </div>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-[#4177BC]/10 text-[#4177BC] text-[9px] font-black uppercase rounded-md tracking-widest inter-bold border border-[#4177BC]/10">
                                    Editor Mode
                                </span>
                                <ChevronRight size={12} className="text-slate-300" />
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest inter-semibold">
                                    Statement #{invoiceData?.invoiceId?.split('-').pop()}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight judson-bold leading-none">
                                Edit Ledger <span className="text-[#4177BC]">Statement</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-slate-500 hover:bg-slate-100 transition-all inter-bold">
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={updating}
                            className="flex items-center gap-2 bg-[#4177BC] hover:bg-[#34619a] text-white px-8 py-3 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-[#4177BC]/20 transition-all active:scale-95 inter-bold disabled:opacity-70"
                        >
                            {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
                {/* --- CLIENT INFO --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 relative overflow-hidden transition-all hover:shadow-md">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4177BC] to-transparent"></div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-slate-50 rounded-xl text-[#4177BC] border border-slate-100">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg tracking-tight judson-bold">Entity Details</h3>
                            <p className="text-[12px] text-slate-400 inter-medium">Primary client and project identification</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 inter-bold">Client Full Name</label>
                            <input
                                className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl py-3 px-5 focus:bg-white focus:border-[#4177BC] transition-all outline-none inter-semibold"
                                value={invoiceData.client?.name || ""}
                                onChange={(e) => updateField("client", { ...invoiceData.client, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 inter-bold">Project Reference</label>
                            <div className="relative">
                                <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input
                                    className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl py-3 pl-11 pr-5 focus:bg-white focus:border-[#4177BC] transition-all outline-none inter-semibold"
                                    value={invoiceData.projectTitle || ""}
                                    onChange={(e) => updateField("projectTitle", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ITEM BREAKDOWN --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-10 py-7 flex justify-between items-center bg-slate-50/30 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#EB9C2C]/10 rounded-xl text-[#EB9C2C] border border-[#EB9C2C]/20">
                                <ReceiptText size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-xl tracking-tight judson-bold">Itemized Breakdown</h3>
                                <p className="text-[12px] text-slate-400 inter-medium">Manage your services and pricing</p>
                            </div>
                        </div>
                        <button
                            onClick={addItem}
                            className="bg-white border-2 border-slate-100 text-slate-700 px-6 py-2.5 rounded-xl text-[11px] font-black hover:bg-[#4177BC] hover:text-white hover:border-[#4177BC] transition-all flex items-center gap-2 uppercase tracking-widest shadow-sm inter-bold"
                        >
                            <Plus size={16} /> Add New Entry
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="space-y-4">
                            <div className="grid grid-cols-12 gap-4 px-2 mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400 inter-bold">
                                <div className="col-span-6">Service Description</div>
                                <div className="col-span-1 text-center">Qty</div>
                                <div className="col-span-2 text-right">Unit Price</div>
                                <div className="col-span-2 text-right">Total Amount</div>
                                <div className="col-span-1"></div>
                            </div>

                            {invoiceData.items?.map((item: any, index: number) => (
                                <div key={item.id || item._id || index} className="grid grid-cols-12 gap-4 items-center group mb-4">
                                    <div className="col-span-6">
                                        <input
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:border-[#4177BC] outline-none transition-all"
                                            value={item.name}
                                            onChange={(e) => {
                                                const newItems = [...invoiceData.items];
                                                newItems[index].name = e.target.value;
                                                updateField("items", newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <input
                                            type="number"
                                            className="w-full bg-white border border-slate-200 rounded-xl py-3 text-sm font-black text-center text-slate-700 focus:border-[#4177BC] outline-none"
                                            value={item.qty}
                                            onChange={(e) => {
                                                const newItems = [...invoiceData.items];
                                                newItems[index].qty = Number(e.target.value);
                                                updateField("items", newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#4177BC]">{invoiceData.currency}</span>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3 text-sm font-black text-right text-slate-700 focus:border-[#4177BC] outline-none"
                                                value={item.price}
                                                onChange={(e) => {
                                                    const newItems = [...invoiceData.items];
                                                    newItems[index].price = Number(e.target.value);
                                                    updateField("items", newItems);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right px-4 text-sm font-black text-slate-900 bg-slate-50/50 py-3 rounded-xl">
                                        {invoiceData.currency} {(item.qty * item.price).toLocaleString()}
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <button onClick={() => removeItem(item.id || item._id)} className="p-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM: COMPACT CARDS --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Summary */}
                    <div className="bg-white rounded-4xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 relative overflow-hidden border border-slate-100 min-h-80 flex flex-col justify-between">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4177BC]/5 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-1.5 bg-[#4177BC] rounded-full"></div>
                                <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] inter-bold">Financial Summary</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Subtotal</span>
                                        <span className="text-slate-400 text-[10px]">Total Service Value</span>
                                    </div>
                                    <span className="font-bold text-lg text-slate-700">
                                        <span className="text-xs mr-1 opacity-50">{invoiceData.currency}</span>
                                        {stats.subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="px-2 pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-[#EB9C2C]/10 rounded-lg">
                                            <Wallet size={14} className="text-[#EB9C2C]" />
                                        </div>
                                        <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest">Total Statement Amount</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-[#4177BC] judson-bold ">{invoiceData.currency}:</span>
                                        <span className="text-5xl font-black text-slate-900 tracking-tighter judson-bold">
                                            {stats.grandTotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Module */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8 flex flex-col justify-between min-h-75">
                        <div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-[#4177BC]/5 rounded-xl text-[#4177BC] border border-[#4177BC]/10">
                                    <Coins size={20} />
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg tracking-tight judson-bold">Payment Entry</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                    <span className="text-[8px] font-black text-slate-400 uppercase block mb-0.5">Paid So Far</span>
                                    <span className="text-md font-black text-slate-800">{invoiceData.currency} {stats.totalPaidSoFar.toLocaleString()}</span>
                                </div>
                                <div className="bg-orange-50/50 p-3.5 rounded-xl border border-orange-100/50">
                                    <span className="text-[8px] font-black text-[#EB9C2C] uppercase block mb-0.5">Updated Balance Due</span>
                                    <span className="text-md font-black text-[#EB9C2C]">{invoiceData.currency} {stats.currentBalance.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2 left-4 px-1.5 bg-white text-[8px] font-black text-[#4177BC] uppercase z-10">Add Payment Amount</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-[#4177BC] focus:bg-white text-slate-900 font-black p-4 rounded-xl text-xl outline-none transition-all"
                                    placeholder="0.00"
                                    value={newPaymentAmount || ""}
                                    onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
                                />
                                <p className="text-[10px] text-slate-400 mt-2 ml-1">This will be added to the existing {invoiceData.currency} {stats.totalPaidSoFar}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SAVE ACTION --- */}
                <div className="flex justify-center sm:justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={updating}
                        className="w-full sm:w-auto bg-[#4177BC] hover:bg-[#34619a] shadow-lg shadow-[#4177BC]/20 text-white px-10 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 group inter-bold"
                    >
                        {updating ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />}
                        <span className="uppercase tracking-[0.15em]">Confirm & Record Changes</span>
                    </button>
                </div>
            </main>
        </div>
    );
}