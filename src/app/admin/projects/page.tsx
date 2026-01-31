/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Layers, DollarSign, Search, Trash2, Edit3, X, Loader2, Target,
    Briefcase, Zap, ShieldCheck, ArrowLeft, LayoutGrid, Globe,
    ChevronLeft, ChevronRight
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
    const [statusFilter, setStatusFilter] = useState("All");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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
                                internalId: prj._id || `${client._id}-${prj.name}-${Math.random()}`,
                                clientId: client._id,
                                clientName: client.name || "Unknown Client",
                                createdAt: prj.createdAt || new Date().toISOString()
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
        const active = allProjects.filter(p => p.status !== 'Completed').length;
        const completed = total - active;
        return { total, revenue, active, completed };
    }, [allProjects]);

    const filteredProjects = allProjects.filter(prj => {
        const matchesSearch = prj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               prj.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || prj.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

    // Reset to page 1 when filtering or searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleDelete = async (clientId: string, projectName: string, internalId: string) => {
        if (!window.confirm(`Are you sure?`)) return;
        try {
            setActionLoading(`deleting-${internalId}`);
            const clientRes = await axios.get(`${API_BASE}/clinets/${clientId}`);
            const updatedProjects = clientRes.data.projects.filter((p: any) => p.name !== projectName);
            await axios.put(`${API_BASE}/clinets/${clientId}`, { projects: updatedProjects });
            setAllProjects(prev => prev.filter(p => p.internalId !== internalId));
        } catch (error) { alert("Delete failed."); } finally { setActionLoading(null); }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading('updating');
        try {
            const { clientId, oldName, name, budget, status } = selectedProject;
            const clientRes = await axios.get(`${API_BASE}/clinets/${clientId}`);
            const updatedProjects = clientRes.data.projects.map((p: any) =>
                p.name === oldName ? { ...p, name, budget: Number(budget), status } : p
            );
            await axios.put(`${API_BASE}/clinets/${clientId}`, { projects: updatedProjects });
            setIsEditModalOpen(false);
            await fetchData(true);
        } catch (error) { alert("Update failed."); } finally { setActionLoading(null); }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] p-4 lg:p-8 selection:bg-[#4177BC] selection:text-white font-sans">
            <div className="max-w-[1600px] mx-auto">
                
                <nav className="flex items-center justify-between mb-8 bg-[#FFFFFF]/50 backdrop-blur-md p-4 rounded-3xl sticky top-4 z-50">
                    <Link href="/admin">
                        <motion.button whileHover={{ scale: 1.05 }} className="flex items-center gap-3 px-5 py-2.5 bg-[#FFFFFF] rounded-2xl text-slate-600 font-bold text-xs shadow-sm border border-slate-100 uppercase tracking-tighter">
                            <ArrowLeft size={16} /> Back to Admin
                        </motion.button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Project Hub Status</p>
                            <p className="text-[11px] font-bold text-blue-500 flex items-center justify-end gap-1.5">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> Global Repository
                            </p>
                        </div>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* --- LEFT COLUMN --- */}
                    <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28 transition-all duration-500">
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4177BC]/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-[#4177BC] rounded-3xl flex items-center justify-center mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform">
                                    <Layers className="text-[#FFFFFF]" size={32} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight judson-bold mb-1 italic">All <span className="text-[#4177BC] not-italic">Project</span></h1>
                                <span className="px-3 py-1 bg-blue-50 text-[#4177BC] text-[10px] font-black uppercase rounded-full border border-blue-100">Centralized Database</span>
                                <div className="mt-10 space-y-5">
                                    <IdentityItem icon={<LayoutGrid size={14} />} label="Total Records" value={`${stats.total} Projects`} />
                                    <IdentityItem icon={<Zap size={14} />} label="In Operation" value={`${stats.active} Active`} />
                                    <IdentityItem icon={<ShieldCheck size={14} />} label="Security Level" value="Encrypted" />
                                </div>
                                <motion.button onClick={() => fetchData()} whileTap={{ scale: 0.95 }} className="w-full mt-10 py-4 bg-slate-50 hover:bg-slate-900 hover:text-[#FFFFFF] text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 flex items-center justify-center gap-2">
                                    <Target size={14} className={loading ? "animate-spin" : ""} />
                                    {loading ? "Syncing..." : "Re-sync Repository"}
                                </motion.button>
                            </div>
                        </motion.div>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#4177BC] to-[#345e96] rounded-[35px] p-8 text-[#FFFFFF] shadow-xl shadow-[#4177BC]/20 relative overflow-hidden">
                           <Globe className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/10 rotate-12" />
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#FFFFFF]/70 mb-2">Internal Note</p>
                           <p className="text-xs leading-relaxed font-medium italic">Viewing all projects across all clients. Use filters to narrow down the architecture.</p>
                        </motion.div>
                    </aside>

                    {/* --- RIGHT COLUMN --- */}
                    <main className="lg:col-span-9 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatCard title="Capital Flow" value={`$${(stats.revenue/1000).toFixed(1)}k`} icon={<DollarSign />} color="#4177BC" />
                            <StatCard title="Active Flux" value={stats.active} icon={<Zap />} color="#EB9C2C" />
                            <StatCard title="Completed" value={stats.completed} icon={<ShieldCheck />} color="#10B981" />
                        </div>

                        <div className="bg-white rounded-[45px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex p-1.5 bg-slate-100 rounded-[22px] w-full md:w-auto">
                                    {["All", "Active", "Completed"].map((status) => (
                                        <button key={status} onClick={() => setStatusFilter(status)} className={`px-6 py-2 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === status ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Architecture</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Budget</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence mode="popLayout">
                                            {paginatedProjects.map((item) => (
                                                <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.internalId} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100 transition-all">
                                                                <Briefcase size={18} />
                                                            </div>
                                                            <span className="font-bold text-slate-900 text-sm tracking-tight">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-[11px] font-black text-[#4177BC] uppercase">{item.clientName}</td>
                                                    <td className="px-8 py-6 font-black text-slate-900 judson-bold italic text-lg">${Number(item.budget).toLocaleString()}</td>
                                                    <td className="px-8 py-6"><StatusBadge status={item.status || "Active"} /></td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => { setSelectedProject({ ...item, oldName: item.name }); setIsEditModalOpen(true); }} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Edit3 size={16} /></button>
                                                            <button onClick={() => handleDelete(item.clientId, item.name, item.internalId)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors">
                                                                {actionLoading === `deleting-${item.internalId}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>

                            {/* --- PROFESSIONAL PAGINATION NAVIGATION --- */}
                            <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProjects.length)} of {filteredProjects.length} Records
                                </p>
                                <div className="flex items-center gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="p-2 rounded-xl border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50"}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="p-2 rounded-xl border border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* --- EDIT MODAL --- */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl border border-slate-100">
                             <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900 judson-bold italic uppercase">Edit <span className="text-blue-600 not-italic">Project</span></h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500"><X size={20}/></button>
                             </div>
                             <form onSubmit={handleEditSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Project Name</label>
                                    <input value={selectedProject?.name || ""} onChange={e => setSelectedProject({...selectedProject, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-100" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Budget</label>
                                        <input type="number" value={selectedProject?.budget || ""} onChange={e => setSelectedProject({...selectedProject, budget: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-100" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Status</label>
                                        <select value={selectedProject?.status || "Active"} onChange={e => setSelectedProject({...selectedProject, status: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold outline-none focus:ring-2 focus:ring-blue-100">
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" disabled={actionLoading === 'updating'} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                                    {actionLoading === 'updating' ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16}/>}
                                    Save Core Data
                                </button>
                             </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- COMPONENTS --- (IdentityItem, StatCard, StatusBadge same as before)
function IdentityItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 group/item">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-[#4177BC] group-hover/item:bg-blue-50 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
                <p className="text-[12px] font-bold text-slate-700 leading-none">{value}</p>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <div className="bg-[#FFFFFF] p-6 rounded-[30px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}10`, color }}>
                    {React.cloneElement(icon, { size: 20 })}
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 judson-bold italic">{value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        Active: { bg: "bg-blue-50/70", text: "text-blue-600", dot: "bg-blue-500", ring: "ring-blue-100" },
        Completed: { bg: "bg-emerald-50/70", text: "text-emerald-600", dot: "bg-emerald-500", ring: "ring-emerald-100" },
        "On Hold": { bg: "bg-orange-50/70", text: "text-orange-600", dot: "bg-orange-500", ring: "ring-orange-100" }
    };
    const style = config[status] || config.Active;
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl border border-white ring-1 ${style.ring} ${style.bg} ${style.text}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
            <span className="text-[9px] font-black uppercase">{status}</span>
        </div>
    );
}