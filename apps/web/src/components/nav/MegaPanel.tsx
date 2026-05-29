import { guarantees, platformItems } from './nav-content';
import { FeatureIcon } from './FeatureIcon';

/*
 * MegaPanel — the body of a navigation mega-menu, parameterized by `kind`.
 * Shares the ThreeGuarantees cell look (round icon chip + eyebrow + heading +
 * short body) and the elevated-card surface (NOT glass — glass is nav/overlay
 * only per the brand spec). The card chrome lives here; positioning/animation
 * lives in globals.css (.nav-viewport / .nav-content).
 */
const PANEL_CLS =
  'w-[min(92vw,680px)] rounded-[var(--radius-xl)] border border-[var(--border-default)] ' +
  'bg-[var(--bg-card-elevated)] shadow-[var(--shadow-modal)] p-4';

const ITEM_CLS =
  'group/item flex gap-4 rounded-[var(--radius-lg)] p-4 no-underline ' +
  'transition-colors duration-150 hover:bg-[var(--bg-hover)] focus-visible:bg-[var(--bg-hover)] ' +
  'focus-visible:outline-none';

export function MegaPanel({ kind }: { kind: 'features' | 'platform' }): React.ReactElement {
  if (kind === 'features') {
    return (
      <div className={PANEL_CLS}>
        <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0">
          {guarantees.map((g) => (
            <li key={g.link.href}>
              <a href={g.link.href} className={ITEM_CLS}>
                <IconChip color={g.iconColorVar} bg={g.iconBgVar} border={g.iconBorderVar}>
                  <FeatureIcon type={g.icon} color={g.iconColorVar} size={20} />
                </IconChip>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[var(--text-primary)]">{g.eyebrow}</span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-[var(--text-muted)]">{g.short}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <PanelFooter href="/how-it-works" label="See how it all works" />
      </div>
    );
  }

  return (
    <div className={PANEL_CLS}>
      <ul className="m-0 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2">
        {platformItems.map((p) => {
          const isPrimary = p.accent === 'primary';
          const iconColor = isPrimary ? 'var(--color-primary)' : 'var(--color-slate-500)';
          const iconBg = isPrimary ? 'rgba(234,106,4,0.08)' : 'rgba(148,163,184,0.12)';
          const iconBorder = isPrimary ? 'rgba(234,106,4,0.18)' : 'rgba(148,163,184,0.24)';
          return (
            <li key={p.href}>
              <a href={p.href} className={ITEM_CLS}>
                <IconChip color={iconColor} bg={iconBg} border={iconBorder}>
                  <FeatureIcon type={p.icon} color={iconColor} size={20} />
                </IconChip>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{p.heading}</span>
                    <StatusPill primary={isPrimary}>{p.status}</StatusPill>
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-5 text-[var(--text-muted)]">{p.short}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <PanelFooter href="/platform" label="See where we're going" />
    </div>
  );
}

function IconChip({
  children,
  color,
  bg,
  border,
}: {
  children: React.ReactNode;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {children}
    </span>
  );
}

function StatusPill({ children, primary }: { children: React.ReactNode; primary: boolean }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em]"
      style={
        primary
          ? { background: 'rgba(234,106,4,0.10)', color: 'var(--color-primary)' }
          : { background: 'var(--bg-hover)', color: 'var(--text-muted)' }
      }
    >
      {children}
    </span>
  );
}

function PanelFooter({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-1 border-t border-[var(--border-default)] px-4 pt-3">
      <a
        href={href}
        className="arrow-link text-sm font-medium text-[var(--text-link)] no-underline hover:text-[var(--text-link-hover)]"
      >
        {label} <span className="arrow">&rarr;</span>
      </a>
    </div>
  );
}
