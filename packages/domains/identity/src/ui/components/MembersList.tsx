import { useState } from 'react';

import type { OrgMemberDto } from '@nohotfix/shared';

interface MembersListProps {
  members: OrgMemberDto[] | undefined;
  isLoading: boolean;
  error: Error | null;
  currentUserRole?: string | undefined;
  currentUserMembershipId?: string | undefined;
  onRoleChange?: ((memberId: string, newRole: string) => Promise<void>) | undefined;
  isChangingRole?: boolean | undefined;
  onRemoveMember?: ((memberId: string) => Promise<void>) | undefined;
  isRemovingMember?: boolean | undefined;
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

function getRoleOptions(currentUserRole: string, targetRole: string): string[] {
  if (currentUserRole === 'owner') {
    // Owner can assign: owner (transfer), admin, member — but not to themselves
    if (targetRole === 'owner') return [];
    return ['owner', 'admin', 'member'];
  }
  if (currentUserRole === 'admin') {
    // Admin can assign: admin, member — cannot touch owners
    if (targetRole === 'owner') return [];
    return ['admin', 'member'];
  }
  return [];
}

function getRoleBadgeClass(role: string): string {
  if (role === 'owner') return 'bg-nogo-500/20 text-nogo-400';
  if (role === 'admin') return 'bg-blue-500/20 text-blue-300';
  return 'bg-[var(--glass-8)] text-white/60';
}

export function MembersList({
  members,
  isLoading,
  error,
  currentUserRole,
  currentUserMembershipId,
  onRoleChange,
  isChangingRole,
  onRemoveMember,
  isRemovingMember,
}: MembersListProps) {
  const [confirmDialog, setConfirmDialog] = useState<{ memberId: string; memberName: string; newRole: string; type: 'self-demotion' | 'ownership-transfer' } | null>(null);
  const [removeDialog, setRemoveDialog] = useState<{ memberId: string; memberName: string; isSelf: boolean } | null>(null);
  const [roleError, setRoleError] = useState<{ memberId: string; message: string } | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  if (isLoading) {
    return <div className="p-4 text-sm text-white/40">Loading members...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-error-500">Failed to load members.</div>;
  }

  if (!members || members.length === 0) {
    return <div className="p-4 text-sm text-white/40">No members found.</div>;
  }

  const canChangeRoles = currentUserRole === 'admin' || currentUserRole === 'owner';
  const canRemoveMembers = canChangeRoles && !!onRemoveMember;

  async function handleRoleChange(memberId: string, memberName: string, newRole: string) {
    setRoleError(null);

    // Admin self-demotion confirmation (FR-014)
    if (currentUserRole === 'admin' && memberId === currentUserMembershipId && newRole === 'member') {
      setConfirmDialog({ memberId, memberName, newRole, type: 'self-demotion' });
      return;
    }

    // Ownership transfer confirmation (FR-013)
    if (newRole === 'owner') {
      setConfirmDialog({ memberId, memberName, newRole, type: 'ownership-transfer' });
      return;
    }

    await executeRoleChange(memberId, newRole);
  }

  async function executeRoleChange(memberId: string, newRole: string) {
    try {
      await onRoleChange?.(memberId, newRole);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change role';
      setRoleError({ memberId, message });
    }
  }

  async function handleConfirm() {
    if (!confirmDialog) return;
    setConfirmDialog(null);
    await executeRoleChange(confirmDialog.memberId, confirmDialog.newRole);
  }

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--glass-border)] text-left">
            <th className="px-4 py-3 text-sm font-semibold text-white/60">Name</th>
            <th className="px-4 py-3 text-sm font-semibold text-white/60">Role</th>
            {(canRemoveMembers || onRemoveMember) && (
              <th className="px-4 py-3 text-sm font-semibold text-white/60">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const roleOptions = canChangeRoles ? getRoleOptions(currentUserRole!, member.role) : [];
            const showDropdown = canChangeRoles && onRoleChange && roleOptions.length > 0;

            return (
              <tr key={member.id} className="border-b border-[var(--glass-border)]">
                <td className="px-4 py-3">
                  <div className="text-sm text-white">
                    {member.firstName ? `${member.firstName}${member.lastName ? ` ${member.lastName}` : ''}` : member.email}
                  </div>
                  {member.firstName && <div className="text-sm text-white/40">{member.email}</div>}
                </td>
                <td className="px-4 py-3">
                  {showDropdown ? (
                    <div>
                      <select
                        value={member.role}
                        disabled={isChangingRole}
                        onChange={(e) => {
                          const memberName = member.firstName ? `${member.firstName}${member.lastName ? ` ${member.lastName}` : ''}` : member.email;
                          void handleRoleChange(member.id, memberName, e.target.value);
                        }}
                        className={`bg-[var(--glass-4)] border border-[var(--glass-border)] rounded-[var(--radius-sm)] text-white text-sm px-2 py-1 outline-none focus:border-blue-500 transition-colors [transition-duration:var(--duration-fast)] ${isChangingRole ? 'cursor-wait' : 'cursor-pointer'}`}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role] ?? role}
                          </option>
                        ))}
                      </select>
                      {roleError?.memberId === member.id && (
                        <div className="text-error-500 text-xs mt-1">{roleError.message}</div>
                      )}
                    </div>
                  ) : (
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                      {ROLE_LABELS[member.role] ?? member.role}
                    </span>
                  )}
                </td>
                {(canRemoveMembers || onRemoveMember) && (
                  <td className="px-4 py-3">
                    {(() => {
                      const isSelf = member.id === currentUserMembershipId;
                      const isOwnerRow = member.role === 'owner';
                      const memberName = member.firstName ? `${member.firstName}${member.lastName ? ` ${member.lastName}` : ''}` : member.email;

                      // Owner row: no actions
                      if (isOwnerRow) return null;

                      // Self row for non-admin/non-owner: show Leave
                      if (isSelf && !canRemoveMembers) {
                        return (
                          <button
                            disabled={isRemovingMember}
                            onClick={() => setRemoveDialog({ memberId: member.id, memberName, isSelf: true })}
                            className={`bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 hover:text-white hover:bg-[var(--glass-12)] text-xs px-3 py-1 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)] ${isRemovingMember ? 'cursor-wait' : 'cursor-pointer'}`}
                          >
                            Leave
                          </button>
                        );
                      }

                      // Admin/owner: show Remove for others, Leave for self
                      if (canRemoveMembers) {
                        return (
                          <button
                            disabled={isRemovingMember}
                            onClick={() => setRemoveDialog({ memberId: member.id, memberName, isSelf })}
                            className={isSelf
                              ? `bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 hover:text-white hover:bg-[var(--glass-12)] text-xs font-medium px-3 py-1 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)] ${isRemovingMember ? 'cursor-wait' : 'cursor-pointer'}`
                              : `bg-error-500/10 text-error-500 hover:bg-error-500/20 text-xs font-medium px-3 py-1 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)] ${isRemovingMember ? 'cursor-wait' : 'cursor-pointer'}`}
                          >
                            {isSelf ? 'Leave' : 'Remove'}
                          </button>
                        );
                      }

                      return null;
                    })()}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {removeDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-base-800 border border-[var(--glass-border)] rounded-[var(--radius-md)] p-6 max-w-md w-full [box-shadow:var(--shadow-3)]">
            <h3 className="text-base font-semibold text-white mb-3">
              {removeDialog.isSelf ? 'Leave organisation' : 'Remove member'}
            </h3>
            <p className="text-sm text-white/60 mb-4">
              {removeDialog.isSelf
                ? 'You will lose access to this organisation. Are you sure?'
                : `Are you sure you want to remove ${removeDialog.memberName}?`}
            </p>
            {removeError && <p className="text-error-500 text-xs mb-3">{removeError}</p>}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setRemoveDialog(null);
                  setRemoveError(null);
                }}
                className="bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 hover:text-white hover:bg-[var(--glass-12)] text-sm px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setRemoveError(null);
                  onRemoveMember?.(removeDialog.memberId)
                    .then(() => {
                      setRemoveDialog(null);
                    })
                    .catch((err: unknown) => {
                      setRemoveError(err instanceof Error ? err.message : 'Failed to remove member');
                    });
                }}
                disabled={isRemovingMember}
                className={`bg-error-500/10 text-error-500 hover:bg-error-500/20 text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)] ${isRemovingMember ? 'cursor-wait' : 'cursor-pointer'}`}
              >
                {removeDialog.isSelf ? 'Leave' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-base-800 border border-[var(--glass-border)] rounded-[var(--radius-md)] p-6 max-w-md w-full [box-shadow:var(--shadow-3)]">
            <h3 className="text-base font-semibold text-white mb-3">
              {confirmDialog.type === 'ownership-transfer' ? 'Transfer ownership' : 'Demote yourself'}
            </h3>
            <p className="text-sm text-white/60 mb-4">
              {confirmDialog.type === 'ownership-transfer'
                ? `Are you sure you want to transfer ownership to ${confirmDialog.memberName}? You will be demoted to admin.`
                : 'You will lose admin access. Are you sure?'}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 hover:text-white hover:bg-[var(--glass-12)] text-sm px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleConfirm()}
                className={`text-white text-sm font-medium px-4 py-2 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)] ${
                  confirmDialog.type === 'ownership-transfer'
                    ? 'bg-error-500/10 text-error-500 hover:bg-error-500/20'
                    : 'bg-nogo-500/20 text-nogo-400 hover:bg-nogo-500/30'
                }`}
              >
                {confirmDialog.type === 'ownership-transfer' ? 'Transfer ownership' : 'Demote myself'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
