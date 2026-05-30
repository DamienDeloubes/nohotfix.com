import type { ReactElement } from 'react';

/*
 * ReservedTestimonial — an honest, visibly-empty quote slot reserved for a real
 * customer quote (added at the first paying customer). NEVER renders a
 * fabricated name, company, logo, or quote (brand honesty rule, FR-070).
 *
 * A thin top accent stripe carries the persona colour (orange for QA-lead pages,
 * slate for the compliance register).
 */
interface ReservedTestimonialProps {
  /** Placeholder copy describing what the slot is reserved for. */
  placeholder: string;
  accentTone?: 'orange' | 'slate';
  className?: string;
}

export function ReservedTestimonial({
  placeholder,
  accentTone = 'orange',
  className = '',
}: ReservedTestimonialProps): ReactElement {
  const accent =
    accentTone === 'orange' ? 'var(--color-orange-500)' : 'var(--color-slate-400)';

  return (
    <figure
      className={`brand-card relative overflow-hidden p-8 ${className}`}
      aria-label="Reserved customer testimonial — not yet available"
    >
      {/* Persona accent stripe — the only colour fill in the card. */}
      <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: accent }} aria-hidden="true" />

      <blockquote className="text-[15px] italic leading-6 text-[var(--color-slate-400)]">
        {placeholder}
      </blockquote>

      {/* Empty author block — structure without fiction. */}
      <figcaption className="mt-6 flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-full border border-dashed border-[var(--border-strong)]"
          aria-hidden="true"
        />
        <div className="space-y-1">
          <div className="h-3 w-28 rounded bg-[var(--bg-section-alt)]" aria-hidden="true" />
          <div className="h-3 w-20 rounded bg-[var(--bg-section-alt)]" aria-hidden="true" />
        </div>
      </figcaption>
    </figure>
  );
}
