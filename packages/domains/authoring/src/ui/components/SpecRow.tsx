import type { PlaybookSpecSummary } from '../hooks/use-playbook-detail.js';

interface SpecRowProps {
  spec: PlaybookSpecSummary;
  onRemove?: (specId: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function SpecRow({ spec, onRemove, dragHandleProps }: SpecRowProps) {
  return (
    <li data-spec-id={spec.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
      <span {...(dragHandleProps ?? {})} style={{ cursor: 'grab', userSelect: 'none' }} aria-label="Drag to reorder">
        ⠿
      </span>
      <span style={{ flex: 1 }}>{spec.title}</span>
      {spec.severity && <span style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', background: '#e5e7eb' }}>{spec.severity}</span>}
      {spec.systemUnderTest && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{spec.systemUnderTest}</span>}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(spec.id)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.875rem' }}
          aria-label={`Remove ${spec.title}`}
        >
          Remove
        </button>
      )}
    </li>
  );
}
