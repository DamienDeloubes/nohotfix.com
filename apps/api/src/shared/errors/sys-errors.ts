import { DomainError, ErrorCode } from '@nohotfix/shared';

export class SysInternalError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.SYS_INTERNAL, 'An internal server error occurred', 500, details);
  }
}

export class SysDatabaseError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.SYS_DATABASE, 'A database error occurred', 500, details);
  }
}
