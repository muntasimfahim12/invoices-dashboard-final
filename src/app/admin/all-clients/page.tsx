/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, UserPlus, MoreVertical, Mail,
  ShieldCheck, AlertCircle, Settings, Trash2, Ban, ChevronRight, Filter, RefreshCcw
} from "lucide-react";

export default function AllClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Backend data fetch with fixed URL logic
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
        const res = await axios.get(`${baseUrl}/clinets`);
        setClients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  // Search and Filter Logic
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === "All" || client.paymentBehavior === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filterStatus]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <RefreshCcw className="animate-spin text-[#4177BC] mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Accessing Vault...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#F8FAFC] flex justify-center pb-24 md:pb-8">
      <div className="max-w-6xl w-full">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-[#4177BC] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#4177BC]">Management Console</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
              Client <span className="text-[#4177BC]">Vault</span>
            </h1>
          </div>

          <Link href="/admin/create-client/">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-[#4177BC] text-white px-8 py-4 rounded-[22px] text-[11px] font-black shadow-xl shadow-blue-200 uppercase tracking-widest"
            >
              <UserPlus size={16} />
              Register New Client
            </motion.button>
          </Link>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-slate-100 rounded-[28px] p-2 mb-8 flex flex-col md:flex-row items-center gap-2 shadow-sm">
          <div className="flex-1 flex items-center px-6 gap-3 w-full">
            <Search size={18} className="text-[#4177BC]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company name or email..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 placeholder:text-slate-300 outline-none py-3"
            />
          </div>
          <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
          <div className="flex items-center gap-3 px-6">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="On-time">On-time</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        {/* Clients List */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <motion.div
                  key={client._id || index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative group bg-white border border-slate-100 p-5 rounded-[30px] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-2xl hover:shadow-slate-200/40 ${client.status === 'Disabled' ? 'grayscale opacity-60' : ''}`}
                >
                  {/* 1. Identity */}
                  <div className="flex items-center gap-5 w-full md:w-1/3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#4177BC] font-black text-lg group-hover:bg-[#4177BC] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                      {client.companyName?.charAt(0) || "C"}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-black text-slate-800 tracking-tight text-[15px] uppercase italic truncate">{client.companyName}</h3>
                      <p className="text-[11px] text-slate-400 font-bold truncate">{client.email}</p>
                    </div>
                  </div>

                  {/* 2. Status Monitoring */}
                  <div className="flex items-center justify-between md:justify-around w-full md:flex-1">
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 italic">Payment Trust</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${client.paymentBehavior === 'On-time' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {client.paymentBehavior === 'On-time' ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                        {client.paymentBehavior || 'Unknown'}
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 italic">Engagement</p>
                      <span className="text-[13px] font-black text-slate-700 tracking-tight">{client.activeProjects || 0} Active Projects</span>
                    </div>
                  </div>

                  {/* 3. Quick Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Link href={`/admin/all-clients/${client._id}`}>
                      <button className="h-11 px-5 rounded-[18px] bg-slate-50 text-slate-500 hover:text-white hover:bg-[#4177BC] transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-transparent hover:shadow-lg hover:shadow-blue-200">
                        View Portal <ChevronRight size={14} />
                      </button>
                    </Link>

                    <a href={`mailto:${client.email}`}>
                      <button className="h-11 w-11 flex items-center justify-center rounded-[18px] bg-slate-50 text-slate-400 hover:text-[#4177BC] hover:bg-blue-50 transition-all border border-slate-100">
                        <Mail size={18} />
                      </button>
                    </a>

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === client._id ? null : client._id)}
                        className={`h-11 w-11 flex items-center justify-center rounded-[18px] transition-all ${activeMenu === client._id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === client._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-[24px] shadow-2xl z-20 p-2.5 overflow-hidden"
                          >
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-tighter">
                              <Settings size={14} className="text-[#4177BC]" /> Edit Client
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-tighter">
                              <Ban size={14} className="text-amber-500" /> Disable Portal
                            </button>
                            <div className="h-[1px] bg-slate-50 my-1.5" />
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-tighter">
                              <Trash2 size={14} /> Delete Record
                            </button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search size={30} />
                 </div>
                 <h3 className="text-lg font-black text-slate-800 italic uppercase">No Clients Found</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Try adjusting your search or filters</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Security Info Card */}
        {/* <div className="mt-12 p-8 bg-slate-900 rounded-[35px] flex flex-col md:flex-row items-center gap-6 text-white overflow-hidden relative shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4177BC]/20 blur-3xl rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#4177BC]">
            <ShieldCheck size={28} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC] mb-1">Encrypted Infrastructure</h4>
            <p className="text-[13px] font-bold text-slate-300 italic leading-relaxed">
              All financial and personal data within the <span className="text-white">Vault</span> is protected by 256-bit encryption. Modification logs are kept for compliance audits.
            </p>
          </div>
          <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
            Security Logs
          </button>
        </div> */}

      </div>
    </div>
  );
}