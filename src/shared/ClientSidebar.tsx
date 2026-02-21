/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  CreditCard,
  FileText,
  Sparkles,
  UserCircle,
} from "lucide-react";

const menu = [
  { name: "Overview", href: "/client/overview", icon: LayoutDashboard },
  { name: "My Projects", href: "/client/projects", icon: Briefcase },
  { name: "Invoices", href: "/client/invoices", icon: Receipt },
  { name: "Payments", href: "/client/payments", icon: CreditCard },
];

// Mobile menu often shows fewer items for space
const mobileMenu = menu.slice(0, 5);

const LogoBrand = () => (
  <Link href="/client/overview" className="flex items-center gap-3 md:gap-4 group relative">
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
        transition={{
          rotate: { duration: 0.5, ease: "easeInOut" },
          scale: { type: "spring", stiffness: 300 }
        }}
        className="relative z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
      >
        <Image 
          src="/logo.PNG" 
          alt="GenieHack Logo" 
          width={48} 
          height={48} 
          className="object-contain" 
          priority 
        />
        <motion.div
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute -top-1 -right-1 text-blue-500"
        >
          <Sparkles size={14} fill="currentColor" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-[#4177BC] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
    </div>

    <div className="flex flex-col">
      <div className="flex items-center leading-none">
        <span className="text-lg md:text-[22px] font-light tracking-tight text-slate-800 italic">Genie</span>
        <span className="text-lg md:text-[22px] font-black tracking-tighter text-[#4177BC] uppercase italic ml-1">Hack</span>
      </div>
      <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-0.5 md:mt-1">
        Client Portal
      </span>
    </div>
  </Link>
);

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 z-[100] flex items-center px-6">
        <LogoBrand />
      </header>

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100/80 z-50">
        <div className="w-full flex flex-col">
          <div className="h-28 flex items-center px-8 relative">
            <LogoBrand />
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2 custom-scrollbar">
            <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 opacity-70">
              Workspace
            </p>
            
            {menu.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[14px] font-bold transition-all duration-300
                    ${active ? "text-[#4177BC]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                >
                  {active && (
                    <motion.div
                      layoutId="desktopActiveNavClient"
                      className="absolute inset-0 bg-blue-50/60 rounded-2xl border border-[#4177BC]/10 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={20} className={active ? "text-[#4177BC]" : "text-slate-400 group-hover:text-slate-600"} />
                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary (Extra for Client Side) */}
          <div className="p-4 border-t border-slate-50">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-[#4177BC]/10 flex items-center justify-center text-[#4177BC]">
                    <UserCircle size={20} />
                </div>
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-700">Client Portal</span>
                    <span className="text-[9px] text-slate-400">Active Session</span>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
        <nav className="flex justify-around items-center px-4 pb-8 pt-4">
          {mobileMenu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center p-2"
              >
                <div className={`transition-all duration-500 ${active ? "text-[#4177BC] scale-110 -translate-y-1" : "text-slate-300"}`}>
                  <item.icon size={26} strokeWidth={active ? 2.5 : 2} />
                </div>
                {active && (
                  <motion.div
                    layoutId="mobileActiveIndicatorClient"
                    className="absolute -bottom-1 w-5 h-1 bg-[#4177BC] rounded-full"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        @media (max-width: 768px) {
          main { margin-top: 80px !important; margin-bottom: 90px !important; }
        }
      `}</style>
    </>
  );
}