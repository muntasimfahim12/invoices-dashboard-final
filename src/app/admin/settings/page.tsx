/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Shield, CreditCard, Receipt, 
  Settings, Bell, Globe, Camera, 
  Activity, Zap, Lock, RefreshCw, ChevronRight,
  Eye, EyeOff, Key, Smartphone, Trash2, Download, Cloud,
  Link as LinkIcon, Building2, CreditCard as BankIcon
} from "lucide-react";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 2000);
  };

  const tabs = [
    { id: "general", label: "General", icon: <Settings size={18}/> },
    { id: "payment", label: "Payments", icon: <CreditCard size={18}/> },
    { id: "invoice", label: "Invoice", icon: <Receipt size={18}/> },
    { id: "security", label: "Security", icon: <Shield size={18}/> },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto pb-32 md:pb-10">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#4177BC] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4177BC]">System Control v3.0</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter italic uppercase leading-none">
              Admin <span className="text-[#4177BC]">Settings</span>
            </h1>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full sm:w-auto px-10 py-4 bg-[#4177BC] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? "Syncing..." : "Save Configuration"}
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* NAVIGATION */}
          <nav className="fixed bottom-0 left-0 right-0 p-4 md:p-0 md:static md:w-72 z-[100] bg-gradient-to-t from-white via-white/95 to-transparent md:bg-none">
            <div className="bg-white md:bg-white/60 backdrop-blur-2xl border border-slate-200 md:border-white p-2 rounded-[30px] md:rounded-[40px] shadow-2xl md:shadow-lg flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-4 px-6 py-4 md:py-5 rounded-[22px] transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id ? "bg-[#4177BC] text-white shadow-xl shadow-blue-500/30" : "text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span className={`${activeTab === tab.id ? "scale-110" : ""} transition-transform`}>{tab.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* CONTENT AREA */}
          <main className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }} 
                transition={{ duration: 0.3 }}
              >
                
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <Section title="Profile Information">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="Admin Name" placeholder="e.g. John Doe" defaultValue="Admin User" />
                        <Input label="Admin Email" type="email" placeholder="admin@domain.com" />
                      </div>
                    </Section>

                    <Section title="System Preferences">
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Default Payment Type</label>
                             <select className="w-full p-4 md:p-5 bg-slate-50 border border-transparent rounded-[20px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#4177BC]/20 focus:ring-4 ring-[#4177BC]/5 transition-all appearance-none cursor-pointer">
                                <option>Full Payment</option>
                                <option>Installments</option>
                                <option>Monthly Retainer</option>
                             </select>
                          </div>
                          <Input label="Invoice Due Days" type="number" placeholder="e.g. 7" />
                       </div>
                       <ToggleSwitch label="Push Notifications" description="Receive real-time system alerts" checked />
                       <hr className="my-6 border-slate-50" />
                       <ToggleSwitch label="Email Notifications" description="System alerts via email" checked />
                    </Section>
                  </div>
                )}

                {activeTab === "payment" && (
                  <div className="space-y-6">
                    <Section title="Digital Payment Gateways">
                      <div className="space-y-6">
                        <Input label="PayPal Payment Link" icon={<LinkIcon size={14}/>} placeholder="https://paypal.me/yourname" />
                        <Input label="Stripe Payment Link" icon={<LinkIcon size={14}/>} placeholder="https://buy.stripe.com/..." />
                        <div className="relative group">
                          <Input label="Stripe Secret Key (Backend)" type={showKey ? "text" : "password"} placeholder="sk_test_••••••••" />
                          <button onClick={() => setShowKey(!showKey)} className="absolute right-5 top-11 text-slate-400 hover:text-[#4177BC]">
                            {showKey ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                        </div>
                      </div>
                    </Section>

                    <Section title="Bank Settlement Details">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-2">
                             <BankIcon className="text-[#4177BC]" size={20}/>
                             <p className="text-[10px] font-black text-[#4177BC] uppercase">Manual Bank Transfer Details</p>
                          </div>
                          <Input label="Bank Details" isTextArea placeholder="Bank Name: &#10;Account Number: &#10;Branch / SWIFT:" />
                          <Input label="Client Payment Note" placeholder="Instructions shown on invoice" isTextArea />
                        </div>
                    </Section>
                  </div>
                )}

                {activeTab === "invoice" && (
                  <div className="space-y-6">
                    <Section title="Business Branding">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="Business / Brand Name" placeholder="Apex Digital Studio" />
                        <Input label="Currency Code" placeholder="USD, BDT, EUR" />
                        <div className="sm:col-span-2">
                           <Input label="Official Address" placeholder="Your business physical location" isTextArea />
                        </div>
                      </div>
                    </Section>
                    
                    <Section title="Invoice Customization">
                      <div className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Input label="Invoice Prefix" placeholder="INV-" />
                            <Input label="Tax Rate (%)" type="number" placeholder="15" />
                         </div>
                         <Input label="Footer Note" placeholder="Thank you message or payment terms" isTextArea />
                      </div>
                    </Section>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-6">
                    <Section title="Access Protection">
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                           <div className="flex-1 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                              <Lock size={24} className="text-[#4177BC] mb-4" />
                              <h4 className="text-sm font-black uppercase italic mb-2">Password Management</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 leading-relaxed">Regularly update your password to keep the account secure.</p>
                              <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-[#4177BC] hover:bg-blue-50 transition-colors shadow-sm">Reset Password</button>
                           </div>
                           <div className="flex-1">
                              <ToggleSwitch label="Two-Factor (2FA)" description="OTP via Authenticator" checked />
                              <hr className="my-6 border-slate-100" />
                              <ToggleSwitch label="Auto Logout" description="Logout after 30 mins inactivity" />
                           </div>
                        </div>
                      </div>
                    </Section>
                    
                    <Section title="Advanced Operations">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-transparent hover:border-slate-100 rounded-[24px] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm"><Download size={18} className="text-slate-400 group-hover:text-[#4177BC]" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Export All Logs</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-300" />
                            </button>
                            <button className="flex items-center justify-between p-5 bg-red-50/50 hover:bg-red-50 border border-transparent rounded-[24px] transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm"><Trash2 size={18} className="text-red-400" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Purge Sessions</span>
                                </div>
                                <ChevronRight size={16} className="text-red-200" />
                            </button>
                        </div>
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

// --- REUSABLE COMPONENTS (UI KIT) ---

function Section({ title, children }: any) {
  return (
    <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/30 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-[10px] font-black text-[#4177BC] uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
          <span className="w-8 h-[2px] bg-[#4177BC]" /> {title}
        </h3>
        {children}
      </div>
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />
    </div>
  );
}

function Input({ label, isTextArea, icon, ...props }: any) {
  return (
    <div className="space-y-2.5 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-[#4177BC] transition-colors italic">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && <span className="absolute left-5 text-slate-400 group-focus-within:text-[#4177BC] transition-colors">{icon}</span>}
        {isTextArea ? (
          <textarea className={`w-full p-5 ${icon ? 'pl-12' : ''} bg-slate-50 border border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#4177BC]/20 focus:ring-4 ring-[#4177BC]/5 transition-all min-h-[120px]`} {...props} />
        ) : (
          <input className={`w-full p-5 ${icon ? 'pl-12' : ''} bg-slate-50 border border-transparent rounded-[24px] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-[#4177BC]/20 focus:ring-4 ring-[#4177BC]/5 transition-all`} {...props} />
        )}
      </div>
    </div>
  );
}

function ToggleSwitch({ label, description, checked }: any) {
  const [isOn, setIsOn] = useState(checked || false);
  return (
    <div className="flex items-center justify-between gap-6 p-1">
      <div className="flex-1">
        <p className="text-sm font-black text-slate-800 italic uppercase tracking-tight leading-none mb-1.5">{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-relaxed">{description}</p>
      </div>
      <div 
        onClick={() => setIsOn(!isOn)} 
        className={`w-14 h-7 rounded-full p-1 transition-all duration-500 cursor-pointer relative ${isOn ? 'bg-[#4177BC]' : 'bg-slate-200'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 transform ${isOn ? 'translate-x-7' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}