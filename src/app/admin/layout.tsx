import AdminSidebar from "@/src/components/adminDashboard/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 pb-16 md:pb-0 p-6 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
