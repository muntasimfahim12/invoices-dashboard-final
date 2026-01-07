"use client";

import React from "react";

export default function AdminSettingsPage() {
  return (
    <div className=" container mx-auto space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>
        <p className="text-slate-500 mt-2">
          Manage account, payments, invoices and system preferences.
        </p>
      </div>

      {/* ================= ACCOUNT ================= */}
      <Section title="Account Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" placeholder="Admin Name" />
          <input className="input" type="email" placeholder="Admin Email" />
        </div>

        <button className="mt-4 text-sm font-semibold text-[#4177BC]">
          Reset Password
        </button>
      </Section>

      {/* ================= PAYMENT ================= */}
      <Section title="Payment Settings">
        <div className="space-y-4">
          <input
            className="input"
            placeholder="PayPal Payment Link"
          />
          <input
            className="input"
            placeholder="Stripe Payment Link"
          />
          <textarea
            className="input h-24"
            placeholder="Bank details (Account name, number, branch)"
          />

          <textarea
            className="input h-20"
            placeholder="Payment note shown to clients (optional)"
          />
        </div>
      </Section>

      {/* ================= INVOICE ================= */}
      <Section title="Invoice & Business Info">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input" placeholder="Business / Brand Name" />
          <input className="input" placeholder="Currency (USD, EUR, BDT)" />
        </div>

        <textarea
          className="input mt-4 h-24"
          placeholder="Business address"
        />

        <textarea
          className="input mt-4 h-20"
          placeholder="Invoice footer note (thank you message, payment terms)"
        />
      </Section>

      {/* ================= SYSTEM ================= */}
      <Section title="System Preferences">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="input">
            <option>Default Payment Type</option>
            <option>Full Payment</option>
            <option>Installments</option>
            <option>Monthly Retainer</option>
          </select>

          <input
            type="number"
            className="input"
            placeholder="Invoice Due Days (e.g. 7)"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <input type="checkbox" />
          <span className="text-sm text-slate-600">
            Enable email notifications
          </span>
        </div>
      </Section>

      {/* ================= ACTION ================= */}
      <div className="flex justify-end">
        <button className="btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENT ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
