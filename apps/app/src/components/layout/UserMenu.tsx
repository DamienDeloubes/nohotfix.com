import { logout } from '@/lib/session.js';
import { Avatar, Dropdown, Label } from '@heroui/react';
import { useCurrentUser, useOrgContext } from '@nohotfix/domain-identity/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useRef } from 'react';

import { userKeys } from '../../api/query-keys.js';
import { LordiconIcon, type LordiconIconHandle } from '../ui/LordiconIcon.js';
import ExitIcon from './../../assets/icons/exit.json';

export function UserMenu() {
  const iconRef = useRef<LordiconIconHandle>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { orgSlug } = useOrgContext();
  const { data: user } = useCurrentUser({ queryKey: userKeys.me(orgSlug), orgSlug });

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('').toUpperCase() || '?';
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || '';

  return (
    <Dropdown>
      <Dropdown.Trigger className="rounded-full">
        <Avatar>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col gap-0">
              <p className="text-sm leading-5 font-medium">{displayName}</p>
              {user?.email && <p className="text-xs leading-none text-muted">{user?.email}</p>}
            </div>
          </div>
        </div>
        <Dropdown.Menu>
          <Dropdown.Item id="account" textValue="Account" onAction={() => navigate({ to: '/$orgSlug/settings/account', params: { orgSlug } })}>
            <Label>Account</Label>
          </Dropdown.Item>

          <Dropdown.Item id="organization" textValue="Organization" onAction={() => navigate({ to: '/$orgSlug/settings/profile', params: { orgSlug } })}>
            <Label>Organization</Label>
          </Dropdown.Item>

          <Dropdown.Item
            id="logout"
            textValue="Logout"
            variant="danger"
            onAction={() => logout(queryClient)}
            onMouseEnter={() => {
              iconRef.current?.play();
            }}
          >
            <div className="flex w-full items-center justify-between gap-2">
              <Label>Log Out</Label>
              <LordiconIcon ref={iconRef} icon={ExitIcon} size={20} colors="var(--color-danger)" />
            </div>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
