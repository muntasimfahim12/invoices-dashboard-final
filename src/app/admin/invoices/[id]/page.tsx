/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Loader2, User, Plus, 
    Trash2, AlertCircle, Banknote, 
    Receipt, Percent, ShieldCheck, History
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProfessionalLedgerEditor() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Core Invoice State
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [newPaymentAmount, setNewPaymentAmount] = useState<number>(0);

    useEffect(() => {
        const fetchInvoiceDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/invoices/${params.id}`);
                setInvoiceData(response.data);
            } catch (error) {
                console.error("Fetch error:", error);
                alert("Could not load invoice data.");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoiceDetails();
    }, [params.id]);

    // calculations using useMemo for performance
    const stats = useMemo(() => {
        if (!invoiceData) return { subtotal: 0, tax: 0, grandTotal: 0, remaining: 0 };
        
        // Ensure values are numbers to avoid string concatenation issues
        const sub = invoiceData.items?.reduce((acc: number, item: any) => 
            acc + (Number(item.qty || 0) * Number(item.price || 0)), 0) || 0;
        
        const discount = Number(invoiceData.discount || 0);
        const taxRate = Number(invoiceData.taxRate || 0);
        
        const afterDiscount = sub - discount;
        const taxAmount = (afterDiscount * taxRate) / 100;
        const total = afterDiscount + taxAmount;
        
        // current received + potential new payment
        const alreadyReceived = Number(invoiceData.receivedAmount || 0);
        const remaining = total - alreadyReceived;
        
        return { subtotal: sub, tax: taxAmount, grandTotal: total, remaining };
    }, [invoiceData]);

    // Helpers
    const updateField = (path: string, value: any) => {
        setInvoiceData((prev: any) => ({ ...prev, [path]: value }));
    };

    const addItem = () => {
        const newItem = { 
            id: Date.now().toString(), // String ID is safer
            name: "", 
            qty: 1, 
            price: 0 
        };
        setInvoiceData((prev: any) => ({ ...prev, items: [...prev.items, newItem] }));
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
            
            // Calculate final received amount
            const totalReceived = Number(invoiceData.receivedAmount || 0) + Number(newPaymentAmount);
            
            // Clean payload for MongoDB/API
            const { _id, ...restOfData } = invoiceData;

            const payload = {
                ...restOfData,
                items: invoiceData.items.map((item: any) => ({
                    ...item,
                    qty: Number(item.qty),
                    price: Number(item.price)
                })),
                taxRate: Number(invoiceData.taxRate),
                discount: Number(invoiceData.discount),
                grandTotal: stats.grandTotal,
                receivedAmount: totalReceived,
                // Automatic status update logic
                status: totalReceived >= stats.grandTotal 
                    ? "Paid" 
                    : (totalReceived > 0 ? "Partial" : "Pending"),
                updatedAt: new Date()
            };

            await axios.put(`${API_BASE}/invoices/${params.id}`, payload);
            router.push("/admin/invoices");
        } catch (error) {
            console.error("Save error:", error);
            alert("Update failed. Please check your network.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-[#4177BC] mb-4" size={48} />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Ledger...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Top Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/invoices" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </Link>
                        <div>
                            <h2 className="text-sm font-black text-slate-400 uppercase tracking-tighter leading-none">Editor Mode</h2>
                            <p className="text-lg font-black text-slate-900 leading-none mt-1">{invoiceData?.invoiceId}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleSave}
                        disabled={updating}
                        className="bg-[#4177BC] text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-[#35629d] shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                    >
                        {updating ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                        Finalize & Save
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <User size={20} />
                            </div>
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Account Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Client Name</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 focus:bg-white transition-all"
                                    value={invoiceData.client?.name || ""}
                                    onChange={(e) => updateField("client", { ...invoiceData.client, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Project Title</label>
                                <input 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 outline-none focus:ring-2 ring-blue-500/10 focus:bg-white transition-all"
                                    value={invoiceData.projectTitle || ""}
                                    onChange={(e) => updateField("projectTitle", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Line Items */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <Receipt size={20} />
                                </div>
                                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Service Scope</h3>
                            </div>
                            <button onClick={addItem} className="flex items-center gap-2 text-[#4177BC] font-black text-[10px] uppercase bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-all">
                                <Plus size={14} /> Add Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {invoiceData.items?.map((item: any, index: number) => (
                                <div key={item.id || item._id} className="flex flex-wrap md:flex-nowrap gap-4 items-center p-2 rounded-2xl hover:bg-slate-50 transition-all group">
                                    <span className="text-xs font-black text-slate-300 w-6">0{index + 1}</span>
                                    <input 
                                        className="flex-[4] bg-transparent border-none font-bold text-slate-700 outline-none"
                                        placeholder="Service Description"
                                        value={item.name}
                                        onChange={(e) => {
                                            const newItems = [...invoiceData.items];
                                            newItems[index].name = e.target.value;
                                            updateField("items", newItems);
                                        }}
                                    />
                                    <div className="flex-[1] flex items-center bg-white border border-slate-100 rounded-xl px-3 py-2">
                                        <input type="number" className="w-full text-center font-black text-sm outline-none" 
                                            value={item.qty} 
                                            onChange={(e) => {
                                                const newItems = [...invoiceData.items];
                                                newItems[index].qty = e.target.value;
                                                updateField("items", newItems);
                                            }}
                                        />
                                    </div>
                                    <div className="flex-[2] flex items-center bg-white border border-slate-100 rounded-xl px-3 py-2">
                                        <span className="text-[10px] font-black text-slate-400 mr-2">{invoiceData.currency}</span>
                                        <input type="number" className="w-full font-black text-sm outline-none text-right" 
                                            value={item.price} 
                                            onChange={(e) => {
                                                const newItems = [...invoiceData.items];
                                                newItems[index].price = e.target.value;
                                                updateField("items", newItems);
                                            }}
                                        />
                                    </div>
                                    <button onClick={() => removeItem(item.id || item._id)} className="p-2 text-rose-300 hover:text-rose-600 transition-colors md:opacity-0 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Financials */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-slate-400 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Banknote size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Net Receivable</p>
                            <h2 className={`text-5xl font-[1000] tracking-tighter ${stats.remaining > 0 ? 'text-white' : 'text-emerald-400'}`}>
                                {invoiceData.currency} {(stats.remaining - newPaymentAmount).toLocaleString()}
                            </h2>
                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Total Valuation</span>
                                    <span className="font-black">{invoiceData.currency} {stats.grandTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-widest">Received So Far</span>
                                    <span className="font-black text-emerald-400">+{invoiceData.currency} {invoiceData.receivedAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <History size={16} />
                            </div>
                            <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px]">Record Installment</h3>
                        </div>
                        <div className="relative mb-4">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">{invoiceData.currency}</span>
                            <input 
                                type="number"
                                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500/20 py-4 pl-14 pr-6 rounded-2xl text-xl font-black outline-none transition-all"
                                placeholder="0.00"
                                value={newPaymentAmount || ""}
                                onChange={(e) => setNewPaymentAmount(Number(e.target.value))}
                            />
                        </div>
                        <p className="text-[9px] text-slate-400 font-medium text-center uppercase tracking-tighter">
                            This adds to existing payments on save.
                        </p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Percent size={14} className="text-slate-400" />
                                    <span className="text-[10px] font-black uppercase text-slate-500">Tax Rate (%)</span>
                                </div>
                                <input 
                                    type="number" className="w-16 text-right font-black text-slate-900 outline-none"
                                    value={invoiceData.taxRate || 0}
                                    onChange={(e) => updateField("taxRate", e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={14} className="text-slate-400" />
                                    <span className="text-[10px] font-black uppercase text-slate-500">Discount ({invoiceData.currency})</span>
                                </div>
                                <input 
                                    type="number" className="w-20 text-right font-black text-slate-900 outline-none"
                                    value={invoiceData.discount || 0}
                                    onChange={(e) => updateField("discount", e.target.value)}
                                />
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}