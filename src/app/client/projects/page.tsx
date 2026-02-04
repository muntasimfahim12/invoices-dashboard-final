/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import {
    LayoutGrid, List, Search, ExternalLink,
    Calendar, CheckCircle2, Clock, AlertCircle,
    Layers, User, DollarSign, Loader2, TrendingUp, BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// TypeScript Interface
interface Project {
    _id: string;
    title: string;
    name?: string;
    description: string;
    clientName: string;
    status: 'In Progress' | 'Completed' | 'Pending' | 'On Hold';
    priority: 'High' | 'Medium' | 'Low';
    startDate: string;
    deadline: string;
    progress: number;
    budget: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ FIX 1: clientEmail state
    const [clientEmail, setClientEmail] = useState<string | null>(null);

    // ✅ FIX 2: localStorage only in useEffect (browser safe)
    useEffect(() => {
        if (typeof window !== "undefined") {
            setClientEmail(localStorage.getItem("user_email"));
        }
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${API_BASE}/projects`,
                    { params: { email: clientEmail } }
                );

                const mappedData = response.data.map((p: any) => ({
                    ...p,
                    title: p.title || p.name || "Untitled Project"
                }));

                setProjects(Array.isArray(mappedData) ? mappedData : []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        if (clientEmail) fetchProjects();
    }, [clientEmail]);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const completedCount = projects.filter(p => p.status === 'Completed').length;
    const inProgressCount = projects.filter(p => p.status === 'In Progress').length;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-[#4177BC] mx-auto mb-4" size={48} />
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                        Loading Projects...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 judson-bold">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-4xl font-[1000] judson-bold  tracking-tighter uppercase leading-none">
                        My <span className="text-[#4177BC]">Projects</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                        Real-time delivery tracking & status
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#4177BC] text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}>
                        <LayoutGrid size={20} />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#4177BC] text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}>
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStat label="Total" value={projects.length} icon={<Layers size={16} />} color="blue" />
                <QuickStat label="Active" value={inProgressCount} icon={<Clock size={16} />} color="amber" />
                <QuickStat label="Done" value={completedCount} icon={<CheckCircle2 size={16} />} color="emerald" />
                <QuickStat label="Budget" value={`$${projects.reduce((a, b) => a + (b.budget || 0), 0).toLocaleString()}`} icon={<DollarSign size={16} />} color="slate" />
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors" size={22} />
                <input
                    type="text"
                    placeholder="Find a project by name or current status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white rounded-4xl border border-slate-100 focus:border-[#4177BC] focus:ring-4 focus:ring-blue-50 outline-none shadow-sm font-semibold transition-all text-slate-700"
                />
            </div>

            {/* Projects Container */}
            <AnimatePresence mode="wait">
                {filteredProjects.length > 0 ? (
                    viewMode === 'grid' ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredProjects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hidden md:block"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
                                        <th className="px-10 py-6">Project Identification</th>
                                        <th className="px-10 py-6 text-center">Execution</th>
                                        <th className="px-10 py-6">Status</th>
                                        <th className="px-10 py-6 text-right">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredProjects.map((project) => (
                                        <ProjectRow key={project._id} project={project} />
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    )
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Layers size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Projects Found</h3>
                        <p className="text-slate-400 text-sm mt-1">Try searching with a different keyword.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Internal Components ---

function QuickStat({ label, value, icon, color }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
        slate: 'bg-slate-900 text-white'
    };
    return (
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-lg font-black text-slate-900 leading-none mt-1">{value}</p>
            </div>
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="group bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#4177BC]/10 transition-all duration-500 relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-3xl transition-colors duration-500 group-hover:bg-[#4177BC] group-hover:text-white ${getStatusColor(project.status).bg} ${getStatusColor(project.status).text}`}>
                    <Layers size={28} />
                </div>
                <StatusBadge status={project.status} />
            </div>

            <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 leading-[1.1] tracking-tight group-hover:text-[#4177BC] transition-colors">
                    {project.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 font-medium leading-relaxed">
                    {project.description || "No project description available for this workspace."}
                </p>
            </div>

            <div className="mt-8 space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><TrendingUp size={12} /> Progress</span>
                    <span className="text-[#4177BC]">{project.progress || 0}%</span>
                </div>
                <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-[#4177BC] rounded-full shadow-[0_0_10px_rgba(65,119,188,0.4)]"
                    />
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Due Date</span>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-[11px] font-black text-slate-600 tracking-tight">
                            {project.deadline ? new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBA'}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Value</span>
                    <div className="flex items-center gap-1 text-[#4177BC]">
                        <span className="text-sm font-black tracking-tighter">${project.budget?.toLocaleString() || 0}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function ProjectRow({ project }: { project: Project }) {
    return (
        <tr className="hover:bg-blue-50/30 transition-all group border-b border-slate-50 last:border-0">
            <td className="px-10 py-7">
                <div className="flex items-center gap-5">
                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC] group-hover:text-white transition-all duration-300">
                        <Layers size={22} />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-base tracking-tight leading-none">{project.title}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1.5">ID: {project._id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
            </td>
            <td className="px-10 py-7">
                <div className="w-40 mx-auto space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                        <span>Completion</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#4177BC] transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                    </div>
                </div>
            </td>
            <td className="px-10 py-7">
                <StatusBadge status={project.status} />
            </td>
            <td className="px-10 py-7 text-right">
                <p className="font-black text-slate-900 text-sm tracking-tight">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Scheduled</p>
            </td>
        </tr>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors = getStatusColor(status);
    return (
        <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${colors.bg} ${colors.text} ${colors.border} group-hover:scale-105`}>
            {status}
        </span>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Completed': return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
        case 'In Progress': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' };
        case 'On Hold': return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
        case 'Pending': return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };
        default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100' };
    }
};