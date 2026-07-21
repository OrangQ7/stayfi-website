import { access, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "docs/DAY4-SUBMISSION-READINESS.md",
  "docs/VIDEO-PRODUCTION.md",
  "docs/DEVPOST-SUBMISSION.md",
  "public/submission/stayfi-youtube-thumbnail.svg",
  "public/submission/stayfi-youtube-thumbnail.png",
  "public/submission/manifest.json",
  "lib/demo-rehearsal.ts",
];

await Promise.all(requiredFiles.map((file) => access(path.join(root, file))));

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const readme = await readFile(path.join(root, "README.md"), "utf8");
const videoPlan = await readFile(path.join(root, "docs/VIDEO-PRODUCTION.md"), "utf8");
const submission = await readFile(path.join(root, "docs/DEVPOST-SUBMISSION.md"), "utf8");
const origination = await readFile(path.join(root, "components/origination-workspace.tsx"), "utf8");
const rehearsal = await readFile(path.join(root, "lib/demo-rehearsal.ts"), "utf8");
const thumbnail = await readFile(path.join(root, "public/submission/stayfi-youtube-thumbnail.png"));
const thumbnailManifest = JSON.parse(await readFile(path.join(root, "public/submission/manifest.json"), "utf8"));
const thumbnailSha256 = createHash("sha256").update(thumbnail).digest("hex");

const checks = {
  codex_collaboration_documented: readme.includes("## How we collaborated with Codex"),
  judge_fallback_documented: readme.includes("Open recording rehearsal"),
  video_under_three_minutes: videoPlan.includes("2:40–2:45") && videoPlan.includes("clear microphone audio"),
  no_live_issuance_claim: submission.includes("prepared_not_issued") && submission.includes("does not connect a wallet"),
  rehearsal_is_labeled: origination.includes("recording fallback") && origination.includes("No API request is made"),
  rehearsal_binds_review_and_issuance: rehearsal.includes("createReviewReceipt") && rehearsal.includes("createSRNIssuancePackage"),
  live_run_clears_old_review: origination.includes("sessionStorage.removeItem(reviewStorageKey(dealId))"),
  live_run_clears_old_issuance: origination.includes("sessionStorage.removeItem(issuanceStorageKey(dealId))"),
  readiness_script_registered: packageJson.scripts?.["eval:readiness"] === "node scripts/verify-day4-readiness.mjs",
  thumbnail_is_1280x720: thumbnail.readUInt32BE(16) === 1280 && thumbnail.readUInt32BE(20) === 720,
  thumbnail_manifest_matches: thumbnailManifest.sha256 === thumbnailSha256 && thumbnailManifest.bytes === thumbnail.length,
};

const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`Day 4 readiness checks failed: ${failed.join(", ")}`);
}

const trackedFiles = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);
if (trackedFiles.some((file) => /(^|\/)\.env\.local$/i.test(file))) {
  throw new Error(".env.local must not be tracked.");
}

const candidateFiles = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter((file) => /\.(?:ts|tsx|js|mjs|json|md|txt|csv|yml|yaml)$/i.test(file));
const secretPrefix = "s" + "k-";
for (const file of candidateFiles) {
  const content = await readFile(path.join(root, file), "utf8");
  if (content.includes(secretPrefix) && /sk-[A-Za-z0-9_-]{20,}/.test(content)) {
    throw new Error(`Possible OpenAI API key found in ${file}.`);
  }
}

const placeholders = submission.match(/TODO_[A-Z0-9_]+/g) || [];
console.log(JSON.stringify({
  verified: true,
  checks,
  required_files: requiredFiles.length,
  tracked_env_local: false,
  possible_api_keys_found: 0,
  pending_submission_fields: [...new Set(placeholders)],
  owner_action_required: placeholders.length > 0,
}, null, 2));
