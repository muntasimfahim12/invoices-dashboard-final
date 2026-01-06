"use client";
import { motion } from "framer-motion";
import { DollarSign, Users, Briefcase, AlertCircle } from "lucide-react";

const stats = [
  { 
    label: "Total Revenue", 
    value: "$42,500", 
    icon: DollarSign, 
    trend: "+12.5%", 
    color: "brand-blue" 
  },
  { 
    label: "Active Clients", 
    value: "124", 
    icon: Users, 
    trend: "+5%", 
    color: "brand-orange" 
  },
  { 
    label: "Active Projects", 
    value: "38", 
    icon: Briefcase, 
    trend: "+2 new", 
    color: "brand-blue" 
  },
  { 
    label: "Overdue Invoices", 
    value: "$3,200", 
    icon: AlertCircle, 
    trend: "Needs Action", 
    color: "brand-orange" 
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
        >
          <div className="flex justify-between items-start">
            {/* Icon Box */}
            <div className={`p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${
              stat.color === 'brand-blue' 
                ? 'bg-brand-blue/10 text-brand-blue' 
                : 'bg-brand-orange/10 text-brand-orange'
            }`}>
              <stat.icon size={24} strokeWidth={2.5} />
            </div>

            {/* Trend Badge */}
            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg ${
              stat.label === "Overdue Invoices" 
                ? 'bg-rose-50 text-rose-600' 
                : 'bg-green-50 text-green-600'
            }`}>
              {stat.trend}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              {stat.label}
            </p>
            <h3 className="text-3xl font-[1000] text-slate-900 mt-2 tracking-tighter leading-none">
              {stat.value}
            </h3>
          </div>

          {/* Bottom subtle glow on hover */}
          <div className={`absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full ${
            stat.color === 'brand-blue' ? 'bg-brand-blue' : 'bg-brand-orange'
          }`} />
        </motion.div>
      ))}
    </div>
  );
}