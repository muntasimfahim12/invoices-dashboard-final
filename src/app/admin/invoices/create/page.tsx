/* eslint-disable prefer-const */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    Plus, Trash2, Download, Send, Save, 
    Upload, Bold, Italic, Type, Printer, 
    Building2, Mail, Globe, Phone, MapPin, Hash, Calendar, CreditCard, Users, Settings, Eye, Percent, Truck,
    Copy
} from "lucide-react";

const THEME = {
    white: "#FFFFFF",
    blue: "#4177BC",
    orange: "#EB9C2C",
    bg: "#F3F3F9",
    border: "#E9EBEC",
    textDark: "#212529",
    textLight: "#878A99",
    success: "#0AB39C",
    navy: "#405189"
};

export default function ProfessionalInvoika2026() {
    const [mounted, setMounted] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 1️⃣ COMPANY / SENDER CONFIGURATION (Persistent)
    const [adminInfo, setAdminInfo] = useState({
        companyName: "Invoika Solutions",
        email: "billing@invoika.com",
        website: "www.invoika.com",
        contact: "+880 1XXX XXXXXX",
        address: "123 Business Avenue, Dhaka",
        taxId: "TX-882299",
        currency: "USD",
        paymentTerms: "7 Days"
    });

    // 2️⃣ CLIENT & 3️⃣ INVOICE CORE DETAILS
    // eslint-disable-next-line react-hooks/purity
    const [invoiceNo, setInvoiceNo] = useState(`#INV-${Math.floor(100000 + Math.random() * 900000)}`);
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("Draft");
    const [billingAddress, setBillingAddress] = useState({ name: "", address: "", phone: "", email: "", taxId: "" });
    
    // 4️⃣ DYNAMIC LINE ITEMS
    const [items, setItems] = useState([
        { id: 1, name: "", details: "", rate: 0, qty: 1, unit: "Pcs", discount: 0 }
    ]);

    // 5️⃣ PRICING ENGINE (Advanced)
    const [globalDiscount, setGlobalDiscount] = useState({ value: 0, type: "fixed" }); // fixed or percent
    const [taxConfigs, setTaxConfigs] = useState([{ name: "VAT", rate: 12.5 }]);
    const [shippingCharge, setShippingCharge] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);

    // 6️⃣ NOTES & TERMS
    const [notes, setNotes] = useState("Thank you for your business!");
    const [terms, setTerms] = useState("Payment is due within 7 days. Late fees may apply.");

    // --- SYSTEM INITIALIZATION ---
    useEffect(() => {
        setMounted(true);
        const savedAdmin = localStorage.getItem('invoika_pro_admin');
        const savedLogo = localStorage.getItem('invoika_pro_logo');
        if (savedAdmin) setAdminInfo(JSON.parse(savedAdmin));
        if (savedLogo) setLogo(savedLogo);
    }, []);

    // --- CALCULATIONS ENGINE ---
    const totals = useMemo(() => {
        const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
        
        let discountVal = globalDiscount.type === "percent" 
            ? (subtotal * globalDiscount.value) / 100 
            : globalDiscount.value;

        const taxTotal = taxConfigs.reduce((acc, tax) => acc + (subtotal * tax.rate) / 100, 0);
        const grandTotal = subtotal + taxTotal + Number(shippingCharge) - discountVal;
        const remainingBalance = grandTotal - paidAmount;

        return { subtotal, taxTotal, discountVal, grandTotal, remainingBalance };
    }, [items, globalDiscount, taxConfigs, shippingCharge, paidAmount]);

    // --- HANDLERS ---
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setLogo(base64);
                localStorage.setItem('invoika_pro_logo', base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const addItem = () => setItems([...items, { id: Date.now(), name: "", details: "", rate: 0, qty: 1, unit: "Pcs", discount: 0 }]);
    const removeItem = (id: number) => items.length > 1 && setItems(items.filter(i => i.id !== id));
    const updateItem = (id: number, field: string, value: any) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* --- HEADER ACTIONS --- */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-700">Invoice Generator</h1>
                        <p className="text-xs text-slate-500 font-medium">Admin / Billing / Create New</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => {
                            localStorage.setItem('invoika_pro_admin', JSON.stringify(adminInfo));
                            alert("Admin Configuration Stored Permanently!");
                        }} className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-white transition-all shadow-md" style={{ backgroundColor: THEME.orange }}>
                            <Save size={18} /> Save Settings
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    
                    {/* --- 1. COMPANY & CORE DETAILS --- */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Invoice Number (Auto/Manual)</label>
                                    <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded text-sm font-mono">
                                        <Hash size={14} className="text-blue-500" /> 
                                        <input className="bg-transparent outline-none w-full" value={invoiceNo} onChange={(e)=>setInvoiceNo(e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Invoice Date</label>
                                        <input type="date" value={invoiceDate} onChange={(e)=>setInvoiceDate(e.target.value)} className="w-full p-2 border border-slate-200 rounded text-sm outline-none focus:border-blue-400" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Status</label>
                                        <select className="w-full p-2 border border-slate-200 rounded text-sm outline-none cursor-pointer" value={paymentStatus} onChange={(e)=>setPaymentStatus(e.target.value)}>
                                            <option>Draft</option>
                                            <option>Sent</option>
                                            <option>Paid</option>
                                            <option>Partial</option>
                                            <option>Overdue</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- SENDER CONFIGURATION (EDITABLE) --- */}
                        <div className="flex flex-col items-end">
                            <div onClick={() => fileInputRef.current?.click()} className="w-48 h-20 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all mb-4 overflow-hidden relative group">
                                {logo ? (
                                    <img src={logo} alt="Logo" className="max-h-full p-2" />
                                ) : (
                                    <div className="text-center">
                                        <Upload size={20} className="mx-auto text-slate-400" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">Logo (Permanent)</span>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} hidden onChange={handleLogoUpload} accept="image/*" />
                            </div>
                            <div className="text-right space-y-1 w-full max-w-xs">
                                <input className="w-full text-right font-bold text-lg outline-none" placeholder="Company Name" value={adminInfo.companyName} onChange={(e)=>setAdminInfo({...adminInfo, companyName: e.target.value})} style={{ color: THEME.blue }} />
                                <textarea className="w-full text-right text-xs text-slate-500 outline-none resize-none" rows={2} placeholder="Address" value={adminInfo.address} onChange={(e)=>setAdminInfo({...adminInfo, address: e.target.value})} />
                                <input className="w-full text-right text-xs text-slate-500 outline-none" placeholder="Email" value={adminInfo.email} onChange={(e)=>setAdminInfo({...adminInfo, email: e.target.value})} />
                                <input className="w-full text-right text-xs text-slate-500 outline-none" placeholder="Contact" value={adminInfo.contact} onChange={(e)=>setAdminInfo({...adminInfo, contact: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* --- 2. CLIENT CONFIGURATION --- */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50/30">
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: THEME.blue }}>
                                <Users size={14} /> Client Details
                            </h3>
                            <input className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm focus:ring-1 ring-blue-400 outline-none" placeholder="Client Email (Retrieval Key)" value={billingAddress.email} onChange={(e) => setBillingAddress({...billingAddress, email: e.target.value})} />
                            <input className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm" placeholder="Client Name" value={billingAddress.name} onChange={(e)=>setBillingAddress({...billingAddress, name: e.target.value})} />
                            <textarea className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm" rows={2} placeholder="Billing Address" value={billingAddress.address} onChange={(e)=>setBillingAddress({...billingAddress, address: e.target.value})} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: THEME.blue }}>
                                <CreditCard size={14} /> Payment Settings
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Currency</label>
                                    <input className="w-full p-2 bg-white border border-slate-200 rounded text-sm" value={adminInfo.currency} onChange={(e)=>setAdminInfo({...adminInfo, currency: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Terms</label>
                                    <input className="w-full p-2 bg-white border border-slate-200 rounded text-sm" value={adminInfo.paymentTerms} onChange={(e)=>setAdminInfo({...adminInfo, paymentTerms: e.target.value})} />
                                </div>
                            </div>
                            <input className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm" placeholder="Client Tax/VAT ID (Optional)" value={billingAddress.taxId} onChange={(e)=>setBillingAddress({...billingAddress, taxId: e.target.value})} />
                        </div>
                    </div>

                    {/* --- 4. DYNAMIC LINE ITEMS TABLE --- */}
                    <div className="p-8">
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead className="bg-[#F3F6F9] text-[10px] font-black uppercase text-slate-500 border-b border-slate-200">
                                    <tr>
                                        <th className="p-4 text-left w-12">#</th>
                                        <th className="p-4 text-left">Item Details</th>
                                        <th className="p-4 text-center w-24">Unit</th>
                                        <th className="p-4 text-center w-28">Price</th>
                                        <th className="p-4 text-center w-28">Qty</th>
                                        <th className="p-4 text-right w-32">Amount</th>
                                        <th className="p-4 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-sm font-bold text-slate-400">{index + 1}</td>
                                            <td className="p-4">
                                                <input className="w-full font-bold text-sm outline-none bg-transparent mb-1" placeholder="Item Name *" value={item.name} onChange={(e)=>updateItem(item.id, 'name', e.target.value)} />
                                                <input className="w-full text-xs text-slate-400 outline-none bg-transparent" placeholder="Rich description..." value={item.details} onChange={(e)=>updateItem(item.id, 'details', e.target.value)} />
                                            </td>
                                            <td className="p-4">
                                                <input className="w-full p-2 border border-slate-200 rounded text-center text-xs" placeholder="Unit" value={item.unit} onChange={(e)=>updateItem(item.id, 'unit', e.target.value)} />
                                            </td>
                                            <td className="p-4">
                                                <input type="number" className="w-full p-2 border border-slate-200 rounded text-center text-sm font-bold" value={item.rate} onChange={(e)=>updateItem(item.id, 'rate', Number(e.target.value))} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <input type="number" className="w-16 p-2 border border-slate-200 rounded text-center text-sm" value={item.qty} onChange={(e)=>updateItem(item.id, 'qty', Number(e.target.value))} />
                                            </td>
                                            <td className="p-4 text-right font-bold text-sm text-slate-700">
                                                {(item.qty * item.rate).toLocaleString()}
                                            </td>
                                            <td className="p-4">
                                                <button onClick={()=>removeItem(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={addItem} className="mt-4 flex items-center gap-2 px-4 py-2 rounded text-[11px] font-black text-white uppercase shadow-sm hover:opacity-90 transition-all" style={{ backgroundColor: THEME.blue }}>
                            <Plus size={14} /> Add Line Item
                        </button>
                    </div>

                    {/* --- 5. PRICING ENGINE & 6. NOTES --- */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50/20 border-t border-slate-100">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Global Adjustments</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400">Discount ({globalDiscount.type})</label>
                                        <div className="flex">
                                            <input type="number" className="w-full px-3 py-1.5 border border-slate-200 rounded-l text-sm" value={globalDiscount.value} onChange={(e)=>setGlobalDiscount({...globalDiscount, value: Number(e.target.value)})} />
                                            <select className="border border-l-0 border-slate-200 rounded-r text-[10px] font-bold px-1" onChange={(e)=>setGlobalDiscount({...globalDiscount, type: e.target.value})}>
                                                <option value="fixed">$</option>
                                                <option value="percent">%</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400">Shipping Fee</label>
                                        <input type="number" className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm" value={shippingCharge} onChange={(e)=>setShippingCharge(Number(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                    <Type size={14} /> Notes & Terms (Rich Text Editor)
                                </h3>
                                <div className="space-y-3">
                                    <textarea className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 ring-blue-400" rows={2} placeholder="Invoice Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
                                    <textarea className="w-full p-3 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 ring-blue-400 font-medium" rows={2} placeholder="Terms & Conditions" value={terms} onChange={(e)=>setTerms(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* --- CALCULATION DISPLAY --- */}
                        <div className="space-y-2">
                            <div className="flex justify-between p-3 rounded bg-white border border-slate-100">
                                <span className="text-sm font-bold text-slate-500">Sub Total</span>
                                <span className="font-bold text-slate-800">{adminInfo.currency} {totals.subtotal.toLocaleString()}</span>
                            </div>
                            {taxConfigs.map((tax, i) => (
                                <div key={i} className="flex justify-between p-3 rounded bg-white border border-slate-100">
                                    <span className="text-sm font-bold text-slate-500">{tax.name} ({tax.rate}%)</span>
                                    <span className="font-bold text-slate-800">+{((totals.subtotal * tax.rate)/100).toLocaleString()}</span>
                                </div>
                            ))}
                            {totals.discountVal > 0 && (
                                <div className="flex justify-between p-3 rounded bg-white border border-slate-100 text-red-500">
                                    <span className="text-sm font-bold">Discount</span>
                                    <span className="font-bold">-{totals.discountVal.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between p-4 rounded-xl shadow-inner mt-4" style={{ backgroundColor: THEME.blue }}>
                                <div className="text-white">
                                    <p className="text-[10px] font-black uppercase opacity-80">Total Amount Due</p>
                                    <p className="text-2xl font-black">{adminInfo.currency} {totals.grandTotal.toLocaleString()}</p>
                                </div>
                                <div className="text-right text-white border-l border-white/20 pl-4">
                                    <p className="text-[10px] font-black uppercase opacity-80">Remaining</p>
                                    <p className="text-xl font-black opacity-90">{totals.remainingBalance.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="pt-2 flex gap-2">
                                <input type="number" placeholder="Paid Amount" className="flex-1 p-2 border border-slate-200 rounded text-xs font-bold" value={paidAmount} onChange={(e)=>setPaidAmount(Number(e.target.value))} />
                                <div className="flex-1 p-2 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase flex items-center justify-center italic">
                                    Auto-Locked on Paid
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 9. ACTIONS & OUTPUTS --- */}
                    <div className="p-8 bg-white border-t border-slate-100 flex justify-between items-center">
                         <div className="flex gap-2">
                            <button className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm" title="Preview">
                                <Eye size={18} />
                            </button>
                            <button className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all shadow-sm" title="Duplicate">
                                <Copy size={18} />
                            </button>
                         </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg transition-all hover:opacity-90" style={{ backgroundColor: THEME.success }}>
                                <Download size={18} /> Export PDF
                            </button>
                            <button className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm text-white shadow-lg transition-all hover:opacity-90" style={{ backgroundColor: THEME.navy }}>
                                <Send size={18} /> Send Invoice
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    2026 © {adminInfo.companyName} • PREMIUM BILLING ENGINE
                </footer>
            </div>
        </div>
    );
}