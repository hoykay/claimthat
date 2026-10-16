import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;

    const [documentsResponse, imageResponse] = await Promise.all([
      fetch(`${origin}/api/extract-documents`),
      fetch(`${origin}/api/analyze-image`),
    ]);

    const documents = await documentsResponse.json();
    const image = await imageResponse.json();

    if (!documents.success) {
      throw new Error("Document analysis failed.");
    }

    if (!image.success) {
      throw new Error("Image analysis failed.");
    }

    const shipment = documents.shipment;
    const matching = documents.matching;
    const claimCalculation = documents.claimCalculation;
    const visualAnalysis = image.analysis;

    const missingUnits = Number(shipment.missingUnits ?? 0);

    const documentedDamagedCartons = Number(
      claimCalculation.damagedCartons ?? 0
    );

    const damageDetected =
      visualAnalysis.damage_detected === true;

    const visualConfidence = Number(
      visualAnalysis.confidence ?? 0
    );

    let decision:
      | "CLAIM"
      | "NO_CLAIM"
      | "HUMAN_REVIEW";

    let reason = "";

    // Rule 1:
    // A confirmed quantity shortage is enough to recommend a claim.
    if (missingUnits > 0) {
      decision = "CLAIM";

      reason =
        damageDetected && visualConfidence >= 0.8
          ? `${missingUnits} units are missing and AMD independently confirmed visible shipment damage with ${Math.round(
              visualConfidence * 100
            )}% confidence.`
          : `${missingUnits} units are missing based on the document and receiving records.`;
    }

    // Rule 2:
    // Damage documented by receiving + strong AMD visual evidence.
    else if (
      documentedDamagedCartons > 0 &&
      damageDetected &&
      visualConfidence >= 0.8
    ) {
      decision = "CLAIM";

      reason = `${documentedDamagedCartons} damaged cartons were documented at receiving and AMD confirmed visible damage with ${Math.round(
        visualConfidence * 100
      )}% confidence.`;
    }

    // Rule 3:
    // Evidence exists, but it is not strong enough for automation.
    else if (
      documentedDamagedCartons > 0 ||
      damageDetected ||
      visualConfidence > 0
    ) {
      decision = "HUMAN_REVIEW";

      reason =
        "Potential shipment damage was detected, but the evidence is not strong enough for an automated claim recommendation.";
    }

    // Rule 4:
    // No discrepancy and no damage.
    else {
      decision = "NO_CLAIM";

      reason =
        "Shipment quantities match and no supported physical damage was detected.";
    }

    return NextResponse.json({
      success: true,

      decision: {
        recommendation: decision,
        reason,
        recoverableAmount:
          claimCalculation.totalRecoverableAmount,
        deadline:
          claimCalculation.claimDeadline,
        daysLeft:
          claimCalculation.daysLeft,
      },

      evidence: {
        documents: {
          poVsInvoice: matching.poVsInvoice,
          poVsReceived: matching.poVsReceived,
          invoiceVsReceived:
            matching.invoiceVsReceived,
          missingUnits,
          documentedDamagedCartons,
        },

        amd: {
          source: image.source,
          damageDetected,
          visuallyConfirmedCartons:
            visualAnalysis.damaged_cartons,
          confidence: visualConfidence,
          description:
            visualAnalysis.description,
          boundingBox:
            visualAnalysis.bounding_box,
        },
      },
    });
  } catch (error) {
    console.error(
      "Claim evaluation failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Claim evaluation failed",
      },
      { status: 500 }
    );
  }
}