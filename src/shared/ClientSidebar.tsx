"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  CreditCard,
  FileText,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/client", icon: LayoutDashboard },
  { name: "Projects", href: "/client/projects", icon: Briefcase },
  { name: "Invoices", href: "/client/invoices", icon: Receipt },
  { name: "Payments", href: "/client/payments", icon: CreditCard },
  { name: "Documents", href: "/client/documents", icon: FileText },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r">
        <div className="w-full">
          <div className="h-20 flex items-center px-6 text-xl font-bold border-b">
            Client Portal
          </div>

          <nav className="p-4 space-y-1">
            {menu.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <nav className="flex justify-around py-2">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center text-xs font-medium
                  ${active ? "text-blue-600" : "text-gray-400"}`}
              >
                <item.icon size={22} />
                <span className="mt-1">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
