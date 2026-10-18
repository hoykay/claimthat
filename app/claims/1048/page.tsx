"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import GlobalSearch from "@/components/GlobalSearch";
import { useClaimThatSettings } from "../../../data/useClaimThatSettings";
import Link from "next/link";
import {
  Bell,
  Box,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  FileImage,
  FileText,
  FolderOpen,
  Home,
  Mail,
  MoreVertical,
  Paperclip,
  Pencil,
  PlusCircle,
  Send,
  Settings,
} from "lucide-react";

export default function ClaimPacketPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const settings = useClaimThatSettings();

useEffect(() => {
  const savedAnalysis = localStorage.getItem("claimthat:lastAnalysis");

  if (savedAnalysis) {
    setAnalysis(JSON.parse(savedAnalysis));
  }
}, []);

const shipment = analysis?.shipment;
const claimCalculation = analysis?.claimCalculation;
const amd = analysis?.amd;
const decision = analysis?.decision;
const attachments = [
  {
    name: `${shipment?.poNumber ?? "PO-55871"}.pdf`,
    meta: `Purchase Order · ${shipment?.expectedUnits ?? 320} units`,
    source: "Source: PO",
  },
  {
    name: "INV-77102.pdf",
    meta: `Invoice · ${shipment?.invoicedUnits ?? 320} units`,
    source: "Source: Invoice",
  },
  {
    name: "PS-44891.pdf",
    meta: `Packing Slip · ${shipment?.receivedUnits ?? 288} units`,
    source: "Source: Packing Slip",
  },
  {
    name: "shipment.jpg",
    meta: amd?.damage_detected
      ? "1 image · Visible damage detected"
      : "1 image · No visible damage detected",
    source:
      amd?.source === "live"
        ? "Source: AMD Live Analysis"
        : "Source: AMD Cached Verified Result",
  },
  {
    name: "Inspection_Report.pdf",
    meta: `AI inspection · ${Math.round(
      (amd?.confidence ?? 0.96) * 100
    )}% confidence`,
    source: "Source: AMD Analysis",
  },
];
const handleExportPDF = () => {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  const addText = (
    text: string,
    size = 11,
    bold = false,
    spacing = 6
  ) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);

    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, y);

    y += lines.length * spacing;
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("ClaimThat", margin, y);

  y += 9;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Shipment claim packet", margin, y);

  y += 12;

  addText("CLAIM PACKET", 18, true, 8);

  addText(
    `Shipment: ${shipment?.shipmentId ?? "SHP-1048"}`
  );

  addText(
    `PO: ${shipment?.poNumber ?? "PO-55871"}`
  );

  addText(
    `Carrier: ${shipment?.carrier ?? settings.defaultCarrier ?? "XPO Logistics"}`
  );

  addText(
    `Claim Amount: $${(
      claimCalculation?.totalRecoverableAmount ?? 2840
    ).toLocaleString()}`
  );

  addText(
    `Claim Deadline: ${
      claimCalculation?.claimDeadline ?? "2026-04-20"
    }`
  );

  y += 4;

  addText("FROM", 11, true);

  addText(settings.companyName);
  addText(settings.fullName);
  addText(settings.address);
  addText(settings.cityStateZip);
  addText(settings.claimsEmail);

  y += 4;

  addText("TO", 11, true);

  addText("ACME Industrial");
  addText("Attn: Claims Department");

  y += 4;

  addText(
    `Subject: Freight Claim - Shipment ${
      shipment?.shipmentId ?? "SHP-1048"
    } | ${shipment?.poNumber ?? "PO-55871"} | $${(
      claimCalculation?.totalRecoverableAmount ?? 2840
    ).toLocaleString()}`,
    11,
    true
  );

  y += 4;

  addText("Dear ACME Industrial Claims Team,");

  addText(
    `We are filing a freight claim for damages and missing units discovered upon receipt of shipment ${
      shipment?.shipmentId ?? "SHP-1048"
    }. The shipment was expected to contain ${
      shipment?.expectedUnits ?? 320
    } units, but only ${
      shipment?.receivedUnits ?? 288
    } units were received, leaving ${
      shipment?.missingUnits ?? 32
    } units missing.`
  );

  addText(
    amd?.description ??
      "Shipment photos show visible carton damage consistent with the reported incident."
  );

  y += 4;

  addText("CLAIM SUMMARY", 12, true);

  addText(
    `Missing units: ${shipment?.missingUnits ?? 32}`
  );

  addText(
    `Damaged cartons: ${claimCalculation?.documentedDamagedCartons ?? 3}`
  );

  addText(
    `Missing goods value: $${(
      claimCalculation?.missingValue ?? 896
    ).toLocaleString()}`
  );

  addText(
    `Damaged goods value: $${(
      claimCalculation?.damagedGoodsValue ?? 1944
    ).toLocaleString()}`
  );

  addText(
    `Total claim amount: $${(
      claimCalculation?.totalRecoverableAmount ?? 2840
    ).toLocaleString()}`
  );

  y += 4;

  addText("AI EVIDENCE", 12, true);

  addText(
    `AMD analysis confidence: ${Math.round(
      (amd?.confidence ?? 0.98) * 100
    )}%`
  );

  addText(
    `AMD analysis source: ${
      amd?.source === "live" ? "Live" : "Cached verified result"
    }`
  );

  y += 4;

  addText("ATTACHMENTS", 12, true);

  attachments.forEach((attachment) => {
    addText(
      `${attachment.name} - ${attachment.meta}`,
      10
    );
  });

  y += 4;

  addText("Sincerely,");
  addText(settings.fullName);
  addText(`${settings.companyName} - Claims Department`);

  pdf.save(
    `ClaimThat-${shipment?.shipmentId ?? "SHP-1048"}.pdf`
  );
};
const [copied, setCopied] = useState(false);

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

          <Link
            href="/decisions/1048"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <CheckCircle2 size={19} />
            Decisions
          </Link>

          <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
            <FileText size={19} />
            Claim Packets
          </div>

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
          <GlobalSearch />

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
                <div className="text-sm font-semibold">{settings.fullName}</div>
<div className="text-xs text-slate-400">{settings.companyName}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Heading */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <Link
                href="/decisions/1048"
                className="mb-2 inline-block text-sm text-slate-400 hover:text-blue-600"
              >
                ← Back to Case #1048
              </Link>

              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                  Claim Packet
                </h1>

                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  <CheckCircle2 size={15} />
                  Ready to Send
                </span>
              </div>

              <div className="mt-2 flex gap-3 text-sm text-slate-500">
                <span>Shipment: SHP-1048</span>
                <span>·</span>
                <span>BOL: 78493201</span>
                <span>·</span>
                <span>PO: PO-55871</span>
                <span>·</span>
                <span>Carrier: XPO Logistics</span>
                <span>·</span>
                <span>Received: Apr 12, 2026</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    $
                  </div>
                  <div>
                    <p className="text-lg font-bold">
  {`$${claimCalculation?.totalRecoverableAmount?.toLocaleString() ?? "2,840"}`}
</p>
                    <p className="text-xs text-slate-400">Claim amount</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">
  {`${claimCalculation?.daysLeft ?? 6} days left`}
</p>
                    <p className="text-xs text-slate-400">to file claim</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    {`${Math.round((amd?.confidence ?? 0.96) * 100)}%`}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">confidence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_380px] gap-5">
            {/* LEFT */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-slate-200 px-5">
                <div className="flex gap-6">
                  <button className="border-b-2 border-blue-600 px-1 py-4 text-sm font-semibold text-blue-600">
                    Claim Preview
                  </button>

                  <button className="px-1 py-4 text-sm font-medium text-slate-500">
                    Calculation Details
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600">
                    <Pencil size={14} />
                    Edit Packet
                  </button>

                  <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Document preview */}
              <div className="bg-slate-100 p-4">
                <div
  id="claim-packet-export"
  className="mx-auto max-w-4xl rounded-sm border border-slate-200 bg-white p-8 shadow-sm"
>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Box size={22} />
                      </div>

                      <div>
                        <div className="text-2xl font-bold">ClaimThat</div>
                        <div className="text-xs text-slate-400">
                          Shipment claim packet
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold">Claim Packet</div>
                      <div className="text-sm text-slate-500">
                        Shipment SHP-1048
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Generated: Apr 14, 2026, 2:40 PM
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-10">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        To
                      </p>
                      <p className="mt-1 font-semibold">ACME Industrial</p>
                      <p className="text-sm text-slate-500">
                        Attn: Claims Department
                      </p>
                      <p className="text-sm text-slate-500">
                        1234 Supply Chain Dr.
                      </p>
                      <p className="text-sm text-slate-500">
                        Chicago, IL 60601
                      </p>
                      <p className="text-sm text-slate-500">
                        claims@acmeindustrial.com
                      </p>
                    </div>

                    <div>
                      <p className="mt-1 font-semibold">{settings.companyName}</p>
<p className="text-sm text-slate-500">{settings.fullName}</p>
<p className="text-sm text-slate-500">{settings.address}</p>
<p className="text-sm text-slate-500">{settings.cityStateZip}</p>
<p className="text-sm text-slate-500">{settings.claimsEmail}</p>
                    </div>
                  </div>

                  <div className="mt-8 border-y border-slate-200 py-4">
                    <div className="flex">
                      <span className="w-24 font-semibold">Subject:</span>
                      <span className="font-semibold">
                      {`Freight Claim – Shipment SHP-1048 | ${shipment?.poNumber ?? "PO-55871"} | $${Number(
  claimCalculation?.totalRecoverableAmount ?? 2840
).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4 text-sm leading-6 text-slate-600">
                    <p>Dear ACME Industrial Claims Team,</p>

                    <p>
  {`We are filing a freight claim for damages and missing units discovered upon receipt of the above referenced shipment. The shipment, tendered by XPO Logistics and received on ${
    claimCalculation?.claimDeadline
      ? new Date(
          new Date(
            `${claimCalculation.claimDeadline}T00:00:00Z`
          ).getTime() -
            8 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : "Apr 12, 2026"
  }, was expected to contain ${
    shipment?.expectedUnits ?? 320
  } units, but only ${
    shipment?.receivedUnits ?? 288
  } units were received, leaving ${
    shipment?.missingUnits ?? 32
  } units missing. ${
    amd?.description ??
    "Visible shipment damage was documented in the attached evidence."
  }`}
</p>
                  </div>

                  <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangleIcon />
                      <div>
                        <p className="font-semibold text-red-600">
                          Claim Summary
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          We are requesting a claim in the amount of{" "}
<strong>
  {`$${Number(
    claimCalculation?.totalRecoverableAmount ?? 2840
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`}
</strong>{" "}
for {shipment?.missingUnits ?? 32} missing units and{" "}
{claimCalculation?.documentedDamagedCartons ?? 3} damaged cartons.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-4 gap-3">
                    <InfoCard
                      title="Shipment Details"
                      lines={[
  "Shipment ID · SHP-1048",
  "BOL · 78493201",
  `PO Number · ${shipment?.poNumber ?? "PO-55871"}`,
  "Carrier · XPO Logistics",
  `Received · ${
    claimCalculation?.claimDeadline
      ? new Date(
          new Date(
            `${claimCalculation.claimDeadline}T00:00:00Z`
          ).getTime() -
            8 * 24 * 60 * 60 * 1000
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : "Apr 12, 2026"
  }`,
]}
                    />

                    <InfoCard
                      title="Incident Summary"
                      lines={[
  `${shipment?.missingUnits ?? 32} units missing`,
  `${claimCalculation?.documentedDamagedCartons ?? 3} cartons damaged`,
  amd?.damage_detected
    ? "Visible impact damage"
    : "No visible impact damage detected",
  amd?.damage_detected
    ? "Compromised packaging"
    : "Packaging condition not visually compromised",
]}
                    />

                    <InfoCard
                      title="Key Evidence"
                      lines={[
  amd?.damage_detected
    ? `AMD visual evidence · ${amd?.description ?? "Visible shipment damage detected"}`
    : "AMD visual analysis · No visible shipment damage detected",
  `Packing slip · ${shipment?.receivedUnits ?? 288} received vs. ${shipment?.expectedUnits ?? 320} expected`,
  `Invoice · ${shipment?.invoicedUnits ?? 320} units vs. PO · ${shipment?.expectedUnits ?? 320} units`,
  `AMD source · ${
    amd?.source === "live" ? "Live analysis" : "Cached verified result"
  } · ${Math.round((amd?.confidence ?? 0.96) * 100)}% confidence`,
]}
                    />

                    <InfoCard
                      title="Claim Amount"
                      lines={[
  `Missing units · $${Number(
    claimCalculation?.missingValue ?? 896
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  `Damaged goods · $${Number(
    claimCalculation?.damagedGoodsValue ?? 1944
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  `Total · $${Number(
    claimCalculation?.totalRecoverableAmount ?? 2840
  ).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
]}
                    />
                  </div>

                  <div className="mt-6 text-sm leading-6 text-slate-600">
                    <p>
                      Please review the attached documentation and let us know
                      if any additional information is required.
                    </p>

                    <p className="mt-4">
  Sincerely,
  <br />
  {settings.fullName}
  <br />
  {settings.companyName} – Claims Department
</p>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT */}
            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Packet Status</h2>

                <div className="mt-4 rounded-xl bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>
                      <p className="font-semibold">Ready to Send</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Your claim packet is complete and ready to send.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <CalendarDays size={20} className="text-blue-600" />

                  <div>
                    <p className="text-sm font-semibold">
                      Claim Filing Deadline
                    </p>
                    <p className="mt-1 text-sm font-semibold text-red-500">
  {`${claimCalculation?.daysLeft ?? 6} days left (${
    claimCalculation?.claimDeadline
      ? new Date(
          `${claimCalculation.claimDeadline}T00:00:00Z`
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: "UTC",
        })
      : "Apr 20, 2026"
  })`}
</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Submit before this date to ensure eligibility with the
                      carrier and supplier.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-blue-600" />
                  <div>
                    <h2 className="font-semibold">
  Evidence & Attachments ({attachments.length})
</h2>
                    <p className="text-xs text-slate-400">
                      All supporting documents included.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {attachments.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            index === 3
                              ? "bg-orange-50 text-orange-500"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {index === 3 ? (
                            <FileImage size={19} />
                          ) : (
                            <FileText size={19} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.meta}</p>
                        </div>
                      </div>

                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                        {item.source}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs text-slate-400">
                  Send or export the claim packet using the options below.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
  type="button"
  onClick={() => {
    const subject = `Freight Claim - Shipment ${
      shipment?.shipmentId ?? "SHP-1048"
    } | ${shipment?.poNumber ?? "PO-55871"} | $${(
      claimCalculation?.totalRecoverableAmount ?? 2840
    ).toLocaleString()}`;

    const body = `Dear ACME Industrial Claims Team,

We are submitting a freight claim for shipment ${
      shipment?.shipmentId ?? "SHP-1048"
    }.

Claim amount: $${(
      claimCalculation?.totalRecoverableAmount ?? 2840
    ).toLocaleString()}

Missing units: ${shipment?.missingUnits ?? 32}
Damaged cartons: ${claimCalculation?.documentedDamagedCartons ?? 3}

Please see the attached claim packet and supporting evidence.

Regards,
${settings.fullName}
${settings.companyName}`;

    window.location.href = `mailto:claims@acmeindustrial.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }}
  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
>
  <Send size={17} />
  Send to Supplier
</button>

                  <button
  type="button"
  onClick={handleExportPDF}
  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  <Download size={17} />
  Export PDF
</button>

                  <button
  type="button"
  onClick={async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }}
  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
>
  <Copy size={17} />
  {copied ? "Copied!" : "Copy Link"}
</button>

                  <button
  type="button"
  onClick={() => {
    const subject = `Freight Claim Notice - Shipment ${
      shipment?.shipmentId ?? "SHP-1048"
    } | ${shipment?.poNumber ?? "PO-55871"}`;

    const body = `Dear XPO Logistics Claims Team,

We are notifying you of a freight claim relating to shipment ${
      shipment?.shipmentId ?? "SHP-1048"
    }.

Claim amount: $${(
      claimCalculation?.totalRecoverableAmount ?? 2840
    ).toLocaleString()}

Missing units: ${shipment?.missingUnits ?? 32}
Damaged cartons: ${claimCalculation?.documentedDamagedCartons ?? 3}

The shipment evidence and claim documentation have been prepared in ClaimThat.

Please let us know if any additional documentation is required.

Regards,
${settings.fullName}
${settings.companyName}`;

    window.location.href = `mailto:claims@xpo.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }}
  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
>
  <Mail size={17} />
  Email Carrier
</button>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-xs font-semibold">{title}</p>

      <div className="mt-2 space-y-1">
        {lines.map((line) => (
          <p key={line} className="text-[11px] leading-4 text-slate-500">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function AlertTriangleIcon() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
      !
    </div>
  );
}