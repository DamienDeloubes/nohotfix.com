// Query key factories following the hierarchical convention from the architecture doc
// All org-scoped keys include orgSlug as the first segment for proper cache isolation

export const orgKeys = {
  all: ['organisations'] as const,
  userOrgs: () => ['user-organisations'] as const,
  checkSlug: (slug: string) => ['check-slug', slug] as const,
};

export const runKeys = {
  all: (orgSlug: string) => ['runs', orgSlug] as const,
  lists: (orgSlug: string) => [...runKeys.all(orgSlug), 'list'] as const,
  list: (orgSlug: string, filters: Record<string, unknown>) => [...runKeys.lists(orgSlug), filters] as const,
  details: (orgSlug: string) => [...runKeys.all(orgSlug), 'detail'] as const,
  detail: (orgSlug: string, id: string) => [...runKeys.details(orgSlug), id] as const,
};

export const playbookKeys = {
  all: (orgSlug: string) => ['playbooks', orgSlug] as const,
  lists: (orgSlug: string) => [...playbookKeys.all(orgSlug), 'list'] as const,
  list: (orgSlug: string, filters: Record<string, unknown>) => [...playbookKeys.lists(orgSlug), filters] as const,
  details: (orgSlug: string) => [...playbookKeys.all(orgSlug), 'detail'] as const,
  detail: (orgSlug: string, id: string) => [...playbookKeys.details(orgSlug), id] as const,
  history: (orgSlug: string, playbookId: string) => [...playbookKeys.details(orgSlug), playbookId, 'history'] as const,
  archiveInfo: (orgSlug: string, playbookId: string) => [...playbookKeys.details(orgSlug), playbookId, 'archive-info'] as const,
};

export const specKeys = {
  all: (orgSlug: string) => ['specs', orgSlug] as const,
  lists: (orgSlug: string) => [...specKeys.all(orgSlug), 'list'] as const,
  list: (orgSlug: string, filters: Record<string, unknown>) => [...specKeys.lists(orgSlug), filters] as const,
  details: (orgSlug: string) => [...specKeys.all(orgSlug), 'detail'] as const,
  detail: (orgSlug: string, id: string) => [...specKeys.details(orgSlug), id] as const,
  systemsUnderTest: (orgSlug: string) => [...specKeys.all(orgSlug), 'systems-under-test'] as const,
  tags: (orgSlug: string) => [...specKeys.all(orgSlug), 'tags'] as const,
  history: (orgSlug: string, specId: string) => [...specKeys.details(orgSlug), specId, 'history'] as const,
  impact: (orgSlug: string, specId: string) => [...specKeys.details(orgSlug), specId, 'impact'] as const,
};

export const historyKeys = {
  all: (orgSlug: string) => ['history', orgSlug] as const,
  lists: (orgSlug: string) => [...historyKeys.all(orgSlug), 'list'] as const,
  list: (orgSlug: string, filters: Record<string, unknown>) => [...historyKeys.lists(orgSlug), filters] as const,
  details: (orgSlug: string) => [...historyKeys.all(orgSlug), 'detail'] as const,
  detail: (orgSlug: string, id: string) => [...historyKeys.details(orgSlug), id] as const,
};

export const userKeys = {
  me: (orgSlug: string) => ['user', 'me', orgSlug] as const,
};

export const inviteKeys = {
  all: (orgSlug: string) => ['invites', orgSlug] as const,
  list: (orgSlug: string) => [...inviteKeys.all(orgSlug), 'list'] as const,
  detail: (orgSlug: string, id: string) => [...inviteKeys.all(orgSlug), 'detail', id] as const,
};

export const environmentKeys = {
  all: (orgSlug: string) => ['environments', orgSlug] as const,
  lists: (orgSlug: string) => [...environmentKeys.all(orgSlug), 'list'] as const,
  list: (orgSlug: string) => [...environmentKeys.lists(orgSlug)] as const,
};

export const settingsKeys = {
  all: (orgSlug: string) => ['settings', orgSlug] as const,
  org: (orgSlug: string) => [...settingsKeys.all(orgSlug), 'org'] as const,
  members: (orgSlug: string) => [...settingsKeys.all(orgSlug), 'members'] as const,
  subscription: (orgSlug: string) => [...settingsKeys.all(orgSlug), 'subscription'] as const,
};
