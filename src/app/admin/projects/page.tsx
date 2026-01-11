/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { 
    Layers, DollarSign, Search, ChevronLeft, ChevronRight,
    LayoutGrid, Trash2, Edit3, X, Loader2, MoreVertical
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
        <div className="min-h-screen pb-10 px-4 md:px-8 font-sans text-slate-800 bg-[#F8FAFC]">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end pt-8 mb-8 gap-6">
                <div className="space-y-2 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-white/80 px-3 py-1 rounded-full border border-[#4177BC]/20 w-fit">
                        <div className="w-1.5 h-1.5 bg-[#4177BC] rounded-full animate-pulse" />
                        <span className="text-[9px] font-bold text-[#4177BC] uppercase tracking-widest">Live Operations</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-[1000] leading-none tracking-tighter">
                        Project <span className="text-[#4177BC]">Control</span>
                    </h1>
                    <button 
                        disabled={loading}
                        onClick={(e) => { e.preventDefault(); fetchData(); }} 
                        className="w-full md:w-auto bg-[#EB9C2C] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-[#EB9C2C]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 size={12} className="animate-spin" /> : "Sync Dashboard"}
                    </button>
                </div>
                
                {/* Stats Grid - 2 Columns on Mobile */}
                <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
                    <MiniStat label="Pipeline" value={stats.total} color="#EB9C2C" icon={<Layers size={14}/>} />
                    <MiniStat label="Revenue" value={`$${(stats.revenue/1000).toFixed(1)}k`} color="#1e3a5f" icon={<DollarSign size={14}/>} />
                </div>
            </header>

            {/* Sticky Search Bar */}
            <div className="sticky top-4 z-40 mb-6 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4177BC] transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full md:w-[400px] bg-white/90 backdrop-blur-md border border-white pl-14 pr-6 py-4 rounded-2xl shadow-xl shadow-slate-200/50 outline-none focus:ring-4 focus:ring-[#4177BC]/10 focus:border-[#4177BC]/20 transition-all text-sm font-bold"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white md:bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden">
                
                {/* DESKTOP TABLE (Hidden on Mobile) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="w-[40%] pl-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identification</th>
                                <th className="w-[25%] px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status Hub</th>
                                <th className="w-[20%] px-6 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Budget</th>
                                <th className="w-[15%] pr-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Actions</th>
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

                {/* MOBILE CARD LIST (Hidden on Desktop) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="p-6 h-32 animate-pulse bg-slate-50 mb-2 rounded-xl" />)
                    ) : (
                        currentProjects.map((item) => (
                            <div key={`${item.clientId}-${item.name}`} className="p-5 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white shrink-0">
                                            <LayoutGrid size={16} />
                                        </div>
                                        <div className="max-w-[180px]">
                                            <h3 className="font-extrabold text-slate-900 leading-tight truncate">{item.name}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{item.clientName}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-[1000] text-slate-900 leading-none">${Number(item.budget).toLocaleString()}</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{item.type || 'Fixed'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleStatusToggle(item)}
                                            className={`w-9 h-5 rounded-full p-1 flex items-center transition-colors ${item.status === 'Completed' ? 'bg-[#EB9C2C]' : 'bg-slate-300'}`}
                                        >
                                            <div className={`h-3 w-3 bg-white rounded-full transition-transform ${item.status === 'Completed' ? 'translate-x-4' : 'translate-x-0'}`} />
                                        </button>
                                        <span className={`text-[9px] font-black uppercase ${item.status === 'Completed' ? 'text-[#EB9C2C]' : 'text-slate-500'}`}>
                                            {item.status || 'Active'}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setSelectedProject({...item, oldName: item.name}); setIsEditModalOpen(true); }} className="p-2 text-[#4177BC] bg-blue-50 rounded-lg"><Edit3 size={16}/></button>
                                        <button onClick={() => handleDelete(item.clientId, item.name)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-6 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Page {currentPage}/{totalPages}</span>
                        <div className="flex bg-[#1e3a5f] p-1 rounded-xl">
                            <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage === 1} className="p-2 text-white disabled:opacity-30"><ChevronLeft size={16}/></button>
                            <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage === totalPages} className="p-2 text-white disabled:opacity-30"><ChevronRight size={16}/></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal remains same but width handles mobile */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" />
                        <motion.div 
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="fixed bottom-0 md:top-0 md:right-0 h-[90vh] md:h-full w-full md:max-w-md bg-white z-[51] rounded-t-[2rem] md:rounded-none shadow-2xl p-6 md:p-8 overflow-y-auto"
                        >
                            {/* Form content same as before... */}
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black tracking-tighter">Edit <span className="text-[#4177BC]">Project</span></h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Project Name</label>
                                    <input required type="text" value={selectedProject?.name || ""} onChange={(e) => setSelectedProject({...selectedProject, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-[#4177BC] font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Budget ($)</label>
                                    <input required type="number" value={selectedProject?.budget || ""} onChange={(e) => setSelectedProject({...selectedProject, budget: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-[#4177BC] font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Status</label>
                                    <select value={selectedProject?.status || "Active"} onChange={(e) => setSelectedProject({...selectedProject, status: e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:border-[#4177BC] font-bold appearance-none">
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                                <button type="submit" disabled={actionLoading === 'updating'} className="w-full bg-[#4177BC] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest mt-4">
                                    {actionLoading === 'updating' ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Update Project"}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sub-components with optimized props
function ProjectRow({ item, onStatusToggle, onEdit, onDelete }: any) {
    return (
        <tr className="group hover:bg-[#F8FAFC] transition-colors">
            <td className="pl-8 py-4">
                <div className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-xl bg-[#1e3a5f] flex items-center justify-center text-white shrink-0">
                        <LayoutGrid size={14} />
                    </div>
                    <div className="truncate max-w-[200px]">
                        <p className="text-sm font-extrabold text-[#1e293b] truncate group-hover:text-[#4177BC] transition-colors">{item.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{item.clientName}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3 w-[120px]">
                    <button onClick={() => onStatusToggle(item)} className={`w-10 h-5 rounded-full p-1 flex items-center transition-colors ${item.status === 'Completed' ? 'bg-[#EB9C2C]' : 'bg-slate-200'}`}>
                        <div className={`h-3 w-3 bg-white rounded-full transition-transform ${item.status === 'Completed' ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${item.status === 'Completed' ? 'text-[#EB9C2C] bg-[#EB9C2C]/10' : 'text-slate-400 bg-slate-100'}`}>
                        {item.status || 'Active'}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 text-right">
                <p className="text-sm font-black text-[#1e293b] tracking-tighter">${Number(item.budget).toLocaleString()}</p>
            </td>
            <td className="pr-8 py-4">
                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-[#4177BC] hover:bg-blue-50 rounded-lg"><Edit3 size={16} /></button>
                    <button onClick={() => onDelete(item.clientId, item.name)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
            </td>
        </tr>
    );
}

function MiniStat({ label, value, color, icon }: any) {
    return (
        <div className="bg-white p-3 md:p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-white flex-1">
            <div className={`p-2 rounded-xl text-white shadow-lg shrink-0`} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</p>
                <p className="text-sm md:text-lg font-[1000] text-slate-800 leading-none truncate">{value}</p>
            </div>
        </div>
    );
}