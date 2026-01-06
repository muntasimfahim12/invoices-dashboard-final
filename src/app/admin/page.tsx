import DashboardStats from "../../components/admin/DashboardStats";
import ClientTable from "../../components/admin/ClientTable"; 

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, here is what&apos;s happening today.</p>
        </div>
        <button className="bg-brand-orange text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-orange/20 hover:scale-105 transition-all active:scale-95">
          + New Invoice
        </button>
      </div>

      {/* Stats Components */}
      <DashboardStats />

      {/* Client Table Component (এখানে এখন আপনার নতুন টেবিলটি দেখাবে) */}
      <ClientTable />
    </div>
  );
}