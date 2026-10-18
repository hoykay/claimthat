"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

const searchItems = [
  {
    title: "Shipment SHP-1048",
    subtitle: "Case · PO-55871",
    href: "/cases/1048",
    keywords: [
      "shipment",
      "shp-1048",
      "1048",
      "po-55871",
      "case",
      "acme",
      "xpo",
    ],
  },
  {
    title: "Decision · SHP-1048",
    subtitle: "Claim recommendation and evidence",
    href: "/decisions/1048",
    keywords: [
      "decision",
      "claim",
      "claim recommended",
      "human review",
      "evidence",
      "shp-1048",
      "po-55871",
    ],
  },
  {
    title: "Claim Packet · SHP-1048",
    subtitle: "Prepared claim documentation",
    href: "/claims/1048",
    keywords: [
      "claim packet",
      "packet",
      "carrier",
      "supplier",
      "email carrier",
      "shp-1048",
      "po-55871",
    ],
  },
  {
    title: "New Inspection",
    subtitle: "Upload shipment documents and photos",
    href: "/new-inspection",
    keywords: [
      "new inspection",
      "inspection",
      "upload",
      "documents",
      "photos",
      "analyze",
    ],
  },
  {
    title: "Dashboard",
    subtitle: "ClaimThat overview",
    href: "/",
    keywords: ["dashboard", "home", "overview"],
  },
];

export default function GlobalSearch() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const normalized = query.toLowerCase().trim();

    if (!normalized) return [];

    return searchItems
      .filter((item) => {
        const searchable = [
          item.title,
          item.subtitle,
          ...item.keywords,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalized);
      })
      .slice(0, 5);
  }, [query]);

  function goToResult(href: string) {
    setQuery("");
    setFocused(false);
    router.push(href);
  }

  return (
    <div className="relative w-[560px]">
      <div
        className={`flex h-11 items-center gap-3 rounded-xl border bg-slate-50 px-4 transition ${
          focused
            ? "border-blue-300 bg-white ring-4 ring-blue-50"
            : "border-slate-200"
        }`}
      >
        <Search size={18} className="shrink-0 text-slate-400" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setTimeout(() => setFocused(false), 150);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && results.length > 0) {
              goToResult(results[0].href);
            }

            if (event.key === "Escape") {
              setQuery("");
              setFocused(false);
            }
          }}
          className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Search shipments, PO numbers, decisions..."
        />

        {query && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setQuery("")}
            className="text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {focused && query && (
        <div className="absolute left-0 right-0 top-[52px] z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => goToResult(item.href)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>

                  <span className="text-sm text-slate-300">→</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-4">
              <p className="text-sm font-medium text-slate-600">
                No matching records
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try a shipment ID, PO number, or workflow.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}