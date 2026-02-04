/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Briefcase, Receipt, DollarSign,
  ShieldCheck, Mail, MapPin, X, Plus, Target,
  CheckCircle2, Trash2, ExternalLink, Key, LayoutGrid, Zap, Fingerprint
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

type Params = Promise<{ id: string }>;

export default function ClientDetailsPage(props: { params: Params }) {
  const params = use(props.params);
  const clientId = params.id;

  // --- States ---
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Project Form State
  const [milestones, setMilestones] = useState([{ title: "", amount: "", date: "" }]);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

  // --- Fetch Logic ---
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

  useEffect(() => { fetchClientDetails(); }, [clientId]);

  // --- Milestone Functions ---
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
    const budget = Number(formData.get("budget"));
    const projectName = formData.get("projectName") as string;
    const projectType = formData.get("type");

    // প্রতিবার ইউনিক আইডি জেনারেট করার জন্য টাইমস্ট্যাম্প ব্যবহার করা হয়েছে
    const uniqueId = `INV-${Date.now().toString().slice(-6)}`;
    const projectId = `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;

    const invoiceData = {
      invoiceId: uniqueId,
      projectTitle: projectName,
      clientName: clientData?.name,
      clientEmail: clientData?.email?.toLowerCase(),
      adminEmail: "admin@geniehack.com", // আপনার অ্যাডমিন ইমেইলটি এখানে দিন
      grandTotal: budget,
      remainingDue: budget,
      currency: "$",
      status: "Unpaid",
      items: milestones.map(m => ({
        name: m.title || "Project Milestone",
        qty: 1,
        price: Number(m.amount)
      }))
    };

    try {
      // ১. ইনভয়েস তৈরি (আপনার ব্যাকএন্ডের router.post('/') এ হিট করবে)
      const invoiceRes = await axios.post(`${API_BASE}/invoices`, invoiceData);

      if (invoiceRes.status === 201 || invoiceRes.status === 200) {

        // ২. ক্লায়েন্ট প্রোফাইলে প্রজেক্ট লিস্ট আপডেট
        const newProject = {
          projectId: projectId,
          name: projectName,
          budget: budget,
          type: projectType,
          status: "Active",
          createdAt: new Date().toISOString(),
          milestones: milestones.map(m => ({
            ...m,
            amount: Number(m.amount),
            status: "Unpaid"
          }))
        };

        const updatedProjects = [...(clientData.projects || []), newProject];

        // ক্লায়েন্ট ডাটা আপডেট (আপনার ব্যাকএন্ডের PUT /clinets/:id রাউট)
        await axios.put(`${API_BASE}/clinets/${clientId}`, {
          projects: updatedProjects,
          activeProjects: updatedProjects.length,
          totalDue: (clientData.totalDue || 0) + budget
        });

        setIsModalOpen(false);
        setMilestones([{ title: "", amount: "", date: "" }]);
        fetchClientDetails(); 
        alert("✅ Project and Invoice synced successfully!");
      }
    } catch (error: any) {
      console.error("Sync Error:", error.response?.data || error.message);
      alert(`❌ Error: ${error.response?.data?.error || "Failed to add project"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
        <Fingerprint className="absolute inset-0 m-auto text-[#4177BC]" size={24} />
      </div>
      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Authenticating Access...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 lg:p-8 selection:bg-[#4177BC] selection:text-white">
      <div className="max-w-400 mx-auto">

        {/* TOP NAV */}
        <nav className="flex items-center justify-between mb-8 bg-[#FFFFFF]/50 backdrop-blur-md p-4 rounded-3xl border border-[#FFFFFF] shadow-sm">
          <Link href="/admin/all-clients">
            <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-3 px-5 py-2.5 bg-[#FFFFFF] rounded-2xl text-slate-600 font-bold text-xs shadow-sm border border-slate-100">
              <ArrowLeft size={16} /> Dashboard
            </motion.button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Status</p>
              <p className="text-[11px] font-bold text-emerald-500 flex items-center justify-end gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Sync</p>
            </div>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: IDENTITY CARD */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4177BC]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />

              <div className="relative z-10">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                  <span className="text-3xl font-bold text-[#FFFFFF] judson-bold">{clientData?.name?.charAt(0)}</span>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 tracking-tight judson-bold mb-1">{clientData?.name}</h1>
                <span className="px-3 py-1 bg-[#4177BC]/10 text-[#4177BC] text-[10px] font-black uppercase rounded-full border border-[#4177BC]/20">{clientData?.status}</span>

                <div className="mt-10 space-y-5">
                  <IdentityItem icon={<Mail size={14} />} label="Primary Email" value={clientData?.email} />
                  <IdentityItem icon={<MapPin size={14} />} label="Hailing From" value={clientData?.address} />
                  <IdentityItem icon={<ShieldCheck size={14} />} label="Client UID" value={clientId.slice(-8).toUpperCase()} />
                </div>

                <motion.button
                  onClick={() => { navigator.clipboard.writeText(clientData?.password); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-900 hover:text-[#FFFFFF] text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 flex items-center justify-center gap-2"
                >
                  {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Key size={14} />}
                  {copied ? "Copied" : "Portal Access"}
                </motion.button>
              </div>
            </div>

            <div className="bg-linear-to-br from-[#4177BC] to-[#345e96] rounded-[35px] p-8 text-[#FFFFFF] shadow-xl shadow-[#4177BC]/20 relative overflow-hidden">
              <Zap className="absolute -right-2.5 -bottom-2.5 w-32 h-32 text-white/10 rotate-12" />
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]/70 mb-2">Internal Note</p>
              <p className="text-xs leading-relaxed font-medium italic">&quot;{clientData?.adminNotes || "No briefing available."}&quot;</p>
            </div>
          </aside>

          {/* RIGHT COLUMN: STATS & PORTFOLIO */}
          <main className="lg:col-span-9 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard title="Portfolio Value" value={`$${clientData?.totalPaid || 0}`} icon={<DollarSign />} color="#4177BC" />
              <StatCard title="Outstanding" value={`$${clientData?.totalDue || 0}`} icon={<Receipt />} color="#EB9C2C" />
              <StatCard title="Active Tracks" value={clientData?.projects?.length || 0} icon={<Briefcase />} color="#0F172A" />
            </div>

            <div className="bg-[#FFFFFF] rounded-[45px] p-8 lg:p-12 border border-slate-100 shadow-sm relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 judson-bold flex items-center gap-3">
                    <LayoutGrid size={24} className="text-[#4177BC]" /> Operational Portfolio
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lifecycle Management</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#4177BC] text-[#FFFFFF] px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Plus size={16} /> New Engagement
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clientData?.projects?.map((project: any, idx: number) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx}
                    className="group p-6 bg-slate-50/50 border border-slate-100 rounded-[35px] hover:bg-[#FFFFFF] hover:border-[#4177BC]/30 transition-all duration-300"
                  >
                    <div className="flex justify-between mb-6">
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#4177BC] transition-colors">{project.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{project.type} • ID: {project.projectId}</p>
                      </div>
                      <div className="w-10 h-10 bg-[#FFFFFF] rounded-xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-[#4177BC] shadow-sm">
                        <ExternalLink size={16} />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4 p-3 bg-[#FFFFFF] rounded-2xl border border-slate-50">
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Capital</p>
                        <p className="text-xl font-bold text-slate-900 judson-bold">${project.budget}</p>
                      </div>
                      <div className="h-8 w-px bg-slate-100" />
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Milestones</p>
                        <p className="text-xl font-bold text-slate-900 judson-bold">{project.milestones?.length}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* --- ADD NEW PROJECT MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-[40px] shadow-2xl overflow-hidden"
            >
              <form onSubmit={handleAddProject}>
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Initialize Engagement</h2>
                    <p className="text-[10px] font-bold text-[#4177BC] uppercase tracking-widest mt-0.5">Project Blueprinting</p>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-[#FFFFFF] rounded-2xl transition-all shadow-sm">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Project Name</label>
                      <input name="projectName" required className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-xs font-bold focus:ring-2 ring-[#4177BC]/10 outline-none border border-transparent focus:border-[#4177BC]/30 transition-all" placeholder="Enter Title..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Total Budget ($)</label>
                      <input name="budget" type="number" required className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-xs font-bold focus:ring-2 ring-[#4177BC]/10 outline-none border border-transparent focus:border-[#4177BC]/30 transition-all" placeholder="5000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Engagement Type</label>
                    <select name="type" className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-[#4177BC]/30 transition-all appearance-none">
                      <option>Fixed Price</option>
                      <option>Monthly Subscription</option>
                      <option>Hourly Contract</option>
                    </select>
                  </div>

                  {/* Milestones */}
                  <div className="pt-6 border-t border-slate-50 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                        <Target size={14} className="text-[#4177BC]" /> Payment Milestones
                      </h4>
                      <button type="button" onClick={addMilestoneField} className="px-4 py-2 bg-[#4177BC]/10 text-[#4177BC] rounded-xl text-[10px] font-bold hover:bg-[#4177BC] hover:text-[#FFFFFF] transition-all flex items-center gap-2">
                        <Plus size={14} /> Add Phase
                      </button>
                    </div>

                    <div className="space-y-3">
                      {milestones.map((m, idx) => (
                        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={idx} className="flex gap-3 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <input value={m.title} onChange={(e) => updateMilestone(idx, 'title', e.target.value)} placeholder="Milestone Name" className="flex-2 bg-[#FFFFFF] px-4 py-2.5 rounded-xl text-[11px] font-bold outline-none border border-slate-100" />
                          <input value={m.amount} onChange={(e) => updateMilestone(idx, 'amount', e.target.value)} type="number" placeholder="$" className="flex-1 bg-[#FFFFFF] px-4 py-2.5 rounded-xl text-[11px] font-bold outline-none border border-slate-100" />
                          {milestones.length > 1 && (
                            <button type="button" onClick={() => removeMilestoneField(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 tracking-widest">Cancel</button>
                  <button disabled={isSubmitting} type="submit" className="flex-2 py-4 bg-[#4177BC] text-[#FFFFFF] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#4177BC]/20 disabled:opacity-50 flex items-center justify-center gap-3">
                    {isSubmitting ? "Processing..." : "Confirm & Launch"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-[#FFFFFF] p-6 rounded-4xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-[#4177BC]/20 transition-all">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}10`, color: color }}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 judson-bold">{value}</h3>
      </div>
    </div>
  );
}

function IdentityItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#4177BC] group-hover:bg-[#4177BC]/10 transition-colors">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{label}</p>
        <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}