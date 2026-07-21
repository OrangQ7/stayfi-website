import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("lib/issuance-receipt.ts", root), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const issuanceModule = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const dossier = JSON.parse(await readFile(new URL("data/evals/fjordlight-complex-reference-dossier.json", root), "utf8"));
const dossierSha256 = createHash("sha256").update(JSON.stringify(dossier)).digest("hex");
const review = {
  deal_id: dossier.deal_id,
  reviewer_role: "Demo underwriter",
  decision: "conditionally_approved",
  reviewer_note: "Approved for a synthetic issuance preparation test only.",
  attestations: {
    sources_reviewed: true,
    risks_reviewed: true,
    human_decision_acknowledged: true,
  },
  reviewed_at: "2026-07-20T00:00:00.000Z",
  dossier_sha256: dossierSha256,
  receipt_sha256: "b".repeat(64),
};
const base = {
  dealId: dossier.deal_id,
  dossier,
  review,
  spvDescriptor: "Fjordlight Seasonal Revenue SPV (synthetic draft)",
  escrowControlReference: "Regulated escrow agreement pending",
  preparedAt: "2026-07-20T01:00:00.000Z",
};

const first = await issuanceModule.createSRNIssuancePackage(base);
const second = await issuanceModule.createSRNIssuancePackage(base);
const changed = await issuanceModule.createSRNIssuancePackage({
  ...base,
  escrowControlReference: "A different escrow reference must change the fingerprint",
});

if (!/^[a-f0-9]{64}$/.test(first.manifest_sha256)) {
  throw new Error("The issuance manifest hash must be a 64-character lowercase SHA-256 value.");
}
if (first.manifest_sha256 !== second.manifest_sha256) {
  throw new Error("The same issuance input must create the same manifest fingerprint.");
}
if (first.manifest_sha256 === changed.manifest_sha256) {
  throw new Error("Changing a cash-control reference must change the manifest fingerprint.");
}
if (first.status !== "prepared_not_issued" || first.implementation_targets.transaction_hash !== null) {
  throw new Error("Day 3 must never claim that a synthetic package was issued on-chain.");
}
if (first.fees.issuance_fee_usdc !== Number((first.terms.face_value_usdc * 0.02).toFixed(2))) {
  throw new Error("The whitepaper-aligned 2% issuance fee calculation is incorrect.");
}

let declinedBlocked = false;
try {
  await issuanceModule.createSRNIssuancePackage({ ...base, review: { ...review, decision: "declined" } });
} catch {
  declinedBlocked = true;
}
if (!declinedBlocked) {
  throw new Error("A declined human review must block issuance preparation.");
}

let changedDossierBlocked = false;
try {
  await issuanceModule.createSRNIssuancePackage({
    ...base,
    dossier: { ...dossier, investor_summary: `${dossier.investor_summary} changed after review` },
  });
} catch {
  changedDossierBlocked = true;
}
if (!changedDossierBlocked) {
  throw new Error("A dossier changed after human review must block issuance preparation.");
}

console.log(JSON.stringify({
  status: first.status,
  network: first.implementation_targets.network,
  token_standard: first.implementation_targets.token_standard,
  issuance_fee_usdc: first.fees.issuance_fee_usdc,
  manifest_sha256: first.manifest_sha256,
  changed_control_manifest_sha256: changed.manifest_sha256,
  declined_review_blocked: declinedBlocked,
  changed_dossier_blocked: changedDossierBlocked,
  verified: true,
}, null, 2));
