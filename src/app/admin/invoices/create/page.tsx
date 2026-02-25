/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Trash2, Save, Download, Briefcase, 
  User as UserIcon, Percent, Loader2, Mail, Search
} from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 

const InvoicePage = () => {
  const [loading, setLoading] = useState(false);
  const [invoiceId] = useState(`INV-${Date.now().toString().slice(-6)}`);
  
  // Existing Clients State
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [fetchingClients, setFetchingClients] = useState(true);

  // Form States
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [items, setItems] = useState([{ id: 1, name: '', rate: 0, qty: 1 }]);
  const [useTax, setUseTax] = useState(true);
  const [paymentType, setPaymentType] = useState('Full');

  // --- ক্লায়েন্ট লিস্ট ফেচ করার লজিক ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // আপনার /projects এপিআই থেকে সব প্রজেক্ট নিয়ে আসা
        const res = await axios.get(`${API_URL}/projects`);
        if (res.data) {
          // ইমেইল অনুযায়ী ইউনিক ক্লায়েন্ট লিস্ট ফিল্টার করা
          const uniqueClients = Array.from(new Set(res.data.map((p: any) => p.clientEmail)))
            .map(email => {
              const project = res.data.find((p: any) => p.clientEmail === email);
              return {
                name: project.clientName,
                email: project.clientEmail,
                projectId: project._id // সর্বশেষ প্রজেক্ট আইডি
              };
            });
          setExistingClients(uniqueClients);
        }
      } catch (err) {
        console.error("Client fetch error:", err);
      } finally {
        setFetchingClients(false);
      }
    };
    fetchClients();
  }, []);

  // ক্লায়েন্ট সিলেক্ট করলে অটো-ফিল হবে
  const handleClientSelect = (email: string) => {
    const selected = existingClients.find(c => c.email === email);
    if (selected) {
      setClientEmail(selected.email);
      setClientName(selected.name);
      setProjectId(selected.projectId); // ঐ ক্লায়েন্টের প্রজেক্ট আইডি সিঙ্ক হবে
      toast.success(`Selected: ${selected.name}`);
    }
  };

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

  const handleCreateAndSend = async () => {
    if (!clientEmail || !clientName || !projectTitle) {
      return toast.error("Client Name, Email and Project Title are required!");
    }

    setLoading(true);
    const mainToast = toast.loading("Processing Invoice & Syncing Dashboard...");

    try {
      const payload = {
        invoiceId,
        projectId, 
        clientName,
        clientEmail: clientEmail.toLowerCase().trim(),
        adminEmail: "admin@geniehack.com",
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
        // ইমেইল পাঠানোর চেষ্টা (ঐচ্ছিক)
        try {
            await axios.post(`${API_URL}/invoices/send-email`, payload);
        } catch (e) { console.warn("Email failed but invoice saved."); }
        
        toast.success("✅ Invoice Saved & Synced!", { id: mainToast });
      }

    } catch (error: any) {
      const msg = error.response?.data?.error || "Server Connection Failed!";
      toast.error(msg, { id: mainToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-700">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#4177BC] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-black tracking-tight uppercase">Genie Hack Billing</h1>
                <p className="text-[10px] opacity-80 uppercase tracking-[0.3em] mt-1 font-bold">Global Finance Control Center</p>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-md border border-white/20 text-right">
                <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Invoice Sequence</p>
                <p className="text-xl font-mono font-bold">#{invoiceId}</p>
            </div>
        </div>

        <div className="p-8">
            {/* Client Selector & Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quick Client Select</label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
                            <select 
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4177BC]/20 focus:border-[#4177BC] appearance-none"
                                onChange={(e) => handleClientSelect(e.target.value)}
                                value={clientEmail}
                            >
                                <option value="">Select Existing Client</option>
                                {existingClients.map((client, idx) => (
                                    <option key={idx} value={client.email}>{client.name} ({client.email})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Client Name</label>
                            <input 
                                value={clientName} 
                                onChange={e => setClientName(e.target.value)}
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#4177BC]" 
                                placeholder="Receiver Name" 
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Client Email</label>
                            <input 
                                value={clientEmail} 
                                onChange={e => setClientEmail(e.target.value)}
                                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#4177BC]" 
                                placeholder="email@example.com" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Project Assignment</label>
                        <div className="relative">
                            <Briefcase size={16} className="absolute left-3 top-3.5 text-slate-400" />
                            <input 
                                value={projectTitle}
                                onChange={e => setProjectTitle(e.target.value)}
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#4177BC]" 
                                placeholder="Enter Project Name" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Payment Structure</label>
                        <select 
                            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#4177BC] outline-none"
                            onChange={e => setPaymentType(e.target.value)}
                        >
                            <option value="Full">One-Time Full Payment</option>
                            <option value="Milestone">Milestone Split</option>
                        </select>
                    </div>
                </div>
            </div>

            <hr className="mb-10 border-slate-100" />

            {/* Line Items Table */}
            <div className="overflow-x-auto mb-6">
                <table className="w-full">
                    <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="pb-4 text-left">Description</th>
                            <th className="pb-4 text-center w-24">Qty</th>
                            <th className="pb-4 text-center w-32">Rate ($)</th>
                            <th className="pb-4 text-right w-32">Amount</th>
                            <th className="pb-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {items.map((item, index) => (
                            <tr key={item.id} className="group">
                                <td className="py-4">
                                    <input 
                                        type="text" 
                                        placeholder="Add service or product..." 
                                        className="w-full bg-transparent text-sm font-medium outline-none" 
                                        value={item.name}
                                        onChange={e => {
                                            const n = [...items]; n[index].name = e.target.value; setItems(n);
                                        }} 
                                    />
                                </td>
                                <td className="py-4">
                                    <input 
                                        type="number" 
                                        className="w-full text-center bg-slate-50 border border-transparent group-hover:border-slate-200 rounded-lg p-1.5 text-sm" 
                                        value={item.qty}
                                        onChange={e => {
                                            const n = [...items]; n[index].qty = Number(e.target.value); setItems(n);
                                        }} 
                                    />
                                </td>
                                <td className="py-4">
                                    <input 
                                        type="number" 
                                        className="w-full text-center bg-slate-50 border border-transparent group-hover:border-slate-200 rounded-lg p-1.5 text-sm font-bold" 
                                        value={item.rate}
                                        onChange={e => {
                                            const n = [...items]; n[index].rate = Number(e.target.value); setItems(n);
                                        }} 
                                    />
                                </td>
                                <td className="py-4 text-right text-sm font-black text-slate-700">
                                    ${(item.rate * item.qty).toLocaleString()}
                                </td>
                                <td className="py-4 text-right">
                                    <button onClick={() => removeItem(item.id)} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={addItem} className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#4177BC] bg-blue-50 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-blue-100 transition-colors">
                    <Plus size={14} /> Add Line Item
                </button>
            </div>

            {/* Calculations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Settings</h4>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${useTax ? 'bg-[#4177BC] text-white' : 'bg-slate-200 text-slate-400'}`}>
                                <Percent size={14} />
                            </div>
                            <span className="text-xs font-bold">Apply 12.5% Tax</span>
                        </div>
                        <input type="checkbox" checked={useTax} onChange={() => setUseTax(!useTax)} className="w-5 h-5 accent-[#4177BC]" />
                    </div>
                </div>

                <div className="space-y-3 px-4">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                        <span>Subtotal</span>
                        <span className="text-slate-700">${subTotal.toLocaleString()}</span>
                    </div>
                    {useTax && (
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                            <span>Tax (12.5%)</span>
                            <span className="text-green-600">+ ${taxAmount.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-2xl font-black text-[#4177BC] pt-4 border-t border-slate-100">
                        <span>Total Due</span>
                        <span>${grandTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-end gap-4 mt-12">
                <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-[0.2em]">
                    <Download size={16} /> Print / Preview
                </button>
                <button 
                  disabled={loading}
                  onClick={handleCreateAndSend}
                  className="flex items-center justify-center gap-2 px-10 py-4 bg-[#4177BC] text-white text-[10px] font-black rounded-xl hover:bg-blue-700 transition-all uppercase tracking-[0.2em] shadow-xl shadow-blue-200 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Authorize & Sync Invoice
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;