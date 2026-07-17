"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { Metric, PageIntro } from "@/components/workspace-shell";
import {
  isUnderwritingDossier,
  underwritingStorageKey,
  type StoredUnderwritingRun,
  type UnderwritingDossier,
} from "@/lib/underwriting-schema";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function readStoredRun(raw: string | null): StoredUnderwritingRun | null {
  try {
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUnderwritingRun;
    if (!isUnderwritingDossier(parsed.dossier) || !parsed.meta) return null;
    return parsed;
  } catch {
    return null;
  }
}

function subscribeToSessionStorage() {
  return () => undefined;
}

export function UnderwritingResult({ dealId, fallback }: { dealId: string; fallback: UnderwritingDossier }) {
  const storedValue = useSyncExternalStore(
    subscribeToSessionStorage,
    () => sessionStorage.getItem(underwritingStorageKey(dealId)),
    () => null,
  );
  const storedRun = useMemo(() => readStoredRun(storedValue), [storedValue]);

  const dossier = storedRun?.dossier ?? fallback;
  const meta = storedRun?.meta;
  const gap = dossier.normalized_metrics.bank_reconciliation_gap_pct;
  const fundingRatio = dossier.normalized_metrics.forward_booked_revenue > 0
    ? (dossier.recommended_terms.funding_amount_usdc / dossier.normalized_metrics.forward_booked_revenue) * 100
    : 0;
  const primaryDiscrepancy = dossier.discrepancies[0];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <PageIntro
          eyebrow={`Underwriting dossier · ${dealId}`}
          title="Evidence before confidence."
          body="The structured dossier separates normalized facts, source evidence, discrepancies, risk flags, and proposed terms so a reviewer can see why the recommendation exists."
        />
        <div className={`border px-4 py-3 text-right ${meta?.source === "openai" ? "border-emerald-300/25 bg-emerald-300/10" : meta?.source === "mock" ? "border-sky-300/25 bg-sky-300/10" : "border-amber-300/25 bg-amber-300/10"}`}>
          <p className="text-[10px] font-black uppercase text-white/45">Structured output</p>
          <p className="mt-1 text-sm font-black">
            {meta?.source === "openai" ? `Live · ${meta.model}` : meta?.source === "mock" ? "Local integration test" : "Frozen synthetic dossier"}
          </p>
          {meta ? <p className="mt-1 text-[10px] text-white/35">{(meta.latency_ms / 1000).toFixed(1)}s · {meta.response_id}</p> : null}
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Forward bookings" value={money.format(dossier.normalized_metrics.forward_booked_revenue)} detail={`${dossier.hotel_profile.season_start} to ${dossier.hotel_profile.season_end}`} />
        <Metric label="Requested capital" value={money.format(dossier.recommended_terms.funding_amount_usdc)} detail={`${fundingRatio.toFixed(1)}% of forward bookings`} />
        <Metric label="Risk band" value={dossier.risk_band} detail="Policy recommendation" />
        <Metric label="Model confidence" value={`${Math.round(dossier.confidence * 100)}%`} detail="Not an approval decision" />
      </div>

      {meta ? (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border border-white/10 bg-white/[0.02] px-4 py-3 text-[11px] text-white/42">
          <span className="font-black uppercase text-white/65">Run evidence</span>
          <span>{meta.files.length} uploaded files</span>
          {meta.usage ? <span>{meta.usage.total_tokens.toLocaleString()} total tokens</span> : null}
          <span>Response storage disabled</span>
          <Link className="ml-auto font-black uppercase text-[#75A7FF] hover:text-white" href="/originate">Run another package</Link>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="border border-white/10 bg-white/[0.02] p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-black">Evidence ledger</h2>
            <span className="text-xs font-bold text-white/35">{dossier.evidence.length} cited claims</span>
          </div>
          <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
            {dossier.evidence.length > 0 ? dossier.evidence.map((item, index) => (
              <article className="py-5" key={`${item.file_name}-${item.claim}`}>
                <div className="flex gap-4">
                  <span className="text-xs font-black text-[#75A7FF]">E{index + 1}</span>
                  <div>
                    <p className="font-bold leading-6">{item.claim}</p>
                    <p className="mt-2 text-xs text-white/40">{item.file_name} · {item.locator}</p>
                    <p className="mt-3 border-l-2 border-white/15 pl-3 text-sm leading-6 text-white/55">{item.excerpt}</p>
                  </div>
                </div>
              </article>
            )) : <p className="py-5 text-sm text-white/45">No claims could be evidenced from the submitted package.</p>}
          </div>
        </section>

        <div className="space-y-6">
          <section className={`border p-6 ${dossier.review_required ? "border-amber-300/35 bg-amber-300/10" : "border-emerald-300/30 bg-emerald-300/10"}`}>
            <div className="flex items-center justify-between gap-4">
              <p className={`text-xs font-black uppercase tracking-[0.12em] ${dossier.review_required ? "text-amber-200" : "text-emerald-200"}`}>
                {dossier.review_required ? "Human review required" : "Ready for reviewer approval"}
              </p>
              <span className={`px-2 py-1 text-xs font-black text-black ${dossier.review_required ? "bg-amber-200" : "bg-emerald-200"}`}>{gap.toFixed(1)}% GAP</span>
            </div>
            <h2 className="mt-5 text-2xl font-black">
              {primaryDiscrepancy ? primaryDiscrepancy.summary : "No material source discrepancy was identified."}
            </h2>
            {primaryDiscrepancy ? <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-white/70">Action: {primaryDiscrepancy.recommended_action}</p> : null}
          </section>

          <section className="border border-white/10 bg-white/[0.02] p-6">
            <p className="text-xs font-black uppercase text-white/40">Risk flags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {dossier.risk_flags.length > 0 ? dossier.risk_flags.map((flag) => <span className="border border-white/15 bg-black px-3 py-2 text-xs font-bold text-white/65" key={flag}>{flag}</span>) : <span className="text-sm text-white/45">No explicit risk flags returned.</span>}
            </div>
            <p className="mt-6 text-xs font-black uppercase text-white/40">Missing data</p>
            <ul className="mt-3 space-y-2 text-sm text-white/65">
              {dossier.missing_data.length > 0 ? dossier.missing_data.map((item) => <li key={item}>• {item}</li>) : <li>None reported</li>}
            </ul>
          </section>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
        <p className="max-w-2xl text-xs leading-5 text-white/35">{dossier.investor_summary}</p>
        <Link className="bg-[#0B63FF] px-6 py-4 text-sm font-black uppercase tracking-[0.06em] transition hover:bg-white hover:text-black" href={`/notes/${dealId}`}>Continue to note terms →</Link>
      </div>
    </section>
  );
}
