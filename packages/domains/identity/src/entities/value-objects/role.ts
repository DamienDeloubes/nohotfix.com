export type RoleValue = 'owner' | 'admin' | 'member';

const VALID_ROLES: ReadonlySet<string> = new Set<string>(['owner', 'admin', 'member']);

export class Role {
  private constructor(readonly value: RoleValue) {}

  static create(raw: string): Role {
    if (!VALID_ROLES.has(raw)) {
      throw new Error(`Invalid role: ${raw}. Must be 'owner', 'admin', or 'member'`);
    }
    return new Role(raw as RoleValue);
  }

  static owner(): Role {
    return new Role('owner');
  }

  static admin(): Role {
    return new Role('admin');
  }

  static member(): Role {
    return new Role('member');
  }

  isOwner(): boolean {
    return this.value === 'owner';
  }

  isAdmin(): boolean {
    return this.value === 'admin';
  }

  equals(other: Role): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
