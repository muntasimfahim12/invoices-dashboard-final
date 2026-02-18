/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  UserPlus, Mail, Phone, MapPin, Lock, 
  Eye, EyeOff, Loader2, RefreshCcw, Send, Sparkles, ArrowLeft, ShieldCheck
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CreateClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",      
    clientEmail: "",      
    contactNumber: "",    
    location: "",         
    password: "",         
    adminNotes: "",       
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(-8).toUpperCase() + "!" + Math.floor(Math.random() * 90 + 10);
    setFormData(prev => ({ ...prev, password: pass }));
    toast.success("Secure password generated", {
        icon: '🔐',
        style: { borderRadius: '10px', background: '#1e293b', color: '#fff' }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const FRONTEND_URL = window.location.origin;

    const magicLoginLink = `${FRONTEND_URL}/login?email=${encodeURIComponent(formData.clientEmail)}&pass=${encodeURIComponent(formData.password)}`;

    const payload = {
      name: formData.companyName,
      email: formData.clientEmail,
      phone: formData.contactNumber,
      address: formData.location,
      portalEmail: formData.clientEmail,
      password: formData.password,
      internalNotes: formData.adminNotes,
      sendAutomationEmail: true, 
      emailData: {
        subject: `Portal Access: ${formData.companyName}`,
        buttonLink: magicLoginLink, 
        buttonText: "Access Portal",
        credentials: {
          email: formData.clientEmail,
          password: formData.password
        }
      },
      status: "Active",
      createdAt: new Date()
    };

    try {
      const response = await axios.post(`${API_BASE}/clinets`, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success("Client account activated successfully!");
        setTimeout(() => router.push("/admin/all-clients"), 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create client.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CreateClientSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFFFFF] selection:bg-[#4177BC10]">
      <Toaster position="bottom-right" />
      
      {/* Subtle Layout Guide */}
      <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10">
        {/* REFINED TOP NAV */}
        <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
            <button 
              type="button"
              onClick={() => router.back()}
              className="group flex items-center gap-2.5 text-slate-500 hover:text-slate-900 transition-all text-sm inter-medium"
            >
              <div className="p-2 rounded-full border border-slate-100 group-hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} />
              </div>
              Back to Management
            </button>
            
            <div className="hidden md:flex items-center gap-6">
               <div className="flex items-center gap-2 text-slate-400 text-[12px] inter-medium uppercase tracking-[0.15em]">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Encrypted Session
               </div>
            </div>
          </div>
        </nav>

        <main className="max-w-[1100px] mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* LEFT COLUMN: Header & Info */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4177BC08] text-[#4177BC] text-[10px] inter-bold uppercase tracking-wider mb-6 border border-[#4177BC15]">
                <Sparkles size={12} /> New Account Setup
              </div>
              <h1 className="text-4xl judson-bold text-slate-900 leading-[1.1]">Create Client Portal</h1>
              <p className="text-slate-500 mt-4 text-lg judson-regular-italic leading-relaxed">
                Configure workspace access and trigger automated onboarding for your new partnership.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Mail size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm inter-semibold text-slate-800">Auto-Onboarding</h4>
                        <p className="text-xs text-slate-400 mt-1">A welcome email with login credentials will be sent instantly.</p>
                    </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Form */}
            <div className="lg:col-span-8">
              <div className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.05)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  
                  <div className="md:col-span-2 flex items-center gap-3 pb-2 border-b border-slate-50 mb-2">
                    <UserPlus size={18} className="text-[#4177BC]" />
                    <h2 className="inter-semibold text-slate-800">Identity Details</h2>
                  </div>

                  <InputGroup label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="e.g. Global Tech Solutions" required />
                  <InputGroup label="Primary Contact Email" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleInputChange} icon={<Mail size={16}/>} placeholder="billing@company.com" required />
                  <InputGroup label="Phone Number" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<Phone size={16}/>} placeholder="+1 000 000 000" />
                  <InputGroup label="Business Location" name="location" value={formData.location} onChange={handleInputChange} icon={<MapPin size={16}/>} placeholder="London, UK" />
                  
                  <div className="md:col-span-2 pt-6 flex items-center gap-3 pb-2 border-b border-slate-50 mb-2">
                    <Lock size={18} className="text-[#EB9C2C]" />
                    <h2 className="inter-semibold text-slate-800">Security & Access</h2>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] inter-bold text-slate-400 uppercase tracking-widest">Portal Password</label>
                      <button type="button" onClick={generatePassword} className="text-[10px] inter-bold text-[#EB9C2C] hover:text-[#d68a21] transition-colors flex items-center gap-1.5 uppercase tracking-tighter">
                        <RefreshCcw size={12} /> Regenerate
                      </button>
                    </div>
                    <div className="relative group">
                      <input 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        className="w-full pl-5 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#4177BC] focus:ring-4 focus:ring-[#4177BC05] transition-all outline-none text-sm inter-medium shadow-sm"
                        placeholder="••••••••" 
                        required 
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] inter-bold text-slate-400 uppercase tracking-widest px-1">Internal Reference</label>
                    <textarea 
                      name="adminNotes" 
                      value={formData.adminNotes} 
                      onChange={handleInputChange} 
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#4177BC] focus:ring-4 focus:ring-[#4177BC05] transition-all outline-none text-sm inter-medium min-h-[56px] resize-none shadow-sm" 
                      placeholder="Add private context..." 
                    />
                  </div>
                </div>

                <div className="mt-16 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
                   <button 
                    type="button" 
                    onClick={() => router.back()} 
                    className="text-[12px] inter-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-[0.2em]"
                  >
                    Discard Changes
                  </button>

                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="w-full sm:w-auto px-12 py-5 bg-[#4177BC] text-white rounded-2xl inter-bold text-xs shadow-xl shadow-[#4177BC20] hover:bg-[#35629c] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 flex items-center justify-center gap-3 uppercase tracking-[0.15em]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Deploying...
                      </>
                    ) : (
                      <>
                        Create Client Account
                        <Send size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}

function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] inter-bold text-slate-400 uppercase tracking-widest px-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">{icon}</div>}
        <input 
          className={`w-full ${icon ? 'pl-12' : 'px-5'} pr-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#4177BC] focus:ring-4 focus:ring-[#4177BC05] transition-all outline-none text-sm inter-medium placeholder:text-slate-300 shadow-sm`} 
          {...props} 
        />
      </div>
    </div>
  );
}

function CreateClientSkeleton() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-[3px] border-slate-100 rounded-full" />
        <div className="w-16 h-16 border-[3px] border-t-[#4177BC] rounded-full animate-spin absolute top-0 left-0" />
      </div>
      <p className="mt-8 text-slate-400 text-sm inter-medium animate-pulse tracking-widest uppercase">Initializing Workspace</p>
    </div>
  );
}