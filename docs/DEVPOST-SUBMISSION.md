# Devpost submission copy

Replace every `TODO` before submitting.

## Project name

StayFi — Auditable Seasonal Hotel Financing

## Tagline

Turn messy hotel revenue evidence into a human-reviewed, traceable Seasonal Revenue Note workflow.

## Category

Work & Productivity

## Project links

- Live demo: `TODO_FINAL_VERCEL_URL`
- Repository: <https://github.com/OrangQ7/stayfi-website>
- Public YouTube video: `TODO_PUBLIC_YOUTUBE_URL`
- Codex `/feedback` Session ID: `TODO_CODEX_SESSION_ID`

## Inspiration

Seasonal hotels face a timing mismatch: payroll, maintenance, inventory, and reopening costs arrive before peak-season cash. Existing financing workflows are slow and opaque, while a token alone does not make hotel revenue understandable or investable. StayFi focuses on the missing operating layer between hotel evidence and an RWA: structured underwriting, human accountability, and a continuous audit trail.

## What it does

StayFi accepts hotel profile, PMS, bank, spreadsheet, PDF, DOCX, and financing-request files. GPT-5.6 converts the uploaded package into a strict underwriting dossier containing normalized metrics, source citations, discrepancies, missing data, risk flags, confidence, and proposed Seasonal Revenue Note terms.

A human reviewer must inspect the evidence and record an explicit decision. StayFi binds the dossier and review into a SHA-256 receipt. Once conditionally approved, the app can prepare a synthetic SRN issuance manifest that records the intended SPV, Base and USDC settlement targets, ERC-3643 permission controls, qualified-investor whitelist requirements, proposed escrow lockbox, fees, and revenue waterfall.

The final investor view remains linked to the same dossier, review receipt, and issuance manifest. If the dossier or review changes, the old issuance package becomes stale. The hackathon build is deliberately `prepared_not_issued`: it does not connect a wallet, deploy a contract, mint a token, transfer funds, perform KYC, or create a legal security.

## How we built it

- Next.js 16, React 19, and TypeScript for the product workflow.
- OpenAI Responses API with GPT-5.6 for multi-file underwriting.
- Strict Structured Outputs and runtime validation for the underwriting JSON contract.
- SHA-256 source manifests, human-review receipts, and issuance fingerprints.
- Session-scoped storage with API response storage disabled for the demo.
- A complex six-file evaluation suite covering PDF, scanned PDF, XLSX, CSV, and DOCX evidence with a human gold answer and automated scoring.
- A deterministic recording rehearsal that never pretends to be a live model run.

## How we used Codex

The original StayFi protocol website existed before the submission period. During Build Week, Codex helped inspect the existing repository, preserve the baseline, design the four-stage product flow, implement the GPT-5.6 Responses API integration, define the strict underwriting schema, repair the uploaded-data handoff, create the complex evaluation suite, add human-review and issuance audit gates, write regression checks, and prepare submission materials.

The founder made the core product decisions: focus on non-peak hotel liquidity; treat the SRN as revenue-linked rather than guaranteed debt; require human approval; separate the SRN from the `$STAY` token; and stop at an honest synthetic issuance package instead of presenting unimplemented legal, identity, escrow, or blockchain controls as complete.

## Challenges we ran into

The hardest issue was preventing polished demo pages from silently falling back to frozen example values after a user uploaded different files. We changed the flow so every downstream screen uses the stored result for the current deal and refuses to substitute another dossier. We also had to make mixed-format evidence comparable while preserving contradictions, and to bind every later decision to the exact dossier version that was reviewed.

## Accomplishments we are proud of

- Real multi-file GPT-5.6 underwriting rather than a text-only chatbot.
- Evidence citations and visible uncertainty instead of unsupported financial prose.
- A human gate that blocks note progression until a decision is recorded.
- Automatic invalidation when evidence or approval changes.
- A downloadable SRN preparation package that clearly states what is and is not implemented.
- Complex evaluation data, human gold answers, and automated scoring.
- A complete, judge-testable workflow with synthetic data and no account required.

## What we learned

For financial workflows, the valuable AI output is not a confident paragraph. It is a constrained, inspectable intermediate artifact that a person can challenge. We also learned that auditability requires version binding across the entire product: source files, normalized dossier, human decision, terms, and issuance preparation must refer to the same state.

## What's next for StayFi

Next steps are authenticated reviewer identities, signed server-side audit records, hotel PMS and bank integrations, jurisdiction-specific legal review, regulated KYC/AML and investor whitelisting, a real SPV and Revenue Participation Agreement workflow, a regulated escrow/lockbox partner, independent monthly reconciliation, and only then a permissioned Base deployment. None of these production controls are claimed by the current prototype.

## Testing instructions

1. Open the live demo and choose **Launch demo**.
2. For the real AI path, upload the provided synthetic package or select files and run GPT-5.6 underwriting.
3. Review citations, discrepancies, missing data, risk flags, and proposed terms.
4. Complete the human-review attestations and save **Conditionally approved**.
5. Continue to note terms, complete the issuance safeguards, and prepare the synthetic issuance package.
6. Download the JSON manifest and open the portfolio view to verify the matching fingerprint.
7. If the API is temporarily unavailable, return to origination and choose **Open recording rehearsal**. It seeds a clearly labeled local synthetic state without an API request.

No login, wallet, payment, or real hotel data is required.
