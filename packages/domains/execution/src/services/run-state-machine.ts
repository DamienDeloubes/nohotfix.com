export class RunStateMachine {
  readonly TERMINAL_STATUSES = new Set(['go', 'no_go', 'abandoned']);

  isTerminal(status: string): boolean {
    return this.TERMINAL_STATUSES.has(status);
  }

  validateTransition(from: string, to: string): void {
    // TODO: Enforce valid state transitions
    void from;
    void to;
  }
}
