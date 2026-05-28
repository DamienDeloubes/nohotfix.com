import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

// ---- Identity ----

export interface OrganisationsTable {
  id: Generated<string>;
  name: string;
  slug: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface UsersTable {
  id: Generated<string>;
  workos_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface MembershipsTable {
  id: Generated<string>;
  org_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface EnvironmentsTable {
  id: Generated<string>;
  org_id: string;
  name: string;
  position: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface InvitesTable {
  id: Generated<string>;
  org_id: string;
  email: string;
  role: 'admin' | 'member';
  token: string;
  status: 'pending' | 'accepted' | 'revoked';
  invited_by: string;
  token_expires_at: ColumnType<Date, string, string>;
  last_sent_at: ColumnType<Date, string, string>;
  accepted_by: string | null;
  accepted_at: ColumnType<Date, string | undefined, never> | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

// ---- Billing ----

export interface SubscriptionsTable {
  id: Generated<string>;
  org_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: 'trialing' | 'grace_period' | 'past_due' | 'active' | 'cancelled' | 'expired';
  trial_ends_at: Date | null;
  current_period_start: Date | null;
  current_period_end: Date | null;
  cancel_at: Date | null;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface StripeWebhookEventsTable {
  id: Generated<string>;
  stripe_event_id: string;
  event_type: string;
  processed_at: Date | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

// ---- Authoring ----

export interface SpecLibraryTable {
  id: Generated<string>;
  org_id: string;
  title: string;
  system_under_test: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low' | null;
  preconditions: unknown;
  description: unknown;
  test_steps: unknown;
  expected_result: unknown;
  artifact_requirements: unknown;
  tester_notes: string | null;
  estimated_duration_minutes: number | null;
  tags: ColumnType<string[], string[] | undefined, string[]>;
  is_archived: boolean;
  created_by: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface PlaybooksTable {
  id: Generated<string>;
  org_id: string;
  name: string;
  description: string | null;
  environment_id: string | null;
  is_archived: boolean;
  created_by: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string>;
}

export interface PlaybookSectionsTable {
  id: Generated<string>;
  playbook_id: string;
  org_id: string;
  name: string;
  position: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface PlaybookSpecsTable {
  id: Generated<string>;
  section_id: string | null;
  playbook_id: string;
  org_id: string;
  spec_library_id: string;
  position: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

// ---- Execution ----

export interface RunsTable {
  id: Generated<string>;
  org_id: string;
  playbook_id: string;
  name: string;
  description: string | null;
  environment: string | null;
  status: 'in_progress' | 'awaiting_decision' | 'go' | 'no_go' | 'abandoned';
  target_date: Date | null;
  started_by: string;
  decision_by: string | null;
  decision_at: Date | null;
  decision_statement: string | null;
  failed_specs_at_decision: unknown;
  abandonment_reason: string | null;
  started_at: Date;
  completed_at: Date | null;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface RunSectionsTable {
  id: Generated<string>;
  run_id: string;
  org_id: string;
  name: string;
  position: number;
  assigned_to: string | null;
  is_skipped: boolean;
  skip_reason: string | null;
  skipped_by: string | null;
  skipped_at: Date | null;
}

export interface RunSpecsTable {
  id: Generated<string>;
  run_section_id: string;
  run_id: string;
  org_id: string;
  title: string;
  system_under_test: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low' | null;
  preconditions: unknown;
  description: unknown;
  test_steps: unknown;
  expected_result: unknown;
  artifact_requirements: unknown;
  tester_notes: string | null;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'skipped';
  claimed_by: string | null;
  executed_by: string | null;
  executed_at: Date | null;
  failure_reason: string | null;
  skip_reason: string | null;
  notes: string | null;
  position: number;
}

export interface RunSpecArtifactsTable {
  id: Generated<string>;
  run_spec_id: string;
  run_id: string;
  org_id: string;
  requirement_index: number;
  type: 'file' | 'table' | 'measured_value' | 'url';
  file_key: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  table_data: unknown;
  measured_value: number | null;
  measured_unit: string | null;
  measured_threshold_operator: 'lte' | 'gte' | 'eq' | null;
  measured_threshold_value: number | null;
  url_value: string | null;
  uploaded_by: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

// ---- Audit ----

export interface ChangelogTable {
  id: Generated<string>;
  org_id: string;
  entity_type: 'playbook' | 'spec_library';
  entity_id: string;
  action: string;
  field_changes: unknown;
  actor_id: string;
  actor_name: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

// ---- Database interface ----

export interface Database {
  organisations: OrganisationsTable;
  users: UsersTable;
  memberships: MembershipsTable;
  environments: EnvironmentsTable;
  invites: InvitesTable;
  subscriptions: SubscriptionsTable;
  stripe_webhook_events: StripeWebhookEventsTable;
  spec_library: SpecLibraryTable;
  playbooks: PlaybooksTable;
  playbook_sections: PlaybookSectionsTable;
  playbook_specs: PlaybookSpecsTable;
  runs: RunsTable;
  run_sections: RunSectionsTable;
  run_specs: RunSpecsTable;
  run_spec_artifacts: RunSpecArtifactsTable;
  changelog: ChangelogTable;
}

// Convenience type aliases
export type Organisation = Selectable<OrganisationsTable>;
export type NewOrganisation = Insertable<OrganisationsTable>;
export type OrganisationUpdate = Updateable<OrganisationsTable>;

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type Membership = Selectable<MembershipsTable>;
export type NewMembership = Insertable<MembershipsTable>;

export type Environment = Selectable<EnvironmentsTable>;
export type NewEnvironment = Insertable<EnvironmentsTable>;

export type Invite = Selectable<InvitesTable>;
export type NewInvite = Insertable<InvitesTable>;
export type InviteUpdate = Updateable<InvitesTable>;

export type Subscription = Selectable<SubscriptionsTable>;
export type NewSubscription = Insertable<SubscriptionsTable>;
export type SubscriptionUpdate = Updateable<SubscriptionsTable>;

export type StripeWebhookEvent = Selectable<StripeWebhookEventsTable>;
export type NewStripeWebhookEvent = Insertable<StripeWebhookEventsTable>;

export type SpecLibraryEntry = Selectable<SpecLibraryTable>;
export type NewSpecLibraryEntry = Insertable<SpecLibraryTable>;
export type SpecLibraryEntryUpdate = Updateable<SpecLibraryTable>;

export type Playbook = Selectable<PlaybooksTable>;
export type NewPlaybook = Insertable<PlaybooksTable>;
export type PlaybookUpdate = Updateable<PlaybooksTable>;

export type PlaybookSection = Selectable<PlaybookSectionsTable>;
export type NewPlaybookSection = Insertable<PlaybookSectionsTable>;

export type PlaybookSpec = Selectable<PlaybookSpecsTable>;
export type NewPlaybookSpec = Insertable<PlaybookSpecsTable>;

export type Run = Selectable<RunsTable>;
export type NewRun = Insertable<RunsTable>;
export type RunUpdate = Updateable<RunsTable>;

export type RunSection = Selectable<RunSectionsTable>;
export type NewRunSection = Insertable<RunSectionsTable>;
export type RunSectionUpdate = Updateable<RunSectionsTable>;

export type RunSpec = Selectable<RunSpecsTable>;
export type NewRunSpec = Insertable<RunSpecsTable>;
export type RunSpecUpdate = Updateable<RunSpecsTable>;

export type RunSpecArtifact = Selectable<RunSpecArtifactsTable>;
export type NewRunSpecArtifact = Insertable<RunSpecArtifactsTable>;

export type ChangelogEntry = Selectable<ChangelogTable>;
export type NewChangelogEntry = Insertable<ChangelogTable>;
