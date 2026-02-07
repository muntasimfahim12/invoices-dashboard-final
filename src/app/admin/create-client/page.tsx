/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  UserPlus, Mail, Phone, MapPin, Lock, 
  Eye, EyeOff, Loader2, RefreshCcw, Send 
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
    const pass = Math.random().toString(36).slice(-10).toUpperCase() + "@" + Math.floor(Math.random() * 100);
    setFormData(prev => ({ ...prev, password: pass }));
    toast.success("Secure password generated!");
  };

  // ✅ প্রধান লজিক: ব্যাকএন্ডে ডাটা পাঠানো এবং ইমেইল অটোমেশন
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const FRONTEND_URL = window.location.origin; // আপনার ডোমেইন ইউআরএল (যেমন: https://yourportal.com)


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
        subject: `Welcome to Your Portal - ${formData.companyName}`,
        buttonLink: magicLoginLink, 
        buttonText: "Login to Your Portal Now",
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
        toast.success("Client account created & Welcome email sent!");
        setTimeout(() => {
          router.push("/admin/all-clients");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Creation Error:", error);
      const errorMsg = error.response?.data?.message || "Failed to create client.";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <CreateClientSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900 font-sans">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit}>
        
        {/* HEADER */}
        <div className="bg-[#4177BC] pt-16 pb-40 px-6 relative">
          <div className="max-w-6xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Add New Client</h1>
            <p className="text-blue-100/80 mt-3 text-lg font-medium italic judson-regular">
              Create a dedicated portal account and automate welcome credentials.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-20">
          <div className="space-y-8">
            
            <FormSection icon={<UserPlus />} title="Identity & Access" subtitle="Essential credentials for portal access">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name / Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="e.g. Abir Khan" required />
                <InputGroup label="Email Address" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleInputChange} icon={<Mail size={18}/>} placeholder="client@example.com" required />
                <InputGroup label="Phone Number (Optional)" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} icon={<Phone size={18}/>} placeholder="+880" />
                <InputGroup label="Address (Optional)" name="location" value={formData.location} onChange={handleInputChange} icon={<MapPin size={18}/>} placeholder="Billing Address" />
                
                <div className="w-full">
                   <div className="flex justify-between items-center mb-1">
                     <label className="field-label mb-0!">Portal Password</label>
                     <button type="button" onClick={generatePassword} className="text-[10px] font-black text-[#4177BC] flex items-center gap-1 hover:opacity-70 transition-opacity">
                       <RefreshCcw size={12} /> GENERATE SECURE
                     </button>
                   </div>
                   <div className="relative group">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] z-10"><Lock size={18} /></div>
                     <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className="premium-input with-icon pr-12" placeholder="Set password" required />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 z-10">
                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                     </button>
                   </div>
                </div>

                <div className="w-full">
                  <label className="field-label">Internal Admin Notes</label>
                  <textarea name="adminNotes" value={formData.adminNotes} onChange={handleInputChange} className="premium-textarea h-[54px]" placeholder="Add private notes..."></textarea>
                </div>
              </div>
            </FormSection>

            <div className="flex justify-end gap-6 pt-4">
              <button type="button" onClick={() => router.back()} className="font-black text-slate-400 uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Discard</button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-12 py-5 bg-[#EB9C2C] text-white rounded-2xl font-black shadow-lg shadow-[#EB9C2C]/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 uppercase text-xs tracking-widest"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Create & Notify Client
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </form>

      <style jsx global>{`
        .field-label { display: block; font-size: 10px; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px; }
        .premium-input { width: 100%; padding: 0.8rem 1.2rem; border-radius: 15px; border: 2px solid #F1F5F9; background: #F8FAFC; font-size: 14px; font-weight: 700; outline: none; transition: all 0.3s; }
        .with-icon { padding-left: 3rem !important; }
        .premium-input:focus { border-color: #4177BC; background: white; box-shadow: 0 10px 20px -10px rgba(65, 119, 188, 0.2); }
        .premium-textarea { width: 100%; padding: 1rem; border-radius: 15px; border: 2px solid #F1F5F9; background: #F8FAFC; font-size: 14px; outline: none; resize: none; transition: all 0.3s; }
        .premium-textarea:focus { border-color: #4177BC; background: white; }
      `}</style>
    </div>
  );
}

// COMPONENTS
function FormSection({ title, subtitle, icon, children }: any) {
  return (
    <div className="bg-white rounded-[30px] border border-slate-200 shadow-sm p-8 md:p-10 transition-all hover:shadow-md">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-50 text-[#4177BC] rounded-xl">{icon}</div>
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight inter-bold">{title}</h2>
          <p className="text-slate-400 text-xs font-medium">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function InputGroup({ label, icon, ...props }: any) {
  return (
    <div className="w-full">
      <label className="field-label">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input className={`premium-input ${icon ? 'with-icon' : ''} inter-medium`} {...props} />
      </div>
    </div>
  );
}

function CreateClientSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#4177BC]" size={40} />
        <p className="text-slate-400 font-bold animate-pulse">Initializing Portal Access...</p>
      </div>
    </div>
  );
}