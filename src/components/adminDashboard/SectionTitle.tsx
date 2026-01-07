"use client";

import React from "react";

export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 group">
      {/* Premium Indigo/Blue Indicator */}
      <div className="w-1.5 h-6 bg-[#4177BC] rounded-full shadow-[0_0_10px_rgba(65,119,188,0.4)] transition-all duration-300 group-hover:h-8" />
      
      <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none group-hover:text-[#4177BC] transition-colors duration-300">
        {title}
      </h2>
    </div>
  );
}