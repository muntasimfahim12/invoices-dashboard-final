"use client";
import { MoreVertical, ExternalLink, Mail } from "lucide-react";

const clients = [
  { id: "1", name: "Tanvir Alam", email: "tanvir@example.com", project: "Web Development", status: "Active", amount: "$1,200" },
  { id: "2", name: "Creative Agency", email: "contact@agency.com", project: "UI/UX Design", status: "Pending", amount: "$850" },
  { id: "3", name: "Software Inc", email: "info@softinc.com", project: "App Launch", status: "Active", amount: "$2,500" },
];

export default function ClientTable() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Client Directory</h3>
          <p className="text-xs text-slate-500 font-medium">Manage your active clients and their projects</p>
        </div>
        <button className="text-brand-blue text-sm font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          View All <ExternalLink size={14} />
        </button>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">{client.name}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Mail size={12} /> {client.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-600">{client.project}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{client.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                    client.status === 'Active' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-100 text-brand-orange'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
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