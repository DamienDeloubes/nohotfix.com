export async function recordSpecResult(_data: {
  specId: string;
  runId: string;
  orgId: string;
  result: 'passed' | 'failed' | 'skipped';
  failureReason?: string;
  skipReason?: string;
  executedBy: string;
}): Promise<void> {
  // TODO: Validate artifacts for pass, record result, check auto-transition
}
