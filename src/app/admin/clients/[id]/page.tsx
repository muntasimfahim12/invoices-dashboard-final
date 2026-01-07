/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { ArrowLeft, Mail, MapPin, Plus, FileText, Edit3, UserMinus, X, DollarSign, CheckCircle2, Layout, Info } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClientDetails({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"one-time" | "installments">("one-time");
  const [totalValue, setTotalValue] = useState("");
  const [installments, setInstallments] = useState("12");

  const monthlyAmount = totalValue && paymentType === "installments" 
    ? (parseFloat(totalValue) / parseInt(installments)).toFixed(2) 
    : totalValue;

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-10 px-4 sm:px-0 relative">
      
      {/* Top Navigation */}
      <Link href="/admin/clients" className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-blue font-bold text-[10px] uppercase tracking-[0.2em] transition-colors mb-2">
        <ArrowLeft size={14} /> Client Directory
      </Link>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[1.2rem] bg-slate-900 flex items-center justify-center text-3xl text-white font-black italic shadow-lg shadow-slate-200">
              T
            </div>
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter leading-none">Tanvir Alam</h1>
                <span className="bg-blue-50 text-brand-blue text-[8px] font-black px-2 py-0.5 rounded-full uppercase border border-brand-blue/10">Verified</span>
              </div>
              <p className="text-slate-400 font-bold text-xs mt-1 italic uppercase tracking-tighter">TechHive Ltd • ID: {id}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-3">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <Mail size={12} className="text-brand-blue" /> tanvir@techhive.com
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  <MapPin size={12} className="text-brand-blue" /> Sylhet, BD
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 font-black text-[10px] text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all">
              <Edit3 size={14} /> Edit
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-100 font-black text-[10px] text-rose-600 uppercase tracking-widest hover:bg-rose-100 transition-all">
              <UserMinus size={14} /> Disable
            </button>
          </div>
        </div>
      </div>

      {/* Stats & Projects Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[{ label: "Total Value", val: "$12,400", color: "text-slate-900" }, { label: "Received", val: "$8,500", color: "text-green-600" }, { label: "Due Balance", val: "$3,900", color: "text-rose-600" }].map((item, i) => (
          <div key={i} className="bg-white p-4 sm:p-5 rounded-[1.2rem] border border-slate-100 shadow-sm text-center sm:text-left transition-all hover:border-brand-blue/20">
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
            <h2 className={`text-sm sm:text-2xl font-[1000] mt-1 tracking-tighter ${item.color}`}>{item.val}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <div className="h-4 w-1 bg-brand-blue rounded-full"></div> Projects
          </h3>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-brand-blue text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-brand-blue/20 flex items-center gap-2 active:scale-95 transition-all"
          >
            <Plus size={14} /> New Project
          </button>
        </div>
        
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-blue border border-slate-100 shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-black text-slate-900 text-xs sm:text-sm uppercase truncate">E-Commerce Website Build</p>
              <p className="text-[8px] font-black text-brand-orange uppercase mt-1">12 Inst. • Jan 15 Due</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm sm:text-lg font-black text-slate-900 leading-none">$2,400</p>
            <span className="text-[7px] font-black text-green-600 uppercase">Active</span>
          </div>
        </div>
      </div>

      {/* --- Professional Modal (Project Form) --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with strong blur */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsFormOpen(false)} />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-black text-brand-blue uppercase tracking-[0.3em] block mb-1">Project Engine</span>
                <h2 className="text-2xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">New Initiative</h2>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-full">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Project Title</label>
                  <input type="text" placeholder="e.g. NextGen Web Platform" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                  <div className="relative">
                    <select className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-xs font-bold appearance-none outline-none focus:bg-white transition-all">
                      <option>Web Development</option>
                      <option>UI/UX Design</option>
                      <option>Digital Marketing</option>
                    </select>
                    <Layout className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commencement Date</label>
                  <input type="date" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-xs font-bold outline-none focus:bg-white transition-all" />
                </div>
              </div>

              {/* Professional Dark Budget Card */}
              <div className="p-6 rounded-4xl bg-slate-900 text-white shadow-xl space-y-5">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Valuation</label>
                    <div className="flex items-center">
                      <span className="text-2xl font-black text-slate-600 mr-1">$</span>
                      <input 
                        type="number" value={totalValue} onChange={(e) => setTotalValue(e.target.value)} placeholder="0.00"
                        className="bg-transparent border-none text-3xl font-black focus:ring-0 p-0 placeholder:text-slate-800 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex bg-slate-800/50 p-1 rounded-xl h-fit">
                    <button onClick={() => setPaymentType("one-time")} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${paymentType === "one-time" ? 'bg-white text-slate-900' : 'text-slate-500'}`}>Fixed</button>
                    <button onClick={() => setPaymentType("installments")} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${paymentType === "installments" ? 'bg-white text-slate-900' : 'text-slate-500'}`}>Instalment</button>
                  </div>
                </div>

                {paymentType === "installments" && (
                  <div className="pt-5 border-t border-slate-800 flex justify-between items-center animate-in fade-in duration-500">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration Cycle</p>
                      <select value={installments} onChange={(e) => setInstallments(e.target.value)} className="bg-transparent text-lg font-black text-brand-blue outline-none">
                        <option value="3">3 Months</option>
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                      </select>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Monthly Commitment</p>
                      <p className="text-2xl font-black text-brand-blue">${monthlyAmount}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Scope Brief</label>
                <textarea rows={3} placeholder="Key deliverables and terms..." className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm font-medium focus:bg-white outline-none transition-all resize-none" />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
              <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-brand-blue hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3">
                <CheckCircle2 size={20} /> Deploy Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}