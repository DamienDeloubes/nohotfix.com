export interface Playbook {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  environmentId?: string;
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybookSection {
  id: string;
  playbookId: string;
  orgId: string;
  name: string;
  position: number;
  createdAt: Date;
}

export interface PlaybookSpec {
  id: string;
  sectionId: string | null;
  playbookId: string;
  orgId: string;
  specLibraryId: string;
  position: number;
  createdAt: Date;
}

export interface PlaybookWithCounts {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  environmentName?: string;
  isArchived: boolean;
  createdBy: string;
  specCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpecListItemEntry {
  id: string;
  title: string;
  systemUnderTest: string | null;
  severity: string;
  tags: string[];
  updatedAt: Date;
}

export interface PlaybookSpecSummary {
  id: string;
  specLibraryId: string;
  position: number;
  title: string;
  severity: string | null;
  systemUnderTest: string | null;
}

export interface PlaybookSectionDetail {
  id: string;
  name: string;
  position: number;
  specs: PlaybookSpecSummary[];
}

export interface PlaybookDetail {
  playbook: Playbook;
  sections: PlaybookSectionDetail[];
  ungroupedSpecs: PlaybookSpecSummary[];
}

export interface SpecLibraryEntry {
  id: string;
  orgId: string;
  title: string;
  systemUnderTest: string | null;
  severity: string;
  preconditions: unknown;
  description: unknown;
  testSteps: unknown;
  expectedResult: unknown;
  artifactRequirements: unknown;
  testerNotes: string | null;
  estimatedDurationMinutes: number | null;
  tags: string[];
  isArchived: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
