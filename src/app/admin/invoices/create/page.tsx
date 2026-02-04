/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Building2,
  Download,
  Send,
  Briefcase,
  Mail,
  CalendarClock,
  Banknote,
  UserPlus,
  Hash,
  Save,
  RefreshCw,
  Loader2,
  Globe,
  FileText,
  CreditCard,
  Info,
  AlertCircle,
  ChevronDown,
} from "lucide-react"; // Note: fix the import to "lucide-react" if it was a typo
import {
  LucideProps,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  ArrowLeft as ArrowIcon,
  Building2 as BuildingIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Briefcase as BriefcaseIcon,
  Mail as MailIcon,
  CalendarClock as CalendarIcon,
  Banknote as BanknoteIcon,
  UserPlus as UserIcon,
  Hash as HashIcon,
  Save as SaveIcon,
  RefreshCw as RefreshIcon,
  Loader2 as LoaderIcon,
  Globe as GlobeIcon,
  FileText as FileIcon,
  CreditCard as CreditIcon,
  Info as InfoIcon,
  AlertCircle as AlertIcon,
  ChevronDown as ChevronIcon,
} from "lucide-react";
import Link from "next/link";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// --- PDF STYLES (Keeping your structure 100%) ---
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },

  /* ===== HEADER ===== */
  headerBox: {
    borderBottomWidth: 2,
    borderBottomColor: "#4177BC",
    paddingBottom: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 50,
    marginBottom: 4,
  },

  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 2,
  },

  companyText: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 1,
  },

  /* ===== INVOICE BAR ===== */
  invoiceBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
  },

  invoiceTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4177BC",
  },

  invoiceId: {
    fontSize: 11,
    fontWeight: "bold",
  },

  /* ===== INFO ===== */
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  infoBox: {
    width: "48%",
  },

  label: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "bold",
    marginBottom: 3,
  },

  value: {
    fontSize: 11,
    fontWeight: "bold",
  },

  /* ===== TABLE ===== */
  table: {
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4177BC",
    color: "#FFFFFF",
    padding: 8,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },

  /* ===== TOTAL ===== */
  totalBox: {
    marginTop: 25,
    alignSelf: "flex-end",
    width: "40%",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  grandTotal: {
    borderTopWidth: 2,
    borderTopColor: "#4177BC",
    marginTop: 8,
    paddingTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#4177BC",
  },

  /* ===== FOOTER ===== */
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#94A3B8",
  },
});



export default function UltimateDigitalLedger() {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");


  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [adminEmail, setAdminEmail] = useState(""); // Initialize empty
  const [projectTitle, setProjectTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [freelancerName, setFreelancerName] = useState("John Doe");
  const [freelancerAddress, setFreelancerAddress] = useState(
    "Road 10, Dhaka, Bangladesh",
  );
  const [items, setItems] = useState([
    { id: 1, name: "", desc: "", qty: 1, price: 0 },
  ]);
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [bankDetails, setBankDetails] = useState(
    "Bank: ABC Bank | A/C: 123-456-789 | Swift: ABCDBD",
  );
  const [invoiceId, setInvoiceId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [notes, setNotes] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    setInvoiceId("INV-" + Math.floor(100000 + Math.random() * 900000));
    setInvoiceDate(new Date().toLocaleDateString("en-GB"));

    // Fix: Use localStorage inside useEffect to avoid Build error
    const userEmail = localStorage.getItem("user_email");
    if (userEmail) setAdminEmail(userEmail);

    const savedData = localStorage.getItem("ledger_settings");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFreelancerName(parsed.freelancerName || "John Doe");
      setFreelancerAddress(parsed.freelancerAddress || "");
      setBankDetails(parsed.bankDetails || "");
    }
  }, []);

  const { subtotal, taxAmount, grandTotal, remainingDue, status } =
    useMemo(() => {
      const sub = items.reduce(
        (acc, item) => acc + Number(item.qty) * Number(item.price),
        0,
      );
      const afterDiscount = sub - discount;
      const tax = (afterDiscount * taxRate) / 100;
      const total = afterDiscount + tax;
      const due = total - receivedAmount;

      let paymentStatus = "UNPAID";
      if (receivedAmount > 0 && due > 0) paymentStatus = "PARTIAL";
      if (receivedAmount > 0 && due <= 0 && total > 0) paymentStatus = "PAID";

      return {
        subtotal: sub,
        taxAmount: tax,
        grandTotal: total,
        remainingDue: due,
        status: paymentStatus,
      };
    }, [items, receivedAmount, taxRate, discount]);

  const addItem = () =>
    setItems([
      ...items,
      { id: Date.now(), name: "", desc: "", qty: 1, price: 0 },
    ]);
  const removeItem = (id: number) =>
    items.length > 1 && setItems(items.filter((i) => i.id !== id));
  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const getInvoiceData = () => ({
    invoiceId,
    projectTitle,
    clientName,
    clientEmail,
    clientAddress,
    freelancerName,
    freelancerAddress,
    items,
    subtotal,
    taxRate,
    taxAmount,
    discount,
    grandTotal,
    receivedAmount,
    remainingDue,
    adminEmail,
    status,
    dueDate,
    currency,
    bankDetails,
    createdAt: new Date(),
  });

  const handleSaveInvoice = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/invoices`, getInvoiceData());
      localStorage.setItem(
        "ledger_settings",
        JSON.stringify({ freelancerName, freelancerAddress, bankDetails }),
      );
      alert("Invoice Saved Successfully!");
      router.push("/admin/invoices");
    } catch (error) {
      alert("Failed to save invoice.");
    } finally {
      setLoading(false);
    }
  };

const handleSendEmail = async () => {
    // 1. Validation: Email empty kina check kora
    if (!clientEmail) {
      return alert("❌ Client email is required!");
    }

    setEmailSending(true);

    try {
      // 2. Performance Fix: Dynamic Import for react-pdf
      // Eita frontend slow hoya bondho korbe
      const { pdf } = await import('@react-pdf/renderer');
      
      // 3. Current state theke Invoice PDF generate kora
      const blob = await pdf(<InvoicePDF />).toBlob();

      // 4. Global Settings theke data fetch kora (Dynamic Payment Link jonno)
      // Ekhane getInvoiceData() use kora hoyeche jeta settings sync kore
      const currentInvoiceData = {
        ...getInvoiceData(),
        paypalEmail: paypalEmail || "your-paypal@example.com", // Dynamic email/link
      };

      // 5. FormData setup
      const formData = new FormData();
      formData.append("pdf", blob, `Invoice_${invoiceId || 'N/A'}.pdf`);
      formData.append("invoiceData", JSON.stringify(currentInvoiceData));

      // 6. Backend API Call (Axios)
      const response = await axios.post(`${API_URL}/invoices/send-email`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 seconds timeout (PDF heavy hole dorkar hoy)
      });

      if (response.status === 200) {
        alert(`✅ Success! Invoice sent to ${clientEmail}`);
      }

    } catch (error: any) {
      // 7. Robust Error Handling (Ager error-ta ekhon solve hobe)
      console.error("Full Email Error Context:", error);
      
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "Something went wrong while sending email.";

      alert("❌ Sending Failed: " + errorMessage);
    } finally {
      setEmailSending(false);
    }
  };

  if (!mounted) return null;

  const COMPANY_INFO = {
    name: "Geniehack Ltd.",
    address: "Sylhet, Bangladesh | Budapest, Hungary",
    phone: "+880-123456789",
    email: "geniehack.team@gmail.com",
    website: "www.geniehack.com",
  };

  // Must be in /public folder
  const COMPANY_LOGO = "/gene.png";

  const InvoicePDF = () => (
    <Document>
      <Page size="A4" style={pdfStyles.page}>

        {/* ===== HEADER ===== */}
        <View style={pdfStyles.headerBox}>

          <Image src={COMPANY_LOGO} style={pdfStyles.logo} />

          <Text style={pdfStyles.companyName}>
            {COMPANY_INFO.name}
          </Text>

          <Text style={pdfStyles.companyText}>
            {COMPANY_INFO.address}
          </Text>

          <Text style={pdfStyles.companyText}>
            {COMPANY_INFO.phone} | {COMPANY_INFO.email}
          </Text>

          <Text style={pdfStyles.companyText}>
            {COMPANY_INFO.website}
          </Text>

        </View>

        {/* ===== INVOICE BAR ===== */}
        <View style={pdfStyles.invoiceBar}>

          <Text style={pdfStyles.invoiceTitle}>
            INVOICE
          </Text>

          <Text style={pdfStyles.invoiceId}>
            #{invoiceId}
          </Text>

        </View>

        {/* ===== INFO ===== */}
        <View style={pdfStyles.infoRow}>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>BILLED TO</Text>

            <Text style={pdfStyles.value}>
              {clientName || "Client Name"}
            </Text>

            <Text>{clientEmail}</Text>
          </View>

          <View style={pdfStyles.infoBox}>
            <Text style={pdfStyles.label}>INVOICE DATE</Text>
            <Text>{invoiceDate}</Text>

            <Text style={[pdfStyles.label, { marginTop: 8 }]}>
              DUE DATE
            </Text>

            <Text>{dueDate || "Upon Receipt"}</Text>
          </View>

        </View>

        {/* ===== TABLE ===== */}
        <View style={pdfStyles.table}>

          <View style={pdfStyles.tableHeader}>
            <Text style={pdfStyles.colDesc}>Service</Text>
            <Text style={pdfStyles.colQty}>Qty</Text>
            <Text style={pdfStyles.colPrice}>Price</Text>
            <Text style={pdfStyles.colTotal}>Total</Text>
          </View>

          {items.map((item, i) => (
            <View key={i} style={pdfStyles.tableRow}>

              <Text style={pdfStyles.colDesc}>
                {item.name || "Service"}
              </Text>

              <Text style={pdfStyles.colQty}>
                {item.qty}
              </Text>

              <Text style={pdfStyles.colPrice}>
                {currency} {item.price}
              </Text>

              <Text style={pdfStyles.colTotal}>
                {currency} {(item.qty * item.price).toLocaleString()}
              </Text>

            </View>
          ))}

        </View>

        {/* ===== TOTAL ===== */}
        <View style={pdfStyles.totalBox}>

          <View style={pdfStyles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{currency} {subtotal}</Text>
          </View>

          <View style={pdfStyles.totalRow}>
            <Text>Tax ({taxRate}%)</Text>
            <Text>{currency} {taxAmount}</Text>
          </View>

          <View style={[pdfStyles.totalRow, pdfStyles.grandTotal]}>
            <Text>Total Due</Text>
            <Text>{currency} {remainingDue}</Text>
          </View>

        </View>

        {/* ===== FOOTER ===== */}
        <View style={pdfStyles.footer}>
          <Text>
            Thank you for your business • Geniehack Ltd.
          </Text>
        </View>

      </Page>
    </Document>
  );



  return (
    <div className="min-h-screen  text-slate-900 selection:bg-[#4177BC]/10">
      {/* --- MODERN NAVIGATION --- */}
      <nav className="sticky top-0 z-50 border-b border-slate-200  py-3 bg-white/70">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/invoices"
              className="group h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:border-[#4177BC] hover:text-[#4177BC] transition-all"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
                Ledger<span className="text-[#4177BC]">PRO</span>
              </h1>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                Invoice Builder v2.1
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveInvoice}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:shadow-xl hover:shadow-slate-900/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {loading ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={handleSendEmail}
              disabled={emailSending}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              {emailSending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              Send to Client
            </button>

            {/* PDF link only after mounted to avoid build error */}
            {mounted && (
              <PDFDownloadLink
                document={<InvoicePDF />}
                fileName={`${invoiceId}.pdf`}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#4177BC] text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#4177BC]/25"
              >
                {({ loading }) =>
                  loading ? (
                    "Building..."
                  ) : (
                    <>
                      <Download size={14} /> Download
                    </>
                  )
                }
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto  py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN: INPUTS (Design preserved 100%) --- */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Briefcase size={14} /> Your Identity
              </h2>
              <span className="h-1.5 w-1.5 rounded-full bg-[#4177BC]"></span>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-4 text-slate-400">
                  <FileText size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Your Business/Legal Name"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 focus:ring-4 ring-[#4177BC]/5 outline-none transition-all text-sm font-medium"
                  value={freelancerName}
                  onChange={(e) => setFreelancerName(e.target.value)}
                />
              </div>
              <textarea
                placeholder="Business Address, Contact, Tax ID"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 focus:ring-4 ring-[#4177BC]/5 outline-none transition-all text-sm min-h-20"
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm space-y-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4177BC] flex items-center gap-2">
              <UserPlus size={14} /> Client & Logistics
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                placeholder="Project or Contract Title"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 outline-none transition-all text-sm font-bold text-slate-700"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 outline-none text-sm"
                />
                <input
                  type="email"
                  placeholder="Client Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 outline-none text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <CalendarClock size={16} />
                  </span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 outline-none text-sm"
                    title="Due Date"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-slate-400">
                    <Globe size={16} />
                  </span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-[#4177BC]/30 outline-none text-sm appearance-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="BDT">BDT (৳)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                  Tax %
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-center outline-none focus:bg-white border border-transparent focus:border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                  Discount
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 rounded-2xl bg-slate-50 font-bold text-center outline-none focus:bg-white border border-transparent focus:border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-emerald-600 ml-2">
                  Already Paid
                </label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) =>
                    setReceivedAmount(parseFloat(e.target.value) || 0)
                  }
                  className="w-full p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-center outline-none border border-emerald-100"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-4xl border border-slate-200/60 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Line Items
              </h2>
              <button
                onClick={addItem}
                className="h-8 w-8 bg-[#4177BC]/10 text-[#4177BC] rounded-full flex items-center justify-center hover:bg-[#4177BC] hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all relative"
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-white shadow-md text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="grid gap-3">
                    <input
                      placeholder="Item or Service Name (e.g. Web Design)"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      className="w-full bg-transparent font-bold text-sm outline-none"
                    />
                    <div className="flex gap-4">
                      <div className="flex items-center bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 mr-2 uppercase">
                          Qty
                        </span>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.id, "qty", e.target.value)
                          }
                          className="w-12 bg-transparent font-bold text-sm outline-none"
                        />
                      </div>
                      <div className="flex flex-1 items-center bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 mr-2 uppercase">
                          Price
                        </span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(item.id, "price", e.target.value)
                          }
                          className="w-full bg-transparent font-bold text-sm outline-none text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: LIVE PREVIEW (Design preserved 100%) --- */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden transform transition-all">
            <div
              className={`absolute top-10 -right-12 rotate-45 px-12 py-1.5 text-[10px] font-black tracking-[0.2em] text-white shadow-lg z-20
                            ${status === "PAID" ? "bg-emerald-500" : status === "PARTIAL" ? "bg-orange-500" : "bg-[#4177BC]"}`}
            >
              {status}
            </div>

            <div className="p-10 pb-0">
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 bg-[#4177BC] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-[#4177BC]/30">
                    <Building2 size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter uppercase leading-none text-slate-900">
                      {freelancerName || "Your Name"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 max-w-50 line-clamp-2">
                      {freelancerAddress || "Your address will appear here"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <h1 className="text-5xl font-black tracking-tighter text-slate-200 select-none">
                    INVOICE
                  </h1>
                  <p className="text-sm font-black text-[#4177BC] -mt-4">
                    {invoiceId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10 py-8 border-y border-slate-100 mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="h-1 w-3 bg-[#4177BC] rounded-full"></span>{" "}
                    Billed To
                  </p>
                  <p className="font-black text-slate-900 text-lg leading-none mb-1">
                    {clientName || "Client Name"}
                  </p>
                  <p className="text-xs font-medium text-slate-500 italic">
                    {clientEmail || "client@example.com"}
                  </p>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-900">
                    Date:{" "}
                    <span className="text-slate-500 font-medium ml-2">
                      {invoiceDate}
                    </span>
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1">
                    Due:{" "}
                    <span className="text-rose-500 ml-2">
                      {dueDate || "Upon Receipt"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
                  <span className="flex-1">Description</span>
                  <span className="w-24 text-center">Qty / Price</span>
                  <span className="w-32 text-right">Total</span>
                </div>
                <div className="space-y-2 min-h-40">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center px-4 py-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">
                          {item.name || "Service Description"}
                        </p>
                      </div>
                      <div className="w-24 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.qty} × {item.price}
                        </p>
                      </div>
                      <div className="w-32 text-right">
                        <p className="font-black text-slate-900">
                          {currency} {(item.qty * item.price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 pt-0 bg-white">
              <div className="mt-8 pt-8 border-t-2 border-slate-900 flex justify-between items-end">
                <div className="max-w-60">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">
                    Payment Instructions
                  </h4>
                  <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                    {bankDetails}
                  </p>
                </div>
                <div className="w-72 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500 px-2">
                    <span>Subtotal</span>
                    <span className="text-slate-900">
                      {currency} {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 px-2">
                    <span>Tax ({taxRate}%)</span>
                    <span className="text-slate-900">
                      +{currency} {taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-rose-500 px-2">
                    <span>Discount</span>
                    <span>
                      -{currency} {discount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xl font-black text-white bg-[#4177BC] p-5 rounded-3xl shadow-xl shadow-[#4177BC]/20 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest opacity-80">
                        Total Due
                      </span>
                      <span>
                        {currency} {remainingDue.toLocaleString()}
                      </span>
                    </div>
                    <CreditCard size={24} className="opacity-30" />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter justify-center">
                <Info size={12} /> generated via LedgerPro Digital Systems -{" "}
                {invoiceDate}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}