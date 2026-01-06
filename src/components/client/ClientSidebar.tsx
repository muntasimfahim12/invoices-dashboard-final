"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, FolderKanban, ReceiptText, 
  HelpCircle, LogOut, ChevronRight 
} from "lucide-react";

const clientMenu = [
  { name: "Overview", href: "/client", icon: LayoutDashboard },
  { name: "My Projects", href: "/client/projects", icon: FolderKanban },
  { name: "Invoices", href: "/client/invoices", icon: ReceiptText },
];

export default function ClientSidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{ width: isHovered ? 260 : 88 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed left-0 top-0 h-screen bg-white hidden md:flex flex-col z-[100] border-r border-slate-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)]"
    >
      {/* --- BRAND IDENTITY --- */}
      <div className="h-24 flex items-center px-6 overflow-hidden">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center shadow-lg shadow-brand-blue/30 transition-transform duration-500 group-hover:rotate-12">
            <span className="text-xl font-black text-white italic">I</span>
          </div>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="ml-4 whitespace-nowrap"
            >
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                INVOLY<span className="text-brand-orange">.</span>
              </h1>
              <p className="text-[10px] font-bold text-brand-blue uppercase tracking-widest mt-1">Client Portal</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {clientMenu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`
                group relative flex items-center h-[52px] rounded-xl transition-all duration-300
                ${isActive ? "bg-brand-blue shadow-lg shadow-brand-blue/20" : "hover:bg-slate-50"}
              `}>
                {/* Icon Box */}
                <div className={`min-w-[56px] flex items-center justify-center transition-all 
                  ${isActive ? "text-white" : "text-slate-400 group-hover:text-brand-blue"}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Label Text */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      className="flex-1 pr-4 flex items-center justify-between"
                    >
                      <span className={`text-[14px] font-bold tracking-tight whitespace-nowrap ${isActive ? "text-white" : "text-slate-600 group-hover:text-brand-blue"}`}>
                        {item.name}
                      </span>
                      {isActive && <ChevronRight size={14} className="text-white/60" />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* --- SUPPORT & LOGOUT --- */}
      <div className="p-4 border-t border-slate-50 space-y-1">
        <div className="flex items-center h-[52px] px-2 rounded-xl hover:bg-slate-50 group transition-all cursor-pointer">
          <div className="min-w-[40px] flex items-center justify-center text-slate-400 group-hover:text-brand-blue transition-all">
            <HelpCircle size={20} />
          </div>
          {isHovered && (
            <span className="ml-2 font-bold text-[13px] text-slate-600 whitespace-nowrap">Help Center</span>
          )}
        </div>

        <div className="flex items-center h-[52px] px-2 rounded-xl hover:bg-rose-50 group transition-all cursor-pointer">
          <div className="min-w-[40px] flex items-center justify-center text-slate-400 group-hover:text-rose-50 transition-all">
            <LogOut size={20} />
          </div>
          {isHovered && (
            <span className="ml-2 font-bold text-[13px] text-rose-500 whitespace-nowrap">Logout</span>
          )}
        </div>
      </div>
    </motion.aside>
  );
}