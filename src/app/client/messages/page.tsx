/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Send, 
    Paperclip, 
    Smile, 
    ShieldCheck, 
    Zap, 
    CheckCheck,
    Phone,
    Video,
    Clock,
    Plus,
    MessageSquare,
    HeadphonesIcon
} from "lucide-react";

export default function MessagesPage() {
  const [msg, setMsg] = useState("");

  return (
    <div className="p-4 md:p-10 min-h-[90vh] flex flex-col max-w-7xl mx-auto space-y-6">
      
      {/* --- PREMIUM HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-tighter flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Agency Online
                </span>
            </div>
            <h1 className="text-5xl font-[1000] tracking-tighter text-slate-900 uppercase italic leading-none">
                Direct<span className="text-[#4177BC]">Line</span>
            </h1>
            <p className="text-slate-500 font-medium mt-3 italic text-sm">Priority support channel for your enterprise assets.</p>
        </motion.div>

        <div className="flex gap-3">
            <button className="px-6 py-3 bg-white border border-slate-100 shadow-sm rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-600">
                <Plus size={16} /> New Thread
            </button>
        </div>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 h-[70vh]">
        
        {/* LEFT: CONCIERGE INFO (Instead of long contact list) */}
        <aside className="w-full lg:w-80 flex flex-col gap-4">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#4177BC]/20 blur-3xl" />
                <HeadphonesIcon className="text-[#4177BC] mb-6" size={32} />
                <h4 className="text-xl font-black italic uppercase leading-tight mb-2">Dedicated Admin</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Response time: ~15m</p>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-black text-[10px]">JD</div>
                        <div>
                            <p className="text-[11px] font-black">John Doe</p>
                            <p className="text-[9px] text-slate-500">Account Lead</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Topics</p>
                <div className="space-y-2">
                    {['Billing Inquiry', 'Project Update', 'Technical Bug', 'Urgent Meeting'].map((tag) => (
                        <button key={tag} className="w-full text-left p-3 rounded-xl border border-slate-50 text-[11px] font-bold text-slate-600 hover:border-[#4177BC]/30 hover:text-[#4177BC] transition-all flex items-center justify-between group">
                            {tag} <Zap size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>
        </aside>

        {/* RIGHT: THE CHAT VAULT */}
        <main className="flex-1 bg-white rounded-[3rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative">
            {/* Chat Glass Header */}
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center p-1">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Admin" alt="Admin" className="rounded-xl" />
                    </div>
                    <div>
                        <p className="text-xs font-[1000] text-slate-900 uppercase italic tracking-tight">Enterprise Support Desk</p>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                           <ShieldCheck size={10} /> Secure End-to-End Encryption
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#4177BC] transition-all"><Phone size={18} /></button>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#4177BC] transition-all"><Video size={18} /></button>
                </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-slate-50/20">
                {/* Incoming */}
                <div className="flex gap-4 max-w-[75%]">
                    <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm">
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                            Welcome to your priority channel. How can we assist with your current project cycle today?
                        </p>
                        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center gap-2">
                            <Clock size={10} className="text-slate-300" />
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">02:15 PM • System Bot</span>
                        </div>
                    </div>
                </div>

                {/* Outgoing */}
                <div className="flex gap-4 max-w-[75%] ml-auto flex-row-reverse">
                    <div className="bg-[#4177BC] p-5 rounded-[2rem] rounded-tr-none shadow-xl shadow-blue-500/20">
                        <p className="text-sm font-medium text-white leading-relaxed">
                            I need an update on the latest UI mockups. Is the homepage finalized?
                        </p>
                        <div className="mt-3 flex items-center justify-end gap-2 text-blue-100/60">
                            <span className="text-[9px] font-black uppercase tracking-tighter">02:20 PM</span>
                            <CheckCheck size={14} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Terminal */}
            <div className="p-6 bg-white border-t border-slate-100">
                <div className="relative bg-slate-50 border border-slate-100 rounded-[2rem] p-2 flex items-center gap-2 focus-within:border-[#4177BC]/30 transition-all">
                    <button className="p-4 text-slate-400 hover:text-[#4177BC] transition-colors"><Paperclip size={20} /></button>
                    <input 
                        type="text" 
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Request an update or ask a question..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-800 placeholder:text-slate-400"
                    />
                    <button className="p-4 text-slate-400 hover:text-amber-500 transition-colors hidden md:block"><Smile size={20} /></button>
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        className="bg-slate-900 text-white p-4 px-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 hover:bg-[#4177BC] transition-all"
                    >
                        Send <Send size={14} />
                    </motion.button>
                </div>
            </div>
        </main>
      </div>

    </div>
  );
}