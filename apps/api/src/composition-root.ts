import type { Database } from '@nohotfix/db';
import { ChangelogService } from '@nohotfix/domain-audit';
import { SnapshotService, SpecSyncService } from '@nohotfix/domain-authoring';
import { SubscriptionStateService, TrialService } from '@nohotfix/domain-billing';
import { ArtifactGateService, DecisionService, RunStateMachine, SectionSkipService, SpecStateMachine } from '@nohotfix/domain-execution';
import { MembershipService, OnboardingService } from '@nohotfix/domain-identity';
import { createEmailSender } from '@nohotfix/email';
import type { WorkOS } from '@workos-inc/node';
import type { Kysely } from 'kysely';

import {
  KyselyChangelogRepository,
  KyselyEnvironmentRepository,
  KyselyInviteRepository,
  KyselyMembershipRepository,
  KyselyOrganisationRepository,
  KyselyPlaybookRepository,
  KyselyPlaybookSectionRepository,
  KyselyPlaybookSpecRepository,
  KyselyRunRepository,
  KyselyRunSectionRepository,
  KyselyRunSpecArtifactRepository,
  KyselyRunSpecRepository,
  KyselySpecLibraryRepository,
  KyselyStripeWebhookEventRepository,
  KyselySubscriptionRepository,
  KyselyUserRepository,
} from './adapters/repositories/index.js';
import { PresignedUrlAdapter, ResendEmailAdapter, WorkosAuthSessionAdapter, WorkosUserProfileAdapter } from './adapters/services/index.js';
import type { Config } from './config.js';
import { createWithTransaction, type WithTransaction } from './shared/lib/with-transaction.js';

export type { TransactionalRoot } from './shared/lib/with-transaction.js';

export interface CompositionRoot {
  withTransaction: WithTransaction;
  // Repositories
  organisationRepo: KyselyOrganisationRepository;
  userRepo: KyselyUserRepository;
  membershipRepo: KyselyMembershipRepository;
  inviteRepo: KyselyInviteRepository;
  subscriptionRepo: KyselySubscriptionRepository;
  stripeWebhookEventRepo: KyselyStripeWebhookEventRepository;
  playbookRepo: KyselyPlaybookRepository;
  playbookSectionRepo: KyselyPlaybookSectionRepository;
  playbookSpecRepo: KyselyPlaybookSpecRepository;
  specLibraryRepo: KyselySpecLibraryRepository;
  runRepo: KyselyRunRepository;
  runSectionRepo: KyselyRunSectionRepository;
  runSpecRepo: KyselyRunSpecRepository;
  runSpecArtifactRepo: KyselyRunSpecArtifactRepository;
  changelogRepo: KyselyChangelogRepository;
  environmentRepo: KyselyEnvironmentRepository;

  // Services
  membershipService: MembershipService;
  onboardingService: OnboardingService;
  subscriptionStateService: SubscriptionStateService;
  trialService: TrialService;
  specSyncService: SpecSyncService;
  snapshotService: SnapshotService;
  runStateMachine: RunStateMachine;
  specStateMachine: SpecStateMachine;
  artifactGateService: ArtifactGateService;
  decisionService: DecisionService;
  sectionSkipService: SectionSkipService;
  changelogService: ChangelogService;

  // Infrastructure adapters
  presignedUrlAdapter: PresignedUrlAdapter;
  resendEmailAdapter: ResendEmailAdapter;
  workosUserProfileAdapter: WorkosUserProfileAdapter;
  workosAuthSessionAdapter: WorkosAuthSessionAdapter;
}

export function createCompositionRoot(db: Kysely<Database>, workos: WorkOS, appConfig: Config): CompositionRoot {
  // Repositories
  const organisationRepo = new KyselyOrganisationRepository(db);
  const userRepo = new KyselyUserRepository(db);
  const membershipRepo = new KyselyMembershipRepository(db);
  const inviteRepo = new KyselyInviteRepository(db);
  const subscriptionRepo = new KyselySubscriptionRepository(db);
  const stripeWebhookEventRepo = new KyselyStripeWebhookEventRepository(db);
  const playbookRepo = new KyselyPlaybookRepository(db);
  const playbookSectionRepo = new KyselyPlaybookSectionRepository(db);
  const playbookSpecRepo = new KyselyPlaybookSpecRepository(db);
  const specLibraryRepo = new KyselySpecLibraryRepository(db);
  const runRepo = new KyselyRunRepository(db);
  const runSectionRepo = new KyselyRunSectionRepository(db);
  const runSpecRepo = new KyselyRunSpecRepository(db);
  const runSpecArtifactRepo = new KyselyRunSpecArtifactRepository(db);
  const changelogRepo = new KyselyChangelogRepository(db);
  const environmentRepo = new KyselyEnvironmentRepository(db);

  // Infrastructure adapters
  const presignedUrlAdapter = new PresignedUrlAdapter();
  const emailSender = createEmailSender(appConfig.RESEND_API_KEY);
  const resendEmailAdapter = new ResendEmailAdapter(emailSender);
  const workosUserProfileAdapter = new WorkosUserProfileAdapter(workos);
  const workosAuthSessionAdapter = new WorkosAuthSessionAdapter(workos);

  // Domain services
  const membershipService = new MembershipService(membershipRepo);
  const onboardingService = new OnboardingService({
    seedDemoPlaybook: async () => {
      /* TODO: wire to authoring */
    },
  });
  const subscriptionStateService = new SubscriptionStateService();
  const trialService = new TrialService();
  const specSyncService = new SpecSyncService();
  const snapshotService = new SnapshotService();
  const runStateMachine = new RunStateMachine();
  const specStateMachine = new SpecStateMachine();
  const artifactGateService = new ArtifactGateService();
  const decisionService = new DecisionService();
  const sectionSkipService = new SectionSkipService();
  const changelogService = new ChangelogService();

  const withTransaction = createWithTransaction(db);

  return {
    withTransaction,
    organisationRepo,
    userRepo,
    membershipRepo,
    inviteRepo,
    subscriptionRepo,
    stripeWebhookEventRepo,
    playbookRepo,
    playbookSectionRepo,
    playbookSpecRepo,
    specLibraryRepo,
    runRepo,
    runSectionRepo,
    runSpecRepo,
    runSpecArtifactRepo,
    changelogRepo,
    environmentRepo,
    membershipService,
    onboardingService,
    subscriptionStateService,
    trialService,
    specSyncService,
    snapshotService,
    runStateMachine,
    specStateMachine,
    artifactGateService,
    decisionService,
    sectionSkipService,
    changelogService,
    presignedUrlAdapter,
    resendEmailAdapter,
    workosUserProfileAdapter,
    workosAuthSessionAdapter,
  };
}
