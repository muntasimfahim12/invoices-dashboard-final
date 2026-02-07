/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, ArrowLeft, Target, Briefcase, DollarSign, 
  Trash2, Send, Loader2, ToggleRight, ToggleLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// API URL (Make sure this matches your backend)
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

export default function CreateProject() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  
  const [formData, setFormData] = useState({
    clientId: "", 
    title: "", 
    description: "", 
    totalBudget: "", 
    paymentType: "Installment Based", 
    autoSequential: true
  });

  const [milestones, setMilestones] = useState([
    { id: Date.now(), name: "Initial Advance", amount: "", dueDate: "" }
  ]);

  // Fetch Clients for dropdown
  useEffect(() => {
    axios.get(`${API_BASE}/clinets`)
      .then(res => setClients(res.data))
      .catch(err => console.error("Client fetch error:", err));
  }, []);

  // --- Milestone Handlers ---
  const addMilestone = () => setMilestones([...milestones, { id: Date.now(), name: "", amount: "", dueDate: "" }]);
  const removeMilestone = (id: number) => setMilestones(milestones.filter(m => m.id !== id));
  
  const updateMilestone = (id: number, field: string, value: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId) return toast.error("Please select a client");
    if (milestones.length === 0 && formData.paymentType !== "Full Payment") {
        return toast.error("Please add at least one milestone");
    }

    setSubmitting(true);
    try {
      // ব্যাকএন্ডের নতুন মাস্টার এন্ডপয়েন্ট কল করা
      const response = await axios.post(`${API_BASE}/clinets/deploy-project`, { 
        ...formData, 
        milestones 
      });

      if (response.data.success) {
        toast.success("Project & First Invoice Deployed! 🚀");
        setTimeout(() => router.push("/admin/projects"), 2000);
      }
    } catch (err: any) { 
      toast.error(err.response?.data?.error || "Deployment failed."); 
    } finally { 
      setSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 lg:p-8 font-sans text-slate-900">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        
        {/* Nav */}
        <nav className="flex items-center justify-between mb-8 bg-white p-4 rounded-3xl border border-slate-100 sticky top-4 z-50 shadow-sm">
          <button onClick={() => router.back()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
             <Target size={14} className="text-[#4177BC]"/>
             <span className="text-[10px] font-black uppercase text-[#4177BC] tracking-widest">Master Deployment</span>
          </div>
        </nav>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Information Section */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <Briefcase className="text-[#4177BC]" size={24} /> 
                Project Identity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Stakeholder</label>
                  <select 
                    required 
                    value={formData.clientId}
                    onChange={(e)=>setFormData({...formData, clientId: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold outline-none focus:ring-2 ring-blue-50 transition-all"
                  >
                    <option value="">Choose Client...</option>
                    {clients.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Project Name</label>
                  <input 
                    required 
                    onChange={(e)=>setFormData({...formData, title: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold outline-none focus:ring-2 ring-blue-50" 
                    placeholder="e.g. Modern Villa Design" 
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Brief Description</label>
                <textarea 
                  onChange={(e)=>setFormData({...formData, description: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium outline-none min-h-32 focus:ring-2 ring-blue-50" 
                  placeholder="Define the scope..." 
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-bold text-slate-800">Payment Milestones</h2>
                <button type="button" onClick={addMilestone} className="p-2 bg-blue-50 text-[#4177BC] rounded-xl hover:bg-[#4177BC] hover:text-white transition-all">
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {milestones.map((m, index) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-100">{index + 1}</span>
                       <input 
                         required
                         value={m.name}
                         onChange={(e) => updateMilestone(m.id, 'name', e.target.value)}
                         placeholder="Phase Name (e.g. Booking)" 
                         className="flex-1 min-w-[150px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none" 
                       />
                       <input 
                         required
                         type="number"
                         value={m.amount}
                         onChange={(e) => updateMilestone(m.id, 'amount', e.target.value)}
                         placeholder="Amount" 
                         className="w-28 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none" 
                       />
                       <input 
                         required
                         type="date" 
                         value={m.dueDate}
                         onChange={(e) => updateMilestone(m.id, 'dueDate', e.target.value)}
                         className="w-40 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold" 
                       />
                       <button type="button" onClick={()=>removeMilestone(m.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/10">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400">
                <DollarSign size={20}/> Financials
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Budget (USD)</label>
                  <input 
                    required
                    type="number" 
                    onChange={(e)=>setFormData({...formData, totalBudget: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl font-bold outline-none focus:border-[#4177BC] text-white" 
                    placeholder="0.00" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Strategy</label>
                  <select 
                    value={formData.paymentType}
                    onChange={(e)=>setFormData({...formData, paymentType: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl font-bold outline-none cursor-pointer"
                  >
                    <option className="bg-slate-800" value="Installment Based">Installment Based</option>
                    <option className="bg-slate-800" value="Full Payment">Full Payment</option>
                  </select>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Automation</p>
                    <p className="text-[9px] text-slate-500 mt-1">Generate next invoice automatically</p>
                  </div>
                  <button type="button" onClick={()=>setFormData({...formData, autoSequential: !formData.autoSequential})}>
                    {formData.autoSequential ? <ToggleRight size={32} className="text-blue-400"/> : <ToggleLeft size={32} className="text-slate-600"/>}
                  </button>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full py-4 bg-[#4177BC] hover:bg-blue-600 disabled:bg-slate-700 text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                  {submitting ? "Deploying..." : "Launch Project"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}