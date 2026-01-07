"use client";

import ActionButton from "@/src/components/adminDashboard/ActionButton";
import InvoiceTable from "@/src/components/adminDashboard/InvoiceTable";
import ListItem from "@/src/components/adminDashboard/ListItem";
import SectionTitle from "@/src/components/adminDashboard/SectionTitle";
import StatCard from "@/src/shared/StatCard";



export default function AdminOverview() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 mt-2">
          Quick summary of clients, projects, invoices and payments.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$12,500" />
        <StatCard title="Total Due" value="$3,200" />
        <StatCard title="Active Clients" value="18" />
        <StatCard title="Active Projects" value="9" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <SectionTitle title="Recent Clients" />
          <ul className="space-y-3">
            <ListItem title="Infinity Wellness" meta="Active" />
            <ListItem title="TX Pavers & Turf" meta="Active" />
            <ListItem title="Jordan Eagle Transport" meta="Pending Payment" />
          </ul>
        </div>

        <div className="card">
          <SectionTitle title="Active Projects" />
          <ul className="space-y-3">
            <ListItem title="Website Redesign" meta="$3,000 • Installments" />
            <ListItem title="SEO Monthly Retainer" meta="$800 / month" />
            <ListItem title="Mobile App UI" meta="Final stage" />
          </ul>
        </div>

        <div className="card">
          <SectionTitle title="Payments Status" />
          <ul className="space-y-3">
            <ListItem title="Paid Invoices" meta="24" />
            <ListItem title="Pending Invoices" meta="6" />
            <ListItem title="Overdue Invoices" meta="3" />
          </ul>
        </div>
      </div>

      {/* INVOICES */}
      <div className="card">
        <SectionTitle title="Recent Invoices" />
        <InvoiceTable />
      </div>

      {/* ACTIONS */}
      <div className="card">
        <SectionTitle title="Quick Actions" />
        <div className="flex flex-wrap gap-4">
          <ActionButton label="Add Client" />
          <ActionButton label="Create Project" />
          <ActionButton label="Create Invoice" />
          <ActionButton label="Record Payment" />
        </div>
      </div>
    </div>
  );
}
