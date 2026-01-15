/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Download, RefreshCcw, ArrowLeft, CheckCircle2, 
  Hash, User, Banknote, ShieldCheck, FileText, 
  ArrowUpRight, Zap, Info, CreditCard, Mail, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// --- PDF Styling (Enhanced & Professional) ---
const pdfStyles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  header: { borderBottom: '2px solid #F1F5F9', paddingBottom: 20, marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: 20, fontWeight: 'bold', color: '#4177BC', letterSpacing: -1 },
  statusBadge: { backgroundColor: '#4177BC', color: '#FFFFFF', padding: '4 12', borderRadius: 20, fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  sectionTitle: { fontSize: 8, color: '#94A3B8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 },
  infoBox: { marginBottom: 25 },
  payerName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  amountContainer: { backgroundColor: '#F8FAFC', padding: 25, borderRadius: 12, marginVertical: 20, border: '1px solid #F1F5F9' },
  amountLabel: { fontSize: 9, color: '#64748B', textAlign: 'center', marginBottom: 5 },
  amountValue: { fontSize: 32, color: '#1E293B', fontWeight: 'bold', textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '50%', marginBottom: 15 },
  label: { fontSize: 7, color: '#4177BC', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 3 },
  value: { fontSize: 10, color: '#334155' },
  footer: { borderTop: '1px solid #F1F5F9', paddingTop: 15, marginTop: 40, textAlign: 'center' },
  footerText: { fontSize: 7, color: '#CBD5E1' }
});

const MyReceiptPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <View>
          <Text style={pdfStyles.brand}>FINANCE HUB</Text>
          <Text style={{ fontSize: 8, color: '#EB9C2C', marginTop: 2 }}>OFFICIAL TRANSACTION RECORD</Text>
        </View>
        <Text style={pdfStyles.statusBadge}>{data.status}</Text>
      </View>

      <View style={pdfStyles.infoBox}>
        <Text style={pdfStyles.sectionTitle}>Payer Identity</Text>
        <Text style={pdfStyles.payerName}>{data.payer}</Text>
        <Text style={{ fontSize: 9, color: '#64748B', marginTop: 3 }}>{data.email}</Text>
      </View>

      <View style={pdfStyles.grid}>
        <View style={pdfStyles.gridItem}>
          <Text style={pdfStyles.label}>Transaction ID</Text>
          <Text style={pdfStyles.value}>{data.id}</Text>
        </View>
        <View style={pdfStyles.gridItem}>
          <Text style={pdfStyles.label}>Date issued</Text>
          <Text style={pdfStyles.value}>{data.date}</Text>
        </View>
        <View style={pdfStyles.gridItem}>
          <Text style={pdfStyles.label}>Payment Method</Text>
          <Text style={pdfStyles.value}>{data.method}</Text>
        </View>
        <View style={pdfStyles.gridItem}>
          <Text style={pdfStyles.label}>Classification</Text>
          <Text style={pdfStyles.value}>{data.category}</Text>
        </View>
      </View>

      <View style={pdfStyles.amountContainer}>
        <Text style={pdfStyles.amountLabel}>Total Settled Balance</Text>
        <Text style={pdfStyles.amountValue}>${data.amount.toLocaleString()}</Text>
      </View>

      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.footerText}>Securely generated via Hub Ledger System • {data.id} • Verified Digital Receipt</Text>
      </View>
    </Page>
  </Document>
);

// --- Main UI Component ---
export default function PaymentDetailsPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("payments");
    if (saved) {
      const allPayments = JSON.parse(saved);
      const found = allPayments.find((p: any) => p.id === id);
      if (found) setPayment(found);
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  const handleRefund = () => {
    if (!payment) return;
    setProcessing(true);
    setTimeout(() => {
      const saved = localStorage.getItem("payments");
      if (saved) {
        const allPayments = JSON.parse(saved);
        const updated = allPayments.map((p: any) => 
          p.id === id ? { ...p, status: "REFUNDED" } : p
        );
        localStorage.setItem("payments", JSON.stringify(updated));
        setPayment({ ...payment, status: "REFUNDED" });
      }
      setProcessing(false);
    }, 1500);
  };

  const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-slate-200/50 rounded-2xl ${className}`} />
  );

  if (!payment && !loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-slate-400 bg-white p-10">
      <Info size={48} className="mb-4 opacity-20" />
      <p className="font-black text-xs uppercase tracking-widest">Manifest Record Not Found</p>
      <Link href="/admin/payments" className="mt-6 text-[#4177BC] font-bold text-xs underline underline-offset-4">Return to Ledger</Link>
    </div>
  );

  return (
    <div className=" min-h-screen pb-20">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 px-6 py-4 md:px-16 md:py-8 transition-all">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Link href="/admin/payments">
              <motion.button whileHover={{ x: -3 }} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-white hover:text-[#4177BC] transition-all border border-transparent hover:border-slate-100">
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <div>
              {loading ? <Skeleton className="h-8 w-48"/> : (
                <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter uppercase italic">
                  Receipt <span className="text-[#4177BC]">Insight</span>
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!loading && payment && (
              <>
                <PDFDownloadLink document={<MyReceiptPDF data={payment} />} fileName={`HUB-REC-${payment.id}.pdf`} className="flex-1 md:flex-none">
                  {({ loading: pdfLoading }) => (
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-[20px] text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-[#4177BC] hover:text-[#4177BC] transition-all shadow-sm">
                      <Download size={16} /> {pdfLoading ? "Encoding..." : "Export PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
                {payment.status === "PAID" && (
                  <button onClick={handleRefund} disabled={processing} className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-[#EB9C2C] text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-200 transition-all active:scale-95">
                    <RefreshCcw size={16} className={processing ? "animate-spin" : ""} /> {processing ? "..." : "Refund"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-16 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Detailed Manifest Section */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-100 rounded-[40px] md:rounded-[50px] overflow-hidden shadow-2xl shadow-blue-900/5">
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-[#4177BC] rounded-2xl flex items-center justify-center border border-blue-100">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Record</p>
                    <p className="font-black text-slate-800 text-sm italic uppercase tracking-tight">Financial Manifest v2.0</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${payment?.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {loading ? "..." : payment?.status}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                <div className="space-y-10">
                  <InfoItem icon={<User size={14}/>} label="Payer Entity" value={payment?.payer} isLoading={loading} />
                  <InfoItem icon={<Mail size={14}/>} label="Email Manifest" value={payment?.email} isLoading={loading} />
                </div>
                <div className="space-y-10">
                  <InfoItem icon={<Globe size={14}/>} label="Classification" value={payment?.category} isLoading={loading} />
                  <InfoItem icon={<CreditCard size={14}/>} label="Source Method" value={payment?.method} isLoading={loading} />
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-[35px] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center md:text-left">Settled Total</p>
                  <div className="flex items-start justify-center md:justify-start">
                    <span className="text-xl md:text-2xl font-black text-[#4177BC] mt-2 mr-1">$</span>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter italic uppercase">{loading ? "..." : payment?.amount.toLocaleString()}</h2>
                  </div>
                </div>
                <div className="hidden md:block">
                   <div className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-300">
                      <Zap size={32} />
                   </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 px-12 py-6 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <span>Ref: {payment?.id}</span>
               <span>Time: {payment?.date}</span>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Stats */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Hash size={120} />
             </div>
             <div className="relative z-10">
               <p className="text-[#EB9C2C] text-[9px] font-black uppercase tracking-[0.3em] mb-8">Metadata Archive</p>
               <div className="space-y-6 mb-10">
                  <div className="flex justify-between border-b border-white/5 pb-4">
                     <span className="text-[10px] text-slate-400 font-bold uppercase">System ID</span>
                     <span className="text-xs font-black tracking-tight">{payment?.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-4">
                     <span className="text-[10px] text-slate-400 font-bold uppercase">Encryption</span>
                     <span className="text-xs font-black tracking-tight">SHA-256</span>
                  </div>
                  <div className="flex justify-between pb-4">
                     <span className="text-[10px] text-slate-400 font-bold uppercase">Audit Lock</span>
                     <span className="text-xs font-black tracking-tight text-green-400 flex items-center gap-1">ACTIVE <CheckCircle2 size={10}/></span>
                  </div>
               </div>
               <Link href="/admin/payments" className="w-full py-4 bg-[#4177BC] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#EB9C2C] transition-all">
                  Back to Hub <ArrowUpRight size={14} />
               </Link>
             </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}

// Reusable Small Info Component
function InfoItem({ icon, label, value, isLoading }: any) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-black text-[#4177BC] uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </p>
      {isLoading ? (
        <div className="h-6 w-32 bg-slate-100 animate-pulse rounded-lg" />
      ) : (
        <p className="text-lg font-black text-slate-700 tracking-tight italic uppercase">{value}</p>
      )}
    </div>
  );
}