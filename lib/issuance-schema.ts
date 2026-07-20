export type SRNIssuancePackage = {
  deal_id: string;
  synthetic: true;
  status: "prepared_not_issued";
  asset: {
    instrument: "Seasonal Revenue Note";
    display_name: string;
    symbol: "SRN";
  };
  implementation_targets: {
    network: "Base";
    token_standard: "ERC-3643 permissioned security token";
    settlement_asset: "USDC";
    transaction_hash: null;
  };
  eligibility: {
    investor_class: "Qualified and whitelisted investors only";
    kyc_aml_required: true;
    transfer_restrictions_required: true;
  };
  legal_and_cash_controls: {
    spv_descriptor: string;
    revenue_participation_agreement_status: "draft_required";
    escrow_control_reference: string;
    lockbox_status: "not_connected";
  };
  terms: {
    funding_amount_usdc: number;
    face_value_usdc: number;
    revenue_share_pct: number;
    maturity_date: string;
    eligible_revenue_pool_usdc: number;
  };
  fees: {
    issuance_fee_pct: 2;
    issuance_fee_usdc: number;
    settlement_fee_pct: 1;
    secondary_transfer_fee_pct: 0.25;
  };
  safeguards: {
    no_wallet_connected: true;
    no_contract_deployed: true;
    no_funds_transferred: true;
    srn_is_not_stay_token: true;
    performance_risk_acknowledged: true;
  };
  audit: {
    dossier_sha256: string;
    review_receipt_sha256: string;
  };
  prepared_at: string;
  manifest_sha256: string;
};

export function issuanceStorageKey(dealId: string) {
  return `stayfi:issuance:${dealId}`;
}

export function isSRNIssuancePackage(value: unknown): value is SRNIssuancePackage {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SRNIssuancePackage>;
  return (
    typeof candidate.deal_id === "string" &&
    candidate.synthetic === true &&
    candidate.status === "prepared_not_issued" &&
    candidate.asset?.instrument === "Seasonal Revenue Note" &&
    candidate.implementation_targets?.network === "Base" &&
    candidate.implementation_targets?.transaction_hash === null &&
    candidate.eligibility?.kyc_aml_required === true &&
    typeof candidate.legal_and_cash_controls?.spv_descriptor === "string" &&
    typeof candidate.legal_and_cash_controls?.escrow_control_reference === "string" &&
    typeof candidate.terms?.face_value_usdc === "number" &&
    typeof candidate.fees?.issuance_fee_usdc === "number" &&
    candidate.safeguards?.no_wallet_connected === true &&
    candidate.safeguards?.no_contract_deployed === true &&
    candidate.safeguards?.no_funds_transferred === true &&
    typeof candidate.audit?.review_receipt_sha256 === "string" &&
    typeof candidate.prepared_at === "string" &&
    typeof candidate.manifest_sha256 === "string"
  );
}
