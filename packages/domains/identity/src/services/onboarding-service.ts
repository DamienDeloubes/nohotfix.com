import type { AuthoringPort } from '../ports/authoring-port.js';

export class OnboardingService {
  constructor(private readonly authoringPort: AuthoringPort) {}

  async seedDemoPlaybook(_orgId: string): Promise<void> {
    // TODO: Delegate to authoring context to seed demo playbook on org creation
    void this.authoringPort;
  }
}
