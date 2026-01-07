/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Plus, Search, Layers, Clock, DollarSign, ArrowUpRight, Calendar, Filter } from "lucide-react";
import Link from "next/link";

const projects = [
    { id: "PRJ-101", name: "E-commerce Redesign", client: "TechHive Ltd", deadline: "24 Jan 2026", progress: 75, budget: "$2,400", status: "Active" },
    { id: "PRJ-102", name: "Mobile App API", client: "Creative Agency", deadline: "05 Feb 2026", progress: 40, budget: "$1,800", status: "Pending" },
    { id: "PRJ-103", name: "SEO Optimization", client: "Sarah Khan", deadline: "12 Dec 2025", progress: 100, budget: "$500", status: "Completed" },
];

export default function ProjectsPage() {
    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase">Projects</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Operational Fleet</p>
                </div>
                <Link href="/admin/projects/create" className="bg-[#4177BC] text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#4177BC]/20 hover:scale-105 transition-all flex items-center gap-2 w-fit">
                    <Plus size={16} /> New Project
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Layers />} label="Active Projects" value="12" color="blue" />
                <StatCard icon={<Clock />} label="Urgent Deadlines" value="03" color="orange" />
                <StatCard icon={<DollarSign />} label="Total Revenue" value="$45.2k" color="green" />
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Project & Client</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Timeline</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Progress</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {projects.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/30 transition-all">
                                    <td className="px-8 py-6">
                                        <Link href={`/admin/projects/${item.id}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-[#4177BC] uppercase">{item.id}</span>
                                                <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 text-slate-300 transition-all" />
                                            </div>
                                            <p className="text-slate-900 font-bold text-sm leading-none">{item.name}</p>
                                            <p className="text-[9px] text-[#EB9C2C] mt-1 font-black uppercase tracking-tighter">{item.client}</p>
                                        </Link>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                                            <Calendar size={14} className="text-slate-300" /> {item.deadline}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="w-full max-w-[120px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#4177BC] rounded-full" style={{ width: `${item.progress}%` }} />
                                        </div>
                                        <span className="text-[9px] font-black text-slate-400 mt-1 block uppercase">{item.progress}% Done</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="text-slate-900 font-black text-sm">{item.budget}</p>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${item.status === 'Active' ? 'bg-blue-50 text-[#4177BC]' : 'bg-green-50 text-green-600'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = { blue: "text-blue-600 bg-blue-50", orange: "text-[#EB9C2C] bg-orange-50", green: "text-green-600 bg-green-50" };
    return (
        <div className="bg-white p-6 rounded-[2.2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>{icon}</div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <h3 className="text-xl font-black text-slate-900 leading-none mt-1">{value}</h3>
            </div>
        </div>
    );
}