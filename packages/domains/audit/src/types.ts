import type { PlaybookHistoryAction, SpecHistoryAction } from '@releasepilot/shared';

export interface ChangelogEntry {
  id: string;
  orgId: string;
  entityType: 'playbook' | 'spec_library';
  entityId: string;
  action: string;
  fieldChanges?: Record<string, { old: unknown; new: unknown }>;
  actorId: string;
  actorName: string;
  createdAt: Date;
}

export interface PlaybookChangelogEntry {
  id: string;
  action: PlaybookHistoryAction;
  fieldChanges: Record<string, unknown> | null;
  actorName: string;
  isRemovedMember: boolean;
  createdAt: Date;
}

export interface SpecChangelogEntry {
  id: string;
  action: SpecHistoryAction;
  fieldChanges: Record<string, { old: unknown; new: unknown }> | null;
  actorName: string;
  isRemovedMember: boolean;
  createdAt: Date;
}
