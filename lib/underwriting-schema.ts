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
