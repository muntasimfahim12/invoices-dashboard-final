/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// Recharts import
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import ActionButton from "../../../components/adminDashboard/ActionButton";
import InvoiceTable from "../../../components/adminDashboard/InvoiceTable";
import ListItem from "../../../components/adminDashboard/ListItem";
import SectionTitle from "../../../components/adminDashboard/SectionTitle";
import StatCard from "@/src/shared/StatCard"; 
import { 
  LayoutDashboard, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  ChevronDown,
  ShieldCheck,
  PieChart as PieIcon
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function AdminOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");

  const [dashboardData, setDashboardData] = useState({
    invoices: [] as any[],
    clients: [] as any[],
    projects: [] as any[]
  });

  // --- Admin Info ---
  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    if (savedName) setAdminName(savedName);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("vault_token");
    Cookies.remove("user_role");
    router.push("/");
  };

  const handleActionClick = (label: string) => {
    const routes: Record<string, string> = {
      "Add Client": "/admin/create-client",
      "Create Project": "/admin/projects/create",
      "Create Invoice": "/admin/invoices/create",
      "Record Payment": "/admin/payments/add"
    };
    const targetPath = routes[label];
    if (targetPath) router.push(targetPath);
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

  // --- Invoice Status Chart Logic ---
  const invoiceStatusData = useMemo(() => {
    const inv = dashboardData.invoices;
    return [
      { name: 'Paid', value: inv.filter((i) => i.status === 'Paid').length, color: '#4177BC' },
      { name: 'Pending', value: inv.filter((i) => i.status === 'Pending').length, color: '#EB9C2C' },
      { name: 'Overdue', value: inv.filter((i) => i.status === 'Overdue').length, color: '#EF4444' },
    ];
  }, [dashboardData.invoices]);

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
      
      {/* ================= MODERN NAV BAR ================= */}
      <nav className="">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg">V</div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter">VAULT<span className="text-[#4177BC]">.</span></h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification */}
            <button className="p-2 text-slate-400 hover:text-slate-900 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#4177BC] rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 pr-3 hover:bg-slate-50 rounded-full border border-slate-100 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-[#4177BC] flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                <p className="hidden md:block text-sm font-bold text-slate-700">{adminName}</p>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-slate-50 py-2 z-20 animate-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                      <p className="text-xs font-black text-[#4177BC] uppercase tracking-widest">Admin Access</p>
                      <p className="text-sm font-bold text-slate-900">{adminName}</p>
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><User size={16} /> My Profile</button>
                    <button onClick={() => router.push("/admin/settings")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"><Settings size={16} /> Settings</button>
                    <div className="h-px bg-slate-50 my-1 mx-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 font-semibold transition-colors"><LogOut size={16} /> Logout</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= CONTENT AREA ================= */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-12">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} trend="+12%" icon="revenue" compact />
          <StatCard title="Total Due" value={`$${stats.due.toLocaleString()}`} trend="Urgent" icon="due" color="#EB9C2C" compact />
          <StatCard title="Active Clients" value={stats.clientCount.toString()} trend="Active" icon="clients" compact />
          <StatCard title="Active Projects" value={stats.projectCount.toString()} trend="On Track" icon="projects" compact />
        </div>

        {/* --- TOP GRID (3 Cards + Added Chart Below) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
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

        {/* ================= MODERN PIE CHART SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 md:gap-8 mb-12">
            <div className="premium-card group flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[#4177BC]/10 rounded-lg text-[#4177BC]">
                        <PieIcon size={20} />
                      </div>
                      <SectionTitle title="Invoice Distribution Analysis" />
                   </div>
                   <p className="text-slate-500 text-sm font-medium mb-8">
                      Visual breakdown of your invoice lifecycle. Monitor paid, pending, and overdue statuses in real-time to manage cash flow effectively.
                   </p>
                   <div className="grid grid-cols-3 gap-4">
                      {invoiceStatusData.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.name}</p>
                           <p className="text-xl font-black text-slate-900">{item.value}</p>
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="w-full md:w-1/2 h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {invoiceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px' }}
                        itemStyle={{ fontWeight: '800', fontSize: '12px' }}
                      />
                      <Legend 
                        verticalAlign="middle" 
                        align="right" 
                        layout="vertical"
                        iconType="circle"
                        wrapperStyle={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* --- INVOICES TABLE --- */}
        <div className="premium-card mb-12 overflow-hidden">
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
        <section className="bg-white rounded-[35px] md:rounded-[45px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
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
      </div>

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
    </div>
  );
}