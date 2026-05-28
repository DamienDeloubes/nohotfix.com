import * as React from 'react';

export interface MemberInviteProps {
  inviterName: string;
  orgName: string;
  inviteUrl: string;
}

export function MemberInvite({ inviterName, orgName, inviteUrl }: MemberInviteProps): React.JSX.Element {
  return (
    <div>
      <h1>You have been invited to join {orgName}</h1>
      <p>{inviterName} has invited you to join their NoHotfix workspace.</p>
      <a href={inviteUrl}>Accept invite to {orgName}</a>
    </div>
  );
}
