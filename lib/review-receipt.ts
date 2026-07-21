import type { ReviewDecision, UnderwritingReviewRecord } from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createReviewReceipt(input: {
  dealId: string;
  reviewerRole: string;
  decision: ReviewDecision;
  reviewerNote: string;
  dossier: UnderwritingDossier;
  reviewedAt?: string;
}): Promise<UnderwritingReviewRecord> {
  const reviewedAt = input.reviewedAt || new Date().toISOString();
  const dossierSha256 = await sha256(JSON.stringify(input.dossier));
  const receiptBody = {
    deal_id: input.dealId,
    reviewer_role: input.reviewerRole.trim(),
    decision: input.decision,
    reviewer_note: input.reviewerNote.trim(),
    attestations: {
      sources_reviewed: true,
      risks_reviewed: true,
      human_decision_acknowledged: true,
    },
    reviewed_at: reviewedAt,
    dossier_sha256: dossierSha256,
  };

  return {
    ...receiptBody,
    receipt_sha256: await sha256(JSON.stringify(receiptBody)),
  };
}
