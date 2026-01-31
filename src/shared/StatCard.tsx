"use client";

import React from "react";
import { 
  DollarSign, 
  Clock, 
  Users, 
  Briefcase, 
  TrendingUp 
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: string;
  color?: string;
  compact?: boolean;
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  icon, 
  color = "#4177BC",
  compact = false 
}: StatCardProps) {

  const getSimpleLabel = (label: string) => {
    const mapping: Record<string, string> = {
      "revenue": "Total Revenue",
      "due": "Total Due",
      "clients": "Total Clients",
      "projects": "Total Projects"
    };
    return mapping[icon || ""] || label;
  };

  const getIcon = () => {
    const props = { size: 20, strokeWidth: 2.5 };
    switch (icon) {
      case "revenue": return <DollarSign {...props} />;
      case "due": return <Clock {...props} />;
      case "clients": return <Users {...props} />;
      case "projects": return <Briefcase {...props} />;
      default: return <TrendingUp {...props} />;
    }
  };

  return (
    <div className={`group relative bg-white border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-[#4177BC]/30
      ${compact ? 'p-5 rounded-xl' : 'p-6 rounded-2xl'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-[#4177BC] group-hover:text-white"
          style={{ 
            backgroundColor: `${color}10`, 
            color: color 
          }}
        >
          {getIcon()}
        </div>
        
        {trend && (
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider inter-bold">
            {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-none inter-bold">
          {getSimpleLabel(title)}
        </p>
        
        <h3 className="text-2xl font-black text-[#0F172A] tracking-tight judson-bold">
          {value}
        </h3>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#4177BC] group-hover:w-full transition-all duration-500 rounded-b-2xl" />
    </div>
  );
}