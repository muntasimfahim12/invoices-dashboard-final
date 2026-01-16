/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    FileText, 
    Download, 
    Search, 
    FolderOpen, 
    FileCode, 
    FileArchive, 
    ExternalLink,
    Filter,
    ShieldCheck,
    CloudDownload
} from "lucide-react";

// Mock Data - Apni eta API thekeo nite paren
const documents = [
  { id: 1, name: "Project Service Agreement", type: "PDF", size: "1.2 MB", date: "Jan 12, 2026", category: "Legal" },
  { id: 2, name: "Brand Guidelines v2.1", type: "PDF", size: "8.5 MB", date: "Jan 05, 2026", category: "Assets" },
  { id: 3, name: "Source Code - Alpha Build", type: "ZIP", size: "45 MB", date: "Dec 28, 2025", category: "Development" },
  { id: 4, name: "UI/UX Case Study", type: "DOCX", size: "2.4 MB", date: "Jan 10, 2026", category: "Design" },
  { id: 5, name: "Final Invoice #8821", type: "PDF", size: "450 KB", date: "Jan 15, 2026", category: "Finance" },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-[1000] tracking-tighter text-slate-900 uppercase italic">
            Secure <span className="text-[#4177BC]">Vault</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Access your contracts, assets, and project documentation.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4177BC] transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search documents..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4177BC]/10 transition-all font-bold text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- QUICK CATEGORIES --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['Contracts', 'Assets', 'Design', 'Finance'].map((cat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-[#4177BC]/30 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer group">
            <FolderOpen className="text-slate-300 group-hover:text-[#4177BC] mb-3 transition-colors" size={24} />
            <p className="text-xs font-black uppercase text-slate-900 tracking-tighter">{cat}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">12 Files</p>
          </div>
        ))}
      </div>

      {/* --- DOCUMENT LIST TABLE --- */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black italic text-slate-800 uppercase tracking-tighter">Recent Files</h3>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" /> ENCRYPTED STORAGE
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                <th className="px-8 py-5 font-black">Document Name</th>
                <th className="px-8 py-5 font-black text-center">Format</th>
                <th className="px-8 py-5 font-black">Category</th>
                <th className="px-8 py-5 font-black">Size</th>
                <th className="px-8 py-5 font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        {doc.type === "ZIP" ? <FileArchive size={18} /> : doc.type === "PDF" ? <FileText size={18} /> : <FileCode size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 uppercase group-hover:text-[#4177BC] transition-colors">{doc.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Uploaded: {doc.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{doc.type}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4177BC]" /> {doc.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-400 text-xs tracking-tighter">{doc.size}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-[#4177BC] hover:border-[#4177BC] hover:shadow-md transition-all">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDocs.length === 0 && (
          <div className="p-20 text-center">
            <CloudDownload className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold italic">No documents found matching your search.</p>
          </div>
        )}
      </div>

      {/* --- INFO BANNER --- */}
      <div className="bg-[#4177BC] rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/20">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
            <ExternalLink className="text-white" />
          </div>
          <div>
            <h4 className="text-xl font-black italic uppercase">Need custom assets?</h4>
            <p className="text-blue-100 text-[11px] font-medium uppercase tracking-widest">Contact your account manager for specialized documentation.</p>
          </div>
        </div>
        <button className="bg-white text-[#4177BC] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
          Open Support Ticket
        </button>
      </div>

    </div>
  );
}