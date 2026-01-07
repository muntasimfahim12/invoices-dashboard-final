/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  UserPlus,
  Briefcase,
  CreditCard,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Lock,
  Wallet,
} from "lucide-react";

export default function CreateClientPage() {
  const [paymentType, setPaymentType] = useState("full");
  const [milestones, setMilestones] = useState([
    { title: "", amount: "", dueDate: "" },
  ]);

  const addMilestone = () =>
    setMilestones([...milestones, { title: "", amount: "", dueDate: "" }]);

  const removeMilestone = (index: number) =>
    setMilestones(milestones.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 text-slate-900">
      {/* ================= HEADER ================= */}
      <div className="bg-[#4177BC] pt-14 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Create New Client
          </h1>
          <p className="text-blue-100/80 mt-4 max-w-xl">
            Setup client, project, and payment flow manually.
          </p>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-4 -mt-24 space-y-8 relative z-20">
        {/* CLIENT INFO */}
        <Section icon={<UserPlus />} title="Client Information" subtitle="Basic details">
          <Grid>
            <Input label="Company Name" placeholder="Acme Inc" />
            <Input label="Email" icon={<Mail size={16} />} />
            <Input label="Phone" icon={<Phone size={16} />} />
            <Input label="Location" icon={<MapPin size={16} />} />
          </Grid>
          <Textarea label="Internal Notes" />
        </Section>

        {/* PORTAL ACCESS */}
        <Section icon={<ShieldCheck />} title="Portal Access" subtitle="Client login credentials">
          <Grid cols={2}>
            <Input label="Login Email" icon={<Mail size={16} />} />
            <Input label="Temporary Password" type="password" icon={<Lock size={16} />} />
          </Grid>
        </Section>

        {/* PROJECT */}
        <Section icon={<Briefcase />} title="Project Details" subtitle="Scope & budget">
          <Grid cols={3}>
            <Input label="Project Title" />
            <Input label="Total Budget" type="number" icon={<DollarSign size={16} />} />
          </Grid>
          <Textarea label="Project Description" />
        </Section>

        {/* PAYMENT */}
        <Section icon={<CreditCard />} title="Payment Configuration" subtitle="Billing model">
          <div className="max-w-sm">
            <label className="field-label">Payment Type</label>
            <select
              className="premium-select"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="full">Full Payment</option>
              <option value="monthly">Monthly Retainer</option>
              <option value="installment">Custom Milestones</option>
            </select>
          </div>

          {paymentType === "installment" && (
            <div className="space-y-4 mt-6">
              {milestones.map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white rounded-2xl shadow-sm"
                >
                  <Input label="Title" />
                  <Input label="Amount" type="number" icon={<DollarSign size={14} />} />
                  <Input label="Due Date" type="date" icon={<Calendar size={14} />} />
                  {milestones.length > 1 && (
                    <button
                      onClick={() => removeMilestone(index)}
                      className="self-end p-3 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addMilestone}
                className="w-full py-4 border-2 border-dashed border-[#4177BC]/30 rounded-2xl text-[#4177BC] font-bold flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add Payment Step
              </button>
            </div>
          )}

          {paymentType === "monthly" && (
            <div className="max-w-xs mt-6">
              <Input label="Monthly Rate" type="number" icon={<DollarSign size={16} />} />
            </div>
          )}
        </Section>

        {/* INITIAL PAYMENT */}
        <Section icon={<Wallet />} title="Initial Payment" subtitle="Already received">
          <Grid cols={2}>
            <Input label="Amount Paid" type="number" icon={<DollarSign size={16} />} />
            <div>
              <label className="field-label">Method</label>
              <select className="premium-select">
                <option>Bank</option>
                <option>Cash</option>
                <option>PayPal</option>
                <option>Stripe</option>
              </select>
            </div>
          </Grid>
        </Section>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pb-16">
          <button className="text-slate-400 font-bold">Discard</button>
          <button className="px-10 py-4 bg-[#EB9C2C] text-white rounded-2xl font-black shadow-lg">
            Create Client & Project
          </button>
        </div>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        .field-label {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .premium-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f8fafc;
          font-weight: 600;
          border: none;
          outline: none;
          transition: all 0.25s ease;
        }
        .premium-input:focus {
          background: #fff;
          box-shadow: 0 0 0 2px rgba(65, 119, 188, 0.35),
            0 10px 25px -10px rgba(65, 119, 188, 0.25);
        }
        .premium-textarea {
          width: 100%;
          padding: 16px;
          border-radius: 18px;
          background: #f8fafc;
          border: none;
          outline: none;
          resize: none;
          transition: all 0.25s ease;
        }
        .premium-textarea:focus {
          background: #fff;
          box-shadow: 0 0 0 2px rgba(65, 119, 188, 0.35);
        }
        .premium-select {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: #f8fafc;
          border: none;
          outline: none;
          font-weight: 700;
          color: #4177bc;
        }
      `}</style>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Section({ title, subtitle, icon, children }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10">
      <div className="flex gap-4 mb-6">
        <div className="w-12 h-12 bg-[#4177BC]/10 rounded-2xl flex items-center justify-center text-[#4177BC]">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Grid({ children, cols = 4 }: any) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        cols === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
      } gap-6`}
    >
      {children}
    </div>
  );
}

function Input({ label, icon, ...props }: any) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input className={`premium-input ${icon ? "pl-12" : ""}`} {...props} />
      </div>
    </div>
  );
}

function Textarea({ label }: any) {
  return (
    <div className="mt-6">
      <label className="field-label">{label}</label>
      <textarea className="premium-textarea h-28" />
    </div>
  );
}
