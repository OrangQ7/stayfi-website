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
- Day 4 adds a deterministic, clearly labelled recording rehearsal, judge testing instructions, submission copy, a sub-three-minute English video plan, and final readiness checks.

## Judge quick test

The normal path on `/originate` uploads the included synthetic files to the GPT-5.6 underwriting endpoint. If the API is temporarily unavailable during judging, choose **Open recording rehearsal**. It seeds the frozen synthetic dossier, review receipt, and `prepared_not_issued` manifest in the current browser tab without making an API request. The rehearsal is labelled as a local fixture and is not presented as a live GPT-5.6 result.

No login, wallet, payment, or real hotel data is required.

## How we collaborated with Codex

The pre-hackathon StayFi protocol website is preserved in baseline commit `443b3c6`. Work added after the July 13 submission-period start is recorded in the subsequent commit history.

During Build Week, Codex helped inspect and preserve the existing repository, implement the four-stage product workflow, connect real multi-file uploads to GPT-5.6 through the Responses API, define and validate the strict underwriting schema, repair the uploaded-result handoff, build the complex evaluation suite and automated scoring, add the human-review receipt and SRN issuance-preparation controls, run regression checks, and prepare the demo and submission materials.

The founder retained the key product and risk decisions: focus on seasonal hotel working capital; keep evidence and contradictions visible; require an explicit human decision; treat SRNs as revenue-linked rather than guaranteed debt; keep `$STAY` separate from hotel-revenue rights; use synthetic data; and stop the prototype at `prepared_not_issued` until legal, identity, escrow, and blockchain controls exist.

GPT-5.6 performs the runtime underwriting work: it reads the submitted hotel files and returns the strict evidence-backed dossier used by later screens. Codex accelerated product design, implementation, testing, debugging, and documentation, while the repository history and the required `/feedback` Session ID document the Build Week collaboration.

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
