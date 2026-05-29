'use client';

import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import { MegaPanel } from './MegaPanel';

/*
 * DesktopNav — the lg+ center column of the marketing nav, built on Radix
 * NavigationMenu. "Features" and "Platform" open mega-menu panels; the rest are
 * plain links. Radix handles hover-intent, keyboard nav, focus return, and the
 * pointer "safe area"; we style it headlessly with brand tokens.
 *
 * Positioning + enter/exit/slide animation live in globals.css
 * (.nav-viewport-wrapper / .nav-viewport / .nav-content). The Viewport is NOT
 * portalled — it must stay in-tree so it positions relative to Root, which sits
 * in the centered grid column.
 */

// Shared by both <Link> and <Trigger> so the plain links and the mega-menu
// triggers are visually pixel-identical (the trigger is a <button>, hence the
// bg/border/padding resets). Only the caret distinguishes a trigger.
const LINK_CLS =
  'text-sm font-medium no-underline bg-transparent border-0 p-0 m-0 cursor-pointer ' +
  'text-[var(--text-secondary)] hover:text-[var(--text-primary)] data-[state=open]:text-[var(--text-primary)] ' +
  'transition-colors duration-150 inline-flex items-center gap-1 focus-visible:outline-none ' +
  'focus-visible:text-[var(--text-primary)]';

export function DesktopNav({ className = '' }: { className?: string }): React.ReactElement {
  return (
    <NavigationMenu.Root className={`relative ${className}`} delayDuration={120} skipDelayDuration={300}>
      <NavigationMenu.List className="m-0 flex list-none items-center gap-8 p-0">
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/how-it-works" className={LINK_CLS}>
            How It Works
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={LINK_CLS}>
            Features <Caret />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="nav-content">
            <MegaPanel kind="features" />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className={LINK_CLS}>
            Platform <Caret />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="nav-content">
            <MegaPanel kind="platform" />
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing" className={LINK_CLS}>
            Pricing
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link href="/changelog" className={LINK_CLS}>
            Changelog
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      {/* Absolutely-positioned, centered under the link group. See globals.css. */}
      <div className="nav-viewport-wrapper">
        <NavigationMenu.Viewport className="nav-viewport" />
      </div>
    </NavigationMenu.Root>
  );
}

function Caret() {
  // Rotates 180° when its trigger is open (parent carries data-state=open).
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-200 ease-premium [[data-state=open]>&]:rotate-180"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
