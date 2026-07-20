# StayFi — auditable seasonal hotel financing

StayFi turns a hotel's seasonal revenue package into an evidence-backed underwriting dossier and a draft Seasonal Revenue Note (SRN). Hotels can raise working capital before peak season; qualified investors can review the underlying evidence, risks, terms, and settlement status.

> Hackathon extension started after July 13, 2026

The pre-hackathon product was the public StayFi protocol website. The Build Week extension adds a GPT-5.6 underwriting workflow, human review checkpoints, structured evidence, and a four-screen demonstration journey.

## Build Week status

- Existing StayFi website preserved from baseline commit `443b3c6`.
- Four demo routes are available:
  - `/originate`
  - `/underwriting/alpenstern-2026-winter`
  - `/notes/alpenstern-2026-winter`
  - `/portfolio`
- Underwriting contract: `schemas/underwriting.schema.json`
- Synthetic source package: `public/demo-data/`
- Frozen three-minute flow: `docs/DEMO-SCRIPT.md`
- Pre-hackathon baseline record: `docs/HACKATHON-BASELINE.md`
- Day 1 adds real multipart uploads, SHA-256 source manifests, GPT-5.6 file inputs, strict Structured Outputs, runtime validation, and browser-session handoff to the underwriting screen.
- Day 2 adds a required human-review gate, three explicit reviewer decisions, cross-screen review state, and downloadable SHA-256 audit receipts before draft note terms can advance.
- Day 3 adds a review-bound SRN issuance-preparation package with Base/USDC and ERC-3643 implementation targets, SPV and lockbox controls, a downloadable SHA-256 manifest, and an explicit `prepared_not_issued` safety state.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and choose **Launch underwriting demo**.

## OpenAI configuration

Copy `.env.example` to `.env.local` and provide an OpenAI Platform API key:

```text
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-5.6
```

Never commit `.env.local`. The underwriting service uses the OpenAI Responses API with `store: false`, explicit `reasoning.effort: "medium"`, and the `gpt-5.6` family alias, which routes to GPT-5.6 Sol. Uploaded files are limited to 8 files, 2 MB each, and 4 MB total for the Day 1 demo.

For local integration testing without an API request, set `OPENAI_MOCK_MODE=1`. Mock results are visibly labelled and this mode is off by default.

## Important disclaimer

This repository is a hackathon prototype. All hotels, financial figures, underwriting results, token terms, and portfolio activity in the demo are synthetic and are not an offer of securities, investment advice, or a production credit decision.
