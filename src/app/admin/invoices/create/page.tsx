/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo } from 'react';
import { 
  Plus, Trash2, Save, Download, Briefcase, 
  User as UserIcon, Percent, Loader2, Mail 
} from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

// আপনার ব্যাকএন্ড পোর্টের সাথে মিলিয়ে নিন
const API_URL = 'http://localhost:5000'; 

const InvoicePage = () => {
  const [loading, setLoading] = useState(false);
  const [invoiceId] = useState(`INV-${Date.now().toString().slice(-6)}`);
  
  // Form States
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState(''); // Milestone sync এর জন্য
  const [items, setItems] = useState([{ id: 1, name: '', rate: 0, qty: 1 }]);
  const [useTax, setUseTax] = useState(true);
  const [paymentType, setPaymentType] = useState('Full');

  // Calculations
  const { subTotal, taxAmount, grandTotal } = useMemo(() => {
    const sub = items.reduce((acc, item) => acc + (item.rate * item.qty), 0);
    const tax = useTax ? sub * 0.125 : 0;
    return { subTotal: sub, taxAmount: tax, grandTotal: sub + tax };
  }, [items, useTax]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', rate: 0, qty: 1 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  // --- ১০১% ব্যাকএন্ড ফ্রেন্ডলি হ্যান্ডলার ---
  const handleCreateAndSend = async () => {
    if (!clientEmail || !clientName || !projectTitle) {
      return toast.error("Client Name, Email and Project Title are required!");
    }

    setLoading(true);
    const mainToast = toast.loading("Processing Invoice & Syncing Dashboard...");

    try {
      // আপনার ব্যাকএন্ডের Route 2 (POST /invoices) অনুযায়ী ডাটা স্ট্রাকচার
      const payload = {
        invoiceId,
        projectId, 
        clientName,
        clientEmail: clientEmail.toLowerCase().trim(),
        adminEmail: "admin@geniehack.com", // এটি আপনার ডিফল্ট এডমিন ইমেইল
        projectTitle,
        items: items.map(i => ({ name: i.name, qty: i.qty, price: i.rate })),
        subTotal,
        taxAmount,
        grandTotal,
        remainingDue: grandTotal,
        currency: "$",
        status: "Unpaid", 
        paymentType,
        createdAt: new Date()
      };
      const res = await axios.post(`${API_URL}/invoices`, payload);

      if (res.status === 201) {
        await axios.post(`${API_URL}/invoices/send-email`, payload);
        toast.success("✅ Invoice Saved & Sent to Client!", { id: mainToast });
      }

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.error || "Server Connection Failed!";
      toast.error(msg, { id: mainToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    toast("Generating PDF Download...", { icon: '📄' });
    window.open(`${API_URL}/invoices/${invoiceId}/download`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8 font-sans text-slate-700">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden">
        
        {/* Blue Accent Header */}
        <div className="bg-[#4177BC] p-6 text-white flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold tracking-tight">GENIE HACK BILLING</h1>
                <p className="text-xs opacity-80 uppercase tracking-widest">Global Dashboard Integrated System</p>
            </div>
            <div className="text-right">
                <p className="text-xs font-bold opacity-70">INVOICE NO</p>
                <p className="text-lg font-mono">#{invoiceId}</p>
            </div>
        </div>

        <div className="p-8">
            {/* Top Row: Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                    <div className="relative mt-1">
                        <Briefcase size={14} className="absolute left-3 top-3 text-slate-300" />
                        <input type="text" className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-[#4177BC]" placeholder="e.g. Server Migration" onChange={e => setProjectTitle(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Client Name</label>
                    <div className="relative mt-1">
                        <UserIcon size={14} className="absolute left-3 top-3 text-slate-300" />
                        <input type="text" className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-[#4177BC]" placeholder="John Doe" onChange={e => setClientName(e.target.value)} />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Client Email</label>
                    <div className="relative mt-1">
                        <Mail size={14} className="absolute left-3 top-3 text-slate-300" />
                        <input type="email" className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded text-sm outline-none focus:border-[#4177BC]" placeholder="client@example.com" onChange={e => setClientEmail(e.target.value)} />
                    </div>
                </div>
            </div>

            <hr className="mb-8 border-slate-100" />

            {/* Table */}
            <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <tr>
                            <th className="p-3 text-left">Service Description</th>
                            <th className="p-3 text-center w-24">Qty</th>
                            <th className="p-3 text-center w-32">Price ($)</th>
                            <th className="p-3 text-right w-32">Total</th>
                            <th className="p-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={item.id} className="border-b border-slate-50">
                                <td className="p-3">
                                    <input type="text" placeholder="Service name..." className="w-full bg-transparent text-sm outline-none" onChange={e => {
                                        const n = [...items]; n[index].name = e.target.value; setItems(n);
                                    }} />
                                </td>
                                <td className="p-3">
                                    <input type="number" value={item.qty} className="w-full text-center bg-transparent text-sm" onChange={e => {
                                        const n = [...items]; n[index].qty = Number(e.target.value); setItems(n);
                                    }} />
                                </td>
                                <td className="p-3">
                                    <input type="number" value={item.rate} className="w-full text-center bg-transparent text-sm font-semibold" onChange={e => {
                                        const n = [...items]; n[index].rate = Number(e.target.value); setItems(n);
                                    }} />
                                </td>
                                <td className="p-3 text-right text-sm font-bold text-[#4177BC]">
                                    ${(item.rate * item.qty).toLocaleString()}
                                </td>
                                <td className="p-3">
                                    <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={addItem} className="mt-4 flex items-center gap-2 text-[10px] font-bold text-[#4177BC] bg-blue-50 px-3 py-1.5 rounded uppercase tracking-wider">
                    <Plus size={12} /> Add Line
                </button>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 bg-slate-50 p-6 rounded-lg mt-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 rounded shadow-sm">
                        <Percent size={14} className="text-[#4177BC]" />
                        <span className="text-xs font-bold uppercase text-slate-400">Apply Tax</span>
                        <input type="checkbox" checked={useTax} onChange={() => setUseTax(!useTax)} className="w-4 h-4" />
                    </div>
                    <select className="bg-white border border-slate-200 p-2 text-xs font-bold rounded shadow-sm outline-none" onChange={e => setPaymentType(e.target.value)}>
                        <option value="Full">Full Payment</option>
                        <option value="Milestone">Milestone Based</option>
                    </select>
                </div>

                <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between text-sm text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-bold">${subTotal.toLocaleString()}</span>
                    </div>
                    {useTax && (
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Tax (12.5%)</span>
                            <span className="font-bold">+ ${taxAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-xl font-black text-[#4177BC] border-t border-slate-200 pt-2">
                        <span>Total Due</span>
                        <span>${grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-10">
                <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 text-xs font-bold rounded-md hover:bg-slate-200 transition-all uppercase tracking-widest">
                    <Download size={14} /> Preview PDF
                </button>
                <button 
                  disabled={loading}
                  onClick={handleCreateAndSend}
                  className="flex items-center gap-2 px-8 py-3 bg-[#4177BC] text-white text-xs font-bold rounded-md hover:bg-blue-700 transition-all uppercase tracking-widest shadow-lg shadow-blue-100 disabled:bg-blue-300"
                >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                    Create & Sync Globally
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;