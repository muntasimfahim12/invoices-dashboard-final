import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode; // আইকন সাপোর্ট করার জন্য
  color?: string;
  compact?: boolean;
}

export default function StatCard({ title, value, trend, icon, color = "#4177BC" }: StatCardProps) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className="flex justify-between items-start mb-6">
        <div 
          className="p-3.5 rounded-2xl text-white shadow-lg shadow-blue-100 group-hover:rotate-12 transition-transform" 
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <span className="text-[9px] font-black px-3 py-1 bg-slate-50 rounded-lg text-slate-400 uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{value}</h3>
      </div>
    </div>
  );
}