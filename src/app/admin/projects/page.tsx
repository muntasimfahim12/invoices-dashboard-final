/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { 
    Layers, DollarSign, Search, ChevronLeft, ChevronRight,
    LayoutGrid, Trash2, Edit3, X, Loader2, Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = "http://localhost:5000";

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const projectsPerPage = 8;

    const fetchData = useCallback(async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const response = await axios.get(`${API_BASE}/clinets`);
            const projectsList: any[] = [];

            response.data.forEach((client: any) => {
                if (client.projects && Array.isArray(client.projects)) {
                    client.projects.forEach((prj: any) => {
                        projectsList.push({
                            ...prj,
                            clientId: client._id,
                            clientName: client.name || "Client",
                        });
                    });
                }
            });
            setAllProjects(projectsList);
        } catch (error) {
            console.error("Fetch Error:", error);
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
            const { clientId, oldName, name, budget, status, type } = selectedProject;
            const clientResponse = await axios.get(`${API_BASE}/clinets/${clientId}`);
            const updatedProjects = clientResponse.data.projects.map((p: any) => 
                p.name === oldName ? { ...p, name, budget, status, type } : p
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

    const filtered = allProjects.filter(prj => 
        prj.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prj.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentProjects = filtered.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);
    const totalPages = Math.ceil(filtered.length / projectsPerPage);

    return (
        <div className="min-h-screen pb-10 px-4 md:px-8 font-sans text-slate-800 bg-[#FFFFFF]">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end pt-12 mb-10 gap-8">
                <div className="space-y-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-[#4177BC]/5 px-3 py-1.5 rounded-full border border-[#4177BC]/10 w-fit">
                        <div className="w-1.5 h-1.5 bg-[#4177BC] rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.2em]">Operational Console</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-[1000] leading-none tracking-tighter text-[#1e3a5f]">
                        Global <span className="text-[#4177BC]">Projects</span>
                    </h1>
                    <p className="text-slate-400 text-xs font-medium tracking-tight">Manage and track your active pipeline and revenue flow.</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:flex gap-4 w-full md:w-auto">
                    <MiniStat label="Live Pipeline" value={stats.total} color="#EB9C2C" icon={<Layers size={18}/>} />
                    <MiniStat label="Gross Revenue" value={`$${(stats.revenue/1000).toFixed(1)}k`} color="#4177BC" icon={<DollarSign size={18}/>} />
                </div>
            </header>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                <div className="relative w-full md:w-[450px] group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by project or client..." 
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-[#FFFFFF] border-2 border-slate-100 pl-14 pr-6 py-4 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-[#4177BC]/5 focus:border-[#4177BC]/30 transition-all text-sm font-bold placeholder:text-slate-300"
                    />
                </div>
                <button 
                    disabled={loading}
                    onClick={(e) => { e.preventDefault(); fetchData(); }} 
                    className="w-full md:w-auto bg-[#1e3a5f] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-[#4177BC] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sync System <Target size={14}/></>}
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-[#FFFFFF] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                
                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="w-[40%] pl-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Project Core</th>
                                <th className="w-[25%] px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Deployment Status</th>
                                <th className="w-[20%] px-6 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Valuation</th>
                                <th className="w-[15%] pr-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {!loading && currentProjects.map((item) => (
                                <ProjectRow 
                                    key={`${item.clientId}-${item.name}`} 
                                    item={item} 
                                    onStatusToggle={handleStatusToggle}
                                    onEdit={(p: any) => { setSelectedProject({...p, oldName: p.name}); setIsEditModalOpen(true); }}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE CARD LIST */}
                <div className="md:hidden divide-y divide-slate-100">
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="p-8 h-40 animate-pulse bg-slate-50" />)
                    ) : (
                        currentProjects.map((item) => (
                            <div key={`${item.clientId}-${item.name}`} className="p-6 flex flex-col gap-5">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-[#4177BC]/10 flex items-center justify-center text-[#4177BC] shrink-0">
                                            <LayoutGrid size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h3>
                                            <p className="text-[10px] font-bold text-[#EB9C2C] uppercase tracking-widest mt-1">{item.clientName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-[#1e3a5f] text-lg">${Number(item.budget).toLocaleString()}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between bg-slate-50/80 p-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleStatusToggle(item)}
                                            className={`w-11 h-6 rounded-full p-1 flex items-center transition-all ${item.status === 'Completed' ? 'bg-[#EB9C2C]' : 'bg-slate-300'}`}
                                        >
                                            <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${item.status === 'Completed' ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${item.status === 'Completed' ? 'text-[#EB9C2C]' : 'text-slate-500'}`}>
                                            {item.status || 'Active'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setSelectedProject({...item, oldName: item.name}); setIsEditModalOpen(true); }} className="p-2.5 text-[#4177BC] bg-[#4177BC]/10 rounded-xl"><Edit3 size={18}/></button>
                                        <button onClick={() => handleDelete(item.clientId, item.name)} className="p-2.5 text-red-500 bg-red-50 rounded-xl"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-8 bg-slate-50/30 flex justify-between items-center border-t border-slate-100">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Entry {currentPage} of {totalPages}</span>
                        <div className="flex bg-[#1e3a5f] p-1.5 rounded-2xl shadow-lg shadow-blue-900/20">
                            <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="p-2.5 text-white disabled:opacity-20 transition-opacity"><ChevronLeft size={20}/></button>
                            <div className="w-[1px] bg-white/10 mx-1" />
                            <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages} className="p-2.5 text-white disabled:opacity-20 transition-opacity"><ChevronRight size={20}/></button>
                        </div>
                    </div>
                )}
            </div>

            {/* MODERN MODAL */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-[#1e3a5f]/40 backdrop-blur-md z-50" />
                        <motion.div 
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full md:max-w-md bg-[#FFFFFF] z-[51] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] p-8 md:p-10 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-[1000] tracking-tighter text-[#1e3a5f]">Edit <span className="text-[#4177BC]">Project</span></h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Resource ID: {selectedProject?.clientId?.slice(-6)}</p>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-3 bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"><X size={24}/></button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="space-y-8 flex-1">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase text-[#4177BC] tracking-[0.15em] ml-1">Project Name</label>
                                    <input required type="text" value={selectedProject?.name || ""} onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl outline-none focus:border-[#4177BC]/30 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" />
                                </div>
                                
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase text-[#4177BC] tracking-[0.15em] ml-1">Allocated Budget ($)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input required type="number" value={selectedProject?.budget || ""} onChange={(e) => setSelectedProject({...selectedProject, budget: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 pl-12 p-5 rounded-2xl outline-none focus:border-[#4177BC]/30 focus:bg-white transition-all font-bold text-slate-700 shadow-inner" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase text-[#4177BC] tracking-[0.15em] ml-1">Lifecycle Status</label>
                                    <select value={selectedProject?.status || "Active"} onChange={(e) => setSelectedProject({...selectedProject, status: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-50 p-5 rounded-2xl outline-none focus:border-[#4177BC]/30 focus:bg-white transition-all font-bold text-slate-700 shadow-inner appearance-none cursor-pointer">
                                        <option value="Active">Active Pipeline</option>
                                        <option value="Completed">Project Completed</option>
                                        <option value="On Hold">Status: On Hold</option>
                                    </select>
                                </div>

                                <div className="pt-10">
                                    <button type="submit" disabled={actionLoading === 'updating'} className="w-full bg-[#4177BC] text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-[#4177BC]/30 hover:scale-[1.02] active:scale-95 transition-all">
                                        {actionLoading === 'updating' ? <Loader2 size={20} className="animate-spin mx-auto" /> : "Commit Changes"}
                                    </button>
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="w-full mt-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors">Discard Adjustments</button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProjectRow({ item, onStatusToggle, onEdit, onDelete }: any) {
    return (
        <tr className="group hover:bg-slate-50/50 transition-all">
            <td className="pl-10 py-6">
                <div className="flex items-center gap-5">
                    <div className="h-11 w-11 rounded-2xl bg-[#1e3a5f] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/10 group-hover:bg-[#4177BC] transition-colors">
                        <LayoutGrid size={18} />
                    </div>
                    <div className="truncate">
                        <p className="text-sm font-black text-[#1e3a5f] truncate mb-0.5">{item.name}</p>
                        <p className="text-[10px] text-[#EB9C2C] font-black uppercase tracking-widest">{item.clientName}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => onStatusToggle(item)} className={`w-11 h-6 rounded-full p-1 flex items-center transition-all ${item.status === 'Completed' ? 'bg-[#EB9C2C]' : 'bg-slate-200'}`}>
                        <div className={`h-4 w-4 bg-white rounded-full shadow-sm transition-transform ${item.status === 'Completed' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-tight px-3 py-1 rounded-full ${item.status === 'Completed' ? 'text-[#EB9C2C] bg-[#EB9C2C]/10' : 'text-slate-400 bg-slate-100'}`}>
                        {item.status || 'Active'}
                    </span>
                </div>
            </td>
            <td className="px-6 py-6 text-right">
                <p className="text-base font-black text-[#1e3a5f] tracking-tighter">${Number(item.budget).toLocaleString()}</p>
            </td>
            <td className="pr-10 py-6">
                <div className="flex items-center justify-center gap-3">
                    <button onClick={() => onEdit(item)} className="p-2.5 text-slate-300 hover:text-[#4177BC] hover:bg-[#4177BC]/5 rounded-xl transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => onDelete(item.clientId, item.name)} className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
            </td>
        </tr>
    );
}

function MiniStat({ label, value, color, icon }: any) {
    return (
        <div className="bg-[#FFFFFF] p-5 rounded-[2rem] flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-50 flex-1 min-w-[160px]">
            <div className={`p-3.5 rounded-2xl text-white shadow-xl shrink-0`} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1 truncate">{label}</p>
                <p className="text-xl md:text-2xl font-[1000] text-[#1e3a5f] leading-none tracking-tighter truncate">{value}</p>
            </div>
        </div>
    );
}