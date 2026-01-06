import ClientSidebar from "../../components/client/ClientSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">

      <ClientSidebar />


      <div className="flex flex-1 flex-col transition-all duration-300 md:pl-[88px]">
        {/* Simple Top Header for Clients */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
          <div>
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Client Portal
            </h2>
            <p className="text-xs font-bold text-slate-900 mt-0.5">Welcome Back, John</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-black text-xs border border-brand-blue/20">
              JD
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-black text-slate-900 leading-none">John Doe</p>
              <p className="text-[9px] text-brand-orange font-bold uppercase tracking-tighter mt-1">
                Premium Member
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 lg:p-12">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}