/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { use } from "react";
import { 
    ChevronLeft, Download, Printer, Share2, 
    CheckCircle2, Clock, Mail, Phone, 
    Globe, ShieldCheck, CreditCard 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function InvoiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();

    // Mock Data - Real database theke ashbe
    const invoice = {
        id: resolvedParams.id,
        status: "Paid",
        date: "Jan 07, 2026",
        dueDate: "Jan 14, 2026",
        client: {
            name: "Tanvir Alam",
            company: "TechHive Ltd",
            email: "tanvir@techhive.com",
            phone: "+880 1712 345678",
            address: "Sylhet, BD"
        },
        items: [
            { desc: "E-commerce Website Redesign", qty: 1, price: 1200 },
            { desc: "API Integration Services", qty: 1, price: 600 },
            { desc: "Monthly Maintenance", qty: 2, price: 300 },
        ],
        subtotal: 2400,
        tax: 120,
        total: 2520
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-700 bg-[#FFFFFF]">
            
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 no-print">
                <div className="space-y-2">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-slate-400 hover:text-[#4177BC] font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                        <ChevronLeft size={16} /> Back to Invoices
                    </button>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">
                        Invoice <span className="text-[#4177BC]">{invoice.id}</span>
                    </h1>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => window.print()} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 hover:text-[#4177BC] transition-all">
                        <Printer size={18} />
                    </button>
                    <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 hover:text-[#4177BC] transition-all">
                        <Download size={18} />
                    </button>
                    <button className="flex-1 md:flex-none px-8 py-4 bg-[#4177BC] text-white rounded-2xl font-[1000] text-[10px] uppercase tracking-widest shadow-xl shadow-[#4177BC]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Mail size={16} /> Send to Client
                    </button>
                </div>
            </div>

            {/* Actual Invoice Card */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden print:border-0 print:shadow-none">
                
                {/* Invoice Top Header */}
                <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row justify-between gap-10">
                    <div className="space-y-6">
                        <div className="h-12 w-12 bg-[#4177BC] rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Sender Information</p>
                            <h2 className="text-2xl font-[1000] tracking-tight uppercase">Admin Dashboard</h2>
                            <p className="text-white/60 text-xs font-bold mt-1 tracking-wide">admin@yourbrand.com</p>
                        </div>
                    </div>
                    <div className="text-left md:text-right space-y-4">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${invoice.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-[#EB9C2C]/20 text-[#EB9C2C]'}`}>
                            {invoice.status} Status
                        </span>
                        <div className="pt-4">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Amount Due</p>
                            <p className="text-4xl font-[1000] tracking-tighter text-[#EB9C2C]">${invoice.total}</p>
                        </div>
                    </div>
                </div>

                {/* Client & Date Info */}
                <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-slate-50">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill To</p>
                        <div>
                            <h3 className="text-xl font-[1000] text-slate-900 uppercase">{invoice.client.name}</h3>
                            <p className="text-[#4177BC] font-black text-xs uppercase tracking-widest mb-3">{invoice.client.company}</p>
                            <div className="space-y-1 text-slate-500 text-sm font-bold">
                                <p className="flex items-center gap-2"><Mail size={14} className="opacity-40"/> {invoice.client.email}</p>
                                <p className="flex items-center gap-2"><Phone size={14} className="opacity-40"/> {invoice.client.phone}</p>
                                <p className="flex items-center gap-2"><Globe size={14} className="opacity-40"/> {invoice.client.address}</p>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 md:justify-end md:text-right h-fit">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                            <p className="text-sm font-black text-slate-900">{invoice.date}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                            <p className="text-sm font-black text-slate-900">{invoice.dueDate}</p>
                        </div>
                    </div>
                </div>

                {/* Table Items */}
                <div className="p-12">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="pb-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</th>
                                <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {invoice.items.map((item, idx) => (
                                <tr key={idx} className="group transition-all">
                                    <td className="py-6 text-sm font-bold text-slate-700">{item.desc}</td>
                                    <td className="py-6 text-center text-sm font-bold text-slate-500">{item.qty}</td>
                                    <td className="py-6 text-right text-sm font-bold text-slate-500">${item.price}</td>
                                    <td className="py-6 text-right text-sm font-[1000] text-slate-900">${item.qty * item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Final Calculations */}
                <div className="p-12 bg-slate-50/50 flex justify-end">
                    <div className="w-full max-w-xs space-y-4">
                        <div className="flex justify-between text-sm font-bold text-slate-500">
                            <span>Subtotal</span>
                            <span>${invoice.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-slate-500">
                            <span>Tax (5%)</span>
                            <span>${invoice.tax}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Grand Total</span>
                            <span className="text-2xl font-[1000] text-[#4177BC]">${invoice.total}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="px-12 py-8 bg-white border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Thank you for your business</p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <CreditCard size={16} />
                        <span className="text-[10px] font-black uppercase tracking-tighter italic text-slate-300 text-right">Payment methods: Bank Transfer, Stripe, PayPal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}