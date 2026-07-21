import { readFile } from "node:fs/promises";
import ts from "typescript";

const root = new URL("../", import.meta.url);

async function transpile(relativePath) {
  const source = await readFile(new URL(relativePath, root), "utf8");
  return ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  }).outputText;
}

function dataModule(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}

const reviewUrl = dataModule(await transpile("lib/review-receipt.ts"));
const issuanceUrl = dataModule(await transpile("lib/issuance-receipt.ts"));
const rehearsalSource = (await transpile("lib/demo-rehearsal.ts"))
  .replaceAll('"@/lib/review-receipt"', JSON.stringify(reviewUrl))
  .replaceAll('"@/lib/issuance-receipt"', JSON.stringify(issuanceUrl));
const rehearsalModule = await import(dataModule(rehearsalSource));
const dossier = JSON.parse(await readFile(new URL("data/demo/alpenstern-2026-winter.json", root), "utf8"));
const recordedAt = "2026-07-21T00:00:00.000Z";

const first = await rehearsalModule.createDemoRehearsalState(dossier, recordedAt);
const second = await rehearsalModule.createDemoRehearsalState(dossier, recordedAt);

if (first.run.meta.source !== "mock" || first.run.meta.response_id !== "day4-rehearsal-no-api") {
  throw new Error("The rehearsal must be explicitly labelled as a non-API fixture.");
}
if (first.review.decision !== "conditionally_approved") {
  throw new Error("The rehearsal review state is not ready for the controlled note flow.");
}
if (first.issuance.status !== "prepared_not_issued" || first.issuance.implementation_targets.transaction_hash !== null) {
  throw new Error("The rehearsal must never claim a live issuance transaction.");
}
if (first.issuance.audit.dossier_sha256 !== first.review.dossier_sha256) {
  throw new Error("The rehearsal issuance is not bound to the reviewed dossier.");
}
if (first.issuance.audit.review_receipt_sha256 !== first.review.receipt_sha256) {
  throw new Error("The rehearsal issuance is not bound to the human-review receipt.");
}
if (first.review.receipt_sha256 !== second.review.receipt_sha256 || first.issuance.manifest_sha256 !== second.issuance.manifest_sha256) {
  throw new Error("A fixed rehearsal input must produce deterministic fingerprints.");
}

console.log(JSON.stringify({
  verified: true,
  source: first.run.meta.source,
  response_id: first.run.meta.response_id,
  decision: first.review.decision,
  issuance_status: first.issuance.status,
  transaction_hash: first.issuance.implementation_targets.transaction_hash,
  dossier_sha256: first.review.dossier_sha256,
  review_receipt_sha256: first.review.receipt_sha256,
  issuance_manifest_sha256: first.issuance.manifest_sha256,
}, null, 2));
