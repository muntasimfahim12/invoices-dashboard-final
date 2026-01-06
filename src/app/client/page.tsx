import ClientSummary from "../../components/client/ClientSummary";
import { CreditCard, ArrowRight } from "lucide-react";

export default function ClientDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome back, <span className="text-brand-blue">John!</span>
        </h1>
        <p className="text-slate-500 font-medium">Track your project progress and manage payments.</p>
      </div>

      {/* Client Summary Cards (Balance, Active Projects) */}
      <ClientSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Payment Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Latest Invoice</h3>
          <div className="bg-slate-50 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 text-sm">Invoice #INV-2026</span>
              <span className="bg-brand-orange/10 text-brand-orange text-[10px] font-bold px-2 py-1 rounded">PENDING</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">$450.00</h2>
            <p className="text-slate-400 text-xs mt-1">Due Date: Jan 15, 2026</p>
          </div>
          <button className="w-full bg-brand-blue text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all">
            <CreditCard size={20} />
            Pay Now
          </button>
        </div>

        {/* Project Status Brief */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Active Project</h3>
            <p className="text-brand-blue font-bold text-sm">Corporate Website Redesign</p>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-brand-orange w-[65%] rounded-full"></div>
            </div>
            <p className="text-slate-500 text-xs mt-2">Current Phase: <span className="text-slate-900 font-bold">UI Design</span> (65% Completed)</p>
          </div>
          
          <button className="mt-6 flex items-center gap-2 text-brand-blue font-bold text-sm hover:translate-x-1 transition-transform">
            View Project Details <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}