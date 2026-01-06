/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { 
    ChevronLeft, User, Building2, Mail, Phone, 
    MapPin, Globe, CreditCard, Tag, FileText, 
    CheckCircle2, Send 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateClientPage() {
    const router = useRouter();

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-10">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-[#4177BC] transition-colors font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <ChevronLeft size={16} /> Back to List
                </button>
                <div className="text-right">
                    <h1 className="text-3xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">New Client</h1>
                    <p className="text-[#EB9C2C] font-black text-[9px] uppercase tracking-[0.3em] mt-1">Registration Portal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Basic Information */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm space-y-8">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <div className="h-10 w-10 bg-[#4177BC]/10 rounded-xl flex items-center justify-center text-[#4177BC]">
                                <User size={20} />
                            </div>
                            <h2 className="font-[1000] text-slate-900 uppercase tracking-tight">Primary Identity</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input type="text" placeholder="e.g. Tanvir Alam" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-[#4177BC]/5 outline-none transition-all font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                                <input type="text" placeholder="e.g. TechHive Ltd" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-[#4177BC]/5 outline-none transition-all font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input type="email" placeholder="client@example.com" className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-[#4177BC]/5 outline-none transition-all font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input type="text" placeholder="+880 17..." className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-[#4177BC]/5 outline-none transition-all font-bold text-sm" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-5 text-slate-300" size={18} />
                                <textarea rows={2} placeholder="Street address, City, Country" className="w-full pl-14 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-[#4177BC]/5 outline-none transition-all font-bold text-sm resize-none" />
                            </div>
                        </div>
                    </section>

                    {/* Internal Notes Section */}
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-10 w-10 bg-[#EB9C2C]/10 rounded-xl flex items-center justify-center text-[#EB9C2C]">
                                <FileText size={20} />
                            </div>
                            <h2 className="font-[1000] text-slate-900 uppercase tracking-tight">Admin Confidential Notes</h2>
                        </div>
                        <textarea rows={4} placeholder="Anything special to remember about this client? (Not visible to client)" className="w-full px-6 py-5 rounded-3xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-[#4177BC]/5 outline-none transition-all font-bold text-sm resize-none" />
                    </section>
                </div>

                {/* Right Column: Business & Preferences */}
                <div className="space-y-8">
                    <section className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
                        <h2 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Business Settings</h2>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Tag size={12}/> Category</label>
                                <select className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#4177BC]/10 outline-none transition-all appearance-none">
                                    <option>Corporate Client</option>
                                    <option>Individual / Freelance</option>
                                    <option>Internal Agency</option>
                                    <option>VIP Partner</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> Default Currency</label>
                                <select className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#4177BC]/10 outline-none transition-all appearance-none">
                                    <option>USD - United States Dollar</option>
                                    <option>BDT - Bangladeshi Taka</option>
                                    <option>EUR - Euro</option>
                                    <option>GBP - British Pound</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Globe size={12}/> Website</label>
                                <input type="text" placeholder="https://..." className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#4177BC]/10 outline-none transition-all" />
                            </div>
                        </div>
                    </section>

                    {/* Automation & Save */}
                    <div className="bg-[#4177BC]/5 rounded-[2.5rem] border border-[#4177BC]/10 p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="email_notify" className="w-5 h-5 accent-[#4177BC] cursor-pointer" defaultChecked />
                            <label htmlFor="email_notify" className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer leading-tight">
                                Auto-Send Welcome Email & Credentials
                            </label>
                        </div>
                        
                        <button className="w-full bg-[#4177BC] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#4177BC]/20 hover:bg-[#4177BC]/90 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                            <CheckCircle2 size={18} /> Finalize Account
                        </button>
                        
                        <button className="w-full bg-white text-slate-400 py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:text-rose-500 transition-colors">
                            Discard Entries
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}