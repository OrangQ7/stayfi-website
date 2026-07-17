import Link from "next/link";
import dossierJson from "@/data/demo/alpenstern-2026-winter.json";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import { Metric, PageIntro, WorkspaceShell } from "@/components/workspace-shell";

const dossier = dossierJson as UnderwritingDossier;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function NotePage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;
  const terms = dossier.recommended_terms;

  return (
    <WorkspaceShell active="notes">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <PageIntro
          eyebrow={`Conditional SRN draft · ${dealId}`}
          title="Turn the reviewed dossier into legible terms."
          body="StayFi converts the underwriter's reviewed facts into a draft Seasonal Revenue Note. Terms stay conditional until the flagged evidence is reconciled and a human reviewer approves issuance."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Hotel receives" value={money.format(terms.funding_amount_usdc)} detail="Pre-season capital" />
          <Metric label="SRN face value" value={money.format(terms.face_value_usdc)} detail="Due through the waterfall" />
          <Metric label="Issue discount" value={`${terms.discount_pct}%`} detail="13.64% gross uplift on funded amount" />
          <Metric label="Maturity" value="30 Apr 2027" detail="After the winter season" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Draft instrument</p>
            <h2 className="mt-5 text-4xl font-black">Alpenstern Winter 2026 SRN</h2>
            <dl className="mt-8 divide-y divide-white/10 border-y border-white/10 text-sm">
              {[
                ["Borrower", "Alpenstern Seasonal SPV (demo)"],
                ["Network", "Base · permissioned transfer"],
                ["Settlement asset", "USDC"],
                ["Revenue share", `${terms.revenue_share_pct}% of eligible room receipts`],
                ["Risk band", dossier.risk_band],
                ["Evidence state", "Conditional · reviewer action open"]
              ].map(([label, value]) => (
                <div className="grid grid-cols-[0.8fr_1.2fr] gap-4 py-4" key={label}>
                  <dt className="text-white/38">{label}</dt>
                  <dd className="text-right font-bold text-white/75">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="border border-[#0B63FF]/35 bg-[#0B63FF]/10 p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Escrow waterfall</p>
            <div className="mt-7 space-y-3">
              {[
                ["01", "Eligible room revenue", "Receipts enter the controlled collection account."],
                ["02", "Taxes and refunds", "Excluded amounts are removed before note settlement."],
                ["03", "SRN repayment", "18% of eligible receipts flows toward the 400,000 USDC face value."],
                ["04", "Hotel operating account", "Remaining eligible cash returns to the operator."]
              ].map(([number, title, body]) => (
                <article className="grid grid-cols-[auto_1fr] gap-4 border border-white/10 bg-black/35 p-4" key={number}>
                  <span className="text-xs font-black text-[#75A7FF]">{number}</span>
                  <div>
                    <h3 className="font-black">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/48">{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-amber-300/25 bg-amber-300/10 p-5">
          <p className="max-w-3xl text-sm leading-6 text-amber-50/70"><strong className="text-amber-200">Issuance blocked:</strong> reconcile the 8% PMS-to-bank gap and obtain the signed escrow control agreement. This demo does not mint a token or move funds.</p>
          <Link className="bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.06em] text-black transition hover:bg-[#0B63FF] hover:text-white" href="/portfolio">View investor portfolio →</Link>
        </div>
      </section>
    </WorkspaceShell>
  );
}
