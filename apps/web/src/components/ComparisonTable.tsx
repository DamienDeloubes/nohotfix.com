'use client';

import { ScrollReveal } from './ScrollReveal';

const features = ['Artifact-gated pass action', 'Role-gated go/no-go decision', 'Immutable run records', 'Release-centric UX', 'Lightweight adoption (< 1 day)'];

const competitors = [
  { name: 'Notion / Confluence', results: [false, false, false, false, true] },
  { name: 'TestRail', results: [false, false, false, false, false] },
  { name: 'Jira', results: [false, false, false, false, false] },
];

export function ComparisonTable() {
  return (
    <section className="relative py-24 sm:py-32 px-6">
      <div className="max-w-[900px] mx-auto">
        <ScrollReveal className="text-center mb-16">
          <h2 className="font-display font-medium text-[36px] sm:text-[48px] leading-[44px] sm:leading-[52px] tracking-[-0.025em] text-slate-900">
            This isn&apos;t a checklist tool.
          </h2>
          <p className="mt-4 text-lg leading-7 text-slate-500">Five dimensions that separate release governance from release checklists.</p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-white/70 backdrop-blur-sm border border-[rgba(0,0,0,0.08)] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="overflow-x-auto">
              <table className="comparison-table w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(0,0,0,0.08)]">
                    <th className="text-left text-slate-400 font-medium py-4 px-5 min-w-[200px]">Feature</th>
                    <th className="rp-col text-center text-slate-900 font-semibold py-4 px-5 border-t-[3px] border-t-blue-500 min-w-[130px]">NoHotfix</th>
                    {competitors.map((c) => (
                      <th key={c.name} className="text-center text-slate-400 font-medium py-4 px-5 min-w-[120px] hidden sm:table-cell">
                        {c.name}
                      </th>
                    ))}
                    <th className="text-center text-slate-400 font-medium py-4 px-5 sm:hidden min-w-[100px]">Other tools</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, i) => (
                    <tr key={i}>
                      <td className="text-slate-700 font-medium py-4 px-5">{feature}</td>
                      <td className="rp-col text-center py-4 px-5">
                        <CheckIcon />
                      </td>
                      {competitors.map((c) => (
                        <td key={c.name} className="text-center py-4 px-5 hidden sm:table-cell">
                          {c.results[i] ? <CheckIcon /> : <CrossIcon />}
                        </td>
                      ))}
                      <td className="text-center py-4 px-5 sm:hidden">
                        {competitors.some((c) => c.results[i]) ? <span className="text-xs text-slate-400">Partial</span> : <CrossIcon />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-[13px] text-slate-400 text-center max-w-[700px] mx-auto">
            TestRail and Zephyr manage test case libraries. Jira tracks tickets. Notion holds documents. NoHotfix enforces the release gate — and they can coexist.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="inline-flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="rgba(0,204,128,0.12)" stroke="#009962" strokeWidth="1.5" />
        <path d="M9 12l2 2 4-4" stroke="#009962" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CrossIcon() {
  return (
    <span className="inline-flex items-center justify-center">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="8" x2="16" y2="16" />
        <line x1="16" y1="8" x2="8" y2="16" />
      </svg>
    </span>
  );
}
