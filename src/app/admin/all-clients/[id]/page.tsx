/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Briefcase, Receipt, DollarSign,
  ChevronRight, ShieldCheck, Mail, MapPin,
  X, Plus, Target, StickyNote, Copy, CheckCircle2, Calendar, Trash2, Globe, ExternalLink
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

type Params = Promise<{ id: string }>;

export default function ClientDetailsPage(props: { params: Params }) {
  const params = use(props.params);
  const clientId = params.id;

  const [clientData, setClientData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [milestones, setMilestones] = useState([{ title: "", amount: "", date: "" }]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/clinets/${clientId}`);
      setClientData(response.data);
    } catch (error) {
      console.error("Error fetching client details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const addMilestoneField = () => setMilestones([...milestones, { title: "", amount: "", date: "" }]);
  const removeMilestoneField = (index: number) => setMilestones(milestones.filter((_, i) => i !== index));
  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    (updated[index] as any)[field] = value;
    setMilestones(updated);
  };

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const newProjectId = `P-${Math.floor(Math.random() * 9000) + 1000}`;

    const newProject = {
      projectId: newProjectId,
      name: formData.get("projectName"),
      budget: Number(formData.get("budget")),
      type: formData.get("type"),
      status: "Active",
      milestones: milestones.map(m => ({
        ...m,
        amount: Number(m.amount),
        status: "Unpaid"
      }))
    };

    try {
      const updatedProjects = [...(clientData.projects || []), newProject];
      await axios.put(`${API_BASE}/clinets/${clientId}`, {
        projects: updatedProjects,
        activeProjects: updatedProjects.length
      });

      setIsModalOpen(false);
      setMilestones([{ title: "", amount: "", date: "" }]);
      fetchClientDetails();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(clientData?.password || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-200/50 rounded-2xl ${className}`} />
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-start gap-5">
            <Link href="/admin/all-clients">
              <motion.button 
                whileHover={{ x: -4 }} 
                className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <div className="space-y-1">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                      {clientData?.name}
                    </h1>
                    <span className="hidden sm:inline-block px-3 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-200">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500">
                    <span className="flex items-center gap-1.5 text-xs font-semibold"><Mail size={14} /> {clientData?.email}</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold"><MapPin size={14} /> {clientData?.address}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={copyPassword} 
            className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-700 uppercase tracking-widest shadow-sm hover:border-[#4177BC] transition-all"
          >
            {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} className="group-hover:text-[#4177BC]" />}
            {copied ? "Copied" : "Portal Credentials"}
          </motion.button>
        </header>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <DetailCard title="Total Investment" value={`$${clientData?.totalPaid || 0}`} icon={<DollarSign />} color="#4177BC" />
          <DetailCard title="Pending Balance" value={`$${clientData?.totalDue || 0}`} icon={<Receipt />} color="#f97316" />
          <DetailCard title="Active Projects" value={clientData?.projects?.length || 0} icon={<Briefcase />} color="#4177BC" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-[#4177BC] rounded-xl">
                    <Globe size={22} />
                  </div>
                  <h3 className="font-black text-slate-800 text-xl">Project Portfolio</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="w-full sm:w-auto px-6 py-4 bg-[#4177BC] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#345f97] transition-all shadow-xl shadow-blue-100"
                >
                  <Plus size={16} /> Add New Project
                </button>
              </div>

              <div className="space-y-6">
                {clientData?.projects?.map((project: any, idx: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={project.projectId || idx} 
                    className="group p-6 bg-[#FBFDFF] border border-slate-100 rounded-[35px] hover:border-blue-200 hover:bg-white transition-all hover:shadow-lg hover:shadow-slate-100"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-black text-slate-800 text-lg group-hover:text-[#4177BC] transition-colors">{project.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.type}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-[11px] font-black text-[#4177BC]">${project.budget} Total Budget</span>
                        </div>
                      </div>
                      <div className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-[#4177BC] transition-colors">
                        <ExternalLink size={18} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.milestones?.map((m: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between h-24 relative overflow-hidden">
                           <div className={`absolute left-0 top-0 bottom-0 w-1 ${i === 0 ? 'bg-[#4177BC]' : 'bg-slate-200'}`} />
                           <p className="text-[9px] font-black text-slate-400 uppercase">{m.date}</p>
                           <h5 className="text-xs font-bold text-slate-700 truncate pr-2">{m.title}</h5>
                           <p className="text-sm font-black text-slate-900 mt-auto">${m.amount}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {(!clientData?.projects || clientData.projects.length === 0) && (
                  <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[40px]">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No projects launched yet</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <StickyNote size={14} className="text-orange-500" /> Private Admin Notes
              </h3>
              <div className="p-5 bg-orange-50/30 rounded-3xl border border-orange-100/50">
                <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
                  {clientData?.adminNotes || "Start adding notes about this client to keep track of preferences."}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4177BC] opacity-10 blur-3xl -mr-16 -mt-16" />
              <h3 className="font-black text-blue-400 text-[10px] uppercase tracking-widest mb-8">Security Audit</h3>
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl"><ShieldCheck className="text-blue-400" size={20} /></div>
                  <div>
                    <p className="text-sm font-bold">Portal Access</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: {clientId.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-[#4177BC] hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Reset Client Password
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* MODERN PROJECT MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsModalOpen(false)} 
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99]" 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                className="fixed inset-4 m-auto max-w-2xl h-fit max-h-[90vh] bg-white rounded-[45px] shadow-2xl z-[100] overflow-hidden flex flex-col"
              >
                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Project</h2>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Configure billing & milestones</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleAddProject} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Project Name</label>
                        <input name="projectName" required type="text" placeholder="e.g. Mobile App" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-100 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Budget ($)</label>
                        <input name="budget" required type="number" placeholder="0.00" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 ring-blue-100 outline-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Billing Type</label>
                      <div className="relative">
                        <select name="type" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold appearance-none cursor-pointer focus:ring-2 ring-blue-100 outline-none">
                          <option value="Installment">Installment Based</option>
                          <option value="Monthly">Monthly Retainer</option>
                          <option value="One-time">One-time Payment</option>
                        </select>
                        <Target className="absolute right-6 top-4 text-slate-300 pointer-events-none" size={18} />
                      </div>
                    </div>

                    {/* Milestone Section */}
                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-2xl">
                        <h4 className="text-[11px] font-black text-[#4177BC] uppercase tracking-widest">Payment Milestones</h4>
                        <button type="button" onClick={addMilestoneField} className="px-4 py-2 bg-[#4177BC] text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 hover:bg-blue-600 transition-colors">
                          <Plus size={14} /> Add Step
                        </button>
                      </div>

                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {milestones.map((m, index) => (
                          <div key={index} className="group p-5 bg-white border border-slate-100 rounded-[28px] space-y-4 relative hover:border-blue-100 transition-all">
                            {milestones.length > 1 && (
                              <button type="button" onClick={() => removeMilestoneField(index)} className="absolute -top-2 -right-2 p-1.5 bg-white shadow-md text-red-400 rounded-full hover:text-red-600 border border-slate-50">
                                <Trash2 size={14} />
                              </button>
                            )}
                            <div className="flex flex-col md:flex-row gap-4">
                              <input value={m.title} onChange={(e) => updateMilestone(index, 'title', e.target.value)} required placeholder="Milestone Name" className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold border-none outline-none focus:ring-1 ring-blue-200" />
                              <div className="flex gap-2">
                                <input value={m.amount} onChange={(e) => updateMilestone(index, 'amount', e.target.value)} required type="number" placeholder="Amount" className="w-24 px-4 py-3 bg-slate-50 rounded-xl text-xs font-bold border-none outline-none focus:ring-1 ring-blue-200" />
                                <input value={m.date} onChange={(e) => updateMilestone(index, 'date', e.target.value)} required type="date" className="w-32 px-4 py-3 bg-slate-50 rounded-xl text-[10px] font-bold border-none outline-none focus:ring-1 ring-blue-200" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4.5 bg-slate-50 text-slate-500 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors">Cancel</button>
                      <button disabled={isSubmitting} type="submit" className="flex-[2] py-4.5 bg-[#4177BC] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:shadow-2xl hover:-translate-y-0.5 transition-all">
                        {isSubmitting ? "Processing..." : "Launch Project"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DetailCard({ title, value, icon, color }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }} 
      className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group"
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] -mr-10 -mt-10 rounded-full group-hover:scale-110 transition-transform duration-500" 
        style={{ backgroundColor: color }} 
      />
      <div 
        className="w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:rotate-12"
        style={{ backgroundColor: `${color}10`, color: color }}
      >
        {React.cloneElement(icon, { size: 26 })}
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
    </motion.div>
  );
}