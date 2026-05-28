import { DomainError, ErrorCode } from '@nohotfix/shared';

export class BillSubExpiredError extends DomainError {
  constructor() {
    super(ErrorCode.BILL_SUB_EXPIRED, 'Subscription has expired', 403);
  }
}

export class BillWebhookInvalidError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.BILL_WEBHOOK_INVALID, 'Invalid webhook payload or signature', 422, details);
  }
}

export class BillWebhookDuplicateError extends DomainError {
  constructor() {
    super(ErrorCode.BILL_WEBHOOK_DUPLICATE, 'Webhook event already processed', 200);
  }
}
