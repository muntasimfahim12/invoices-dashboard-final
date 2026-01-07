export default function ActionButton({ label }: { label: string }) {
  return (
    <button className="px-5 py-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
      {label}
    </button>
  );
}
