/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { 
    Layers, Clock, DollarSign, 
    Calendar, CheckCircle2, Search, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

// API Base URL
const API_BASE = "http://localhost:5000";

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [allProjects, setAllProjects] = useState<any[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        revenue: 0
    });

    // ১. ব্যাকএন্ড থেকে ডাটা ফেচ করা
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/clinets`);
            const clients = response.data;

            // সব ক্লায়েন্টের ভেতর থেকে প্রজেক্টগুলো বের করে আনা (Flattening)
            const projectsList: any[] = [];
            let totalRevenue = 0;

            clients.forEach((client: any) => {
                if (client.projects && Array.isArray(client.projects)) {
                    client.projects.forEach((prj: any) => {
                        projectsList.push({
                            ...prj,
                            clientName: client.name, // কোন ক্লায়েন্টের প্রজেক্ট তা চেনার জন্য
                        });
                        totalRevenue += Number(prj.budget) || 0;
                    });
                }
            });

            setAllProjects(projectsList);
            setFilteredProjects(projectsList);
            
            // স্ট্যাটাস আপডেট
            setStats({
                total: projectsList.length,
                active: projectsList.filter(p => p.status === 'Active' || p.status === 'Pending').length,
                revenue: totalRevenue
            });

        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ২. সার্চ লজিক
    useEffect(() => {
        const results = allProjects.filter(prj => 
            prj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prj.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prj.projectId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProjects(results);
    }, [searchTerm, allProjects]);

    const Skeleton = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-slate-200/70 rounded-2xl ${className}`} />
    );

    return (
        <div className="space-y-8 pb-10 px-2 md:px-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase font-sans">Operations</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> 
                        Syncing live from database
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search projects or clients..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-[#4177BC]/20 shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)
                ) : (
                    <>
                        <StatCard icon={<Layers />} label="Total Managed" value={stats.total.toString()} color="blue" />
                        <StatCard icon={<Clock />} label="Active/Pending" value={stats.active.toString().padStart(2, '0')} color="orange" />
                        <StatCard icon={<DollarSign />} label="Project Value" value={`$${(stats.revenue / 1000).toFixed(1)}k`} color="green" />
                    </>
                )}
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">Project & Client</th>
                                <th className="hidden md:table-cell px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">Category</th>
                                <th className="px-8 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">Progress</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3, 4].map((i) => (
                                    <tr key={i}><td colSpan={4} className="px-8 py-6"><Skeleton className="h-14 w-full" /></td></tr>
                                ))
                            ) : filteredProjects.length > 0 ? (
                                filteredProjects.map((item, index) => (
                                    <tr key={item.projectId || index} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-[#4177BC]/10 flex items-center justify-center text-[#4177BC]">
                                                    <CheckCircle2 size={20} className={item.status === 'Completed' ? "text-green-500" : "text-[#4177BC]"} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{item.projectId || 'PRJ-NEW'}</span>
                                                    <p className="text-slate-900 font-bold text-sm leading-none group-hover:text-[#4177BC] transition-colors">{item.name}</p>
                                                    <p className="text-[9px] text-[#EB9C2C] mt-1 font-black uppercase">{item.clientName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-8 py-6">
                                            <span className="text-slate-500 font-bold text-[10px] bg-slate-100 px-3 py-1 rounded-lg uppercase">
                                                {item.type || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: item.status === 'Completed' ? '100%' : '60%' }}
                                                        className={`h-full ${item.status === 'Completed' ? 'bg-green-500' : 'bg-[#4177BC]'}`} 
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600">
                                                    {item.status === 'Completed' ? '100%' : 'ACTIVE'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-slate-900 font-black text-sm">${item.budget?.toLocaleString()}</p>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                item.status === 'Active' ? 'bg-blue-50 text-[#4177BC]' : 
                                                item.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {item.status || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center">
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching projects found</p>
                                    </td>
                                </tr>
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
                <h3 className="text-2xl font-black text-slate-900 leading-none mt-1 font-sans">{value}</h3>
            </div>
        </div>
    );
}