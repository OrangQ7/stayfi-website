import { createSRNIssuancePackage } from "@/lib/issuance-receipt";
import type { SRNIssuancePackage } from "@/lib/issuance-schema";
import { createReviewReceipt } from "@/lib/review-receipt";
import type { UnderwritingReviewRecord } from "@/lib/review-schema";
import type { StoredUnderwritingRun, UnderwritingDossier } from "@/lib/underwriting-schema";

export type DemoRehearsalState = {
  run: StoredUnderwritingRun;
  review: UnderwritingReviewRecord;
  issuance: SRNIssuancePackage;
};

export async function createDemoRehearsalState(
  dossier: UnderwritingDossier,
  recordedAt = new Date().toISOString(),
): Promise<DemoRehearsalState> {
  const review = await createReviewReceipt({
    dealId: dossier.deal_id,
    reviewerRole: "Hackathon rehearsal reviewer",
    decision: "conditionally_approved",
    reviewerNote: "Synthetic rehearsal approval after reviewing source evidence, open risks, and missing data.",
    dossier,
    reviewedAt: recordedAt,
  });
  const issuance = await createSRNIssuancePackage({
    dealId: dossier.deal_id,
    dossier,
    review,
    spvDescriptor: `${dossier.hotel_profile.name} Seasonal Revenue SPV (synthetic rehearsal)`,
    escrowControlReference: "Regulated escrow / lockbox agreement pending — rehearsal only",
    preparedAt: recordedAt,
  });

  return {
    run: {
      dossier,
      meta: {
        source: "mock",
        model: "synthetic-rehearsal-fixture",
        response_id: "day4-rehearsal-no-api",
        latency_ms: 0,
        files: dossier.source_files.map((file) => ({
          name: file.file_name,
          size: 0,
          sha256: file.sha256,
        })),
      },
    },
    review,
    issuance,
  };
}
