/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { 
    Plus, Search, FileText, Download, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    MoreHorizontal, Filter, CheckCircle2, 
    Clock, AlertCircle, ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

const invoices = [
    { id: "INV-2024-001", client: "TechHive Ltd", date: "Jan 05, 2026", amount: "$1,200.00", status: "Paid", project: "E-commerce Redesign" },
    { id: "INV-2024-002", client: "Creative Agency", date: "Jan 10, 2026", amount: "$800.00", status: "Pending", project: "Mobile App API" },
    { id: "INV-2024-003", client: "Sarah Khan", date: "Jan 12, 2026", amount: "$500.00", status: "Overdue", project: "SEO Optimization" },
];

export default function InvoicesPage() {
    return (
        <div className="space-y-8 pb-10 bg-[#FFFFFF] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase">Invoices</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Financial Billing Ledger</p>
                </div>
                <Link 
                    href="/admin/invoices/create" 
                    className="bg-[#4177BC] text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#4177BC]/20 hover:scale-105 transition-all flex items-center gap-2 w-fit active:scale-95"
                >
                    <Plus size={16} /> Create New Invoice
                </Link>
            </div>

            {/* Billing Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MiniStat label="Total Invoiced" value="$24,500" color="#4177BC" />
                <MiniStat label="Paid" value="$18,200" color="#22c55e" />
                <MiniStat label="Pending" value="$4,800" color="#EB9C2C" />
                <MiniStat label="Overdue" value="$1,500" color="#ef4444" />
            </div>

            {/* Search & Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" placeholder="Search by invoice ID or client..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-100 focus:border-[#4177BC] transition-all text-sm font-bold outline-none" />
                    </div>
                    <button className="px-6 py-3 rounded-xl border border-slate-100 text-slate-500 hover:bg-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <Filter size={14} /> Sort By Date
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-slate-50">
                            <tr>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Invoice Details</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">Project</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-sm">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC]/10 group-hover:text-[#4177BC] transition-all">
                                                <FileText size={18} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 leading-none mb-1 font-black">{inv.id}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{inv.client} • {inv.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <StatusBadge status={inv.status} />
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-slate-600 text-xs flex items-center gap-1">
                                            {inv.project} <ArrowUpRight size={12} className="text-slate-300" />
                                        </p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <p className="text-slate-900 font-[1000]">{inv.amount}</p>
                                            <button className="text-[9px] text-[#4177BC] uppercase font-black flex items-center gap-1 hover:underline mt-1">
                                                <Download size={10} /> PDF
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MiniStat({ label, value, color }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-xl font-black text-slate-900" style={{ color: value === '$1,500' ? '#ef4444' : '#0f172a' }}>{value}</p>
            <div className="h-1 w-8 mt-3 rounded-full" style={{ backgroundColor: color }} />
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        Paid: "bg-green-50 text-green-600 border-green-100",
        Pending: "bg-orange-50 text-[#EB9C2C] border-orange-100",
        Overdue: "bg-rose-50 text-rose-600 border-rose-100",
    };
    const icons: any = {
        Paid: <CheckCircle2 size={12} />,
        Pending: <Clock size={12} />,
        Overdue: <AlertCircle size={12} />,
    };

    return (
        <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 w-fit border ${styles[status]}`}>
            {icons[status]} {status}
        </span>
    );
}