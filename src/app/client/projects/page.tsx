/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { LayoutGrid, List, Search, Layers, Clock, DollarSign, Loader2, ArrowUpRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";

const PRIMARY = "#4177BC";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState("");
    const [clientEmail, setClientEmail] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedEmail = localStorage.getItem("user_email");
            setClientEmail(savedEmail);
        }
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!clientEmail) return;
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/projects`, { 
                    params: { email: clientEmail } 
                });
                setProjects(Array.isArray(response.data) ? response.data : []);
            } catch (error) { 
                console.error("API Error:", error); 
                setProjects([]);
            } finally { 
                setLoading(false); 
            }
        };
        fetchProjects();
    }, [clientEmail]);

    const filtered = useMemo(() => {
        return projects.filter(p => {
            const nameToSearch = (p.title || p.name || "").toLowerCase();
            return nameToSearch.includes(searchTerm.toLowerCase());
        });
    }, [projects, searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#4177BC] mb-4" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 inter-bold">Syncing Workspaces...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24 font-sans text-[#0F172A]">
            <main className="max-w-360 mx-auto px-6 mt-12">
                
                {/* 1. Header Section - Matching Overview Style */}
                <section className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4177BC]/5 rounded-full mb-8 border border-[#4177BC]/10">
                        <span className="w-2 h-2 bg-[#4177BC] rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4177BC] inter-bold">Workspace Portfolio</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] tracking-tighter leading-tight judson-bold">
                                My <span className="text-slate-300">workspaces</span>
                            </h1>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 inter-bold">Track your active builds & delivery roadmap</p>
                        </div>

                        {/* View Switcher */}
                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <button 
                                onClick={() => setViewMode('grid')} 
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#4177BC] shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <LayoutGrid size={18}/>
                            </button>
                            <button 
                                onClick={() => setViewMode('list')} 
                                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-[#4177BC] shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <List size={18}/>
                            </button>
                        </div>
                    </div>
                </section>

                {/* 2. Quick Stats - Same StatCard Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <QuickStatCard 
                        title="Active Builds" 
                        value={projects.filter(p => p.status?.toLowerCase() !== 'completed').length} 
                        icon={<Activity size={20}/>} 
                        color={PRIMARY} 
                    />
                    <QuickStatCard 
                        title="Total Investment" 
                        value={`$${projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0).toLocaleString()}`} 
                        icon={<DollarSign size={20}/>} 
                        color="#10B981" 
                    />
                </div>

                {/* 3. Search Bar - Matching Overview Cleanliness */}
                <div className="relative mb-16 group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH WORKSPACES..." 
                        className="w-full pl-16 pr-8 py-8 bg-white rounded-[32px] border border-slate-100 outline-none focus:border-[#4177BC]/30 focus:shadow-xl focus:shadow-blue-50/50 transition-all font-black text-[10px] tracking-[0.2em] uppercase text-slate-700 inter-bold shadow-sm"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* 4. Projects Display */}
                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        <motion.div 
                            layout
                            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}
                        >
                            {filtered.map((project) => (
                                <Link key={project._id} href={`/client/projects/${project._id}`}>
                                    <ProjectItemCard project={project} mode={viewMode} />
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="py-32 text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                            <Layers className="mx-auto text-slate-200 mb-6" size={48} />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 inter-bold">No matching workspaces found</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

// --- Helper Components (UI Perfected) ---

function QuickStatCard({ title, value, icon, color }: any) {
    return (
        <div className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-500 relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm" style={{ backgroundColor: `${color}10`, color: color }}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 inter-bold">{title}</p>
                    <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter inter-bold">{value}</h3>
                </div>
            </div>
        </div>
    );
}

function ProjectItemCard({ project, mode }: any) {
    const title = project.title || project.name || "Unnamed Workspace";
    
    if (mode === 'list') return (
        <motion.div 
            whileHover={{ x: 10 }}
            className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group cursor-pointer"
        >
            <div className="flex items-center gap-6">
                <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-[#4177BC] group-hover:bg-blue-50 transition-all">
                    <Layers size={24}/>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-[#0F172A] judson-bold group-hover:text-[#4177BC] transition-colors">{title}</h4>
                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest inter-bold mt-1">REF: {project._id?.slice(-8).toUpperCase()}</p>
                </div>
            </div>
            <div className="flex items-center gap-12">
                <div className="hidden md:block text-right">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest inter-bold mb-1">Valuation</p>
                    <p className="font-black text-[#0F172A] inter-bold">${Number(project.budget).toLocaleString()}</p>
                </div>
                <div className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 inter-bold">
                    {project.status || "Active"}
                </div>
                <ArrowUpRight size={18} className="text-slate-200 group-hover:text-[#4177BC] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>
        </motion.div>
    );

    return (
        <motion.div 
            whileHover={{ y: -10 }} 
            className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer h-full"
        >
            <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-[#4177BC] transition-all duration-500 shadow-sm">
                    <Layers size={28}/>
                </div>
                <div className="px-4 py-1.5 bg-[#4177BC]/5 text-[#4177BC] rounded-full text-[9px] font-black uppercase tracking-widest border border-[#4177BC]/10 inter-bold">
                    {project.status || "Active"}
                </div>
            </div>

            <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight judson-bold group-hover:text-[#4177BC] transition-colors leading-tight mb-8">
                {title}
            </h3>
            
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest inter-bold">Development Progress</p>
                        <p className="text-sm font-black text-[#4177BC] inter-bold">{project.progress || 0}%</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress || 0}%` }}
                            className="h-full bg-[#4177BC] rounded-full" 
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest inter-bold">Investment</p>
                        <p className="text-xl font-black text-[#0F172A] inter-bold">${Number(project.budget).toLocaleString()}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#4177BC] group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                    </div>
                </div>
            </div>
        </motion.div>
    ); 
}