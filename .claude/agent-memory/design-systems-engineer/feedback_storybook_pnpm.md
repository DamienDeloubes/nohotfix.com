---
name: feedback-storybook-pnpm-hoisting
description: pnpm hoisting fix for Storybook 8.x in monorepo — storybook package must be a direct dep
metadata:
  type: feedback
---

When setting up Storybook 8.x in a pnpm monorepo, the `storybook` core package must be listed as a direct devDependency in the app's `package.json`. Without it, Vite fails to resolve `storybook/internal/preview/runtime` because the package is only in the root pnpm store and not linked to the local `node_modules`.

**Why:** pnpm's strict hoisting means transitive deps aren't automatically available to Vite's resolver in `apps/storybook/node_modules/`.

**How to apply:** Always add `"storybook": "^8.x.x"` alongside `"@storybook/react-vite"` in devDependencies whenever creating a new Storybook app in this monorepo.
