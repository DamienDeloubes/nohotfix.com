// Re-export DomainError as AppError for backward compatibility
export { DomainError as AppError } from '@nohotfix/shared';

// Domain errors re-exported from domain packages
export { AuthSessionExpiredError, AuthRoleInsufficientError, AuthLastAdminError } from '@nohotfix/domain-identity';
export { BillSubExpiredError, BillWebhookInvalidError, BillWebhookDuplicateError } from '@nohotfix/domain-billing';
export { AuthorPlaybookNotFoundError, AuthorSpecArchivedError, AuthorPlaybookArchivedError, AuthorSyncConflictError } from '@nohotfix/domain-authoring';
export { ExecRunImmutableError, ExecRunInvalidTransitionError, ExecSpecArtifactsIncompleteError, ExecDecisionJustificationRequiredError } from '@nohotfix/domain-execution';

// System errors (infrastructure concerns — stay in apps/api)
export { SysInternalError, SysDatabaseError } from './sys-errors.js';
