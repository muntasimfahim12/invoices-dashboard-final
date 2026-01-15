/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { CreditCard, DollarSign, CheckCircle2, Clock, ChevronRight } from "lucide-react";

export default function InvoiceTable({ data = [] }: { data: any[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-100">
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No Recent Invoices Found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full border-separate border-spacing-y-3">
        <tbody>
          {data.map((invoice, idx) => (
            <tr key={invoice._id || idx} className="bg-slate-50/50 hover:bg-white group transition-all duration-500">
              <td className="p-4 rounded-l-[25px]">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-100 text-[#4177BC] group-hover:scale-110 transition-transform">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">
                      {invoice.clientName || "Unknown Client"}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">INV-{invoice.invoiceNumber || idx + 101}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-1 text-sm font-black text-slate-900 italic">
                  <DollarSign size={14} className="text-[#4177BC]" />
                  {Number(invoice.grandTotal || 0).toLocaleString()}
                </div>
              </td>
              <td className="p-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                  invoice.status === 'Paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {invoice.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {invoice.status || "Pending"}
                </div>
              </td>
              <td className="p-4 rounded-r-[25px] text-right">
                 <button className="p-2 text-slate-300 hover:text-[#4177BC] transition-colors"><ChevronRight size={20}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}