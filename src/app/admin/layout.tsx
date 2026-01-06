import Sidebar from "../../components/admin/Sidebar";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Bell, Search, UserCircle, Menu } from "lucide-react"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <div className="flex min-h-screen bg-[#F9FAFB] overflow-x-hidden">
      
      {/* Fixed Sidebar - ডেস্কটপের জন্য */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white md:block z-50">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0 w-full">
        
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-8 backdrop-blur-md w-full">
          
          {/* Left: Search (Mobile Friendly) */}
          <div className="flex flex-1 items-center gap-2 max-w-xs sm:max-w-md rounded-lg bg-slate-100 px-3 py-1.5 text-slate-500">
            <Search size={18} className="shrink-0" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-transparent text-sm outline-none w-full min-w-0" // min-w-0 খুবই জরুরি
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-5 ml-2 shrink-0">
            <button className="relative text-slate-500 hover:text-brand-blue transition-colors">
              <Bell size={22} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-white">
                3
              </span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Super Admin</p>
              </div>
              <UserCircle size={28} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        {/* p-4 ব্যবহার করা হয়েছে মোবাইলের জন্য, ডেস্কটপে p-8 হবে */}
        <main className="p-4 sm:p-8 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}