/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { 
  ShieldCheck, User, Eye, EyeOff, Info, 
  ArrowRight, Fingerprint, Lock, Mail, ChevronLeft, 
  Sparkles, ShieldAlert, KeyRound, Building2
} from "lucide-react";

const PRIMARY = "#4177BC"; // Vault Blue
const ACCENT = "#EB9C2C";  // Vault Orange

/* ================= MAIN COMPONENT WRAPPER ================= */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Vault...</p>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}

/* ================= LOGIN FORM CONTENT ================= */
function LoginFormContent() {
  const [role, setRole] = useState<"client" | "admin">("client");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [forgetStep, setForgetStep] = useState<"hidden" | "email" | "code" | "reset">("hidden");
  const [forgetEmail, setForgetEmail] = useState("");
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const autoEmail = searchParams.get("email") || "";
  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  /* ================= ALL YOUR LOGIC (FIXED FOR SESSION PERSISTENCE) ================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, currentRole: "client" | "admin") => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: currentRole }),
      });
      const data = await response.json();

      if (response.ok) {
        // ১. লোকাল স্টোরেজে ডাটা সেভ করা
        const storageItems = {
          vault_token: data.token,
          user_role: data.role,
          user_name: data.name,
          user_email: email || "",
          user_id: data.id || ""
        };
        Object.entries(storageItems).forEach(([key, val]) => localStorage.setItem(key, val));
        
        // ২. কুকি কনফিগারেশন (রিফ্রেশ প্রবলেম সলভ করার জন্য)
        // expires: 1 মানে ১ দিন। আপনি চাইলে ৭ দিতে পারেন।
        Cookies.set("vault_token", data.token, { 
          expires: 1, 
          secure: process.env.NODE_ENV === "production", 
          sameSite: 'lax' 
        });
        
        Cookies.set("user_role", data.role, { expires: 1 });

        router.push(data.role.toLowerCase() === "admin" ? "/admin" : "/client/overview");
      } else {
        alert(data.error || "Invalid Credentials");
      }
    } catch (err) {
      alert("Network Error: Connection refused.");
    } finally { setLoading(false); }
  };

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const email = new FormData(e.currentTarget).get("email") as string;
    setForgetEmail(email);
    try {
      const res = await fetch(`${API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) setForgetStep("code");
      else { const d = await res.json(); alert(d.error || "Email not found!"); }
    } catch { alert("Failed to connect."); }
    finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgetEmail, code: otp }),
      });
      if (res.ok) setForgetStep("reset");
      else alert("Invalid 6-digit code!");
    } catch { alert("Verification failed."); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const newPass = new FormData(e.currentTarget).get("newPassword");
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgetEmail, code: otp, newPassword: newPass }),
      });
      if (res.ok) { alert("Password updated! Please login."); setForgetStep("hidden"); }
    } catch { alert("Update failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 selection:bg-[#4177BC] selection:text-white font-sans overflow-hidden">
      
      {/* Dynamic Background Blurs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4177BC]/10 rounded-full blur-[120px] transition-all duration-1000" />
      <div className={`fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] transition-all duration-1000 ${role === 'client' ? 'bg-[#4177BC]/5' : 'bg-[#EB9C2C]/10'}`} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[1150px] min-h-[720px] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-white/40 overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        
        {/* LEFT PANEL: AUTH FORM AREA */}
        <div className="p-8 lg:p-20 flex flex-col justify-center relative bg-white z-10">
          <div className="mb-12 flex items-center gap-2 group cursor-default">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-[#4177BC] transition-colors duration-500 shadow-lg shadow-slate-200">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">Geniehack<span className="text-[#4177BC]">.</span></span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-[42px] font-bold text-slate-900 leading-tight tracking-tight mb-4" style={{ fontFamily: 'var(--font-judson)' }}>
                {role === "client" ? "Client Portal" : "Admin Central"}
              </h1>
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] mb-12">
                {role === "client" ? "End-to-end encrypted project access" : "Agency management & operational control"}
              </p>

              <Form 
                title={role === "client" ? "Client Login" : "Admin Login"}
                onSubmit={(e: any) => handleSubmit(e, role)}
                loading={loading}
                note={role === "client" ? "Access your project tracks, payments and assets securely." : "Administrative credentials required for entry."}
                showRegister={role === "client"}
                onRegister={() => setShowRegister(true)}
                onForget={() => setForgetStep("email")}
                defaultValue={role === "client" ? autoEmail : ""}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PANEL: VISUAL AREA */}
        <div 
          className="hidden lg:flex relative overflow-hidden flex-col justify-between p-20 transition-all duration-1000 ease-in-out"
          style={{ backgroundColor: role === "client" ? "#4177BC" : "#111827" }}
        >
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 p-8">
            <Sparkles className="text-white/20 animate-pulse" size={48} />
          </div>
          <Fingerprint className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] text-white/5 rotate-12" />

          <div className="relative z-10">
            <motion.div 
              key={role + "icon"}
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl flex items-center justify-center mb-10"
            >
              {role === "client" ? <User className="text-white" size={40} /> : <ShieldAlert className="text-white" size={40} />}
            </motion.div>
            
            <h2 className="text-5xl font-bold text-white leading-[1.15] mb-6" style={{ fontFamily: 'var(--font-judson)' }}>
              {role === "client" ? "Empowering Your Digital Journey." : "Manage with Precision & Authority."}
            </h2>
            <p className="text-white/60 text-lg max-w-sm leading-relaxed font-medium">
              {role === "client" ? "Monitor milestones, settle invoices, and communicate with your team in one unified space." : "Monitor agency growth, handle client requests, and manage financial records efficiently."}
            </p>
          </div>

          <div className="relative z-10 pt-10 border-t border-white/10">
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Need the other portal?</p>
            <button 
              onClick={() => setRole(role === "client" ? "admin" : "client")}
              className="group flex items-center gap-4 px-8 py-5 bg-white text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#EB9C2C] hover:text-white transition-all shadow-xl active:scale-95"
            >
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
              Switch to {role === "client" ? "Admin" : "Client"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================= MODALS (PREMIUM) ================= */}
      
      {/* Registration Modal */}
      <AnimatePresence>
        {showRegister && (
          <ModalWrapper onClose={() => setShowRegister(false)}>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="text-[#4177BC]" size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-judson)' }}>Request Access</h3>
              <p className="text-slate-400 text-sm mt-2">New partnership? Request your portal credentials.</p>
            </div>
            <form className="space-y-4">
              <InputField icon={<Building2 size={18}/>} placeholder="Company Legal Name" />
              <InputField icon={<Mail size={18}/>} type="email" placeholder="Business Email" />
              <button type="button" className="w-full py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl mt-4 hover:bg-[#4177BC] transition-all">Submit Request</button>
            </form>
          </ModalWrapper>
        )}
      </AnimatePresence>

      {/* Advanced Forget Password Flow */}
      <AnimatePresence>
        {forgetStep !== "hidden" && (
          <ModalWrapper onClose={() => setForgetStep("hidden")}>
            
            {forgetStep === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="text-[#4177BC]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Account Recovery</h3>
                  <p className="text-slate-400 text-sm">Weill send a security code to your email.</p>
                </div>
                <InputField name="email" required type="email" icon={<Mail size={18}/>} placeholder="Registered Email" />
                <div className="flex gap-4">
                  <button type="button" onClick={() => setForgetStep("hidden")} className="flex-1 py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition">Back</button>
                  <button disabled={loading} className="flex-[2] py-4 font-black text-[10px] uppercase tracking-widest rounded-xl bg-[#4177BC] text-white shadow-lg shadow-blue-100 disabled:opacity-50">
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                </div>
              </form>
            )}

            {forgetStep === "code" && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">Security Verification</h3>
                  <p className="text-slate-400 text-sm mt-2">Check <b>{forgetEmail}</b> for the 6-digit code.</p>
                </div>
                <input 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
                  required 
                  placeholder="0 0 0 0 0 0" 
                  className="w-full text-center text-4xl tracking-[0.5em] font-black py-6 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-[#4177BC] focus:ring-4 ring-blue-50 outline-none transition-all" 
                />
                <button disabled={loading || otp.length < 6} className="w-full py-5 bg-[#4177BC] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify Identity"}
                </button>
              </form>
            )}

            {forgetStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900">New Password</h3>
                  <p className="text-slate-400 text-sm">Create a strong, unique security key.</p>
                </div>
                <InputField name="newPassword" required type="password" icon={<Lock size={18}/>} minLength={6} placeholder="Enter New Password" />
                <button disabled={loading} className="w-full py-5 bg-[#4177BC] text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-100">
                  {loading ? "Updating..." : "Update Password & Login"}
                </button>
              </form>
            )}

          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function InputField({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">
        {icon}
      </div>
      <input 
        {...props}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 ring-blue-50/50 outline-none focus:border-[#4177BC]/30 transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

function ModalWrapper({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-[35px] p-10 shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4177BC]" />
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 transition-colors font-bold text-xl">✕</button>
        {children}
      </motion.div>
    </div>
  );
}

function Form({ onSubmit, loading, note, showRegister, onRegister, onForget, defaultValue }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Identity Mail</label>
        <InputField 
          name="email" type="email" required defaultValue={defaultValue} 
          icon={<Mail size={18}/>} placeholder="alex@vault.com" 
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Security Key</label>
          <button type="button" onClick={onForget} className="text-[10px] font-black uppercase text-[#4177BC] hover:text-[#EB9C2C] transition-colors">Forgot?</button>
        </div>
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">
            <Lock size={18} />
          </div>
          <input 
            name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••••••" 
            className="w-full pl-14 pr-16 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 ring-blue-50/50 outline-none focus:border-[#4177BC]/30 transition-all" 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 group transition-all hover:bg-[#111827] active:scale-95 disabled:bg-slate-300">
        {loading ? "Authenticating..." : (
          <>Initialize Session <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} /></>
        )}
      </button>

      <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-3">
        <Info size={16} className="text-[#4177BC] shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-relaxed">{note}</p>
      </div>

      {showRegister && (
        <p className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest">
          New here? <button type="button" onClick={onRegister} className="text-[#4177BC] hover:underline ml-1">Request Partner Access</button>
        </p>
      )}
    </form>
  );
}