import {
  InviteMemberForm,
  MembersList,
  PendingInviteRow,
  useChangeMemberRole,
  useCreateInvite,
  useCurrentUser,
  useInvites,
  useOrgContext,
  useOrgMembers,
  useRemoveMember,
  useResendInvite,
  useRevokeInvite,
} from '@nohotfix/domain-identity/ui';
import { requireRole } from '@nohotfix/shared';
import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

import { inviteKeys, orgKeys, settingsKeys, userKeys } from '../../../../api/query-keys.js';

export const Route = createFileRoute('/_authenticated/$orgSlug/settings/members')({
  component: MembersSettingsPage,
});

function MembersSettingsPage() {
  const { orgSlug, role } = useOrgContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAdmin = requireRole(role, { minimum: 'admin' });

  const { data: currentUser } = useCurrentUser({ queryKey: userKeys.me(orgSlug), orgSlug });

  const { data: membersData, isLoading: membersLoading, error: membersError } = useOrgMembers({ orgSlug, queryKey: settingsKeys.members(orgSlug) });

  const currentUserMembershipId = useMemo(() => {
    if (!currentUser || !membersData?.members) return undefined;
    const match = membersData.members.find((m) => m.userId === currentUser.id);
    return match?.id;
  }, [currentUser, membersData]);

  const { data: invitesData } = useInvites({
    orgSlug,
    queryKey: inviteKeys.list(orgSlug),
    enabled: isAdmin,
  });

  const createInviteMutation = useCreateInvite({
    orgSlug,
    invalidateKeys: [inviteKeys.list(orgSlug)],
  });

  const resendMutation = useResendInvite({
    orgSlug,
    invalidateKeys: [inviteKeys.list(orgSlug)],
  });

  const revokeMutation = useRevokeInvite({
    orgSlug,
    invalidateKeys: [inviteKeys.list(orgSlug)],
  });

  const changeRoleMutation = useChangeMemberRole({
    orgSlug,
    invalidateKeys: [settingsKeys.members(orgSlug), orgKeys.userOrgs()],
  });

  const removeMemberMutation = useRemoveMember({
    orgSlug,
    invalidateKeys: [],
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">Members</h2>

      {isAdmin && (
        <InviteMemberForm
          onSubmit={async (data) => {
            await createInviteMutation.mutateAsync(data);
          }}
          isPending={createInviteMutation.isPending}
          error={createInviteMutation.error}
        />
      )}

      {isAdmin && invitesData?.invites && invitesData.invites.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-white/40 mb-2">Pending invites</h3>
          <table className="w-full border-collapse">
            <tbody>
              {invitesData.invites.map((invite) => (
                <PendingInviteRow
                  key={invite.id}
                  invite={invite}
                  onResend={async (id) => {
                    await resendMutation.mutateAsync(id);
                  }}
                  onRevoke={async (id) => {
                    await revokeMutation.mutateAsync(id);
                  }}
                  isResending={resendMutation.isPending}
                  isRevoking={revokeMutation.isPending}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <MembersList
        members={membersData?.members}
        isLoading={membersLoading}
        error={membersError}
        currentUserRole={role}
        currentUserMembershipId={currentUserMembershipId}
        onRoleChange={async (memberId, newRole) => {
          await changeRoleMutation.mutateAsync({ memberId, role: newRole as 'owner' | 'admin' | 'member' });
        }}
        isChangingRole={changeRoleMutation.isPending}
        onRemoveMember={async (memberId) => {
          const isSelf = memberId === currentUserMembershipId;
          await removeMemberMutation.mutateAsync({ memberId });
          if (isSelf) {
            void navigate({ to: '/' });
          } else {
            void queryClient.invalidateQueries({ queryKey: settingsKeys.members(orgSlug) });
          }
        }}
        isRemovingMember={removeMemberMutation.isPending}
      />
    </div>
  );
}
