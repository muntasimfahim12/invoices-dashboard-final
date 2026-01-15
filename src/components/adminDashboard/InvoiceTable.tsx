/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { MoreHorizontal, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function InvoiceTable({ data = [] }: { data: any[] }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="table-head">Client & Project</th>
              <th className="table-head">Amount</th>
              <th className="table-head">Status</th>
              <th className="table-head text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? data.map((inv, idx) => (
              <Row 
                key={idx}
                client={inv.clientName || "Unknown Client"} 
                project={inv.projectName || "Standard Project"} 
                amount={`$${Number(inv.grandTotal || 0).toLocaleString()}`} 
                status={inv.status} 
                date={new Date(inv.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              />
            )) : (
              <tr><td colSpan={4} className="py-10 text-center text-slate-400 font-bold">No Invoices Found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .table-head { padding: 1.25rem 1rem; text-align: left; font-size: 11px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.1em; }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}

function Row({ client, project, amount, status, date }: any) {
  const getStatusConfig = () => {
    switch (status) {
      case "Paid": return { bg: "bg-green-50", text: "text-green-600", icon: <CheckCircle2 size={14} /> };
      case "Pending": return { bg: "bg-orange-50", text: "text-[#EB9C2C]", icon: <Clock size={14} /> };
      case "Overdue": return { bg: "bg-red-50", text: "text-red-600", icon: <AlertCircle size={14} /> };
      default: return { bg: "bg-slate-50", text: "text-slate-600", icon: null };
    }
  };
  const config = getStatusConfig();

  return (
    <tr className="group hover:bg-slate-50/80 transition-all duration-300">
      <td className="py-5 px-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#4177BC]/10 group-hover:text-[#4177BC] transition-colors">
            <FileText size={20} />
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-none mb-1.5">{client}</p>
            <p className="text-xs font-medium text-slate-400">{project}</p>
          </div>
        </div>
      </td>
      <td className="py-5 px-4">
        <p className="font-black text-slate-700 tracking-tight">{amount}</p>
        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{date}</p>
      </td>
      <td className="py-5 px-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.text}`}>
          {config.icon}
          <span className="text-[11px] font-black uppercase tracking-wider">{status}</span>
        </div>
      </td>
      <td className="py-5 px-4 text-right">
        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 transition-all">
          <MoreHorizontal size={20} />
        </button>
      </td>
    </tr>
  );
}