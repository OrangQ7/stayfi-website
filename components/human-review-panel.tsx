"use client";

import { useState } from "react";
import {
  reviewDecisionLabel,
  type ReviewDecision,
} from "@/lib/review-schema";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import { useUnderwritingReview } from "@/lib/use-underwriting-review";

const checklist = [
  { id: "sources", label: "I reviewed the uploaded source manifest and evidence citations." },
  { id: "risks", label: "I reviewed every discrepancy, risk flag, and missing-data item." },
  { id: "human", label: "I understand the AI proposes terms but does not approve financing." },
] as const;

export function HumanReviewPanel({ dealId, dossier }: { dealId: string; dossier: UnderwritingDossier }) {
  const { review, saveReview } = useUnderwritingReview(dealId);
  const [reviewerRole, setReviewerRole] = useState("Demo underwriter");
  const [decision, setDecision] = useState<ReviewDecision>("needs_information");
  const [reviewerNote, setReviewerNote] = useState("");
  const [checked, setChecked] = useState<Record<(typeof checklist)[number]["id"], boolean>>({ sources: false, risks: false, human: false });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const allChecked = Object.values(checked).every(Boolean);

  async function submitReview() {
    if (!reviewerRole.trim()) {
      setError("Enter the reviewer role.");
      return;
    }
    if (!allChecked) {
      setError("Complete all three reviewer attestations.");
      return;
    }
    if (reviewerNote.trim().length < 12) {
      setError("Add a reviewer rationale of at least 12 characters.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await saveReview({ reviewerRole, decision, reviewerNote, dossier });
      setReviewerNote("");
    } finally {
      setSaving(false);
    }
  }

  function downloadReceipt() {
    if (!review) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(review, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `stayfi-review-${dealId}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-8 border border-violet-300/30 bg-violet-300/[0.07] p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-violet-200">Day 2 · human review control</p>
          <h2 className="mt-3 text-3xl font-black">The model recommends. A person decides.</h2>
          <p className="mt-3 text-sm leading-6 text-white/55">Review the evidence and record a decision. The receipt fingerprints both the dossier and the review record, and stays in this browser session.</p>
        </div>
        <div className={`border px-4 py-3 text-right ${review?.decision === "conditionally_approved" ? "border-emerald-300/30 bg-emerald-300/10" : review?.decision === "declined" ? "border-rose-300/30 bg-rose-300/10" : "border-amber-300/30 bg-amber-300/10"}`}>
          <p className="text-[10px] font-black uppercase text-white/40">Current decision</p>
          <p className="mt-1 text-sm font-black">{review ? reviewDecisionLabel(review.decision) : "Not reviewed"}</p>
        </div>
      </div>

      {review ? (
        <div className="mt-5 grid gap-3 border border-white/10 bg-black/30 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-white/35">Reviewer</p><p className="mt-1 font-bold text-white/75">{review.reviewer_role}</p></div>
          <div><p className="text-white/35">Reviewed at</p><p className="mt-1 font-bold text-white/75">{new Date(review.reviewed_at).toLocaleString()}</p></div>
          <div><p className="text-white/35">Dossier fingerprint</p><p className="mt-1 truncate font-mono text-white/65" title={review.dossier_sha256}>{review.dossier_sha256.slice(0, 16)}…</p></div>
          <div><p className="text-white/35">Review receipt</p><p className="mt-1 truncate font-mono text-white/65" title={review.receipt_sha256}>{review.receipt_sha256.slice(0, 16)}…</p></div>
          <p className="sm:col-span-2 lg:col-span-3"><span className="text-white/35">Rationale: </span><span className="text-white/70">{review.reviewer_note}</span></p>
          <button className="border border-white/20 px-3 py-2 font-black uppercase hover:bg-white hover:text-black" onClick={downloadReceipt} type="button">Download receipt</button>
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="space-y-4">
          <label className="block text-xs font-black uppercase text-white/45">Reviewer role
            <input className="mt-2 w-full border border-white/15 bg-black/45 px-3 py-3 text-sm font-bold text-white outline-none focus:border-violet-200" onChange={(event) => setReviewerRole(event.target.value)} value={reviewerRole} />
          </label>
          <label className="block text-xs font-black uppercase text-white/45">Decision
            <select className="mt-2 w-full border border-white/15 bg-black px-3 py-3 text-sm font-bold text-white outline-none focus:border-violet-200" onChange={(event) => setDecision(event.target.value as ReviewDecision)} value={decision}>
              <option value="needs_information">Request more information</option>
              <option value="conditionally_approved">Conditionally approve draft terms</option>
              <option value="declined">Decline</option>
            </select>
          </label>
        </div>

        <div>
          <div className="space-y-3">
            {checklist.map((item) => (
              <label className="flex cursor-pointer gap-3 border border-white/10 bg-black/25 p-3 text-sm leading-5 text-white/65" key={item.id}>
                <input checked={checked[item.id]} className="mt-1 accent-violet-300" onChange={(event) => setChecked((current) => ({ ...current, [item.id]: event.target.checked }))} type="checkbox" />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
          <label className="mt-4 block text-xs font-black uppercase text-white/45">Reviewer rationale
            <textarea className="mt-2 min-h-24 w-full border border-white/15 bg-black/45 px-3 py-3 text-sm leading-6 text-white outline-none focus:border-violet-200" onChange={(event) => setReviewerNote(event.target.value)} placeholder="Explain what remains open, why terms are conditionally acceptable, or why the deal is declined." value={reviewerNote} />
          </label>
        </div>
      </div>

      {error ? <p className="mt-4 text-sm font-bold text-rose-200" role="alert">{error}</p> : null}
      <button className="mt-5 min-h-12 bg-violet-200 px-5 text-xs font-black uppercase text-black transition hover:bg-white disabled:cursor-wait disabled:opacity-50" disabled={saving} onClick={submitReview} type="button">{saving ? "Fingerprinting review…" : "Save human review decision"}</button>
    </section>
  );
}
