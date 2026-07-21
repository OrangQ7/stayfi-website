"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createReviewReceipt } from "@/lib/review-receipt";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";
import {
  isUnderwritingReviewRecord,
  reviewStorageKey,
  type ReviewDecision,
  type UnderwritingReviewRecord,
} from "@/lib/review-schema";

const loadingMarker = "__stayfi_review_loading__";
const missingMarker = "__stayfi_review_missing__";

function parseRecord(raw: string) {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return isUnderwritingReviewRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function useUnderwritingReview(dealId: string) {
  const eventName = `stayfi:review-updated:${dealId}`;
  const raw = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(eventName, onStoreChange);
      return () => window.removeEventListener(eventName, onStoreChange);
    },
    () => sessionStorage.getItem(reviewStorageKey(dealId)) ?? missingMarker,
    () => loadingMarker,
  );
  const ready = raw !== loadingMarker;
  const review = useMemo(
    () => (ready && raw !== missingMarker ? parseRecord(raw) : null),
    [raw, ready],
  );

  async function saveReview(input: {
    reviewerRole: string;
    decision: ReviewDecision;
    reviewerNote: string;
    dossier: UnderwritingDossier;
  }) {
    const record: UnderwritingReviewRecord = await createReviewReceipt({
      dealId,
      reviewerRole: input.reviewerRole,
      decision: input.decision,
      reviewerNote: input.reviewerNote,
      dossier: input.dossier,
    });
    sessionStorage.setItem(reviewStorageKey(dealId), JSON.stringify(record));
    window.dispatchEvent(new Event(eventName));
    return record;
  }

  return { review, ready, saveReview };
}
