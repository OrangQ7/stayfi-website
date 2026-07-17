import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("lib/evaluation.ts", root), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
}).outputText;
const evaluator = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const gold = JSON.parse(await readFile(new URL("data/evals/fjordlight-complex-gold.json", root), "utf8"));
const reference = JSON.parse(await readFile(new URL("data/evals/fjordlight-complex-reference-dossier.json", root), "utf8"));
for (const expectedFile of gold.expected_source_files) {
  const bytes = await readFile(new URL(`public/eval-data/fjordlight-complex/${expectedFile.file_name}`, root));
  const actualHash = createHash("sha256").update(bytes).digest("hex");
  if (actualHash !== expectedFile.sha256) {
    throw new Error(`${expectedFile.file_name} hash mismatch: ${actualHash} !== ${expectedFile.sha256}`);
  }
}
const report = evaluator.scoreUnderwritingDossier(reference, gold);

console.log(JSON.stringify(report, null, 2));
if (report.score !== 100 || report.grade !== "PASS") {
  throw new Error(`Expected reference dossier to score 100/PASS, received ${report.score}/${report.grade}`);
}

const degraded = structuredClone(reference);
degraded.normalized_metrics.forward_booked_revenue = 4_250_000;
degraded.discrepancies = [];
const degradedReport = evaluator.scoreUnderwritingDossier(degraded, gold);
if (degradedReport.score >= 100) {
  throw new Error("Expected an incorrect dossier to lose evaluation points.");
}

console.log(`Verified evaluation.ts: reference score is 100/PASS and an incorrect dossier loses points (${degradedReport.score}).`);
