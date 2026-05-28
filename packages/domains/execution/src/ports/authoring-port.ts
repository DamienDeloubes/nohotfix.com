export interface AuthoringPort {
  deepCopy(data: { playbookId: string; orgId: string; runId: string }): Promise<void>;
}
