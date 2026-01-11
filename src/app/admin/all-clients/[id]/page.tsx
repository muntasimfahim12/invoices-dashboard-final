/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Briefcase, Receipt, DollarSign, 
  ChevronRight, ShieldCheck, Mail, Globe, MapPin, 
  X, Plus, Target, StickyNote, Copy, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

type Params = Promise<{ id: string }>;

export default function ClientDetailsPage(props: { params: Params }) {
  const params = use(props.params);
  const clientId = params.id;

  // States
  const [clientData, setClientData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      // ব্যাকএন্ডের স্পেলিং 'clinets' এর সাথে মিল রাখা হয়েছে
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

  // নতুন প্রজেক্ট তৈরি এবং ডাটাবেসে সেভ করা
  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // ইউনিক প্রোজেক্ট আইডি তৈরি
    const newProjectId = `P-${Math.floor(Math.random() * 9000) + 1000}`;

    const newProject = {
      projectId: newProjectId,
      name: formData.get("projectName"),
      budget: Number(formData.get("budget")),
      type: formData.get("type"),
      status: "Active",
      milestones: [] 
    };

    try {
      const updatedProjects = [...(clientData.projects || []), newProject];
      
      // ব্যাকএন্ড পাথ ঠিক করা হয়েছে (PUT /clinets/:id)
      await axios.put(`${API_BASE}/clinets/${clientId}`, { 
        projects: updatedProjects,
        // প্রজেক্টের সংখ্যা অটোমেটিক আপডেট করার জন্য (যদি ব্যাকএন্ডে ইউজ করেন)
        activeProjects: updatedProjects.length 
      });
      
      setIsModalOpen(false);
      fetchClientDetails(); // ডাটা রিফ্রেশ করা
      alert("Project added successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Could not add project. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(clientData?.password || "Temp123!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-200/60 rounded-xl ${className}`} />
  );

  return (
    <div className="flex justify-center bg-[#F8FAFC] min-h-screen py-6 px-4 md:px-8">
      <div className="w-full max-w-[1400px]">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/admin/all-clients">
              <motion.button whileHover={{ x: -5 }} className="p-3 md:p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 shadow-sm">
                <ArrowLeft size={22} />
              </motion.button>
            </Link>
            <div className="flex-1">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{clientData?.name}</h1>
                    <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg shadow-green-100">
                      {clientData?.status || "Active"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <p className="text-slate-400 text-[11px] md:text-xs font-bold flex items-center gap-1.5"><Mail size={14}/> {clientData?.email}</p>
                    <p className="text-slate-400 text-[11px] md:text-xs font-bold flex items-center gap-1.5"><MapPin size={14}/> {clientData?.address}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex gap-3">
            {loading ? <Skeleton className="h-12 w-40 rounded-[22px]" /> : (
              <button onClick={copyPassword} className="w-full md:w-auto px-6 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-[#4177BC] transition-all flex items-center justify-center gap-2">
                {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy Password"}
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {loading ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-[35px]" />) : (
            <>
              <DetailCard title="Total Paid" value={`$${clientData?.totalPaid || 0}`} icon={<DollarSign/>} variant="blue" />
              <DetailCard title="Outstanding" value={`$${clientData?.totalDue || 0}`} icon={<Receipt/>} variant="orange" />
              <DetailCard title="Projects" value={clientData?.projects?.length || 0} icon={<Briefcase/>} variant="blue" />
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-[30px] md:rounded-[35px] p-6 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-3">
                  <Globe size={22} className="text-[#4177BC]" /> Business Projects
                </h3>
                {!loading && (
                  <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto text-[10px] font-black text-white bg-[#4177BC] px-6 py-4 rounded-2xl uppercase tracking-[0.1em] flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-200">
                    <Plus size={16} /> Create Project
                  </button>
                )}
              </div>
              
              <div className="space-y-6">
                {loading ? [1, 2].map((i) => <Skeleton key={i} className="h-48 w-full rounded-[32px]" />) : (
                  clientData?.projects?.map((project: any, index: number) => (
                    // ফিক্সড: key এখন ইউনিক (index অথবা projectId ব্যবহার করা হয়েছে)
                    <div key={project.projectId || index} className="p-5 md:p-6 bg-[#FBFDFF] border border-slate-50 rounded-[32px] hover:border-blue-100 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h4 className="font-black text-slate-700 text-lg mb-1">{project.name}</h4>
                                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span className="text-[#4177BC] bg-blue-50 px-2 py-0.5 rounded-md">{project.type}</span>
                                    <span className="font-black text-slate-600">${project.budget} Total</span>
                                </div>
                            </div>
                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4177BC] transition-all"><ChevronRight size={18}/></button>
                        </div>

                        {project.milestones?.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-6 border-t border-slate-100">
                            {project.milestones.map((m: any, i: number) => (
                              <div key={i} className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm relative overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1 h-full ${m.status === 'Paid' ? 'bg-green-500' : 'bg-orange-400'}`} />
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{m.date}</p>
                                <h5 className="text-xs font-black text-slate-700 truncate">{m.title}</h5>
                                <p className="text-sm font-black text-slate-900 mt-2">${m.amount}</p>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  ))
                )}
                {!loading && (!clientData?.projects || clientData.projects.length === 0) && (
                   <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-slate-100 rounded-[32px]">
                      No projects active for this client
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
              <div className="bg-white border border-slate-100 rounded-[35px] p-8 shadow-sm">
                  <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                      <StickyNote size={14} className="text-orange-500" /> Internal Admin Notes
                  </h3>
                  {loading ? <Skeleton className="h-20 w-full" /> : (
                    <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                            &ldquo;{clientData?.adminNotes || "No notes available."}&ldquo;
                        </p>
                    </div>
                  )}
              </div>

              <div className="bg-slate-600 rounded-[35px] p-8 text-white shadow-2xl shadow-slate-200">
                  <h3 className="font-black text-blue-400 text-[10px] uppercase tracking-[0.2em] mb-8">Portal Security</h3>
                  {loading ? <Skeleton className="h-32 w-full bg-slate-500" /> : (
                    <div className="space-y-8">
                       <div className="flex items-start gap-4">
                          <div className="p-3 bg-white/10 rounded-xl"><ShieldCheck className="text-blue-400" size={20} /></div>
                          <div>
                            <p className="text-sm font-black mb-1">Access Control</p>
                            <p className="text-[10px] text-slate-400 font-bold">Client ID: {clientId.slice(-6).toUpperCase()}</p>
                          </div>
                       </div>
                       <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all">Reset Password</button>
                    </div>
                  )}
              </div>
          </div>
        </div>

        {/* Modal logic updated */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99]" />
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 m-auto w-[95%] max-w-xl h-fit bg-white rounded-[30px] md:rounded-[40px] shadow-2xl z-[100] overflow-hidden border border-white">
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">New Project</h2>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Assign to {clientData?.name}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
                  </div>

                  <form onSubmit={handleAddProject} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-4 text-slate-300" size={18} />
                        <input name="projectName" required type="text" placeholder="e.g. Website Redesign" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-100 outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-4 text-slate-300" size={18} />
                          <input name="budget" required type="number" placeholder="500" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-100 outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Type</label>
                        <div className="relative">
                          <Target className="absolute left-4 top-4 text-slate-300" size={18} />
                          <select name="type" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-blue-100 outline-none appearance-none cursor-pointer">
                            <option value="Installment">Installment</option>
                            <option value="Monthly">Monthly</option>
                            <option value="One-time">One-time</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100">Cancel</button>
                      <button disabled={isSubmitting} type="submit" className="flex-[2] py-4 bg-[#4177BC] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:-translate-y-1 transition-all flex items-center justify-center">
                        {isSubmitting ? "Creating..." : "Confirm & Create"}
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

function DetailCard({ title, value, icon, variant }: any) {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-6 md:p-7 rounded-[30px] md:rounded-[35px] border border-slate-100 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 ${variant === 'blue' ? 'bg-[#4177BC]' : 'bg-orange-500'}`} />
      <div className={`w-12 h-12 rounded-[18px] mb-5 flex items-center justify-center ${variant === 'blue' ? 'bg-blue-50 text-[#4177BC]' : 'bg-orange-50 text-orange-600'}`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
    </motion.div>
  );
}