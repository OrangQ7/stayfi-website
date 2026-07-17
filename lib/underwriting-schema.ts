export type UnderwritingRiskBand =
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C"
  | "decline";

export type UnderwritingDossier = {
  deal_id: string;
  synthetic: boolean;
  hotel_profile: {
    name: string;
    location: string;
    rooms: number;
    season_start: string;
    season_end: string;
  };
  source_files: Array<{
    file_name: string;
    category: "hotel_profile" | "pms" | "bank" | "financing_request" | "other";
    sha256: string;
    synthetic: boolean;
  }>;
  normalized_metrics: {
    currency: "USD" | "USDC";
    forward_booked_revenue: number;
    historical_pms_revenue: number;
    verified_bank_inflow: number;
    occupancy_rate: number;
    bank_reconciliation_gap_pct: number;
  };
  evidence: Array<{
    claim: string;
    file_name: string;
    locator: string;
    excerpt: string;
  }>;
  missing_data: string[];
  discrepancies: Array<{
    code: string;
    severity: "low" | "medium" | "high";
    summary: string;
    recommended_action: string;
  }>;
  risk_flags: string[];
  risk_band: UnderwritingRiskBand;
  confidence: number;
  recommended_terms: {
    funding_amount_usdc: number;
    face_value_usdc: number;
    discount_pct: number;
    revenue_share_pct: number;
    maturity_date: string;
  };
  review_required: boolean;
  investor_summary: string;
};

export type UnderwritingRunMeta = {
  source: "openai" | "mock";
  model: string;
  response_id: string;
  latency_ms: number;
  files: Array<{
    name: string;
    size: number;
    sha256: string;
  }>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
  };
};

export type StoredUnderwritingRun = {
  dossier: UnderwritingDossier;
  meta: UnderwritingRunMeta;
};

export function underwritingStorageKey(dealId: string) {
  return `stayfi:underwriting:${dealId}`;
}

export function isUnderwritingDossier(value: unknown): value is UnderwritingDossier {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<UnderwritingDossier>;
  return (
    typeof candidate.deal_id === "string" &&
    typeof candidate.synthetic === "boolean" &&
    !!candidate.hotel_profile &&
    typeof candidate.hotel_profile.name === "string" &&
    typeof candidate.hotel_profile.rooms === "number" &&
    Array.isArray(candidate.source_files) &&
    !!candidate.normalized_metrics &&
    typeof candidate.normalized_metrics.forward_booked_revenue === "number" &&
    Array.isArray(candidate.evidence) &&
    Array.isArray(candidate.missing_data) &&
    Array.isArray(candidate.discrepancies) &&
    Array.isArray(candidate.risk_flags) &&
    typeof candidate.risk_band === "string" &&
    typeof candidate.confidence === "number" &&
    !!candidate.recommended_terms &&
    typeof candidate.recommended_terms.funding_amount_usdc === "number" &&
    typeof candidate.review_required === "boolean" &&
    typeof candidate.investor_summary === "string"
  );
}
