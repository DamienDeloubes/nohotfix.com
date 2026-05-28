import type { SpecHistoryEntry } from '@releasepilot/shared';

/** Maps a spec history entry to a human-readable action description. */
export function describeHistoryAction(entry: SpecHistoryEntry): string {
  const fc = entry.fieldChanges;

  switch (entry.action) {
    case 'created':
      return 'created this spec';
    case 'title_changed': {
      const old = fc?.title?.old as string | undefined;
      const next = fc?.title?.new as string | undefined;
      if (old && next) return `changed title from '${old}' to '${next}'`;
      return 'changed title';
    }
    case 'description_updated':
      return 'updated description';
    case 'tags_changed': {
      const oldTags = fc?.tags?.old as string[] | undefined;
      const newTags = fc?.tags?.new as string[] | undefined;
      if (oldTags && newTags) return `changed tags from '${oldTags.join(', ')}' to '${newTags.join(', ')}'`;
      return 'changed tags';
    }
    case 'duration_changed': {
      const oldDur = fc?.estimated_duration_minutes?.old;
      const newDur = fc?.estimated_duration_minutes?.new;
      if (oldDur != null && newDur != null) return `changed estimated duration from ${oldDur} to ${newDur} minutes`;
      return 'changed estimated duration';
    }
    case 'artifact_added': {
      const label = (fc?.artifact?.new as { label?: string })?.label;
      return label ? `added artifact requirement '${label}'` : 'added artifact requirement';
    }
    case 'artifact_removed': {
      const label = (fc?.artifact?.old as { label?: string })?.label;
      return label ? `removed artifact requirement '${label}'` : 'removed artifact requirement';
    }
    case 'artifact_modified': {
      const label = (fc?.artifact?.new as { label?: string })?.label ?? (fc?.artifact?.old as { label?: string })?.label;
      return label ? `modified artifact requirement '${label}'` : 'modified artifact requirement';
    }
    case 'system_under_test_changed': {
      const oldSut = fc?.system_under_test?.old as string | null | undefined;
      const newSut = fc?.system_under_test?.new as string | null | undefined;
      if (oldSut && newSut) return `changed system under test from '${oldSut}' to '${newSut}'`;
      if (newSut) return `set system under test to '${newSut}'`;
      if (oldSut) return `removed system under test '${oldSut}'`;
      return 'changed system under test';
    }
    case 'severity_changed': {
      const oldSev = fc?.severity?.old as string | null | undefined;
      const newSev = fc?.severity?.new as string | null | undefined;
      if (oldSev && newSev) return `changed severity from '${oldSev}' to '${newSev}'`;
      if (newSev) return `set severity to '${newSev}'`;
      if (oldSev) return `removed severity`;
      return 'changed severity';
    }
    case 'preconditions_updated':
      return 'updated preconditions';
    case 'test_steps_updated':
      return 'updated test steps';
    case 'expected_result_updated':
      return 'updated expected result';
    case 'tester_notes_updated':
      return 'updated tester notes';
    case 'archived':
      return 'archived this spec';
    case 'unarchived':
      return 'unarchived this spec';
    default:
      return entry.action;
  }
}
