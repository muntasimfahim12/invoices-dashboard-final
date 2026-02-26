/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Trash2, Download, Briefcase, 
  Loader2, Search, CheckCircle, Clock, 
  Info, Mail, CreditCard, Calendar, Percent
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
  const [method, setMethod] = useState('Stripe');
  const [dueDate, setDueDate] = useState(new Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0];
  })[0]);

  // Form States
  const [clientDetails, setClientDetails] = useState({ id: '', name: '', email: '' });
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [milestonesSnapshot, setMilestonesSnapshot] = useState<any[]>([]); // For Backend logic
  const [items, setItems] = useState([{ id: Date.now(), name: '', rate: 0, qty: 1 }]);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState('Milestone');

  // ১. ক্লায়েন্ট এবং প্রজেক্ট ডেটা লোড করা
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await axios.get(`${API_URL}/clinets`); // আপনার ব্যাকএন্ড স্পেলিং অনুযায়ী
        if (res.data && Array.isArray(res.data)) {
          const clientProjectList: any[] = [];
          res.data.forEach((client: any) => {
            if (client.projects && client.projects.length > 0) {
              client.projects.forEach((proj: any) => {
                clientProjectList.push({
                  clientId: client._id,
                  clientName: client.name,
                  clientEmail: client.email,
                  projId: proj._id,
                  projName: proj.name,
                  milestones: proj.milestones || [] 
                });
              });
            }
          });
          setExistingClients(clientProjectList);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load clients.");
      }
    };
    fetchInitialData();
  }, []);

  const handleClientSelect = async (uniqueKey: string) => {
    const selected = existingClients.find(c => `${c.clientEmail}-${c.projId}` === uniqueKey);
    
    if (selected) {
      setClientDetails({ id: selected.clientId, name: selected.clientName, email: selected.clientEmail });
      setProjectId(selected.projId);
      setProjectTitle(selected.projName);
      setMilestonesSnapshot(selected.milestones);

      try {
        const res = await axios.get(`${API_URL}/invoices?projectId=${selected.projId}`);
        const count = res.data.length || 0;
        const nextIns = count + 1;
        setInstallmentNo(nextIns);
        
        setItems([{ 
          id: Date.now(), 
          name: `${nextIns}${getOrdinal(nextIns)} Installment - ${selected.projName}`, 
          rate: 0, 
          qty: 1 
        }]);
        
        toast.success(`Project ${selected.projName} Selected`);
      } catch (error) {
        setInstallmentNo(1);
      }
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  // ক্যালকুলেশন
  const subTotal = useMemo(() => items.reduce((acc, item) => acc + (item.rate * item.qty), 0), [items]);
  const grandTotal = useMemo(() => {
    const afterDiscount = subTotal - discount;
    const taxAmount = (afterDiscount * tax) / 100;
    return afterDiscount + taxAmount;
  }, [subTotal, tax, discount]);

  const addItem = () => setItems([...items, { id: Date.now(), name: '', rate: 0, qty: 1 }]);
  const removeItem = (id: number) => items.length > 1 && setItems(items.filter(item => item.id !== id));

  // ৩. মেইন ফাংশন: Authorize & Sync
  const handleAuthorizeAndSync = async () => {
    if (!clientDetails.email || items[0].rate <= 0) {
      return toast.error("Please provide pricing and client details!");
    }

    setLoading(true);
    const mainToast = toast.loading("Syncing with Payment Gateway & Database...");

    try {
      const payload = {
        invoiceId,
        projectId,
        milestoneId: `M-${installmentNo}`, // Mapping for backend
        amount: grandTotal,
        method,
        clientDetails,
        milestonesSnapshot, // All project milestones for checking unpaid status
        projectTitle,
        items,
        tax,
        discount,
        status, 
        paymentType,
        installmentNo,
        dueDate,
        currency: "USD",
        createdAt: new Date()
      };
      
      // Step A: ইনভয়েস সেভ এবং ব্যাকএন্ড লজিক ট্রিগার (HandleUpdatePayment)
      const res = await axios.post(`${API_URL}/invoices`, payload);

      if (res.status === 201 || res.status === 200) {
        // Step B: ইমেইল এবং PDF ইনভয়েস পাঠানো (Nodemailer Logic)
        await axios.post(`${API_URL}/invoices/send-email`, payload);

        toast.success(`Invoice Authorized & Sent to ${clientDetails.name}`, { id: mainToast });
        
        // Reset Form
        setItems([{ id: Date.now(), name: '', rate: 0, qty: 1 }]);
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Sync Failed! Internal Server Error.", { id: mainToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8 font-sans text-slate-700">
      <Toaster position="top-center" />
      
      <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-[2.5rem] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#4177BC] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">Genie Billing</h1>
              <p className="text-[11px] opacity-80 uppercase tracking-[0.5em] font-bold mt-2">Automated Financial Sync v2.0</p>
            </div>
            <div className="bg-white/15 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/20">
              <p className="text-[10px] font-black opacity-60 uppercase mb-1">Generated Invoice ID</p>
              <p className="text-2xl font-mono font-bold">#{invoiceId}</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Main Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Client Discovery</label>
                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-4 text-slate-400" />
                    <select 
                      className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500/20 appearance-none"
                      onChange={(e) => handleClientSelect(e.target.value)}
                      value={`${clientDetails.email}-${projectId}`}
                    >
                      <option value="">Select Existing Project</option>
                      {existingClients.map((c, i) => (
                        <option key={i} value={`${c.clientEmail}-${c.projId}`}>
                          {c.clientName} - {c.projName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Due Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-4 text-slate-400" />
                    <input 
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    value={clientDetails.name} 
                    onChange={e => setClientDetails({...clientDetails, name: e.target.value})} 
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#4177BC]" 
                    placeholder="Client Full Name" 
                />
                <input 
                    value={clientDetails.email} 
                    onChange={e => setClientDetails({...clientDetails, email: e.target.value})} 
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#4177BC]" 
                    placeholder="Client Email Address" 
                />
              </div>
            </div>

            {/* Status & Method Sidebar */}
            <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Authorize Status</p>
                <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
                  <button onClick={() => setStatus("Unpaid")} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${status === 'Unpaid' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400'}`}>Unpaid</button>
                  <button onClick={() => setStatus("Paid")} className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${status === 'Paid' ? 'bg-green-500 text-white shadow-md' : 'text-slate-400'}`}>Paid</button>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">Payment Method</p>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  <select 
                    value={method} 
                    onChange={e => setMethod(e.target.value)}
                    className="w-full pl-11 p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none"
                  >
                    <option value="Stripe">Stripe (Card)</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="Crypto">USDT / Crypto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billable Items</h3>
              <div className="h-px flex-grow mx-4 bg-slate-100"></div>
              <button onClick={addItem} className="flex items-center gap-2 text-[10px] font-black text-[#4177BC] hover:opacity-70 transition-all uppercase">
                <Plus size={14} /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 bg-white border border-slate-100 p-4 rounded-2xl group hover:shadow-lg transition-all">
                  <input 
                    className="flex-grow bg-transparent font-bold text-slate-700 outline-none w-full" 
                    placeholder="Description of service or milestone"
                    value={item.name}
                    onChange={e => {const n = [...items]; n[idx].name = e.target.value; setItems(n);}}
                  />
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 mr-2">USD</span>
                      <input type="number" className="w-20 bg-transparent font-bold text-center outline-none" value={item.rate} onChange={e => {const n = [...items]; n[idx].rate = Number(e.target.value); setItems(n);}} />
                    </div>
                    <div className="min-w-[80px] text-right font-black text-[#4177BC]">
                      ${(item.rate * item.qty).toLocaleString()}
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 pt-10 border-t border-slate-100">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Tax (%)</p>
                        <div className="relative">
                            <Percent size={14} className="absolute left-4 top-3.5 text-slate-400" />
                            <input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="w-full pl-10 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1">Discount ($)</p>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                            <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full pl-10 p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#4177BC] rounded-3xl p-8 text-white flex justify-between items-center shadow-2xl shadow-blue-200">
              <div>
                <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mb-1">Total Due</p>
                <p className="text-4xl font-bold tracking-tighter">${grandTotal.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black opacity-60 uppercase mb-1">Type</p>
                <select className="bg-white/10 border-none font-bold text-sm rounded-lg p-1 outline-none" value={paymentType} onChange={e => setPaymentType(e.target.value)}>
                    <option className="text-slate-800" value="Milestone">Milestone</option>
                    <option className="text-slate-800" value="Full">Full Pay</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-12">
            <button 
              onClick={() => window.print()} 
              className="px-8 py-4 bg-slate-100 text-slate-600 text-[10px] font-black rounded-2xl hover:bg-slate-200 uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Download size={16} /> Preview PDF
            </button>
            <button 
              disabled={loading}
              onClick={handleAuthorizeAndSync}
              className="px-12 py-4 bg-[#4177BC] text-white text-[10px] font-black rounded-2xl hover:bg-blue-700 uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
              Authorize & Sync Global
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto mt-8 px-6 flex justify-between items-center text-slate-400">
        <p className="text-[9px] font-bold uppercase tracking-widest">© 2026 Genie Hack Operations</p>
        <div className="flex gap-4">
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[9px] font-bold uppercase">System Active</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;