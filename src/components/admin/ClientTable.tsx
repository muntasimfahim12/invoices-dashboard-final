"use client";
import { MoreVertical, ExternalLink, Receipt, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const recentInvoices = [
  { id: "INV-2026-001", client: "Tanvir Alam", project: "E-Commerce Build", status: "Paid", amount: "$1,200", date: "Jan 04, 2026" },
  { id: "INV-2026-002", client: "Creative Agency", project: "UI/UX Design", status: "Pending", amount: "$850", date: "Jan 06, 2026" },
  { id: "INV-2026-003", client: "Software Inc", project: "Mobile App", status: "Overdue", amount: "$2,500", date: "Dec 28, 2025" },
];

export default function RecentInvoices() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
        <div>
          <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase">Recent Invoices</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Track your latest billing activities</p>
        </div>
        <button className="text-brand-blue text-xs font-black uppercase tracking-widest hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-slate-50 shadow-sm">
          All Invoices <ExternalLink size={14} />
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
            <tr>
              <th className="px-8 py-5">Invoice & Client</th>
              <th className="px-8 py-5">Project</th>
              <th className="px-8 py-5">Amount</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {recentInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 
                      inv.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-brand-orange'
                    }`}>
                      <Receipt size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-none tracking-tight">{inv.client}</p>
                      <p className="text-[11px] text-slate-400 mt-1.5 font-bold uppercase tracking-tighter">
                        {inv.id} • {inv.date}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 font-bold text-slate-500">{inv.project}</td>
                <td className="px-8 py-6 font-black text-slate-900 text-base">{inv.amount}</td>
                <td className="px-8 py-6">
                  <span className={`flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 
                    inv.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 'bg-orange-100 text-brand-orange'
                  }`}>
                    {inv.status === 'Paid' && <CheckCircle2 size={12} />}
                    {inv.status === 'Pending' && <Clock size={12} />}
                    {inv.status === 'Overdue' && <AlertCircle size={12} />}
                    {inv.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}