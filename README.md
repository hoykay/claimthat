# ClaimThat

**Know when to claim. Prove why.**

ClaimThat is an AI-powered shipment claim decision system that helps operations teams determine whether a shipment issue deserves a freight claim and shows the evidence behind the recommendation.

Built for the **AMD Developer Hackathon: ACT III**.

## Live Demo

https://claimthat.vercel.app

## What ClaimThat Does

Shipment claims are often handled manually across purchase orders, invoices, packing slips, shipment photos, spreadsheets, and email.

ClaimThat turns that fragmented process into one evidence-backed workflow:

**Upload → Extract → Match → Verify → Decide → Resolve**

1. Upload the purchase order, invoice, packing slip, and shipment photo.
2. Evolus extracts structured shipment data from the uploaded documents.
3. ClaimThat performs deterministic document matching and claim calculations.
4. An AMD-hosted AI model analyzes shipment photos for visible damage.
5. An Evolus Claims Agent reviews the evidence and recommends:
   - Claim
   - No Claim
   - Human Review
6. The operator remains in control and can approve, override, or escalate.
7. ClaimThat generates a claim-ready evidence packet.

## Demo Case

The included demo shipment shows how ClaimThat handles both a quantity discrepancy and physical damage.

| Evidence | Result |
| --- | --- |
| Purchase Order | 320 units expected |
| Invoice | 320 units invoiced |
| Packing Slip | 288 units received |
| Missing Units | 32 |
| Damaged Cartons | 3 |
| Missing Goods Value | $896 |
| Damaged Goods Value | $1,944 |
| Total Recoverable Value | $2,840 |
| AI Confidence | 98% |
| Recommendation | Claim |

## Run with Docker

Build the image:

```bash
docker build -t claimthat .
```

Run ClaimThat with your local environment variables:

```bash
docker run --rm --env-file .env.local -p 3001:3000 claimthat
```

Then open:

```text
http://localhost:3001
```

The `.dockerignore` file excludes local secrets, build output, and dependencies from the Docker build context.

## Architecture

ClaimThat combines three layers:

### Evolus — Agent Orchestration

Evolus powers document extraction and claim reasoning.

The workflow uses:

- **Shipment Document Extractor** to convert uploaded shipping documents into structured data.
- **Claims Agent** to review the evidence and produce a claim recommendation with human-review flags.

### AMD — Visual Evidence Verification

Shipment photos are analyzed using an AMD-hosted **DeepSeek-V4.1-Flash** model.

The model detects:

- visible package damage
- damaged cartons
- confidence
- a damage description
- the strongest visible damage region

### ClaimThat — Deterministic Decision Logic

Financial calculations and document comparisons remain deterministic instead of being delegated to an LLM.

ClaimThat calculates:

- quantity mismatches
- missing units
- missing-goods value
- damaged-goods value
- total recoverable amount
- filing deadline
- claim status

This keeps the financial result auditable while AI is used for extraction, visual evidence, and reasoning.

## Human-in-the-Loop

ClaimThat does not automatically file a claim.

The operator can:

- Approve Claim
- Override to No Claim
- Escalate to Human Review

This keeps the user in control of the final operational decision.

## Evidence Provenance

Each recommendation is connected back to its supporting evidence, including:

- Purchase Order
- Invoice
- Packing Slip
- Shipment Photos
- AMD visual analysis
- Evolus agent review

The final Claim Packet combines the findings, calculations, supporting documents, and claim letter into one resolution-ready record.

## Technology

- Next.js 16
- TypeScript
- Tailwind CSS
- Evolus API
- Evolus Agents
- Evolus structured document extraction
- AMD Token Factory
- AMD-hosted DeepSeek-V4.1-Flash
- Vercel
- Lucide React

## Environment Variables

Create a `.env.local` file with:

```env
RADEON_API_KEY=
EVOLUS_API_KEY=
EVOLUS_APPLICATION_ID=
EVOLUS_AGENT_ID=
EVOLUS_EXTRACTOR_AGENT_ID=
EVOLUS_OUTPUT_STRUCTURE_ID=
