"use client";

import { useClaimThatSettings } from "../../data/useClaimThatSettings";
import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import {
  Bell,
  Box,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  FolderOpen,
  Home,
  Image as ImageIcon,
  PlusCircle,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";

type UploadCardProps = {
  title: string;
  required?: boolean;
  file: File | null;
  accept: string;
  onChange: (file: File | null) => void;
};

function UploadCard({
  title,
  required = true,
  file,
  accept,
  onChange,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    onChange(selected);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={20} />
          </div>

          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-slate-400">
              {required ? "Required" : "Optional"}
            </p>
          </div>
        </div>

        {file && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check size={14} strokeWidth={3} />
          </div>
        )}
      </div>

      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {file.name}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>

          <button
            onClick={() => onChange(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-blue-200 bg-blue-50/40 px-4 py-6 text-center transition hover:bg-blue-50"
        >
          <Upload size={21} className="mb-2 text-blue-500" />
          <p className="text-sm font-semibold text-blue-600">
            Click to upload
          </p>
          <p className="mt-1 text-xs text-slate-400">PDF, PNG or JPG</p>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export default function NewInspectionPage() {
  const settings = useClaimThatSettings();
  const photoInput = useRef<HTMLInputElement>(null);

  const [po, setPo] = useState<File | null>(null);
  const [invoice, setInvoice] = useState<File | null>(null);
  const [packingSlip, setPackingSlip] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const ready =
    Boolean(po) &&
    Boolean(invoice) &&
    Boolean(packingSlip) &&
    photos.length > 0;

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);

    setPhotos((current) => [...current, ...selected].slice(0, 8));
  }

  function removePhoto(index: number) {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }

    async function analyzeShipment() {
  if (!po || !invoice || !packingSlip || photos.length === 0) {
    alert("Please upload all required documents and at least one shipment photo.");
    return;
  }

  try {
    setAnalyzing(true);

    const formData = new FormData();

    formData.append("po", po);
    formData.append("invoice", invoice);
    formData.append("packingSlip", packingSlip);
    formData.append("photo", photos[0]);


    async function extractWithEvolus(file: File) {
  let lastError = "";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const evolusForm = new FormData();
      evolusForm.append("file", file);

      const response = await fetch("/api/evolus-extract", {
        method: "POST",
        body: evolusForm,
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        return result.data;
      }

      lastError =
        result.error ||
        `Evolus extraction failed for ${file.name}`;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error.message
          : `Evolus extraction failed for ${file.name}`;
    }

    if (attempt < 2) {
      await new Promise((resolve) =>
        setTimeout(resolve, 2500)
      );
    }
  }

  throw new Error(lastError);
}

// Run sequentially to reduce AMD/Evolus rate-limit risk
const poExtraction = await extractWithEvolus(po);
const invoiceExtraction = await extractWithEvolus(invoice);
const packingSlipExtraction = await extractWithEvolus(packingSlip);

formData.append(
  "poExtraction",
  JSON.stringify(poExtraction)
);

formData.append(
  "invoiceExtraction",
  JSON.stringify(invoiceExtraction)
);

formData.append(
  "packingSlipExtraction",
  JSON.stringify(packingSlipExtraction)
);

const response = await fetch("/api/analyze-shipment", {
  method: "POST",
  body: formData,
});

const result = await response.json();

if (!response.ok || !result.success) {
  throw new Error(result.error || "Shipment analysis failed.");
}

    localStorage.setItem(
      "claimthat:lastAnalysis",
      JSON.stringify(result)
    );

    window.location.href = "/cases/1048";
  } catch (error) {
    console.error("Shipment analysis failed:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong while analyzing the shipment."
    );
  } finally {
    setAnalyzing(false);
  }
}


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
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Home size={19} />
            Dashboard
          </Link>

          <Link
            href="/new-inspection"
            className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
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

<button
  type="button"
  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
>
  <Settings size={19} />
  Settings
</button>

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

      {/* Content */}
      <div className="ml-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
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
          {/* Page heading */}
          <div className="mb-6">
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-blue-600"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              New Inspection
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Upload shipment documents and photos to detect discrepancies and
              build a claim-ready record.
            </p>
          </div>

          {/* Progress */}
          <div className="mb-6 grid grid-cols-4 gap-3">
            {[
              ["1", "Upload Files", "Add documents and photos"],
              ["2", "Review Details", "Verify shipment information"],
              ["3", "Analyze with AMD", "AI checks for issues"],
              ["4", "Complete", "Review results and next steps"],
            ].map((step, index) => (
              <div key={step[0]} className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  {step[0]}
                </div>

                <div>
                  <p className="text-sm font-semibold">{step[1]}</p>
                  <p className="text-xs text-slate-400">{step[2]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[1fr_340px] gap-5">
            {/* Main upload panel */}
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Upload size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Upload Shipment Files
                    </h2>
                    <p className="text-sm text-slate-400">
                      Add the key documents for this shipment.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <UploadCard
                    title="Purchase Order"
                    file={po}
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={setPo}
                  />

                  <UploadCard
                    title="Invoice"
                    file={invoice}
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={setInvoice}
                  />

                  <UploadCard
                    title="Packing Slip"
                    file={packingSlip}
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={setPackingSlip}
                  />
                </div>
              </section>

              {/* Photos */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Camera size={21} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold">
                        Shipment Photos
                      </h2>
                      <p className="text-sm text-slate-400">
                        Add photos of cartons, damage, labels, and the full
                        shipment.
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-medium text-slate-400">
                    {photos.length} photos
                  </span>
                </div>

                {photos.length > 0 && (
                  <div className="mt-5 grid grid-cols-4 gap-3">
                    {photos.map((photo, index) => (
                      <div
                        key={`${photo.name}-${index}`}
                        className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <div className="flex aspect-[4/3] items-center justify-center">
                          <ImageIcon size={28} className="text-slate-300" />
                        </div>

                        <div className="border-t border-slate-100 bg-white p-2">
                          <p className="truncate text-xs font-medium">
                            {photo.name}
                          </p>
                        </div>

                        <button
                          onClick={() => removePhoto(index)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-white"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => photoInput.current?.click()}
                  className="mt-5 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 py-9 transition hover:bg-blue-50"
                >
                  <Camera size={27} className="mb-3 text-blue-500" />
                  <p className="text-sm font-semibold text-slate-700">
                    Drag and drop photos here
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    or click to browse
                  </p>
                </button>

                <input
                  ref={photoInput}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={addPhotos}
                />
              </section>
            </div>

            {/* Right side */}
            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Shipment</p>
                    <p className="mt-1 text-2xl font-bold">SHP-1048</p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                    Draft
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 text-sm">
                  <div>
                    <p className="text-xs text-slate-400">Supplier</p>
                    <p className="mt-1 font-medium">ACME Industrial</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Carrier</p>
                    <p className="mt-1 font-medium">XPO Logistics</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">PO Number</p>
                    <p className="mt-1 font-medium">PO-55871</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Received</p>
                    <p className="mt-1 font-medium">Apr 12, 2026</p>
                  </div>
                </div>
              </section>

              {/* Checklist */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold">Readiness Checklist</h3>
                    <p className="text-xs text-slate-400">
                      Required files before analysis.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    ["Purchase order uploaded", Boolean(po)],
                    ["Invoice uploaded", Boolean(invoice)],
                    ["Packing slip uploaded", Boolean(packingSlip)],
                    ["At least one photo uploaded", photos.length > 0],
                  ].map(([label, complete]) => (
                    <div
                      key={String(label)}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            complete
                              ? "bg-emerald-500 text-white"
                              : "border border-slate-200 text-transparent"
                          }`}
                        >
                          <Check size={14} strokeWidth={3} />
                        </div>

                        <span className="text-sm text-slate-600">
                          {String(label)}
                        </span>
                      </div>

                      {label === "At least one photo uploaded" &&
                        photos.length > 0 && (
                          <span className="text-xs text-slate-400">
                            {photos.length} photo
                            {photos.length === 1 ? "" : "s"}
                          </span>
                        )}
                    </div>
                  ))}
                </div>
              </section>

              {/* What AI checks */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      What ClaimThat will analyze
                    </h3>
                    <p className="text-xs text-slate-400">
                      AMD-powered evidence analysis.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-red-500">Damage</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Visible carton or packaging damage.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-orange-500">Shortages</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Quantity differences across shipment records.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-blue-600">
                      Document discrepancies
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Cross-check PO, invoice and packing slip.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-700">
                      Evidence links
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Connect each finding to its supporting source.
                    </p>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <button
  type="button"
  disabled={!ready || analyzing}
  onClick={analyzeShipment}
                className={`flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-sm font-bold text-white shadow-sm transition ${
                  ready
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "cursor-not-allowed bg-slate-300"
                }`}
              >
                <Sparkles size={18} />

                {analyzing
                  ? "Analyzing Shipment..."
                  : "Analyze Shipment with AMD"}

                {!analyzing && <ChevronRight size={18} />}
              </button>

              {!ready && (
                <p className="text-center text-xs text-slate-400">
                  Upload all required documents and at least one photo to
                  continue.
                </p>
              )}
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}