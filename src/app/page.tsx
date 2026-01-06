export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white">
      <h1 className="text-3xl font-bold">Color Theme Test</h1>
      
      {/* এই বাটনটি যদি আপনার দেওয়া নীল কালার (#4177BC) হয়, তবে কনফিগারেশন ঠিক আছে */}
      <button className="bg-brand-blue px-6 py-3 font-bold text-white rounded-xl shadow-lg">
        Brand Blue Test
      </button>

      {/* এই বাটনটি যদি আপনার দেওয়া কমলা কালার (#EB9C2C) হয়, তবে কনফিগারেশন ঠিক আছে */}
      <button className="bg-brand-orange px-6 py-3 font-bold text-white rounded-xl shadow-lg">
        Brand Orange Test
      </button>

      <p className="text-slate-500 font-medium">
        If the colors match your brand, Tailwind v4 is working!
      </p>
    </div>
  );
}