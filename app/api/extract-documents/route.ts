import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";


async function extractPdfText(filePath: string) {
  const buffer = await readFile(filePath);

  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

function extractNumber(text: string, pattern: RegExp) {
  const match = text.match(pattern);

  if (!match?.[1]) {
    return null;
  }

  return Number(match[1].replace(/,/g, ""));
}

function extractMoney(text: string, pattern: RegExp) {
  const match = text.match(pattern);

  if (!match?.[1]) {
    return null;
  }

  return Number(match[1].replace(/[$,]/g, ""));
}

export async function GET() {
  try {
    const demoDirectory = path.join(process.cwd(), "data", "demo");

    const poText = await extractPdfText(
      path.join(demoDirectory, "PO-55871.pdf")
    );

    const invoiceText = await extractPdfText(
      path.join(demoDirectory, "INV-77102.pdf")
    );

    const packingSlipText = await extractPdfText(
      path.join(demoDirectory, "PS-44891.pdf")
    );

    const poNumber =
      poText.match(/PO-\d+/i)?.[0] ??
      invoiceText.match(/PO-\d+/i)?.[0] ??
      null;

    const expectedUnits = extractNumber(
      poText,
      /Industrial control module\s+(\d+)/i
    );

    const invoicedUnits = extractNumber(
      invoiceText,
      /Industrial control module\s+(\d+)/i
    );

    const receivedUnits = extractNumber(
      packingSlipText,
      /Physical count received:\s*(\d+)\s*units/i
    );

    const missingUnits =
      receivedUnits !== null
        ? extractNumber(
            packingSlipText,
            /Shortage:\s*(\d+)\s*units/i
          ) ??
          (expectedUnits !== null
            ? expectedUnits - receivedUnits
            : null)
        : null;

    const unitPrice = extractMoney(
      poText,
      /Industrial control module\s+\d+\s+\$?([\d,.]+)/i
    );

    const missingValue =
      missingUnits !== null && unitPrice !== null
        ? missingUnits * unitPrice
        : null;
        const poMatchesInvoice =
  expectedUnits !== null &&
  invoicedUnits !== null &&
  expectedUnits === invoicedUnits;

const poMatchesReceived =
  expectedUnits !== null &&
  receivedUnits !== null &&
  expectedUnits === receivedUnits;

const invoiceMatchesReceived =
  invoicedUnits !== null &&
  receivedUnits !== null &&
  invoicedUnits === receivedUnits;

const hasQuantityMismatch =
  missingUnits !== null && missingUnits > 0;

const matchStatus = hasQuantityMismatch
  ? "MISMATCH"
  : "MATCHED";

  const damagedCartons =
  extractNumber(
    packingSlipText,
    /visible damage observed on\s*(\d+)\s*cartons/i
  ) ?? 0;
  
const estimatedDamagePerCarton = 648;

const damagedGoodsValue =
  damagedCartons * estimatedDamagePerCarton;

const totalRecoverableAmount =
  (missingValue ?? 0) + damagedGoodsValue;

const receivedDate = new Date(Date.UTC(2026, 3, 12));
const analysisDate = new Date(Date.UTC(2026, 3, 14));

const claimDeadline = new Date(receivedDate);
claimDeadline.setUTCDate(claimDeadline.getUTCDate() + 8);

const daysLeft = Math.max(
  0,
  Math.ceil(
    (claimDeadline.getTime() - analysisDate.getTime()) /
      (1000 * 60 * 60 * 24)
  )
);

    return NextResponse.json({
      success: true,

      shipment: {
        poNumber,
        expectedUnits,
        invoicedUnits,
        receivedUnits,
        missingUnits,
        unitPrice,
        missingValue,
      },

      matching: {
  poVsInvoice: poMatchesInvoice ? "MATCH" : "MISMATCH",
  poVsReceived: poMatchesReceived ? "MATCH" : "MISMATCH",
  invoiceVsReceived: invoiceMatchesReceived ? "MATCH" : "MISMATCH",
  overall: matchStatus,
},

claimCalculation: {
  missingUnitsValue: missingValue,
  damagedCartons,
  estimatedDamagePerCarton,
  damagedGoodsValue,
  totalRecoverableAmount,
  claimDeadline: claimDeadline.toISOString().split("T")[0],
  daysLeft,
},

      documents: {
        purchaseOrder: "PO-55871.pdf",
        invoice: "INV-77102.pdf",
        packingSlip: "PS-44891.pdf",
      },
    });
  } catch (error) {
    console.error("Document extraction failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Document extraction failed",
      },
      { status: 500 }
    );
  }
}