/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, UserCircle, ArrowRight, Receipt } from "lucide-react";

export default function EntryPortal() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[120px]" />

      {/* Logo Area */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200">
          <Receipt className="text-white" size={26} />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-slate-800">
          Invo<span className="text-blue-600">ice</span>
        </h1>
      </motion.div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* ADMIN PORTAL CARD */}
        <PortalCard 
          title="Admin Portal"
          subtitle="Manage clients, projects, and finance"
          icon={<ShieldCheck size={32} />}
          href="/login" // Tomar admin login path
          color="blue"
          delay={0.1}
        />

        {/* CLIENT PORTAL CARD */}
        <PortalCard 
          title="Client Hub"
          subtitle="View invoices and project progress"
          icon={<UserCircle size={32} />}
          href="/login" // Tomar client login path
          color="orange"
          delay={0.2}
        />

      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-slate-400 text-sm font-medium"
      >
        Secure Enterprise Billing System © 2024
      </motion.p>
    </div>
  );
}

function PortalCard({ title, subtitle, icon, href, color, delay }: any) {
  const isBlue = color === "blue";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
    >
      <Link href={href} className="group block h-full">
        <div className="h-full bg-white/70 backdrop-blur-xl border border-white p-8 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
          
          {/* Subtle Gradient Hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${isBlue ? 'bg-blue-600' : 'bg-[#EB9C2C]'}`} />

          <div className="flex flex-col h-full">
            <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg 
              ${isBlue ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-[#EB9C2C] text-white shadow-orange-100'}`}>
              {icon}
            </div>

            <h2 className="text-2xl font-black text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
              {subtitle}
            </p>

            <div className="mt-auto flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all duration-300
              ${isBlue ? 'text-blue-600 group-hover:gap-4' : 'text-[#EB9C2C] group-hover:gap-4'}">
              Enter Dashboard <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}