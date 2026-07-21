import { readFile } from "node:fs/promises";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("lib/review-receipt.ts", root), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const receiptModule = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const dossier = JSON.parse(await readFile(new URL("data/evals/fjordlight-complex-reference-dossier.json", root), "utf8"));
const base = {
  dealId: dossier.deal_id,
  reviewerRole: "Demo underwriter",
  decision: "conditionally_approved",
  reviewerNote: "Conditionally acceptable after explicit review of every open item.",
  dossier,
  reviewedAt: "2026-07-20T00:00:00.000Z",
};

const first = await receiptModule.createReviewReceipt(base);
const second = await receiptModule.createReviewReceipt(base);
const changed = await receiptModule.createReviewReceipt({ ...base, reviewerNote: "A different human rationale changes the receipt." });

if (!/^[a-f0-9]{64}$/.test(first.dossier_sha256) || !/^[a-f0-9]{64}$/.test(first.receipt_sha256)) {
  throw new Error("Review hashes must be 64-character lowercase SHA-256 values.");
}
if (first.receipt_sha256 !== second.receipt_sha256) {
  throw new Error("The same review input must create the same receipt fingerprint.");
}
if (first.receipt_sha256 === changed.receipt_sha256) {
  throw new Error("Changing the reviewer rationale must change the receipt fingerprint.");
}

console.log(JSON.stringify({
  decision: first.decision,
  dossier_sha256: first.dossier_sha256,
  receipt_sha256: first.receipt_sha256,
  changed_note_receipt_sha256: changed.receipt_sha256,
  verified: true,
}, null, 2));
