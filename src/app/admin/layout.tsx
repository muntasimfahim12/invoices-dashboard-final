import AdminSidebar from "@/src/shared/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - fixed width on desktop */}
      <AdminSidebar />

      
      <main className="flex-1 w-full md:ml-72 min-h-screen flex flex-col overflow-x-hidden">
        <div className="flex-1 p-4 md:p-8 lg:p-12 pb-24 md:pb-8 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}