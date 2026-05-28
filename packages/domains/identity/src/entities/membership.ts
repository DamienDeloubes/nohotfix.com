import { Role } from './value-objects/role.js';

export interface MembershipProps {
  id: string;
  orgId: string;
  userId: string;
  role: Role;
  createdAt: Date;
}

export class MembershipEntity {
  readonly id: string;
  readonly orgId: string;
  readonly userId: string;
  readonly role: Role;
  readonly createdAt: Date;

  private constructor(props: MembershipProps) {
    this.id = props.id;
    this.orgId = props.orgId;
    this.userId = props.userId;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }

  static create(params: { id: string; orgId: string; userId: string; role: string }): MembershipEntity {
    return new MembershipEntity({
      id: params.id,
      orgId: params.orgId,
      userId: params.userId,
      role: Role.create(params.role),
      createdAt: new Date(),
    });
  }

  static reconstitute(props: MembershipProps): MembershipEntity {
    return new MembershipEntity(props);
  }

  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  changeRole(newRole: string): MembershipEntity {
    return new MembershipEntity({
      id: this.id,
      orgId: this.orgId,
      userId: this.userId,
      role: Role.create(newRole),
      createdAt: this.createdAt,
    });
  }
}
