/**
 * @nohotfix/design-tokens — Brand v5
 *
 * Typed mirror of `tokens.css`, used by the Storybook style guide to render
 * swatches, type specimens, and token tables programmatically. The CSS file is
 * the runtime source of truth; keep these values in sync with it.
 */

export interface ColorStop {
  name: string;
  value: string;
}

export type Scale = ColorStop[];

const scale = (prefix: string, stops: Record<string, string>): Scale =>
  Object.entries(stops).map(([k, v]) => ({ name: `${prefix}-${k}`, value: v }));

export const orange: Scale = scale('orange', {
  '50': '#fff7ed',
  '100': '#ffedd5',
  '200': '#fed7aa',
  '300': '#fdba74',
  '400': '#fb923c',
  '500': '#f97316',
  '600': '#ea6b04',
  '700': '#c05a00',
  '800': '#9a3f05',
  '900': '#7c2d12',
  '950': '#431407',
});

export const go: Scale = scale('go', {
  '50': '#e8fdf4',
  '100': '#d0fae9',
  '200': '#80f0c8',
  '300': '#33e5a6',
  '400': '#00e591',
  '500': '#00cc80',
  '600': '#009962',
  '700': '#007a4e',
  '800': '#00523a',
  '900': '#002e1f',
});

export const nogo: Scale = scale('nogo', {
  '50': '#fefce8',
  '100': '#fef9c3',
  '200': '#fef08a',
  '300': '#fde047',
  '400': '#facc15',
  '500': '#eab308',
  '600': '#ca8a04',
  '700': '#a16207',
  '800': '#854d0e',
  '900': '#713f12',
});

export const error: Scale = scale('error', {
  '50': '#fff1f2',
  '100': '#ffe4e6',
  '200': '#fecdd3',
  '300': '#fda4af',
  '400': '#fb7185',
  '500': '#f43f5e',
  '600': '#e11d48',
  '700': '#be123c',
  '800': '#9f1239',
  '900': '#881337',
});

export const slate: Scale = scale('slate', {
  '50': '#f8fafc',
  '100': '#f1f5f9',
  '300': '#cbd5e1',
  '400': '#94a3b8',
  '500': '#64748b',
  '700': '#334155',
  '900': '#0f172a',
});

export const colorScales = { orange, go, nogo, error, slate };

export const fire = {
  gradient: 'linear-gradient(180deg, #ff0000 0%, #ff8d28 100%)',
  hot: '#ff0000',
  warm: '#ff8d28',
  flat: '#e05c00',
};

/** Per-theme semantic tokens (resolved values for display). */
export const themes = {
  light: {
    bgPage: '#fafafa',
    bgCard: '#ffffff',
    bgSectionAlt: '#f4f4f5',
    textPrimary: '#111110',
    textSecondary: '#52514c',
    textLink: '#9a3f05',
    borderDefault: 'rgba(0,0,0,0.08)',
    primary: '#ea6b04',
    primaryHover: '#c05a00',
    shadowCard: '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
    navBg: 'rgba(250,250,250,0.9)',
  },
  dark: {
    bgPage: '#111110',
    bgCard: '#1e1d1b',
    bgSectionAlt: '#161513',
    textPrimary: '#f5f4f0',
    textSecondary: '#c5c2bb',
    textLink: '#f97316',
    borderDefault: 'rgba(255,255,255,0.09)',
    primary: '#f97316',
    primaryHover: '#fb923c',
    shadowCard: '0 1px 0 0 rgba(255,255,255,0.09) inset, 0 4px 20px rgba(0,0,0,0.35)',
    navBg: 'rgba(17,17,16,0.85)',
  },
} as const;

export type ThemeName = keyof typeof themes;

export interface TypeStyle {
  style: string;
  family: 'display' | 'body' | 'mono';
  weight: number;
  sizePx: number;
  lineHeight: number;
  tracking: string;
  usage: string;
}

/** Type scale — display = DM Sans (heavy + tight), body = Inter, mono = Geist Mono. */
export const typeScale: TypeStyle[] = [
  { style: 'Display', family: 'display', weight: 700, sizePx: 74, lineHeight: 1.08, tracking: '-0.04em', usage: 'Hero — one statement' },
  { style: 'H1', family: 'display', weight: 600, sizePx: 48, lineHeight: 1.1, tracking: '-0.03em', usage: 'Marketing page headings' },
  { style: 'H2', family: 'display', weight: 600, sizePx: 36, lineHeight: 1.2, tracking: '-0.025em', usage: 'Section headings' },
  { style: 'H3', family: 'body', weight: 600, sizePx: 30, lineHeight: 1.3, tracking: '-0.02em', usage: 'Sub-sections' },
  { style: 'H4', family: 'body', weight: 600, sizePx: 24, lineHeight: 1.35, tracking: '-0.015em', usage: 'Card headings' },
  { style: 'H5', family: 'body', weight: 500, sizePx: 20, lineHeight: 1.4, tracking: '-0.01em', usage: 'Labels' },
  { style: 'Body Large', family: 'body', weight: 400, sizePx: 18, lineHeight: 1.6, tracking: '0', usage: 'Marketing prose' },
  { style: 'Body Base', family: 'body', weight: 400, sizePx: 16, lineHeight: 1.5, tracking: '0', usage: 'Default UI text' },
  { style: 'Body Small', family: 'body', weight: 400, sizePx: 14, lineHeight: 1.57, tracking: '0', usage: 'Table data, metadata' },
  { style: 'Mono Base', family: 'mono', weight: 400, sizePx: 14, lineHeight: 1.57, tracking: '0', usage: 'Artifact values, run IDs' },
];

export const fontFamilies = {
  display: "'DM Sans', 'Inter', -apple-system, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'Geist Mono', 'JetBrains Mono', monospace",
};

export const spacing: ColorStop[] = [
  { name: '1', value: '4px' },
  { name: '2', value: '8px' },
  { name: '3', value: '12px' },
  { name: '4', value: '16px' },
  { name: '5', value: '20px' },
  { name: '6', value: '24px' },
  { name: '8', value: '32px' },
  { name: '10', value: '40px' },
  { name: '12', value: '48px' },
  { name: '16', value: '64px' },
  { name: '20', value: '80px' },
  { name: '24', value: '96px' },
  { name: '32', value: '128px' },
];

export const radius: ColorStop[] = [
  { name: 'sm', value: '6px' },
  { name: 'md', value: '10px' },
  { name: 'lg', value: '16px' },
  { name: 'xl', value: '20px' },
  { name: '2xl', value: '28px' },
  { name: 'full', value: '9999px' },
];

export const motion = {
  eases: [
    { name: 'ease-premium', value: 'cubic-bezier(0.6, 0.6, 0, 1)' },
    { name: 'ease-page', value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    { name: 'ease-spring', value: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    { name: 'ease-out', value: 'cubic-bezier(0, 0, 0.2, 1)' },
  ],
  durations: [
    { name: 'fast', value: '150ms' },
    { name: 'standard', value: '300ms' },
    { name: 'deliberate', value: '400ms' },
    { name: 'slow', value: '600ms' },
  ],
};
