export async function inviteMember(_data: { orgId: string; email: string; role: 'admin' | 'member'; invitedBy: string }): Promise<void> {
  // TODO: Call WorkOS invitation API, record pending invitation
}
