/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, UserPlus, MoreVertical, Mail,
  ExternalLink, Filter, ShieldCheck, AlertCircle,
  Settings, Trash2, Ban, ChevronRight
} from "lucide-react";

const clients = [
  { id: "CL-001", name: "Infinity Wellness", email: "contact@infinity.com", activeProjects: 2, lastPaid: "12 Dec 2023", paymentBehavior: "On-time", status: "Active" },
  { id: "CL-002", name: "Tech Morph", email: "ceo@techmorph.io", activeProjects: 1, lastPaid: "05 Jan 2024", paymentBehavior: "Late", status: "Active" },
  { id: "CL-003", name: "Blue Ocean Ltd", email: "billing@blueocean.com", activeProjects: 0, lastPaid: "N/A", paymentBehavior: "N/A", status: "Disabled" },
];

export default function AllClients() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#F8FAFC] flex justify-center pb-24 md:pb-8">

      <div className="max-w-6xl w-full"> {/* Card guloke majhkane (center) rakhar jonno */}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Client <span className="text-[#4177BC]">Vault</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest text-[10px]">Centralized Client Management System</p>
          </div>

          <Link href="/admin/create-client/">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-[#4177BC] text-white px-6 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-blue-100 uppercase tracking-widest"
            >
              <UserPlus size={18} />
              Register Client
            </motion.button>
          </Link>
        </div>

        {/* Action Bar */}
        <div className="bg-white border border-slate-100 rounded-[24px] p-2 mb-8 flex flex-col md:flex-row items-center gap-2 shadow-sm">
          <div className="flex-1 flex items-center px-4 gap-3 w-full">
            <Search size={18} className="text-slate-300" />
            <input
              type="text"
              placeholder="Search partner databases..."
              className="w-full bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-600 placeholder:text-slate-300 outline-none"
            />
          </div>
          <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />
          <div className="flex items-center gap-2 px-2">
            <Filter size={14} className="text-slate-300" />
            <select className="bg-transparent border-none text-[11px] font-black text-slate-500 uppercase tracking-widest outline-none cursor-pointer">
              <option>Filter: All</option>
              <option>Filter: Active</option>
            </select>
          </div>
        </div>

        {/* Compact Card List */}
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative group bg-white border border-slate-100 p-4 rounded-[22px] flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-xl hover:shadow-slate-200/50 ${client.status === 'Disabled' ? 'opacity-50' : ''}`}
              >
                {/* 1. Identity (Small & Sharp) */}
                <div className="flex items-center gap-4 w-full md:w-1/4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm group-hover:bg-[#4177BC] transition-colors">
                    {client.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-black text-slate-800 tracking-tight text-sm truncate">{client.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold truncate">{client.email}</p>
                  </div>
                </div>

                {/* 2. Status Monitoring */}
                <div className="flex items-center justify-between md:justify-around w-full md:flex-1 px-4">
                  <div className="text-center md:text-left">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</p>
                    <div className={`flex items-center gap-1.5 text-[10px] font-black ${client.paymentBehavior === 'On-time' ? 'text-green-500' : 'text-orange-500'}`}>
                      {client.paymentBehavior === 'On-time' ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                      {client.paymentBehavior}
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Projects</p>
                    <span className="text-xs font-black text-slate-700">{client.activeProjects} Active</span>
                  </div>
                </div>

                {/* 3. Quick Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <Link href={`/admin/all-clients/${client.id}`}>
                    <button className="h-10 px-4 rounded-xl bg-slate-50 text-slate-400 hover:text-[#4177BC] hover:bg-blue-50 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      Portal <ChevronRight size={14} />
                    </button>
                  </Link>

                  <a href={`mailto:${client.email}`}>
                    <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-[#4177BC] transition-all">
                      <Mail size={16} />
                    </button>
                  </a>

                  {/* 3-Dot Dropdown Menu Logic */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === client.id ? null : client.id)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${activeMenu === client.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === client.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 p-2"
                        >
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                            <Settings size={14} /> Edit Profile
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                            <Ban size={14} /> Suspend Access
                          </button>
                          <div className="h-[1px] bg-slate-50 my-1" />
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 size={14} /> Delete Client
                          </button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pro Tip Section */}
        <div className="mt-10 p-6 bg-white border border-slate-100 rounded-[28px] flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#4177BC]">
            <ShieldCheck size={20} />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            <span className="font-black text-slate-700">Security Note:</span> All client data is encrypted. Suspending a client will immediately revoke their access to the payment portal and project files.
          </p>
        </div>
      </div>
    </div>
  );
}