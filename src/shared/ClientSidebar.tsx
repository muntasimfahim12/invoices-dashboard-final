
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
  UserCircle,
  MessageSquare,
  HelpCircle,
} from "lucide-react";

const menuGroups = [
  {
    label: "Workspace",
    items: [
      { name: "Dashboard", href: "/client/overview", icon: LayoutDashboard },
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

const mobileItems = [
  { href: "/client", icon: LayoutDashboard },
  { href: "/client/projects", icon: Briefcase },
  { href: "/client/invoices", icon: Receipt },
  { href: "/client/payments", icon: CreditCard },
  { href: "/client/documents", icon: FileText },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-[#FCFDFE] border-r border-slate-100/80 z-50">
        <div className="w-full flex flex-col">
          
          {/* LOGO SECTION (Admin Style Matched) */}
          <div className="h-24 flex items-center px-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-[#4177BC] rounded-xl flex items-center justify-center shadow-lg shadow-[#4177BC]/20 group-hover:rotate-6 transition-transform duration-300">
                <UserCircle className="text-white" size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-800 leading-none">
                  Client<span className="text-[#4177BC]">Hub</span>
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Relations Invoice</span>
              </div>
            </div>
          </div>

          {/* NAVIGATION (Categorized logic with Admin Animation) */}
          <nav className="flex-1 px-4 py-4 space-y-7 overflow-y-auto scrollbar-hide">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300
                          ${active ? "text-[#4177BC]" : "text-slate-500 hover:text-slate-900"}`}
                      >
                        {active && (
                          <motion.div 
                            layoutId="desktopActiveClient"
                            className="absolute inset-0 bg-blue-50/50 rounded-2xl border border-[#4177BC]/10 -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <item.icon 
                          size={20} 
                          className={`${active ? "text-[#4177BC]" : "text-slate-400 group-hover:text-slate-900"} transition-colors`} 
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (Admin Style Matched) ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100]">
        <nav className="relative bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-4 pb-6 pt-3 flex justify-around items-center">
          
          {mobileItems.map((item) => {
            const active = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center py-1 transition-all duration-300"
              >
                <div className={`transition-all duration-400 ${
                    active ? "text-[#4177BC] scale-110" : "text-slate-300"
                  }`}>
                  <item.icon size={26} strokeWidth={active ? 2.5 : 2} />
                </div>
                
                {active && (
                  <motion.div 
                    layoutId="mobileActiveLineClient"
                    className="absolute -bottom-1 w-5 h-1 bg-[#4177BC] rounded-full"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}