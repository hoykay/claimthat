"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useClaimThatSettings } from "../../../data/useClaimThatSettings";
import {
  AlertTriangle,
  Bell,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  FileImage,
  FileText,
  FolderOpen,
  Home,
  Link2,
  MoreVertical,
  PlusCircle,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const findings = [
  {
    id: 1,
    title: "Damaged cartons",
    description: "Visible impact damage consistent across shipment photos.",
    confidence: "High",
  },
  {
    id: 2,
    title: "Missing units",
    description: "Expected 320 units, received 288 units.",
    confidence: "High",
  },
  {
    id: 3,
    title: "Document discrepancy",
    description: "Packing slip shows 288 units vs. 320 on PO and invoice.",
    confidence: "Medium",
  },
];

const documents = [
  {
    type: "Purchase Order",
    name: "PO-55871.pdf",
    party: "ACME Industrial",
    units: "320",
    status: "Matched",
    evidence: "—",
  },
  {
    type: "Invoice",
    name: "INV-77102.pdf",
    party: "ACME Industrial",
    units: "320",
    status: "Matched",
    evidence: "—",
  },
  {
    type: "Packing Slip",
    name: "PS-44891.pdf",
    party: "XPO Logistics",
    units: "288",
    status: "Discrepancy",
    evidence: "Photo 1, 2",
  },
  {
    type: "Bill of Lading",
    name: "BOL-78493201.pdf",
    party: "XPO Logistics",
    units: "288",
    status: "Matched",
    evidence: "—",
  },
];

export default function CaseDetailPage() {
  const settings = useClaimThatSettings();
  const [selectedFinding, setSelectedFinding] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
useEffect(() => {
  const savedAnalysis = localStorage.getItem("claimthat:lastAnalysis");

  if (savedAnalysis) {
    setAnalysis(JSON.parse(savedAnalysis));
  }
}, []);

const shipment = analysis?.shipment;
const matching = analysis?.matching;
const claimCalculation = analysis?.claimCalculation;
const amd = analysis?.amd;
const decision = analysis?.decision;
const displayFindings = findings.map((finding) => {
  if (finding.id === 1) {
    return {
      ...finding,
      title:
  (claimCalculation?.documentedDamagedCartons ?? 0) > 0
    ? `${claimCalculation?.documentedDamagedCartons ?? 0} cartons damaged`
    : "Possible shipment damage detected",
    };
  }

  if (finding.id === 2) {
    return {
      ...finding,
      title: `${shipment?.missingUnits ?? 32} units missing`,
      description: `Expected ${shipment?.expectedUnits ?? 320} units, received ${shipment?.receivedUnits ?? 288} units.`,
    };
  }

  return finding;
});
const matchedChecks = analysis
  ? [
      true,
      matching?.poVsInvoice === "MATCH",
      matching?.poVsReceived === "MATCH",
      amd?.damage_detected !== true,
    ].filter(Boolean).length
  : 3;
const boundingBox = amd?.bounding_box ?? [610, 115, 945, 610];

const [x1, y1, x2, y2] = boundingBox;

const boxStyle = {
  left: `${x1 / 10}%`,
  top: `${y1 / 10}%`,
  width: `${(x2 - x1) / 10}%`,
  height: `${(y2 - y1) / 10}%`,
};

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-slate-200 bg-white">
        <div className="flex h-[74px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
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
    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
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

  <div className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
    <FolderOpen size={19} />
    Cases
  </div>

  <Link
    href="/decisions/1048"
    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
  >
    <CheckCircle2 size={19} />
    Decisions
  </Link>

  <Link
    href="/claims/1048"
    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
  >
    <FileText size={19} />
    Claim Packets
  </Link>

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
            <div className="mt-1 text-2xl font-black">AMD</div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              AI-powered shipment evidence and claim decisions.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[240px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="flex h-11 w-[560px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Search size={18} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search cases, shipments, PO numbers..."
            />
          </div>

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

<div>
  <div className="text-sm font-semibold">{settings.fullName}</div>
  <div className="text-xs text-slate-400">{settings.companyName}</div>
</div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Case title */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <Link
                href="/"
                className="mb-2 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-blue-600"
              >
                <ChevronLeft size={15} />
                Back to Cases
              </Link>

              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  Shipment SHP-1048
                </h1>

                <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600">
                  <AlertTriangle size={15} />
                  Claim Recommended
                </span>
              </div>

              <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                <span>BOL: 78493201</span>
                <span className="text-slate-300">|</span>
                <span>PO: PO-55871</span>
                <span className="text-slate-300">|</span>
                <span>Carrier: XPO Logistics</span>
                <span className="text-slate-300">|</span>
                <span>Received: Apr 12, 2026</span>
                <span className="text-slate-300">|</span>
                <span>Supplier: ACME Industrial</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
                <MoreVertical size={18} />
              </button>

              <button
  type="button"
  onClick={() => {
    window.location.href = "/decisions/1048";
  }}
  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
>
  Review Decision
</button>
              <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
                <Send size={17} />
                Send to Carrier
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_minmax(500px,1.18fr)] gap-5">
            {/* LEFT — photo evidence */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileImage size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Photo Evidence{" "}
                      <span className="font-normal text-slate-400">
                        (1 of 5)
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Click a finding to highlight linked evidence.
                    </p>
                  </div>
                </div>

                <button className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600">
                  View Fullscreen
                </button>
              </div>

              {/* Main evidence image */}
              <div className="relative overflow-hidden rounded-xl bg-slate-100">
                <img
                  src="/shipment.jpg"
                  alt="Shipment evidence"
                  className="aspect-[4/3] w-full object-cover"
                />

                {/* Damage box */}
                {selectedFinding === 1 && (
                  <>
                    <div
                      className="absolute border-[4px] border-red-500 shadow-[0_0_0_2px_rgba(255,255,255,0.45),0_0_24px_rgba(239,68,68,0.45)]"
                      style={boxStyle}
                    />

                    <div
                      className="absolute flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 font-bold text-white shadow"
                      style={{
  left: `${x1 / 10}%`,
  top: `${y1 / 10}%`,
}}
                    >
                      1
                    </div>

                    <div
                      className="absolute flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white shadow-lg"
                      style={{ right: "5%", top: "8%" }}
                    >
                      <Link2 size={14} />
                      Evidence linked
                    </div>
                  </>
                )}

                {selectedFinding === 2 && (
                  <div className="absolute bottom-4 left-4 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-lg">
                    Quantity mismatch linked to packing slip
                  </div>
                )}

                {selectedFinding === 3 && (
                  <div className="absolute bottom-4 left-4 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg">
                    Document discrepancy linked
                  </div>
                )}
              </div>

              {/* thumbnails */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[
                  "Damaged carton",
                  "Close-up damage",
                  "Side pallet view",
                  "Product label",
                  "Full pallet view",
                ].map((label, index) => (
                  <button
                    key={label}
                    className={`overflow-hidden rounded-xl border bg-white text-left ${
                      index === 0 && selectedFinding === 1
                        ? "border-2 border-red-500"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src="/shipment.jpg"
                        alt={label}
                        className={`h-full w-full object-cover ${
                          index === 0 ? "object-[80%_20%]" : ""
                        }`}
                      />

                      <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950/75 text-xs font-bold text-white">
                        {index + 1}
                      </div>
                    </div>

                    <div className="p-2">
                      <p className="text-[11px] font-medium leading-4 text-slate-600">
                        {label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* RIGHT */}
            <div className="space-y-4">
              {/* Claim banner */}
              <section className="rounded-2xl border border-red-200 bg-red-50/70 p-5">
                <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <AlertTriangle size={28} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-red-500">
                        AI Analysis Complete
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-red-600">
  {decision?.recommendation === "CLAIM"
    ? "CLAIM RECOMMENDED"
    : decision?.recommendation === "NO_CLAIM"
    ? "NO CLAIM"
    : decision?.recommendation === "HUMAN_REVIEW"
    ? "HUMAN REVIEW"
    : "CLAIM RECOMMENDED"}
</h2>

                      <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
  {decision?.reason ??
    "Strong evidence of missing units and damaged cartons based on document comparison and photo analysis."}
</p>
                    </div>
                  </div>

                  <div className="border-l border-red-200 pl-5">
                    <p className="text-2xl font-bold">${claimCalculation?.totalRecoverableAmount?.toLocaleString() ?? "2,840"}</p>
                    <p className="text-xs text-slate-500">recoverable value</p>
                  </div>

                  <div className="border-l border-red-200 pl-5">
                    <p className="text-2xl font-bold">
  {`${Math.round((amd?.confidence ?? 0.96) * 100)}%`}
</p>
                    <p className="text-xs text-slate-500">confidence</p>
                  </div>

                  <div className="border-l border-red-200 pl-5">
                    <p className="text-2xl font-bold">
  {`${claimCalculation?.daysLeft ?? 6} days left`}
</p>
                    <p className="text-xs text-slate-500">to file claim</p>
                    <p className="mt-1 text-xs font-semibold text-red-500">
                      {claimCalculation?.claimDeadline
  ? new Date(`${claimCalculation.claimDeadline}T00:00:00Z`).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }
    )
  : "Apr 20, 2026"}
                    </p>
                  </div>
                </div>
              </section>

              {/* 4-way match */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">4-Way Match</h3>
                    <p className="text-xs text-slate-400">
                      AI compares key documents and photos to find discrepancies.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <CircleCheck size={17} className="text-emerald-500" />
                    {`${matchedChecks} of 4 checks matched`}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
  [
    "Purchase Order",
    shipment?.poNumber ?? "PO-55871",
    `Expected: ${shipment?.expectedUnits ?? 320} units`,
    true,
  ],
  [
    "Invoice",
    "INV-77102",
    `Invoiced: ${shipment?.invoicedUnits ?? 320} units`,
    matching?.poVsInvoice === "MATCH",
  ],
  [
    "Packing Slip",
    "PS-44891",
    `Received: ${shipment?.receivedUnits ?? 288} units`,
    matching?.poVsReceived === "MATCH",
  ],
  [
    "Photo Evidence",
    "1 photo",
    amd?.damage_detected
      ? "Visible damage detected"
      : "No visible damage detected",
    amd?.damage_detected !== true,
  ],

                  ].map((item) => (
                    <div
                      key={item[0] as string}
                      className={`rounded-xl border p-3 ${
                        item[3]
                          ? "border-slate-200"
                          : "border-red-200 bg-red-50/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-semibold">{item[0]}</p>

                        {item[3] ? (
                          <CheckCircle2
                            size={16}
                            className="text-emerald-500"
                          />
                        ) : (
                          <AlertTriangle
                            size={16}
                            className="text-red-500"
                          />
                        )}
                      </div>

                      <p className="mt-3 text-sm font-bold">{item[1]}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {item[2]}
                      </p>

                      <button className="mt-3 w-full rounded-lg border border-blue-200 py-1.5 text-[11px] font-semibold text-blue-600">
                        {item[0] === "Photo Evidence"
                          ? "View Photos"
                          : "View Document"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-[1fr_170px] gap-4">
                {/* Findings */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">Findings (3)</h3>
                    <span className="text-xs text-blue-600">
                      How findings are generated
                    </span>
                  </div>

                  <div className="space-y-2">
                    {displayFindings.map((finding) => {
  const selected = selectedFinding === finding.id;

  return (
                        <button
                          key={finding.id}
                          onClick={() => setSelectedFinding(finding.id)}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                            selected
                              ? "border-red-300 bg-red-50"
                              : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                selected
                                  ? "bg-red-500 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {finding.id}
                            </div>

                            <div>
                              <p className="text-sm font-semibold">
                                {finding.title}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-400">
                                {finding.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              size={14}
                              className={
                                finding.confidence === "High"
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                              }
                            />
                            <span className="text-xs font-medium text-slate-500">
                              {finding.confidence}
                            </span>
                            <ChevronRight size={15} className="text-slate-400" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Confidence */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <div className="flex items-center gap-2 text-left">
                    <ShieldCheck size={18} className="text-blue-600" />
                    <p className="text-sm font-semibold">Confidence</p>
                  </div>

                  <div className="mx-auto mt-5 flex h-24 w-24 items-center justify-center rounded-full border-[9px] border-blue-100 border-t-blue-600">
                    <div>
                      <p className="text-2xl font-bold">
  {`${Math.round((amd?.confidence ?? 0.96) * 100)}%`}
</p>
                      <p className="text-[10px] text-slate-400">
                        AI confidence
                      </p>
                    </div>
                  </div>

                  <button className="mt-5 w-full rounded-lg border border-blue-200 py-2 text-xs font-semibold text-blue-600">
                    Request Human Review
                  </button>
                </section>
              </div>

              {/* Related documents */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3">
                  <h3 className="font-semibold">Related Documents (4)</h3>
                  <p className="text-xs text-slate-400">
                    Linked evidence highlights when you select a finding.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400">
                      <tr>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Document Name</th>
                        <th className="px-3 py-2">Key Details</th>
                        <th className="px-3 py-2">Units</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Linked Evidence</th>
                      </tr>
                    </thead>

                    <tbody>
                      {documents.map((document) => {
                        const linked =
  selectedFinding !== null &&
  document.type === "Packing Slip";

                        return (
                          <tr
                            key={document.name}
                            className={`border-t border-slate-100 ${
                              linked ? "bg-red-50" : ""
                            }`}
                          >
                            <td
                              className={`px-3 py-2 font-medium ${
                                linked ? "text-red-600" : ""
                              }`}
                            >
                              {document.type}
                            </td>
                            <td className="px-3 py-2 text-blue-600">
                              {document.name}
                            </td>
                            <td className="px-3 py-2">{document.party}</td>
                            <td className="px-3 py-2">{document.units}</td>

                            <td className="px-3 py-2">
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                                  document.status === "Matched"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {document.status}
                              </span>
                            </td>

                            <td
                              className={`px-3 py-2 ${
                                linked
                                  ? "font-semibold text-red-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {linked ? (
                                <span className="inline-flex items-center gap-1">
                                  <Link2 size={12} />
                                  {document.evidence}
                                </span>
                              ) : (
                                document.evidence
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}