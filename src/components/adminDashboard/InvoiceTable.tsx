export default function InvoiceTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-slate-500">
          <tr>
            <th className="py-2">Client</th>
            <th>Project</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          <Row client="Infinity Wellness" project="Website Dev" amount="$1,200" status="Paid" />
          <Row client="TX Pavers & Turf" project="SEO Retainer" amount="$800" status="Pending" />
          <Row client="Jordan Eagle" project="Brand Design" amount="$1,000" status="Overdue" />
        </tbody>
      </table>
    </div>
  );
}

function Row({
  client,
  project,
  amount,
  status,
}: {
  client: string;
  project: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
}) {
  const color =
    status === "Paid"
      ? "text-green-600"
      : status === "Pending"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <tr>
      <td className="py-3">{client}</td>
      <td>{project}</td>
      <td>{amount}</td>
      <td className={`font-semibold ${color}`}>{status}</td>
    </tr>
  );
}
