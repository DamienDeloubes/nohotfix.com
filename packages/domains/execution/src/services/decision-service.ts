export class DecisionService {
  async recordDecision(_data: { runId: string; orgId: string; decision: 'go' | 'no_go' | 'abandoned'; statement?: string; decidedBy: string }): Promise<void> {
    // TODO: Validate all specs terminal, record decision, lock run
  }
}
