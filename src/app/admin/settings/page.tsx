/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Shield, CreditCard, Receipt, Settings, RefreshCw, 
  Eye, EyeOff, Lock, Mail, User, Link as LinkIcon, 
  CreditCard as BankIcon, Users, Server, Globe, Bell
} from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const [settings, setSettings] = useState({
    adminName: "", adminEmail: "", paymentType: "Full Payment",
    dueDays: "7", pushNotif: true, emailNotif: true,
    paypalLink: "", stripeLink: "", stripeSecret: "",
    bankDetails: "", paymentNote: "", businessName: "",
    currency: "USD", address: "", invPrefix: "INV-",
    taxRate: "0", footerNote: "",
    smtpHost: "smtp.gmail.com", smtpPort: "587", maintenanceMode: false,
    twoFactorAuth: false, timeZone: "UTC+6", siteLanguage: "English"
  });

  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", role: "admin" });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!BASE_URL) return;
      try {
        const res = await fetch(`${BASE_URL}/settings`);
        const data = await res.json();
        if (data) setSettings(prev => ({ ...prev, ...data }));
      } catch (err) { 
        console.warn("Syncing defaults..."); 
      } finally { 
        setIsLoading(false); 
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) alert("Global System Synced!");
    } catch (err) {
        alert("Failed to sync settings.");
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/manage-admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Success: New Admin Created!");
        setNewAdmin({ name: "", email: "", password: "", role: "admin" });
      } else {
        alert("Error: " + data.error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
        <RefreshCw className="animate-spin text-[#4177BC] mb-4" size={40} />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Loading Enterprise Core</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-[1200px] mx-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 italic uppercase">
              System <span className="text-[#4177BC]">Control</span>
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Enterprise Architecture & Financial Protocols</p>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="bg-[#4177BC] text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#35629c] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            {isSaving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
            {isSaving ? "Syncing..." : "Apply Global Changes"}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* NAVIGATION */}
          <aside className="lg:w-72 shrink-0">
            <nav className="flex lg:flex-col gap-2 bg-white p-3 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
              {[
                { id: "general", label: "General", icon: <Settings size={18}/> },
                { id: "invoice", label: "Invoicing", icon: <Receipt size={18}/> },
                { id: "payment", label: "Payments", icon: <CreditCard size={18}/> },
                { id: "advanced", label: "Advanced", icon: <Server size={18}/> },
                { id: "team", label: "Security", icon: <Users size={18}/> },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id ? "bg-[#4177BC] text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* CONTENT */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                
                {/* GENERAL SETTINGS */}
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <Section title="Administrator Identity">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Admin Display Name" value={settings.adminName} onChange={(e:any) => setSettings({...settings, adminName: e.target.value})} />
                        <Input label="System Email" type="email" value={settings.adminEmail} onChange={(e:any) => setSettings({...settings, adminEmail: e.target.value})} />
                        <Select label="Time Zone" value={settings.timeZone} onChange={(e:any) => setSettings({...settings, timeZone: e.target.value})}>
                          <option>UTC+6 (Dhaka)</option><option>UTC+0 (London)</option><option>UTC-5 (New York)</option>
                        </Select>
                        <Select label="Language" value={settings.siteLanguage} onChange={(e:any) => setSettings({...settings, siteLanguage: e.target.value})}>
                          <option>English</option><option>Bengali</option><option>Spanish</option>
                        </Select>
                      </div>
                    </Section>
                    <Section title="System Status">
                      <Toggle label="Maintenance Mode" desc="Disable public access for updates" isOn={settings.maintenanceMode} onToggle={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} />
                    </Section>
                  </div>
                )}

                {/* INVOICE SETTINGS */}
                {activeTab === "invoice" && (
                  <div className="space-y-6">
                    <Section title="Business Branding">
                      <div className="grid grid-cols-2 gap-6">
                        <Input label="Legal Business Name" value={settings.businessName} onChange={(e:any) => setSettings({...settings, businessName: e.target.value})} />
                        <Input label="Currency Code" value={settings.currency} onChange={(e:any) => setSettings({...settings, currency: e.target.value})} />
                      </div>
                      <div className="mt-6"><Input label="Registered Address" isTextArea value={settings.address} onChange={(e:any) => setSettings({...settings, address: e.target.value})} /></div>
                    </Section>
                    <Section title="Standardization">
                      <div className="grid grid-cols-2 gap-6">
                        <Input label="Invoice Prefix" value={settings.invPrefix} onChange={(e:any) => setSettings({...settings, invPrefix: e.target.value})} />
                        <Input label="Default Tax (%)" type="number" value={settings.taxRate} onChange={(e:any) => setSettings({...settings, taxRate: e.target.value})} />
                      </div>
                    </Section>
                  </div>
                )}

                {/* PAYMENT SETTINGS */}
                {activeTab === "payment" && (
                  <div className="space-y-6">
                    <Section title="Payment Gateways">
                      <div className="space-y-5">
                        <Input 
                          label="PayPal Identity (Email or PayPal.Me)" 
                          icon={<LinkIcon size={16}/>} 
                          placeholder="e.g. paypal.me/yourid or email@example.com"
                          value={settings.paypalLink} 
                          onChange={(e:any) => setSettings({...settings, paypalLink: e.target.value})} 
                        />
                        <Input label="Stripe Public Key" icon={<Globe size={16}/>} value={settings.stripeLink} onChange={(e:any) => setSettings({...settings, stripeLink: e.target.value})} />
                        <div className="relative">
                          <Input label="Stripe Secret API" type={showKey ? "text" : "password"} icon={<Lock size={16}/>} value={settings.stripeSecret} onChange={(e:any) => setSettings({...settings, stripeSecret: e.target.value})} />
                          <button onClick={() => setShowKey(!showKey)} className="absolute right-5 top-11 text-[#4177BC]">{showKey ? <EyeOff size={18}/> : <Eye size={18}/>}</button>
                        </div>
                      </div>
                    </Section>
                    <Section title="Manual Settlements">
                      <Input label="Bank Routing & Account Details" isTextArea value={settings.bankDetails} onChange={(e:any) => setSettings({...settings, bankDetails: e.target.value})} />
                    </Section>
                  </div>
                )}

                {/* ADVANCED SETTINGS */}
                {activeTab === "advanced" && (
                  <div className="space-y-6">
                    <Section title="SMTP Mail Server">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="SMTP Host" value={settings.smtpHost} onChange={(e:any) => setSettings({...settings, smtpHost: e.target.value})} />
                        <Input label="SMTP Port" value={settings.smtpPort} onChange={(e:any) => setSettings({...settings, smtpPort: e.target.value})} />
                      </div>
                    </Section>
                    <Section title="Global Preferences">
                       <Toggle label="Email Notifications" desc="Automated dispatch for system events" isOn={settings.emailNotif} onToggle={() => setSettings({...settings, emailNotif: !settings.emailNotif})} />
                       <div className="my-4 border-t border-slate-100" />
                       <Toggle label="Push Notifications" desc="Browser-level real-time alerts" isOn={settings.pushNotif} onToggle={() => setSettings({...settings, pushNotif: !settings.pushNotif})} />
                    </Section>
                  </div>
                )}

                {/* TEAM SECURITY SETTINGS */}
                {activeTab === "team" && (
                  <div className="space-y-6">
                    <Section title="Authorization Security">
                       <Toggle label="Two-Factor Authentication" desc="Require OTP for admin access" isOn={settings.twoFactorAuth} onToggle={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})} />
                    </Section>
                    <Section title="Establish New Access Account">
                      <form onSubmit={handleCreateAdmin}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input icon={<User size={16}/>} label="Full Legal Name" value={newAdmin.name} onChange={(e:any) => setNewAdmin({...newAdmin, name: e.target.value})} />
                          <Input icon={<Mail size={16}/>} label="Work Email" type="email" value={newAdmin.email} onChange={(e:any) => setNewAdmin({...newAdmin, email: e.target.value})} />
                          <Input icon={<Lock size={16}/>} label="Temporary Password" type="password" value={newAdmin.password} onChange={(e:any) => setNewAdmin({...newAdmin, password: e.target.value})} />
                          <Select label="Role Permission" value={newAdmin.role} onChange={(e:any) => setNewAdmin({...newAdmin, role: e.target.value})}>
                            <option value="admin">Root Admin</option><option value="manager">Manager</option><option value="billing">Financial Officer</option>
                          </Select>
                        </div>
                        <button type="submit" className="w-full mt-8 py-5 bg-[#EB9C2C] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all">
                          Provision Admin Account
                        </button>
                      </form>
                    </Section>
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

// --- REFINED UI COMPONENTS (SAME LOGIC, UPDATED STYLE) ---

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#EB9C2C]" />
      <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.4em] mb-10 flex items-center gap-4 italic">
        <span className="w-8 h-[2px] bg-[#4177BC]/20" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Input({ label, isTextArea, icon, ...props }: any) {
  return (
    <div className="w-full group">
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest group-focus-within:text-[#4177BC] transition-colors italic">{label}</label>
      <div className="relative flex items-center">
        {icon && <span className="absolute left-5 text-slate-300 group-focus-within:text-[#4177BC] transition-colors">{icon}</span>}
        {isTextArea ? (
          <textarea className={`w-full p-5 ${icon ? 'pl-14' : 'pl-5'} bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-[#4177BC]/10 focus:ring-4 ring-blue-50/50 outline-none transition-all min-h-[120px] shadow-inner`} {...props} />
        ) : (
          <input className={`w-full h-14 ${icon ? 'pl-14' : 'pl-5'} bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-[#4177BC]/10 focus:ring-4 ring-blue-50/50 outline-none transition-all shadow-inner`} {...props} />
        )}
      </div>
    </div>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <div className="w-full group">
      <label className="block text-[10px] font-black text-slate-400 uppercase mb-3 ml-1 tracking-widest italic">{label}</label>
      <select className="w-full h-14 px-5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#4177BC]/10 focus:ring-4 ring-blue-50/50 transition-all appearance-none cursor-pointer shadow-inner" {...props}>{children}</select>
    </div>
  );
}

function Toggle({ label, desc, isOn, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-2 group">
      <div>
        <p className="text-sm font-black text-slate-800 uppercase italic tracking-tighter">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
      </div>
      <div onClick={onToggle} className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-all duration-500 shadow-inner ${isOn ? 'bg-[#4177BC]' : 'bg-slate-200'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 transform ${isOn ? 'translate-x-7' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}