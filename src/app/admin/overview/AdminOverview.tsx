/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, PlusCircle, ArrowUpRight, 
  Search, RefreshCw, Calendar, Users, Briefcase, DollarSign,
  AlertCircle, ChevronRight, Activity
} from "lucide-react";

// Components
import ActionButton from "../../../components/adminDashboard/ActionButton";
import InvoiceTable from "../../../components/adminDashboard/InvoiceTable";
import ListItem from "../../../components/adminDashboard/ListItem";
import SectionTitle from "../../../components/adminDashboard/SectionTitle";
import StatCard from "@/src/shared/StatCard"; 

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function AdminOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardData, setDashboardData] = useState({
    invoices: [] as any[],
    clients: [] as any[],
    projects: [] as any[]
  });

  // --- ১. ডাইনামিক রাউটিং লজিক ---
  const handleActionClick = (label: string) => {
    const routes: Record<string, string> = {
      "Add Client": "/admin/create-client",
      "Create Project": "/admin/invoices/create",
      "Create Invoice": "/admin/invoices/create",
      "Record Payment": "/admin/payments/add"
    };

    const targetPath = routes[label];
    if (targetPath) {
      router.push(targetPath);
    } else {
      const slug = label.toLowerCase().split(" ").join("-");
      router.push(`/admin/${slug}`);
    }
  };

  // --- ২. ডাটা ফেচিং ---
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

  // --- ৩. এনালাইটিক্স ক্যালকুলেশন ---
  const stats = useMemo(() => {
    const inv = dashboardData.invoices;
    const totalRev = inv.reduce((sum, i) => sum + (Number(i.receivedAmount) || 0), 0);
    const totalDue = inv.reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0) - totalRev;

    const filteredInvoices = inv.filter(i => 
      i.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      revenue: totalRev,
      due: totalDue,
      clientCount: dashboardData.clients.length,
      projectCount: dashboardData.projects.length,
      recentInvoices: filteredInvoices.slice(0, 5)
    };
  }, [dashboardData, searchQuery]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-10 font-sans animate-in fade-in duration-1000">
      
      {/* --- HEADER --- */}
      <header className="px-4 md:px-0 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#4177BC] rounded-2xl text-white shadow-lg">
              <Activity size={22} />
            </div>
            <p className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.25em]">Management Core</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            Admin <span className="text-[#4177BC]">Control</span>
          </h1>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 bg-white p-2 rounded-[25px] border border-slate-100 shadow-sm">
           <button onClick={fetchAllData} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all hover:rotate-180 duration-700">
             <RefreshCw size={20} />
           </button>
           <div className="h-8 w-[1px] bg-slate-100 mx-2" />
           <div className="flex items-center gap-3 pr-4">
              <Calendar className="text-[#4177BC]" size={18} />
              <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
           </div>
        </div>
      </header>

      {/* --- KPI STATS --- */}
      <div className="px-4 md:px-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} trend="+14% Month" icon="revenue" color="#4177BC" compact />
        <StatCard title="Total Due" value={`$${stats.due.toLocaleString()}`} trend="Overdue" icon="due" color="#EB9C2C" compact />
        <StatCard title="Partners" value={stats.clientCount} trend="Active" icon="clients" color="#6366F1" compact />
        <StatCard title="Projects" value={stats.projectCount} trend="Live" icon="projects" color="#10B981" compact />
      </div>

      {/* --- MAIN GRID --- */}
      <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 premium-card overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
            <SectionTitle title="Live Invoice Ledger" />
            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC]" size={16} />
              <input 
                type="text"
                placeholder="Search invoices..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <InvoiceTable data={stats.recentInvoices} />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="premium-card">
            <div className="flex justify-between items-center mb-8">
              <SectionTitle title="Newest Ventures" />
              <ArrowUpRight size={18} className="text-[#4177BC]" />
            </div>
            <div className="space-y-4">
              {dashboardData.projects.slice(-4).reverse().map((p, i) => (
                <ListItem key={i} title={p.name} meta={p.clientName} />
              ))}
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-[40px] p-10 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-4 -top-4 p-8 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <TrendingUp size={100} />
            </div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Executive Tip</p>
            <h4 className="text-xl font-bold mb-8 leading-tight italic tracking-tight">Clear pending dues to boost cash flow.</h4>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase bg-[#4177BC] px-6 py-4 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-lg">
              View Strategy <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* --- QUICK ACTION CENTER --- */}
      <section className="mx-4 md:mx-0 bg-white rounded-[50px] p-8 md:p-20 shadow-2xl border border-slate-50 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full blur-[100px] -ml-24 -mb-24 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-[#EB9C2C] mb-6 shadow-inner">
               <PlusCircle size={32} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Control Panel</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Business Operations</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Add Client", "Create Project", "Create Invoice", "Record Payment"].map((label) => (
              <div key={label} onClick={() => handleActionClick(label)} className="cursor-pointer group active:scale-95 transition-transform">
                 <ActionButton label={label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .premium-card {
          background: #FFFFFF;
          border-radius: 40px;
          border: 1px solid #F1F5F9;
          padding: 2.5rem;
          box-shadow: 0 10px 40px -15px rgba(0, 0, 0, 0.04);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @media (max-width: 768px) {
          .premium-card { padding: 1.5rem; border-radius: 30px; }
        }
        .premium-card:hover {
          box-shadow: 0 40px 80px -20px rgba(65, 119, 188, 0.1);
          transform: translateY(-6px);
          border-color: #4177BC25;
        }
      `}</style>
    </div>
  );
}

// --- নতুন ও উন্নত Skeleton Loader (মোবাইল ফ্রেন্ডলি) ---
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-10">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-32 bg-slate-200 rounded-full" />
        <div className="h-12 w-64 bg-slate-200 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="h-10 w-10 bg-slate-100 rounded-xl mb-4" />
             <div className="h-4 w-24 bg-slate-100 rounded-full mb-3" />
             <div className="h-8 w-32 bg-slate-50 rounded-full" />
             <div className="shimmer-effect" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-[450px] bg-white rounded-[40px] border border-slate-100 p-8 relative overflow-hidden">
          <div className="h-6 w-48 bg-slate-100 rounded-full mb-10" />
          <div className="space-y-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-slate-50 rounded-2xl w-full" />)}
          </div>
          <div className="shimmer-effect" />
        </div>
        <div className="lg:col-span-4 h-[450px] bg-white rounded-[40px] border border-slate-100 p-8">
            <div className="h-6 w-32 bg-slate-100 rounded-full mb-10" />
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="h-14 w-14 bg-slate-100 rounded-2xl shrink-0" />
                  <div className="w-full space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                    <div className="h-3 bg-slate-50 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      <style jsx>{`
        .shimmer-effect {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transform: translateX(-100%);
          animation: loading-shimmer 2s infinite;
        }
        @keyframes loading-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}