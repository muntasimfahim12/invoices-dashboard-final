/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

/* =========================
   TYPES
========================= */

type Client = {
  _id: string;
  name: string;
  email: string;
};

type Project = {
  _id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
  paymentType: "full" | "installment" | "monthly";
  totalInstallments?: number;
  milestones?: Milestone[];
};

type Milestone = {
  _id: string;
  name: string;
  amount: number;
  status: "Unpaid" | "Paid";
};

type InvoiceForm = {
  adminEmail: string;
  clientEmail: string;
  projectTitle: string;
  invoiceId: string;
  grandTotal: number;
  currency: string;
  description?: string;
  sendEmail: boolean;
  markAsPaid: boolean;
};

const InvoiceCreatePage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");

  const [form, setForm] = useState<InvoiceForm>({
    adminEmail: "",
    clientEmail: "",
    projectTitle: "",
    invoiceId: `INV-${Date.now().toString().slice(-6)}`,
    grandTotal: 0,
    currency: "$",
    description: "",
    sendEmail: true,
    markAsPaid: false,
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH CLIENTS
  ========================== */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("/clinets"); // tumi backend e client API add korte hobe
        setClients(res.data);
      } catch (err) {
        console.error("Failed to fetch clients");
      }
    };
    fetchClients();
  }, []);

  /* =========================
     FETCH PROJECTS ON CLIENT SELECT
  ========================== */
  useEffect(() => {
    if (!selectedClient) return;

    const client = clients.find((c) => c._id === selectedClient);
    if (client) setForm((prev) => ({ ...prev, clientEmail: client.email }));

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`/api/projects?clientId=${selectedClient}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  /* =========================
     SET PROJECT & MILESTONES
  ========================== */
  useEffect(() => {
    const project = projects.find((p) => p._id === selectedProject);
    if (!project) return;

    setForm((prev) => ({ ...prev, projectTitle: project.name }));

    if (project.milestones && project.milestones.length > 0) {
      setMilestones(project.milestones.filter((m) => m.status === "Unpaid"));
    } else {
      // fallback: use totalAmount if no milestones
      setForm((prev) => ({ ...prev, grandTotal: project.totalAmount - project.paidAmount }));
    }
  }, [selectedProject, projects]);

  /* =========================
     SET GRAND TOTAL ON MILESTONE SELECT
  ========================== */
  useEffect(() => {
    if (!selectedMilestone) return;
    const milestone = milestones.find((m) => m._id === selectedMilestone);
    if (!milestone) return;

    setForm((prev) => ({
      ...prev,
      grandTotal: milestone.amount,
      description: milestone.name,
    }));
  }, [selectedMilestone, milestones]);

  /* =========================
     HANDLERS
  ========================== */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !selectedProject || form.grandTotal <= 0) {
      alert("Please select client, project and milestone with valid amount");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ CREATE INVOICE
      const createRes = await axios.post("/api/invoices", form);

      // 2️⃣ SEND EMAIL IF REQUIRED
      if (form.sendEmail) {
        await axios.post("/api/invoices/send-email", { ...form, invoiceId: form.invoiceId });
      }

      alert("✅ Invoice Created Successfully!");
      // RESET FORM
      setSelectedClient("");
      setSelectedProject("");
      setSelectedMilestone("");
      setForm({
        adminEmail: "",
        clientEmail: "",
        projectTitle: "",
        invoiceId: `INV-${Date.now().toString().slice(-6)}`,
        grandTotal: 0,
        currency: "$",
        description: "",
        sendEmail: true,
        markAsPaid: false,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    }

    setLoading(false);
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6">Create New Invoice</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client */}
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>

          {/* Project */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full border rounded-lg p-3"
            disabled={!selectedClient}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* Milestone */}
          {milestones.length > 0 && (
            <select
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Milestone</option>
              {milestones.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} - ${m.amount.toFixed(2)}
                </option>
              ))}
            </select>
          )}

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            placeholder="Invoice Description"
          />

          {/* Final Amount */}
          <div className="bg-gray-100 p-4 rounded-xl font-semibold">
            Final Amount: ${form.grandTotal.toFixed(2)}
          </div>

          {/* Options */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="sendEmail"
              checked={form.sendEmail}
              onChange={handleChange}
            />
            <span>Send Email</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="markAsPaid"
              checked={form.markAsPaid}
              onChange={handleChange}
            />
            <span>Mark as Paid</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InvoiceCreatePage;