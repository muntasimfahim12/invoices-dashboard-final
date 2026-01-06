import Sidebar from "../../components/admin/Sidebar";
import { Bell, Search, UserCircle } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:block">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
          <div className="flex w-96 items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-slate-500">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search invoices, clients..." 
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 hover:text-brand-blue transition-colors">
              <Bell size={22} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                3
              </span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
              <UserCircle size={32} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}