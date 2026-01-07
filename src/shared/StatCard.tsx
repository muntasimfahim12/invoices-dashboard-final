"use client";

import React from "react";
import { DollarSign, Clock, Users, Briefcase, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;   // Optional trend prop
  icon?: string;    // Optional icon name
  color?: string;   // Optional custom color
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  icon, 
  color = "#4177BC" 
}: StatCardProps) {

  // Icon selector based on the icon prop string
  const getIcon = () => {
    const props = { size: 24, strokeWidth: 2.5 };
    switch (icon) {
      case "revenue": return <DollarSign {...props} />;
      case "due": return <Clock {...props} />;
      case "clients": return <Users {...props} />;
      case "projects": return <Briefcase {...props} />;
      default: return <TrendingUp {...props} />;
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#4177BC]/5 transition-all duration-300 group relative overflow-hidden">
      {/* Subtle Background Icon Decoration */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform duration-500">
        {getIcon()}
      </div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-300"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {getIcon()}
        </div>
        
        {trend && (
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
            trend.includes('+') || trend.includes('New') 
              ? 'bg-green-100 text-green-600' 
              : 'bg-orange-100 text-[#EB9C2C]'
          }`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-[#4177BC] transition-colors duration-300">
          {value}
        </h3>
      </div>
    </div>
  );
}