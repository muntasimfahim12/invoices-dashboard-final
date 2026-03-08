/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, Mail, ShieldCheck, RefreshCw,
  Trash2, Search, Shield, Briefcase, ExternalLink,
  ArrowUpRight, Activity, Zap
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function SuperAdminDashboard() {
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"admin" | "client">("admin");

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("vault_token");
      const res = await fetch(`${API_URL}/auth/all-users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) setAllUsers(data);
    } catch (err) {
      toast.error("Database sync failed");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAction = async (requestId: string, action: "active" | "rejected") => {
    if (!window.confirm(`Update status to ${action}?`)) return;
    setActionLoading(requestId);
    try {
      const res = await fetch(`${API_URL}/auth/manage-request`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      if (res.ok) {
        toast.success(`User is now ${action}`);
        fetchUsers();
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("CRITICAL: Delete user permanently?")) return;
    setActionLoading(userId);
    try {
      const token = localStorage.getItem("vault_token");
      const res = await fetch(`${API_URL}/auth/delete-user/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (res.ok) {
        toast.success("User purged from system");
        setAllUsers(allUsers.filter(u => u._id !== userId));
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setActionLoading(null);
    }
  };

  const admins = allUsers.filter(u => u.role === "admin");
  const clients = allUsers.filter(u => u.role === "client");

  const currentList = (activeTab === "admin" ? admins : clients).filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && allUsers.length === 0) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-24 font-sans text-[#0F172A] selection:bg-[#4177BC] selection:text-white">
      <Toaster position="top-right" />

      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">

            <div>

              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] inter-bold">Super Admin Core</span>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="group flex items-center gap-3 px-6 py-2.5 bg-slate-50 text-[#0F172A] text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-[#0F172A] hover:text-white transition-all active:scale-95 border border-slate-100 inter-bold"
          >
            <RefreshCw size={14} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"}`} />
            Sync Database
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 mt-12">
        {/* Page Hero Section */}


        {/* Stats Grid - Premium Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 inter-medium">
          <StatCard
            icon={<Shield />}
            label="Total Admins"
            value={admins.length}
            trend="Verified Entities"
            color="#0F172A"
          />
          <StatCard
            icon={<Briefcase />}
            label="Active Clients"
            value={clients.length}
            trend="Live Partnerships"
            color="#4177BC"
          />
          <StatCard
            icon={<Zap />}
            label="Pending Review"
            value={allUsers.filter(u => u.status === 'pending').length}
            trend="Requires Action"
            color="#EB9C2C"
          />
        </div>

        {/* Action Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10 justify-between items-end lg:items-center">
          <div className="flex bg-slate-100/50 p-1.5 rounded-[24px] border border-slate-100 w-full lg:w-fit backdrop-blur-sm">
            <TabBtn active={activeTab === "admin"} onClick={() => setActiveTab("admin")} label="Administrators" count={admins.length} />
            <TabBtn active={activeTab === "client"} onClick={() => setActiveTab("client")} label="Clients" count={clients.length} />
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4177BC] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search identity..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[22px] text-sm font-bold focus:ring-4 focus:ring-blue-50/50 focus:border-[#4177BC] transition-all shadow-sm outline-none inter-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Data Table - Professional Ledger Look */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] inter-bold">Identity Profile</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center inter-bold">Access Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right inter-bold">Privilege Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {currentList.map((user) => (
                    <motion.tr
                      key={user._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-slate-50/50 transition-all duration-300"
                    >
                      <td className="px-10 py-7">
                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${user.role === 'admin' ? 'bg-[#0F172A]' : 'bg-[#4177BC]'} transition-transform group-hover:scale-105 group-hover:rotate-3`}>
                            {user.name?.[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-lg font-bold text-[#0F172A] judson-bold flex items-center gap-2">
                              {user.name}
                              {user.role === 'admin' && <Shield size={14} className="text-[#4177BC]" />}
                            </div>
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-tight inter-bold mt-1">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-7 text-center">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-10 py-7">
                        <div className="flex justify-end items-center gap-3">
                          {user.status !== 'active' ? (
                            <ManageBtn
                              onClick={() => handleAction(user._id, "active")}
                              icon={<CheckCircle size={16} />}
                              label="Whitelist"
                              variant="success"
                              loading={actionLoading === user._id}
                            />
                          ) : (
                            <ManageBtn
                              onClick={() => handleAction(user._id, "rejected")}
                              icon={<XCircle size={16} />}
                              label="Suspend"
                              variant="warn"
                              loading={actionLoading === user._id}
                            />
                          )}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="w-11 h-11 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-red-100"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {currentList.length === 0 && (
            <div className="py-32 text-center">
              <Activity size={48} className="mx-auto text-slate-100 mb-4 animate-pulse" />
              <p className="text-slate-400 font-bold inter-bold uppercase tracking-widest text-xs">No records found in this sector</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Reusable UI Components (Refined for Premium Look) ---

function StatCard({ icon, label, value, trend, color }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-10 rounded-[45px] bg-white border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group transition-all"
    >
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-6 shadow-sm" style={{ backgroundColor: `${color}10`, color: color }}>
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 inter-bold">{label}</p>
        <div className="flex items-baseline gap-4">
          <p className="text-5xl font-black tracking-tighter inter-bold" style={{ color: color }}>{value}</p>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 inter-bold">{trend}</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-opacity-100 transition-all duration-700" />
    </motion.div>
  );
}

function TabBtn({ active, onClick, label, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-4 py-3.5 px-10 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 inter-bold ${active ? 'bg-white text-[#4177BC] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
    >
      {label}
      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] ${active ? 'bg-blue-50 text-[#4177BC]' : 'bg-slate-200 text-slate-500'}`}>
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    active: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    rejected: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all inter-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function ManageBtn({ onClick, icon, label, variant, loading }: any) {
  const variants: any = {
    success: "bg-slate-50 text-slate-600 hover:bg-[#4177BC] hover:text-white border-slate-100",
    warn: "bg-slate-50 text-slate-600 hover:bg-[#EB9C2C] hover:text-white border-slate-100",
  };
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border inter-bold shadow-sm ${variants[variant]}`}
    >
      {loading ? <RefreshCw className="animate-spin" size={14} /> : icon}
      {label}
    </button>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white p-12 space-y-12 animate-pulse">
      <div className="h-20 w-full bg-slate-50 rounded-[30px]" />
      <div className="h-40 w-1/2 bg-slate-50 rounded-[40px]" />
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-slate-50 rounded-[45px]" />)}
      </div>
      <div className="h-96 w-full bg-slate-50 rounded-[40px]" />
    </div>
  );
}