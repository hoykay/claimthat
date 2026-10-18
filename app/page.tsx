"use client";

import Link from "next/link";
import GlobalSearch from "@/components/GlobalSearch";
import { useClaimThatSettings } from "../data/useClaimThatSettings";

import {
  AlertTriangle,
  Bell,
  Box,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  DollarSign,
  FileText,
  FolderOpen,
  Home,
  MoreVertical,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";

const shipments = [
  {
    id: "SHP-1048",
    po: "PO-55871",
    supplier: "ACME Industrial",
    carrier: "XPO Logistics",
    received: "Apr 12, 2026",
    time: "8:14 AM",
    status: "Claim Recommended",
    risk: "$2,840",
    deadline: "6 days",
    deadlineDate: "Apr 18, 2026",
  },
  {
    id: "SHP-1049",
    po: "PO-66230",
    supplier: "Metro Supply Co.",
    carrier: "FedEx Freight",
    received: "Apr 12, 2026",
    time: "9:03 AM",
    status: "Human Review",
    risk: "$1,260",
    deadline: "4 days",
    deadlineDate: "Apr 16, 2026",
  },
  {
    id: "SHP-1050",
    po: "PO-77102",
    supplier: "Global Parts Inc.",
    carrier: "Old Dominion",
    received: "Apr 12, 2026",
    time: "9:47 AM",
    status: "Inspecting",
    risk: "$0",
    deadline: "8 days",
    deadlineDate: "Apr 20, 2026",
  },
  {
    id: "SHP-1051",
    po: "PO-44891",
    supplier: "BuildRight Co.",
    carrier: "Saia LTL",
    received: "Apr 12, 2026",
    time: "10:22 AM",
    status: "No Claim",
    risk: "$0",
    deadline: "—",
    deadlineDate: "",
  },
  {
    id: "SHP-1052",
    po: "PO-99321",
    supplier: "Summit Hardware",
    carrier: "XPO Logistics",
    received: "Apr 12, 2026",
    time: "11:05 AM",
    status: "Claim Recommended",
    risk: "$4,126",
    deadline: "3 days",
    deadlineDate: "Apr 15, 2026",
  },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "Claim Recommended") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <AlertTriangle size={14} />
        Claim Recommended
      </span>
    );
  }

  if (status === "Human Review") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600">
        <AlertTriangle size={14} />
        Human Review
      </span>
    );
  }

  if (status === "No Claim") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
        <CheckCircle2 size={14} />
        No Claim
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
      <CircleDot size={14} />
      Inspecting
    </span>
  );
}

export default function HomePage() {
  const settings = useClaimThatSettings();
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[240px] flex-col border-r border-slate-200 bg-white">
        <div className="flex h-[74px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Box size={22} strokeWidth={2.3} />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">ClaimThat</div>
            <div className="text-[11px] text-slate-400">
              Know when to claim.
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 px-3 py-5">
  <Link
    href="/"
    className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
  >
    <Home size={19} />
    Dashboard
  </Link>

  <Link
    href="/new-inspection"
    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
  >
    <PlusCircle size={19} />
    New Inspection
  </Link>

  <Link
    href="/cases/1048"
    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
  >
    <FolderOpen size={19} />
    Cases
  </Link>

  <button
    type="button"
    disabled
    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300"
  >
    <CheckCircle2 size={19} />
    Decisions
  </button>

  <button
    type="button"
    disabled
    className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300"
  >
    <FileText size={19} />
    Claim Packets
  </button>

  <div className="my-3 border-t border-slate-100" />

  <Link
    href="/settings"
    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
  >
    <Settings size={19} />
    Settings
  </Link>
</nav>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-medium text-slate-400">
              POWERED BY
            </div>
            <div className="mt-1 text-2xl font-black tracking-tight">AMD</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              AI-powered shipment evidence and claim decisions.
            </p>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="ml-[240px]">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <GlobalSearch />

          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100">
              <Bell size={19} />
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
    {settings.fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()}
  </div>

  <div className="leading-tight">
    <div className="text-sm font-semibold">{settings.fullName}</div>
    <div className="text-xs text-slate-400">{settings.companyName}</div>
  </div>
</div>
          </div>
        </header>

        <main className="p-6">
          <div className="mb-6">
            <p className="mb-1 text-sm text-slate-400">
  Welcome back, {settings.fullName.split(" ")[0]}
</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Shipment Queue
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor incoming shipments, inspection status, and potential
              claims.
            </p>
          </div>

          {/* KPI cards */}
          <section className="grid grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Value at Risk</p>
                  <p className="mt-2 text-2xl font-bold">$142,360</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign size={22} />
                </div>
              </div>
              <p className="mt-3 text-xs font-medium text-red-500">
                ↑ 28% <span className="font-normal text-slate-400">vs. last week</span>
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Claim Recommended</p>
                  <p className="mt-2 text-2xl font-bold">12</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <AlertTriangle size={22} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                12 of 48 open shipments
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Human Review</p>
                  <p className="mt-2 text-2xl font-bold">8</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Users size={22} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Require manual review
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Deadlines This Week</p>
                  <p className="mt-2 text-2xl font-bold">12</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={22} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Upcoming claim deadlines
              </p>
            </div>
          </section>

          <div className="mt-5 grid grid-cols-[1fr_300px] gap-5">
            {/* Table */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="font-semibold">Incoming Shipments</h2>
                  <p className="text-xs text-slate-400">
                    24 shipments currently being monitored
                  </p>
                </div>

                <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  + New Inspection
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-medium text-slate-400">
                      <th className="px-5 py-3">Shipment</th>
                      <th className="px-4 py-3">Supplier</th>
                      <th className="px-4 py-3">Carrier</th>
                      <th className="px-4 py-3">Received</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Amount at Risk</th>
                      <th className="px-4 py-3">Deadline</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>

                  <tbody>
                    {shipments.map((shipment) => (
                      <tr
                        key={shipment.id}
                        className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/60"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-blue-600">
                            {shipment.id}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {shipment.po}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-700">
                          {shipment.supplier}
                        </td>

                        <td className="px-4 py-4 text-sm text-slate-500">
                          {shipment.carrier}
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-600">
                            {shipment.received}
                          </p>
                          <p className="text-xs text-slate-400">
                            {shipment.time}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={shipment.status} />
                        </td>

                        <td className="px-4 py-4 text-sm font-semibold">
                          {shipment.risk}
                        </td>

                        <td className="px-4 py-4">
                          <p
                            className={`text-sm font-semibold ${
                              shipment.deadline !== "—"
                                ? "text-red-500"
                                : "text-slate-400"
                            }`}
                          >
                            {shipment.deadline}
                          </p>
                          <p className="text-xs text-slate-400">
                            {shipment.deadlineDate}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <a href="/cases/1048" className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-50">
                              Open Case
                              <ChevronRight size={14} />
                            </a>

                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Right panel */}
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Value at Risk</h3>
                  <span className="text-xs font-medium text-blue-600">
                    Last 7 days
                  </span>
                </div>

                <div className="mt-4 text-3xl font-bold">$142,360</div>
                <p className="mt-1 text-xs text-slate-400">
                  Total recoverable value at risk
                </p>

                <div className="mt-6 flex h-28 items-end gap-2">
                  {[42, 51, 58, 67, 73, 86, 96].map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md ${
                        i === 6 ? "bg-blue-600" : "bg-blue-100"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                  <span>Apr 6</span>
                  <span>Apr 12</span>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Upcoming Deadlines</h3>
                  <span className="text-xs font-medium text-blue-600">
                    View all
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {[
                    ["SHP-1052", "Summit Hardware", "$4,126", "Apr 15"],
                    ["SHP-1049", "Metro Supply Co.", "$1,260", "Apr 16"],
                    ["SHP-1055", "Omega Electrical", "$1,740", "Apr 17"],
                    ["SHP-1048", "ACME Industrial", "$2,840", "Apr 18"],
                  ].map((item) => (
                    <div
                      key={item[0]}
                      className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="text-sm font-semibold">{item[0]}</div>
                        <div className="text-xs text-slate-400">
                          {item[1]} · {item[2]}
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-red-500">
                        {item[3]}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}