/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { use } from "react"; // React.use ব্যবহার করার জন্য
import { 
    ChevronLeft, ExternalLink, FileText, 
    CheckSquare, Clock, Link as LinkIcon, 
    Share2, Plus, Globe, ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15 এর নিয়ম অনুযায়ী params unwrap করা
    const resolvedParams = use(params); 
    const router = useRouter();

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 bg-[#FFFFFF]">
            
            {/* Top Navigation & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div className="space-y-4">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 text-slate-400 hover:text-[#4177BC] font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                    >
                        <ChevronLeft size={16} /> Back to Fleet
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-1 bg-[#4177BC] rounded-full" />
                        <div>
                            <h1 className="text-4xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">
                                {resolvedParams.id === "PRJ-101" ? "E-commerce Redesign" : `Project: ${resolvedParams.id}`}
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="bg-[#4177BC] text-white text-[9px] font-[1000] px-3 py-1 rounded-md uppercase tracking-widest">In Development</span>
                                <span className="text-[#EB9C2C] text-[9px] font-[1000] uppercase tracking-widest flex items-center gap-1">
                                    <Clock size={12} /> Deadline: 24 Jan 2026
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#4177BC] transition-all shadow-sm flex items-center justify-center">
                        <Share2 size={18} />
                    </button>
                    <button className="flex-[2] md:flex-none px-8 py-4 bg-[#4177BC] text-white rounded-2xl font-[1000] text-[10px] uppercase tracking-widest shadow-xl shadow-[#4177BC]/20 hover:bg-[#4177BC]/90 hover:scale-[1.02] active:scale-95 transition-all">
                        Edit Strategy
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    
                    {/* Integrated Cloud Assets (Drive/Docs) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <AssetCard 
                            title="Requirement Specs" 
                            platform="Google Docs" 
                            icon={<FileText size={20} />} 
                            color="#4177BC" 
                        />
                        <AssetCard 
                            title="Brand Identity Assets" 
                            platform="Google Drive" 
                            icon={<Globe size={20} />} 
                            color="#EB9C2C" 
                        />
                    </div>

                    {/* Milestone Tracker */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
                            <div>
                                <h3 className="font-[1000] text-slate-900 uppercase tracking-tight text-lg">Project Milestones</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Tracking</p>
                            </div>
                            <button className="h-10 w-10 bg-[#4177BC]/5 text-[#4177BC] rounded-xl flex items-center justify-center hover:bg-[#4177BC] hover:text-white transition-all">
                                <Plus size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <MilestoneItem title="UI/UX Architecture" status="Done" color="#4177BC" />
                            <MilestoneItem title="Backend API Integration" status="Pending" color="#EB9C2C" />
                            <MilestoneItem title="Final Quality Assurance" status="Upcoming" color="#94a3b8" />
                        </div>
                    </section>
                </div>

                {/* Sidebar Information */}
                <div className="space-y-8">
                    {/* Client Snapshot Card */}
                    <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <ShieldCheck size={80} />
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-8">Contracted Client</p>
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-3xl font-[1000] tracking-tighter">TechHive Ltd</h2>
                                <p className="text-[#EB9C2C] font-black text-xs uppercase tracking-widest mt-1">Premium Partner</p>
                            </div>
                            <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Contract</p>
                                    <p className="text-lg font-black tracking-tight">$2,400</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Received</p>
                                    <p className="text-lg font-black text-[#EB9C2C] tracking-tight">$1,200</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Resources & Links */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Internal Repository</h4>
                        <div className="space-y-4">
                            <ResourceLink label="GitHub Access" url="#" />
                            <ResourceLink label="Figma Prototypes" url="#" />
                            <ResourceLink label="Staging Server" url="#" />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

{/* Helper Components */}

function AssetCard({ title, platform, icon, color }: any) {
    return (
        <a href="#" className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-slate-200 hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-[1000] text-slate-900 leading-none">{title}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{platform}</p>
                </div>
            </div>
            <ExternalLink size={16} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
        </a>
    );
}

function MilestoneItem({ title, status, color }: any) {
    return (
        <div className="flex items-center justify-between p-5 rounded-3xl border border-slate-50 hover:bg-slate-50/50 transition-all group">
            <div className="flex items-center gap-4">
                <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all" style={{ borderColor: status === 'Done' ? color : '#e2e8f0', backgroundColor: status === 'Done' ? color : 'transparent' }}>
                    {status === 'Done' && <CheckSquare size={12} className="text-white" />}
                </div>
                <p className={`text-sm font-bold ${status === 'Done' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{title}</p>
            </div>
            <span className="text-[9px] font-[1000] uppercase tracking-tighter px-3 py-1 rounded-lg" style={{ backgroundColor: `${color}10`, color: color }}>
                {status}
            </span>
        </div>
    );
}

function ResourceLink({ label, url }: any) {
    return (
        <a href={url} className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all group text-sm font-bold text-slate-600">
            <div className="h-8 w-8 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-[#4177BC] group-hover:text-white transition-all">
                <LinkIcon size={14} />
            </div>
            {label}
        </a>
    );
}