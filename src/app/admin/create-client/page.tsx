/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

export default function CreateClientPage() {
  const [paymentType, setPaymentType] = useState("full");
  const [milestones, setMilestones] = useState([
    { title: "", amount: "", dueDate: "" },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", amount: "", dueDate: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto  py-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Create New Client</h1>
        <p className="text-slate-500 mt-2">
          Full control over client, project, and payment flow.
        </p>
      </div>

      {/* CLIENT INFO */}
      <Section title="Client Information" subtitle="Client or company details">
        <Grid>
          <input className="input" placeholder="Client Name / Company" />
          <input className="input" type="email" placeholder="Client Email" />
          <input className="input" placeholder="Phone (optional)" />
          <input className="input" placeholder="Address (optional)" />
        </Grid>
        <textarea
          className="input mt-4 h-24"
          placeholder="Internal notes (admin only)"
        />
      </Section>

      {/* CLIENT LOGIN */}
      <Section
        title="Client Portal Access"
        subtitle="Credentials for client login"
      >
        <Grid>
          <input className="input" type="email" placeholder="Login Email" />
          <input
            className="input"
            type="password"
            placeholder="Temporary Password"
          />
        </Grid>
      </Section>

      {/* PROJECT */}
      <Section title="Project Details" subtitle="Scope & total budget">
        <Grid>
          <input className="input" placeholder="Project Name" />
          <input
            className="input"
            type="number"
            placeholder="Total Project Budget"
          />
        </Grid>
        <textarea
          className="input mt-4 h-24"
          placeholder="Project description / services"
        />
      </Section>

      {/* PAYMENT CONFIG */}
      <Section
        title="Payment Configuration"
        subtitle="Choose how you want to get paid"
      >
        <select
          className="input mb-6"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="full">Full Payment</option>
          <option value="monthly">Monthly Retainer</option>
          <option value="installment">Custom Installments (Milestones)</option>
        </select>

        {/* INSTALLMENT – FULL FREELANCER CONTROL */}
        {paymentType === "installment" && (
          <div className="space-y-5">
            <p className="text-sm text-slate-500">
              Define custom payment milestones (you decide how & when you get
              paid).
            </p>

            {milestones.map((m, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
              >
                {/* TITLE */}
                <input
                  className="input"
                  placeholder="Title (e.g. After half work)"
                />

                {/* AMOUNT */}
                <input className="input" type="number" placeholder="Amount" />

                {/* DUE DATE */}
                <input className="input" type="date" />

                {/* REMOVE */}
                {milestones.length > 1 && (
                  <button
                    onClick={() => removeMilestone(index)}
                    className="icon-btn w-full md:w-auto"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addMilestone}
              className="flex items-center gap-2 text-blue-600 text-sm font-medium"
            >
              + Add another payment step
            </button>
          </div>
        )}

        {paymentType === "monthly" && (
          <input
            className="input"
            type="number"
            placeholder="Monthly payment amount"
          />
        )}
      </Section>

      {/* INITIAL PAYMENT */}
      <Section
        title="Initial Payment (Optional)"
        subtitle="Record payment already received"
      >
        <Grid>
          <input className="input" type="number" placeholder="Amount Paid" />
          <select className="input">
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>PayPal</option>
            <option>Stripe</option>
          </select>
        </Grid>
      </Section>

      {/* ACTION */}
      <div className="flex justify-end gap-4 mt-12">
        <button className="btn-secondary">Cancel</button>
        <button className="btn-primary">Create Client & Project</button>
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, subtitle, children }: any) {
  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mb-5">{subtitle}</p>
      {children}
    </section>
  );
}

function Grid({ children }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  );
}
