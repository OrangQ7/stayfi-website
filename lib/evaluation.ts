import type { UnderwritingDossier } from "@/lib/underwriting-schema";

export type EvaluationConcept = {
  id: string;
  label: string;
  all: string[];
  any: string[];
};

export type UnderwritingGoldStandard = {
  case_id: string;
  case_name: string;
  synthetic: boolean;
  expected_profile: {
    name: string;
    location_any: string[];
    rooms: number;
    season_start: string;
    season_end: string;
  };
  expected_metrics: UnderwritingDossier["normalized_metrics"];
  expected_terms: UnderwritingDossier["recommended_terms"];
  acceptable_risk_bands: UnderwritingDossier["risk_band"][];
  review_required: boolean;
  expected_source_files: Array<{ file_name: string; sha256: string }>;
  required_discrepancies: EvaluationConcept[];
  required_missing_data: EvaluationConcept[];
  minimum_evidence_count: number;
  tolerances: {
    money_absolute: number;
    occupancy_absolute: number;
    percentage_absolute: number;
  };
  scoring_note: string;
};

export type EvaluationCheck = {
  id: string;
  label: string;
  status: "pass" | "partial" | "fail";
  earned: number;
  possible: number;
  expected: string;
  actual: string;
};

export type EvaluationCategory = {
  id: string;
  label: string;
  earned: number;
  possible: number;
  checks: EvaluationCheck[];
};

export type UnderwritingEvaluation = {
  caseId: string;
  score: number;
  possible: 100;
  grade: "PASS" | "REVIEW" | "FAIL";
  categories: EvaluationCategory[];
  note: string;
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/(\d)[,\s](?=\d{3}\b)/g, "$1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function textMatches(actual: string, expected: string) {
  return normalize(actual) === normalize(expected);
}

function conceptMatches(text: string, concept: EvaluationConcept) {
  const normalized = normalize(text);
  return concept.all.every((term) => normalized.includes(normalize(term))) &&
    (concept.any.length === 0 || concept.any.some((term) => normalized.includes(normalize(term))));
}

function numericStatus(actual: number, expected: number, tolerance: number) {
  const difference = Math.abs(actual - expected);
  if (difference <= tolerance) return "pass" as const;
  if (difference <= tolerance * 3) return "partial" as const;
  return "fail" as const;
}

function makeCheck(
  id: string,
  label: string,
  status: EvaluationCheck["status"],
  possible: number,
  expected: string,
  actual: string,
): EvaluationCheck {
  return {
    id,
    label,
    status,
    possible,
    earned: status === "pass" ? possible : status === "partial" ? possible / 2 : 0,
    expected,
    actual,
  };
}

function category(id: string, label: string, checks: EvaluationCheck[]): EvaluationCategory {
  return {
    id,
    label,
    earned: checks.reduce((sum, check) => sum + check.earned, 0),
    possible: checks.reduce((sum, check) => sum + check.possible, 0),
    checks,
  };
}

function numericCheck(id: string, label: string, actual: number, expected: number, tolerance: number, possible: number) {
  return makeCheck(id, label, numericStatus(actual, expected, tolerance), possible, String(expected), String(actual));
}

function booleanStatus(value: boolean) {
  return value ? "pass" as const : "fail" as const;
}

export function isEvaluationPackage(dossier: UnderwritingDossier, gold: UnderwritingGoldStandard) {
  const returned = new Set(dossier.source_files.map((file) => file.file_name));
  return gold.expected_source_files.every((file) => returned.has(file.file_name));
}

export function scoreUnderwritingDossier(
  dossier: UnderwritingDossier,
  gold: UnderwritingGoldStandard,
): UnderwritingEvaluation {
  const profileChecks = [
    makeCheck("hotel_name", "Hotel name", textMatches(dossier.hotel_profile.name, gold.expected_profile.name) ? "pass" : "fail", 3, gold.expected_profile.name, dossier.hotel_profile.name),
    makeCheck("location", "Location", gold.expected_profile.location_any.some((value) => textMatches(dossier.hotel_profile.location, value)) ? "pass" : "fail", 2, gold.expected_profile.location_any.join(" or "), dossier.hotel_profile.location),
    numericCheck("rooms", "Sellable rooms", dossier.hotel_profile.rooms, gold.expected_profile.rooms, 0, 4),
    makeCheck("season_start", "Season start", booleanStatus(dossier.hotel_profile.season_start === gold.expected_profile.season_start), 3, gold.expected_profile.season_start, dossier.hotel_profile.season_start),
    makeCheck("season_end", "Season end", booleanStatus(dossier.hotel_profile.season_end === gold.expected_profile.season_end), 3, gold.expected_profile.season_end, dossier.hotel_profile.season_end),
  ];

  const metricChecks = [
    makeCheck("currency", "Currency", booleanStatus(dossier.normalized_metrics.currency === gold.expected_metrics.currency), 3, gold.expected_metrics.currency, dossier.normalized_metrics.currency),
    numericCheck("forward_revenue", "Forward net booked revenue", dossier.normalized_metrics.forward_booked_revenue, gold.expected_metrics.forward_booked_revenue, gold.tolerances.money_absolute, 8),
    numericCheck("historical_pms", "Historical PMS revenue", dossier.normalized_metrics.historical_pms_revenue, gold.expected_metrics.historical_pms_revenue, gold.tolerances.money_absolute, 6),
    numericCheck("bank_inflow", "Verified bank inflow", dossier.normalized_metrics.verified_bank_inflow, gold.expected_metrics.verified_bank_inflow, gold.tolerances.money_absolute, 6),
    numericCheck("occupancy", "Weighted occupancy", dossier.normalized_metrics.occupancy_rate, gold.expected_metrics.occupancy_rate, gold.tolerances.occupancy_absolute, 6),
    numericCheck("bank_gap", "Bank reconciliation gap", dossier.normalized_metrics.bank_reconciliation_gap_pct, gold.expected_metrics.bank_reconciliation_gap_pct, gold.tolerances.percentage_absolute, 6),
  ];

  const termChecks = [
    numericCheck("funding", "Funding amount", dossier.recommended_terms.funding_amount_usdc, gold.expected_terms.funding_amount_usdc, gold.tolerances.money_absolute, 3),
    numericCheck("face", "Face value", dossier.recommended_terms.face_value_usdc, gold.expected_terms.face_value_usdc, gold.tolerances.money_absolute, 3),
    numericCheck("discount", "Issue discount", dossier.recommended_terms.discount_pct, gold.expected_terms.discount_pct, gold.tolerances.percentage_absolute, 3),
    numericCheck("revenue_share", "Revenue share", dossier.recommended_terms.revenue_share_pct, gold.expected_terms.revenue_share_pct, gold.tolerances.percentage_absolute, 3),
    makeCheck("maturity", "Maturity date", booleanStatus(dossier.recommended_terms.maturity_date === gold.expected_terms.maturity_date), 3, gold.expected_terms.maturity_date, dossier.recommended_terms.maturity_date),
  ];

  const discrepancyText = dossier.discrepancies
    .map((item) => `${item.code} ${item.summary} ${item.recommended_action}`)
    .join(" \n ");
  const missingText = dossier.missing_data.join(" \n ");
  const riskChecks: EvaluationCheck[] = [
    makeCheck("risk_band", "Risk band", booleanStatus(gold.acceptable_risk_bands.includes(dossier.risk_band)), 3, gold.acceptable_risk_bands.join(" or "), dossier.risk_band),
    makeCheck("review_required", "Human review required", booleanStatus(dossier.review_required === gold.review_required), 3, String(gold.review_required), String(dossier.review_required)),
    ...gold.required_discrepancies.map((concept) => makeCheck(`discrepancy_${concept.id}`, concept.label, booleanStatus(conceptMatches(discrepancyText, concept)), 2, "identified as a discrepancy", conceptMatches(discrepancyText, concept) ? "identified" : "not identified")),
    ...gold.required_missing_data.map((concept) => makeCheck(`missing_${concept.id}`, concept.label, booleanStatus(conceptMatches(missingText, concept)), 2, "listed as missing", conceptMatches(missingText, concept) ? "listed" : "not listed")),
  ];

  const expectedSources = new Map(gold.expected_source_files.map((file) => [file.file_name, file.sha256]));
  const returnedSources = new Map(dossier.source_files.map((file) => [file.file_name, file.sha256]));
  const covered = gold.expected_source_files.filter((file) => returnedSources.has(file.file_name)).length;
  const correctHashes = gold.expected_source_files.filter((file) => returnedSources.get(file.file_name) === file.sha256).length;
  const unexpected = dossier.source_files.filter((file) => !expectedSources.has(file.file_name));
  const evidenceNamesValid = dossier.evidence.every((item) => expectedSources.has(item.file_name));
  const evidenceLocated = dossier.evidence.every((item) => item.locator.trim().length > 0 && item.excerpt.trim().length > 0);
  const auditChecks = [
    makeCheck("source_coverage", "Expected source files", covered === gold.expected_source_files.length ? "pass" : covered > 0 ? "partial" : "fail", 4, `${gold.expected_source_files.length} files`, `${covered} files`),
    makeCheck("source_hashes", "Source hashes", correctHashes === gold.expected_source_files.length ? "pass" : correctHashes > 0 ? "partial" : "fail", 2, `${gold.expected_source_files.length} exact hashes`, `${correctHashes} exact hashes`),
    makeCheck("no_unexpected_sources", "No invented source files", booleanStatus(unexpected.length === 0), 2, "0 unexpected", String(unexpected.length)),
    makeCheck("evidence_count", "Evidence citation count", dossier.evidence.length >= gold.minimum_evidence_count ? "pass" : dossier.evidence.length >= Math.ceil(gold.minimum_evidence_count / 2) ? "partial" : "fail", 3, `at least ${gold.minimum_evidence_count}`, String(dossier.evidence.length)),
    makeCheck("evidence_file_names", "Evidence cites submitted files", booleanStatus(evidenceNamesValid), 2, "all citations use submitted files", evidenceNamesValid ? "all valid" : "invalid file reference found"),
    makeCheck("evidence_locators", "Evidence has locators and excerpts", booleanStatus(evidenceLocated), 2, "all citations located", evidenceLocated ? "all located" : "empty locator or excerpt found"),
  ];

  const categories = [
    category("profile", "Property identity", profileChecks),
    category("metrics", "Financial normalization", metricChecks),
    category("terms", "Proposed terms", termChecks),
    category("risk", "Risks and review", riskChecks),
    category("audit", "Auditability", auditChecks),
  ];
  const score = Math.round(categories.reduce((sum, item) => sum + item.earned, 0) * 10) / 10;

  return {
    caseId: gold.case_id,
    score,
    possible: 100,
    grade: score >= 90 ? "PASS" : score >= 75 ? "REVIEW" : "FAIL",
    categories,
    note: gold.scoring_note,
  };
}
