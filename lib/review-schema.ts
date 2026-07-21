export type ReviewDecision = "needs_information" | "conditionally_approved" | "declined";

export type UnderwritingReviewRecord = {
  deal_id: string;
  reviewer_role: string;
  decision: ReviewDecision;
  reviewer_note: string;
  attestations: {
    sources_reviewed: boolean;
    risks_reviewed: boolean;
    human_decision_acknowledged: boolean;
  };
  reviewed_at: string;
  dossier_sha256: string;
  receipt_sha256: string;
};

export function reviewStorageKey(dealId: string) {
  return `stayfi:review:${dealId}`;
}

export function reviewDecisionLabel(decision: ReviewDecision) {
  if (decision === "conditionally_approved") return "Conditionally approved";
  if (decision === "needs_information") return "More information required";
  return "Declined";
}

export function isUnderwritingReviewRecord(value: unknown): value is UnderwritingReviewRecord {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UnderwritingReviewRecord>;
  return (
    typeof candidate.deal_id === "string" &&
    typeof candidate.reviewer_role === "string" &&
    ["needs_information", "conditionally_approved", "declined"].includes(candidate.decision || "") &&
    typeof candidate.reviewer_note === "string" &&
    typeof candidate.reviewed_at === "string" &&
    typeof candidate.dossier_sha256 === "string" &&
    typeof candidate.receipt_sha256 === "string" &&
    !!candidate.attestations &&
    candidate.attestations.sources_reviewed === true &&
    candidate.attestations.risks_reviewed === true &&
    candidate.attestations.human_decision_acknowledged === true
  );
}
