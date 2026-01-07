/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { 
    Download, Printer, ArrowLeft, 
    CheckCircle2, Clock, Mail, Phone, MapPin 
} from "lucide-react";
import Link from "next/link";

export default function InvoiceDetails({ params }: any) {
    // Real app-e ekhane API theke ID diye data fetch hobe
    const invoice = {
        id: "INV-2024-001",
        status: "Paid",
        date: "Jan 05, 2026",
        dueDate: "Jan 20, 2026",
        client: {
            name: "Alex Thompson",
            company: "TechHive Ltd",
            email: "alex@techhive.com",
            address: "123 Business Ave, New York, NY"
        },
        items: [
            { desc: "E-commerce Website Design", qty: 1, price: 1200, total: 1200 },
            { desc: "API Integration", qty: 1, price: 800, total: 800 },
            { desc: "SEO Optimization", qty: 5, price: 100, total: 500 },
        ],
        subtotal: 2500,
        discount: 100,
        grandTotal: 2400
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
                <Link href="/admin/invoices" className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase hover:text-slate-900 transition-all">
                    <ArrowLeft size={16} /> Back to Ledger
                </Link>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
                        <Printer size={18} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#4177BC] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100">
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Main Invoice Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-100/50 overflow-hidden">
                {/* Header Section */}
                <div className="p-10 md:p-16 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-10">
                    <div>
                        <div className="h-12 w-12 bg-[#4177BC] rounded-2xl mb-6 flex items-center justify-center text-white font-black italic text-xl">L</div>
                        <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase">Invoice</h1>
                        <p className="text-[#4177BC] font-black text-sm mt-1">{invoice.id}</p>
                    </div>
                    
                    <div className="text-right space-y-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${invoice.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                            {invoice.status === 'Paid' ? <CheckCircle2 size={14}/> : <Clock size={14}/>} {invoice.status}
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block pt-4">Issued on</p>
                        <p className="text-slate-900 font-black text-sm">{invoice.date}</p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Billed To</p>
                        <h3 className="text-xl font-black text-slate-900">{invoice.client.name}</h3>
                        <p className="text-slate-500 font-bold text-sm mb-4">{invoice.client.company}</p>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2 text-slate-400 text-xs font-bold"><Mail size={14}/> {invoice.client.email}</p>
                            <p className="flex items-center gap-2 text-slate-400 text-xs font-bold"><MapPin size={14}/> {invoice.client.address}</p>
                        </div>
                    </div>
                    
                    <div className="md:text-right">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">Your Agency</p>
                        <h3 className="text-xl font-black text-slate-900 font-serif italic">Luminary Studio</h3>
                        <p className="text-slate-500 font-bold text-sm mb-4">billing@luminary.com</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter text-right leading-relaxed">
                            House 45, Road 12, Sylhet<br/>Bangladesh 3100
                        </p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-10 md:px-16">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-900">Description</th>
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-900 text-center">Qty</th>
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right">Unit Price</th>
                                <th className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-900 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoice.items.map((item, i) => (
                                <tr key={i} className="group">
                                    <td className="py-8 font-bold text-slate-800 text-sm">{item.desc}</td>
                                    <td className="py-8 text-slate-500 font-bold text-sm text-center">{item.qty}</td>
                                    <td className="py-8 text-slate-500 font-bold text-sm text-right">${item.price}</td>
                                    <td className="py-8 text-slate-900 font-black text-sm text-right">${item.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Summary Section */}
                <div className="p-10 md:p-16 bg-slate-900 mt-10 flex flex-col md:flex-row justify-between items-center rounded-b-[3rem]">
                    <div className="mb-6 md:mb-0">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Grand Total Due</p>
                        <h2 className="text-5xl font-[1000] text-white tracking-tighter mt-2">${invoice.grandTotal}</h2>
                    </div>
                    <div className="w-full md:w-auto space-y-3">
                        <div className="flex justify-between md:justify-end gap-10 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-white">${invoice.subtotal}</span>
                        </div>
                        <div className="flex justify-between md:justify-end gap-10 text-slate-400 font-bold text-xs uppercase tracking-widest">
                            <span>Discount</span>
                            <span className="text-rose-400">-${invoice.discount}</span>
                        </div>
                        <div className="h-px bg-slate-800 w-full my-4" />
                        <p className="text-slate-500 text-[9px] font-bold text-right italic uppercase">Thank you for your business!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}