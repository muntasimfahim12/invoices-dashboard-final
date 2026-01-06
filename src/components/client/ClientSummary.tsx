"use client";
import { motion } from "framer-motion";
import { Wallet, Receipt, LayoutDashboard, ArrowUpRight } from "lucide-react";

const summaries = [
  {
    title: "Outstanding Balance",
    value: "$1,450.00",
    icon: Wallet,
    accent: "#4177BC", // Brand Blue
    lightAccent: "rgba(65, 119, 188, 0.1)",
    description: "Next due: Jan 15, 2026",
  },
  {
    title: "Pending Invoices",
    value: "02",
    icon: Receipt,
    accent: "#EB9C2C", // Brand Orange
    lightAccent: "rgba(235, 156, 44, 0.1)",
    description: "Requires your attention",
  },
  {
    title: "Project Progress",
    value: "65%",
    icon: LayoutDashboard,
    accent: "#10B981", // Success Green
    lightAccent: "rgba(16, 185, 129, 0.1)",
    description: "Phase: UI Design",
  }
];

export default function ClientSummary() {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {summaries.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.15, ease: "easeOut" }}
          whileHover={{ y: -8 }}
          className="group relative h-64 overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 transition-shadow hover:shadow-2xl hover:shadow-slate-200/50"
        >
          {/* Dynamic Background Mesh Glow */}
          <div 
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-[80px] transition-opacity duration-500 opacity-20 group-hover:opacity-40"
            style={{ backgroundColor: item.accent }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              {/* Luxury Icon Box */}
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110"
                style={{ backgroundColor: item.lightAccent, color: item.accent }}
              >
                <item.icon size={28} strokeWidth={2.5} />
              </div>
              
              <div className="text-slate-300 transition-colors group-hover:text-slate-900">
                <ArrowUpRight size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                {item.title}
              </p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-[1000] tracking-tighter text-slate-900">
                  {item.value}
                </h2>
              </div>
              <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 pt-2 italic">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: item.accent }}></span>
                {item.description}
              </p>
            </div>
          </div>

          {/* Bottom Progress Accent */}
          <div className="absolute bottom-0 left-0 h-[4px] w-full bg-slate-50 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: item.accent }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}