"use client";

import Link from "next/link";
import { Metric, PageIntro } from "@/components/workspace-shell";
import { reviewDecisionLabel } from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import { useNoteIssuance } from "@/lib/use-note-issuance";
import { useStoredUnderwritingRun } from "@/lib/use-stored-underwriting-run";
import { useUnderwritingReview } from "@/lib/use-underwriting-review";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function parseDate(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function displayDate(value: Date | string) {
  const date = typeof value === "string" ? parseDate(value) : value;
  return Number.isNaN(date.valueOf())
    ? String(value)
    : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function PortfolioResult({ dealId, fallback }: { dealId: string; fallback: UnderwritingDossier | null }) {
  const { run, ready } = useStoredUnderwritingRun(dealId);
  const { review } = useUnderwritingReview(dealId);
  const dossier = run?.dossier ?? fallback;
  const { issuance, isCurrent: issuanceCurrent } = useNoteIssuance(dealId, dossier, review);

  if (!ready) return <section className="mx-auto max-w-7xl px-5 py-20 text-sm text-white/55 sm:px-8">Loading this portfolio view…</section>;
  if (!dossier) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="border border-rose-300/35 bg-rose-300/10 p-7">
          <p className="text-xs font-black uppercase text-rose-200">No matching underwriting run</p>
          <h1 className="mt-4 text-3xl font-black">A demo portfolio was not substituted.</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">Analyze the hotel package again in this browser tab to recreate the linked views.</p>
          <Link className="mt-6 inline-block bg-white px-5 py-3 text-xs font-black uppercase text-black" href="/originate">Return to upload</Link>
        </div>
      </section>
    );
  }

  const terms = dossier.recommended_terms;
  const allocation = Math.min(25_000, terms.funding_amount_usdc);
  const issuePrice = Math.max(0.01, 1 - terms.discount_pct / 100);
  const faceAllocation = allocation / issuePrice;
  const projectedUplift = faceAllocation - allocation;
  const seasonStart = parseDate(dossier.hotel_profile.season_start);
  const firstSettlement = new Date(seasonStart);
  firstSettlement.setUTCDate(firstSettlement.getUTCDate() + 45);
  const gap = dossier.normalized_metrics.bank_reconciliation_gap_pct;
  const reviewApproved = review?.decision === "conditionally_approved";

  const timeline = [
    [displayDate(new Date(seasonStart.valueOf() - 45 * 86_400_000)), "Issuance package prepared", issuanceCurrent ? `${money.format(terms.funding_amount_usdc)} synthetic Base/USDC package fingerprinted. No transaction was submitted.` : "Waiting for a current issuance manifest linked to the human-review receipt.", issuanceCurrent ? "complete" : "upcoming"],
    [displayDate(seasonStart), "Season opens", "Eligible room revenue begins flowing to the proposed controlled account.", "upcoming"],
    [displayDate(firstSettlement), "First reconciliation", "PMS, bank, refunds, and taxes are matched before any investor distribution.", "upcoming"],
    [displayDate(terms.maturity_date), "Final maturity", `Remaining ${money.format(terms.face_value_usdc)} face value becomes due under the draft terms.`, "upcoming"],
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <PageIntro
        eyebrow={`Investor transparency · ${dealId}`}
        title="The audit trail continues after underwriting."
        body={`This synthetic investor view remains linked to the same ${dossier.hotel_profile.name} dossier and its unresolved review items.`}
      />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Portfolio value" value={money.format(allocation)} detail="Synthetic allocation" />
        <Metric label="SRN face allocation" value={money.format(faceAllocation)} detail={`Based on ${terms.discount_pct}% issue discount`} />
        <Metric label="Projected gross uplift" value={money.format(projectedUplift)} detail="Before fees, defaults, or delay" />
        <Metric label="First reconciliation" value={displayDate(firstSettlement)} detail="Illustrative schedule" />
      </div>

      {!issuanceCurrent ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-amber-300/30 bg-amber-300/10 p-5">
          <div>
            <p className="text-xs font-black uppercase text-amber-200">Portfolio preview only · issuance not prepared</p>
            <p className="mt-2 text-sm text-white/60">{reviewApproved ? "The human review is approved, but no current Day 3 issuance package is linked to it." : review ? `${reviewDecisionLabel(review.decision)}: ${review.reviewer_note}` : "No human review receipt exists for this dossier."}</p>
          </div>
          <Link className="border border-white/20 px-4 py-3 text-xs font-black uppercase hover:bg-white hover:text-black" href={reviewApproved ? `/notes/${dealId}#issuance-package` : `/underwriting/${dealId}`}>{reviewApproved ? "Prepare issuance package" : "Return to review"}</Link>
        </div>
      ) : null}

      <section className="mt-8 overflow-hidden border border-white/10 bg-white/[0.02]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-black uppercase text-[#75A7FF]">{dossier.hotel_profile.name} SRN</p>
            <h2 className="mt-2 text-2xl font-black">{dossier.hotel_profile.name} · {dossier.hotel_profile.location}</h2>
          </div>
          <span className={`border px-3 py-2 text-xs font-black uppercase ${issuanceCurrent ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200" : "border-amber-300/30 bg-amber-300/10 text-amber-200"}`}>
            {issuanceCurrent ? "Prepared · not issued" : reviewApproved ? "Issuance package open" : "Review gate open"}
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase text-white/40">Settlement timeline</p>
            <div className="mt-5">
              {timeline.map(([date, title, body, status], index) => (
                <article className="relative grid grid-cols-[auto_1fr] gap-4 pb-7 last:pb-0" key={`${date}-${title}`}>
                  <div className="flex flex-col items-center">
                    <span className={`mt-1 h-3 w-3 rounded-full ${status === "complete" ? "bg-emerald-300" : "border border-white/30 bg-black"}`} />
                    {index < timeline.length - 1 ? <span className="h-full w-px bg-white/10" /> : null}
                  </div>
                  <div><p className="text-xs font-bold text-white/35">{date}</p><h3 className="mt-1 font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-white/48">{body}</p></div>
                </article>
              ))}
            </div>
          </div>

          <aside className="border-t border-white/10 bg-black/40 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase text-white/40">Evidence state · current run</p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Source package</span><span className="font-bold text-emerald-300">{dossier.source_files.length} files in dossier</span></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Evidence citations</span><span className="font-bold text-white/75">{dossier.evidence.length}</span></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">PMS-bank review</span><span className={gap > 0 ? "font-bold text-amber-200" : "font-bold text-emerald-300"}>{gap.toFixed(1)}% gap</span></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Open data items</span><span className={dossier.missing_data.length ? "font-bold text-amber-200" : "font-bold text-emerald-300"}>{dossier.missing_data.length}</span></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Human review</span><span className={reviewApproved ? "font-bold text-emerald-300" : "font-bold text-amber-200"}>{review ? reviewDecisionLabel(review.decision) : "Not recorded"}</span></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">SRN package</span><span className={issuanceCurrent ? "font-bold text-emerald-300" : "font-bold text-amber-200"}>{issuanceCurrent ? "Prepared · no transaction" : "Not prepared"}</span></div>
            </div>
            {review ? <p className="mt-4 break-all font-mono text-[10px] leading-5 text-white/35">Receipt SHA-256 · {review.receipt_sha256}</p> : null}
            {issuance && issuanceCurrent ? (
              <div className="mt-4 border border-[#0B63FF]/25 bg-[#0B63FF]/10 p-3 text-xs leading-5 text-white/55">
                <p><strong className="text-white/80">Implementation target:</strong> Base · USDC · ERC-3643</p>
                <p><strong className="text-white/80">Investor control:</strong> KYC/AML and whitelist required</p>
                <p><strong className="text-white/80">Cash control:</strong> {issuance.legal_and_cash_controls.lockbox_status.replace("_", " ")}</p>
                <p className="mt-2 break-all font-mono text-[10px] text-white/35">Manifest SHA-256 · {issuance.manifest_sha256}</p>
              </div>
            ) : null}
            <Link className="mt-7 block border border-white/20 px-5 py-4 text-center text-xs font-black uppercase transition hover:bg-white hover:text-black" href={`/underwriting/${dealId}`}>Open this run’s evidence</Link>
          </aside>
        </div>
      </section>

      <p className="mt-6 text-xs leading-5 text-white/30">All allocations and schedules on this screen are synthetic. They are derived from this run’s proposed terms, not an investment offer or realized-performance claim.</p>
    </section>
  );
}
