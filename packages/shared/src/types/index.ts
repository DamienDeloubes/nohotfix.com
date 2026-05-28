import type { z } from 'zod';

import type {
  PresignUploadRequestSchema,
  RunSpecArtifactSchema,
  SaveMeasuredValueRequestSchema,
  SaveTableDataRequestSchema,
  SaveUrlValueRequestSchema,
} from '../schemas/artifacts.js';
import type {
  ChangeMemberRoleRequestSchema,
  InviteMemberRequestSchema,
  SessionUserSchema,
  UpdateUserProfileDtoSchema,
  UpdateUserProfileRequestSchema,
  UserDtoSchema,
} from '../schemas/auth.js';
import type { CreateCheckoutSessionRequestSchema, CreatePortalSessionRequestSchema, SubscriptionSchema } from '../schemas/billing.js';
import type { CreateEnvironmentRequestSchema, EnvironmentDtoSchema, ReorderEnvironmentsRequestSchema, UpdateEnvironmentRequestSchema } from '../schemas/environments.js';
import type {
  AcceptInviteResultDtoSchema,
  CreateInviteRequestSchema,
  InviteDtoSchema,
  InviteResendDtoSchema,
  ListInvitesDtoSchema,
  ValidateInviteTokenDtoSchema,
} from '../schemas/invite.js';
import type {
  CheckSlugDtoSchema,
  CreateOrganisationRequestSchema,
  ListOrgMembersDtoSchema,
  OrganisationDtoSchema,
  OrgMemberDtoSchema,
  UpdateOrganisationRequestSchema,
  UserOrganisationDtoSchema,
} from '../schemas/organisation.js';
import type {
  AddSpecFromLibraryRequestSchema,
  ArchivePlaybookResponseSchema,
  CreatePlaybookRequestSchema,
  CreateSectionRequestSchema,
  PlaybookArchiveInfoResponseSchema,
  PlaybookHistoryActionSchema,
  PlaybookHistoryEntrySchema,
  PlaybookHistoryResponseSchema,
  PlaybookSchema,
  PlaybookSectionSchema,
  PlaybookSpecSchema,
  ReorderSectionsRequestSchema,
  ReorderSpecsRequestSchema,
  UpdatePlaybookRequestSchema,
  UpdateSectionRequestSchema,
} from '../schemas/playbooks.js';
import type { RecordDecisionRequestSchema, RecordSpecResultRequestSchema, RunSchema, RunSectionSchema, RunSpecSchema, StartRunRequestSchema } from '../schemas/runs.js';
import type {
  ArchiveImpactResponseSchema,
  ArtifactRequirementResponseSchema,
  ArtifactRequirementSchema,
  CellValueSchema,
  CheckboxArtifactRequirementResponseSchema,
  CheckboxArtifactRequirementSchema,
  CreateLibrarySpecRequestSchema,
  LibrarySpecSchema,
  ListSpecsRequestSchema,
  MeasuredValueArtifactRequirementResponseSchema,
  MeasuredValueArtifactRequirementSchema,
  MeasuredValueUnitSchema,
  SpecHistoryActionSchema,
  SpecHistoryEntrySchema,
  SpecHistoryResponseSchema,
  SpecListItemSchema,
  SpecListResultSchema,
  SystemsUnderTestResponseSchema,
  TableArtifactRequirementResponseSchema,
  TableArtifactRequirementSchema,
  TableColumnDefResponseSchema,
  TableColumnDefSchema,
  TagsResponseSchema,
  TestStepSchema,
  TextArtifactRequirementSchema,
  UpdateLibrarySpecRequestSchema,
  UrlArtifactRequirementResponseSchema,
  UrlArtifactRequirementSchema,
} from '../schemas/specs.js';

export type SessionUser = z.infer<typeof SessionUserSchema>;
export type InviteMemberRequest = z.infer<typeof InviteMemberRequestSchema>;
export type ChangeMemberRoleRequest = z.infer<typeof ChangeMemberRoleRequestSchema>;
export type UpdateUserProfileRequest = z.infer<typeof UpdateUserProfileRequestSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileDtoSchema>;

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateCheckoutSessionRequest = z.infer<typeof CreateCheckoutSessionRequestSchema>;
export type CreatePortalSessionRequest = z.infer<typeof CreatePortalSessionRequestSchema>;

export type Playbook = z.infer<typeof PlaybookSchema>;
export type CreatePlaybookRequest = z.infer<typeof CreatePlaybookRequestSchema>;
export type UpdatePlaybookRequest = z.infer<typeof UpdatePlaybookRequestSchema>;
export type PlaybookSection = z.infer<typeof PlaybookSectionSchema>;
export type CreateSectionRequest = z.infer<typeof CreateSectionRequestSchema>;
export type UpdateSectionRequest = z.infer<typeof UpdateSectionRequestSchema>;
export type PlaybookSpec = z.infer<typeof PlaybookSpecSchema>;
export type ReorderSectionsRequest = z.infer<typeof ReorderSectionsRequestSchema>;
export type ReorderSpecsRequest = z.infer<typeof ReorderSpecsRequestSchema>;
export type AddSpecFromLibraryRequest = z.infer<typeof AddSpecFromLibraryRequestSchema>;

export type LibrarySpec = z.infer<typeof LibrarySpecSchema>;
export type CreateLibrarySpecRequest = z.infer<typeof CreateLibrarySpecRequestSchema>;
export type UpdateLibrarySpecRequest = z.infer<typeof UpdateLibrarySpecRequestSchema>;
export type TestStep = z.infer<typeof TestStepSchema>;
export type SystemsUnderTestResponse = z.infer<typeof SystemsUnderTestResponseSchema>;
export type TagsResponse = z.infer<typeof TagsResponseSchema>;

export type TextArtifactRequirement = z.infer<typeof TextArtifactRequirementSchema>;
export type CheckboxArtifactRequirement = z.infer<typeof CheckboxArtifactRequirementSchema>;
export type CheckboxArtifactRequirementResponse = z.infer<typeof CheckboxArtifactRequirementResponseSchema>;
export type UrlArtifactRequirement = z.infer<typeof UrlArtifactRequirementSchema>;
export type UrlArtifactRequirementResponse = z.infer<typeof UrlArtifactRequirementResponseSchema>;
export type ArtifactRequirement = z.infer<typeof ArtifactRequirementSchema>;
export type ArtifactRequirementResponse = z.infer<typeof ArtifactRequirementResponseSchema>;
export type TableArtifactRequirement = z.infer<typeof TableArtifactRequirementSchema>;
export type TableArtifactRequirementResponse = z.infer<typeof TableArtifactRequirementResponseSchema>;
export type TableColumnDef = z.infer<typeof TableColumnDefSchema>;
export type TableColumnDefResponse = z.infer<typeof TableColumnDefResponseSchema>;
export type MeasuredValueArtifactRequirement = z.infer<typeof MeasuredValueArtifactRequirementSchema>;
export type MeasuredValueArtifactRequirementResponse = z.infer<typeof MeasuredValueArtifactRequirementResponseSchema>;
export type MeasuredValueUnit = z.infer<typeof MeasuredValueUnitSchema>;
export type CellValue = z.infer<typeof CellValueSchema>;

export type ListSpecsRequest = z.infer<typeof ListSpecsRequestSchema>;
export type SpecListItem = z.infer<typeof SpecListItemSchema>;
export type SpecListResult = z.infer<typeof SpecListResultSchema>;

export type Run = z.infer<typeof RunSchema>;
export type StartRunRequest = z.infer<typeof StartRunRequestSchema>;
export type RecordDecisionRequest = z.infer<typeof RecordDecisionRequestSchema>;
export type RecordSpecResultRequest = z.infer<typeof RecordSpecResultRequestSchema>;
export type RunSection = z.infer<typeof RunSectionSchema>;
export type RunSpec = z.infer<typeof RunSpecSchema>;

export type RunSpecArtifact = z.infer<typeof RunSpecArtifactSchema>;
export type PresignUploadRequest = z.infer<typeof PresignUploadRequestSchema>;
export type SaveTableDataRequest = z.infer<typeof SaveTableDataRequestSchema>;
export type SaveMeasuredValueRequest = z.infer<typeof SaveMeasuredValueRequestSchema>;
export type SaveUrlValueRequest = z.infer<typeof SaveUrlValueRequestSchema>;

export type CreateOrganisationRequest = z.infer<typeof CreateOrganisationRequestSchema>;
export type UpdateOrganisationRequest = z.infer<typeof UpdateOrganisationRequestSchema>;
export type OrganisationDto = z.infer<typeof OrganisationDtoSchema>;
export type UserOrganisationDto = z.infer<typeof UserOrganisationDtoSchema>;
export type CheckSlugDto = z.infer<typeof CheckSlugDtoSchema>;
export type OrgMemberDto = z.infer<typeof OrgMemberDtoSchema>;
export type ListOrgMembersDto = z.infer<typeof ListOrgMembersDtoSchema>;

export type CreateInviteRequest = z.infer<typeof CreateInviteRequestSchema>;
export type InviteDto = z.infer<typeof InviteDtoSchema>;
export type ListInvitesDto = z.infer<typeof ListInvitesDtoSchema>;
export type InviteResendDto = z.infer<typeof InviteResendDtoSchema>;
export type AcceptInviteResultDto = z.infer<typeof AcceptInviteResultDtoSchema>;
export type ValidateInviteTokenDto = z.infer<typeof ValidateInviteTokenDtoSchema>;

export type EnvironmentDto = z.infer<typeof EnvironmentDtoSchema>;
export type CreateEnvironmentRequest = z.infer<typeof CreateEnvironmentRequestSchema>;
export type UpdateEnvironmentRequest = z.infer<typeof UpdateEnvironmentRequestSchema>;
export type ReorderEnvironmentsRequest = z.infer<typeof ReorderEnvironmentsRequestSchema>;

export type SpecHistoryAction = z.infer<typeof SpecHistoryActionSchema>;
export type SpecHistoryEntry = z.infer<typeof SpecHistoryEntrySchema>;
export type SpecHistoryResponse = z.infer<typeof SpecHistoryResponseSchema>;

export type ArchiveImpactResponse = z.infer<typeof ArchiveImpactResponseSchema>;

export type PlaybookHistoryAction = z.infer<typeof PlaybookHistoryActionSchema>;
export type PlaybookHistoryEntry = z.infer<typeof PlaybookHistoryEntrySchema>;
export type PlaybookHistoryResponse = z.infer<typeof PlaybookHistoryResponseSchema>;

export type PlaybookArchiveInfoResponse = z.infer<typeof PlaybookArchiveInfoResponseSchema>;
export type ArchivePlaybookResponse = z.infer<typeof ArchivePlaybookResponseSchema>;
