import { InviteToken } from './invite-token.js';
import { Email } from './value-objects/email.js';
import { Role } from './value-objects/role.js';

export type InviteStatus = 'pending' | 'accepted' | 'revoked';

export interface InviteProps {
  id: string;
  orgId: string;
  email: Email;
  role: Role;
  token: InviteToken;
  status: InviteStatus;
  invitedBy: string;
  tokenExpiresAt: Date;
  lastSentAt: Date;
  acceptedBy: string | null;
  acceptedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Data for a new invite before it is persisted (no ID yet — DB generates it). */
export type NewInviteDto = Omit<InviteProps, 'id'>;

export const INVITE_EXPIRY_DAYS = 7;
export const INVITE_RESEND_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export class InviteEntity {
  private constructor(readonly props: InviteProps) {}

  static create(params: { orgId: string; email: string; role: string; invitedBy: string }): NewInviteDto {
    const email = Email.create(params.email);
    const role = Role.create(params.role);
    if (role.isOwner()) {
      throw new Error('Cannot invite with owner role');
    }
    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    return {
      orgId: params.orgId,
      email,
      role,
      token: InviteToken.generate(),
      status: 'pending',
      invitedBy: params.invitedBy,
      tokenExpiresAt: expiresAt,
      lastSentAt: now,
      acceptedBy: null,
      acceptedAt: null,
      createdAt: now,
      updatedAt: now,
    };
  }

  static reconstitute(props: InviteProps): InviteEntity {
    return new InviteEntity(props);
  }

  get id(): string {
    return this.props.id;
  }

  get orgId(): string {
    return this.props.orgId;
  }

  get email(): Email {
    return this.props.email;
  }

  get role(): Role {
    return this.props.role;
  }

  get token(): InviteToken {
    return this.props.token;
  }

  get status(): InviteStatus {
    return this.props.status;
  }

  get invitedBy(): string {
    return this.props.invitedBy;
  }

  get tokenExpiresAt(): Date {
    return this.props.tokenExpiresAt;
  }

  get lastSentAt(): Date {
    return this.props.lastSentAt;
  }

  get acceptedBy(): string | null {
    return this.props.acceptedBy;
  }

  get acceptedAt(): Date | null {
    return this.props.acceptedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isExpired(): boolean {
    return this.props.tokenExpiresAt < new Date();
  }

  canResend(): boolean {
    if (this.props.status !== 'pending') return false;
    const now = Date.now();
    const lastSent = this.props.lastSentAt.getTime();
    return now - lastSent >= INVITE_RESEND_COOLDOWN_MS;
  }

  resend(): InviteEntity {
    if (this.props.status !== 'pending') {
      throw new Error('Cannot resend a non-pending invite');
    }
    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVITE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    return new InviteEntity({
      ...this.props,
      token: InviteToken.generate(),
      tokenExpiresAt: expiresAt,
      lastSentAt: now,
      updatedAt: now,
    });
  }

  revoke(): InviteEntity {
    if (this.props.status !== 'pending') {
      throw new Error('Cannot revoke a non-pending invite');
    }
    return new InviteEntity({
      ...this.props,
      status: 'revoked',
      updatedAt: new Date(),
    });
  }

  accept(userId: string): InviteEntity {
    if (this.props.status !== 'pending') {
      throw new Error('Cannot accept a non-pending invite');
    }
    const now = new Date();
    return new InviteEntity({
      ...this.props,
      status: 'accepted',
      acceptedBy: userId,
      acceptedAt: now,
      updatedAt: now,
    });
  }
}
