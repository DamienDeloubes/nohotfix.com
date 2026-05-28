import type { PlaybookHistoryEntry } from '@nohotfix/shared';

/** Maps a playbook history entry to a human-readable action description. */
export function describePlaybookHistoryAction(entry: PlaybookHistoryEntry): string {
  const fc = entry.fieldChanges;

  switch (entry.action) {
    case 'created':
      return 'created this playbook';
    case 'archived':
      return 'archived this playbook';
    case 'unarchived':
      return 'unarchived this playbook';
    case 'name_changed': {
      const old = fc?.old as string | undefined;
      const next = fc?.new as string | undefined;
      if (old && next) return `changed name from '${old}' to '${next}'`;
      return 'changed name';
    }
    case 'description_updated': {
      const old = fc?.old as string | null | undefined;
      const next = fc?.new as string | null | undefined;
      if (next && !old) return 'added description';
      if (!next && old) return 'removed description';
      return 'updated description';
    }
    case 'environment_changed': {
      const oldName = fc?.oldName as string | null | undefined;
      const newName = fc?.newName as string | null | undefined;
      if (oldName && newName) return `changed environment from '${oldName}' to '${newName}'`;
      if (newName) return `set environment to '${newName}'`;
      if (oldName) return `removed environment '${oldName}'`;
      return 'changed environment';
    }
    case 'section_added': {
      const name = fc?.name as string | undefined;
      return name ? `added section '${name}'` : 'added a section';
    }
    case 'section_renamed': {
      const old = fc?.old as string | undefined;
      const next = fc?.new as string | undefined;
      if (old && next) return `renamed section from '${old}' to '${next}'`;
      return 'renamed a section';
    }
    case 'section_removed': {
      const name = fc?.name as string | undefined;
      const specCount = fc?.specCount as number | undefined;
      if (name && specCount != null) return `removed section '${name}' (${specCount} spec${specCount === 1 ? '' : 's'})`;
      if (name) return `removed section '${name}'`;
      return 'removed a section';
    }
    case 'sections_reordered':
      return 'reordered sections';
    case 'spec_added': {
      const title = fc?.specTitle as string | undefined;
      const sectionName = fc?.sectionName as string | null | undefined;
      if (title && sectionName) return `added spec '${title}' to section '${sectionName}'`;
      if (title) return `added spec '${title}'`;
      return 'added a spec';
    }
    case 'spec_removed': {
      const title = fc?.specTitle as string | undefined;
      const sectionName = fc?.sectionName as string | null | undefined;
      if (title && sectionName) return `removed spec '${title}' from section '${sectionName}'`;
      if (title) return `removed spec '${title}'`;
      return 'removed a spec';
    }
    case 'spec_archived': {
      const title = fc?.specTitle as string | undefined;
      const sectionName = fc?.sectionName as string | null | undefined;
      if (title && sectionName) return `archived spec '${title}' from section '${sectionName}'`;
      if (title) return `archived spec '${title}'`;
      return 'archived a spec';
    }
    case 'specs_reordered': {
      const sectionName = fc?.sectionName as string | null | undefined;
      if (sectionName) return `reordered specs in section '${sectionName}'`;
      return 'reordered specs';
    }
    default:
      return entry.action;
  }
}
