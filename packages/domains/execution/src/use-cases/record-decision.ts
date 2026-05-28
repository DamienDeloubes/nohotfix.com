export async function recordDecision(_data: { runId: string; orgId: string; decision: 'go' | 'no_go' | 'abandoned'; statement?: string; decidedBy: string }): Promise<void> {
  // TODO: Validate, record decision, send notifications, lock run
}
