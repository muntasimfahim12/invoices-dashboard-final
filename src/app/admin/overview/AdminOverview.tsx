/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
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
  PieChart as PieIcon,
  CircleUserRound
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function AdminOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [adminData, setAdminData] = useState({ name: "Admin", id: "" });

  const [dashboardData, setDashboardData] = useState({
    invoices: [] as any[],
    clients: [] as any[],
    projects: [] as any[]
  });

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    const savedId = localStorage.getItem("user_id"); // Ensure your login saves user_id
    if (savedName) setAdminData({ name: savedName, id: savedId || "" });
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
      const email = localStorage.getItem("user_email");
      const role = localStorage.getItem("user_role") || "admin";

      const [invoiceRes, clientRes] = await Promise.all([
        axios.get(`${API_BASE}/invoices`, { params: { email, role } }),
        axios.get(`${API_BASE}/clinets`, { params: { email, role } })
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
    } catch (err: any) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const invoiceStatusData = useMemo(() => {
    const inv = dashboardData.invoices;
    return [
      { name: 'Paid', value: inv.filter((i) => i.status === 'Paid').length || 0, color: '#4177BC' },
      { name: 'Pending', value: inv.filter((i) => i.status === 'Unpaid' || i.status === 'Pending').length || 0, color: '#EB9C2C' },
      { name: 'Overdue', value: inv.filter((i) => i.status === 'Overdue').length || 0, color: '#0F172A' },
    ].filter(item => item.value > 0 || inv.length === 0);
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
    <div className="min-h-screen bg-[#FFFFFF] pb-20 font-sans selection:bg-[#4177BC]/10">

      {/* ================= PREMIUM NAVBAR ================= */}
      <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/admin")}>
            <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
              <span className="font-black text-xl italic">V</span>
            </div>
            <h2 className="text-xl font-black text-[#0F172A] tracking-tighter uppercase">Vault<span className="text-[#4177BC]">.</span></h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-[#4177BC] transition-colors">
              <Bell size={22} strokeWidth={1.5} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EB9C2C] rounded-full ring-2 ring-white"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#4177BC] flex items-center justify-center text-white shadow-lg shadow-[#4177BC]/20">
                  <User size={16} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-[#0F172A] hidden md:block">{adminData.name}</span>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-2 z-20 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-4 mb-2 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-[#4177BC] uppercase tracking-widest mb-1">Authenticated Admin</p>
                      <p className="text-sm font-bold text-[#0F172A] truncate">{adminData.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        const userId = localStorage.getItem("user_id");
                        if (userId) {
                          router.push(`/admin/profile/${userId}`);
                        } else {
                          // যদি আইডি না থাকে তবে সেশনে সমস্যা আছে, পুনরায় লগইন দরকার
                          alert("Session expired. Please login again.");
                          router.push("/");
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-[#4177BC] hover:bg-[#4177BC]/5 rounded-xl transition-all"
                    >
                      <CircleUserRound size={18} /> My Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:text-[#4177BC] hover:bg-[#4177BC]/5 rounded-xl transition-all">
                      <Settings size={18} /> Settings
                    </button>
                    <div className="h-px bg-slate-100 my-2 mx-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-[1600px] mx-auto px-6 md:px-12 pt-12">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#4177BC]/5 rounded-full text-[#4177BC] mb-4">
              <LayoutDashboard size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tighter leading-[0.9]">
              Operations <span className="text-[#4177BC]">Hub.</span>
            </h1>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-white border border-slate-100 p-4 px-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black text-[#EB9C2C] uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-[#0F172A]">System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard title="Revenue" value={`$${stats.revenue.toLocaleString()}`} icon="revenue" compact />
          <StatCard title="Due Balance" value={`$${stats.due.toLocaleString()}`} color="#EB9C2C" icon="due" compact />
          <StatCard title="Client Base" value={stats.clientCount.toString()} icon="clients" compact />
          <StatCard title="Ongoing Projects" value={stats.projectCount.toString()} icon="projects" compact />
        </div>

        {/* CHART & ANALYSIS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
          <div className="xl:col-span-2 premium-card">
            <div className="flex items-center justify-between mb-12">
              <div>
                <SectionTitle title="Cash Flow Intelligence" />
                <p className="text-slate-400 text-xs font-medium mt-1">Invoice lifecycle distribution for current quarter</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-[#4177BC]">
                <PieIcon size={24} />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 h-[350px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      innerRadius={90}
                      outerRadius={125}
                      paddingAngle={12}
                      dataKey="value"
                      stroke="none"
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-4xl font-black text-[#0F172A]">{dashboardData.invoices.length}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Invoices</p>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                {invoiceStatusData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-default group">
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="font-bold text-[#0F172A] text-sm">{item.name}</span>
                    </div>
                    <span className="font-black text-[#0F172A] group-hover:text-[#4177BC] transition-colors">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="premium-card !bg-[#0F172A] text-white">
              <SectionTitle title="Direct Actions" />
              <div className="grid grid-cols-1 gap-3 mt-8">
                {["Create Invoice", "Add Client", "Create Project"].map((label) => (
                  <button
                    key={label}
                    onClick={() => handleActionClick(label)}
                    className="flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-[#4177BC] rounded-2xl transition-all group"
                  >
                    <span className="text-sm font-bold">{label}</span>
                    <PlusCircle size={18} className="text-[#EB9C2C] group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>

            <div className="premium-card">
              <SectionTitle title="New Clients" />
              <div className="mt-8 space-y-2">
                {dashboardData.clients.slice(0, 3).map((c, i) => (
                  <ListItem key={i} title={c.name} meta={c.email || "Primary Client"} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RECENT TABLE */}
        <div className="premium-card mb-16 overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <SectionTitle title="Recent Transactions" />
            <button
              onClick={() => router.push("/admin/invoices")}
              className="px-6 py-2.5 bg-slate-50 hover:bg-[#4177BC] hover:text-white rounded-xl text-xs font-black transition-all"
            >
              VIEW REPOSITORY
            </button>
          </div>
          <div className="w-full">
            <InvoiceTable data={dashboardData.invoices.slice(0, 6)} />
          </div>
        </div>

      </main>

      <style jsx global>{`
        .premium-card {
          background: #FFFFFF;
          border-radius: 40px;
          border: 1px solid #F1F5F9;
          padding: 2.5rem;
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .premium-card:hover {
          box-shadow: 0 40px 80px -20px rgba(65, 119, 188, 0.08);
          transform: translateY(-8px);
          border-color: #4177BC20;
        }
      `}</style>
    </div>
  );
}

// Custom Tooltip for Chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] text-white p-4 rounded-2xl shadow-2xl border border-white/10">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{payload[0].name}</p>
        <p className="text-xl font-black">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white p-12 space-y-12">
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-4 w-32 bg-slate-100 rounded-full" />
        <div className="h-16 w-96 bg-slate-100 rounded-3xl" />
      </div>
      <div className="grid grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[40px]" />)}
      </div>
      <div className="h-96 bg-slate-50 rounded-[40px]" />
    </div>
  );
}
  