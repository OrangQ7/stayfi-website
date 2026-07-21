# StayFi demonstration video production sheet

Target duration: **2:40–2:45**
Required language: **English**
Format: 16:9, 1080p, clear microphone audio, no copyrighted music

## Before recording

1. Close email, wallets, API dashboards, notifications, and unrelated browser tabs.
2. Set browser zoom to 90% or 100% and use a 1920×1080 screen.
3. Open the public StayFi deployment in a private browser window.
4. Do one silent rehearsal and confirm every page loads.
5. Keep the mouse still while speaking; move only when the next click is mentioned.

## Exact shot list and narration

### 0:00–0:18 — The problem

**Screen:** StayFi homepage hero, then click **Launch demo**.

**Narration:**
“Seasonal hotels earn much of their revenue during a short peak, but they need working capital months earlier. StayFi turns hotel revenue evidence into an auditable Seasonal Revenue Note workflow for qualified investors.”

### 0:18–0:43 — Real files into GPT-5.6

**Screen:** Origination page. Point to the four synthetic sources, upload control, and GPT-5.6 action.

**Narration:**
“A hotel uploads its profile, PMS bookings, bank receipts, and financing request. GPT-5.6 reads the submitted files and returns a strict JSON dossier. The response is not stored by the API, and each source receives a SHA-256 fingerprint.”

**Recording choice:** Use the live button if it is responding reliably. Otherwise click **Open recording rehearsal** and say: “For this recording, I am opening the clearly labeled deterministic rehearsal so the remaining control flow is reproducible.”

### 0:43–1:18 — Evidence before confidence

**Screen:** Underwriting metrics, evidence ledger, discrepancy and missing-data cards.

**Narration:**
“The model separates normalized facts from evidence, gaps, and recommendations. It does not hide contradictions inside prose. Here, StayFi exposes source citations, reconciliation gaps, missing information, risk flags, proposed terms, and model confidence.”

### 1:18–1:48 — A person decides

**Screen:** Human-review control and receipt. In a live run, complete the three confirmations and conditionally approve. In rehearsal mode, show the prepared receipt.

**Narration:**
“GPT-5.6 recommends; a person decides. The reviewer must inspect sources and risks, record a rationale, and make an explicit decision. StayFi fingerprints the dossier and review together. If the evidence changes later, downstream issuance becomes stale.”

### 1:48–2:18 — Prepare, do not pretend to issue

**Screen:** Note terms, escrow waterfall, Day 3 issuance package and manifest hash.

**Narration:**
“After approval, StayFi prepares an SRN package targeting Base, USDC, ERC-3643 transfer restrictions, investor whitelisting, a deal SPV, and a proposed revenue lockbox. The prototype says prepared, not issued: no wallet is connected, no contract is deployed, and no funds move.”

### 2:18–2:38 — Investor audit trail

**Screen:** Portfolio status, timeline, review receipt and issuance manifest.

**Narration:**
“The investor view stays linked to the same evidence, human receipt, and issuance manifest. That audit trail is the product: faster preparation for seasonal hotels, with visible controls for reviewers and qualified investors.”

### 2:38–2:44 — Build Week close

**Screen:** Hold on the portfolio status.

**Narration:**
“I built this extension with Codex and GPT-5.6 during OpenAI Build Week. This is StayFi.”

## Editing notes

- Remove loading pauses, mistakes, and dead cursor time.
- Add short English captions for: `GPT-5.6 Structured Output`, `Human Review Receipt`, `Prepared — Not Issued`, and `Same Audit Trail`.
- Keep UI labels readable; do not use rapid zoom effects.
- Use hard cuts or very short dissolves. Avoid decorative transitions.
- Check the final duration after YouTube processing, not only in the editor.
- Test audio on both headphones and laptop speakers.

## Suggested YouTube metadata

**Title:** StayFi — Auditable Seasonal Hotel Financing with GPT-5.6

**Description:**
StayFi turns hotel profile, PMS, bank, and financing evidence into a structured underwriting dossier, human-review receipt, and synthetic Seasonal Revenue Note issuance package. Built with Codex and GPT-5.6 for OpenAI Build Week. This hackathon prototype uses synthetic data and does not issue securities or move funds.
