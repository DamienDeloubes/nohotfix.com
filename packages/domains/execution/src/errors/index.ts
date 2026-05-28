import { DomainError, ErrorCode } from '@nohotfix/shared';

export class ExecRunImmutableError extends DomainError {
  constructor(runId?: string) {
    super(ErrorCode.EXEC_RUN_IMMUTABLE, 'Run is in a terminal state and cannot be modified', 403, runId ? { runId } : undefined);
  }
}

export class ExecRunInvalidTransitionError extends DomainError {
  constructor(from: string, to: string) {
    super(ErrorCode.EXEC_RUN_INVALID_TRANSITION, `Invalid state transition from ${from} to ${to}`, 409, { from, to });
  }
}

export class ExecSpecArtifactsIncompleteError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.EXEC_SPEC_ARTIFACTS_INCOMPLETE, 'Not all required artifacts have been uploaded', 400, details);
  }
}

export class ExecDecisionJustificationRequiredError extends DomainError {
  constructor() {
    super(ErrorCode.EXEC_DECISION_JUSTIFICATION_REQUIRED, 'A justification statement is required when making a Go decision with failed specs', 400);
  }
}
