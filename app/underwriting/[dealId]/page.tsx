import Link from "next/link";
import dossierJson from "@/data/demo/alpenstern-2026-winter.json";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import { Metric, PageIntro, WorkspaceShell } from "@/components/workspace-shell";

const dossier = dossierJson as UnderwritingDossier;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function UnderwritingPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;

  return (
    <WorkspaceShell active="underwriting">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <PageIntro
            eyebrow={`Underwriting dossier · ${dealId}`}
            title="Evidence before confidence."
            body="The structured dossier separates normalized facts, source evidence, discrepancies, risk flags, and proposed terms so a reviewer can see why the recommendation exists."
          />
          <div className="border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-right">
            <p className="text-[10px] font-black uppercase text-emerald-200/70">Structured output</p>
            <p className="mt-1 text-sm font-black text-emerald-200">Schema valid · synthetic</p>
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Forward bookings" value={money.format(dossier.normalized_metrics.forward_booked_revenue)} detail="2026–27 winter season" />
          <Metric label="Requested capital" value={money.format(dossier.recommended_terms.funding_amount_usdc)} detail="8.3% of forward bookings" />
          <Metric label="Risk band" value={dossier.risk_band} detail="Policy recommendation" />
          <Metric label="Model confidence" value={`${Math.round(dossier.confidence * 100)}%`} detail="Not an approval decision" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border border-white/10 bg-white/[0.02] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black">Evidence ledger</h2>
              <span className="text-xs font-bold text-white/35">{dossier.evidence.length} cited claims</span>
            </div>
            <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {dossier.evidence.map((item, index) => (
                <article className="py-5" key={item.claim}>
                  <div className="flex gap-4">
                    <span className="text-xs font-black text-[#75A7FF]">E{index + 1}</span>
                    <div>
                      <p className="font-bold leading-6">{item.claim}</p>
                      <p className="mt-2 text-xs text-white/40">{item.file_name} · {item.locator}</p>
                      <p className="mt-3 border-l-2 border-white/15 pl-3 text-sm leading-6 text-white/55">{item.excerpt}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="border border-amber-300/35 bg-amber-300/10 p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">Human review required</p>
                <span className="bg-amber-200 px-2 py-1 text-xs font-black text-black">8% GAP</span>
              </div>
              <h2 className="mt-5 text-2xl font-black">PMS and bank revenue do not fully reconcile.</h2>
              <p className="mt-4 text-sm leading-6 text-amber-50/65">{dossier.discrepancies[0].summary}</p>
              <p className="mt-4 border-t border-amber-200/15 pt-4 text-sm leading-6 text-amber-50/80">Action: {dossier.discrepancies[0].recommended_action}</p>
            </section>

            <section className="border border-white/10 bg-white/[0.02] p-6">
              <p className="text-xs font-black uppercase text-white/40">Risk flags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {dossier.risk_flags.map((flag) => <span className="border border-white/15 bg-black px-3 py-2 text-xs font-bold text-white/65" key={flag}>{flag}</span>)}
              </div>
              <p className="mt-6 text-xs font-black uppercase text-white/40">Missing item</p>
              <p className="mt-3 text-sm text-white/65">{dossier.missing_data[0]}</p>
            </section>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">
          <p className="max-w-2xl text-xs leading-5 text-white/35">The reviewer is continuing with a conditional draft; issuance remains blocked until the discrepancy and escrow document are resolved.</p>
          <Link className="bg-[#0B63FF] px-6 py-4 text-sm font-black uppercase tracking-[0.06em] transition hover:bg-white hover:text-black" href={`/notes/${dealId}`}>Continue to note terms →</Link>
        </div>
      </section>
    </WorkspaceShell>
  );
}
