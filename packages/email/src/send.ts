import { Resend } from 'resend';

export interface EmailSender {
  send(options: { to: string | string[]; subject: string; html: string; from?: string }): Promise<void>;
}

export function createEmailSender(apiKey: string): EmailSender {
  const resend = new Resend(apiKey);

  return {
    async send({ to, subject, html, from = 'NoHotfix <noreply@nohotfix.com>' }) {
      await resend.emails.send({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });
    },
  };
}
