export interface Run {
  id: string;
  orgId: string;
  playbookId: string;
  name: string;
  status: string;
  startedBy: string;
  decisionBy: string | null;
  decisionAt: Date | null;
  decisionStatement: string | null;
  failedSpecsAtDecision: unknown;
  createdAt: Date;
}

export interface RunSection {
  id: string;
  runId: string;
  orgId: string;
  name: string;
  position: number;
  skippedBy: string | null;
  skipReason: string | null;
}

export interface RunSpec {
  id: string;
  runSectionId: string;
  orgId: string;
  title: string;
  description: unknown;
  testSteps: unknown;
  artifactRequirements: unknown;
  severity: string;
  position: number;
  status: string;
  claimedBy: string | null;
  executedBy: string | null;
  executedAt: Date | null;
  failureReason: string | null;
  skipReason: string | null;
}

export interface RunSpecArtifact {
  id: string;
  runSpecId: string;
  orgId: string;
  requirementIndex: number;
  type: string;
  storageKey: string | null;
  originalFileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  tableData: unknown;
  measuredValue: string | null;
  urlValue: string | null;
  uploadedBy: string;
  createdAt: Date;
}
