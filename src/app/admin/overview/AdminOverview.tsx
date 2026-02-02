/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import InvoiceTable from "../../../components/adminDashboard/InvoiceTable";
import ListItem from "../../../components/adminDashboard/ListItem";
import SectionTitle from "../../../components/adminDashboard/SectionTitle";
import StatCard from "@/src/shared/StatCard";
import {
  LogOut,
  Bell,
  CircleUserRound,
  ArrowRight,
  ShieldCheck,
  Plus,
  TrendingUp,
  Users,
  LayoutDashboard,
  Wallet,
  ArrowUpRight,
  Settings,
  Activity
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
    const savedId = localStorage.getItem("user_id");
    if (savedName) setAdminData({ name: savedName, id: savedId || "" });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("vault_token");
    Cookies.remove("user_role");
    router.push("/");
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

  const chartData = useMemo(() => {
    const inv = dashboardData.invoices;
    return [
      { name: 'Collected', value: inv.filter(i => i.status === 'Paid').length || 0, color: '#4177BC' },
      { name: 'Pending', value: inv.filter(i => i.status !== 'Paid').length || 0, color: '#EB9C2C' },
    ].filter(item => item.value > 0);
  }, [dashboardData.invoices]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans text-[#0F172A] selection:bg-[#4177BC] selection:text-white">
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-12">
             <span className="text-2xl font-black tracking-tighter text-[#4177BC] judson-bold">Genie oVerview</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 text-slate-400 hover:text-[#4177BC] hover:bg-slate-50 rounded-full transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-8 bg-slate-100 mx-2 hidden md:block"></div>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 p-1 bg-white rounded-full border border-slate-200 transition-all hover:shadow-md active:scale-95"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4177BC] to-[#2D5A91] flex items-center justify-center text-white text-xs font-black inter-bold">
                  {adminData.name.substring(0, 2).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-72 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-4 z-50 animate-scaleIn">
                  <div className="px-4 py-4 mb-3 bg-slate-50 rounded-[20px]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 inter-bold">System Administrator</p>
                    <p className="text-sm font-extrabold text-[#0F172A] truncate inter-semibold">{adminData.name}</p>
                  </div>
                  <nav className="space-y-1">
                    <button onClick={() => router.push(`/admin/profile/${localStorage.getItem("user_id")}`)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#4177BC] hover:bg-[#4177BC]/5 rounded-xl transition-all inter-medium">
                      <CircleUserRound size={18} /> My Account
                    </button>
                    <button onClick={() => router.push('/admin/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-[#4177BC] hover:bg-[#4177BC]/5 rounded-xl transition-all inter-medium">
                      <Settings size={18} /> System Settings
                    </button>
                    <div className="h-px bg-slate-100 my-2 mx-2"></div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-extrabold text-red-500 hover:bg-red-50 rounded-xl transition-all inter-bold">
                      <LogOut size={18} /> Sign Out
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 mt-12">
        <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          <div className="animate-scaleIn">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4177BC]/5 rounded-full mb-8 border border-[#4177BC]/10">
              <span className="w-2 h-2 bg-[#4177BC] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] inter-bold">Enterprise Financial Hub v2.0</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#0F172A] tracking-tighter leading-[0.9] mb-8 judson-bold">
              Billing 
              <span className="text-slate-300">Simplified.</span>
            </h1>
            <p className="max-w-md text-slate-500 text-xl font-medium leading-relaxed inter-medium">
              Experience the next generation of financial management. Precise, secure, and built for scale.
            </p>
          </div>
          <div className="hidden lg:flex justify-end">
            <div className="relative w-80 h-80 bg-slate-50 rounded-[60px] flex items-center justify-center border border-slate-100 rotate-3">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#EB9C2C] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#4177BC] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="text-center p-8">
                <p className="text-5xl font-black text-[#0F172A] judson-bold">${stats.revenue.toLocaleString()}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 inter-bold">Total Net Capital</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 inter-medium">
          <StatCard title="Capital Inflow" value={`$${stats.revenue.toLocaleString()}`} icon="revenue" />
          <StatCard title="Unpaid Debt" value={`$${stats.due.toLocaleString()}`} color="#EB9C2C" icon="due" />
          <StatCard title="Strategic Partners" value={stats.clientCount.toString()} icon="clients" />
          <StatCard title="Active Projects" value={stats.projectCount.toString()} icon="projects" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
            <div className="bg-white">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-bold tracking-tighter text-[#0F172A] judson-bold">Financial Ledger</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-2 inter-bold">Live billing repository</p>
                </div>
                <button
                  onClick={() => router.push("/admin/invoices")}
                  className="group flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all inter-bold"
                >
                  View Archive <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
              <div className="overflow-hidden rounded-[40px] border border-slate-100 shadow-sm judson-bold">
                <InvoiceTable data={dashboardData.invoices.slice(0, 6)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-[#F8FAFC] p-12 rounded-[50px] text-white hover:shadow-2xl hover:shadow-[#0F172A]/20 transition-all duration-500">
                <div className="w-14 h-14 bg-[#4177BC] rounded-2xl flex items-center justify-center mb-10 rotate-3 group-hover:rotate-0 transition-transform">
                  <TrendingUp size={28} />
                </div>
                <h3 className="text-3xl text-black font-bold tracking-tight mb-4 leading-tight judson-bold">Momentum <br /> Analysis</h3>
                <div className="text-5xl font-black text-[#4177BC] mb-2 inter-bold">{stats.projectCount}</div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest inter-bold">Active High-Value Contracts</p>
              </div>

              <div className="group bg-[#F8FAFC] p-12 rounded-[50px] border border-slate-100 hover:border-[#4177BC]/30 transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#EB9C2C] mb-10 shadow-sm border border-slate-100 group-hover:-rotate-3 transition-transform">
                  <Wallet size={28} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-4 leading-tight judson-bold">Outstanding <br /> Liquidity</h3>
                <div className="text-5xl font-black text-[#0F172A] mb-2 inter-bold">${stats.due.toLocaleString()}</div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#EB9C2C] inter-bold">Pending Receivables</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-16">
            <div className="bg-white rounded-[50px] border border-slate-100 p-10 shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 inter-bold">Cash Intel</h3>
              <div className="h-[280px] w-full scale-110">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={85} outerRadius={110} paddingAngle={10} dataKey="value">
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10">
                {chartData.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-[24px]">
                    <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: item.color }} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 inter-bold">{item.name}</p>
                    <p className="text-lg font-black inter-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 pl-4 inter-bold">Quick Operations</h3>
              {[
                { label: "New Invoice", route: "/admin/invoices/create", icon: <Plus size={20} /> },
                { label: "Add Client", route: "/admin/create-client", icon: <Users size={20} /> },
                { label: "Start Project", route: "/admin/projects/create", icon: <ShieldCheck size={20} /> }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => router.push(item.route)}
                  className="w-full group flex items-center justify-between p-7 bg-white border border-slate-100 rounded-[32px] hover:border-[#4177BC] transition-all duration-300 hover:shadow-2xl hover:shadow-slate-100"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-[#4177BC]/10 group-hover:text-[#4177BC] transition-all">{item.icon}</div>
                    <span className="text-base font-black text-[#0F172A] tracking-tight inter-bold">{item.label}</span>
                  </div>
                  <ArrowRight size={20} className="text-slate-200 group-hover:text-[#4177BC] group-hover:translate-x-2 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-[50px] p-10 border border-slate-100/50 mt-6 judson-bold">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 inter-bold">Key Partners</h3>
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <Users size={18} className="text-[#4177BC]" />
            </div>
          </div>
          <div className="space-y-8">
            {dashboardData.clients.slice(0, 4).map((c, i) => (
              <ListItem key={i} title={c.name} meta={c.email || "Premier Client"} />
            ))}
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0F172A] text-white p-5 rounded-[24px] shadow-2xl border border-white/10 backdrop-blur-xl scale-110">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] mb-2 inter-bold">{payload[0].name}</p>
        <p className="text-2xl font-black inter-bold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white p-12 space-y-16 animate-pulse">
      <div className="h-20 w-full bg-slate-50 rounded-[30px]" />
      <div className="h-64 w-2/3 bg-slate-50 rounded-[60px]" />
      <div className="grid grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[40px]" />)}
      </div>
    </div>
  );
}