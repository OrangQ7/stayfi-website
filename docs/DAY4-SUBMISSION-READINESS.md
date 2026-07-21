# Day 4 — submission and demo readiness

Day 4 turns the working prototype into a judge-ready submission without adding live financial activity.

## Official deadline and required materials

The official rules list the submission deadline as **July 21, 2026 at 5:00 PM PDT**, which is **July 22, 2026 at 8:00 AM in Asia/Shanghai**.

The submission needs:

- a category: **Work & Productivity**;
- an English project description;
- a public YouTube demonstration video under three minutes;
- clear audio explaining the product and the use of Codex and GPT-5.6;
- a code repository URL;
- a free, working test URL or build;
- a README explaining collaboration with Codex;
- the `/feedback` Codex Session ID for the main project task.

Source checked July 21, 2026: <https://openai.devpost.com/rules>

## Day 4 product addition

The origination screen now includes **Open recording rehearsal**. It creates a deterministic browser-session state containing:

1. the frozen synthetic Alpenstern dossier;
2. a conditionally approved synthetic human-review receipt;
3. a `prepared_not_issued` SRN manifest bound to that receipt.

The rehearsal makes recording resilient to API latency or rate limits. It is visibly marked as a local rehearsal fixture and does not call OpenAI. The normal uploader remains the proof of the real GPT-5.6 workflow.

## Final owner actions

- [ ] Record the English narration in `VIDEO-PRODUCTION.md`.
- [ ] Keep the final export below 2:55; target 2:40–2:45.
- [ ] Do not use copyrighted music or show private browser tabs, keys, email, wallet addresses, or real hotel data.
- [ ] Upload the video publicly to YouTube and test it in a signed-out window.
- [ ] Push the final branch and confirm the Vercel deployment is Ready.
- [ ] Confirm the repository is public, or share a private repository with the required judging addresses.
- [ ] Run `/feedback` in the main Codex project task and copy the Session ID.
- [ ] Replace every `TODO` placeholder in `DEVPOST-SUBMISSION.md`.
- [ ] Test the public app in a clean browser session.
- [ ] Submit before the deadline and save a screenshot of the confirmation.

## Final automated checks

```bash
npm run eval:readiness
npm run eval:rehearsal
npm run eval:fjordlight
npm run eval:review
npm run eval:issuance
npm run typecheck
npm run lint
npm run build
```
