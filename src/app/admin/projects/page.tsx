/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Layers, DollarSign, Search, Trash2, Edit3, X, Loader2, Target,
    Briefcase, Zap, ShieldCheck, ArrowLeft, LayoutGrid, Globe,
    ChevronLeft, ChevronRight, Filter
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
    const itemsPerPage = 6;

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
            // Sort by creation date by default
            setAllProjects(projectsList.reverse());
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

    const filteredProjects = useMemo(() => {
        return allProjects.filter(prj => {
            const matchesSearch = prj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prj.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || prj.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [allProjects, searchTerm, statusFilter]);

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    const handleDelete = async (clientId: string, projectName: string, internalId: string) => {
        if (!window.confirm(`Are you sure you want to delete this project?`)) return;
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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, x: -10 }
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF] p-4 lg:p-8 selection:bg-[#4177BC] selection:text-white font-sans text-slate-900">
            <div className="max-w-[1600px] mx-auto">

                {/* --- NAVIGATION --- */}
                <nav className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] sticky top-4 z-[60] border border-white">
                    <Link href="/admin">
                        <motion.button whileHover={{ x: -4 }} className="flex items-center gap-3 px-6 py-3  rounded-2xl text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200">
                            <ArrowLeft size={16} /> Back to Admin
                        </motion.button>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                            <div className="flex items-center justify-end gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <p className="text-[11px] font-bold text-slate-700">Live Repository</p>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* --- LEFT SIDEBAR --- */}
                    <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-28">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#4177BC] to-[#2D5A92] rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-100">
                                    <Layers className="text-white" size={28} />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight judson-bold italic mb-2">All <span className="text-[#4177BC] not-italic font-sans uppercase text-xl">Project</span></h1>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8">Comprehensive management of all client architectural assets and budget flows.</p>

                                <div className="space-y-4">
                                    <IdentityItem icon={<LayoutGrid size={14} />} label="Stored Projects" value={stats.total} />
                                    <IdentityItem icon={<Globe size={14} />} label="Network" value="Global" />
                                    <IdentityItem icon={<ShieldCheck size={14} />} label="Audit Log" value="Active" />
                                </div>

                                <motion.button
                                    onClick={() => fetchData()}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full mt-10 py-4 bg-slate-50 hover:bg-[#4177BC] hover:text-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border border-slate-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Target size={16} />}
                                    {loading ? "Syncing..." : "Refresh Database"}
                                </motion.button>
                            </div>
                        </motion.div>
                    </aside>

                    {/* --- MAIN CONTENT --- */}
                    <main className="lg:col-span-9 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatCard title="Total Revenue" value={`$${(stats.revenue / 1000).toFixed(1)}k`} icon={<DollarSign />} color="#4177BC" />
                            <StatCard title="Active Projects" value={stats.active} icon={<Zap />} color="#F59E0B" />
                            <StatCard title="Settled" value={stats.completed} icon={<ShieldCheck />} color="#10B981" />
                        </div>

                        {/* Table Section */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/30 overflow-hidden">
                            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:row justify-between items-center gap-6 bg-gradient-to-r from-white to-slate-50/50">
                                <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-full md:w-auto border border-slate-200/50">
                                    {["All", "Active", "Completed"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${statusFilter === status ? "bg-white text-[#4177BC] shadow-md" : "text-slate-500 hover:text-slate-800"}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-80 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4177BC] transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search by project or client..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-50 focus:border-[#4177BC] transition-all shadow-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto min-h-[400px]">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project details</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stakeholder</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Budget</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <motion.tbody
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="divide-y divide-slate-50"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {paginatedProjects.length > 0 ? (
                                                paginatedProjects.map((item) => (
                                                    <motion.tr
                                                        layout
                                                        variants={rowVariants}
                                                        initial="hidden"
                                                        animate="visible"
                                                        exit="exit"
                                                        key={item.internalId}
                                                        className="hover:bg-blue-50/30 transition-colors group"
                                                    >
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#4177BC] group-hover:border-blue-100 group-hover:shadow-lg transition-all duration-300">
                                                                    <Briefcase size={20} />
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-slate-900 text-sm tracking-tight">{item.name}</p>
                                                                    <p className="text-[10px] text-slate-400 font-medium">ID: {item.internalId.slice(-6).toUpperCase()}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="text-[11px] font-black text-[#4177BC] bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider">{item.clientName}</span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-slate-900 text-base judson-bold italic">${Number(item.budget).toLocaleString()}</p>
                                                        </td>
                                                        <td className="px-8 py-6"><StatusBadge status={item.status || "Active"} /></td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                <button onClick={() => { setSelectedProject({ ...item, oldName: item.name }); setIsEditModalOpen(true); }} className="p-2.5 bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-[#4177BC] hover:border-blue-200 rounded-xl transition-all"><Edit3 size={16} /></button>
                                                                <button onClick={() => handleDelete(item.clientId, item.name, item.internalId)} className="p-2.5 bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-xl transition-all">
                                                                    {actionLoading === `deleting-${item.internalId}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                ))
                                            ) : (
                                                <motion.tr>
                                                    <td colSpan={5} className="px-8 py-20 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                                <Search size={32} />
                                                            </div>
                                                            <p className="text-slate-400 font-bold text-sm">No records found matching your criteria.</p>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </motion.tbody>
                                </table>
                            </div>

                            {/* --- PREMIMUM PAGINATION --- */}
                            <div className="p-6 md:p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/30">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest order-2 sm:order-1">
                                    Displaying <span className="text-slate-900">{Math.min(startIndex + 1, filteredProjects.length)} - {Math.min(startIndex + itemsPerPage, filteredProjects.length)}</span> of {filteredProjects.length} Architectural Records
                                </p>

                                <div className="flex items-center gap-3 order-1 sm:order-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-400 disabled:opacity-30 hover:bg-[#4177BC] hover:text-white hover:border-[#4177BC] transition-all duration-300 shadow-sm disabled:hover:bg-white disabled:hover:text-slate-400"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-2xl text-[10px] font-black transition-all duration-300 transform ${currentPage === i + 1
                                                        ? "bg-[#4177BC] text-white shadow-xl shadow-blue-200 scale-110"
                                                        : "bg-white text-slate-400 border border-slate-200 hover:border-[#4177BC] hover:text-[#4177BC]"
                                                    }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-400 disabled:opacity-30 hover:bg-[#4177BC] hover:text-white hover:border-[#4177BC] transition-all duration-300 shadow-sm disabled:hover:bg-white disabled:hover:text-slate-400"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* --- MODAL (ANIMATED) --- */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl border border-white overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 judson-bold italic uppercase tracking-tight">Edit <span className="text-[#4177BC] not-italic">Project</span></h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Record ID: {selectedProject?.internalId?.slice(-8)}</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Project Nomenclature</label>
                                    <input value={selectedProject?.name || ""} onChange={e => setSelectedProject({ ...selectedProject, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl font-bold outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Financials ($)</label>
                                        <input type="number" value={selectedProject?.budget || ""} onChange={e => setSelectedProject({ ...selectedProject, budget: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl font-bold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Status</label>
                                        <select value={selectedProject?.status || "Active"} onChange={e => setSelectedProject({ ...selectedProject, status: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl font-bold outline-none transition-all appearance-none cursor-pointer">
                                            <option value="Active">Active</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </div>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={actionLoading === 'updating'}
                                    className="w-full py-5 bg-[#4177BC] text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-900 transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-50"
                                >
                                    {actionLoading === 'updating' ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                    Update Repository Record
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- SUB-COMPONENTS ---
function IdentityItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 group/item p-3 rounded-2xl hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-[#4177BC] group-hover/item:bg-white group-hover/item:shadow-sm transition-all">
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-[13px] font-bold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: any) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full opacity-20 transition-opacity group-hover:opacity-40" style={{ backgroundColor: color }} />
            <div className="relative z-10 flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-12" style={{ backgroundColor: `${color}15`, color }}>
                    {React.cloneElement(icon, { size: 24 })}
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-900 judson-bold italic tracking-tight">{value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{title}</p>
                </div>
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: any = {
        Active: { bg: "bg-blue-50/80", text: "text-[#4177BC]", dot: "bg-[#4177BC]", border: "border-blue-100" },
        Completed: { bg: "bg-emerald-50/80", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-100" },
        "On Hold": { bg: "bg-orange-50/80", text: "text-orange-600", dot: "bg-orange-500", border: "border-orange-100" }
    };
    const style = config[status] || config.Active;
    return (
        <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm ${style.border} ${style.bg} ${style.text}`}>
            <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${style.dot} opacity-40`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`}></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest">{status}</span>
        </div>
    );
}