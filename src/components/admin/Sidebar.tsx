"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Receipt, LogOut, ChevronRight,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Zap, LayoutDashboard, Settings, Briefcase
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Invoices", href: "/admin/invoices", icon: Receipt },
];

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={false}
        animate={{ width: isHovered ? 260 : 88 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="fixed left-0 top-0 h-screen bg-brand-white hidden md:flex flex-col z-[100] border-r border-slate-100 shadow-[10px_0_30px_rgba(65,119,188,0.05)]"
      >
        {/* --- PREMIUM LOGO --- */}
        <div className="h-24 flex items-center px-6 mb-2 overflow-hidden">
          <div className="relative flex-shrink-0">
            {/* Blue Icon Box with Orange Icon */}
            <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/30 transition-transform duration-500 group-hover:rotate-12">
               <Zap size={22} fill="#EB9C2C" className="text-brand-orange" />
            </div>
          </div>
          
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="ml-4"
              >
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  INVO<span className="text-brand-orange">LY</span>
                </h1>
                <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Admin Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  group relative flex items-center h-[52px] rounded-xl transition-all duration-300
                  ${isActive ? "bg-brand-blue shadow-lg shadow-brand-blue/20" : "hover:bg-slate-50"}
                `}>
                  {/* Icon */}
                  <div className={`min-w-[56px] flex items-center justify-center transition-all 
                    ${isActive ? "text-brand-white" : "text-slate-400 group-hover:text-brand-blue"}`}>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 pr-4 flex items-center justify-between"
                      >
                        <span className={`text-[14px] font-bold tracking-tight ${isActive ? "text-brand-white" : "text-slate-600 group-hover:text-brand-blue"}`}>
                          {item.name}
                        </span>
                        {isActive && <ChevronRight size={14} className="text-brand-white/50" />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* --- BOTTOM SECTION --- */}
        <div className="p-4 border-t border-slate-50">
          <div className="flex items-center h-[52px] px-2 rounded-xl hover:bg-orange-50 group transition-all cursor-pointer">
            <div className="min-w-[40px] flex items-center justify-center text-slate-400 group-hover:text-brand-orange transition-all">
              <LogOut size={20} strokeWidth={2.5} />
            </div>
            {isHovered && (
              <div className="flex flex-col ml-2">
                <span className="font-bold text-[13px] text-slate-900 leading-none">Sign Out</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">Exit Session</span>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* --- MOBILE NAVIGATION (Brand White Glass) --- */}
      <div className="fixed bottom-6 left-0 right-0 px-6 md:hidden z-[100]">
        <nav className="mx-auto max-w-[380px] h-16 bg-brand-white/90 backdrop-blur-2xl border border-slate-200 flex justify-around items-center shadow-2xl rounded-3xl relative overflow-hidden">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center py-2 px-4">
                <div className={`transition-all duration-300 ${isActive ? "text-brand-blue scale-110 -translate-y-1" : "text-slate-400"}`}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="mobile-dot" 
                    className="absolute bottom-2 w-1.5 h-1.5 bg-brand-orange rounded-full shadow-[0_0_10px_#EB9C2C]" 
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