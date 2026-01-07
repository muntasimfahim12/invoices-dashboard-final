"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion"; // Framer Motion use korchi liquid animation-er jonno
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Receipt,
  CreditCard,
  BarChart,
  Settings,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Clients", href: "/admin/all-clients", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Invoices", href: "/admin/invoices", icon: Receipt },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reports", href: "/admin/reports", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const mobileMenu = menu.slice(0, 5);

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-[#FCFDFE] border-r border-slate-100/80 z-50">
        <div className="w-full flex flex-col">
          <div className="h-24 flex items-center px-8">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                <Receipt className="text-white" size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                Invo<span className="text-blue-600">ly</span>
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Main Menu</p>
            {menu.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300
                    ${active ? "text-blue-600" : "text-slate-500 hover:text-slate-900"}`}
                >
                  {active && (
                    <motion.div 
                      layoutId="desktopActive"
                      className="absolute inset-0 bg-blue-50 rounded-2xl border border-blue-100/50 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={20} className={`${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-50">
             <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Admin User</p>
                  <p className="text-[10px] text-slate-400 font-medium tracking-tight">System Manager</p>
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (iPhone 17 Pro Style) ================= */}
      <div className="md:hidden fixed bottom-8 left-6 right-6 z-[100]">
        <nav className="relative bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-[35px] px-3 py-3 flex justify-between items-center overflow-hidden">
          
          {mobileMenu.map((item) => {
            const active = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex-1 flex flex-col items-center justify-center py-2 transition-all duration-500 z-10`}
              >
                {/* Active Liquid Background */}
                {active && (
                  <motion.div
                    layoutId="mobileLiquid"
                    className="absolute inset-0 mx-1 bg-blue-600 rounded-[24px] shadow-lg shadow-blue-400/30"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}

                <div className={`transition-all duration-300 ${active ? "text-white scale-110 -translate-y-0.5" : "text-slate-400"}`}>
                  <item.icon size={22} strokeWidth={active ? 2.5 : 2} />
                </div>
                
                {active && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] font-black text-white uppercase tracking-tighter mt-1"
                  >
                    {item.name}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}