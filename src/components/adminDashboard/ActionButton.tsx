"use client";

import React from "react";
import { Plus } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

export default function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-[18px] text-sm font-black text-slate-700 hover:text-white hover:bg-[#EB9C2C] hover:border-[#EB9C2C] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#EB9C2C]/20 active:scale-95"
    >
      {/* Icon with hover rotation */}
      <div className="p-1 bg-slate-100 rounded-lg group-hover:bg-white/20 group-hover:rotate-90 transition-all duration-300">
        <Plus size={16} className="text-slate-500 group-hover:text-white" strokeWidth={3} />
      </div>
      
      <span className="tracking-tight uppercase text-[12px]">
        {label}
      </span>
    </button>
  );
}