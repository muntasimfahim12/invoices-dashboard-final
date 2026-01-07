"use client";

<<<<<<< HEAD
import React from "react";
import ActionButton from "@/src/shared/ActionButton";
import InvoiceTable from "@/src/shared/InvoiceTable";
import ListItem from "@/src/shared/ListItem";
import SectionTitle from "@/src/shared/SectionTitle";
=======
import ActionButton from "@/src/components/adminDashboard/ActionButton";
import InvoiceTable from "@/src/components/adminDashboard/InvoiceTable";
import ListItem from "@/src/components/adminDashboard/ListItem";
import SectionTitle from "@/src/components/adminDashboard/SectionTitle";
>>>>>>> 625508461309e779ba7e2f79614773dead7fddc6
import StatCard from "@/src/shared/StatCard";
import { 
  LayoutDashboard, 
  TrendingUp, 
  PlusCircle, 
  ArrowUpRight 
} from "lucide-react";

export default function AdminOverview() {
  return (
    // Added overflow-x-hidden to prevent side-scrolling on mobile
    <div className="min-h-screen bg-[#F8FAFC] pb-32 pt-6 md:pt-10 px-4 md:px-8 max-w-[100vw] overflow-x-hidden font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 md:mb-14">
        <div className="max-w-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-[#4177BC]/10 rounded-xl text-[#4177BC]">
              <LayoutDashboard size={22} />
            </div>
            <span className="text-xs font-black text-[#4177BC] uppercase tracking-[0.2em]">Live Analytics</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
            Dashboard <span className="text-[#4177BC]">Overview</span>
          </h1>
          <p className="text-slate-500 mt-3 text-base md:text-lg font-medium max-w-2xl">
            Quick summary of clients, projects, invoices and payments.
          </p>
        </div>

        {/* Real-time Indicator Badge - Better mobile sizing */}
        <div className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-[22px] border border-slate-100 shadow-sm w-fit">
          <div className="relative flex h-3 w-3">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">System Status</p>
            <p className="text-sm font-extrabold text-slate-700 mt-1">Live Updates Active</p>
          </div>
        </div>
      </div>

      {/* --- STATS SECTION --- 
          Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10 md:mb-14">
        <StatCard title="Total Revenue" value="$12,500" trend="+12%" icon="revenue" />
        <StatCard title="Total Due" value="$3,200" trend="Action Required" icon="due" color="#EB9C2C" />
        <StatCard title="Active Clients" value="18" trend="3 New" icon="clients" />
        <StatCard title="Active Projects" value="09" trend="On Track" icon="projects" />
      </div>

      {/* --- TOP GRID --- 
          Responsive grid for smaller screens
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14 text-white">
        <div className="premium-card group h-full">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Recent Clients" />
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#4177BC]/10 transition-colors">
               <ArrowUpRight className="text-slate-300 group-hover:text-[#4177BC]" size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <ListItem title="Infinity Wellness" meta="Active" />
            <ListItem title="TX Pavers & Turf" meta="Active" />
            <ListItem title="Jordan Eagle Transport" meta="Pending" />
          </div>
        </div>

        <div className="premium-card group h-full">
          <div className="flex items-center justify-between mb-8 text-white">
            <SectionTitle title="Active Projects" />
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#4177BC]/10 transition-colors">
               <ArrowUpRight className="text-slate-300 group-hover:text-[#4177BC]" size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <ListItem title="Website Redesign" meta="$3,000 • Plan" />
            <ListItem title="SEO Monthly" meta="$800 / month" />
            <ListItem title="Mobile App UI" meta="Final stage" />
          </div>
        </div>

        <div className="premium-card group h-full md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-8">
            <SectionTitle title="Payments Status" />
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
               <TrendingUp className="text-[#EB9C2C]" size={20} />
            </div>
          </div>
          <div className="space-y-3">
            <ListItem title="Paid Invoices" meta="24 Total" />
            <ListItem title="Pending Invoices" meta="6 Awaiting" />
            <ListItem title="Overdue Invoices" meta="3 Urgent" />
          </div>
        </div>
      </div>

      {/* --- INVOICES TABLE --- 
          Handling horizontal scroll on mobile properly
      */}
      <div className="premium-card mb-10 md:mb-14 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <SectionTitle title="Recent Invoices" />
          <div className="w-fit px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
            Last 30 Days Activity
          </div>
        </div>
        <div className="w-full">
          <InvoiceTable />
        </div>
      </div>

      {/* --- QUICK ACTIONS SECTION --- */}
      <div className="bg-[#FFFFFF] rounded-[30px] md:rounded-[45px] p-8 md:p-14 shadow-2xl relative overflow-hidden">
        {/* Modern Background Blur Decoration */}
        <div className="absolute -top-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-[#4177BC] opacity-20 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-48 md:w-64 h-48 md:h-64 bg-[#EB9C2C] opacity-10 rounded-full blur-[60px] md:blur-[100px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <PlusCircle className="text-[#EB9C2C]" size={26} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Quick Actions</h2>
          </div>
          
          {/* Action buttons grid for mobile responsiveness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 md:gap-6">
            <ActionButton label="Add Client" />
            <ActionButton label="Create Project" />
            <ActionButton label="Create Invoice" />
            <ActionButton label="Record Payment" />
          </div>
        </div>
      </div>

      {/* GLOBAL STYLES FOR PREMIUM FEEL */}
      <style jsx global>{`
        .premium-card {
          background: #FFFFFF;
          border-radius: 28px;
          border: 1px solid #F1F5F9;
          padding: 1.5rem;
          box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.04);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 768px) {
          .premium-card {
            border-radius: 35px;
            padding: 2.25rem;
          }
        }

        .premium-card:hover {
          box-shadow: 0 30px 60px -20px rgba(65, 119, 188, 0.12);
          transform: translateY(-6px);
          border-color: #4177BC20;
        }

        /* Custom scrollbar for mobile table */
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}