/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  Plus, Trash2, UserPlus, Briefcase, CreditCard, 
  ShieldCheck, Mail, Phone, MapPin, DollarSign, 
  Calendar, Lock, Wallet, Eye, EyeOff, Loader2,
  RefreshCcw, Sparkles, Send
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CreateClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentType, setPaymentType] = useState("full");
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. FORM STATE MANAGEMENT
  const [formData, setFormData] = useState({
    companyName: "",
    clientEmail: "",
    contactNumber: "",
    location: "",
    adminNotes: "",
    loginEmail: "",
    password: "",
    projectTitle: "",
    totalBudget: "",
    projectDescription: "",
    amountPaid: "0",
    paymentMethod: "Bank Transfer"
  });

  const [milestones, setMilestones] = useState([
    { title: "", amount: "", dueDate: "" },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // 2. ADVANCED HANDLERS
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // ADVANCED FEATURE: Auto-fill Login Email when Client Email is typed
    if (name === "clientEmail" && !formData.loginEmail) {
      setFormData(prev => ({ ...prev, loginEmail: value }));
    }
  };

  // ADVANCED FEATURE: Professional Password Generator
  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let retVal = "";
    for (let i = 0, n = charset.length; i < 12; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setFormData(prev => ({ ...prev, password: retVal }));
    if(typeof toast !== 'undefined') toast.success("Secure password generated!");
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const newMilestones = [...milestones];
    (newMilestones[index] as any)[field] = value;
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  // 3. SUBMIT TO BACKEND (With Automation Trigger)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const payload = {
      name: formData.companyName,
      email: formData.clientEmail,
      phone: formData.contactNumber,
      address: formData.location,
      adminNotes: formData.adminNotes,
      portalEmail: formData.loginEmail,
      password: formData.password,
      status: "Active",
      // ADVANCED: Tell backend to send the Magic Login Email
      sendAutomationEmail: true, 
      totalPaid: Number(formData.amountPaid),
      projects: [{
        name: formData.projectTitle,
        budget: Number(formData.totalBudget),
        description: formData.projectDescription,
        type: paymentType,
        milestones: paymentType === "installment" ? milestones : []
      }]
    };

    try {
      await axios.post(`${API_BASE}/clinets`, payload);
      alert("🎉 Client created! Login credentials and Magic Link sent to their email.");
      router.push("/admin/all-clients");
    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(error.response?.data?.message || "Failed to create client. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CreateClientSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 font-sans animate-in fade-in duration-700 judson-bold">
      <Toaster />
      <form onSubmit={handleSubmit}>
        
        {/* HEADER SECTION */}
        <div className="bg-[#4177BC] pt-16 pb-40 px-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Create New Client</h1>
                <p className="text-blue-100/80 mt-3 text-lg font-medium max-w-xl leading-relaxed">
                  Setup workspace, project parameters, and automated email credentials for your client.
                </p>
              </div>
              <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-white text-sm font-bold uppercase tracking-widest">Email Automation Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORM CONTENT */}
        <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20">
          <div className="space-y-8">
            
            {/* 1. CLIENT INFORMATION */}
            <FormSection icon={<UserPlus />} title="Client Information" subtitle="Primary identity and contact details">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InputGroup label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="e.g. Acme Inc" required />
                <InputGroup label="Client Email" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleInputChange} icon={<Mail size={18}/>} placeholder="client@acme.com" required />
                <InputGroup label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<Phone size={18}/>} placeholder="+880 1XXX-XXXXXX" />
                <InputGroup label="Location" name="location" value={formData.location} onChange={handleInputChange} icon={<MapPin size={18}/>} placeholder="Dhaka, Bangladesh" />
              </div>
              <div className="mt-8">
                <label className="field-label">Internal Admin Notes</label>
                <textarea name="adminNotes" value={formData.adminNotes} onChange={handleInputChange} className="premium-textarea h-28" placeholder="Add private notes about this client..."></textarea>
              </div>
            </FormSection>

            {/* 2. CLIENT PORTAL ACCESS - ADVANCED FEATURES ADDED */}
            <FormSection icon={<ShieldCheck />} title="Portal Credentials" subtitle="Login details will be sent automatically via email">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
                <InputGroup label="Login Email" name="loginEmail" value={formData.loginEmail} onChange={handleInputChange} icon={<Mail size={18}/>} placeholder="portal-access@domain.com" required />
                
                <div className="w-full">
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="field-label mb-0!">Temporary Password</label>
                    <button type="button" onClick={generatePassword} className="text-[10px] font-black text-[#4177BC] flex items-center gap-1 hover:opacity-70 transition-opacity">
                      <RefreshCcw size={12} /> GENERATE SECURE
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors z-10">
                      <Lock size={18} />
                    </div>
                    <input 
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="premium-input with-icon pr-12" 
                      placeholder="••••••••"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4177BC] transition-colors z-10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              {/* ADVANCED HINT */}
              <div className="mt-6 flex items-center gap-2 text-blue-500 bg-blue-50 w-fit px-4 py-2 rounded-lg">
                <Sparkles size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">A Magic Login link will be included in the email</span>
              </div>
            </FormSection>

            {/* 3. PROJECT DETAILS */}
            <FormSection icon={<Briefcase />} title="Project Details" subtitle="Scope of work and total financial budget">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <InputGroup label="Project Title" name="projectTitle" value={formData.projectTitle} onChange={handleInputChange} placeholder="Web Development & SEO" required />
                </div>
                <InputGroup label="Total Budget" name="totalBudget" type="number" value={formData.totalBudget} onChange={handleInputChange} icon={<DollarSign size={18}/>} placeholder="0.00" required />
              </div>
              <div className="mt-8">
                <label className="field-label">Project Description</label>
                <textarea name="projectDescription" value={formData.projectDescription} onChange={handleInputChange} className="premium-textarea h-32" placeholder="Detail the services being provided..."></textarea>
              </div>
            </FormSection>

            {/* 4. PAYMENT CONFIGURATION */}
            <FormSection icon={<CreditCard />} title="Payment Configuration" subtitle="Define the billing cycle and milestones">
              <div className="max-w-md mb-10">
                <label className="field-label">Billing Model</label>
                <select 
                  className="premium-select"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="full">Full Upfront Payment</option>
                  <option value="monthly">Monthly Retainer Fee</option>
                  <option value="installment">Custom Milestones</option>
                </select>
              </div>

              {paymentType === "installment" && (
                <div className="space-y-6">
                  {milestones.map((m, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-200/60 group relative hover:bg-white hover:shadow-lg transition-all">
                      <div className="flex-2 w-full">
                        <InputGroup label="Milestone Title" value={m.title} onChange={(e:any) => handleMilestoneChange(index, 'title', e.target.value)} placeholder="Title" required />
                      </div>
                      <div className="flex-1 w-full">
                        <InputGroup label="Amount" type="number" value={m.amount} onChange={(e:any) => handleMilestoneChange(index, 'amount', e.target.value)} icon={<DollarSign size={16}/>} required />
                      </div>
                      <div className="flex-1 w-full">
                        <InputGroup label="Due Date" type="date" value={m.dueDate} onChange={(e:any) => handleMilestoneChange(index, 'dueDate', e.target.value)} icon={<Calendar size={16}/>} required />
                      </div>
                      {milestones.length > 1 && (
                        <button type="button" onClick={() => removeMilestone(index)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl self-end mb-1"><Trash2 size={22} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addMilestone} className="w-full p-4 border-2 border-dashed border-[#4177BC]/20 rounded-2xl text-[#4177BC] font-bold text-sm hover:bg-[#4177BC]/5 transition-all flex items-center justify-center gap-2">
                    <Plus size={20} /> Add Milestone Step
                  </button>
                </div>
              )}
            </FormSection>

            {/* 5. INITIAL PAYMENT RECORD */}
            <FormSection icon={<Wallet />} title="Initial Payment" subtitle="Log any payment already received">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <InputGroup label="Amount Paid" name="amountPaid" type="number" value={formData.amountPaid} onChange={handleInputChange} icon={<DollarSign size={18}/>} placeholder="0.00" />
                <div className="w-full">
                  <label className="field-label">Payment Method</label>
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="premium-select">
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Stripe">Stripe</option>
                  </select>
                </div>
              </div>
            </FormSection>

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-6 pt-10 pb-20">
              <button type="button" onClick={() => router.back()} className="text-slate-400 font-black hover:text-slate-800 transition-colors uppercase text-xs tracking-widest">Cancel & Exit</button>
              <button 
                type="submit" 
                disabled={submitting}
                className="px-12 py-5 bg-[#EB9C2C] text-white rounded-2xl font-black shadow-lg shadow-[#EB9C2C]/30 hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-widest flex items-center gap-3"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {submitting ? "Creating Ecosystem..." : "Create Client & Notify"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <style jsx global>{`
        .field-label { display: block; font-size: 10px; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 10px; margin-left: 4px; }
        .premium-input, .premium-select { width: 100%; padding: 1rem 1.25rem; border-radius: 20px; border: 2px solid #F1F5F9; background: #F8FAFC; font-size: 14px; font-weight: 700; color: #1E293B; transition: all 0.3s; outline: none; appearance: none; }
        .with-icon { padding-left: 3.2rem !important; }
        .premium-input:focus, .premium-select:focus, .premium-textarea:focus { background: #FFFFFF; border-color: #4177BC; box-shadow: 0 10px 25px -10px rgba(65, 119, 188, 0.15); }
        .premium-textarea { width: 100%; padding: 1.2rem; border-radius: 22px; border: 2px solid #F1F5F9; background: #F8FAFC; font-size: 14px; font-weight: 600; color: #1E293B; outline: none; transition: all 0.3s; resize: none; }
        .premium-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234177BC' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1.2rem center; background-size: 1rem; }
      `}</style>
    </div>
  );
}

// SKELETON
function CreateClientSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="h-48 bg-slate-200 rounded-[40px]" />
        <div className="h-64 bg-white rounded-4xl border border-slate-100" />
        <div className="h-64 bg-white rounded-4xl border border-slate-100" />
      </div>
    </div>
  );
}

/* REUSABLE SUB-COMPONENTS */
function FormSection({ title, subtitle, icon, children }: any) {
  return (
    <div className="bg-white rounded-[35px] border border-slate-200/50 shadow-sm p-8 md:p-12 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40">
      <div className="flex items-start gap-6 mb-10">
        <div className="w-14 h-14 bg-[#4177BC]/10 rounded-2xl flex items-center justify-center text-[#4177BC] shrink-0">
          {React.isValidElement(icon) ? React.cloneElement(icon as any, { size: 28, strokeWidth: 2.5 }) : icon}
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">{subtitle}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="w-full">
      <label className="field-label">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors z-10">
            {icon}
          </div>
        )}
        <input 
          className={`premium-input ${icon ? 'with-icon' : ''}`} 
          {...props} 
        />
      </div>
    </div>
  );
}