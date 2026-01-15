/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // রাউটিং এর জন্য ইমপোর্ট
import ActionButton from "../../../components/adminDashboard/ActionButton";
import InvoiceTable from "../../../components/adminDashboard/InvoiceTable";
import ListItem from "../../../components/adminDashboard/ListItem";
import SectionTitle from "../../../components/adminDashboard/SectionTitle";
import StatCard from "@/src/shared/StatCard"; 
import { LayoutDashboard, TrendingUp, PlusCircle, ArrowUpRight } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function AdminOverview() {
  const router = useRouter(); // রাউটার ইনিশিয়ালাইজ
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    invoices: [] as any[],
    clients: [] as any[],
    projects: [] as any[]
  });

  // --- বাটন ক্লিক হ্যান্ডলার ---
  const handleActionClick = (label: string) => {
    const routes: Record<string, string> = {
      "Add Client": "/admin/create-client",
      "Create Project": "/admin/projects/create",
      "Create Invoice": "/admin/invoices/create",
      "Record Payment": "/admin/payments/add"
    };

    const targetPath = routes[label];
    if (targetPath) {
      router.push(targetPath);
    }
  };

  const fetchAllData = useCallback(async () => {
    if (!API_BASE) return;
    try {
      setLoading(true);
      const [invoiceRes, clientRes] = await Promise.all([
        axios.get(`${API_BASE}/invoices`),
        axios.get(`${API_BASE}/clinets`) 
      ]);

      const projectsList: any[] = [];
      const clients = Array.isArray(clientRes.data) ? clientRes.data : [];
      
      clients.forEach((c: any) => {
        if (c.projects) c.projects.forEach((p: any) => 
          projectsList.push({ ...p, clientName: c.name || "Unknown" })
        );
      });

      setDashboardData({
        invoices: Array.isArray(invoiceRes.data) ? invoiceRes.data : [],
        clients: clients,
        projects: projectsList
      });
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const stats = useMemo(() => {
    const inv = dashboardData.invoices;
    const totalRev = inv.reduce((sum, i) => sum + (Number(i.receivedAmount) || 0), 0);
    const totalDue = inv.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0) - totalRev;

    return {
      revenue: totalRev,
      due: totalDue,
      clientCount: dashboardData.clients.length,
      projectCount: dashboardData.projects.length,
    };
  }, [dashboardData]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-10 font-sans animate-in fade-in duration-700">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-6 px-4 md:px-0">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#4177BC]/10 rounded-xl text-[#4177BC]">
              <LayoutDashboard size={20} />
            </div>
            <span className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.2em]">Management Console</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Dashboard <span className="text-[#4177BC]">Overview</span>
          </h1>
          <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl">
            Quick summary of clients, projects, invoices and payments.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm w-fit">
          <div className="relative flex h-3 w-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">System Status</p>
            <p className="text-sm font-extrabold text-slate-700 mt-1">Live Updates Active</p>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12 px-4 md:px-0">
        <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} trend="+12%" icon="revenue" compact />
        <StatCard title="Total Due" value={`$${stats.due.toLocaleString()}`} trend="Urgent" icon="due" color="#EB9C2C" compact />
        <StatCard title="Active Clients" value={stats.clientCount.toString()} trend="Active" icon="clients" compact />
        <StatCard title="Active Projects" value={stats.projectCount.toString()} trend="On Track" icon="projects" compact />
      </div>

      {/* --- TOP GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 px-4 md:px-0">
        <div className="premium-card group">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Recent Clients" />
            <ArrowUpRight className="text-slate-300 group-hover:text-[#4177BC] transition-colors" size={20} />
          </div>
          <div className="space-y-2">
            {dashboardData.clients.slice(0, 3).map((c, i) => (
              <ListItem key={i} title={c.name} meta="Active" />
            ))}
          </div>
        </div>

        <div className="premium-card group">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Active Projects" />
            <ArrowUpRight className="text-slate-300 group-hover:text-[#4177BC] transition-colors" size={20} />
          </div>
          <div className="space-y-2">
            {dashboardData.projects.slice(0, 3).map((p, i) => (
              <ListItem key={i} title={p.name} meta={p.clientName} />
            ))}
          </div>
        </div>

        <div className="premium-card group">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Payments Status" />
            <TrendingUp className="text-[#EB9C2C]" size={20} />
          </div>
          <div className="space-y-2">
            <ListItem title="Paid Invoices" meta={`${dashboardData.invoices.filter(inv => inv.status === 'Paid').length} Total`} />
            <ListItem title="Pending Invoices" meta={`${dashboardData.invoices.filter(inv => inv.status === 'Pending').length} Awaiting`} />
            <ListItem title="Overdue Invoices" meta={`${dashboardData.invoices.filter(inv => inv.status === 'Overdue').length} Urgent`} />
          </div>
        </div>
      </div>

      {/* --- INVOICES TABLE --- */}
      <div className="premium-card mb-12 overflow-hidden mx-4 md:mx-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <SectionTitle title="Recent Invoices" />
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
            Last 30 Days Data
          </div>
        </div>
        <div className="w-full overflow-x-auto">
           <InvoiceTable data={dashboardData.invoices.slice(0, 5)} />
        </div>
      </div>

      {/* --- QUICK ACTIONS SECTION --- */}
      <section className="bg-white rounded-[35px] md:rounded-[45px] p-8 md:p-12 shadow-2xl relative overflow-hidden mx-4 md:mx-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4177BC] opacity-10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <PlusCircle className="text-[#EB9C2C]" size={32} />
            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight uppercase italic">Quick Actions</h2>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-6">
            {["Add Client", "Create Project", "Create Invoice", "Record Payment"].map((label) => (
              <div 
                key={label} 
                onClick={() => handleActionClick(label)} 
                className="cursor-pointer active:scale-95 transition-transform"
              >
                <ActionButton label={label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .premium-card {
          background: #FFFFFF;
          border-radius: 28px;
          border: 1px solid #F1F5F9;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (min-width: 768px) {
          .premium-card { border-radius: 35px; padding: 2rem; }
        }
        .premium-card:hover {
          box-shadow: 0 30px 60px -15px rgba(65, 119, 188, 0.12);
          transform: translateY(-4px);
          border-color: #4177BC20;
        }
      `}</style>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-10">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-12 w-64 bg-slate-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-[28px] shadow-sm" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[28px] shadow-sm" />)}
      </div>
    </div>
  );
}