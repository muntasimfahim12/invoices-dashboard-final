/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { 
    Search, Filter, Eye, FileText, 
    ArrowUpRight, Clock, CheckCircle2, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ClientInvoiceList() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
const clientEmail = localStorage.getItem("user_email"); // or from auth state

useEffect(() => {
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/invoices`, {
        params: {
          email: clientEmail,
          search: searchTerm,
          status
        }
      });
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  if (clientEmail) fetchInvoices();
}, [clientEmail, searchTerm, status]);


    // Summary Calculations
    const totalDue = invoices.reduce((acc, inv) => acc + (Number(inv.remainingDue) || 0), 0);
    const pendingInvoices = invoices.filter(inv => inv.status !== "Paid").length;

    const filteredInvoices = invoices.filter(inv => 
        inv.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center font-black uppercase tracking-widest text-xs animate-pulse">Loading Portal...</div>;

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* 1. Portal Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter">My Invoices</h1>
                        <p className="text-slate-500 font-medium">Manage and track your project billing history</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 px-6">
                            <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Outstanding</p>
                                <p className="text-xl font-black text-slate-900 mt-1">${totalDue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Search & Filter Bar */}
                <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by Invoice ID or Project Name..."
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-bold outline-none focus:ring-2 ring-blue-500/10 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all px-6 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {/* 3. Invoices Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvoices.map((inv) => (
                        <div key={inv._id} className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden">
                            
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-6">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    inv.status === "Paid" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                    inv.status === "Partial" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                    "bg-rose-50 text-rose-600 border-rose-100"
                                }`}>
                                    {inv.status}
                                </div>
                                <span className="text-[10px] font-bold text-slate-300">{new Date(inv.createdAt).toLocaleDateString()}</span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#4177BC] transition-colors">{inv.projectTitle || "Project Services"}</h3>
                            <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-tighter">ID: {inv.invoiceId}</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Total Bill</span>
                                    <span className="font-black text-slate-900">{inv.currency} {inv.grandTotal?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Remaining</span>
                                    <span className={`font-black ${inv.remainingDue > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {inv.currency} {inv.remainingDue?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Link 
                                href={`/client/invoices/${inv._id}`}
                                className="w-full bg-slate-50 group-hover:bg-[#4177BC] group-hover:text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                View Details <ArrowUpRight size={14} />
                            </Link>

                            {/* Background Decoration */}
                            <FileText className="absolute -bottom-4 -right-4 text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity" size={120} />
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredInvoices.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <FileText className="mx-auto text-slate-200 mb-4" size={48} />
                        <h3 className="font-black text-slate-400 uppercase text-xs tracking-[0.2em]">No invoices found</h3>
                    </div>
                )}
            </div>
        </div>
    );
}