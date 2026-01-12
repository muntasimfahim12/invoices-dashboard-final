/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
    Layers, DollarSign, Search, ArrowUpRight,
    LayoutGrid, Trash2, Edit3, X, Loader2, Target,
    Filter, Menu, ShieldCheck, Tag, Globe, Zap, Briefcase, ChevronDown
} from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = RAW_API_URL.endsWith('/') ? RAW_API_URL.slice(0, -1) : RAW_API_URL;

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const fetchData = useCallback(async (isSilent = false) => {
        if (!API_BASE) return;
        try {
            if (!isSilent) setLoading(true);
            const response = await axios.get(`${API_BASE}/clinets`);
            const projectsList: any[] = [];
            if (response.data && Array.isArray(response.data)) {
                response.data.forEach((client: any) => {
                    if (client.projects && Array.isArray(client.projects)) {
                        client.projects.forEach((prj: any) => {
                            projectsList.push({
                                ...prj,
                                clientId: client._id,
                                clientName: client.name || "Unknown Client",
                            });
                        });
                    }
                });
            }
            setAllProjects(projectsList);
        } catch (error: any) {
            console.error("Fetch Error:", error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const stats = useMemo(() => {
        const total = allProjects.length;
        const revenue = allProjects.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);
        return { total, revenue };
    }, [allProjects]);

    const handleDelete = async (clientId: string, projectName: string) => {
        if (!window.confirm(`Are you sure you want to delete "${projectName}"?`)) return;
        const originalProjects = [...allProjects];
        setAllProjects(prev => prev.filter(p => !(p.clientId === clientId && p.name === projectName)));
        try {
            const clientResponse = await axios.get(`${API_BASE}/clinets/${clientId}`);
            const updatedProjects = clientResponse.data.projects.filter((p: any) => p.name !== projectName);
            await axios.put(`${API_BASE}/clinets/${clientId}`, { projects: updatedProjects });
        } catch (error) {
            setAllProjects(originalProjects);
            alert("Delete failed.");
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading('updating');
        try {
            const { clientId, oldName, name, budget, status } = selectedProject;
            const clientResponse = await axios.get(`${API_BASE}/clinets/${clientId}`);
            const updatedProjects = clientResponse.data.projects.map((p: any) => 
                p.name === oldName ? { ...p, name, budget, status } : p
            );
            await axios.put(`${API_BASE}/clinets/${clientId}`, { projects: updatedProjects });
            setIsEditModalOpen(false);
            await fetchData(true);
        } catch (error) {
            alert("Update failed.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusToggle = async (project: any) => {
        const newStatus = project.status === 'Completed' ? 'Active' : 'Completed';
        setAllProjects(prev => prev.map(p => 
            (p.clientId === project.clientId && p.name === project.name) ? { ...p, status: newStatus } : p
        ));
        try {
            const clientResponse = await axios.get(`${API_BASE}/clinets/${project.clientId}`);
            const updatedProjects = clientResponse.data.projects.map((p: any) => 
                p.name === project.name ? { ...p, status: newStatus } : p
            );
            await axios.put(`${API_BASE}/clinets/${project.clientId}`, { projects: updatedProjects });
        } catch (error) {
            fetchData(true);
        }
    };

    const filteredProjects = allProjects.filter(prj => 
        prj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prj.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-slate-200/60 rounded-3xl ${className}`} />
    );

    return (
        <div className="min-h-screen  pb-40 md:pb-10 font-sans">
            {/* --- Header --- */}
            <header className="sticky top-0 z-30 border-b border-slate-100/50 px-6 py-4 md:px-16 md:py-8 bg-[#FAFBFF]/80 backdrop-blur-md">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="w-full md:w-auto flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#4177BC] text-white px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">Operational Console</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tighter italic uppercase">
                                Global <span className="text-[#4177BC]">Projects</span>
                            </h1>
                        </div>
                        <button className="md:hidden p-3 bg-slate-50 rounded-2xl text-slate-400"><Menu size={20} /></button>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search pipeline..."
                                className="w-full pl-12 pr-6 py-4 md:py-5 bg-slate-50 md:bg-white border border-transparent md:border-slate-100 rounded-[20px] md:rounded-[25px] text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-blue-50 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button onClick={() => fetchData()} className="hidden md:flex px-8 py-5 bg-[#1e3a5f] text-white rounded-[25px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-400/30 hover:scale-105 transition-all items-center gap-3">
                            <Target size={20} /> Sync System
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 md:px-16 pt-8 md:pt-12">
                {/* --- Dynamic Stats --- */}
                <section className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto pb-6 md:pb-0 no-scrollbar">
                    {loading ? [1, 2, 3, 4].map(i => <Skeleton key={i} className="min-w-[240px] md:min-w-0 h-32 rounded-[30px]" />) : (
                        <>
                            <StatCard title="Total Pipeline" value={stats.total} icon={<Layers />} color="#4177BC" />
                            <StatCard title="Gross Revenue" value={`$${(stats.revenue/1000).toFixed(1)}k`} icon={<DollarSign />} color="#EB9C2C" />
                            <StatCard title="Avg Budget" value={`$${(stats.revenue / (allProjects.length || 1) / 1000).toFixed(1)}k`} icon={<Briefcase />} color="#4177BC" />
                            <StatCard title="System Health" value="Active" icon={<ShieldCheck />} color="#EB9C2C" />
                        </>
                    )}
                </section>

                {/* --- Ledger Header --- */}
                <div className="mt-12 mb-6 flex items-center justify-between">
                    <h3 className="font-black text-slate-800 text-lg md:text-xl tracking-tight uppercase italic">Project <span className="text-[#4177BC]">Manifest</span></h3>
                    <div className="flex gap-2">
                        <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4177BC] transition-all"><Filter size={18} /></button>
                        {/* Download button removed as requested */}
                    </div>
                </div>

                {/* --- Mobile View (Cards) --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredProjects.map((item) => (
                        <div key={`${item.clientId}-${item.name}`} className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#4177BC]">
                                        <LayoutGrid size={18} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 text-sm">{item.name}</p>
                                        <p className="text-[9px] text-[#EB9C2C] font-black uppercase tracking-widest">{item.clientName}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedProject({...item, oldName: item.name}); setIsEditModalOpen(true); }} className="p-2 text-slate-400"><Edit3 size={16} /></button>
                                    <button onClick={() => handleDelete(item.clientId, item.name)} className="p-2 text-red-400"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleStatusToggle(item)} className={`shrink-0 w-8 h-4 rounded-full p-0.5 flex items-center transition-all ${item.status === 'Completed' ? 'bg-[#EB9C2C]' : 'bg-slate-200'}`}>
                                        <div className={`h-3 w-3 bg-white rounded-full transition-transform ${item.status === 'Completed' ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                    </button>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{item.status || 'Active'}</span>
                                </div>
                                <p className="font-black text-slate-800 italic">${Number(item.budget).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Desktop View (Table) --- */}
                <div className="hidden md:block bg-white border border-slate-100 rounded-[50px] shadow-2xl shadow-blue-900/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                                <th className="px-10 py-6 text-left">Core Project</th>
                                <th className="px-10 py-6 text-left">Deployment</th>
                                <th className="px-10 py-6 text-left">Valuation</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProjects.map((item) => (
                                <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={`${item.clientId}-${item.name}`} className="hover:bg-blue-50/20 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-black text-[#4177BC] shadow-sm group-hover:bg-[#4177BC] group-hover:text-white transition-all">
                                                <LayoutGrid size={18} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm tracking-tight">{item.name}</p>
                                                <p className="text-[9px] text-[#EB9C2C] font-black uppercase tracking-widest">{item.clientName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => handleStatusToggle(item)} className={`shrink-0 w-10 h-5 rounded-full p-1 flex items-center transition-all ${item.status === 'Completed' ? 'bg-[#EB9C2C]' : 'bg-slate-200'}`}>
                                                <div className={`h-3 w-3 bg-white rounded-full transition-transform ${item.status === 'Completed' ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                            <div className="w-24">
                                                <span className={`text-[9px] inline-block font-black px-3 py-1.5 rounded-lg uppercase border ${item.status === 'Completed' ? 'border-orange-100 text-[#EB9C2C]' : 'border-blue-100 text-[#4177BC]'}`}>
                                                    {item.status || 'Active'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 font-black text-slate-800 text-lg italic">${Number(item.budget).toLocaleString()}</td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => { setSelectedProject({...item, oldName: item.name}); setIsEditModalOpen(true); }} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-[#4177BC] transition-all"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(item.clientId, item.name)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* --- Edit Modal --- */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 md:top-0 md:bottom-0 left-0 right-0 m-auto w-full md:max-w-xl h-[90vh] md:h-fit bg-white rounded-t-[40px] md:rounded-[40px] shadow-2xl z-[51] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 md:p-12 overflow-y-auto h-full no-scrollbar pb-32 md:pb-12">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Adjust <span className="text-[#4177BC]">Project</span></h2>
                                        <p className="text-[#EB9C2C] text-[9px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2"><ShieldCheck size={14} /> Encrypted Channel</p>
                                    </div>
                                    <button onClick={() => setIsEditModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-full"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Name</label>
                                        <input required type="text" className="w-full px-6 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none border-2 border-transparent focus:border-blue-100" value={selectedProject?.name || ""} onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})} />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocated Budget ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#EB9C2C]" size={18} />
                                            <input required type="number" className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none" value={selectedProject?.budget || ""} onChange={(e) => setSelectedProject({...selectedProject, budget: e.target.value})} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                                        <div className="relative">
                                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <select className="w-full pl-14 pr-10 py-4 bg-slate-50 rounded-[20px] text-sm font-bold text-slate-700 outline-none appearance-none" value={selectedProject?.status || "Active"} onChange={(e) => setSelectedProject({...selectedProject, status: e.target.value})}>
                                                <option value="Active">Active Pipeline</option>
                                                <option value="Completed">Completed</option>
                                                <option value="On Hold">On Hold</option>
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    <div className="pt-6 sticky bottom-0 bg-white pb-4">
                                        <button type="submit" disabled={actionLoading === 'updating'} className="w-full py-5 bg-[#4177BC] text-white rounded-[25px] text-xs font-black uppercase tracking-widest shadow-2xl hover:bg-[#EB9C2C] transition-all">
                                            {actionLoading === 'updating' ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Confirm Adjustments"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <motion.div whileHover={{ y: -5 }} className="min-w-[220px] md:min-w-0 bg-white p-5 md:p-6 rounded-[30px] border border-slate-100/50 shadow-xl shadow-blue-900/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-all duration-700" style={{ color }}>
                {React.cloneElement(icon, { size: 60 })}
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-[15px] md:rounded-[18px] mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: `${color}10`, color }}>
                {React.cloneElement(icon, { size: 20 })}
            </div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
            <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter italic uppercase">{value}</h3>
        </motion.div>
    );
}