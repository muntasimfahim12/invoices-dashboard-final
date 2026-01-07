import StatCard from "@/src/shared/StatCard";

export default function AdminDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value="$12,500" />
        <StatCard title="Total Due" value="$3,200" />
        <StatCard title="Active Projects" value="8" />
        <StatCard title="Overdue Invoices" value="3" />
      </div>
    </>
  );
}
