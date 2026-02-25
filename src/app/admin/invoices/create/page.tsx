/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Trash2, Download, Briefcase, 
  Loader2, Search, CheckCircle, Clock, 
  Info, Mail
} from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 

const InvoicePage = () => {
  const [loading, setLoading] = useState(false);
  const [invoiceId] = useState(`INV-${Date.now().toString().slice(-6)}`);
  
  // States
  const [existingClients, setExistingClients] = useState<any[]>([]);
  const [status, setStatus] = useState<"Unpaid" | "Paid">("Unpaid");
  const [installmentNo, setInstallmentNo] = useState(1);

  // Form States
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [items, setItems] = useState([{ id: Date.now(), name: '', rate: 0, qty: 1 }]);
  const [paymentType, setPaymentType] = useState('Full');

  // ১. /clinets এন্ডপয়েন্ট থেকে ডেটা ফেচ করা
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // আপনার ব্যাকএন্ডের সঠিক স্পেলিং 'clinets' ব্যবহার করা হয়েছে
        const res = await axios.get(`${API_URL}/clinets`);
        if (res.data && Array.isArray(res.data)) {
          const clientProjectList: any[] = [];

          // ডেটাবেস স্ট্রাকচার অনুযায়ী ক্লায়েন্টের প্রজেক্টগুলো ফ্ল্যাট করা হচ্ছে
          res.data.forEach((client: any) => {
            if (client.projects && client.projects.length > 0) {
              client.projects.forEach((proj: any) => {
                clientProjectList.push({
                  clientName: client.name,
                  clientEmail: client.email,
                  projId: proj._id,
                  projName: proj.name // আপনার ব্যাকএন্ডে প্রজেক্টের নাম 'name' ফিল্ডে আছে
                });
              });
            }
          });
          setExistingClients(clientProjectList);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load clients. Check your server.");
      }
    };
    fetchInitialData();
  }, []);

  // ২. ড্রপডাউন থেকে ক্লায়েন্ট এবং তার প্রজেক্ট সিলেক্ট করা
  const handleClientSelect = async (uniqueKey: string) => {
    // এখানে uniqueKey হিসেবে clientEmail + projId ব্যবহার করা হচ্ছে নিখুঁত সিলেকশনের জন্য
    const selected = existingClients.find(c => `${c.clientEmail}-${c.projId}` === uniqueKey);
    
    if (selected) {
      setClientEmail(selected.clientEmail);
      setClientName(selected.clientName);
      setProjectId(selected.projId);
      setProjectTitle(selected.projName);

      try {
        // ঐ ক্লায়েন্টের এই প্রজেক্টের আগের কয়টি ইনভয়েস আছে তা চেক করা
        const res = await axios.get(`${API_URL}/invoices?clientEmail=${selected.clientEmail}`);
        const count = res.data.length || 0;
        const nextIns = count + 1;
        setInstallmentNo(nextIns);
        
        // অটোমেটিক ইনভয়েস আইটেম সেট করা
        setItems([{ 
          id: Date.now(), 
          name: `${nextIns}${getOrdinal(nextIns)} Installment - ${selected.projName}`, 
          rate: 0, 
          qty: 1 
        }]);
        
        toast.success(`Setting up installment #${nextIns}`);
      } catch (error) {
        setInstallmentNo(1);
      }
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const grandTotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.rate * item.qty), 0);
  }, [items]);

  const addItem = () => setItems([...items, { id: Date.now(), name: '', rate: 0, qty: 1 }]);
  const removeItem = (id: number) => items.length > 1 && setItems(items.filter(item => item.id !== id));

  // ৩. ফাইনাল ফাংশন: ইনভয়েস তৈরি + ইমেইল + প্রজেক্ট সিঙ্ক
  const handleAuthorizeAndSync = async () => {
    if (!clientEmail || items[0].name === "" || items[0].rate <= 0) {
      return toast.error("Please fill Client Info and Pricing details!");
    }

    setLoading(true);
    const mainToast = toast.loading("Processing Global Sync...");

    try {
      const payload = {
        invoiceId,
        projectId,
        clientName,
        clientEmail: clientEmail.toLowerCase().trim(),
        adminEmail: "admin@geniehack.com",
        projectTitle,
        items,
        grandTotal,
        receivedAmount: status === "Paid" ? grandTotal : 0,
        remainingDue: status === "Paid" ? 0 : grandTotal,
        status, 
        paymentType,
        installmentNo,
        currency: "USD",
        createdAt: new Date()
      };
      
      // Step A: ইনভয়েস ডাটাবেসে সেভ করা
      const res = await axios.post(`${API_URL}/invoices`, payload);

      if (res.status === 201 || res.status === 200) {
        // Step B: ব্যাকএন্ডের মাধ্যমে ইমেইল সেন্ড করা
        await axios.post(`${API_URL}/invoices/send-email`, payload);

        // Step C: প্রজেক্ট স্ট্যাটাস আপডেট করা (যদি প্রয়োজন হয়)
        if (projectId) {
          await axios.patch(`${API_URL}/projects/update-status`, { 
            projectId, 
            status: status === "Paid" ? "Active" : "Pending" 
          });
        }

        toast.success(`Authorized! Invoice sent to ${clientName}`, { id: mainToast });
        
        // ক্লিয়ার ফর্ম (ঐচ্ছিক)
        setItems([{ id: Date.now(), name: '', rate: 0, qty: 1 }]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Sync Failed! Check Server Connection.", { id: mainToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-12 font-sans text-slate-700">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[32px] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#4177BC] p-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Genie Hack Billing</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="h-1 w-12 bg-white/40 rounded-full"></span>
                        <p className="text-[10px] opacity-70 uppercase tracking-[0.4em] font-bold">Financial Settlement Core</p>
                    </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/20 text-right">
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">Invoice ID</p>
                    <p className="text-2xl font-mono font-bold">#{invoiceId}</p>
                </div>
            </div>
        </div>

        <div className="p-10">
            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Search Existing Clients</label>
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                <select 
                                    className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#4177BC] transition-all appearance-none"
                                    onChange={(e) => handleClientSelect(e.target.value)}
                                    value={`${clientEmail}-${projectId}`}
                                >
                                    <option value="">Select Client for Auto-Sync</option>
                                    {existingClients.map((c, i) => (
                                      <option key={i} value={`${c.clientEmail}-${c.projId}`}>
                                        {c.clientName} ({c.projName})
                                      </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Mapped Project</label>
                            <div className="relative">
                                <Briefcase size={18} className="absolute left-4 top-3.5 text-slate-400" />
                                <input 
                                    value={projectTitle}
                                    readOnly
                                    className="w-full pl-12 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500"
                                    placeholder="Project will auto-load"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input value={clientName} onChange={e => setClientName(e.target.value)} className="p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#4177BC]" placeholder="Client Name" />
                        <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#4177BC]" placeholder="Email Address" />
                    </div>
                </div>

                {/* Installment & Status Card */}
                <div className="bg-[#4177BC]/5 rounded-3xl p-8 border border-blue-100">
                    <div className="mb-6">
                        <p className="text-[10px] font-black text-[#4177BC] uppercase tracking-widest mb-4">Payment Tracking</p>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-blue-100">
                            <Info size={16} className="text-[#4177BC]" />
                            <span className="text-sm font-bold">Installment No: {installmentNo}</span>
                        </div>
                    </div>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payment Authority</p>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setStatus("Unpaid")}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${status === 'Unpaid' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white text-slate-400 border border-slate-100'}`}
                        >
                            <Clock size={14} className="inline mr-2" /> Unpaid
                        </button>
                        <button 
                            onClick={() => setStatus("Paid")}
                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${status === 'Paid' ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white text-slate-400 border border-slate-100'}`}
                        >
                            <CheckCircle size={14} className="inline mr-2" /> Paid
                        </button>
                    </div>
                </div>
            </div>

            {/* Line Items */}
            <div className="mb-10">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Settlement Items</h3>
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl group transition-all hover:border-[#4177BC]/30">
                            <div className="flex-grow w-full">
                                <input 
                                    className="w-full bg-transparent font-bold text-slate-700 outline-none" 
                                    placeholder="Service description"
                                    value={item.name}
                                    onChange={e => {const n = [...items]; n[idx].name = e.target.value; setItems(n);}}
                                />
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2">
                                    <span className="text-[10px] font-black text-slate-400 mr-2">RATE ($)</span>
                                    <input type="number" className="w-24 bg-transparent font-bold text-center outline-none" value={item.rate} onChange={e => {const n = [...items]; n[idx].rate = Number(e.target.value); setItems(n);}} />
                                </div>
                                <div className="min-w-[100px] text-right font-black text-[#4177BC] text-lg">
                                    ${(item.rate * item.qty).toLocaleString()}
                                </div>
                                <button onClick={() => removeItem(item.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={addItem} className="mt-6 flex items-center gap-2 text-[10px] font-black text-[#4177BC] bg-blue-50 px-6 py-3 rounded-xl uppercase tracking-widest hover:bg-blue-100 transition-colors">
                    <Plus size={16} /> Add Item
                </button>
            </div>

            {/* Bottom Summary */}
            <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Billing Currency</p>
                        <p className="text-lg font-bold">USD - US Dollar</p>
                    </div>
                    <div className="h-10 w-px bg-slate-100"></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Payment Method</p>
                        <select className="bg-transparent font-bold text-sm outline-none text-[#4177BC]" value={paymentType} onChange={e => setPaymentType(e.target.value)}>
                            <option value="Full">One-time Settlement</option>
                            <option value="Milestone">Installment/Milestone</option>
                        </select>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.3em] mb-2">Total Amount Due</p>
                    <h2 className="text-4xl judson-bold text-bold text-slate-800 tracking-tighter">${grandTotal.toLocaleString()}</h2>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-end gap-4 mt-16">
                <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-10 py-5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-2xl hover:bg-slate-200 uppercase tracking-widest transition-all">
                    <Download size={18} /> Print Invoice
                </button>
                <button 
                  disabled={loading}
                  onClick={handleAuthorizeAndSync}
                  className="flex items-center justify-center gap-3 px-12 py-5 bg-[#4177BC] text-white text-[10px] font-black rounded-2xl hover:bg-blue-700 uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 disabled:opacity-50 transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
                    Authorize & Send Email
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;