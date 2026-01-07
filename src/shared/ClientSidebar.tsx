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
  UserCircle
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
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex-col shadow-[10px_0_40px_-15px_rgba(0,0,0,0.03)] z-50">
        
        {/* LOGO / BRANDING */}
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4177BC] rounded-2xl flex items-center justify-center shadow-lg shadow-[#4177BC]/20 transform -rotate-3">
              <UserCircle className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-800 uppercase">
              Client<span className="text-[#4177BC]">Hub</span>
            </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <p className="px-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Workspace</p>
          
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-bold transition-all duration-300
                  ${
                    active
                      ? "bg-[#4177BC] text-white shadow-xl shadow-[#4177BC]/20 translate-x-2"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#4177BC]"
                  }`}
              >
                <item.icon size={20} className={`${active ? "text-white" : "text-slate-400 group-hover:text-[#4177BC]"} transition-colors`} />
                {item.name}
                
                {active && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CLIENT PROFILE CARD (BOTTOM) */}
        <div className="p-4 m-6 bg-slate-50 rounded-[28px] border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="overflow-hidden flex-1">
                    <p className="text-xs font-black text-slate-800 truncate">Infinity Wellness</p>
                    <p className="text-[10px] text-slate-400 font-bold truncate tracking-tight uppercase">Premium Client</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-[#4177BC] transition-colors" />
            </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (FLOATING STYLE) ================= */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <nav className="bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[32px] px-6 py-3 flex justify-around items-center">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${
                  active ? "scale-110 -translate-y-1" : "opacity-50 scale-100"
                }`}
              >
                <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                    active ? "bg-[#4177BC] text-white shadow-lg shadow-[#4177BC]/30" : "text-slate-600"
                }`}>
                  <item.icon size={22} />
                </div>
                {active && (
                  <span className="text-[9px] font-black text-[#4177BC] uppercase tracking-tighter">
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