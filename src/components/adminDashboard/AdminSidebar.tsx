"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
              <div className="w-10 h-10 bg-[#4177BC] rounded-xl flex items-center justify-center shadow-lg shadow-[#4177BC]/20 group-hover:rotate-6 transition-transform">
                <Receipt className="text-white" size={22} />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-800">
                Invo<span className="text-[#4177BC]">ly</span>
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
                    ${active ? "text-[#4177BC]" : "text-slate-500 hover:text-slate-900"}`}
                >
                  {active && (
                    <motion.div 
                      layoutId="desktopActive"
                      className="absolute inset-0 bg-blue-50/50 rounded-2xl border border-[#4177BC]/10 -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon size={20} className={`${active ? "text-[#4177BC]" : "text-slate-400 group-hover:text-slate-900"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV (Strict Bottom Style) ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100]">
        <nav className="relative bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] px-4 pb-6 pt-3 flex justify-around items-center">
          
          {mobileMenu.map((item) => {
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
                
                {/* Active Indicator Line/Dot */}
                {active && (
                  <motion.div 
                    layoutId="mobileActiveLine"
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