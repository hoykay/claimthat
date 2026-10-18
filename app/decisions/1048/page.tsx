"use client";

import Link from "next/link";
import { useClaimThatSettings } from "../../../data/useClaimThatSettings";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Box,
  CheckCircle2,
  ChevronRight,
  CircleX,
  DollarSign,
  FileImage,
  FileText,
  FolderOpen,
  Home,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

type DecisionState =
  | "recommended"
  | "approved"
  | "no-claim"
  | "human-review";

export default function DecisionPage() {
  const settings = useClaimThatSettings();
  const [analysis, setAnalysis] = useState<any>(null);

const [decision, setDecision] =
  useState<DecisionState>("recommended");

const [evolusAnswer, setEvolusAnswer] = useState("");
const [evolusLoading, setEvolusLoading] = useState(false);
const [evolusLive, setEvolusLive] = useState(false);

const evolusStarted = useRef(false);

/* Load the latest ClaimThat analysis first */
useEffect(() => {
  const savedAnalysis = localStorage.getItem(
    "claimthat:lastAnalysis"
  );

  if (!savedAnalysis) return;

  const parsed = JSON.parse(savedAnalysis);

  setAnalysis(parsed);

  if (parsed?.decision?.recommendation === "NO_CLAIM") {
    setDecision("no-claim");
  } else if (
    parsed?.decision?.recommendation === "HUMAN_REVIEW"
  ) {
    setDecision("human-review");
  } else {
    setDecision("recommended");
  }
}, []);

/* Then ask Evolus to review this exact case */
useEffect(() => {
  if (!analysis) return;
  if (evolusStarted.current) return;

  evolusStarted.current = true;

  async function loadEvolusReview() {
    try {
      setEvolusLoading(true);

      const shipment = analysis?.shipment;
      const claim = analysis?.claimCalculation;
      const amd = analysis?.amd;
      const currentDecision = analysis?.decision;

      const content = `
Shipment SHP-1048

Purchase order expected: ${shipment?.expectedUnits ?? 0} units
Invoice: ${shipment?.invoicedUnits ?? 0} units
Packing slip received: ${shipment?.receivedUnits ?? 0} units
Missing units: ${shipment?.missingUnits ?? 0}

Documented damaged cartons:
${claim?.documentedDamagedCartons ?? 0}

AMD visual damage detected:
${amd?.damage_detected ? "Yes" : "No"}

AMD confidence:
${Math.round((amd?.confidence ?? 0) * 100)}%

Calculated recoverable amount:
$${claim?.totalRecoverableAmount ?? 0}

ClaimThat recommendation:
${currentDecision?.recommendation ?? "Unknown"}

Review the evidence and recommend one of:
Claim
No Claim
Human Review

Explain the recommendation briefly.
Do not recalculate the claim amount.
      `.trim();

      const response = await fetch("/api/evolus-claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.ok || !data.answer) {
        throw new Error(
          data?.error ?? "Evolus review unavailable"
        );
      }

      setEvolusAnswer(data.answer);
      setEvolusLive(true);
    } catch {
      setEvolusAnswer(
        "Live Evolus review is temporarily unavailable. ClaimThat's deterministic decision remains available from the verified shipment evidence."
      );
      setEvolusLive(false);
    } finally {
      setEvolusLoading(false);
    }
  }

  loadEvolusReview();
}, [analysis]);
const shipment = analysis?.shipment;
const claimCalculation = analysis?.claimCalculation;
const amd = analysis?.amd;
const savedDecision = analysis?.decision;

  const statusConfig = {
    recommended: {
      title: "Claim Recommended",
      subtitle:
  `Strong evidence of damaged and missing units. A claim is recommended for $${claimCalculation?.totalRecoverableAmount?.toLocaleString() ?? "2,840"}.`,
      color: "red",
    },
    approved: {
      title: "Claim Approved",
      subtitle:
        "The recommendation has been approved. ClaimThat can now prepare the claim packet.",
      color: "green",
    },
    "no-claim": {
      title: "No Claim",
      subtitle:
        "The AI recommendation was overridden. This shipment will not proceed to a claim.",
      color: "slate",
    },
    "human-review": {
      title: "Human Review Requested",
      subtitle:
        "This shipment has been escalated for manual review before a final decision is made.",
      color: "orange",
    },
  };

  const current = statusConfig[decision];
  

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-slate-200 bg-white">
        <div className="flex h-[74px] items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Box size={22} strokeWidth={2.3} />
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight">
              ClaimThat
            </div>
            <div className="text-[11px] text-slate-400">
              Know when to claim.
            </div>
          </div>
        </div>

        <nav className="space-y-1.5 px-3 py-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Home size={19} />
            Dashboard
          </Link>

          <Link
            href="/new-inspection"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <PlusCircle size={19} />
            New Inspection
          </Link>

          <Link
            href="/cases/1048"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <FolderOpen size={19} />
            Cases
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
            <CheckCircle2 size={19} />
            Decisions
          </div>

          <Link
  href="/claims/1048"
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
>
  <FileText size={19} />
  Claim Packets
</Link>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Settings size={19} />
            Settings
          </button>
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

      <div className="ml-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="flex h-11 w-[560px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Search size={18} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search cases, shipments, PO numbers..."
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell size={19} className="text-slate-500" />

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
    <div className="text-sm font-semibold">
      {settings.fullName}
    </div>
    <div className="text-xs text-slate-400">
      {settings.companyName}
    </div>
  </div>
</div>
          </div>
        </header>

        <main className="p-6">
          {/* Heading */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <Link
                href="/cases/1048"
                className="mb-2 inline-block text-sm text-slate-400 hover:text-blue-600"
              >
                ← Back to Case
              </Link>

              <h1 className="text-3xl font-bold tracking-tight">
                Shipment SHP-1048
              </h1>

              <div className="mt-2 flex gap-3 text-sm text-slate-500">
                <span>BOL: 78493201</span>
                <span>·</span>
                <span>PO: PO-55871</span>
                <span>·</span>
                <span>Carrier: XPO Logistics</span>
                <span>·</span>
                <span>Received: Apr 12, 2026</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={17}
                  className="text-blue-600"
                />
                <div>
                  <p className="text-xs font-semibold">
                    AI Analysis Complete
                  </p>
                  <p className="text-xs text-slate-400">
                    Apr 14, 2026, 2:34 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_380px] gap-5">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Decision Banner */}
              <section
                className={`rounded-2xl border p-5 ${
                  current.color === "red"
                    ? "border-red-200 bg-red-50"
                    : current.color === "green"
                    ? "border-emerald-200 bg-emerald-50"
                    : current.color === "orange"
                    ? "border-orange-200 bg-orange-50"
                    : "border-slate-200 bg-slate-100"
                }`}
              >
                <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        current.color === "red"
                          ? "bg-red-100 text-red-600"
                          : current.color === "green"
                          ? "bg-emerald-100 text-emerald-600"
                          : current.color === "orange"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {decision === "approved" ? (
                        <CheckCircle2 size={28} />
                      ) : decision === "no-claim" ? (
                        <CircleX size={28} />
                      ) : decision === "human-review" ? (
                        <Users size={28} />
                      ) : (
                        <AlertTriangle size={28} />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Recommended Decision
                      </p>

                      <h2 className="mt-1 text-3xl font-bold">
                        {current.title}
                      </h2>

                      <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500">
                        {current.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="border-l border-slate-200 pl-5">
                    <p className="text-2xl font-bold">
                      {`$${claimCalculation?.totalRecoverableAmount?.toLocaleString() ?? "2,840"}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      Recoverable value
                    </p>
                  </div>

                  <div className="border-l border-slate-200 pl-5">
                    <p className="text-2xl font-bold">{`${Math.round((amd?.confidence ?? 0.96) * 100)}%`}</p>
                    <p className="text-xs text-slate-500">
                      Confidence
                    </p>
                  </div>

                  <div className="border-l border-slate-200 pl-5">
                    <p className="text-2xl font-bold">
  {`${claimCalculation?.daysLeft ?? 6} days left`}
</p>
                    <p className="text-xs text-slate-500">
                      to file claim
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-red-500">
  {claimCalculation?.claimDeadline
    ? new Date(
        `${claimCalculation.claimDeadline}T00:00:00Z`
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      })
    : "Apr 20, 2026"}
</p>
                    <p className="mt-1 text-[11px] font-medium text-blue-600">
  {amd?.source === "live"
    ? "AMD analysis • Live"
    : "AMD analysis • Cached verified result"}
</p>
                  </div>
                </div>
              </section>

              {/* AI Reasoning */}
<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="mb-4 flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      <FileText size={20} />
    </div>

    <div>
      <h2 className="text-lg font-semibold">
        AI Reasoning
      </h2>

      <p className="text-sm text-slate-400">
        Key factors supporting the recommendation.
      </p>
    </div>
  </div>

  {/* Evolus live review */}
  <div className="mb-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
            E
          </div>

          <div>
            <div className="font-semibold text-slate-900">
              Evolus Agent Review
            </div>

            <div className="text-xs text-slate-500">
              AMD DeepSeek-V4.1-Flash
            </div>
          </div>
        </div>
      </div>

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
          evolusLoading
            ? "bg-amber-100 text-amber-700"
            : evolusLive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
        }`}
      >
        {evolusLoading
          ? "Analyzing..."
          : evolusLive
            ? "Live"
            : "Fallback"}
      </span>
    </div>

    {evolusLoading ? (
      <div className="mt-4 flex items-center gap-3 text-sm text-violet-700">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-500" />
        Evolus is reviewing shipment evidence...
      </div>
    ) : (
      <div className="mt-4 max-h-64 overflow-y-auto rounded-lg bg-white/70 p-3">
        <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
          {evolusAnswer
  .replace(/^#{1,6}\s*/gm, "")
  .replaceAll("**", "")}
        </p>
      </div>
    )}
  </div>

  {/* Deterministic evidence */}
  <div className="space-y-2">
    {[
      {
        number: 1,
        title:
  (claimCalculation?.documentedDamagedCartons ?? 0) > 0
    ? "Damaged cartons documented"
    : amd?.damage_detected
      ? "Possible shipment damage detected"
      : "No documented shipment damage",

body:
  (claimCalculation?.documentedDamagedCartons ?? 0) > 0
    ? `${claimCalculation?.documentedDamagedCartons ?? 0} damaged cartons were recorded in the shipment documents.`
    : amd?.damage_detected
      ? "The shipment photo shows possible damage, but the receiving documents recorded no damage."
      : "No damage was supported by the uploaded evidence.",
      },
      {
        number: 2,
        title: "Quantity mismatch",
        body: `Received ${
          shipment?.receivedUnits ?? 288
        } units vs. ${
          shipment?.expectedUnits ?? 320
        } units expected — ${
          shipment?.missingUnits ?? 32
        } units missing.`,
      },
      {
        number: 3,
        title: "Supporting evidence confirmed",
        body:
          amd?.description ??
          "AMD visual analysis confirms visible shipment damage.",
      },
    ].map((item) => (
      <div
        key={item.number}
        className="flex items-center gap-4 rounded-xl border border-slate-100 p-4"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
          {item.number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-900">
            {item.title}
          </div>

          <div className="mt-1 text-sm text-slate-500">
            {item.body}
          </div>
        </div>

        <span className="text-lg text-slate-300">
          ›
        </span>
      </div>
    ))}
  </div>
</section>

{/* AMD Runtime Proof */}
<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Sparkles size={20} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          AMD Runtime Proof
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Live model evidence used for shipment verification.
        </p>
      </div>
    </div>

    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        amd?.source === "live"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {amd?.source === "live" ? "Live AMD API" : "Cached verified fallback"}
    </span>
  </div>

  <div className="mt-5 grid grid-cols-4 gap-3">
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Model
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        {amd?.model ?? "DeepSeek-V4.1-Flash"}
      </div>
    </div>

    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Confidence
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        {`${Math.round((amd?.confidence ?? 0.98) * 100)}%`}
      </div>
    </div>

    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Latency
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        {amd?.latencyMs != null
          ? `${amd.latencyMs.toLocaleString()} ms`
          : "N/A · cached"}
      </div>
    </div>

    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        Role
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        Visual evidence verification
      </div>
    </div>
  </div>

  <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">
    AMD handles visual shipment verification. Quantity matching and claim
    calculations remain deterministic inside ClaimThat.
  </div>
</section>

{/* Resolution Workflow */}
<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-slate-900">
      ClaimThat Resolution Workflow
    </h2>

    <p className="mt-1 text-sm text-slate-400">
      From shipment evidence to a claim-ready decision.
    </p>
  </div>

  <div className="grid grid-cols-5 gap-2">
    {[
      {
        step: "1",
        title: "Extract",
        detail: "Evolus document extractor",
        status: "Validated",
        statusClass: "bg-emerald-50 text-emerald-700",
      },
      {
        step: "2",
        title: "Match",
        detail: "4-way quantity check",
        status: "Complete",
        statusClass: "bg-emerald-50 text-emerald-700",
      },
      {
        step: "3",
        title: "Verify",
        detail: "AMD visual evidence",
        status: amd?.source === "live" ? "Live" : "Verified",
        statusClass:
          amd?.source === "live"
            ? "bg-blue-50 text-blue-700"
            : "bg-emerald-50 text-emerald-700",
      },
      {
        step: "4",
        title: "Decide",
        detail: "Evolus Claims Agent",
        status: evolusLoading
          ? "Analyzing"
          : evolusLive
            ? "Live"
            : "Fallback",
        statusClass: evolusLoading
          ? "bg-amber-50 text-amber-700"
          : evolusLive
            ? "bg-violet-50 text-violet-700"
            : "bg-slate-100 text-slate-500",
      },
      {
        step: "5",
        title: "Resolve",
        detail: "Claim packet ready",
        status: "Ready",
        statusClass: "bg-emerald-50 text-emerald-700",
      },
    ].map((item) => (
      <div
        key={item.step}
        className="rounded-xl border border-slate-100 bg-slate-50 p-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-600 shadow-sm">
            {item.step}
          </div>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.statusClass}`}
          >
            {item.status}
          </span>
        </div>

        <div className="mt-3 text-sm font-semibold text-slate-900">
          {item.title}
        </div>

        <div className="mt-1 text-xs leading-4 text-slate-500">
          {item.detail}
        </div>
      </div>
    ))}
  </div>

  <div className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
    <span className="font-semibold">Powered by:</span>
    Evolus orchestration + AMD-hosted DeepSeek-V4.1-Flash + deterministic ClaimThat logic
  </div>
</section>

              {/* Key Evidence */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileImage
                      size={21}
                      className="text-blue-600"
                    />

                    <div>
                      <h2 className="font-semibold">
                        Key Evidence
                      </h2>
                      <p className="text-xs text-slate-400">
                        AI analyzed 5 photos and 4 documents.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/cases/1048"
                    className="text-sm font-semibold text-blue-600"
                  >
                    View All Evidence →
                  </Link>
                </div>

                <div className="grid grid-cols-6 gap-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="overflow-hidden rounded-xl border border-slate-200"
                    >
                      <img
                        src="/shipment.jpg"
                        alt="Shipment evidence"
                        className="aspect-square h-full w-full object-cover"
                      />

                      <div className="-mt-8 relative bg-slate-950/70 px-2 py-2 text-center text-[10px] font-medium text-white">
                        {item === 1
                          ? "Damage · Carton #3"
                          : item === 2
                          ? "Damage · Top Right"
                          : "Damaged Packaging"}
                      </div>
                    </div>
                  ))}

                  {[
                    ["PO-55871.pdf", "Purchase Order"],
                    ["INV-77102.pdf", "Invoice"],
                    ["PS-44891.pdf", "Packing Slip"],
                  ].map((document) => (
                    <div
                      key={document[0]}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FileText size={19} />
                      </div>

                      <p className="mt-3 truncate text-xs font-semibold">
                        {document[0]}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {document[1]}
                      </p>

                      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 size={11} />
                        Analyzed
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="space-y-5">
              {/* Actions */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Actions
                    </h2>
                    <p className="text-xs text-slate-400">
                      Review the recommendation and take the next step.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {decision !== "human-review" && (
  <>
    <button
      onClick={() => setDecision("approved")}
      className={`w-full rounded-xl border p-4 text-left transition ${
        decision === "approved"
          ? "border-emerald-400 bg-emerald-50"
          : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 size={21} />
          <span className="font-semibold">
            Approve Claim
          </span>
        </div>

        <ChevronRight size={18} />
      </div>
    </button>

    <p className="px-1 text-xs leading-5 text-slate-400">
      {`Proceed with a claim for $${claimCalculation?.totalRecoverableAmount?.toLocaleString() ?? "2,840"} and generate a claim packet.`}
    </p>
  </>
)}
                

                  <button
                    onClick={() =>
                      setDecision("no-claim")
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      decision === "no-claim"
                        ? "border-slate-500 bg-slate-100"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CircleX
                          size={21}
                          className="text-red-500"
                        />
                        <span className="font-semibold">
                          Override to No Claim
                        </span>
                      </div>

                      <ChevronRight size={18} />
                    </div>
                  </button>

                  <p className="px-1 text-xs leading-5 text-slate-400">
                    Mark this shipment as no claim with a manual
                    reason.
                  </p>

                  <button
                    onClick={() =>
                      setDecision("human-review")
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      decision === "human-review"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users
                          size={21}
                          className="text-blue-600"
                        />
                        <span className="font-semibold">
                          Escalate to Human Review
                        </span>
                      </div>

                      <ChevronRight size={18} />
                    </div>
                  </button>

                  <p className="px-1 text-xs leading-5 text-slate-400">
                    Send the case to a claims specialist for manual
                    review.
                  </p>
                </div>

                {decision === "approved" && (
                  <Link
                    href="/claims/1048"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Generate Claim Packet
                    <ChevronRight size={17} />
                  </Link>
                )}
              </section>

              {/* Claim Calculation */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <DollarSign size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Claim Calculation
                    </h2>
                    <p className="text-xs text-slate-400">
                      Estimated recoverable value.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
  <div className="flex justify-between">
    <span className="text-slate-500">
      Missing units
      <span className="text-xs">
        {" "}
        ({shipment?.missingUnits ?? 0} × $
        {Number(shipment?.unitPrice ?? 0).toFixed(2)})
      </span>
    </span>

    <span className="font-semibold">
      ${Number(
        claimCalculation?.missingValue ?? 0
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  </div>

  <div className="flex justify-between">
    <span className="text-slate-500">
      Damaged goods
      <span className="text-xs">
        {" "}
        ({claimCalculation?.documentedDamagedCartons ?? 0} documented)
      </span>
    </span>

    <span className="font-semibold">
      ${Number(
        claimCalculation?.damagedGoodsValue ?? 0
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  </div>

  <div className="border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        Total estimated claim value
                      </span>
                      {`$${Number(
  claimCalculation?.totalRecoverableAmount ?? 2840
).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`}
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-slate-500">
                  Based on unit prices from PO-55871. Final claim
                  amount may vary.
                </div>
              </section>

              {/* Trust panel */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    size={22}
                    className="text-blue-600"
                  />

                  <div>
                    <h3 className="font-semibold">
                      Human remains in control
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      ClaimThat provides a recommendation. Operators
                      can approve, override, or request human review.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}