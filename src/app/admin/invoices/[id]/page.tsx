
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Plus, Trash2, ArrowLeft, Building2, 
    Download, Send, Briefcase, Mail, 
    CalendarClock, Banknote, UserPlus, Hash, Save, RefreshCw, Loader2
} from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import axios from "axios";
import { useRouter } from "next/navigation";

// Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --- PDF STYLES ---
const pdfStyles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, borderBottom: 2, borderBottomColor: '#4177BC', paddingBottom: 10 },
    brandSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
    metaInfo: { textAlign: 'right' },
    section: { marginBottom: 20 },
    row: { flexDirection: 'row', gap: 20 },
    col: { flex: 1 },
    label: { fontSize: 8, color: '#64748B', textTransform: 'uppercase', marginBottom: 4, fontWeight: 'bold' },
    value: { fontSize: 11, color: '#0F172A', fontWeight: 'bold' },
    table: { marginTop: 20 },
    tableHeader: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    tableRow: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    colDesc: { width: '60%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '25%', textAlign: 'right' },
    summaryContainer: { marginTop: 30, flexDirection: 'row', justifyContent: 'flex-end' },
    summaryBox: { width: '45%', gap: 5 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
    grandTotal: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', color: '#4177BC', fontWeight: 'bold', fontSize: 14 },
    footer: { marginTop: 50, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20 },
    bankBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 5 }
});

export default function UltimateDigitalLedger() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // --- STATE MANAGEMENT ---
    const [projectTitle, setProjectTitle] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [freelancerName, setFreelancerName] = useState("John Doe");
    const [freelancerAddress, setFreelancerAddress] = useState("Road 10, Dhaka, Bangladesh");
    const [items, setItems] = useState([{ id: 1, name: "", desc: "", qty: 1, price: 0 }]);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [taxRate, setTaxRate] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [bankDetails, setBankDetails] = useState("Bank: ABC Bank | A/C: 123-456-789 | Swift: ABCDBD");
    const [invoiceId, setInvoiceId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");

    // --- INITIALIZATION & FETCH DATA ---
    useEffect(() => {
        setMounted(true);
        setInvoiceId("INV-" + Math.floor(100000 + Math.random() * 900000));
        setInvoiceDate(new Date().toLocaleDateString('en-GB'));
        
        // Load default freelancer info from localStorage if exists
        const savedData = localStorage.getItem('ledger_settings');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFreelancerName(parsed.freelancerName || "John Doe");
            setFreelancerAddress(parsed.freelancerAddress || "");
            setBankDetails(parsed.bankDetails || "");
        }
    }, []);

    // --- CALCULATION ENGINE ---
    const { subtotal, taxAmount, grandTotal, remainingDue, status } = useMemo(() => {
        const sub = items.reduce((acc, item) => acc + (Number(item.qty) * Number(item.price)), 0);
        const afterDiscount = sub - discount;
        const tax = (afterDiscount * taxRate) / 100;
        const total = afterDiscount + tax;
        const due = total - receivedAmount;

        let paymentStatus = "UNPAID";
        if (receivedAmount > 0 && due > 0) paymentStatus = "PARTIAL";
        if (receivedAmount > 0 && due <= 0 && total > 0) paymentStatus = "PAID";

        return { subtotal: sub, taxAmount: tax, grandTotal: total, remainingDue: due, status: paymentStatus };
    }, [items, receivedAmount, taxRate, discount]);

    // --- HANDLERS ---
    const addItem = () => setItems([...items, { id: Date.now(), name: "", desc: "", qty: 1, price: 0 }]);
    const removeItem = (id: number) => items.length > 1 && setItems(items.filter(i => i.id !== id));
    const updateItem = (id: number, field: string, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    // --- SAVE TO DATABASE (AXIOS) ---
    const handleSaveInvoice = async () => {
        setLoading(true);
        const invoiceData = {
            invoiceId,
            projectTitle,
            clientName,
            clientEmail,
            clientAddress,
            freelancerName,
            freelancerAddress,
            items,
            subtotal,
            taxRate,
            taxAmount,
            discount,
            grandTotal,
            receivedAmount,
            remainingDue,
            status,
            dueDate,
            currency,
            bankDetails,
            createdAt: new Date()
        };

        try {
            // API Call to your server
            const response = await axios.post(`${API_URL}/invoices`, invoiceData);
            
            // Local storage update for freelancer defaults
            localStorage.setItem('ledger_settings', JSON.stringify({ freelancerName, freelancerAddress, bankDetails }));
            
            alert("Invoice Saved Successfully to Database!");
            router.push("/admin/invoices"); // Main page e niye jabe
        } catch (error) {
            console.error("Error saving invoice:", error);
            alert("Failed to save invoice. Make sure server is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = () => {
        const subject = encodeURIComponent(`Invoice ${invoiceId} for ${projectTitle || 'Project'}`);
        const body = encodeURIComponent(`Hi ${clientName || 'Client'},\n\nPlease find the invoice details below:\n\nProject: ${projectTitle}\nTotal: ${currency} ${grandTotal.toLocaleString()}\nBalance: ${currency} ${remainingDue.toLocaleString()}\n\nRegards,\n${freelancerName}`);
        window.location.href = `mailto:${clientEmail}?subject=${subject}&body=${body}`;
    };

    if (!mounted) return null;

    // --- PDF COMPONENT ---
    const InvoicePDF = () => (
        <Document>
            <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                    <View style={pdfStyles.brandSection}>
                        <Text style={pdfStyles.title}>{freelancerName}</Text>
                    </View>
                    <View style={pdfStyles.metaInfo}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>INVOICE</Text>
                        <Text style={{ color: '#4177BC' }}>{invoiceId}</Text>
                    </View>
                </View>
                {/* PDF Content continues (same as your original) */}
                <View style={pdfStyles.row}>
                    <View style={pdfStyles.col}>
                        <Text style={pdfStyles.label}>Billed To:</Text>
                        <Text style={pdfStyles.value}>{clientName || "Client Name"}</Text>
                        <Text style={{ fontSize: 9 }}>{clientEmail}</Text>
                    </View>
                    <View style={pdfStyles.col}>
                        <Text style={pdfStyles.label}>Invoice Date:</Text>
                        <Text style={pdfStyles.value}>{invoiceDate}</Text>
                        <Text style={[pdfStyles.label, { marginTop: 10 }]}>Due Date:</Text>
                        <Text style={pdfStyles.value}>{dueDate || "Upon Receipt"}</Text>
                    </View>
                </View>
                {/* Table and totals logic goes here for PDF */}
            </Page>
        </Document>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#4177BC]/10">
            <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200 px-6 py-4 print:hidden bg-white/80">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Link href="/admin/invoices" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-[#4177BC] transition-all">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-xl font-black tracking-tighter uppercase">Ledger<span className="text-[#4177BC]">PRO v2.1</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleSaveInvoice} 
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-800 transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                            {loading ? "Saving..." : "Save & Post"}
                        </button>
                        
                        <button onClick={handleSendEmail} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50 transition-all">
                            <Send size={14} /> Send Email
                        </button>

                        <PDFDownloadLink 
                            document={<InvoicePDF />} 
                            fileName={`${invoiceId}.pdf`}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#4177BC] text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-[#4177BC]/20"
                        >
                            <Download size={14} /> Download PDF
                        </PDFDownloadLink>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Form Inputs (Same as your original code) */}
                <div className="lg:col-span-5 space-y-8 print:hidden">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Briefcase size={16}/> Business Details</h2>
                        <input type="text" placeholder="Your Name" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" value={freelancerName} onChange={e => setFreelancerName(e.target.value)} />
                        <input type="text" placeholder="Your Contact Details" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" value={freelancerAddress} onChange={e => setFreelancerAddress(e.target.value)} />
                        <textarea placeholder="Bank Details" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none h-24" value={bankDetails} onChange={e => setBankDetails(e.target.value)} />
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#4177BC] flex items-center gap-2"><UserPlus size={16}/> Client Information</h2>
                        <input type="text" placeholder="Project Title" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} className="p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" />
                            <input type="email" placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" placeholder="Tax %" value={taxRate} onChange={e=>setTaxRate(parseFloat(e.target.value)||0)} className="p-4 rounded-xl bg-slate-50 outline-none" />
                            <input type="number" placeholder="Discount" value={discount} onChange={e=>setDiscount(parseFloat(e.target.value)||0)} className="p-4 rounded-xl bg-slate-50 outline-none" />
                            <input type="number" placeholder="Paid" value={receivedAmount} onChange={e=>setReceivedAmount(parseFloat(e.target.value)||0)} className="p-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold outline-none" />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Services</h2>
                            <button onClick={addItem} className="h-10 w-10 bg-slate-100 text-[#4177BC] rounded-full flex items-center justify-center hover:bg-[#4177BC] hover:text-white transition-all"><Plus size={20}/></button>
                        </div>
                        {items.map(item => (
                            <div key={item.id} className="space-y-3 p-4 bg-slate-50 rounded-2xl relative group">
                                <button onClick={()=>removeItem(item.id)} className="absolute -top-2 -right-2 h-6 w-6 bg-white shadow-sm border border-slate-200 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                                <input placeholder="Service Name" value={item.name} onChange={e=>updateItem(item.id,'name',e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                                <div className="flex gap-4">
                                    <input type="number" placeholder="Qty" value={item.qty} onChange={e=>updateItem(item.id,'qty',e.target.value)} className="w-1/2 bg-transparent outline-none" />
                                    <input type="number" placeholder="Price" value={item.price} onChange={e=>updateItem(item.id,'price',e.target.value)} className="w-1/2 bg-transparent outline-none" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preview (Same as original) */}
                <div className="lg:col-span-7">
                    <div className="sticky top-28 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl print:shadow-none print:border-none overflow-hidden">
                        {/* Status Ribbon */}
                        <div className={`absolute top-10 -right-12 rotate-45 px-12 py-1 text-[10px] font-black tracking-widest text-white shadow-sm
                            ${status === 'PAID' ? 'bg-emerald-500' : status === 'PARTIAL' ? 'bg-orange-500' : 'bg-rose-500'}`}>
                            {status}
                        </div>

                        {/* Preview Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-[#4177BC] rounded-2xl flex items-center justify-center text-white"><Building2 size={28}/></div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tighter uppercase">{freelancerName}</h2>
                                    <p className="text-xs text-slate-400">{freelancerAddress}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h1 className="text-4xl font-black tracking-tighter text-slate-900">INVOICE</h1>
                                <p className="text-sm font-bold text-[#4177BC]">{invoiceId}</p>
                            </div>
                        </div>

                        {/* Preview Meta */}
                        <div className="grid grid-cols-2 gap-10 py-8 border-y border-slate-100 mb-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billed To:</p>
                                <p className="font-bold text-slate-900">{clientName || "Client Name"}</p>
                                <p className="text-xs text-slate-500">{clientEmail || "email@address.com"}</p>
                                <p className="text-xs text-slate-500">{clientAddress}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Details:</p>
                                <p className="text-xs">Date: <span className="font-bold">{invoiceDate}</span></p>
                                <p className="text-xs">Due: <span className="font-bold text-rose-500">{dueDate || "Upon Receipt"}</span></p>
                            </div>
                        </div>

                        {/* Preview Table */}
                        <div className="space-y-6 min-h-[150px]">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-4">
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900">{item.name || "Service Name"}</p>
                                        <p className="text-xs text-slate-400">{item.desc}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black">{currency} {(item.qty * item.price).toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400">{item.qty} × {item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview Totals */}
                        <div className="mt-10 pt-6 border-t-2 border-slate-900">
                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">{currency} {subtotal.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-xs font-medium text-rose-500">
                                            <span>Discount</span>
                                            <span>- {currency} {discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Tax ({taxRate}%)</span>
                                        <span className="text-slate-900">{currency} {taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-[#4177BC] bg-slate-50 p-4 rounded-2xl">
                                        <span>Balance Due</span>
                                        <span>{currency} {remainingDue.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[9px] text-right text-slate-400 italic">Total Invoice Value: {currency} {grandTotal.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Footer */}
                        <div className="mt-12 text-[10px] text-slate-400 font-medium">
                            <p className="uppercase font-black mb-1">Payment Instructions:</p>
                            <p className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 text-slate-600 italic">
                                {bankDetails}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}