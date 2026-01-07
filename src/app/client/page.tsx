import StatCard from "@/src/shared/StatCard";

export default function ClientDashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Projects" value="2" />
        <StatCard title="Total Paid" value="$1,400" />
        <StatCard title="Total Due" value="$600" />
      </div>
    </>
  );
}
