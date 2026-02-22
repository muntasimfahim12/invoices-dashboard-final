/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, use } from "react";
import { Printer, ArrowLeft, Globe, Mail, ShieldCheck, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Image from "next/image"; 

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function InvoiceDetails({ params }: PageProps) {
    const resolvedParams = use(params);
    const invoiceIdFromUrl = resolvedParams.id;

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const COMPANY_INFO = {
        name: "Geniehack Ltd.",
        address: "Sylhet, Bangladesh | Budapest, Hungary",
        phone: "+880-123456789",
        email: "geniehack.team@gmail.com",
        website: "www.geniehack.com",
    };

    useEffect(() => {
        const getInvoice = async () => {
            try {
                const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
                const res = await axios.get(`${API_BASE}/invoices/${invoiceIdFromUrl}`);
                setInvoice(res.data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (invoiceIdFromUrl) getInvoice();
    }, [invoiceIdFromUrl]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#4177BC]"></div>
        </div>
    );

    if (!invoice) return <div className="p-20 text-center font-bold">Invoice not found.</div>;

    return (
        <div className="min-h-screen  py-10 px-4 print:bg-white print:p-0">
            <div className="max-w-[850px] mx-auto">
                
                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-8 no-print">
                    <Link href="/admin/invoices" className="flex items-center gap-2 text-slate-600 font-bold hover:text-[#4177BC] transition-all">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <button 
                        onClick={() => window.print()} 
                        className="bg-[#4177BC] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-[#35629a] transition-transform active:scale-95"
                    >
                        <Printer size={20} /> PRINT / DOWNLOAD PDF
                    </button>
                </div>

                {/* INVOICE MAIN CONTAINER */}
                <div className="bg-white shadow-2xl print:shadow-none border border-slate-100 print:border-none min-h-[1120px] flex flex-col">
                    
                    {/* Header: Logo & Company Branding */}
                    <div className="p-12 border-b-2 border-slate-100 flex flex-col items-center text-center">
                        {/* 100% Sposto Logo Section */}
                        <div className="relative w-48 h-16 mb-6">
                            <Image 
                                src="/genie.png" 
                                alt="Geniehack Logo" 
                                fill 
                                priority
                                className="object-contain" // যাতে লোগো ফেটে না যায় বা চ্যাপ্টা না হয়
                                sizes="200px"
                            />
                        </div>
                        
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                            {COMPANY_INFO.name}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-slate-500 font-semibold italic">
                            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#4177BC]"/> {COMPANY_INFO.address}</span>
                            <span className="flex items-center gap-1.5"><Phone size={14} className="text-[#4177BC]"/> {COMPANY_INFO.phone}</span>
                            <span className="flex items-center gap-1.5"><Mail size={14} className="text-[#4177BC]"/> {COMPANY_INFO.email}</span>
                            <span className="flex items-center gap-1.5"><Globe size={14} className="text-[#4177BC]"/> {COMPANY_INFO.website}</span>
                        </div>
                    </div>

                    {/* Blue Divider Line */}
                    <div className="h-1.5 bg-[#4177BC] mx-12 rounded-full" />

                    {/* Invoice ID & Metadata */}
                    <div className="p-12 pb-6 flex justify-between items-end">
                        <div className="space-y-1">
                            <h2 className="text-5xl font-black text-[#4177BC] tracking-tighter">INVOICE</h2>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">Official Document</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black text-slate-400 uppercase">Invoice Number</p>
                            <p className="text-2xl font-black text-slate-900">#{invoice.invoiceId}</p>
                        </div>
                    </div>

                    {/* Billed To & Dates */}
                    <div className="px-12 grid grid-cols-2 gap-10 mb-10">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-[#4177BC] uppercase tracking-widest mb-3">BILLED TO:</p>
                            <h3 className="text-xl font-black text-slate-900 mb-1">{invoice.clientName}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                {invoice.clientAddress || "Client Address Not Provided"}
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-end space-y-4">
                            <div className="text-right border-r-4 border-[#4177BC] pr-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Issue</p>
                                <p className="text-lg font-black text-slate-800">
                                    {new Date(invoice.createdAt).toLocaleDateString('en-GB')}
                                </p>
                            </div>
                            <div className="text-right border-r-4 border-rose-500 pr-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</p>
                                <p className="text-lg font-black text-rose-500">
                                    {invoice.dueDate || "Upon Receipt"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="px-12 flex-grow">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#4177BC] text-white">
                                    <th className="py-4 px-6 text-left text-[11px] font-black uppercase tracking-widest rounded-tl-xl">Service Description</th>
                                    <th className="py-4 px-6 text-center text-[11px] font-black uppercase tracking-widest">Qty</th>
                                    <th className="py-4 px-6 text-right text-[11px] font-black uppercase tracking-widest">Unit Price</th>
                                    <th className="py-4 px-6 text-right text-[11px] font-black uppercase tracking-widest rounded-tr-xl">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-slate-50">
                                {invoice.items?.map((item: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-6 px-6">
                                            <p className="font-black text-slate-800 text-sm uppercase">{item.name}</p>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">{item.desc || "Professional Digital Service"}</p>
                                        </td>
                                        <td className="py-6 px-6 text-center text-sm font-bold text-slate-600">
                                            <span className="bg-slate-100 px-3 py-1 rounded-md">{item.qty}</span>
                                        </td>
                                        <td className="py-6 px-6 text-right text-sm font-bold text-slate-600">
                                            {invoice.currency} {item.price.toLocaleString()}
                                        </td>
                                        <td className="py-6 px-6 text-right font-black text-slate-900 text-base">
                                            {invoice.currency} {(item.qty * item.price).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="p-12 bg-slate-50 border-t-2 border-slate-100 mt-10">
                        <div className="flex justify-between items-end">
                            <div className="max-w-[350px]">
                                <div className="flex items-center gap-2 mb-3">
                                    <ShieldCheck className="text-[#4177BC]" size={20} />
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Payment Information</p>
                                </div>
                                <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase italic">
                                    Please include Invoice ID <strong>#{invoice.invoiceId}</strong> in your payment reference. 
                                    This is a system-generated document and requires no physical signature.
                                </p>
                            </div>
                            
                            <div className="w-72 space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-slate-900">{invoice.currency} {invoice.subtotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-black uppercase text-slate-400">
                                    <span>Discount / Tax</span>
                                    <span className="text-slate-900">0.00</span>
                                </div>
                                <div className="pt-4 border-t-4 border-slate-900 flex justify-between items-center">
                                    <span className="text-sm font-black uppercase text-slate-900">Total Due</span>
                                    <span className="text-4xl font-black text-[#4177BC] tracking-tighter italic">
                                        {invoice.currency} {invoice.grandTotal?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Branding */}
                    <div className="p-10 bg-slate-900 text-white mt-auto rounded-b-lg">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-[12px] font-black uppercase tracking-[0.2em] italic">
                                Thank you for choosing {COMPANY_INFO.name}
                            </p>
                            <div className="h-px w-20 bg-slate-700 hidden md:block"></div>
                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">
                                Technology • Innovation • Excellence
                            </p>
                        </div>
                    </div>
                </div>

                {/* Critical CSS for Clean PDF Export */}
                <style jsx global>{`
                    @media print {
                        @page { size: A4; margin: 0; }
                        .no-print { display: none !important; }
                        body { background: white !important; padding: 0 !important; margin: 0 !important; }
                        .max-w-[850px] { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
                        .shadow-2xl { box-shadow: none !important; }
                        * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                    }
                `}</style>
            </div>
        </div>
    );
}