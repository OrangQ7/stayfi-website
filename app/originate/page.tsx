import Link from "next/link";
import { PageIntro, WorkspaceShell } from "@/components/workspace-shell";

const files = [
  { name: "hotel-profile.json", type: "Property profile", detail: "48 rooms · Zermatt · winter season", href: "/demo-data/hotel-profile.json" },
  { name: "pms-bookings.csv", type: "PMS bookings", detail: "4 months · 4.25M USDC-equivalent", href: "/demo-data/pms-bookings.csv" },
  { name: "bank-revenue.csv", type: "Bank revenue", detail: "Historical matched deposits", href: "/demo-data/bank-revenue.csv" },
  { name: "financing-request.json", type: "Financing request", detail: "352,000 USDC requested", href: "/demo-data/financing-request.json" }
];

export default function OriginatePage() {
  return (
    <WorkspaceShell active="originate">
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <PageIntro
          eyebrow="Deal alpenstern-2026-winter"
          title="Build an auditable hotel financing package."
          body="Load the hotel profile, PMS bookings, bank revenue, and funding request. StayFi will normalize the package into a strict underwriting dossier while preserving the source trail."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-black uppercase text-white/40">Loaded package</p>
                <h2 className="mt-2 text-2xl font-black">Hotel Alpenstern</h2>
              </div>
              <span className="text-xs font-bold text-emerald-300">4 of 4 required sources ready</span>
            </div>
            <div className="mt-4 grid gap-3">
              {files.map((file, index) => (
                <article className="grid gap-4 border border-white/10 bg-black/50 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center" key={file.name}>
                  <span className="grid h-9 w-9 place-items-center bg-[#0B63FF]/15 text-xs font-black text-[#75A7FF]">0{index + 1}</span>
                  <div>
                    <p className="text-sm font-black">{file.type}</p>
                    <p className="mt-1 text-xs text-white/42">{file.name} · {file.detail}</p>
                  </div>
                  <a className="text-xs font-black uppercase text-[#75A7FF] hover:text-white" href={file.href}>Inspect sample</a>
                </article>
              ))}
            </div>
          </section>

          <aside className="border border-[#0B63FF]/40 bg-[#0B63FF]/10 p-6 sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Ready for analysis</p>
            <h2 className="mt-5 text-3xl font-black leading-tight">One package. Four source types. One review trail.</h2>
            <ul className="mt-7 space-y-3 text-sm leading-6 text-white/60">
              <li>• Data is synthetic and safe for the public demo.</li>
              <li>• Source references remain attached to every material claim.</li>
              <li>• Differences above policy thresholds require a human reviewer.</li>
            </ul>
            <Link className="mt-9 flex min-h-14 items-center justify-center bg-[#0B63FF] px-5 text-center text-sm font-black uppercase tracking-[0.06em] text-white transition hover:bg-white hover:text-black" href="/underwriting/alpenstern-2026-winter">
              Start GPT-5.6 underwriting →
            </Link>
            <p className="mt-3 text-center text-[11px] leading-5 text-white/35">Day 0 uses a frozen structured result. Live model execution is the next implementation step.</p>
          </aside>
        </div>
      </section>
    </WorkspaceShell>
  );
}
