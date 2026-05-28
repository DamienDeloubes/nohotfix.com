export interface SendInviteEmailParams {
  to: string;
  inviterName: string;
  orgName: string;
  inviteUrl: string;
}

export interface EmailPort {
  sendInviteEmail(params: SendInviteEmailParams): Promise<void>;
}
