import { NextRequest, NextResponse } from "next/server";

async function askEvolus(content: string) {
  const apiKey = process.env.EVOLUS_API_KEY;
  const applicationId = process.env.EVOLUS_APPLICATION_ID;
  const agentId = process.env.EVOLUS_AGENT_ID;

  if (!apiKey || !applicationId || !agentId) {
    throw new Error("Missing Evolus environment variables");
  }

  const response = await fetch(
    `https://api.evolus.ai/api/v1/agents/${agentId}/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ApiKey": apiKey,
        "X-Application-Id": applicationId,
      },
      body: JSON.stringify({
        content,
        conversationId: null,
        conversationType: {},
        parentConversationId: null,
        fileId: null,
        formId: null,
        outputStructureId: null,
        skipChatHistory: true,
        costApplicationId: null,
        structureInstruction: null,
        channelInstruction: null,
        channel: null,
        mcpUserTokens: null,
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.title ||
        `Evolus returned status ${response.status}`
    );
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.content || typeof body.content !== "string") {
      return NextResponse.json(
        {
          ok: false,
          error: "content is required",
        },
        { status: 400 }
      );
    }

    const data = await askEvolus(body.content);

    return NextResponse.json({
      ok: true,
      answer: data.answer,
      title: data.title,
      citations: data.citations ?? [],
      raw: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Evolus error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const content = `
Shipment SHP-1048

Purchase order expected: 320 units
Invoice: 320 units
Packing slip received: 288 units
Missing units: 32
Damaged cartons: 3
Visible shipment damage confirmed.
Deterministic claim amount: $2,840.

Review the evidence and recommend one of:
Claim
No Claim
Human Review

Explain the recommendation briefly and cite the key evidence.
Do not recalculate the claim amount.
`;

    const data = await askEvolus(content);

    return NextResponse.json({
      ok: true,
      answer: data.answer,
      title: data.title,
      citations: data.citations ?? [],
      raw: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown Evolus error",
      },
      { status: 500 }
    );
  }
}