"use client";
import { motion } from "framer-motion";
import { DollarSign, Users, Briefcase, Clock } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "$42,500", icon: DollarSign, trend: "+12%", color: "brand-blue" },
  { label: "Active Clients", value: "124", icon: Users, trend: "+5%", color: "brand-orange" },
  { label: "Projects", value: "38", icon: Briefcase, trend: "+2", color: "brand-blue" },
  { label: "Pending Tasks", value: "09", icon: Clock, trend: "-1", color: "brand-orange" },
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
          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${stat.color === 'brand-blue' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-orange/10 text-brand-orange'}`}>
              <stat.icon size={24} />
            </div>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg">
              {stat.trend}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}