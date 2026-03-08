/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, ArrowLeft, Target, Briefcase, DollarSign,
  Trash2, Send, Loader2, Calendar, User, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export default function CreateProject() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    description: "",
    paymentType: "Installment Based",
    autoSequential: true
  });

  const [milestones, setMilestones] = useState([
    { id: Date.now(), name: "Advance Phase", amount: "", dueDate: new Date().toISOString().split('T')[0] }
  ]);

  const totalCalculatedBudget = useMemo(() => {
    return milestones.reduce((sum, m) => sum + Number(m.amount || 0), 0);
  }, [milestones]);

  useEffect(() => {
    axios.get(`${API_BASE}/clinets`)
      .then(res => setClients(res.data))
      .catch(err => console.error("Client fetch error:", err));
  }, []);

  const addMilestone = () => setMilestones([...milestones, { id: Date.now(), name: "", amount: "", dueDate: new Date().toISOString().split('T')[0] }]);

  const removeMilestone = (id: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id));
    } else {
      toast.error("Critical: At least one milestone strategy is required.");
    }
  };

  const updateMilestone = (id: number, field: string, value: string) => {
    setMilestones(milestones.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) return toast.error("Selection Error: Stakeholder is required.");
    if (totalCalculatedBudget <= 0) return toast.error("Budget Error: Aggregate funding must exceed 0.");

    setSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE}/clinets/deploy-project`, {
        ...formData,
        totalBudget: totalCalculatedBudget,
        milestones: milestones.map(({ name, amount, dueDate }) => ({
          name,
          amount: Number(amount),
          dueDate: dueDate,
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
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans text-[#0F172A] selection:bg-[#4177BC] selection:text-white">
      <Toaster position="top-right" />

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Navigation Bar */}
        <nav className="flex items-center justify-between py-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="text-slate-400 group-hover:text-[#4177BC] transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 inter-bold">Return to Hub</span>
          </button>

          <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50/50 backdrop-blur-md rounded-2xl border border-blue-100/50">
            <Target size={16} className="text-[#4177BC]" />
            <span className="text-[10px] font-black uppercase text-[#4177BC] tracking-[0.2em] inter-bold">Project Deployment Engine</span>
          </div>
        </nav>

        {/* Header Section */}
        <div className="mb-12 animate-scaleIn">
          <h1 className="text-5xl md:text-4xl font-bold tracking-tighter text-[#0F172A] judson-bold mb-4">
            Initialize <span className="text-slate-300">Strategy.</span>
          </h1>

        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">

            {/* Project Identity Card */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#4177BC] border border-slate-100">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A] judson-bold">Projects Create</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 inter-bold">Core Project Parameters</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 inter-bold">Primary Stakeholder</label>
                  <div className="relative">
                    <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <select
                      required
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[20px] font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 ring-blue-50/50 transition-all cursor-pointer appearance-none inter-medium text-sm"
                    >
                      <option value="">Select Partner Account</option>
                      {clients.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 inter-bold">Deployment Title</label>
                  <input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-[20px] font-bold text-[#0F172A] outline-none focus:bg-white focus:ring-4 ring-blue-50/50 transition-all inter-bold placeholder:text-slate-300"
                    placeholder="Enter project name..."
                  />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 inter-bold">Operational Brief</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[24px] font-medium text-slate-600 outline-none min-h-32 focus:bg-white focus:ring-4 ring-blue-50/50 transition-all inter-medium"
                  placeholder="Describe the scope of work and high-level objectives..."
                />
              </div>
            </div>

            {/* Milestones Area */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[40px] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#4177BC] border border-blue-100">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#0F172A] judson-bold">Milestone Structure</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 inter-bold">Sequential Payment Protocol</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="w-12 h-12 bg-[#4177BC] text-white rounded-2xl hover:bg-[#2D5A91] transition-all shadow-lg shadow-blue-200 flex items-center justify-center active:scale-90"
                >
                  <Plus size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {milestones.map((m, index) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group flex flex-wrap md:flex-nowrap items-center gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xs text-[#4177BC] border border-slate-100 inter-bold">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <input
                        required
                        value={m.name}
                        onChange={(e) => updateMilestone(m.id, 'name', e.target.value)}
                        placeholder="Phase Title (e.g. Design Completion)"
                        className="flex-1 min-w-[180px] px-5 py-3 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-[#4177BC] transition-all inter-bold"
                      />

                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4177BC] font-black text-xs">$</span>
                        <input
                          required
                          type="number"
                          value={m.amount}
                          onChange={(e) => updateMilestone(m.id, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="w-32 pl-8 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-800 outline-none focus:border-[#4177BC] transition-all inter-bold"
                        />
                      </div>

                      <div className="relative">
                        <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          required
                          type="datetime-local"
                          value={m.dueDate}
                          onChange={(e) => updateMilestone(m.id, 'dueDate', e.target.value)}
                          className="w-44 pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 uppercase outline-none focus:border-[#4177BC] transition-all inter-bold"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMilestone(m.id)}
                        className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>

               
              </div>
            </div>
          </div>

          {/* Sidebar - Financial Intelligence */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] sticky top-28 overflow-hidden group">

              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors duration-700" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC] mb-1 inter-bold">Financials</h3>
                    <p className="text-xl font-bold text-slate-800 tracking-tight judson-bold">Project Budget</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#4177BC] shadow-sm">
                    <DollarSign size={22} />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Total Budget Display */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 inter-bold">Aggregate Funding (USD)</label>
                    <div className="relative group/budget">
                      <div className="absolute inset-0 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl opacity-50 group-hover/budget:opacity-100 transition-opacity" />
                      <div className="relative flex items-center px-6 py-5">
                        <span className="text-2xl font-black text-[#4177BC] mr-2 inter-bold">$</span>
                        <input
                          readOnly
                          type="text"
                          value={totalCalculatedBudget.toLocaleString()}
                          className="bg-transparent text-3xl font-black text-[#0F172A] outline-none w-full tracking-tighter cursor-default inter-bold"
                        />
                        <div className="absolute -right-2 -top-2 px-2 py-1 bg-[#4177BC] rounded-md text-[8px] font-black text-white uppercase tracking-tighter shadow-lg inter-bold">Auto-Calc</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Strategy Selection */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 inter-bold">Strategy Architecture</label>
                    <div className="relative">
                      <select
                        value={formData.paymentType}
                        onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl font-bold text-slate-700 outline-none cursor-pointer appearance-none hover:bg-slate-100 transition-colors text-sm inter-bold"
                      >
                        <option value="Installment Based">Installment Based</option>
                        <option value="Full Payment">Full Payment</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Target size={16} />
                      </div>
                    </div>
                  </div>

               

                  {/* Launch Button Section */}
                  <div className="pt-4">
                    <button
                      disabled={submitting || totalCalculatedBudget === 0}
                      type="submit"
                      className="w-full group relative overflow-hidden py-5 bg-[#0F172A] hover:bg-[#4177BC] disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] transition-all duration-500 shadow-xl shadow-slate-200 disabled:shadow-none flex items-center justify-center gap-3 inter-bold"
                    >
                      <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      {submitting ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      )}
                      <span>{submitting ? "Deploying Strategy..." : "Launch Project"}</span>
                    </button>

                    {totalCalculatedBudget === 0 && (
                      <p className="text-center text-[9px] font-black text-red-400 mt-4 uppercase tracking-[0.2em] animate-pulse inter-bold">
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .judson-bold { font-family: 'Judson', serif; font-weight: 700; }
        .inter-bold { font-family: 'Inter', sans-serif; font-weight: 700; }
        .inter-medium { font-family: 'Inter', sans-serif; font-weight: 500; }
      `}</style>
    </div>
  );
}