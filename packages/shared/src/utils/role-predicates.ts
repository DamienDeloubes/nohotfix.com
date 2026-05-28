type RoleName = 'owner' | 'admin' | 'member';

const ROLE_LEVEL: Record<RoleName, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

export type RoleCheck = { minimum: RoleName } | { exact: RoleName };

/**
 * Check whether a role satisfies a minimum level or exact match.
 *
 * @example
 * requireRole(role, { minimum: 'admin' })  // true for admin and owner
 * requireRole(role, { exact: 'member' })   // true only for member
 * requireRole(role, { minimum: 'owner' })  // true only for owner
 * requireRole(role, { minimum: 'member' }) // true for everyone
 */
export function requireRole(role: string, check: RoleCheck): boolean {
  const level = ROLE_LEVEL[role as RoleName];
  if (level === undefined) return false;

  if ('exact' in check) {
    return role === check.exact;
  }

  return level >= ROLE_LEVEL[check.minimum];
}
