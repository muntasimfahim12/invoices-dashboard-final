/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Layers, Calendar, DollarSign, 
  CheckCircle2, Clock, ShieldCheck, Briefcase, 
  User, Loader2, ArrowUpRight, Activity
} from "lucide-react"; 
import { motion } from "framer-motion";
import axios from "axios";
import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const PRIMARY = "#4177BC";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/project-details/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#4177BC] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 inter-bold">Decrypting Workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="p-12 bg-slate-50 rounded-[40px] border border-slate-100 text-center max-w-md">
          <Layers className="mx-auto text-slate-200 mb-6" size={56} />
          <h2 className="text-3xl font-bold text-[#0F172A] judson-bold mb-2">Access Denied</h2>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest inter-bold mb-8">Workspace ID is invalid or unauthorized.</p>
          <button 
            onClick={() => router.push('/client/projects')} 
            className="w-full py-5 bg-[#4177BC] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
          >
            <ArrowLeft size={16} /> Return to Workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-sans text-[#0F172A]">
      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        
        {/* 1. Navigation & Status Header */}
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.push('/client/projects')} 
            className="group flex items-center gap-3 text-slate-400 hover:text-[#4177BC] transition-colors font-black text-[10px] uppercase tracking-[0.2em] inter-bold"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </button>
          <div className="flex items-center gap-3 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
             <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest inter-bold">Live Build Sync</span>
          </div>
        </div>

        {/* 2. Hero Identity - Refined to match Overview Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10"
        >
          <div className="space-y-8 flex-1">
            <div className="flex items-center gap-5">
              <div className="p-5 bg-blue-50 text-[#4177BC] rounded-3xl border border-blue-100 shadow-sm">
                <Layers size={32} />
              </div>
              <div className="space-y-1">
                <span className="px-4 py-1.5 bg-[#0F172A] text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] inter-bold">
                  {project.status || "In Development"}
                </span>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-1 inter-bold">Ref: {String(id).slice(-8).toUpperCase()}</p>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-[#0F172A] tracking-tighter leading-[0.85] judson-bold">
              {project.name || project.title}
            </h1>

            <div className="flex flex-wrap gap-10 text-slate-400 border-t border-slate-50 pt-8">
               <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest inter-bold">
                 <User size={16} className="text-[#4177BC]"/> {project.clientName || "Authorized Client"}
               </div>
               <div className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest inter-bold">
                 <Clock size={16} className="text-[#4177BC]"/> Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
               </div>
            </div>
          </div>

          {/* Budget Widget */}
          <div className="flex flex-col items-start lg:items-end gap-3 bg-slate-50 p-12 rounded-[40px] min-w-[320px] border border-slate-100 relative overflow-hidden group">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] inter-bold relative z-10">Allocated Budget</p>
             <h2 className="text-5xl font-black text-[#4177BC] leading-none tracking-tighter inter-bold relative z-10">
               ${Number(project.budget || 0).toLocaleString()}
             </h2>
             <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase bg-white px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm relative z-10 inter-bold">
               <CheckCircle2 size={12}/> Verified Asset
             </div>
             <Activity className="absolute -bottom-6 -right-6 text-slate-200/40 group-hover:text-blue-100 transition-colors" size={140} />
          </div>
        </motion.section>

        {/* 3. Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details & Milestones */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Specification Card */}
            <div className="bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 shadow-sm space-y-10">
              <h3 className="text-2xl font-bold text-[#0F172A] judson-bold flex items-center gap-4">
                <Briefcase size={24} className="text-[#4177BC]" />
                Project Specification
              </h3>
              
              <p className="text-slate-500 font-medium text-xl leading-relaxed judson-bold">
                {project.description || "The technical documentation for this workspace is currently being processed by our engineering team."}
              </p>

              <div className="pt-12 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-5">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] inter-bold">Build Progress</p>
                      <span className="font-black text-[#4177BC] text-2xl inter-bold">{project.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${project.progress || 0}%` }} 
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-[#4177BC] rounded-full" 
                      />
                    </div>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-[32px] space-y-2 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] inter-bold">Expected Delivery</p>
                    <div className="flex items-center gap-3 font-black text-[#0F172A] text-xl tracking-tight inter-bold uppercase">
                      <Calendar size={20} className="text-[#4177BC]" />
                      {project.deadline || "TBD"}
                    </div>
                 </div>
              </div>
            </div>

            {/* Milestones Card */}
            <div className="bg-white rounded-[40px] p-10 md:p-14 border border-slate-100 shadow-sm space-y-12">
              <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-[#0F172A] judson-bold">Build Milestones</h3>
                  <span className="text-[9px] font-black text-[#4177BC] bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-widest inter-bold border border-blue-100">
                      {project.milestones?.length || 0} Phases Total
                  </span>
              </div>
              
              <div className="space-y-6">
                {project.milestones && project.milestones.length > 0 ? (
                  project.milestones.map((step: any, idx: number) => {
                    const isCompleted = idx < (project.currentStep || 0);
                    const isCurrent = idx === (project.currentStep || 0);
                    
                    return (
                      <motion.div 
                        key={idx} 
                        whileHover={{ x: 8 }}
                        className={`flex items-center gap-8 p-8 rounded-[32px] border transition-all ${isCompleted ? 'bg-emerald-50/20 border-emerald-100/50' : isCurrent ? 'bg-white border-[#4177BC] shadow-xl shadow-blue-50/50' : 'bg-white border-slate-50'}`}
                      >
                        <div className={`h-16 w-16 rounded-[20px] flex items-center justify-center font-black text-xl inter-bold ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isCurrent ? 'bg-[#4177BC] text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-300'}`}>
                          {isCompleted ? <CheckCircle2 size={28}/> : idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold text-xl judson-bold ${isCompleted ? 'text-emerald-700' : 'text-[#0F172A]'}`}>{step.name}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase mt-1.5 tracking-widest inter-bold">Allocated: ${step.amount || "0"}</p>
                        </div>
                        <div className={`text-[9px] font-black uppercase px-6 py-2.5 rounded-full border inter-bold ${isCompleted ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : isCurrent ? 'bg-blue-50 border-blue-100 text-[#4177BC]' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                          {isCompleted ? "Released" : isCurrent ? "Active Phase" : "Pending"}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-24 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                    <Clock className="mx-auto text-slate-200 mb-6" size={48} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] inter-bold">Engineering Roadmap Pending Activation</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-12">
            {/* Secure Portal Card - Dark Style like Overview secondary items */}
            <div className="bg-[#0F172A] rounded-[40px] p-10 text-white space-y-10 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
              <ShieldCheck className="absolute -top-12 -right-12 text-white/5 group-hover:text-[#4177BC]/10 transition-colors" size={240} />
              
              <h3 className="text-xl font-bold judson-bold flex items-center gap-4 relative z-10">
                <ShieldCheck size={26} className="text-[#4177BC]" />
                Secure Portal
              </h3>
              
              <div className="space-y-4 relative z-10">
                 <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm">
                   <p className="text-[9px] text-[#4177BC] font-black uppercase tracking-[0.2em] mb-3 inter-bold">Owner</p>
                   <p className="font-bold text-xl tracking-tight judson-bold truncate">{project.clientName || "Authenticated Client"}</p>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-sm">
                   <p className="text-[9px] text-[#4177BC] font-black uppercase tracking-[0.2em] mb-3 inter-bold">System Email</p>
                   <p className="font-bold text-sm truncate opacity-60 inter-bold">{project.clientEmail}</p>
                 </div>
              </div>

              <button className="w-full py-6 bg-[#4177BC] hover:bg-blue-600 rounded-[24px] font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-[#4177BC]/20 relative z-10 inter-bold">
                Request Expansion <ArrowUpRight size={18}/>
              </button>
            </div>

            {/* Financial Ledger Card */}
            <div className="bg-white rounded-[40px] p-12 border border-slate-100 text-center space-y-10 shadow-sm">
               <div className="inline-flex p-8 bg-blue-50 text-[#4177BC] rounded-[32px] shadow-inner border border-blue-100">
                 <DollarSign size={36}/>
               </div>
               <div className="space-y-4">
                  <h4 className="text-2xl font-bold text-[#0F172A] judson-bold tracking-tight">Finance Ledger</h4>
                  <p className="text-[10px] font-black text-slate-400 px-4 leading-relaxed uppercase tracking-widest inter-bold">Track all payments, tax invoices, and financial records for this build.</p>
               </div>
               <Link 
                  href="/client/invoices" 
                  className="flex items-center justify-center gap-3 text-[10px] font-black text-[#4177BC] uppercase tracking-[0.2em] bg-slate-50 py-5 rounded-2xl hover:bg-blue-50 transition-all inter-bold border border-slate-100"
               >
                  Access Ledger <ArrowUpRight size={16}/>
               </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}