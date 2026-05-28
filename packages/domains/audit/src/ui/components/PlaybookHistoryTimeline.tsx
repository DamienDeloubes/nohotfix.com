import type React from 'react';

import { formatRelativeTime, type PlaybookHistoryEntry } from '@nohotfix/shared';

import { describePlaybookHistoryAction } from '../lib/describe-playbook-history-action.js';

interface PlaybookHistoryTimelineProps {
  entries: PlaybookHistoryEntry[];
}

export function PlaybookHistoryTimeline({ entries }: PlaybookHistoryTimelineProps): React.ReactElement {
  if (entries.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No history entries yet.</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {entries.map((entry) => (
        <div
          key={entry.id}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderLeft: '2px solid #e5e7eb',
          }}
        >
          <span
            style={{
              fontWeight: 500,
              color: entry.isRemovedMember ? '#9ca3af' : '#111827',
              fontStyle: entry.isRemovedMember ? 'italic' : 'normal',
            }}
          >
            {entry.actorName}
          </span>
          <span style={{ color: '#374151' }}>{describePlaybookHistoryAction(entry)}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatRelativeTime(entry.createdAt)}</span>
        </div>
      ))}
    </div>
  );
}
