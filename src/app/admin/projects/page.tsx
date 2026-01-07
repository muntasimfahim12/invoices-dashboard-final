/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { 
    Layers, Clock, DollarSign, 
    Calendar, CheckCircle2, Search
} from "lucide-react";
import { motion } from "framer-motion";

const projectsData = [
    { id: "PRJ-101", name: "E-commerce Redesign", client: "TechHive Ltd", deadline: "24 Jan 2026", progress: 75, budget: "$2,400", status: "Active" },
    { id: "PRJ-102", name: "Mobile App API", client: "Creative Agency", deadline: "05 Feb 2026", progress: 40, budget: "$1,800", status: "Pending" },
    { id: "PRJ-103", name: "SEO Optimization", client: "Sarah Khan", deadline: "12 Dec 2025", progress: 100, budget: "$500", status: "Completed" },
];

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-slate-200/70 rounded-2xl ${className}`} />
    );

    return (
        <div className="space-y-8 pb-10 px-2 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase">Operations</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Tracking all active projects
                    </p>
                </div>

                {/* Search Bar - Modern alternative to New Project Button */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-blue-50 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)
                ) : (
                    <>
                        <StatCard icon={<Layers />} label="Total Managed" value="12" color="blue" />
                        <StatCard icon={<Clock />} label="Expiring Soon" value="03" color="orange" />
                        <StatCard icon={<DollarSign />} label="Net Worth" value="$45.2k" color="green" />
                    </>
                )}
            </div>

            {/* Projects Display */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">Client & Identity</th>
                                <th className="hidden md:table-cell px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">Deadline</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">Completion Status</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map((i) => (
                                    <tr key={i}><td colSpan={4} className="px-8 py-6"><Skeleton className="h-14 w-full" /></td></tr>
                                ))
                            ) : (
                                projectsData.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-all cursor-default">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-[#4177BC]/10 flex items-center justify-center text-[#4177BC]">
                                                    <CheckCircle2 size={20} className={item.progress === 100 ? "text-green-500" : "text-[#4177BC]"} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase">{item.id}</span>
                                                    <p className="text-slate-900 font-bold text-sm leading-none group-hover:text-[#4177BC] transition-colors">{item.name}</p>
                                                    <p className="text-[9px] text-[#EB9C2C] mt-1 font-black uppercase">{item.client}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-8 py-6">
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                                                <Calendar size={14} className="text-slate-300" /> {item.deadline}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${item.progress}%` }}
                                                        className={`h-full ${item.progress === 100 ? 'bg-green-500' : 'bg-[#4177BC]'}`} 
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-slate-900 font-black text-sm">{item.budget}</p>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                item.status === 'Active' ? 'bg-blue-50 text-[#4177BC]' : 
                                                item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = { 
        blue: "text-blue-600 bg-blue-50", 
        orange: "text-orange-600 bg-orange-50", 
        green: "text-green-600 bg-green-50" 
    };
    return (
        <div className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <h3 className="text-2xl font-black text-slate-900 leading-none mt-1">{value}</h3>
            </div>
        </div>
    );
}