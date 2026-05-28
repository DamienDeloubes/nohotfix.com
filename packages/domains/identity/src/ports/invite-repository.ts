import type { InviteEntity, NewInviteDto } from '../entities/invite.js';

export interface InviteWithInviterDto {
  id: string;
  orgId: string;
  email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'revoked';
  invitedBy: string;
  inviterFirstName: string | null;
  inviterLastName: string | null;
  tokenExpiresAt: string;
  lastSentAt: string;
  createdAt: string;
}

export interface InviteRepository {
  findByToken(token: string): Promise<InviteEntity | undefined>;
  findById(orgId: string, id: string): Promise<InviteEntity | undefined>;
  findPendingByOrgAndEmail(orgId: string, email: string): Promise<InviteEntity | undefined>;
  findPendingByOrg(orgId: string): Promise<InviteWithInviterDto[]>;
  create(data: NewInviteDto): Promise<InviteEntity>;
  update(invite: InviteEntity): Promise<void>;
  delete(orgId: string, id: string): Promise<void>;
}
