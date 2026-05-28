import { DomainError, ErrorCode } from '@releasepilot/shared';

// ── Session & Token ─────────────────────────────────────────────────────────

export class AuthSessionExpiredError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_SESSION_EXPIRED, 'Session has expired', 401);
  }
}

export class AuthTokenMissingError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_TOKEN_MISSING, 'Authorization header with Bearer token is required', 401);
  }
}

export class AuthTokenMalformedError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_TOKEN_MALFORMED, 'Bearer token is empty', 401);
  }
}

export class AuthTokenInvalidError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_TOKEN_INVALID, 'JWT verification failed', 401, details);
  }
}

// ── Provider ────────────────────────────────────────────────────────────────

export class AuthProviderUnavailableError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_PROVIDER_UNAVAILABLE, 'Authentication provider is unavailable', 503, details);
  }
}

export class AuthCallbackFailedError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_CALLBACK_FAILED, 'OAuth callback exchange failed', 502, details);
  }
}

// ── Role & Membership ───────────────────────────────────────────────────────

export class AuthRoleInsufficientError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_ROLE_INSUFFICIENT, 'Insufficient role for this action', 403);
  }
}

export class AuthLastAdminError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_LAST_ADMIN, 'Cannot remove or demote the last admin', 409);
  }
}

export class AuthRoleSameError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_ROLE_SAME, 'Target member already has this role', 400);
  }
}

export class AuthOwnerSelfDemoteError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_OWNER_SELF_DEMOTE, 'Owner cannot change their own role without transferring ownership', 403);
  }
}

export class AuthTargetNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_TARGET_NOT_FOUND, 'Target member not found in this organisation', 404);
  }
}

export class AuthOwnerCannotBeRemovedError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_OWNER_CANNOT_BE_REMOVED, 'The organization owner cannot be removed. Transfer ownership first.', 409);
  }
}

// ── User ────────────────────────────────────────────────────────────────────

export class AuthUserNotFoundError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_USER_NOT_FOUND, 'User not found', 404, details);
  }
}

export class AuthUserProvisionFailedError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_USER_PROVISION_FAILED, 'Failed to provision user account', 502, details);
  }
}

export class AuthUserFirstNameInvalidError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_USER_FIRST_NAME_INVALID, 'First name must be between 1 and 50 characters', 400);
  }
}

export class AuthUserLastNameInvalidError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_USER_LAST_NAME_INVALID, 'Last name must be between 1 and 50 characters', 400);
  }
}

// ── Organisation ────────────────────────────────────────────────────────────

export class AuthOrgNameInvalidError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_ORG_NAME_INVALID, 'Organisation name is invalid', 422, details);
  }
}

export class AuthOrgSlugInvalidError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_ORG_SLUG_INVALID, 'Organisation slug is invalid', 422, details);
  }
}

export class AuthOrgSlugTakenError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_ORG_SLUG_TAKEN, 'Organisation slug is already taken', 409);
  }
}

export class AuthOrgNotFoundError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_ORG_NOT_FOUND, 'Organisation not found', 404, details);
  }
}

export class AuthMembershipNotFoundError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_MEMBERSHIP_NOT_FOUND, 'User is not a member of this organisation', 403, details);
  }
}

// ── Invite ─────────────────────────────────────────────────────────────────

export class AuthInviteDuplicateError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_DUPLICATE, 'An invite is already pending for this email', 409);
  }
}

export class AuthInviteAlreadyMemberError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_ALREADY_MEMBER, 'This email is already a member of the organisation', 409);
  }
}

export class AuthInviteSelfError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_SELF, 'You cannot invite yourself', 422);
  }
}

export class AuthInviteEmailFailedError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_INVITE_EMAIL_FAILED, 'Failed to send invite email', 502, details);
  }
}

export class AuthInviteNotFoundError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_NOT_FOUND, 'Invite not found', 404);
  }
}

export class AuthInviteResendTooSoonError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_RESEND_TOO_SOON, 'Please wait before resending the invite', 429);
  }
}

export class AuthInviteExpiredError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_EXPIRED, 'This invite has expired', 410);
  }
}

export class AuthInviteEmailMismatchError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_INVITE_EMAIL_MISMATCH, 'Your email does not match the invited email', 422);
  }
}

// ── Environment ──────────────────────────────────────────────────────────────

export class AuthEnvNotFoundError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_ENV_NOT_FOUND, 'Environment not found', 404, details);
  }
}

export class AuthEnvNameDuplicateError extends DomainError {
  constructor() {
    super(ErrorCode.AUTH_ENV_NAME_DUPLICATE, 'An environment with this name already exists', 409);
  }
}

export class AuthEnvNameInvalidError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_ENV_NAME_INVALID, 'Environment name is invalid', 422, details);
  }
}

export class AuthEnvInUseError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTH_ENV_IN_USE, 'This environment cannot be deleted because it is in use', 409, details);
  }
}
