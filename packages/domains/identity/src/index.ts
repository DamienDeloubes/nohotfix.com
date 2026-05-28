// Entities
export { OrganisationEntity, UserEntity, MembershipEntity, InviteEntity, INVITE_RESEND_COOLDOWN_MS, EnvironmentEntity } from './entities/index.js';
export type { OrganisationProps, UserProps, MembershipProps, InviteProps, InviteStatus, NewInviteDto, EnvironmentProps } from './entities/index.js';

// Value Objects
export { FirstName, LastName, Email, OrganisationName, OrganisationSlug, Role, WorkosUserId, InviteToken, EnvironmentName } from './entities/index.js';
export type { RoleValue } from './entities/index.js';

// Backward-compatible type aliases
export type { Organisation, User, Membership } from './types.js';

// Ports
export type { OrganisationRepository, UserRepository, MembershipRepository, MemberWithUserDto } from './ports/index.js';
export type { InviteRepository, InviteWithInviterDto } from './ports/index.js';
export type { EmailPort, SendInviteEmailParams } from './ports/index.js';
export type { AuthoringPort, UserProfileProvider, UserProfile } from './ports/index.js';
export type { AuthSessionProvider, AuthTokenPair } from './ports/index.js';
export type { EnvironmentRepository } from './ports/index.js';

// Errors
export {
  AuthSessionExpiredError,
  AuthTokenMissingError,
  AuthTokenMalformedError,
  AuthTokenInvalidError,
  AuthProviderUnavailableError,
  AuthCallbackFailedError,
  AuthRoleInsufficientError,
  AuthLastAdminError,
  AuthRoleSameError,
  AuthOwnerSelfDemoteError,
  AuthTargetNotFoundError,
  AuthUserNotFoundError,
  AuthUserProvisionFailedError,
  AuthOrgNameInvalidError,
  AuthOrgSlugInvalidError,
  AuthOrgSlugTakenError,
  AuthOrgNotFoundError,
  AuthMembershipNotFoundError,
  AuthUserFirstNameInvalidError,
  AuthUserLastNameInvalidError,
  AuthInviteDuplicateError,
  AuthInviteAlreadyMemberError,
  AuthInviteSelfError,
  AuthInviteEmailFailedError,
  AuthInviteNotFoundError,
  AuthInviteResendTooSoonError,
  AuthInviteExpiredError,
  AuthInviteEmailMismatchError,
  AuthOwnerCannotBeRemovedError,
  AuthEnvNotFoundError,
  AuthEnvNameDuplicateError,
  AuthEnvNameInvalidError,
  AuthEnvInUseError,
} from './errors/index.js';

// Services
export { MembershipService } from './services/index.js';
export { OnboardingService } from './services/index.js';

// Use cases
export {
  createOrganisation,
  getUserOrganisations,
  inviteMember,
  createInvite,
  listPendingInvites,
  validateInviteToken,
  acceptInvite,
  resendInvite,
  revokeInvite,
  changeMemberRole,
  removeMember,
  syncUserFromJwt,
  getCurrentUser,
  initiateLogin,
  handleAuthCallback,
  refreshSession,
  logout,
  checkSlugAvailability,
  resolveUserFromJwt,
  listOrgMembers,
  resolveOrgFromSlug,
  renameOrganisation,
  updateUserProfile,
  listEnvironments,
  createEnvironment,
  renameEnvironment,
  reorderEnvironments,
  deleteEnvironment,
} from './use-cases/index.js';
export type {
  CreateOrganisationDeps,
  CreateOrganisationCommand,
  GetUserOrganisationsDeps,
  GetCurrentUserDeps,
  GetCurrentUserOutput,
  SyncUserFromJwtDeps,
  InitiateLoginDeps,
  InitiateLoginCommand,
  InitiateLoginOutput,
  HandleAuthCallbackDeps,
  HandleAuthCallbackCommand,
  RefreshSessionDeps,
  RefreshSessionCommand,
  LogoutDeps,
  LogoutCommand,
  CheckSlugAvailabilityDeps,
  ResolveUserFromJwtDeps,
  ResolveUserFromJwtCommand,
  CreateInviteDeps,
  CreateInviteCommand,
  CreateInviteOutput,
  ListPendingInvitesDeps,
  ValidateInviteTokenDeps,
  ValidateInviteTokenOutput,
  AcceptInviteDeps,
  AcceptInviteCommand,
  AcceptInviteOutput,
  ResendInviteDeps,
  ResendInviteCommand,
  ResendInviteOutput,
  RevokeInviteDeps,
  RevokeInviteCommand,
  ChangeMemberRoleDeps,
  ChangeMemberRoleCommand,
  ChangeMemberRoleOutput,
  ListOrgMembersDeps,
  ResolveOrgFromSlugDeps,
  ResolveOrgFromSlugCommand,
  ResolveOrgFromSlugOutput,
  RenameOrganisationDeps,
  RenameOrganisationCommand,
  UpdateUserProfileDeps,
  UpdateUserProfileCommand,
  RemoveMemberDeps,
  RemoveMemberCommand,
  RemoveMemberOutput,
  ListEnvironmentsDeps,
  ListEnvironmentsCommand,
  CreateEnvironmentDeps,
  CreateEnvironmentCommand,
  RenameEnvironmentDeps,
  RenameEnvironmentCommand,
  ReorderEnvironmentsDeps,
  ReorderEnvironmentsCommand,
  DeleteEnvironmentDeps,
  DeleteEnvironmentCommand,
} from './use-cases/index.js';
