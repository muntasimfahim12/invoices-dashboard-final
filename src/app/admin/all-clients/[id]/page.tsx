/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Briefcase, Receipt, DollarSign, 
  ExternalLink, ChevronRight, ShieldCheck, Mail, Globe, MapPin, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  X, Plus, Calendar, Target, StickyNote, Copy, CheckCircle2
} from "lucide-react";
import Link from "next/link";

type Params = Promise<{ id: string }>;

export default function ClientDetailsPage(props: { params: Params }) {
  const params = use(props.params);
  const clientId = params.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock data - Injected with Milestones & Admin Notes from your create form
  const clientData = {
    id: clientId,
    name: "Infinity Wellness",
    email: "contact@infinity.com",
    address: "Gulshan, Dhaka, BD",
    status: "Active",
    totalPaid: 11300,
    totalDue: 1200,
    adminNotes: "Client prefers communication via WhatsApp. Serious about the Q1 deadline.",
    projects: [
      { 
        id: "P-1", 
        name: "E-commerce Website", 
        budget: 2000, 
        type: "Installment", 
        status: "Active",
        milestones: [
          { title: "UI/UX Design", amount: 500, status: "Paid", date: "10 Jan 2024" },
          { title: "Frontend Dev", amount: 700, status: "Pending", date: "25 Jan 2024" },
          { title: "Backend & Launch", amount: 800, status: "Pending", date: "10 Feb 2024" },
        ]
      },
      { id: "P-2", name: "Monthly SEO", budget: 500, type: "Monthly", status: "Active" }
    ]
  };

  const copyPassword = () => {
    navigator.clipboard.writeText("TempPass123!"); // Example pass
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 ml-0 md:ml-72 min-h-screen bg-[#F8FAFC] pb-24 md:pb-8">
      
      {/* Navigation Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/all-clients">
            <motion.button whileHover={{ x: -5 }} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 shadow-sm">
                <ArrowLeft size={24} />
            </motion.button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{clientData.name}</h1>
                <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-green-100">{clientData.status}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
                <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5"><Mail size={14}/> {clientData.email}</p>
                <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5"><MapPin size={14}/> {clientData.address}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
           <button onClick={copyPassword} className="px-6 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-[#4177BC] transition-all flex items-center gap-2">
             {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
             {copied ? "Copied!" : "Copy Password"}
           </button>
           <button className="px-8 py-4 bg-[#4177BC] text-white rounded-[22px] text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-blue-100 hover:-translate-y-1 transition-all">
             <ExternalLink size={16} /> Open Portal
           </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <DetailCard title="Total Revenue" value={`$${clientData.totalPaid}`} icon={<DollarSign/>} variant="blue" />
        <DetailCard title="Outstanding" value={`$${clientData.totalDue}`} icon={<Receipt/>} variant="orange" />
        <DetailCard title="Projects" value={clientData.projects.length} icon={<Briefcase/>} variant="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[35px] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-3">
                <Globe size={22} className="text-[#4177BC]" /> Business Projects
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] font-black text-white bg-[#4177BC] px-6 py-4 rounded-2xl uppercase tracking-[0.1em] flex items-center gap-2 transition-all shadow-xl shadow-slate-200"
              >
                <Plus size={16} /> Create Project
              </button>
            </div>
            
            <div className="space-y-6">
              {clientData.projects.map((project) => (
                <div key={project.id} className="p-6 bg-[#FBFDFF] border border-slate-50 rounded-[32px] hover:border-blue-100 transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <div>
                            <h4 className="font-black text-slate-700 text-lg mb-1">{project.name}</h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="text-[#4177BC] bg-blue-50 px-2 py-0.5 rounded-md">{project.type}</span>
                                <span className="font-black text-slate-600">${project.budget} Total</span>
                            </div>
                       </div>
                       <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4177BC] transition-all"><ChevronRight size={18}/></button>
                    </div>

                    {/* Milestone Roadmap if Installment */}
                    {project.milestones && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-6 border-t border-slate-100">
                        {project.milestones.map((m, i) => (
                          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1 h-full ${m.status === 'Paid' ? 'bg-green-500' : 'bg-orange-400'}`} />
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{m.date}</p>
                            <h5 className="text-xs font-black text-slate-700">{m.title}</h5>
                            <p className="text-sm font-black text-slate-900 mt-2">${m.amount}</p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Security & Private Notes */}
        <div className="space-y-6">
            {/* Admin Notes Card */}
            <div className="bg-white border border-slate-100 rounded-[35px] p-8 shadow-sm">
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <StickyNote size={14} className="text-orange-500" /> Internal Admin Notes
                </h3>
                <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                        &ldquo;{clientData.adminNotes}&ldquo;
                    </p>
                </div>
                <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase hover:bg-slate-50 transition-all">
                    Edit Notes
                </button>
            </div>

            {/* Security Sidebar */}
            <div className="bg-slate-900 rounded-[35px] p-8 text-white shadow-2xl shadow-slate-200">
                <h3 className="font-black text-blue-400 text-[10px] uppercase tracking-[0.2em] mb-8">Portal Security</h3>
                <div className="space-y-8">
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-xl"><ShieldCheck className="text-blue-400" size={20} /></div>
                      <div>
                        <p className="text-sm font-black mb-1">Access Control</p>
                        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Portal active for ID: {clientId}.</p>
                      </div>
                   </div>
                   <div className="space-y-3">
                       <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all">Reset Password</button>
                       <button className="w-full py-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Disable Access</button>
                   </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- CREATE PROJECT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99]" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 m-auto w-full max-w-xl h-fit bg-white rounded-[40px] shadow-2xl z-[100] overflow-hidden border border-white">
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Project</h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Assign to {clientData.name}</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
                </div>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-4 text-slate-300" size={18} />
                      <input type="text" placeholder="e.g. Modern Portfolio Design" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-100 outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-4 text-slate-300" size={18} />
                        <input type="number" placeholder="5000" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-100 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Type</label>
                      <div className="relative">
                        <Target className="absolute left-4 top-4 text-slate-300" size={18} />
                        <select className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-100 outline-none appearance-none cursor-pointer">
                          <option>Installment</option>
                          <option>Monthly</option>
                          <option>One-time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-[#4177BC] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:-translate-y-1 transition-all">Confirm & Create</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailCard({ title, value, icon, variant }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-7 rounded-[35px] border border-slate-100 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${variant === 'blue' ? 'bg-[#4177BC]' : 'bg-orange-500'}`} />
      <div className={`w-12 h-12 rounded-[18px] mb-5 flex items-center justify-center ${variant === 'blue' ? 'bg-blue-50 text-[#4177BC]' : 'bg-orange-50 text-orange-600'}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
    </motion.div>
  );
}