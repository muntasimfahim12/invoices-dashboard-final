/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import {
  ShieldCheck, User, Eye, EyeOff, Info,
  ArrowRight, Lock, Mail, ChevronLeft,
  ShieldAlert, KeyRound, Building2
} from "lucide-react";

const PRIMARY = "#4177BC"; // Vault Blue

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className={`w-10 h-10 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin`} />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}

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

  /* ================= লজিক সেকশন (Fixed for Role Compatibility) ================= */
  
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
        localStorage.setItem("vault_token", data.token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", email || "");
        localStorage.setItem("user_id", data.id || "");

        Cookies.set("vault_token", data.token, { expires: 1, secure: true, sameSite: 'lax' });
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
    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).toLowerCase().trim();
    setForgetEmail(email);

    try {
      const res = await fetch(`${API_URL}/auth/forget-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }), // Role পাঠানো হয়েছে
      });
      const data = await res.json();
      if (res.ok) {
        setForgetStep("code");
        alert("✅ A 6-digit code has been sent to your email.");
      } else {
        alert(data.error || "User not found!");
      }
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
        body: JSON.stringify({ email: forgetEmail, code: otp, role }), // Role মাস্ট
      });
      const data = await res.json();
      if (res.ok) setForgetStep("reset");
      else alert(data.error || "Invalid code!");
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
        body: JSON.stringify({ email: forgetEmail, code: otp, newPassword: newPass, role }), // Role মাস্ট
      });
      if (res.ok) {
        alert("🎉 Password updated! Please login.");
        setForgetStep("hidden");
        setOtp("");
      } else {
        const data = await res.json();
        alert(data.error || "Reset failed.");
      }
    } catch { alert("Update failed."); }
    finally { setLoading(false); }
  };

  /* ================= UI সেকশন (Unchanged & Polished) ================= */
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-sans">
      <motion.div
        layout
        className="w-full max-w-[1000px] min-h-[640px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col md:flex-row items-stretch"
      >
        {/* LEFT AREA: FORM */}
        <div className="w-full md:w-1/2 p-8 lg:p-16 flex flex-col">
          <div className="flex items-center gap-2 mb-10 shrink-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: PRIMARY }}>
              <ShieldCheck className="text-white" size={22} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Geniehack</span>
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[400px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={role}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8">
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                    {role === "client" ? "Client Login" : "Admin Central"}
                  </h1>
                  <p className="text-slate-500 text-sm font-medium">Please enter your credentials to continue.</p>
                </div>

                <Form
                  onSubmit={(e: any) => handleSubmit(e, role)}
                  loading={loading}
                  note={role === "client" ? "Secure access to your projects." : "Authorized personnel only."}
                  showRegister={role === "client"}
                  onRegister={() => setShowRegister(true)}
                  onForget={() => setForgetStep("email")}
                  defaultValue={role === "client" ? autoEmail : ""}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 shrink-0">
            <button
              onClick={() => { setRole(role === "client" ? "admin" : "client"); setForgetStep("hidden"); }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-[#4177BC] transition-all"
            >
              <ChevronLeft size={14} />
              Switch to {role === "client" ? "Admin" : "Client"}
            </button>
          </div>
        </div>

        {/* RIGHT AREA: VISUAL */}
        <div
          className="hidden md:flex md:w-1/2 relative overflow-hidden flex-col justify-center items-center text-center p-12 transition-all duration-700"
          style={{ backgroundColor: role === "client" ? PRIMARY : "#0F172A" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="relative z-10"
            >
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                {role === "client" ? <User className="text-white" size={32} /> : <ShieldAlert className="text-white" size={32} />}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight whitespace-pre-line">
                {role === "client" ? "Manage Your Projects\nIn One Place." : "Precision Control &\nManagement."}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* MODALS */}
      <AnimatePresence>
        {showRegister && (
          <ModalWrapper onClose={() => setShowRegister(false)}>
            <div className="text-center mb-6">
              <Building2 className="mx-auto mb-4" size={40} style={{ color: PRIMARY }} />
              <h3 className="text-xl font-bold text-slate-900">Request Access</h3>
            </div>
            <form className="space-y-4">
              <InputField icon={<Building2 size={18} />} placeholder="Company Legal Name" />
              <InputField icon={<Mail size={18} />} type="email" placeholder="Business Email" />
              <button type="button" className="w-full py-4 text-white font-bold rounded-xl" style={{ backgroundColor: PRIMARY }}>Submit Request</button>
            </form>
          </ModalWrapper>
        )}

        {forgetStep !== "hidden" && (
          <ModalWrapper onClose={() => setForgetStep("hidden")}>
            {forgetStep === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <KeyRound className="mx-auto mb-2" size={32} style={{ color: PRIMARY }} />
                <h3 className="text-center font-bold text-lg">Account Recovery</h3>
                <InputField name="email" required type="email" icon={<Mail size={18} />} placeholder="Enter your email" />
                <button disabled={loading} className="w-full py-4 text-white font-bold rounded-xl" style={{ backgroundColor: PRIMARY }}>
                  {loading ? "Sending..." : "Send Reset Code"}
                </button>
              </form>
            )}

            {forgetStep === "code" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <h3 className="text-center font-bold text-lg">Verification</h3>
                <p className="text-center text-xs text-slate-500">Enter the 6-digit code sent to your mail.</p>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="000000"
                  className="w-full text-center text-3xl font-bold py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4177BC] transition-all"
                />
                <button disabled={loading || otp.length < 6} className="w-full py-4 text-white font-bold rounded-xl" style={{ backgroundColor: PRIMARY }}>
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </form>
            )}

            {forgetStep === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <h3 className="text-center font-bold text-lg">Set Password</h3>
                <InputField name="newPassword" required type="password" icon={<Lock size={18} />} placeholder="New Security Key" />
                <button disabled={loading} className="w-full py-4 text-white font-bold rounded-xl" style={{ backgroundColor: PRIMARY }}>
                  {loading ? "Updating..." : "Update & Login"}
                </button>
              </form>
            )}
          </ModalWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= COMPONENT HELPERS ================= */

function InputField({ icon, ...props }: any) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#4177BC]/10 outline-none focus:border-[#4177BC]/30 transition-all"
      />
    </div>
  );
}

function ModalWrapper({ children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white rounded-[24px] p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 font-bold">✕</button>
        {children}
      </motion.div>
    </div>
  );
}

function Form({ onSubmit, loading, note, showRegister, onRegister, onForget, defaultValue }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
        <InputField name="email" type="email" required defaultValue={defaultValue} icon={<Mail size={18} />} placeholder="mail@example.com" />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
          <button type="button" onClick={onForget} className="text-[11px] font-bold uppercase text-[#4177BC] hover:text-[#EB9C2C] transition-colors">Forgot?</button>
        </div>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">
            <Lock size={18} />
          </div>
          <input
            name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••"
            className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#4177BC]/10 outline-none focus:border-[#4177BC]/30 transition-all"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full py-4 text-white font-bold rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:bg-slate-300"
        style={{ backgroundColor: PRIMARY }}
      >
        {loading ? "Authenticating..." : <>Login Account <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} /></>}
      </button>

      <div className="h-[52px] p-3 bg-blue-50/50 rounded-xl border border-blue-100/30 flex items-start gap-2">
        <Info size={14} style={{ color: PRIMARY }} className="shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight leading-normal line-clamp-2">{note}</p>
      </div>

      {showRegister && (
        <p className="text-center text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-4">
          New client? <button type="button" onClick={onRegister} className="hover:underline" style={{ color: PRIMARY }}>Request Access</button>
        </p>
      )}
    </form>
  );
}