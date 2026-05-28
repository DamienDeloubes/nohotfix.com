import { extractPlainTextLength } from '@nohotfix/shared';

import { AuthorSpecFieldTooLongError } from '../errors/index.js';
import { ArtifactRequirements, type ArtifactRequirementJson } from './value-objects/artifact-requirements.js';
import { EstimatedDuration } from './value-objects/estimated-duration.js';
import { Severity } from './value-objects/severity.js';
import { SpecTags } from './value-objects/spec-tags.js';
import { SpecTitle } from './value-objects/spec-title.js';
import { TestStep, type TestStepProps } from './value-objects/test-step.js';

export interface SpecLibraryEntryProps {
  id: string;
  orgId: string;
  title: SpecTitle;
  systemUnderTest: string | null;
  severity: Severity;
  preconditions: unknown;
  description: unknown;
  testSteps: TestStep[];
  expectedResult: unknown;
  artifactRequirements: ArtifactRequirementJson[] | null;
  testerNotes: string | null;
  estimatedDurationMinutes: number | null;
  tags: string[];
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSpecLibraryEntryParams {
  id: string;
  orgId: string;
  title: string;
  systemUnderTest?: string | null;
  severity?: string;
  preconditions?: unknown;
  description?: unknown;
  testSteps?: TestStepProps[];
  expectedResult?: unknown;
  artifactRequirements?: Array<{ type: string; label: string; description?: string | null; required?: boolean }>;
  testerNotes?: string | null;
  estimatedDurationMinutes?: number | null;
  tags?: string[];
  createdBy: string;
}

const MAX_TEST_STEPS = 50;

const RICH_TEXT_LIMITS: Record<string, number> = {
  preconditions: 5_000,
  description: 10_000,
  expectedResult: 5_000,
};

const TESTER_NOTES_MAX = 2_000;

/** Normalise rich text: treat undefined as null, pass through otherwise. */
function normaliseRichText(value: unknown): unknown {
  return value ?? null;
}

/** Validate a rich text field against its plain-text character limit. */
function validateRichTextLength(field: string, value: unknown): void {
  const maxLength = RICH_TEXT_LIMITS[field];
  if (maxLength == null) return;
  const length = extractPlainTextLength(value);
  if (length > maxLength) {
    throw new AuthorSpecFieldTooLongError(field, maxLength);
  }
}

export class SpecLibraryEntryEntity {
  readonly id: string;
  readonly orgId: string;
  readonly title: SpecTitle;
  readonly systemUnderTest: string | null;
  readonly severity: Severity;
  readonly preconditions: unknown;
  readonly description: unknown;
  readonly testSteps: TestStep[];
  readonly expectedResult: unknown;
  readonly artifactRequirements: ArtifactRequirementJson[] | null;
  readonly testerNotes: string | null;
  readonly estimatedDurationMinutes: number | null;
  readonly tags: string[];
  readonly isArchived: boolean;
  readonly createdBy: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: SpecLibraryEntryProps) {
    this.id = props.id;
    this.orgId = props.orgId;
    this.title = props.title;
    this.systemUnderTest = props.systemUnderTest;
    this.severity = props.severity;
    this.preconditions = props.preconditions;
    this.description = props.description;
    this.testSteps = props.testSteps;
    this.expectedResult = props.expectedResult;
    this.artifactRequirements = props.artifactRequirements;
    this.testerNotes = props.testerNotes;
    this.estimatedDurationMinutes = props.estimatedDurationMinutes;
    this.tags = props.tags;
    this.isArchived = props.isArchived;
    this.createdBy = props.createdBy;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(params: CreateSpecLibraryEntryParams): SpecLibraryEntryEntity {
    const title = SpecTitle.create(params.title);
    const severity = params.severity ? Severity.create(params.severity) : Severity.default();

    const testSteps = (params.testSteps ?? []).map((step) => TestStep.create(step));
    if (testSteps.length > MAX_TEST_STEPS) {
      throw new Error(`Cannot exceed ${MAX_TEST_STEPS} test steps`);
    }

    // Validate rich text character limits before normalising
    validateRichTextLength('preconditions', params.preconditions);
    validateRichTextLength('description', params.description);
    validateRichTextLength('expectedResult', params.expectedResult);

    // Normalise tester notes: trim, whitespace-only → null, then check length
    const trimmedNotes = params.testerNotes?.trim() || null;
    if (trimmedNotes && trimmedNotes.length > TESTER_NOTES_MAX) {
      throw new AuthorSpecFieldTooLongError('testerNotes', TESTER_NOTES_MAX);
    }

    const now = new Date();
    return new SpecLibraryEntryEntity({
      id: params.id,
      orgId: params.orgId,
      title,
      systemUnderTest: params.systemUnderTest?.trim() || null,
      severity,
      preconditions: normaliseRichText(params.preconditions),
      description: normaliseRichText(params.description),
      testSteps,
      expectedResult: normaliseRichText(params.expectedResult),
      artifactRequirements: params.artifactRequirements?.length ? ArtifactRequirements.create(params.artifactRequirements).toJson() : null,
      testerNotes: trimmedNotes,
      estimatedDurationMinutes: params.estimatedDurationMinutes != null ? EstimatedDuration.create(params.estimatedDurationMinutes).value : null,
      tags: SpecTags.create(params.tags ?? []).toArray(),
      isArchived: false,
      createdBy: params.createdBy,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: SpecLibraryEntryProps): SpecLibraryEntryEntity {
    return new SpecLibraryEntryEntity(props);
  }
}
