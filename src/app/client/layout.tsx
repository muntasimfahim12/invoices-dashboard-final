import ClientSidebar from "@/src/shared/ClientSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <ClientSidebar />
      <main className="flex-1 md:ml-64 pb-16 md:pb-0 p-6 bg-white min-h-screen">
        {children}
      </main>
    </div>
  );
}
