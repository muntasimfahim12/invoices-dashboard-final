/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, ShieldCheck, CreditCard, FileText, Settings,
  Zap, User, Link as LinkIcon, Lock, Mail,
  Globe, Bell, Trash2, Plus, DollarSign, CheckCircle, Image as ImageIcon,
  ChevronDown, ArrowRight, Activity, RefreshCw
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const currencyMap: Record<string, string> = {
  USD: "$", BDT: "৳", EUR: "€", GBP: "£", INR: "₹", CAD: "C$", AUD: "A$"
};

// --- OPTIMIZED SUB-COMPONENTS (Memoized to prevent lag) ---
const SectionHeader = memo(({ title, desc }: any) => (
  <div className="space-y-1 border-l-4 border-[#4177BC] pl-6 py-1">
    <h3 className="text-2xl font-bold text-[#0F172A] judson-bold tracking-tight">{title}</h3>
    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{desc}</p>
  </div>
));
SectionHeader.displayName = "SectionHeader";

const Input = memo(({ label, isTextArea, icon, className = "", ...props }: any) => (
  <div className="w-full group">
    <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-[0.1em] group-focus-within:text-[#4177BC] transition-colors">{label}</label>
    <div className="relative flex items-center">
      {icon && <span className="absolute left-6 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">{icon}</span>}
      {isTextArea ? (
        <textarea className={`w-full p-6 ${icon ? 'pl-16' : 'pl-6'} bg-white border border-slate-100 rounded-[24px] text-sm font-bold text-slate-700 focus:border-[#4177BC] focus:ring-4 ring-[#4177BC]/5 outline-none transition-all min-h-[140px] shadow-sm ${className}`} {...props} />
      ) : (
        <input className={`w-full h-16 ${icon ? 'pl-16' : 'pl-6'} bg-white border border-slate-100 rounded-[20px] text-sm font-bold text-slate-700 focus:border-[#4177BC] focus:ring-4 ring-[#4177BC]/5 outline-none transition-all shadow-sm ${className}`} {...props} />
      )}
    </div>
  </div>
));
Input.displayName = "Input";

const Select = memo(({ label, children, ...props }: any) => (
  <div className="w-full group">
    <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-[0.1em] group-focus-within:text-[#4177BC] transition-colors">{label}</label>
    <div className="relative">
      <select className="w-full h-16 px-6 bg-white border border-slate-100 rounded-[20px] text-sm font-bold text-slate-700 outline-none focus:border-[#4177BC] transition-all cursor-pointer appearance-none shadow-sm" {...props}>
        {children}
      </select>
      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-[#4177BC]" size={18} />
    </div>
  </div>
));
Select.displayName = "Select";

const ToggleRow = memo(({ label, desc, isOn, onToggle }: any) => (
  <div className="flex items-center justify-between p-8 hover:bg-slate-50/50 transition-colors">
    <div className="space-y-1">
      <p className="text-[13px] font-black text-[#0F172A] uppercase tracking-wide">{label}</p>
      <p className="text-[11px] text-slate-400 font-medium max-w-[280px]">{desc}</p>
    </div>
    <div onClick={onToggle} className={`w-16 h-8 rounded-full p-1.5 cursor-pointer transition-all duration-500 ease-in-out ${isOn ? 'bg-[#10B981] shadow-lg shadow-emerald-100' : 'bg-slate-200'}`}>
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-500 transform ${isOn ? 'translate-x-8' : 'translate-x-0'}`} />
    </div>
  </div>
));
ToggleRow.displayName = "ToggleRow";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- INITIAL STATE WITH ALL DB FIELDS ---
  const [settings, setSettings] = useState({
    id: "admin_config",
    businessName: "",
    businessLogo: "",
    adminEmail: "",
    adminName: "",
    contactPhone: "",
    address: "",
    currency: "USD",
    currencySymbol: "$",
    invPrefix: "INV-",
    taxRate: "0",
    dueDays: "0",
    termsConditions: "Payment is due within 7 days.",
    paypalLink: "",
    stripePublicKey: "",
    bankDetails: "",
    autoReminder: true,
    installmentAutoTrigger: true,
    emailNotif: true,
    footerNote: "",
    maintenanceMode: false
  });

  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", role: "admin" });

  const fetchSettings = useCallback(async () => {
    if (!BASE_URL) return;
    try {
      const res = await fetch(`${BASE_URL}/settings`);
      const result = await res.json();
      
      // ব্যাকএন্ডের ডেটা স্ট্রাকচার অনুযায়ী সেট করা
      const data = result.data || result;
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Cloud synchronization failed.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleCurrencyChange = useCallback((code: string) => {
    setSettings(prev => ({
      ...prev,
      currency: code,
      currencySymbol: currencyMap[code] || "$"
    }));
  }, []);

  // --- 100% FIXED SAVE LOGIC ---
  const handleSaveSettings = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);

    // ব্যাকএন্ডে পাঠানোর আগে ডেটা ফরম্যাট করা
    const payload = {
      ...settings,
      id: "admin_config", // ID নিশ্চিত করা
      taxRate: String(settings.taxRate || "0"), // DB-তে স্ট্রিং হিসেবে সেভ করার জন্য
      dueDays: String(settings.dueDays || "0"),
    };

    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("System Logic Globally Applied!");
        const updatedData = result.settings || result.data || result;
        setSettings(prev => ({ ...prev, ...updatedData }));
      } else {
        toast.error(result.error || "Sync Failed (Server Error)");
      }
    } catch (err) {
      toast.error("Network Connection Failure.");
    } finally {
      setIsSaving(false);
    }
  }, [settings, isSaving]);

  const handleCreateAdmin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/manage-admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      if (res.ok) {
        toast.success("New Administrative Identity Provisioned!");
        setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      } else {
        const error = await res.json();
        toast.error(error.error || "Provisioning Denied");
      }
    } catch (err) { toast.error("Network interface error"); }
    finally { setIsSaving(false); }
  }, [newAdmin]);

  const navItems = useMemo(() => [
    { id: "profile", label: "Agency Branding", icon: <User size={18} /> },
    { id: "billing", label: "Invoice Rules", icon: <FileText size={18} /> },
    { id: "payments", label: "Pay Gateways", icon: <CreditCard size={18} /> },
    { id: "automation", label: "Bot Logic", icon: <Zap size={18} /> },
    { id: "admins", label: "Access Control", icon: <ShieldCheck size={18} /> },
  ], []);

  if (isLoading) return <SettingsSkeleton />;

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6 md:p-12 font-sans selection:bg-[#4177BC] selection:text-white">
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4177BC] rounded-xl text-white shadow-lg shadow-[#4177BC]/20">
                <Settings size={20} className="animate-[spin_4s_linear_infinite]" />
              </div>
              <h1 className="text-5xl font-bold tracking-tighter text-[#0F172A] judson-bold">
                <span className="text-slate-300 ">Settings</span>
              </h1>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="group relative bg-[#0F172A] hover:bg-[#4177BC] text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-slate-200"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
            {isSaving ? "Processing..." : "Commit Changes"}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-16">
          <aside className="lg:w-64 shrink-0">
            <nav className="sticky top-12 space-y-3">
              {navItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? "bg-[#0F172A] text-white shadow-2xl shadow-slate-300 -translate-y-1"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "profile" && (
                  <div className="space-y-10">
                    <SectionHeader title="Visual Identity" desc="Primary agency information." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Input label="Business Name" value={settings.businessName} onChange={(e: any) => setSettings({ ...settings, businessName: e.target.value })} />
                      <Input label="Logo Asset URL" icon={<ImageIcon size={16} />} value={settings.businessLogo} onChange={(e: any) => setSettings({ ...settings, businessLogo: e.target.value })} />
                      <Input label="Support Email" type="email" value={settings.adminEmail} onChange={(e: any) => setSettings({ ...settings, adminEmail: e.target.value })} />
                      <Input label="Contact Line" value={settings.contactPhone} onChange={(e: any) => setSettings({ ...settings, contactPhone: e.target.value })} />
                      <div className="md:col-span-2 grid grid-cols-3 gap-6 bg-slate-50 p-6 rounded-[30px] border border-dashed border-slate-200">
                        <div className="col-span-2">
                          <Select label="Global Currency" value={settings.currency} onChange={(e: any) => handleCurrencyChange(e.target.value)}>
                            {Object.keys(currencyMap).map(c => <option key={c} value={c}>{c}</option>)}
                          </Select>
                        </div>
                        <Input label="Symbol" value={settings.currencySymbol} readOnly className="bg-white/50 text-center text-xl" />
                      </div>
                    </div>
                    <Input label="Physical Headquarters" isTextArea value={settings.address} onChange={(e: any) => setSettings({ ...settings, address: e.target.value })} />
                  </div>
                )}

                {activeTab === "billing" && (
                  <div className="space-y-10">
                    <SectionHeader title="Financial Protocol" desc="Define billing rules." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Input label="Serial Prefix" value={settings.invPrefix} onChange={(e: any) => setSettings({ ...settings, invPrefix: e.target.value })} />
                      <Input label="Tax Rate %" type="number" value={settings.taxRate} onChange={(e: any) => setSettings({ ...settings, taxRate: e.target.value })} />
                      <Input label="Due Limit (Days)" type="number" value={settings.dueDays} onChange={(e: any) => setSettings({ ...settings, dueDays: e.target.value })} />
                    </div>
                    <Input label="Standard Terms & Conditions" isTextArea value={settings.termsConditions} onChange={(e: any) => setSettings({ ...settings, termsConditions: e.target.value })} />
                  </div>
                )}

                {activeTab === "payments" && (
                  <div className="space-y-10">
                    <SectionHeader title="Gateway Integration" desc="Manage payment endpoints." />
                    <div className="space-y-6">
                      <Input label="PayPal Terminal" icon={<LinkIcon size={16} />} value={settings.paypalLink} onChange={(e: any) => setSettings({ ...settings, paypalLink: e.target.value })} />
                      <Input label="Stripe Production Key" icon={<Globe size={16} />} value={settings.stripePublicKey} onChange={(e: any) => setSettings({ ...settings, stripePublicKey: e.target.value })} />
                      <Input label="Wire Transfer Instructions" isTextArea value={settings.bankDetails} onChange={(e: any) => setSettings({ ...settings, bankDetails: e.target.value })} />
                    </div>
                  </div>
                )}

                {activeTab === "automation" && (
                  <div className="space-y-10">
                    <SectionHeader title="System Autonomy" desc="Enable background workers." />
                    <div className="bg-white rounded-[40px] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                      <ToggleRow label="Dynamic Reminders" desc="Email clients before deadline." isOn={settings.autoReminder} onToggle={() => setSettings(p => ({ ...p, autoReminder: !p.autoReminder }))} />
                      <ToggleRow label="Auto-Installment" desc="Trigger next milestone on success." isOn={settings.installmentAutoTrigger} onToggle={() => setSettings(p => ({ ...p, installmentAutoTrigger: !p.installmentAutoTrigger }))} />
                      <ToggleRow label="Audit Notifications" desc="Forward financial events to admin." isOn={settings.emailNotif} onToggle={() => setSettings(p => ({ ...p, emailNotif: !p.emailNotif }))} />
                    </div>
                  </div>
                )}

                {activeTab === "admins" && (
                  <div className="space-y-10">
                    <SectionHeader title="Identity Management" desc="Grant secure access." />
                    <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                      <Input label="Full Name" value={newAdmin.name} onChange={(e: any) => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
                      <Input label="Login Email" type="email" value={newAdmin.email} onChange={(e: any) => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                      <Input label="Secure Key" type="password" value={newAdmin.password} onChange={(e: any) => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
                      <Select label="Security Clearance" value={newAdmin.role} onChange={(e: any) => setNewAdmin({ ...newAdmin, role: e.target.value })}>
                        <option value="admin">Super Admin</option>
                        <option value="manager">Manager</option>
                      </Select>
                      <button type="submit" className="md:col-span-2 flex items-center justify-center gap-3 py-5 bg-[#EB9C2C] hover:bg-orange-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                        Provision Account <ArrowRight size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- OPTIMIZED SKELETON (Faster loading feel) ---
function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] p-12 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-[#4177BC] rounded-full animate-spin" />
        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#4177BC]/30" size={20} />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-800 animate-pulse">Syncing Cloud Architecture</p>
    </div>
  );
}