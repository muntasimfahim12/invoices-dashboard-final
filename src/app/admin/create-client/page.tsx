  
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, UserPlus, Briefcase, CreditCard, 
  ShieldCheck, Mail, Phone, MapPin, DollarSign, 
  Calendar, Lock, Wallet, Eye, EyeOff 
} from "lucide-react";

export default function CreateClientPage() {
  const [loading, setLoading] = useState(true);
  const [paymentType, setPaymentType] = useState("full");
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const [milestones, setMilestones] = useState([
    { title: "", amount: "", dueDate: "" },
  ]);

  // Foodpanda Style Loading Logic
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  if (loading) return <CreateClientSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 font-sans animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="bg-[#4177BC] pt-16 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Create New Client</h1>
              <p className="text-blue-100/80 mt-3 text-lg font-medium max-w-xl leading-relaxed">
                Setup workspace, project parameters, and billing logic for your next partnership.
              </p>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <p className="text-white text-sm font-bold uppercase tracking-widest">Draft Auto-saved</p>
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
              <InputGroup label="Company Name" placeholder="e.g. Acme Inc" />
              <InputGroup label="Client Email" type="email" icon={<Mail size={18}/>} placeholder="client@acme.com" />
              <InputGroup label="Contact Number" icon={<Phone size={18}/>} placeholder="+880 1XXX-XXXXXX" />
              <InputGroup label="Location" icon={<MapPin size={18}/>} placeholder="Dhaka, Bangladesh" />
            </div>
            <div className="mt-8">
              <label className="field-label">Internal Admin Notes</label>
              <textarea className="premium-textarea h-28" placeholder="Add private notes about this client..."></textarea>
            </div>
          </FormSection>

          {/* 2. CLIENT PORTAL ACCESS */}
          <FormSection icon={<ShieldCheck />} title="Portal Credentials" subtitle="Login details for the client dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
              <InputGroup label="Login Email" icon={<Mail size={18}/>} placeholder="portal-access@domain.com" />
              
              {/* Password Field with Eye Icon */}
              <div className="w-full">
                <label className="field-label">Temporary Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors z-10">
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="premium-input with-icon pr-12" 
                    placeholder="••••••••"
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
          </FormSection>

          {/* 3. PROJECT DETAILS */}
          <FormSection icon={<Briefcase />} title="Project Details" subtitle="Scope of work and total financial budget">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <InputGroup label="Project Title" placeholder="Web Development & SEO" />
              </div>
              <InputGroup label="Total Budget" type="number" icon={<DollarSign size={18}/>} placeholder="0.00" />
            </div>
            <div className="mt-8">
              <label className="field-label">Project Description</label>
              <textarea className="premium-textarea h-32" placeholder="Detail the services being provided..."></textarea>
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
                  <div key={index} className="flex flex-col md:flex-row gap-5 p-6 bg-slate-50/50 rounded-[24px] border border-slate-200/60 group relative hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex-[2] w-full"><InputGroup label="Milestone Title" placeholder="Title" /></div>
                    <div className="flex-1 w-full"><InputGroup label="Amount" type="number" icon={<DollarSign size={16}/>} /></div>
                    <div className="flex-1 w-full"><InputGroup label="Due Date" type="date" icon={<Calendar size={16}/>} /></div>
                    {milestones.length > 1 && (
                      <button onClick={() => removeMilestone(index)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl self-end mb-1"><Trash2 size={22} /></button>
                    )}
                  </div>
                ))}
                <button onClick={addMilestone} className="w-full p-4 border-2 border-dashed border-[#4177BC]/20 rounded-2xl text-[#4177BC] font-bold text-sm hover:bg-[#4177BC]/5 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> Add Milestone Step
                </button>
              </div>
            )}

            {paymentType === "monthly" && (
              <div className="max-w-xs animate-in zoom-in-95 duration-300">
                <InputGroup label="Monthly Rate" type="number" icon={<DollarSign size={18}/>} placeholder="0.00" />
              </div>
            )}
          </FormSection>

          {/* 5. INITIAL PAYMENT RECORD */}
          <FormSection icon={<Wallet />} title="Initial Payment" subtitle="Log any payment already received">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              <InputGroup label="Amount Paid" type="number" icon={<DollarSign size={18}/>} placeholder="0.00" />
              <div className="w-full">
                <label className="field-label">Payment Method</label>
                <select className="premium-select">
                  <option>Bank Transfer</option>
                  <option>Cash</option>
                  <option>PayPal</option>
                  <option>Stripe</option>
                </select>
              </div>
            </div>
          </FormSection>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-6 pt-10 pb-20">
            <button className="text-slate-400 font-black hover:text-slate-800 transition-colors uppercase text-xs tracking-widest">Discard Draft</button>
            <button className="px-12 py-5 bg-[#EB9C2C] text-white rounded-2xl font-black shadow-lg shadow-[#EB9C2C]/30 hover:scale-105 active:scale-95 transition-all uppercase text-xs tracking-[0.1em]">
              Create Client & Project
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 10px;
          margin-left: 4px;
        }
        .premium-input, .premium-select {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 20px;
          border: 2px solid #F1F5F9;
          background: #F8FAFC;
          font-size: 14px;
          font-weight: 700;
          color: #1E293B; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          appearance: none;
        }
        .with-icon {
          padding-left: 3.2rem !important;
        }
        .premium-input:focus, .premium-select:focus, .premium-textarea:focus {
          background: #FFFFFF;
          border-color: #4177BC;
          box-shadow: 0 10px 25px -10px rgba(65, 119, 188, 0.15);
        }
        .premium-textarea {
          width: 100%;
          padding: 1.2rem;
          border-radius: 22px;
          border: 2px solid #F1F5F9;
          background: #F8FAFC;
          font-size: 14px;
          font-weight: 600;
          color: #1E293B;
          outline: none;
          transition: all 0.3s;
          resize: none;
        }
        .premium-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234177BC' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1.2rem center;
          background-size: 1rem;
        }
      `}</style>
    </div>
  );
}

// SKELETON LOADING COMPONENT
function CreateClientSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 animate-pulse">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="h-48 bg-slate-200 rounded-[40px]" />
        <div className="grid grid-cols-1 gap-8">
          <div className="h-64 bg-white rounded-[32px] border border-slate-100" />
          <div className="h-64 bg-white rounded-[32px] border border-slate-100" />
          <div className="h-64 bg-white rounded-[32px] border border-slate-100" />
        </div>
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