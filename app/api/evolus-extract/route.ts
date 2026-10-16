import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.EVOLUS_API_KEY;
    const applicationId = process.env.EVOLUS_APPLICATION_ID;
    const extractorAgentId = process.env.EVOLUS_EXTRACTOR_AGENT_ID;
    const outputStructureId = process.env.EVOLUS_OUTPUT_STRUCTURE_ID;

    if (
      !apiKey ||
      !applicationId ||
      !extractorAgentId ||
      !outputStructureId
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing Evolus environment variables",
        },
        { status: 500 }
      );
    }

    const incomingForm = await request.formData();
    const file = incomingForm.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          ok: false,
          error: "file is required",
        },
        { status: 400 }
      );
    }

    const evolusForm = new FormData();
    evolusForm.append("file", file, file.name);

    const response = await fetch(
      `https://api.evolus.ai/api/v1/agents/${extractorAgentId}/json/${outputStructureId}/ask-file?useWebhook=false`,
      {
        method: "POST",
        headers: {
          "X-ApiKey": apiKey,
          "X-Application-Id": applicationId,
        },
        body: evolusForm,
        cache: "no-store",
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: response.status,
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      ok: true,
      status: response.status,
      source: "Evolus Shipment Document Extractor",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Evolus extraction error",
      },
      { status: 500 }
    );
  }
}