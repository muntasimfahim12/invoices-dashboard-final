/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, Suspense } from "react"; // ✅ Suspense added
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

/* ================= MAIN COMPONENT WRAPPER ================= */
// Next.js 16-এ useSearchParams ব্যবহার করলে Suspense দিয়ে র‍্যাপ করা বাধ্যতামূলক।
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

/* ================= LOGIN FORM CONTENT ================= */
function LoginFormContent() {
  const [role, setRole] = useState<"client" | "admin">("client");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();
  
  // ✅ Extract email from URL (This needs Suspense)
  const searchParams = useSearchParams();
  const autoEmail = searchParams.get("email") || "";

  // URL formatting: Automatic trailing slash removal
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const API_URL = rawUrl.replace(/\/$/, "");

  /* ================= LOGIN LOGIC (UNCHANGED) ================= */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    currentRole: "client" | "admin"
  ) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    const payload = {
      email,
      password,
      role: currentRole,
    };

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("vault_token", data.token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_name", data.name);
        localStorage.setItem("user_email", email || "");

        Cookies.set("vault_token", data.token, { expires: 7 });
        Cookies.set("user_role", data.role, { expires: 7 });

        console.log("Login Success! Role:", data.role);

        if (data.role.toLowerCase() === "admin") {
          router.push("/admin"); 
        } else {
          router.push("/client");
        }
      } else {
        alert(data.error || "Login failed! Please check your credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Cannot connect to server. Ensure your backend is running at: " + API_URL);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER REQUEST (UNCHANGED) ================= */
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
    };

    try {
      const response = await fetch(`${API_URL}/invoices/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: payload.name,
          clientEmail: payload.email,
          projectTitle: "Portal Access Request",
          items: [{ name: "Request for: " + payload.email, qty: 1, price: 0 }],
          currency: "Request",
          remainingDue: 0,
          invoiceId: "REQ-" + Date.now()
        }),
      });

      if (response.ok) {
        alert("Request sent successfully! Admin will create your account.");
        setShowRegister(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 font-sans">
      <div className="relative w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-lg">

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:grid grid-cols-2 min-h-[550px]">

          {/* LEFT: FORMS */}
          <div className="relative flex items-center justify-center px-10">
            <Fade visible={role === "client"}>
              <Form
                title="Client Login"
                description="Access projects, invoices and payments."
                onSubmit={(e: any) => handleSubmit(e, "client")}
                loading={loading}
                note="Client credentials are provided by admin."
                showRegister
                onRegister={() => setShowRegister(true)}
                defaultValue={autoEmail} 
              />
            </Fade>

            <Fade visible={role === "admin"}>
              <Form
                title="Admin Login"
                description="Manage clients, projects and billing."
                onSubmit={(e: any) => handleSubmit(e, "admin")}
                loading={loading}
                note="Admin access only."
              />
            </Fade>
          </div>

          {/* RIGHT: SWITCH PANEL */}
          <div
            className="flex items-center justify-center text-white px-10 transition-all duration-500 ease-in-out"
            style={{
              backgroundColor: role === "client" ? "#4177BC" : "#EB9C2C",
            }}
          >
            <div className="text-center max-w-sm">
              <h3 className="text-3xl font-bold">
                {role === "client" ? "Are you an admin?" : "Are you a client?"}
              </h3>

              <p className="mt-4 text-white/90">
                {role === "client"
                  ? "Login as admin to manage everything."
                  : "Login as client to view your work & invoices."}
              </p>

              <button
                onClick={() => setRole(role === "client" ? "admin" : "client")}
                className="mt-8 px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition shadow-md active:scale-95"
              >
                Switch to {role === "client" ? "Admin" : "Client"} Login
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="md:hidden p-8">
          <Form
            title={role === "client" ? "Client Login" : "Admin Login"}
            description={role === "client" ? "Access projects & invoices." : "Manage your agency."}
            onSubmit={(e: any) => handleSubmit(e, role)}
            loading={loading}
            note="If you don’t have credentials, contact admin."
            showRegister={role === "client"}
            onRegister={() => setShowRegister(true)}
            defaultValue={role === "client" ? autoEmail : ""}
          />

          <button
            onClick={() => setRole(role === "client" ? "admin" : "client")}
            className="mt-6 w-full py-3 text-sm font-semibold text-[#4177BC] border border-[#4177BC] rounded-lg"
          >
            Switch to {role === "client" ? "Admin" : "Client"} Login
          </button>
        </div>
      </div>

      {/* ================= REGISTER MODAL ================= */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSubmit={handleRegister}
          loading={loading}
        />
      )}
    </div>
  );
}

/* ================= REUSABLE COMPONENTS (UNCHANGED) ================= */

function Fade({ visible, children }: any) {
  return (
    <div
      className={`absolute inset-0 transition-all duration-500 flex items-center justify-center
      ${visible ? "opacity-100 translate-x-0 z-10" : "opacity-0 translate-x-4 z-0 pointer-events-none"}`}
    >
      {children}
    </div>
  );
}

function Form({ title, description, onSubmit, loading, note, showRegister, onRegister, defaultValue }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-3xl font-bold text-slate-900 leading-tight">{title}</h2>
      <p className="text-slate-500 mt-2">{description}</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase">Email</label>
          <input 
            name="email" 
            type="email" 
            required 
            defaultValue={defaultValue} 
            placeholder="name@company.com" 
            className="w-full mt-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm" 
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase">Password</label>
          <div className="relative mt-1">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition shadow-sm pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-bold transition shadow-lg active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
        >
          {loading ? "Verifying..." : "Sign In to Vault"}
        </button>
      </form>

      <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <div className="mt-0.5"><InfoIcon /></div>
        <span>{note}</span>
      </div>

      {showRegister && (
        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <button onClick={onRegister} className="text-sm font-bold text-[#4177BC] hover:underline">
            Donot have access? Register for Portal
          </button>
        </div>
      )}
    </div>
  );
}

function RegisterModal({ onClose, onSubmit, loading }: any) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900">Request Access</h3>
        <p className="text-slate-500 text-sm mt-2">Admin will review and create your credentials.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="name" required placeholder="Full Name / Company" className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" />
          <input name="email" required type="email" placeholder="Business Email" className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm" />
          <textarea name="message" placeholder="Project details (optional)" className="w-full px-4 py-3 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none transition shadow-sm" />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-50 transition">Cancel</button>
            <button disabled={loading} className="flex-1 py-3 text-sm font-bold rounded-lg bg-[#4177BC] text-white hover:bg-[#34629d] transition shadow-md">
              {loading ? "Sending..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EyeIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>; }
function EyeOffIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>; }
function InfoIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>; }