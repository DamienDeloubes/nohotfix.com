import type React from 'react';

import type { LibrarySpec } from '@nohotfix/shared';

import { useSpecDetail } from '../hooks/use-spec-detail.js';
import { ArtifactRequirementsDisplay } from './ArtifactRequirementsDisplay.js';
import { RichTextViewer } from './RichTextViewer.js';

interface SpecDetailProps {
  orgSlug: string;
  specId: string;
  queryKey: readonly unknown[];
  isArchived?: boolean;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#ca8a04',
  low: '#16a34a',
};

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'white',
        backgroundColor: SEVERITY_COLORS[severity] ?? '#6b7280',
        textTransform: 'capitalize',
      }}
    >
      {severity}
    </span>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: '0.875rem', color: '#1f2937' }}>{children}</div>
    </div>
  );
}

function TestStepsList({ steps }: { steps: { instruction: string; expectedOutcome?: string }[] }) {
  return (
    <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
      {steps.map((step, i) => (
        <li key={i} style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 500 }}>{step.instruction}</div>
          {step.expectedOutcome && <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Expected: {step.expectedOutcome}</div>}
        </li>
      ))}
    </ol>
  );
}

function ArchivedBadge() {
  return (
    <span
      style={{
        display: 'inline-block',
        background: '#fef2f2',
        color: '#991b1b',
        borderRadius: '4px',
        padding: '2px 8px',
        fontWeight: 600,
        fontSize: '0.75rem',
      }}
    >
      Archived
    </span>
  );
}

function SpecContent({ spec, isArchived }: { spec: LibrarySpec; isArchived?: boolean }) {
  const testSteps = spec.testSteps as { instruction: string; expectedOutcome?: string }[] | null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{spec.title}</h1>
        <SeverityBadge severity={spec.severity} />
        {isArchived && <ArchivedBadge />}
      </div>

      {spec.systemUnderTest && <Section label="System Under Test">{spec.systemUnderTest}</Section>}

      {spec.preconditions != null && (
        <Section label="Preconditions">
          <RichTextViewer content={spec.preconditions} />
        </Section>
      )}

      {spec.description != null && (
        <Section label="Description">
          <RichTextViewer content={spec.description} />
        </Section>
      )}

      {testSteps && testSteps.length > 0 && (
        <Section label="Test Steps">
          <TestStepsList steps={testSteps} />
        </Section>
      )}

      {spec.expectedResult != null && (
        <Section label="Expected Result">
          <RichTextViewer content={spec.expectedResult} />
        </Section>
      )}

      {spec.artifactRequirements && spec.artifactRequirements.length > 0 && (
        <Section label="Artifact Requirements">
          <ArtifactRequirementsDisplay requirements={spec.artifactRequirements} />
        </Section>
      )}

      {spec.testerNotes && <Section label="Tester Notes">{spec.testerNotes}</Section>}

      {spec.tags && spec.tags.length > 0 && (
        <Section label="Tags">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {spec.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-block',
                  padding: '0.125rem 0.5rem',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Section>
      )}

      {spec.estimatedDurationMinutes != null && <Section label="Estimated Duration">{spec.estimatedDurationMinutes} min</Section>}

      <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
        Created {new Date(spec.createdAt).toLocaleDateString()} &middot; Last updated {new Date(spec.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}

export function SpecDetail({ orgSlug, specId, queryKey, isArchived }: SpecDetailProps): React.JSX.Element {
  const { data: spec, isLoading, error } = useSpecDetail({ orgSlug, specId, queryKey });

  if (isLoading) {
    return <div style={{ padding: '2rem', color: '#6b7280' }}>Loading spec...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: '#ef4444' }}>Failed to load spec: {error.message}</div>;
  }

  if (!spec) {
    return <div style={{ padding: '2rem', color: '#6b7280' }}>Spec not found</div>;
  }

  return <SpecContent spec={spec} isArchived={isArchived ?? spec.isArchived} />;
}
