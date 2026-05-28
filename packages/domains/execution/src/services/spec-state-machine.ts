export class SpecStateMachine {
  readonly TERMINAL_STATUSES = new Set(['passed', 'failed', 'skipped']);

  isTerminal(status: string): boolean {
    return this.TERMINAL_STATUSES.has(status);
  }

  validateTransition(from: string, to: string): void {
    // TODO: Enforce valid spec state transitions
    void from;
    void to;
  }
}
