import Link from "next/link";
import { Metric, PageIntro, WorkspaceShell } from "@/components/workspace-shell";

export default function PortfolioPage() {
  return (
    <WorkspaceShell active="portfolio">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <PageIntro
          eyebrow="Investor transparency · synthetic position"
          title="The audit trail continues after underwriting."
          body="Investors can see the note's evidence state, allocation, settlement schedule, and unresolved review items without relying on an opaque yield card."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Portfolio value" value="$25,000" detail="Synthetic allocation" />
          <Metric label="SRN face allocation" value="$28,409" detail="Based on issue discount" />
          <Metric label="Projected gross uplift" value="$3,409" detail="Before fees, defaults, or delay" />
          <Metric label="Next settlement" value="15 Jan" detail="Monthly reconciliation" />
        </div>

        <section className="mt-8 overflow-hidden border border-white/10 bg-white/[0.02]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
            <div>
              <p className="text-xs font-black uppercase text-[#75A7FF]">Alpenstern Winter 2026 SRN</p>
              <h2 className="mt-2 text-2xl font-black">Hotel Alpenstern · Zermatt</h2>
            </div>
            <span className="border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-black uppercase text-amber-200">Conditional demo note</span>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-6">
              <p className="text-xs font-black uppercase text-white/40">Settlement timeline</p>
              <div className="mt-5 space-y-0">
                {[
                  ["15 Oct 2026", "Funding reserved", "Synthetic 352,000 USDC subscription package prepared.", "complete"],
                  ["01 Dec 2026", "Season opens", "Eligible room revenue begins flowing to the controlled account.", "upcoming"],
                  ["15 Jan 2027", "First reconciliation", "PMS, bank, refunds, and taxes matched before investor distribution.", "upcoming"],
                  ["30 Apr 2027", "Final maturity", "Remaining face value becomes due under the SRN terms.", "upcoming"]
                ].map(([date, title, body, status], index) => (
                  <article className="relative grid grid-cols-[auto_1fr] gap-4 pb-7 last:pb-0" key={date}>
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-3 w-3 rounded-full ${status === "complete" ? "bg-emerald-300" : "border border-white/30 bg-black"}`} />
                      {index < 3 ? <span className="h-full w-px bg-white/10" /> : null}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/35">{date}</p>
                      <h3 className="mt-1 font-black">{title}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/48">{body}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="border-t border-white/10 bg-black/40 p-5 sm:p-6 lg:border-l lg:border-t-0">
              <p className="text-xs font-black uppercase text-white/40">Evidence state</p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Source package</span><span className="font-bold text-emerald-300">4 files verified</span></div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Schema validation</span><span className="font-bold text-emerald-300">Passed</span></div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">PMS-bank review</span><span className="font-bold text-amber-200">Open · 8% gap</span></div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><span className="text-white/45">Escrow control</span><span className="font-bold text-amber-200">Signature pending</span></div>
              </div>
              <Link className="mt-7 block border border-white/20 px-5 py-4 text-center text-xs font-black uppercase tracking-[0.06em] transition hover:border-white hover:bg-white hover:text-black" href="/underwriting/alpenstern-2026-winter">Open underwriting evidence</Link>
            </aside>
          </div>
        </section>

        <p className="mt-6 text-xs leading-5 text-white/30">All positions, returns, dates, and settlements on this screen are synthetic. Nothing shown is an investment offer or a claim of realized performance.</p>
      </section>
    </WorkspaceShell>
  );
}
