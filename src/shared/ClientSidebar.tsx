/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  CreditCard,
  FileText,
  ChevronRight,
  UserCircle,
  LogOut
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/client", icon: LayoutDashboard },
  { name: "Projects", href: "/client/projects", icon: Briefcase },
  { name: "Invoices", href: "/client/invoices", icon: Receipt },
  { name: "Payments", href: "/client/payments", icon: CreditCard },
  { name: "Documents", href: "/client/documents", icon: FileText },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-[#FCFDFE] border-r border-slate-100 flex-col z-50">
        
        {/* LOGO / BRANDING */}
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-[#4177BC] rounded-xl flex items-center justify-center shadow-lg shadow-[#4177BC]/30 group-hover:rotate-6 transition-transform duration-300">
              <UserCircle className="text-white" size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-800 uppercase">
              Client<span className="text-[#4177BC]">Hub</span>
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-1.5 mt-6">
          <p className="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Workspace</p>
          
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3.5 px-5 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300
                  ${
                    active
                      ? "bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/25 translate-x-1"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#4177BC]"
                  }`}
              >
                <item.icon 
                  size={19} 
                  className={`${active ? "text-white" : "text-slate-400 group-hover:text-[#4177BC]"} transition-colors`} 
                />
                {item.name}
                
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CLIENT PROFILE CARD (BOTTOM) */}
        <div className="p-4 mt-auto border-t border-slate-50 bg-white">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500">
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-[11px] font-black text-slate-800 truncate">Infinity Wellness</p>
              <p className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">Premium Client</p>
            </div>
            <LogOut size={14} className="text-slate-300 group-hover:text-red-500 transition-colors" />
          </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (FLOATING STYLE) ================= */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-[100]">
        <nav className="bg-white/90 backdrop-blur-2xl border border-white/40 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-[30px] px-3 py-3 flex justify-around items-center">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 transition-all duration-500 ${
                  active ? "scale-105" : "opacity-60"
                }`}
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                    active ? "bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/40" : "text-slate-600"
                }`}>
                  <item.icon size={20} />
                </div>
                {active && (
                  <span className="text-[8px] font-black text-[#4177BC] uppercase tracking-wider animate-in fade-in slide-in-from-bottom-1">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}