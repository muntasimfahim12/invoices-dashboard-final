/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { 
  ArrowLeft, Camera, User, Mail, ShieldCheck, Clock, LogOut, 
  ChevronRight, Lock, Bell, HelpCircle, Settings, Sparkles, Check, X, Edit2
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function ProfessionalVaultProfile() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/users/${id}`);
      setUser(response.data);
    } catch (err) {
      // Fallback data if API fails
      setUser({
        name: localStorage.getItem("user_name") || "Vault Admin",
        email: localStorage.getItem("user_email") || "admin@vault.com",
        role: localStorage.getItem("user_role") || "Super Admin",
        about: localStorage.getItem("user_about") || "Redefining digital security. ✨",
        profilePic: ""
      });
    } finally {
      setLoading(false);
    }
  };

  // Profile Update Logic (Name/About)
  const handleUpdateInfo = async (field: string) => {
    try {
      setSaving(true);
      const updatedData = { ...user, [field]: tempValue };
      await axios.put(`${API_BASE}/users/${id}`, updatedData);
      
      setUser(updatedData);
      localStorage.setItem(`user_${field}`, tempValue);
      setEditField(null);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Image Upload Logic
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setSaving(true);
      // ছবিতে ক্লিক করার সাথে সাথে সার্ভারে আপলোড হবে
      const res = await axios.post(`${API_BASE}/users/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser({ ...user, profilePic: res.data.url });
      alert("Avatar updated!");
    } catch (err) {
      // Demo Purpose: If no backend, show local preview
      const reader = new FileReader();
      reader.onloadend = () => setUser({ ...user, profilePic: reader.result as string });
      reader.readAsDataURL(file);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="w-10 h-10 border-4 border-[#00a884] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f2f5] md:p-6 lg:p-12 font-sans">
      <div className="max-w-[1100px] mx-auto bg-white md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[85vh]">
        
        {/* LEFT: WHATSAPP STYLE PROFILE CARD */}
        <div className="w-full md:w-[400px] bg-white border-r border-slate-100 flex flex-col">
          <div className="p-6 flex items-center gap-4 border-b border-slate-50 md:hidden bg-[#008069] text-white">
            <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
            <span className="font-bold text-lg">Profile Settings</span>
          </div>

          <div className="py-10 flex flex-col items-center px-6">
            {/* Avatar with Upload */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className={`w-40 h-40 rounded-full p-1 border-4 ${saving ? 'border-yellow-400 animate-pulse' : 'border-[#00a884]'} transition-all`}>
                <div className="w-full h-full rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={80} className="text-slate-300" />
                  )}
                </div>
              </div>
              <div className="absolute bottom-1 right-3 bg-[#00a884] p-2.5 rounded-full text-white shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
                <Camera size={18} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            </div>

            {/* Editable Name */}
            <div className="mt-8 w-full text-center group">
              {editField === "name" ? (
                <div className="flex items-center gap-2 justify-center">
                  <input 
                    autoFocus
                    className="text-2xl font-bold text-slate-800 border-b-2 border-[#00a884] outline-none text-center bg-transparent w-full"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
                  <button onClick={() => handleUpdateInfo("name")} className="text-green-600"><Check size={20}/></button>
                  <button onClick={() => setEditField(null)} className="text-red-500"><X size={20}/></button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
                  <Edit2 size={14} className="text-slate-300 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" 
                         onClick={() => { setEditField("name"); setTempValue(user?.name); }} />
                </div>
              )}
              <p className="text-[#00a884] text-xs font-bold uppercase tracking-widest mt-1">{user?.role}</p>
            </div>
          </div>

          {/* Info Sections */}
          <div className="px-4 space-y-1">
             <EditableRow 
                label="About / Status" 
                value={user?.about} 
                onEdit={() => { setEditField("about"); setTempValue(user?.about); }}
                isEditing={editField === "about"}
                tempValue={tempValue}
                setTemp={setTempValue}
                onSave={() => handleUpdateInfo("about")}
                onCancel={() => setEditField(null)}
             />
             <StaticRow label="Email Address" value={user?.email} icon={<Mail size={18}/>} />
             <StaticRow label="Clearance" value={user?.role} icon={<ShieldCheck size={18}/>} />
          </div>
        </div>

        {/* RIGHT: SYSTEM & LOGS */}
        <div className="flex-1 bg-[#f8fafc] p-6 md:p-12">
          <div className="max-w-xl mx-auto space-y-8">
            <header>
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Vault Security</h3>
               <p className="text-2xl font-bold text-slate-900 italic">Your data, our priority.</p>
            </header>

            <div className="grid gap-4">
              <ActionCard icon={<Lock className="text-blue-500"/>} title="Change Security Key" desc="Update your password periodically" />
              <ActionCard icon={<Bell className="text-orange-500"/>} title="System Notifications" desc="Get alerts for critical projects" />
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <h4 className="text-xs font-black text-slate-400 uppercase mb-4">Last Activity</h4>
               <div className="space-y-4">
                 <LogItem title="Profile updated" time="Just now" />
                 <LogItem title="Login from New Device" time="2 days ago" />
               </div>
            </div>

            <button 
              onClick={() => { localStorage.clear(); router.push("/login"); }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-white border border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors shadow-sm"
            >
              <LogOut size={20} /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function EditableRow({ label, value, onEdit, isEditing, tempValue, setTemp, onSave, onCancel }: any) {
  return (
    <div className="p-5 hover:bg-slate-50 rounded-2xl transition-all group">
      <p className="text-[11px] font-black text-[#008069] uppercase tracking-tighter mb-1">{label}</p>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <textarea 
            autoFocus
            className="w-full text-sm font-medium p-2 border-2 border-[#00a884] rounded-lg outline-none bg-white"
            value={tempValue}
            onChange={(e) => setTemp(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <button onClick={onSave} className="bg-[#00a884] text-white p-1 rounded-md"><Check size={16}/></button>
            <button onClick={onCancel} className="bg-slate-200 text-slate-600 p-1 rounded-md"><X size={16}/></button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between cursor-pointer" onClick={onEdit}>
          <p className="text-sm font-medium text-slate-700 leading-relaxed">{value}</p>
          <Edit2 size={14} className="text-slate-300 opacity-0 group-hover:opacity-100" />
        </div>
      )}
    </div>
  );
}

function StaticRow({ label, value, icon }: any) {
  return (
    <div className="p-5 flex items-center gap-4">
      <div className="text-slate-300">{icon}</div>
      <div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-shadow cursor-pointer">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </div>
  );
}

function LogItem({ title, time }: any) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="font-bold text-slate-600">• {title}</span>
      <span className="text-slate-400 italic">{time}</span>
    </div>
  );
}