import type { SRNIssuancePackage } from "@/lib/issuance-schema";
import type { UnderwritingReviewRecord } from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";

export async function sha256Json(value: unknown) {
  const serialized = JSON.stringify(value);
  const bytes = new TextEncoder().encode(serialized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createSRNIssuancePackage(input: {
  dealId: string;
  dossier: UnderwritingDossier;
  review: UnderwritingReviewRecord;
  spvDescriptor: string;
  escrowControlReference: string;
  preparedAt?: string;
}): Promise<SRNIssuancePackage> {
  if (input.review.decision !== "conditionally_approved") {
    throw new Error("A conditionally approved human review is required before preparing an issuance package.");
  }
  if (input.review.deal_id !== input.dealId || input.dossier.deal_id !== input.dealId) {
    throw new Error("The dossier, review, and issuance package must refer to the same deal.");
  }
  const currentDossierSha256 = await sha256Json(input.dossier);
  if (currentDossierSha256 !== input.review.dossier_sha256) {
    throw new Error("The dossier changed after human review. Review the current evidence before preparing issuance.");
  }

  const terms = input.dossier.recommended_terms;
  const preparedAt = input.preparedAt || new Date().toISOString();
  const manifestBody = {
    deal_id: input.dealId,
    synthetic: true as const,
    status: "prepared_not_issued" as const,
    asset: {
      instrument: "Seasonal Revenue Note" as const,
      display_name: `${input.dossier.hotel_profile.name} SRN`,
      symbol: "SRN" as const,
    },
    implementation_targets: {
      network: "Base" as const,
      token_standard: "ERC-3643 permissioned security token" as const,
      settlement_asset: "USDC" as const,
      transaction_hash: null,
    },
    eligibility: {
      investor_class: "Qualified and whitelisted investors only" as const,
      kyc_aml_required: true as const,
      transfer_restrictions_required: true as const,
    },
    legal_and_cash_controls: {
      spv_descriptor: input.spvDescriptor.trim(),
      revenue_participation_agreement_status: "draft_required" as const,
      escrow_control_reference: input.escrowControlReference.trim(),
      lockbox_status: "not_connected" as const,
    },
    terms: {
      funding_amount_usdc: terms.funding_amount_usdc,
      face_value_usdc: terms.face_value_usdc,
      revenue_share_pct: terms.revenue_share_pct,
      maturity_date: terms.maturity_date,
      eligible_revenue_pool_usdc: input.dossier.normalized_metrics.forward_booked_revenue,
    },
    fees: {
      issuance_fee_pct: 2 as const,
      issuance_fee_usdc: Number((terms.face_value_usdc * 0.02).toFixed(2)),
      settlement_fee_pct: 1 as const,
      secondary_transfer_fee_pct: 0.25 as const,
    },
    safeguards: {
      no_wallet_connected: true as const,
      no_contract_deployed: true as const,
      no_funds_transferred: true as const,
      srn_is_not_stay_token: true as const,
      performance_risk_acknowledged: true as const,
    },
    audit: {
      dossier_sha256: input.review.dossier_sha256,
      review_receipt_sha256: input.review.receipt_sha256,
    },
    prepared_at: preparedAt,
  };

  return {
    ...manifestBody,
    manifest_sha256: await sha256Json(manifestBody),
  };
}
