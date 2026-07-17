# Day 1 OpenAI integration report

## Current usage inventory

| Surface | Endpoint | Model role | Prompt/output contract |
| --- | --- | --- | --- |
| `app/api/underwrite/route.ts` | Responses API | Quality-first seasonal hotel underwriting | File inputs, evidence-first underwriting prompt, strict JSON Schema |
| `scripts/verify-openai.mjs` | Responses API | Minimal access check | Exact `STAYFI_OK` text response |
| Legacy pixel-cat API routes | Responses API | Pre-existing unrelated image classification | Intentionally unchanged at `gpt-4.1-mini` |

## Target mapping

- Underwriting: `gpt-5.6` family alias, which routes to GPT-5.6 Sol. The alias is intentional because the hackathon requirement names GPT-5.6 and the returned `response.model` is recorded for the run.
- Reasoning: explicit `medium`, the balanced quality-first starting point for a multi-document credit workflow.
- Legacy pixel-cat routes: unchanged because they are unrelated pre-hackathon code and have a different latency/cost role.

## API and prompt changes

- Added a multipart route for PDF, CSV, JSON, text, spreadsheet, and Word inputs.
- Added server-side file validation and SHA-256 manifests.
- Files are sent as base64 `input_file` items in the Responses API.
- Added a lean underwriting prompt with explicit evidence, calculation, review, and non-invention rules.
- Added strict `text.format.type = "json_schema"` output and runtime dossier validation.
- Set `store: false`; the browser keeps the current result in session storage only for the local demo flow.
- Added explicit UI states for model access, invalid keys, exhausted quota, rate limits, network failures, and invalid output.
- Added a lightweight five-runs-per-ten-minutes demo limiter and a salted, privacy-preserving `safety_identifier`.

## Compatibility checks

- Chat Completions/tools: not used by the underwriting workflow.
- Structured Outputs: every object closes additional properties and requires all declared fields. Unsupported validation-only keywords are removed from the API copy while the canonical repository schema remains intact.
- File detail: the Day 1 public package is CSV/JSON, so PDF visual-detail controls are not needed for the representative flow.
- State replay: not used; every underwriting run is independent.
- Caching: no explicit cache mode; the prompt has a stable instruction prefix and a changing verified manifest.
- Sensitive data: API response storage is disabled. This remains a hackathon demo, not a production data-retention design.

## Validation

- TypeScript check passes.
- Production Next.js build passes.
- Mock multipart run accepts four files and returns a schema-shaped dossier.
- `/originate` and `/underwriting/alpenstern-2026-winter` return HTTP 200.
- Missing or invalid multipart data returns a 400-class application error instead of an unclassified server error.

## Blocker

The local machine cannot currently connect to `api.openai.com:443`, so a live GPT-5.6 trace cannot be completed from this network. The mock path validates local wiring but is visibly labelled and disabled by default. The smallest next step is to provide outbound API connectivity or test the same branch in the Vercel deployment environment.
