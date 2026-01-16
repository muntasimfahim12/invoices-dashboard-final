/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  CreditCard,
  FileText,
  LogOut,
  UserCircle,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  HelpCircle
} from "lucide-react";

// ADMIN SIDEBAR STYLE: Categorized Groups
const menuGroups = [
  {
    label: "Workspace",
    items: [
      { name: "Dashboard", href: "/client", icon: LayoutDashboard },
      { name: "Projects", href: "/client/projects", icon: Briefcase },
    ]
  },
  {
    label: "Financials",
    items: [
      { name: "Invoices", href: "/client/invoices", icon: Receipt },
      { name: "Payments", href: "/client/payments", icon: CreditCard },
    ]
  },
  {
    label: "Resources",
    items: [
      { name: "Documents", href: "/client/documents", icon: FileText },
    ]
  },
  {
    label: "Support",
    items: [
      { name: "Messages", href: "/client/messages", icon: MessageSquare },
      { name: "Help Desk", href: "/client/help", icon: HelpCircle },
    ]
  }
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="w-full flex flex-col">
          
          {/* LOGO SECTION (Admin Style Matching) */}
          <div className="h-24 flex items-center px-8">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-200 group-hover:bg-[#4177BC] transition-all duration-500">
                <UserCircle className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter text-slate-900 leading-none">
                  CLIENT<span className="text-[#4177BC]">HUB</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Relations Portal</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION (Categorized logic) */}
          <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 opacity-70">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300
                          ${active ? "text-[#4177BC] bg-blue-50/40" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center gap-3 relative z-10">
                          <item.icon 
                            size={18} 
                            strokeWidth={active ? 2.5 : 2} 
                            className={`${active ? "text-[#4177BC]" : "text-slate-400 group-hover:text-slate-900"} transition-colors`} 
                          />
                          {item.name}
                        </div>
                        {active && (
                          <motion.div 
                            layoutId="activeDotClient" 
                            className="w-1.5 h-1.5 rounded-full bg-[#4177BC] shadow-[0_0_8px_#4177BC]" 
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* CLIENT PROFILE FOOTER (Matching Admin Footer) */}
          <div className="p-4 border-t border-slate-50">
            <div className="bg-slate-50 rounded-[2rem] p-4 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 truncate max-w-[100px]">Infinity Wellness</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Partner Status</span>
                </div>
              </div>
              <LogOut size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (FLOATING DARK BAR STYLE) ================= */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-[100]">
        <nav className="bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] px-6 py-4 flex justify-between items-center">
          {/* Dashboard */}
          <MobileNavItem href="/client" icon={LayoutDashboard} active={pathname === "/client"} />
          {/* Projects */}
          <MobileNavItem href="/client/projects" icon={Briefcase} active={pathname === "/client/projects"} />
          {/* Payments */}
          <MobileNavItem href="/client/payments" icon={CreditCard} active={pathname === "/client/payments"} />
          {/* Documents */}
          <MobileNavItem href="/client/documents" icon={FileText} active={pathname === "/client/documents"} />
          {/* Logout/Profile */}
          <button className="text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={22} />
          </button>
        </nav>
      </div>
    </>
  );
}

// Sub-component for Mobile Nav Items to keep it clean
function MobileNavItem({ href, icon: Icon, active }: any) {
  return (
    <Link href={href} className="relative p-2">
      <div className={`${active ? "text-[#4177BC]" : "text-slate-400"}`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      </div>
      {active && (
        <motion.div 
          layoutId="mobileActiveDotClient"
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"
        />
      )}
    </Link>
  );
}