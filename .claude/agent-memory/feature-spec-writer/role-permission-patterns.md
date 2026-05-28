# Role and Permission Patterns

## Roles
Three roles: owner, admin, member.
- "Admin or owner" = write/edit access
- "Member" = read-only access

## Permission enforcement patterns (confirmed across features)
- Edit/write actions: UI entry points (buttons, action menu items) are hidden entirely for members — not disabled, not shown with a tooltip, just not rendered
- Direct URL access by unauthorised role: redirect to the read-only equivalent page (not a 403 error page)
  - e.g. member navigating to `/:orgSlug/spec-library/:specId/edit` → redirected to `/:orgSlug/spec-library/:specId`
- Archived resource access: redirect to the detail page (same pattern as unauthorised access)
  - e.g. admin navigating to edit URL for an archived spec → redirected to spec detail page

## Action menu visibility
- Overview table row action menus show role-scoped actions
- Members see only read actions (e.g. "View")
- Admins/owners see read + write actions (e.g. "View", "Edit spec")
