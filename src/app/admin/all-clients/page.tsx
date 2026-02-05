/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const fetchClients = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
      const res = await axios.get(`${baseUrl}/clinets`);
      setClients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client record?")) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
        await axios.delete(`${baseUrl}/clinets/${id}`);
        setClients(clients.filter(c => c._id !== id));
        setActiveMenu(null);
      } catch (err) {
        alert("Failed to delete client");
      }
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = 
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === "All" || client.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filterStatus]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFFFF]">
      <RefreshCcw className="animate-spin text-[#4177BC] mb-4" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 inter-bold">Syncing with Vault...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#FFFFFF] flex justify-center pb-24 md:pb-8 selection:bg-[#4177BC] selection:text-white">
      <div className="max-w-6xl w-full">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#4177BC] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#4177BC] inter-bold">Management Console</span>
            </div>
            <h1 className="text-5xl font-bold text-slate-900 tracking-tighter judson-bold">
              Client <span className="text-slate-300">All.</span>
            </h1>
          </div>

          <Link href="/admin/create-client">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 bg-[#4177BC] text-white px-8 py-4 rounded-[22px] text-[11px] font-black shadow-xl shadow-blue-100 uppercase tracking-widest inter-bold"
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
              placeholder="Search by name or email..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-semibold text-slate-600 placeholder:text-slate-300 outline-none py-3 inter-medium"
            />
          </div>
          <div className="h-8 w-px bg-slate-100 hidden md:block" />
          <div className="flex items-center gap-3 px-6">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] outline-none cursor-pointer inter-bold p-2"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Clients List */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredClients.length > 0 ? (
              filteredClients.map((client, index) => (
                <motion.div
                  key={client._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative group bg-white border border-slate-100 p-6 rounded-[35px] flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-[#4177BC]/30 hover:shadow-2xl hover:shadow-slate-100 ${client.status === 'Disabled' ? 'grayscale opacity-60' : ''}`}
                >
                  {/* 1. Identity */}
                  <div className="flex items-center gap-5 w-full md:w-1/3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#4177BC] font-black text-lg group-hover:bg-[#4177BC] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 inter-bold">
                      {client.name?.charAt(0) || "C"}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-bold text-slate-800 tracking-tight text-[16px] truncate inter-semibold">{client.name}</h3>
                      <p className="text-[11px] text-slate-400 font-bold truncate uppercase tracking-tighter inter-medium">{client.email}</p>
                    </div>
                  </div>

                  {/* 2. Status Monitoring */}
                  <div className="flex items-center justify-between md:justify-around w-full md:flex-1">
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 inter-bold">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase inter-bold ${client.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {client.status === 'Active' ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                        {client.status || 'Unknown'}
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1.5 inter-bold">Engagement</p>
                      <span className="text-[13px] font-black text-slate-700 tracking-tight inter-bold">
                        {client.projects?.length || 0} Active Project(s)
                      </span>
                    </div>
                  </div>

                  {/* 3. Quick Actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Link href={`/admin/all-clients/${client._id}`}>
                      <button className="h-11 px-5 rounded-[18px] bg-slate-50 text-slate-500 hover:text-white hover:bg-[#4177BC] transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-transparent hover:shadow-lg inter-bold">
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
                            className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-3xl shadow-2xl z-20 p-2.5 overflow-hidden"
                          >
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-tighter inter-bold">
                              <Settings size={14} className="text-[#4177BC]" /> Edit Client
                            </button>
                            <button className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-slate-600 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-tighter inter-bold">
                              <Ban size={14} className="text-amber-500" /> Disable Portal
                            </button>
                            <div className="h-px bg-slate-50 my-1.5" />
                            <button 
                              onClick={() => handleDelete(client._id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-tighter inter-bold"
                            >
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
                 <h3 className="text-lg font-bold text-slate-800 uppercase inter-bold">No Clients Found</h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 inter-medium">Try adjusting your search or filters</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}