import { DomainError, ErrorCode } from '@releasepilot/shared';

export class AuthorPlaybookNotFoundError extends DomainError {
  constructor(playbookId?: string) {
    super(ErrorCode.AUTHOR_PLAYBOOK_NOT_FOUND, 'Playbook not found', 404, playbookId ? { playbookId } : undefined);
  }
}

export class AuthorSpecNotFoundError extends DomainError {
  constructor(specId?: string) {
    super(ErrorCode.AUTHOR_SPEC_NOT_FOUND, 'Spec not found', 404, specId ? { specId } : undefined);
  }
}

export class AuthorSpecArchivedError extends DomainError {
  constructor(specId?: string) {
    super(ErrorCode.AUTHOR_SPEC_ARCHIVED, 'Spec is archived and cannot be modified', 409, specId ? { specId } : undefined);
  }
}

export class AuthorSyncConflictError extends DomainError {
  constructor(details?: Record<string, unknown>) {
    super(ErrorCode.AUTHOR_SYNC_CONFLICT, 'Sync conflict detected', 409, details);
  }
}

export class AuthorSpecTitleInvalidError extends DomainError {
  constructor(message = 'Spec title is invalid') {
    super(ErrorCode.AUTHOR_SPEC_TITLE_INVALID, message, 400);
  }
}

export class AuthorSpecStepInvalidError extends DomainError {
  constructor(message = 'Test step is invalid', details?: Record<string, unknown>) {
    super(ErrorCode.AUTHOR_SPEC_STEP_INVALID, message, 400, details);
  }
}

export class AuthorSpecDurationInvalidError extends DomainError {
  constructor(message = 'Estimated duration is invalid') {
    super(ErrorCode.AUTHOR_SPEC_DURATION_INVALID, message, 400);
  }
}

export class AuthorSpecTagsInvalidError extends DomainError {
  constructor(message = 'Tags are invalid') {
    super(ErrorCode.AUTHOR_SPEC_TAGS_INVALID, message, 400);
  }
}

export class AuthorSpecFieldTooLongError extends DomainError {
  constructor(field: string, maxLength: number) {
    super(ErrorCode.AUTHOR_SPEC_FIELD_TOO_LONG, `Field '${field}' exceeds the maximum of ${maxLength} characters`, 400, { field, maxLength });
  }
}

export class AuthorArtifactLabelInvalidError extends DomainError {
  constructor(message = 'Artifact label is invalid') {
    super(ErrorCode.AUTHOR_ARTIFACT_LABEL_INVALID, message, 400);
  }
}

export class AuthorArtifactRequirementsInvalidError extends DomainError {
  constructor(message = 'Artifact requirements are invalid') {
    super(ErrorCode.AUTHOR_ARTIFACT_REQUIREMENTS_INVALID, message, 400);
  }
}

export class AuthorSectionNotFoundError extends DomainError {
  constructor(sectionId?: string) {
    super(ErrorCode.AUTHOR_SECTION_NOT_FOUND, 'Section not found', 404, sectionId ? { sectionId } : undefined);
  }
}

export class AuthorPlaybookNameInvalidError extends DomainError {
  constructor(message = 'Playbook name is invalid') {
    super(ErrorCode.AUTHOR_PLAYBOOK_NAME_INVALID, message, 400);
  }
}

export class AuthorPlaybookSpecDuplicateError extends DomainError {
  constructor(specLibraryId?: string) {
    super(ErrorCode.AUTHOR_PLAYBOOK_SPEC_DUPLICATE, 'Spec already exists in this playbook', 409, specLibraryId ? { specLibraryId } : undefined);
  }
}

export class AuthorPlaybookArchivedError extends DomainError {
  constructor(playbookId?: string) {
    super(ErrorCode.AUTHOR_PLAYBOOK_ARCHIVED, 'Playbook is archived and cannot be modified', 409, playbookId ? { playbookId } : undefined);
  }
}
