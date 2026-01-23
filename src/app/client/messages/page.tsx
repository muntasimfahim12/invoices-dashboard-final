/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
    Send, 
    Paperclip, 
    Smile, 
    MoreHorizontal,
    Phone,
    Video,
    Image as ImageIcon,
    ThumbsUp,
    CheckCheck,
    Info,
    Search,
    Plus
} from "lucide-react";

export default function MessagesPage() {
  const [msg, setMsg] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // অটো স্ক্রল টু বটম
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-[1600px] mx-auto bg-white md:m-4 md:rounded-[2.5rem] md:border md:border-slate-100 overflow-hidden shadow-2xl">
      
      {/* --- MESSENGER HEADER --- */}
      <header className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#4177BC] to-blue-400 rounded-full flex items-center justify-center p-0.5 shadow-lg">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Admin" 
                className="rounded-full bg-white"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 leading-tight">Vault Support Team</h3>
            <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              Active Now • <span className="text-[#4177BC]">Enterprise Support</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 text-[#4177BC]">
          <button className="p-2.5 hover:bg-blue-50 rounded-full transition-all"><Phone size={20} fill="currentColor" className="opacity-20" /></button>
          <button className="p-2.5 hover:bg-blue-50 rounded-full transition-all"><Video size={22} fill="currentColor" className="opacity-20" /></button>
          <button className="p-2.5 hover:bg-blue-50 rounded-full transition-all"><Info size={22} /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* --- MESSAGE STREAM (The Messenger Body) --- */}
        <main className="flex-1 flex flex-col bg-white relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
          >
            {/* System Date */}
            <div className="flex justify-center my-6">
                <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">Today</span>
            </div>

            {/* Incoming Message (Messenger Style) */}
            <div className="flex items-end gap-2 max-w-[80%]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-7 h-7 rounded-full bg-slate-100 mb-1" alt="" />
              <div className="space-y-1">
                <div className="bg-slate-100 p-4 rounded-[1.5rem] rounded-bl-none shadow-sm">
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    Hello! How can we help you with your project Vault Premium UI today? 😊
                  </p>
                </div>
                <p className="text-[9px] font-bold text-slate-400 ml-2 uppercase">2:15 PM</p>
              </div>
            </div>

            {/* Outgoing Message (Messenger Style) */}
            <div className="flex items-end justify-end gap-2 max-w-[80%] ml-auto">
              <div className="space-y-1 flex flex-col items-end">
                <div className="bg-[#0084FF] p-4 rounded-[1.5rem] rounded-br-none shadow-md shadow-blue-200">
                  <p className="text-sm font-medium text-white leading-relaxed">
                    I need the final invoice for the development phase. Is it ready?
                  </p>
                </div>
                <div className="flex items-center gap-1 mr-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Seen</p>
                    <CheckCheck size={12} className="text-[#0084FF]" />
                </div>
              </div>
            </div>

             {/* Typing Indicator Example */}
             <div className="flex items-center gap-2 text-slate-400 italic text-[11px] font-bold animate-pulse">
                <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                </div>
                Support is typing...
            </div>
          </div>

          {/* --- MESSENGER INPUT BAR --- */}
          <div className="p-4 bg-white border-t border-slate-50">
            <div className="flex items-center gap-2 max-w-5xl mx-auto">
              {/* Left Icons */}
              <div className="hidden sm:flex items-center gap-1 text-[#0084FF]">
                <button className="p-2 hover:bg-blue-50 rounded-full transition-all"><Plus size={20} /></button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition-all"><ImageIcon size={20} /></button>
                <button className="p-2 hover:bg-blue-50 rounded-full transition-all"><Paperclip size={20} /></button>
              </div>

              {/* Input Field */}
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Aa"
                  className="w-full bg-slate-100 border-none rounded-full px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0084FF]">
                    <Smile size={22} className="cursor-pointer hover:scale-110 transition-transform" />
                </div>
              </div>

              {/* Send or Like */}
              <div className="flex items-center">
                {msg.trim() ? (
                  <motion.button 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 text-[#0084FF] hover:bg-blue-50 rounded-full transition-all"
                  >
                    <Send size={24} fill="currentColor" />
                  </motion.button>
                ) : (
                  <button className="p-3 text-[#0084FF] hover:bg-blue-50 rounded-full transition-all">
                    <ThumbsUp size={24} fill="currentColor" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR (Desktop Details) --- */}
        <aside className="hidden xl:flex w-[350px] border-l border-slate-50 flex-col items-center p-8 bg-white">
            <div className="w-24 h-24 rounded-full bg-slate-50 p-1 border-2 border-slate-100 mb-4 shadow-sm">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="rounded-full" alt="" />
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Admin Support</h4>
            <p className="text-xs font-bold text-slate-400 uppercase mt-1">Managed by Vault Agency</p>

            <div className="w-full mt-10 space-y-6">
                <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Channel Settings</p>
                    <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all text-sm font-bold text-slate-700">
                        Search in Conversation <Search size={16} />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all text-sm font-bold text-slate-700">
                        Privacy & Support <MoreHorizontal size={16} />
                    </button>
                </div>

                <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Shared Assets</p>
                    <div className="grid grid-cols-3 gap-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-lg hover:opacity-80 cursor-pointer transition-opacity border border-slate-200" />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}