import type { EmailPort, SendInviteEmailParams } from '@nohotfix/domain-identity';
import { renderMemberInviteHtml, type EmailSender } from '@nohotfix/email';

export class ResendEmailAdapter implements EmailPort {
  constructor(private readonly sender: EmailSender) {}

  async sendInviteEmail(params: SendInviteEmailParams): Promise<void> {
    const html = renderMemberInviteHtml({
      inviterName: params.inviterName,
      orgName: params.orgName,
      inviteUrl: params.inviteUrl,
    });

    await this.sender.send({
      to: params.to,
      subject: `Accept invite to ${params.orgName}`,
      html,
    });
  }
}
