import { Dropdown, Label } from '@heroui/react';
import { useOrgContext, useUserOrganisations } from '@nohotfix/domain-identity/ui';
import { useNavigate } from '@tanstack/react-router';

import { orgKeys } from '../../api/query-keys.js';

export function OrgSwitcher() {
  const navigate = useNavigate();
  const { orgSlug, orgName } = useOrgContext();
  const { data: orgs } = useUserOrganisations({ queryKey: orgKeys.userOrgs() });

  const isSingleOrg = !orgs || orgs.length <= 1;

  if (isSingleOrg) {
    return (
      <>
        <span className="text-sm text-slate-500">&middot;</span>
        <span className="max-w-[200px] truncate text-sm text-secondary">{orgName}</span>
      </>
    );
  }

  return (
    <>
      <span className="text-sm text-slate-500">&middot;</span>
      <Dropdown>
        <Dropdown.Trigger>
          <button
            type="button"
            className="flex max-w-[200px] items-center gap-1 truncate text-sm text-secondary transition-colors [transition-duration:var(--duration-fast)] hover:text-muted"
          >
            {orgName}
            <svg className="h-3 w-3 shrink-0 opacity-50" viewBox="0 0 12 12" fill="none">
              <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </Dropdown.Trigger>
        <Dropdown.Popover className="bg-[var(--surface-card)] border border-[var(--surface-border)] [box-shadow:var(--shadow-3)]">
          <Dropdown.Menu
            aria-label="Switch organisation"
            selectionMode="single"
            selectedKeys={new Set([orgSlug])}
            onAction={(key) => {
              const newSlug = String(key);
              if (newSlug !== orgSlug) {
                void navigate({ to: '/$orgSlug', params: { orgSlug: newSlug } });
              }
            }}
          >
            {(orgs ?? []).map((org) => (
              <Dropdown.Item key={org.slug} id={org.slug} className={org.slug === orgSlug ? 'bg-[var(--surface-active)] text-muted' : 'text-secondary'}>
                <Label>{org.name}</Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </>
  );
}
