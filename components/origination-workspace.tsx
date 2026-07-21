"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import dossierFixture from "@/data/demo/alpenstern-2026-winter.json";
import { createDemoRehearsalState } from "@/lib/demo-rehearsal";
import { issuanceStorageKey } from "@/lib/issuance-schema";
import { reviewStorageKey } from "@/lib/review-schema";
import {
  isUnderwritingDossier,
  underwritingStorageKey,
  type StoredUnderwritingRun,
  type UnderwritingDossier,
} from "@/lib/underwriting-schema";
import { PageIntro } from "@/components/workspace-shell";

const sampleFiles = [
  { name: "hotel-profile.json", type: "Property profile", detail: "48 rooms · Zermatt · winter season", href: "/demo-data/hotel-profile.json" },
  { name: "pms-bookings.csv", type: "PMS bookings", detail: "4 months · 4.25M USDC-equivalent", href: "/demo-data/pms-bookings.csv" },
  { name: "bank-revenue.csv", type: "Bank revenue", detail: "Historical matched deposits", href: "/demo-data/bank-revenue.csv" },
  { name: "financing-request.json", type: "Financing request", detail: "352,000 USDC requested", href: "/demo-data/financing-request.json" },
];

const complexEvaluationFiles = [
  { name: "fjordlight-property-profile.pdf", href: "/eval-data/fjordlight-complex/fjordlight-property-profile.pdf" },
  { name: "fjordlight-pms-export.xlsx", href: "/eval-data/fjordlight-complex/fjordlight-pms-export.xlsx" },
  { name: "fjordlight-bank-ledger.csv", href: "/eval-data/fjordlight-complex/fjordlight-bank-ledger.csv" },
  { name: "fjordlight-ota-settlements.csv", href: "/eval-data/fjordlight-complex/fjordlight-ota-settlements.csv" },
  { name: "fjordlight-financing-request.docx", href: "/eval-data/fjordlight-complex/fjordlight-financing-request.docx" },
  { name: "fjordlight-insurance-scan.pdf", href: "/eval-data/fjordlight-complex/fjordlight-insurance-scan.pdf" },
];

type RunStatus = "idle" | "preparing" | "analyzing" | "error";

type ApiErrorResponse = {
  ok: false;
  error?: { code?: string; message?: string };
};

function friendlyFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function safeDealId(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return normalized || `stayfi-deal-${Date.now()}`;
}

export function OriginationWorkspace() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [rehearsing, setRehearsing] = useState(false);

  const busy = status === "preparing" || status === "analyzing";

  async function runUnderwriting(files: File[]) {
    if (files.length === 0) {
      setError({ code: "FILES_REQUIRED", message: "Choose hotel source files or run the prepared synthetic package." });
      setStatus("error");
      return;
    }

    setError(null);
    setStatus("analyzing");

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/underwrite", { method: "POST", body: formData });
      const payload = (await response.json()) as ApiErrorResponse | ({ ok: true } & StoredUnderwritingRun);

      if (!response.ok || !payload.ok) {
        const apiError = (payload as ApiErrorResponse).error;
        throw new Error(`${apiError?.code || "UNDERWRITING_FAILED"}::${apiError?.message || "The analysis could not be completed."}`);
      }
      if (!isUnderwritingDossier(payload.dossier)) {
        throw new Error("INVALID_MODEL_OUTPUT::The result did not match the StayFi underwriting contract.");
      }

      const dealId = safeDealId(payload.dossier.deal_id);
      const storedRun: StoredUnderwritingRun = {
        dossier: { ...payload.dossier, deal_id: dealId },
        meta: payload.meta,
      };
      sessionStorage.setItem(underwritingStorageKey(dealId), JSON.stringify(storedRun));
      sessionStorage.removeItem(reviewStorageKey(dealId));
      sessionStorage.removeItem(issuanceStorageKey(dealId));
      router.push(`/underwriting/${dealId}?run=live`);
    } catch (caught) {
      const rawMessage = caught instanceof Error ? caught.message : "UNDERWRITING_FAILED::The analysis could not be completed.";
      const separator = rawMessage.indexOf("::");
      setError({
        code: separator >= 0 ? rawMessage.slice(0, separator) : "NETWORK_ERROR",
        message: separator >= 0 ? rawMessage.slice(separator + 2) : "The browser could not reach the underwriting service.",
      });
      setStatus("error");
    }
  }

  async function loadPreparedPackage(entries: Array<{ name: string; href: string }>) {
    setStatus("preparing");
    setError(null);

    try {
      const files = await Promise.all(
        entries.map(async (sample) => {
          const response = await fetch(sample.href);
          if (!response.ok) throw new Error(`Could not load ${sample.name}`);
          const blob = await response.blob();
          return new File([blob], sample.name, { type: blob.type || "application/octet-stream" });
        }),
      );
      setSelectedFiles(files);
      await runUnderwriting(files);
    } catch (caught) {
      setError({ code: "SAMPLE_LOAD_FAILED", message: caught instanceof Error ? caught.message : "The sample package could not be loaded." });
      setStatus("error");
    }
  }

  async function runSyntheticPackage() {
    await loadPreparedPackage(sampleFiles);
  }

  async function runComplexEvaluation() {
    await loadPreparedPackage(complexEvaluationFiles);
  }

  async function openRecordingRehearsal() {
    setRehearsing(true);
    setError(null);
    try {
      const dossier = dossierFixture as UnderwritingDossier;
      const rehearsal = await createDemoRehearsalState(dossier);
      sessionStorage.setItem(underwritingStorageKey(dossier.deal_id), JSON.stringify(rehearsal.run));
      sessionStorage.setItem(reviewStorageKey(dossier.deal_id), JSON.stringify(rehearsal.review));
      sessionStorage.setItem(issuanceStorageKey(dossier.deal_id), JSON.stringify(rehearsal.issuance));
      router.push(`/underwriting/${dossier.deal_id}?run=rehearsal`);
    } catch (caught) {
      setError({ code: "REHEARSAL_FAILED", message: caught instanceof Error ? caught.message : "The rehearsal state could not be prepared." });
      setRehearsing(false);
    }
  }

  function handleFiles(list: FileList | null) {
    setSelectedFiles(list ? Array.from(list) : []);
    setError(null);
    setStatus("idle");
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <PageIntro
        eyebrow="GPT-5.6 origination workspace"
        title="Build an auditable hotel financing package."
        body="Upload the hotel profile, PMS bookings, bank revenue, and funding request. StayFi hashes each source, sends the package to GPT-5.6, and returns a strict evidence-backed underwriting dossier."
      />

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
            <div>
              <p className="text-xs font-black uppercase text-white/40">Prepared public package</p>
              <h2 className="mt-2 text-2xl font-black">Hotel Alpenstern</h2>
            </div>
            <span className="text-xs font-bold text-emerald-300">4 synthetic sources ready</span>
          </div>
          <div className="mt-4 grid gap-3">
            {sampleFiles.map((file, index) => (
              <article className="grid gap-4 border border-white/10 bg-black/50 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center" key={file.name}>
                <span className="grid h-9 w-9 place-items-center bg-[#0B63FF]/15 text-xs font-black text-[#75A7FF]">0{index + 1}</span>
                <div>
                  <p className="text-sm font-black">{file.type}</p>
                  <p className="mt-1 text-xs text-white/42">{file.name} · {file.detail}</p>
                </div>
                <a className="text-xs font-black uppercase text-[#75A7FF] hover:text-white" href={file.href}>Inspect</a>
              </article>
            ))}
          </div>

          <div className="mt-6 border border-dashed border-white/20 bg-black/35 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black">Or upload another hotel package</p>
                <p className="mt-1 text-xs leading-5 text-white/40">PDF, CSV, JSON, TXT, MD, XLS/XLSX or DOCX · up to 8 files · 4 MB total</p>
              </div>
              <button
                className="border border-white/25 px-4 py-3 text-xs font-black uppercase transition hover:border-white hover:bg-white hover:text-black"
                disabled={busy}
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Choose files
              </button>
              <input
                ref={fileInputRef}
                accept=".pdf,.csv,.json,.txt,.md,.xls,.xlsx,.docx"
                className="sr-only"
                multiple
                onChange={(event) => handleFiles(event.target.files)}
                type="file"
              />
            </div>

            {selectedFiles.length > 0 ? (
              <div className="mt-5 grid gap-2 border-t border-white/10 pt-4">
                {selectedFiles.map((file) => (
                  <div className="flex items-center justify-between gap-4 text-xs" key={`${file.name}-${file.size}`}>
                    <span className="truncate font-bold text-white/70">{file.name}</span>
                    <span className="shrink-0 text-white/35">{friendlyFileSize(file.size)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-5 border border-amber-300/25 bg-amber-300/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-amber-200">Complex evaluation package</p>
                <p className="mt-2 text-sm font-black">Fjordlight · 6 files · PDF/XLSX/CSV/DOCX/scanned PDF</p>
                <p className="mt-1 text-xs leading-5 text-white/45">Includes duplicate bookings, conflicting room counts, an 8% bank gap, disputed OTA chargeback, expired insurance, and missing audited statements.</p>
              </div>
              <a className="text-xs font-black uppercase text-amber-100 underline underline-offset-4" href="/eval-data/fjordlight-complex/manifest.json">Inspect manifest</a>
            </div>
          </div>
        </section>

        <aside className="border border-[#0B63FF]/40 bg-[#0B63FF]/10 p-6 sm:p-7">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[#75A7FF]">Live underwriting</p>
          <h2 className="mt-5 text-3xl font-black leading-tight">Files in. Evidence-led dossier out.</h2>
          <ol className="mt-7 space-y-3 text-sm leading-6 text-white/60">
            <li>01 · Verify file names, sizes, categories, and hashes.</li>
            <li>02 · GPT-5.6 normalizes revenue and reconciles sources.</li>
            <li>03 · Strict Schema blocks malformed results.</li>
            <li>04 · Material gaps are routed to human review.</li>
          </ol>

          <button
            className="mt-9 flex min-h-14 w-full items-center justify-center bg-[#0B63FF] px-5 text-center text-sm font-black uppercase tracking-[0.06em] text-white transition enabled:hover:bg-white enabled:hover:text-black disabled:cursor-wait disabled:opacity-65"
            disabled={busy}
            onClick={runSyntheticPackage}
            type="button"
          >
            {status === "preparing" ? "Preparing sample files…" : status === "analyzing" ? "GPT-5.6 is underwriting…" : "Run synthetic package with GPT-5.6 →"}
          </button>

          <button
            className="mt-3 flex min-h-12 w-full items-center justify-center border border-white/20 px-5 text-center text-xs font-black uppercase tracking-[0.06em] text-white transition enabled:hover:border-white enabled:hover:bg-white enabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-35"
            disabled={busy || selectedFiles.length === 0}
            onClick={() => runUnderwriting(selectedFiles)}
            type="button"
          >
            Analyze selected files
          </button>

          <button
            className="mt-3 flex min-h-14 w-full items-center justify-center border border-amber-200/40 bg-amber-200/10 px-5 text-center text-xs font-black uppercase tracking-[0.06em] text-amber-100 transition enabled:hover:bg-amber-100 enabled:hover:text-black disabled:cursor-wait disabled:opacity-45"
            disabled={busy}
            onClick={runComplexEvaluation}
            type="button"
          >
            Run complex stress test + auto-score
          </button>

          <div className="mt-5 border-t border-white/15 pt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-violet-200">Synthetic demo rehearsal</p>
            <p className="mt-2 text-xs leading-5 text-white/45">Seeds the frozen synthetic dossier, human-review receipt, and prepared-not-issued SRN manifest in this tab. No API request is made.</p>
            <button
              className="mt-4 flex min-h-12 w-full items-center justify-center border border-violet-200/40 bg-violet-200/10 px-5 text-center text-xs font-black uppercase tracking-[0.06em] text-violet-100 transition hover:bg-violet-100 hover:text-black disabled:cursor-wait disabled:opacity-45"
              disabled={busy || rehearsing}
              onClick={openRecordingRehearsal}
              type="button"
            >
              {rehearsing ? "Preparing rehearsal…" : "Open recording rehearsal →"}
            </button>
          </div>

          <p aria-live="polite" className="mt-4 text-center text-[11px] leading-5 text-white/38">
            {busy ? "Keep this page open. Source files are sent to OpenAI for this analysis and the response is not stored by the API." : "No token is minted and no funds move in this workflow."}
          </p>

          {error ? (
            <div className="mt-5 border border-rose-300/30 bg-rose-300/10 p-4" role="alert">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-rose-200">{error.code}</p>
              <p className="mt-2 text-sm leading-6 text-rose-50/75">{error.message}</p>
              <Link className="mt-3 inline-block text-xs font-black uppercase text-white underline underline-offset-4" href="/underwriting/alpenstern-2026-winter">Open frozen demo dossier</Link>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
