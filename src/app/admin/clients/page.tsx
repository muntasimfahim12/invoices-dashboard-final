"use client";
import React from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const initialClients = [
    { id: "CL-001", name: "Tanvir Alam", company: "TechHive Ltd", email: "tanvir@techhive.com", status: "Active", projects: 3, totalBilled: "$4,500" },
    { id: "CL-002", name: "Creative Agency", company: "Design Pro", email: "hello@designpro.com", status: "Active", projects: 1, totalBilled: "$1,200" },
    { id: "CL-003", name: "Sarah Khan", company: "Freelance", email: "sarah@example.com", status: "Disabled", projects: 0, totalBilled: "$0" },
];

export default function ClientsPage() {
    return (
        <div className="space-y-8 min-h-screen bg-[#FFFFFF]">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase">Clients</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Database Management</p>
                </div>
                {/* MODAL এর বদলে এখন সরাসরি লিঙ্কে যাবে */}
                <Link 
                    href="/admin/clients/create"
                    className="bg-[#4177BC] text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#4177BC]/20 hover:bg-[#4177BC]/90 hover:scale-105 transition-all flex items-center gap-2 w-fit active:scale-95"
                >
                    <Plus size={16} /> Add New Client
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, company or email..."
                    className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border border-slate-100 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-[#4177BC]/5 transition-all font-bold text-slate-600 text-sm"
                />
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Client / Company</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Projects</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Billed</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-bold">
                            {initialClients.map((client) => (
                                <tr key={client.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <Link href={`/admin/clients/${client.id}`} className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-[#4177BC]/5 flex items-center justify-center text-[#4177BC] font-black group-hover:bg-[#4177BC] group-hover:text-white transition-all shadow-inner">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-slate-900 leading-none mb-1">{client.name}</p>
                                                <p className="text-[10px] text-[#EB9C2C] uppercase tracking-tighter font-black">{client.company}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${client.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-slate-600">{client.projects}</td>
                                    <td className="px-8 py-6 text-slate-900 font-black">{client.totalBilled}</td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-[#4177BC]">
                                            <MoreHorizontal size={20} />
                                        </button>
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