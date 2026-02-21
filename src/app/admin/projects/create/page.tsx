/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { 
  Plus, ArrowLeft, Target, Briefcase, DollarSign, 
  Trash2, Send, Loader2, ToggleRight, ToggleLeft, AlertCircle, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// API URL
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

  // Default date aajker tarikh set kora hoyeche
  const [milestones, setMilestones] = useState([
    { id: Date.now(), name: "Initial Advance", amount: "", dueDate: new Date().toISOString().split('T')[0] }
  ]);

  const milestoneTotal = milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const budgetMismatch = Number(formData.totalBudget) !== milestoneTotal;

  useEffect(() => {
    axios.get(`${API_BASE}/clinets`)
      .then(res => setClients(res.data))
      .catch(err => console.error("Client fetch error:", err));
  }, []);

  const addMilestone = () => setMilestones([...milestones, { id: Date.now(), name: "", amount: "", dueDate: new Date().toISOString().split('T')[0] }]);
  const removeMilestone = (id: number) => setMilestones(milestones.filter(m => m.id !== id));
  
  const updateMilestone = (id: number, field: string, value: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId) return toast.error("Stakeholder selection is required.");
    if (budgetMismatch) return toast.error(`Budget mismatch! Total: ${formData.totalBudget}, Milestones: ${milestoneTotal}`);
    
    // Check if any milestone date is missing
    const hasEmptyDate = milestones.some(m => !m.dueDate);
    if (hasEmptyDate) return toast.error("Please set a payment unlock date for all milestones.");

    setSubmitting(true);
    try {
      // Backend-er `/projects` route-er logic onujayi data structure pathano hochhe
      const response = await axios.post(`${API_BASE}/clinets/deploy-project`, { 
        ...formData, 
        milestones: milestones.map(({ name, amount, dueDate }) => ({
          name,
          amount: Number(amount),
          dueDate: dueDate, // Backend eita "isPayable" calculate korte use korbe
          status: "Pending",
          isCompleted: false
        }))
      });

      if (response.data.success) {
        toast.success("Project Strategy Deployed Successfully! 🚀");
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
        
        {/* Navigation Bar */}
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
          
          {/* Main Content */}
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
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold outline-none focus:ring-2 ring-blue-50 transition-all cursor-pointer"
                  >
                    <option value="">Choose Client...</option>
                    {clients.map((c: any) => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Project Name</label>
                  <input 
                    required 
                    value={formData.title}
                    onChange={(e)=>setFormData({...formData, title: e.target.value})} 
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-semibold outline-none focus:ring-2 ring-blue-50" 
                    placeholder="e.g. E-commerce Platform Redesign" 
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Brief Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e)=>setFormData({...formData, description: e.target.value})} 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium outline-none min-h-32 focus:ring-2 ring-blue-50" 
                  placeholder="Define the project scope and deliverables..." 
                />
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Payment Milestones</h2>
                  <p className="text-xs text-slate-400 mt-1">Schedule payments & unlock dates</p>
                </div>
                <button type="button" onClick={addMilestone} className="p-2.5 bg-blue-50 text-[#4177BC] rounded-xl hover:bg-[#4177BC] hover:text-white transition-all shadow-sm">
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {milestones.map((m, index) => (
                    <motion.div 
                      key={m.id} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }} 
                      className="flex flex-wrap md:flex-nowrap items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group"
                    >
                       <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-100">{index + 1}</span>
                       <input 
                         required
                         value={m.name}
                         onChange={(e) => updateMilestone(m.id, 'name', e.target.value)}
                         placeholder="Phase Name" 
                         className="flex-1 min-w-[150px] px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#4177BC]" 
                       />
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                         <input 
                           required
                           type="number"
                           value={m.amount}
                           onChange={(e) => updateMilestone(m.id, 'amount', e.target.value)}
                           placeholder="0.00" 
                           className="w-28 pl-7 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-[#4177BC]" 
                         />
                       </div>
                       
                       {/* Date Picker Input (Critical for Unlock Logic) */}
                       <div className="relative flex items-center">
                         <Calendar size={14} className="absolute left-3 text-[#4177BC] pointer-events-none" />
                         <input 
                           required
                           type="date" 
                           value={m.dueDate}
                           onChange={(e) => updateMilestone(m.id, 'dueDate', e.target.value)}
                           className="w-40 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#4177BC] focus:ring-2 ring-blue-50 transition-all" 
                         />
                       </div>

                       <button type="button" onClick={()=>removeMilestone(m.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                         <Trash2 size={18}/>
                       </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <div className={`mt-4 p-4 rounded-2xl border flex items-center justify-between ${budgetMismatch ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                   <div className="flex items-center gap-2">
                      <AlertCircle size={16}/>
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {budgetMismatch ? "Budget Mismatch Detected" : "Financials Balanced"}
                      </span>
                   </div>
                   <span className="text-sm font-black">${milestoneTotal} / ${formData.totalBudget || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/10 sticky top-28">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-blue-400">
                <DollarSign size={20}/> Financials
              </h3>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Budget (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input 
                      required
                      type="number" 
                      value={formData.totalBudget}
                      onChange={(e)=>setFormData({...formData, totalBudget: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 pl-8 pr-5 py-3.5 rounded-xl font-bold outline-none focus:border-[#4177BC] text-white transition-all" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Strategy</label>
                  <select 
                    value={formData.paymentType}
                    onChange={(e)=>setFormData({...formData, paymentType: e.target.value})} 
                    className="w-full bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl font-bold outline-none cursor-pointer text-sm"
                  >
                    <option className="bg-slate-800" value="Installment Based">Installment Based</option>
                    <option className="bg-slate-800" value="Full Payment">Full Payment</option>
                  </select>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Automation</p>
                    <p className="text-[9px] text-slate-500 mt-1">Generate sequential invoices</p>
                  </div>
                  <button type="button" onClick={()=>setFormData({...formData, autoSequential: !formData.autoSequential})}>
                    {formData.autoSequential ? <ToggleRight size={32} className="text-blue-400"/> : <ToggleLeft size={32} className="text-slate-600"/>}
                  </button>
                </div>

                <div className="pt-4">
                  <button
                    disabled={submitting || budgetMismatch}
                    type="submit"
                    className="w-full py-4 bg-[#4177BC] hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                    {submitting ? "Deploying..." : "Launch Project"}
                  </button>
                  {budgetMismatch && (
                    <p className="text-[9px] text-red-400 text-center mt-3 font-medium">Fix budget mismatch to enable launch</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}