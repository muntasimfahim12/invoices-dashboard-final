"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface ListItemProps {
  title: string;
  meta: string;
}

export default function ListItem({ title, meta }: ListItemProps) {
  // Logic to determine status color based on meta text
  const getStatusStyle = () => {
    const text = meta.toLowerCase();
    if (text.includes("active") || text.includes("paid")) return "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]";
    if (text.includes("pending") || text.includes("urgent") || text.includes("overdue")) return "bg-[#EB9C2C] shadow-[0_0_8px_rgba(235,156,44,0.4)]";
    return "bg-slate-300";
  };

  return (
    <li className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300 cursor-pointer mb-1">
      <div className="flex items-center gap-4">
        {/* Animated Status Dot */}
        <div className={`w-2 h-2 rounded-full ${getStatusStyle()} transition-transform group-hover:scale-125`} />
        
        <div>
          <p className="text-sm font-bold text-slate-800 group-hover:text-[#4177BC] transition-colors leading-tight">
            {title}
          </p>
          <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            {meta}
          </p>
        </div>
      </div>

      {/* Action Indicator */}
      <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-[#4177BC]">
        <ChevronRight size={18} strokeWidth={3} />
      </div>
    </li>
  );
}