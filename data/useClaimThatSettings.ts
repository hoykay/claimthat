"use client";

import { useEffect, useState } from "react";

export type ClaimThatSettings = {
  fullName: string;
  companyName: string;
  claimsEmail: string;
  address: string;
  cityStateZip: string;
  defaultCarrier: string;
  claimWindowDays: string;
};

export const defaultClaimThatSettings: ClaimThatSettings = {
  fullName: "Jordan Diaz",
  companyName: "Acme Logistics",
  claimsEmail: "claims@acmelogistics.com",
  address: "123 Industrial Blvd",
  cityStateZip: "Dallas, TX 75201",
  defaultCarrier: "XPO Logistics",
  claimWindowDays: "8",
};

export function useClaimThatSettings() {
  const [settings, setSettings] =
    useState<ClaimThatSettings>(defaultClaimThatSettings);

  useEffect(() => {
    const saved = localStorage.getItem("claimthat:settings");

    if (!saved) return;

    try {
      setSettings({
        ...defaultClaimThatSettings,
        ...JSON.parse(saved),
      });
    } catch {
      setSettings(defaultClaimThatSettings);
    }
  }, []);

  return settings;
}