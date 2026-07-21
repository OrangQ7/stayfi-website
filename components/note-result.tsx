"use client";

import Link from "next/link";
import { IssuancePackagePanel } from "@/components/issuance-package-panel";
import { Metric, PageIntro } from "@/components/workspace-shell";
import { reviewDecisionLabel } from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import { useStoredUnderwritingRun } from "@/lib/use-stored-underwriting-run";
import { useNoteIssuance } from "@/lib/use-note-issuance";
import { useUnderwritingReview } from "@/lib/use-underwriting-review";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function displayDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.valueOf())
    ? value
    : new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
}

export function NoteResult({ dealId, fallback }: { dealId: string; fallback: UnderwritingDossier | null }) {
  const { run, ready } = useStoredUnderwritingRun(dealId);
  const { review } = useUnderwritingReview(dealId);
  const dossier = run?.dossier ?? fallback;
  const { isCurrent: issuanceCurrent } = useNoteIssuance(dealId, dossier, review);

  if (!ready) return <section className="mx-auto max-w-7xl px-5 py-20 text-sm text-white/55 sm:px-8">Loading this note draft…</section>;
  if (!dossier) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="border border-rose-300/35 bg-rose-300/10 p-7">
          <p className="text-xs font-black uppercase text-rose-200">No matching underwriting run</p>
          <h1 className="mt-4 text-3xl font-black">A demo note was not substituted.</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">Return to the uploader and analyze the package again in this browser tab.</p>
          <Link className="mt-6 inline-block bg-white px-5 py-3 text-xs font-black uppercase text-black" href="/originate">Return to upload</Link>
        </div>
      </section>
    );
  }

  const terms = dossier.recommended_terms;
  const grossUplift = terms.funding_amount_usdc > 0
    ? (terms.face_value_usdc / terms.funding_amount_usdc - 1) * 100
    : 0;
  const reviewApproved = !dossier.review_required || review?.decision === "conditionally_approved";
  const humanReviewApproved = review?.decision === "conditionally_approved";
  const issueBlocker = !review && dossier.review_required
    ? "Human review has not been completed."
    : review?.decision === "needs_information"
      ? `Reviewer requested more information: ${review.reviewer_note}`
      : review?.decision === "declined"
        ? `Reviewer declined the package: ${review.reviewer_note}`
        : dossier.discrepancies[0]?.recommended_action || dossier.missing_data[0] || "Human approval is still required before issuance.";

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <PageIntro
        eyebrow={`Conditional SRN draft · ${dealId}`}
        title="Turn the reviewed dossier into legible terms."
        body={`This draft is generated from the same ${dossier.hotel_profile.name} underwriting result shown on the previous page. No frozen-case values are substituted.`}
      />

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Hotel receives" value={money.format(terms.funding_amount_usdc)} detail="Proposed pre-season capital" />
        <Metric label="SRN face value" value={money.format(terms.face_value_usdc)} detail="Due through the waterfall" />
        <Metric label="Issue discount" value={`${terms.discount_pct}%`} detail={`${grossUplift.toFixed(2)}% gross uplift on funded amount`} />
        <Metric label="Maturity" value={displayDate(terms.maturity_date)} detail={`After season ending ${displayDate(dossier.hotel_profile.season_end)}`} />
      </div>

      <section className={`mt-4 border px-5 py-4 ${reviewApproved ? "border-emerald-300/25 bg-emerald-300/10" : "border-amber-300/25 bg-amber-300/10"}`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">Human review gate</p>
            <p className="mt-1 text-sm font-black">{review ? reviewDecisionLabel(review.decision) : dossier.review_required ? "Not reviewed" : "Review not required"}</p>
          </div>
          {review ? <p className="font-mono text-[10px] text-white/45" title={review.receipt_sha256}>Receipt {review.receipt_sha256.slice(0, 20)}…</p> : null}
        </div>
        {review ? <p className="mt-3 text-xs leading-5 text-white/55">{review.reviewer_role} · {new Date(review.reviewed_at).toLocaleString()} · {review.reviewer_note}</p> : null}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Draft instrument · from current run</p>
          <h2 className="mt-5 text-4xl font-black">{dossier.hotel_profile.name} SRN</h2>
          <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-sm">
            {[
              ["Borrower", `${dossier.hotel_profile.name} Seasonal SPV (demo)`],
              ["Property", `${dossier.hotel_profile.rooms} rooms · ${dossier.hotel_profile.location}`],
              ["Settlement asset", dossier.normalized_metrics.currency],
              ["Revenue share", `${terms.revenue_share_pct}% of eligible room receipts`],
              ["Risk band", dossier.risk_band],
              ["Evidence state", dossier.review_required ? "Conditional · reviewer action open" : "Ready for reviewer approval"],
            ].map(([label, value]) => (
              <div className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-4" key={label}>
                <dt className="text-white/38">{label}</dt>
                <dd className="text-right font-bold text-white/75">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="border border-[#0B63FF]/35 bg-[#0B63FF]/10 p-6 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Proposed escrow waterfall</p>
          <div className="mt-7 space-y-3">
            {[
              ["01", "Eligible room revenue", "Receipts enter the controlled collection account."],
              ["02", "Taxes and refunds", "Excluded amounts are removed before note settlement."],
              ["03", "SRN repayment", `${terms.revenue_share_pct}% of eligible receipts flows toward the ${money.format(terms.face_value_usdc)} face value.`],
              ["04", "Hotel operating account", "Remaining eligible cash returns to the operator."],
            ].map(([number, title, body]) => (
              <article className="grid grid-cols-[auto_1fr] gap-4 border border-white/10 bg-black/35 p-4" key={number}>
                <span className="text-xs font-black text-[#75A7FF]">{number}</span>
                <div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-white/48">{body}</p></div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <IssuancePackagePanel dealId={dealId} dossier={dossier} review={review} />

      <div className={`mt-8 flex flex-wrap items-center justify-between gap-4 border p-5 ${issuanceCurrent ? "border-emerald-300/25 bg-emerald-300/10" : "border-amber-300/25 bg-amber-300/10"}`}>
        <p className="max-w-3xl text-sm leading-6 text-white/70"><strong>{issuanceCurrent ? "Issuance package prepared: " : humanReviewApproved ? "Next control: " : "Issuance blocked: "}</strong>{issuanceCurrent ? "The manifest is linked to the current review receipt and can now appear in the synthetic portfolio." : humanReviewApproved ? "Complete the issuance safeguards and prepare the synthetic issuance package above." : issueBlocker}</p>
        {issuanceCurrent ? (
          <Link className="bg-white px-6 py-4 text-sm font-black uppercase text-black transition hover:bg-[#0B63FF] hover:text-white" href={`/portfolio/${dealId}`}>View issued-state preview →</Link>
        ) : humanReviewApproved ? (
          <Link className="border border-white/20 px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-white hover:text-black" href="#issuance-package">Prepare package</Link>
        ) : (
          <Link className="border border-white/20 px-6 py-4 text-sm font-black uppercase text-white transition hover:bg-white hover:text-black" href={`/underwriting/${dealId}`}>Return to human review</Link>
        )}
      </div>
    </section>
  );
}
