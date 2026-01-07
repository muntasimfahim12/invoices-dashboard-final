/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Plus, Trash2, ArrowLeft, Building2, 
    Download, Send, Briefcase, Mail, 
    CalendarClock, Banknote, UserPlus, Hash 
} from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// --- PDF STYLES ---
const pdfStyles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, borderBottom: 2, borderBottomColor: '#4177BC', pb: 10 },
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
    summaryBox: { width: '40%', gap: 5 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
    grandTotal: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0', color: '#4177BC', fontWeight: 'bold' },
    footer: { marginTop: 50, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 20 },
    bankBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 5 }
});

export default function UltimateDigitalLedger() {
    const [mounted, setMounted] = useState(false);

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
    const [dueDate, setDueDate] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [bankDetails, setBankDetails] = useState("Bank: ABC Bank | A/C: 123-456-789 | Swift: ABCDBD");
    const [invoiceId, setInvoiceId] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");

    useEffect(() => {
        setMounted(true);
        setInvoiceId("INV-" + Math.floor(100000 + Math.random() * 900000));
        setInvoiceDate(new Date().toLocaleDateString('en-GB'));
    }, []);

    // --- CALCULATION ENGINE ---
    const { subtotal, taxAmount, grandTotal, remainingDue, status } = useMemo(() => {
        const sub = items.reduce((acc, item) => acc + (Number(item.qty) * Number(item.price)), 0);
        const tax = (sub * taxRate) / 100;
        const total = sub + tax;
        const due = total - receivedAmount;

        let paymentStatus = "UNPAID";
        if (receivedAmount > 0 && due > 0) paymentStatus = "PARTIAL";
        if (receivedAmount > 0 && due <= 0 && total > 0) paymentStatus = "PAID";

        return { subtotal: sub, taxAmount: tax, grandTotal: total, remainingDue: due, status: paymentStatus };
    }, [items, receivedAmount, taxRate]);

    // --- HANDLERS ---
    const addItem = () => setItems([...items, { id: Date.now(), name: "", desc: "", qty: 1, price: 0 }]);
    const removeItem = (id: number) => items.length > 1 && setItems(items.filter(i => i.id !== id));
    const updateItem = (id: number, field: string, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSendEmail = () => {
        const subject = encodeURIComponent(`Invoice ${invoiceId} for ${projectTitle || 'Project'}`);
        const body = encodeURIComponent(`Hi ${clientName || 'Client'},\n\nPlease find the invoice details below:\n\nProject: ${projectTitle}\nTotal: ${currency} ${grandTotal.toLocaleString()}\nPaid: ${currency} ${receivedAmount.toLocaleString()}\nBalance: ${currency} ${remainingDue.toLocaleString()}\n\nRegards,\n${freelancerName}`);
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

                <View style={pdfStyles.row}>
                    <View style={pdfStyles.col}>
                        <Text style={pdfStyles.label}>Billed To:</Text>
                        <Text style={pdfStyles.value}>{clientName || "Client Name"}</Text>
                        <Text style={{ fontSize: 9 }}>{clientEmail}</Text>
                        <Text style={{ fontSize: 9 }}>{clientAddress}</Text>
                    </View>
                    <View style={pdfStyles.col}>
                        <Text style={pdfStyles.label}>Invoice Date:</Text>
                        <Text style={pdfStyles.value}>{invoiceDate}</Text>
                        <Text style={[pdfStyles.label, { marginTop: 10 }]}>Due Date:</Text>
                        <Text style={pdfStyles.value}>{dueDate || "Upon Receipt"}</Text>
                    </View>
                </View>

                <View style={pdfStyles.table}>
                    <View style={pdfStyles.tableHeader}>
                        <Text style={pdfStyles.colDesc}>Description</Text>
                        <Text style={pdfStyles.colQty}>Qty</Text>
                        <Text style={pdfStyles.colPrice}>Amount</Text>
                    </View>
                    {items.map((item, idx) => (
                        <View key={idx} style={pdfStyles.tableRow}>
                            <View style={pdfStyles.colDesc}>
                                <Text style={{ fontWeight: 'bold' }}>{item.name || "Item Name"}</Text>
                                <Text style={{ fontSize: 8, color: '#64748B' }}>{item.desc}</Text>
                            </View>
                            <Text style={pdfStyles.colQty}>{item.qty}</Text>
                            <Text style={pdfStyles.colPrice}>{currency} {(item.qty * item.price).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>

                <View style={pdfStyles.summaryContainer}>
                    <View style={pdfStyles.summaryBox}>
                        <View style={pdfStyles.summaryRow}>
                            <Text>Subtotal:</Text>
                            <Text>{currency} {subtotal.toLocaleString()}</Text>
                        </View>
                        <View style={pdfStyles.summaryRow}>
                            <Text>Tax ({taxRate}%):</Text>
                            <Text>{currency} {taxAmount.toLocaleString()}</Text>
                        </View>
                        <View style={[pdfStyles.summaryRow, pdfStyles.grandTotal]}>
                            <Text>Total:</Text>
                            <Text>{currency} {grandTotal.toLocaleString()}</Text>
                        </View>
                        <View style={pdfStyles.summaryRow}>
                            <Text style={{ color: '#10B981' }}>Amount Paid:</Text>
                            <Text>- {currency} {receivedAmount.toLocaleString()}</Text>
                        </View>
                        <View style={[pdfStyles.summaryRow, { fontWeight: 'bold' }]}>
                            <Text>Balance Due:</Text>
                            <Text>{currency} {remainingDue.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                <View style={pdfStyles.footer}>
                    <Text style={pdfStyles.label}>Payment Details:</Text>
                    <View style={pdfStyles.bankBox}>
                        <Text style={{ fontSize: 9 }}>{bankDetails}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#4177BC]/10">
            {/* NAVIGATION */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 print:hidden">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:text-[#4177BC] transition-all">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-xl font-black tracking-tighter uppercase">Ledger<span className="text-[#4177BC]">PRO v2.0</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
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
                {/* LEFT: INPUTS */}
                <div className="lg:col-span-5 space-y-8 print:hidden">
                    {/* Freelancer Info */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Briefcase size={16}/> Business Details</h2>
                        <input type="text" placeholder="Your Name" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" value={freelancerName} onChange={e => setFreelancerName(e.target.value)} />
                        <input type="text" placeholder="Your Contact Details" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" value={freelancerAddress} onChange={e => setFreelancerAddress(e.target.value)} />
                        <textarea placeholder="Bank Details" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none h-24" value={bankDetails} onChange={e => setBankDetails(e.target.value)} />
                    </div>

                    {/* Client Info */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
                        <h2 className="text-xs font-black uppercase tracking-widest text-[#4177BC] flex items-center gap-2"><UserPlus size={16}/> Client Information</h2>
                        <input type="text" placeholder="Project Title" className="w-full p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} className="p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" />
                            <input type="email" placeholder="Client Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" />
                        </div>
                        <input type="text" placeholder="Client Address" value={clientAddress} onChange={e => setClientAddress(e.target.value)} className="p-4 rounded-xl bg-slate-50 border border-transparent focus:border-[#4177BC]/20 outline-none" />
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Currency</label>
                                <select value={currency} onChange={e=>setCurrency(e.target.value)} className="w-full p-4 rounded-xl bg-slate-50 outline-none">
                                    <option value="USD">USD ($)</option>
                                    <option value="BDT">BDT (৳)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Tax %</label>
                                <input type="number" value={taxRate} onChange={e=>setTaxRate(parseFloat(e.target.value)||0)} className="w-full p-4 rounded-xl bg-slate-50 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Paid Amount</label>
                                <input type="number" value={receivedAmount} onChange={e=>setReceivedAmount(parseFloat(e.target.value)||0)} className="w-full p-4 rounded-xl bg-emerald-50 text-emerald-700 font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Services / Items</h2>
                            <button onClick={addItem} className="h-10 w-10 bg-slate-100 text-[#4177BC] rounded-full flex items-center justify-center hover:bg-[#4177BC] hover:text-white transition-all"><Plus size={20}/></button>
                        </div>
                        {items.map(item => (
                            <div key={item.id} className="space-y-3 p-4 bg-slate-50 rounded-2xl relative group">
                                <button onClick={()=>removeItem(item.id)} className="absolute -top-2 -right-2 h-6 w-6 bg-white shadow-sm border border-slate-200 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={12}/></button>
                                <input placeholder="Service Name" value={item.name} onChange={e=>updateItem(item.id,'name',e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                                <input placeholder="Description" value={item.desc} onChange={e=>updateItem(item.id,'desc',e.target.value)} className="w-full bg-transparent text-sm text-slate-500 outline-none" />
                                <div className="flex gap-4 border-t border-slate-200 pt-3">
                                    <div className="flex-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Qty</span>
                                        <input type="number" value={item.qty} onChange={e=>updateItem(item.id,'qty',e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Price</span>
                                        <input type="number" value={item.price} onChange={e=>updateItem(item.id,'price',e.target.value)} className="w-full bg-transparent font-bold outline-none" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="lg:col-span-7">
                    <div className="sticky top-28 bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-2xl print:shadow-none print:border-none">
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
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Details:</p>
                                <p className="text-xs">Date: <span className="font-bold">{invoiceDate}</span></p>
                                <p className="text-xs">Status: <span className={`font-bold ${status === 'PAID' ? 'text-emerald-500' : 'text-orange-500'}`}>{status}</span></p>
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
                                    <div className="flex justify-between text-xs font-medium text-slate-500">
                                        <span>Tax ({taxRate}%)</span>
                                        <span className="text-slate-900">{currency} {taxAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-[#4177BC] bg-slate-50 p-4 rounded-2xl">
                                        <span>Total Due</span>
                                        <span>{currency} {remainingDue.toLocaleString()}</span>
                                    </div>
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