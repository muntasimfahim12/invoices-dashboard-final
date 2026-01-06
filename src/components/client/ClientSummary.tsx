"use client";
import { motion } from "framer-motion";
import { Wallet, CheckCircle2, Timer, ArrowUpRight } from "lucide-react";

const summaries = [
  {
    title: "Outstanding Balance",
    value: "$1,450.00",
    icon: Wallet,
    accent: "#4177BC",
    lightAccent: "rgba(65, 119, 188, 0.1)",
    description: "Next billing: Jan 15",
  },
  {
    title: "Completed Tasks",
    value: "24",
    icon: CheckCircle2,
    accent: "#10B981", // Success Green for variation
    lightAccent: "rgba(16, 185, 129, 0.1)",
    description: "4 tasks this week",
  },
  {
    title: "Ongoing Project",
    value: "01",
    icon: Timer,
    accent: "#EB9C2C",
    lightAccent: "rgba(235, 156, 44, 0.1)",
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
          whileHover={{ y: -5 }}
          className="group relative h-64 overflow-hidden rounded-[2.5rem] bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50"
        >
          {/* Background Abstract Glow */}
          <div 
            className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-[80px] transition-opacity duration-500 opacity-20 group-hover:opacity-40"
            style={{ backgroundColor: item.accent }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              {/* Icon with Glass Effect */}
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-500 group-hover:rotate-[10deg]"
                style={{ backgroundColor: item.lightAccent, color: item.accent }}
              >
                <item.icon size={28} strokeWidth={2.5} />
              </div>
              
              {/* Top Right Mini Arrow */}
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
              <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 pt-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.accent }}></span>
                {item.description}
              </p>
            </div>
          </div>

          {/* Bottom Progress Line (Subtle) */}
          <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-transparent via-slate-200 to-transparent transition-all duration-700 group-hover:w-full"
               style={{ backgroundImage: `linear-gradient(to right, transparent, ${item.accent}, transparent)` }}
          />
        </motion.div>
      ))}
    </div>
  );
}