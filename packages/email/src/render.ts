import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { MemberInvite, type MemberInviteProps } from './templates/member-invite.js';

export function renderMemberInviteHtml(props: MemberInviteProps): string {
  return renderToStaticMarkup(createElement(MemberInvite, props));
}
