# StayFi — auditable seasonal hotel financing

StayFi turns a hotel's seasonal revenue package into an evidence-backed underwriting dossier and a draft Seasonal Revenue Note (SRN). Hotels can raise working capital before peak season; qualified investors can review the underlying evidence, risks, terms, and settlement status.

> Hackathon extension started after July 13, 2026

The pre-hackathon product was the public StayFi protocol website. The Build Week extension adds a GPT-5.6 underwriting workflow, human review checkpoints, structured evidence, and a four-screen demonstration journey.

## Day 0 status

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

Never commit `.env.local`. The current Day 0 routes use deterministic synthetic output; the next implementation step connects the schema to the OpenAI Responses API with GPT-5.6.

## Important disclaimer

This repository is a hackathon prototype. All hotels, financial figures, underwriting results, token terms, and portfolio activity in the demo are synthetic and are not an offer of securities, investment advice, or a production credit decision.
