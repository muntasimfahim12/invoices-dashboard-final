"use client";

import React from "react";
import { DollarSign, Clock, Users, Briefcase, TrendingUp } from "lucide-react";

// 1. Interface-e 'compact' add kora hoyeche jate error na dey
interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: string;
  color?: string;
  compact?: boolean; // Ei line-ta na thakle AdminOverview-te error dekhabe
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  icon, 
  color = "#4177BC",
  compact = false 
}: StatCardProps) {

  const getIcon = () => {
    const props = { size: compact ? 20 : 24, strokeWidth: 2.5 };
    switch (icon) {
      case "revenue": return <DollarSign {...props} />;
      case "due": return <Clock {...props} />;
      case "clients": return <Users {...props} />;
      case "projects": return <Briefcase {...props} />;
      default: return <TrendingUp {...props} />;
    }
  };

  return (
    <div className={`bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#4177BC]/5 transition-all duration-300 group relative overflow-hidden
      ${compact ? 'p-5 rounded-[24px]' : 'p-8 rounded-[32px]'}`}
    >
      {/* Background Icon Decoration */}
      <div className="absolute -right-2 -bottom-2 opacity-[0.03] text-slate-900 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700">
        {getIcon()}
      </div>

      <div className={`flex items-start justify-between relative z-10 ${compact ? 'mb-4' : 'mb-6'}`}>
        <div 
          className={`${compact ? 'w-10 h-10 rounded-xl' : 'w-14 h-14 rounded-2xl'} flex items-center justify-center shadow-inner transition-all group-hover:shadow-lg group-hover:shadow-[#4177BC]/10 duration-300`}
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {getIcon()}
        </div>
        
        {trend && (
          <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
            trend.includes('+') || trend.includes('New') || trend.includes('Track')
              ? 'bg-green-100 text-green-600' 
              : 'bg-orange-100 text-[#EB9C2C]'
          }`}>
            {trend}
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1 leading-none">
          {title}
        </p>
        <h3 className={`${compact ? 'text-2xl' : 'text-3xl'} font-black text-slate-900 tracking-tighter group-hover:text-[#4177BC] transition-colors duration-300`}>
          {value}
        </h3>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#4177BC] group-hover:w-full transition-all duration-500 opacity-20" />
    </div>
  );
}