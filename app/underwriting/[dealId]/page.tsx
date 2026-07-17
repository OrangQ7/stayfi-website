import dossierJson from "@/data/demo/alpenstern-2026-winter.json";
import { UnderwritingResult } from "@/components/underwriting-result";
import { WorkspaceShell } from "@/components/workspace-shell";
import type { UnderwritingDossier } from "@/lib/underwriting-schema";

const frozenDemo = dossierJson as UnderwritingDossier;

export default async function UnderwritingPage({ params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;

  return (
    <WorkspaceShell active="underwriting" dealId={dealId}>
      <UnderwritingResult
        dealId={dealId}
        fallback={dealId === frozenDemo.deal_id ? frozenDemo : null}
      />
    </WorkspaceShell>
  );
}
