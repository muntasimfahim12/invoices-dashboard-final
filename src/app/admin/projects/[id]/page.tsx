/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, ArrowLeft, Target, Briefcase, DollarSign, Calendar, 
  Trash2, Send, Loader2, ToggleRight, ToggleLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function CreateProject() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    clientId: "", title: "", description: "", totalBudget: "", 
    paymentType: "Installment Based", autoSequential: true
  });
  const [milestones, setMilestones] = useState([
    { id: Date.now(), name: "Initial Advance", amount: "", dueDate: "" }
  ]);

  useEffect(() => {
    axios.get(`${API_BASE}/clinets`).then(res => setClients(res.data)).catch(err => console.log(err));
  }, []);

  const addMilestone = () => setMilestones([...milestones, { id: Date.now(), name: "", amount: "", dueDate: "" }]);
  const removeMilestone = (id: number) => setMilestones(milestones.filter(m => m.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE}/projects`, { ...formData, milestones });
      toast.success("Project Initiated!");
      router.push("/admin/projects");
    } catch (err) { toast.error("Deployment failed."); } 
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-white p-4 lg:p-8 font-sans text-slate-900">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-xl p-4 rounded-4xl border border-slate-50 sticky top-4 z-50">
          <button onClick={() => router.back()} className="flex items-center gap-3 px-6 py-3 rounded-2xl text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-100">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 px-6 py-3 bg-blue-50/50 rounded-2xl">
             <Target size={14} className="text-[#4177BC]"/>
             <span className="text-[10px] font-black uppercase text-[#4177BC] tracking-tighter">Drafting Phase</span>
          </div>
        </nav>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Information */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/30">
              <h2 className="text-3xl font-bold text-slate-900 judson-bold italic mb-8 flex items-center gap-4">
                <Briefcase className="text-[#4177BC]" size={32} /> Architectural <span className="text-[#4177BC] not-italic font-sans uppercase text-xl">Identity</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Assign Stakeholder</label>
                  <select required onChange={(e)=>setFormData({...formData, clientId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl font-bold outline-none appearance-none cursor-pointer">
                    <option value="">Choose Client...</option>
                    {clients.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Project Nomenclature</label>
                  <input required onChange={(e)=>setFormData({...formData, title: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-3xl font-bold outline-none" placeholder="e.g. Modern Villa Design" />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Project Brief & Deliverables</label>
                <textarea onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-[2rem] font-medium outline-none min-h-40" placeholder="Define the project scope..." />
              </div>
            </motion.div>

            {/* Milestones Grid */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/30">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 judson-bold italic">Budget <span className="text-[#4177BC] not-italic font-sans uppercase text-lg">Milestones</span></h2>
                <button type="button" onClick={addMilestone} className="w-12 h-12 bg-blue-50 text-[#4177BC] rounded-2xl flex items-center justify-center hover:bg-[#4177BC] hover:text-white transition-all shadow-lg shadow-blue-50">
                  <Plus size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {milestones.map((m, index) => (
                    <motion.div key={m.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="flex flex-col md:row items-center gap-4 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group">
                       <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[10px] text-slate-300 border border-slate-100">{index + 1}</span>
                       <input placeholder="Phase Name" className="flex-1 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-blue-50" />
                       <input placeholder="Amount" className="w-full md:w-32 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none" />
                       <input type="date" className="w-full md:w-44 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase" />
                       <button type="button" onClick={()=>removeMilestone(m.id)} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Financials & Action */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              
              <h3 className="text-xl font-bold judson-bold italic mb-8 flex items-center gap-3 text-[#EB9C2C]"><DollarSign size={20}/> Financial Control</h3>
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Total Project Valuation</label>
                  <input type="number" onChange={(e)=>setFormData({...formData, totalBudget: e.target.value})} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold outline-none focus:border-[#4177BC] text-white" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Payment Logic</label>
                  <select onChange={(e)=>setFormData({...formData, paymentType: e.target.value})} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold outline-none cursor-pointer">
                    <option className="bg-slate-800" value="Installment Based">Installment Based</option>
                    <option className="bg-slate-800" value="Full Payment">Full Payment</option>
                  </select>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Sequential</p>
                    <p className="text-[9px] text-slate-500 mt-1">Triggers next invoice upon payment</p>
                  </div>
                  <button type="button" onClick={()=>setFormData({...formData, autoSequential: !formData.autoSequential})}>
                    {formData.autoSequential ? <ToggleRight size={40} className="text-blue-400"/> : <ToggleLeft size={40} className="text-slate-600"/>}
                  </button>
                </div>

                <motion.button
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-[#4177BC] hover:bg-[#EB9C2C] text-white rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                  Deploy Project
                </motion.button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}