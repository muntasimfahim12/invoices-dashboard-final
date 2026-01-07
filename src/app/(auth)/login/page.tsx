/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "admin">("client");
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  /* ================= LOGIN ================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    currentRole: "client" | "admin"
  ) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      role: currentRole,
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await fetch("https://example.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await fetch("https://example.com/api/register-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setShowRegister(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="relative w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-lg">

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:grid grid-cols-2 min-h-130">

          {/* LEFT: FORMS */}
          <div className="relative flex items-center justify-center px-10">
            <Fade visible={role === "client"}>
              <Form
                title="Client Login"
                description="Access projects, invoices and payments."
                onSubmit={(e) => handleSubmit(e, "client")}
                loading={loading}
                note="Client credentials are provided by admin."
                showRegister
                onRegister={() => setShowRegister(true)}
              />
            </Fade>

            <Fade visible={role === "admin"}>
              <Form
                title="Admin Login"
                description="Manage clients, projects and billing."
                onSubmit={(e) => handleSubmit(e, "admin")}
                loading={loading}
                note="Admin access only."
              />
            </Fade>
          </div>

          {/* RIGHT: SWITCH PANEL */}
          <div
            className="flex items-center justify-center text-white px-10 transition-colors duration-500"
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
                onClick={() =>
                  setRole(role === "client" ? "admin" : "client")
                }
                className="mt-8 px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition"
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
            description={
              role === "client"
                ? "Access your projects and invoices."
                : "Manage clients and payments."
            }
            onSubmit={(e) => handleSubmit(e, role)}
            loading={loading}
            note="If you don’t have credentials, contact admin."
            showRegister={role === "client"}
            onRegister={() => setShowRegister(true)}
          />

          <button
            onClick={() =>
              setRole(role === "client" ? "admin" : "client")
            }
            className="mt-6 text-sm font-semibold text-[#4177BC]"
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

/* ================= COMPONENTS ================= */

function Fade({ visible, children }: any) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-500
      ${visible ? "opacity-100 z-10" : "opacity-0 z-0"}`}
    >
      {children}
    </div>
  );
}

function Form({
  title,
  description,
  onSubmit,
  loading,
  note,
  showRegister,
  onRegister,
}: {
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  note: string;
  showRegister?: boolean;
  onRegister?: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-sm">
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500 mt-2">{description}</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <input name="email" type="email" required placeholder="Email" className="input" />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <button className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
          <InfoIcon />
          <span>{note}</span>
        </div>

        {showRegister && (
          <button
            onClick={onRegister}
            className="mt-4 text-sm font-semibold text-[#4177BC]"
          >
            Register for Portal Access
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= REGISTER MODAL ================= */

function RegisterModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-slate-900">
          Request Portal Access
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Submit your details. Admin will contact you.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input name="name" required placeholder="Full Name / Company" className="input" />
          <input name="email" required type="email" placeholder="Email" className="input" />
          <textarea
            name="message"
            placeholder="Short message (optional)"
            className="input h-24"
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border"
            >
              Cancel
            </button>
            <button className="btn-primary">
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= ICONS ================= */

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12 18 19.5 12 19.5 1.5 12 1.5 12z" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" d="M3 3l18 18" />
      <path strokeWidth="2" d="M10.7 10.7a3 3 0 004.2 4.2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
