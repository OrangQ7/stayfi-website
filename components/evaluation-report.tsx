import goldJson from "@/data/evals/fjordlight-complex-gold.json";
import {
  isEvaluationPackage,
  scoreUnderwritingDossier,
  type UnderwritingGoldStandard,
} from "@/lib/evaluation";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";

const gold = goldJson as UnderwritingGoldStandard;

export function EvaluationReport({ dossier }: { dossier: UnderwritingDossier }) {
  if (!isEvaluationPackage(dossier, gold)) return null;

  const report = scoreUnderwritingDossier(dossier, gold);
  const color = report.grade === "PASS" ? "emerald" : report.grade === "REVIEW" ? "amber" : "rose";
  const failedChecks = report.categories.flatMap((category) => category.checks.filter((check) => check.status !== "pass"));

  return (
    <section className={`mt-8 border p-6 sm:p-7 ${color === "emerald" ? "border-emerald-300/35 bg-emerald-300/10" : color === "amber" ? "border-amber-300/35 bg-amber-300/10" : "border-rose-300/35 bg-rose-300/10"}`}>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-white/55">Automatic evaluation · human gold standard v1.0</p>
          <h2 className="mt-3 text-3xl font-black">Complex package score</h2>
          <p className="mt-3 text-sm leading-6 text-white/60">This compares the model dossier with the manually authored Fjordlight answer. It is an extraction/auditability score, not model confidence and not investment approval.</p>
        </div>
        <div className="min-w-36 border border-white/15 bg-black/40 p-4 text-right">
          <p className="text-xs font-black uppercase text-white/45">{report.grade}</p>
          <p className="mt-1 text-4xl font-black">{report.score}<span className="text-lg text-white/40">/100</span></p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {report.categories.map((category) => (
          <article className="border border-white/10 bg-black/30 p-4" key={category.id}>
            <p className="text-[10px] font-black uppercase text-white/40">{category.label}</p>
            <p className="mt-3 text-2xl font-black">{category.earned}<span className="text-sm text-white/35">/{category.possible}</span></p>
          </article>
        ))}
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="text-xs font-black uppercase text-white/45">Checks needing attention</p>
        {failedChecks.length ? (
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {failedChecks.map((check) => (
              <div className="border border-white/10 bg-black/25 p-3 text-xs leading-5" key={check.id}>
                <div className="flex items-center justify-between gap-3"><span className="font-black text-white/75">{check.label}</span><span className={check.status === "partial" ? "text-amber-200" : "text-rose-200"}>{check.status.toUpperCase()}</span></div>
                <p className="mt-1 text-white/40">Expected: {check.expected} · Actual: {check.actual}</p>
              </div>
            ))}
          </div>
        ) : <p className="mt-3 text-sm font-bold text-emerald-200">All deterministic checks passed.</p>}
        <a className="mt-5 inline-block text-xs font-black uppercase text-white underline underline-offset-4" href="/api/evaluations/fjordlight/gold">Download human gold standard</a>
      </div>
    </section>
  );
}
