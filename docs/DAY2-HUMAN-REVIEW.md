# Day 2 — human review and audit receipt

## Outcome

Day 2 turns the GPT-generated underwriting dossier into a human-controlled workflow. A model may normalize documents, cite evidence, identify discrepancies, and propose terms, but it cannot unlock the note terms by itself.

## Reviewer workflow

1. Review the uploaded source manifest and evidence citations.
2. Review every discrepancy, risk flag, and missing-data item.
3. Acknowledge that the AI output is a proposal rather than a financing approval.
4. Choose one decision: request more information, conditionally approve draft terms, or decline.
5. Provide a written rationale of at least 12 characters.
6. Save and optionally download the JSON audit receipt.

Only `conditionally_approved` unlocks navigation from underwriting to note terms when `review_required` is true.

## Audit receipt

The browser creates two SHA-256 values with Web Crypto:

- `dossier_sha256` fingerprints the complete structured underwriting dossier.
- `receipt_sha256` fingerprints the deal ID, reviewer role, decision, rationale, attestations, timestamp, and dossier fingerprint.

Changing the dossier or reviewer rationale changes the corresponding fingerprint. This is an audit aid for the hackathon prototype, not a digital signature: the demo has no authenticated reviewer identity, server-side record store, or signing key.

## State and privacy

The receipt is kept in `sessionStorage` under the deal ID and is shared across the underwriting, note, and portfolio screens in the same browser tab. It is not sent to OpenAI or persisted by StayFi. Reloading the same tab preserves it; clearing session storage or opening the result in another tab removes it.

## Validation

- `npm run eval:review` verifies deterministic receipt generation and confirms that changing a rationale changes the receipt hash.
- `npm run typecheck`
- `npm run lint`
- `npm run build`
