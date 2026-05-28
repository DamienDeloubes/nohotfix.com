import { DomainError, ErrorCode } from '@nohotfix/shared';

export class AuditPlaybookNotFoundError extends DomainError {
  constructor(playbookId?: string) {
    super(ErrorCode.AUDIT_PLAYBOOK_NOT_FOUND, 'Playbook not found', 404, playbookId ? { playbookId } : undefined);
  }
}
