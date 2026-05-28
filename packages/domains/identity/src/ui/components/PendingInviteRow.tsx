import type { InviteDto } from '@releasepilot/shared';

import { INVITE_RESEND_COOLDOWN_MS } from '../../entities/invite.js';

interface PendingInviteRowProps {
  invite: InviteDto;
  onResend?: (inviteId: string) => Promise<void>;
  onRevoke?: (inviteId: string) => Promise<void>;
  isResending?: boolean;
  isRevoking?: boolean;
}

function canResend(invite: InviteDto): boolean {
  const now = Date.now();
  const lastSent = new Date(invite.lastSentAt).getTime();
  return now - lastSent >= INVITE_RESEND_COOLDOWN_MS;
}

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  member: 'Member',
};

export function PendingInviteRow({ invite, onResend, onRevoke, isResending, isRevoking }: PendingInviteRowProps) {
  const resendEnabled = canResend(invite) && !isResending;

  return (
    <tr className="border-b border-[var(--glass-border)]">
      <td className="px-4 py-3">
        <div className="text-sm text-white">{invite.email}</div>
        <div className="text-xs text-white/40">
          Invited by {invite.invitedBy.firstName ? `${invite.invitedBy.firstName}${invite.invitedBy.lastName ? ` ${invite.invitedBy.lastName}` : ''}` : 'a team member'}
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-nogo-500/20 text-nogo-400">
          Pending
        </span>
        <span
          className={`inline-block ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            invite.role === 'admin'
              ? 'bg-blue-500/20 text-blue-300'
              : 'bg-[var(--glass-8)] text-white/60'
          }`}
        >
          {ROLE_LABELS[invite.role] ?? invite.role}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex gap-2 justify-end">
          {onResend && (
            <button
              onClick={() => void onResend(invite.id)}
              disabled={!resendEnabled}
              className={resendEnabled
                ? 'bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/60 hover:text-white hover:bg-[var(--glass-12)] text-xs px-2 py-1 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]'
                : 'bg-[var(--glass-4)] border border-[var(--glass-border)] text-white/20 cursor-not-allowed text-xs px-2 py-1 rounded-[var(--radius-sm)]'}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </button>
          )}
          {onRevoke && (
            <button
              onClick={() => void onRevoke(invite.id)}
              disabled={isRevoking}
              className={isRevoking
                ? 'bg-error-500/10 text-error-500/40 cursor-not-allowed text-xs px-2 py-1 rounded-[var(--radius-sm)]'
                : 'bg-error-500/10 text-error-500 hover:bg-error-500/20 text-xs px-2 py-1 rounded-[var(--radius-sm)] transition-colors [transition-duration:var(--duration-fast)]'}
            >
              {isRevoking ? 'Revoking...' : 'Revoke'}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
