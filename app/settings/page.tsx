"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bell,
  Box,
  Building2,
  CheckCircle2,
  FileText,
  FolderOpen,
  Home,
  Mail,
  MapPin,
  PlusCircle,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

type ClaimThatSettings = {
  fullName: string;
  companyName: string;
  claimsEmail: string;
  address: string;
  cityStateZip: string;
  defaultCarrier: string;
  claimWindowDays: string;
};

const defaultSettings: ClaimThatSettings = {
  fullName: "Jordan Diaz",
  companyName: "Acme Logistics",
  claimsEmail: "claims@acmelogistics.com",
  address: "123 Industrial Blvd",
  cityStateZip: "Dallas, TX 75201",
  defaultCarrier: "XPO Logistics",
  claimWindowDays: "8",
};

export default function SettingsPage() {
  const [form, setForm] = useState<ClaimThatSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem("claimthat:settings");

    if (existing) {
      try {
        setForm({
          ...defaultSettings,
          ...JSON.parse(existing),
        });
      } catch {
        setForm(defaultSettings);
      }
    }
  }, []);

  function updateField(
    field: keyof ClaimThatSettings,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function saveSettings() {
    localStorage.setItem("claimthat:settings", JSON.stringify(form));
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col border-r border-slate-200 bg-white">
        <div className="flex h-[74px] items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
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

          <div className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
            <Settings size={19} />
            Settings
          </div>
        </nav>

        <div className="mt-auto p-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Powered by
            </div>

            <div className="mt-1 text-xl font-black">
              AMD
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              AI-powered shipment evidence and claim decisions.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white px-7">
          <div className="flex h-11 w-[560px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
            <Search size={18} className="text-slate-400" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search cases, shipments, PO numbers..."
            />
          </div>

          <div className="flex items-center gap-5">
            <Bell size={20} className="text-slate-500" />

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                {form.fullName
  .split(" ")
  .map((name) => name[0])
  .join("")
  .slice(0, 2)
  .toUpperCase()}
              </div>

              <div>
                <div className="text-sm font-semibold">
                  {form.fullName || "Jordan Diaz"}
                </div>
                <div className="text-xs text-slate-400">
                  {form.companyName || "Acme Logistics"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1280px] px-8 py-8">
          {/* Title */}
          <div className="mb-7 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Settings
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Configure the details ClaimThat uses when preparing
                shipment claims.
              </p>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              {saved ? (
                <>
                  <CheckCircle2 size={18} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Settings
                </>
              )}
            </button>
          </div>

          {saved && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              <CheckCircle2 size={18} />
              Settings saved successfully.
            </div>
          )}

          <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-6">
            <div className="space-y-6">
              {/* Profile */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <User size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Personal Profile
                    </h2>
                    <p className="text-xs text-slate-400">
                      Used as the sender on generated claim packets.
                    </p>
                  </div>
                </div>

                <label className="block">
                  <span className="text-xs font-semibold text-slate-500">
                    Full name
                  </span>

                  <input
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    placeholder="Jordan Diaz"
                  />
                </label>
              </section>

              {/* Company */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Company Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Company details included in claim correspondence.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">
                      Company name
                    </span>

                    <input
                      value={form.companyName}
                      onChange={(event) =>
                        updateField(
                          "companyName",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">
                      Claims email
                    </span>

                    <div className="relative mt-2">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={form.claimsEmail}
                        onChange={(event) =>
                          updateField(
                            "claimsEmail",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">
                      Street address
                    </span>

                    <div className="relative mt-2">
                      <MapPin
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={form.address}
                        onChange={(event) =>
                          updateField("address", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">
                      City / State / ZIP
                    </span>

                    <input
                      value={form.cityStateZip}
                      onChange={(event) =>
                        updateField(
                          "cityStateZip",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>
              </section>

              {/* Claim defaults */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Truck size={20} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      Claim Defaults
                    </h2>
                    <p className="text-xs text-slate-400">
                      Default workflow values used when preparing a
                      new claim.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">
                      Default carrier
                    </span>

                    <input
                      value={form.defaultCarrier}
                      onChange={(event) =>
                        updateField(
                          "defaultCarrier",
                          event.target.value
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold text-slate-500">
                      Default claim window
                    </span>

                    <div className="relative mt-2">
                      <input
                        type="number"
                        min="1"
                        value={form.claimWindowDays}
                        onChange={(event) =>
                          updateField(
                            "claimWindowDays",
                            event.target.value
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-16 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />

                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        days
                      </span>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Claim Identity
                    </h3>
                    <p className="text-xs text-slate-400">
                      Preview of generated sender information.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    From
                  </div>

                  <div className="mt-3 font-semibold">
                    {form.companyName || "Acme Logistics"}
                  </div>

                  <div className="mt-1 text-sm text-slate-600">
                    {form.fullName || "Jordan Diaz"}
                  </div>

                  <div className="text-sm text-slate-500">
                    {form.address}
                  </div>

                  <div className="text-sm text-slate-500">
                    {form.cityStateZip}
                  </div>

                  <div className="mt-2 text-sm text-blue-600">
                    {form.claimsEmail}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h3 className="font-semibold text-blue-950">
                  Where these settings are used
                </h3>

                <div className="mt-4 space-y-3 text-sm text-blue-900/70">
                  <div>Claim Packet sender details</div>
                  <div>Claims correspondence</div>
                  <div>Default carrier information</div>
                  <div>Claim filing deadlines</div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}