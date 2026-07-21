import { OriginationWorkspace } from "@/components/origination-workspace";
import { WorkspaceShell } from "@/components/workspace-shell";

export default function OriginatePage() {
  return (
    <WorkspaceShell active="originate">
      <OriginationWorkspace />
    </WorkspaceShell>
  );
}
