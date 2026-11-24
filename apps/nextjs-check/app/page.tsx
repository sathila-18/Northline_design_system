// A server-rendered sample page. It imports both packages the way an app would; components are added here as they
// are built, so every release proves they render in the App Router.
import { brands, semanticTokens, themes } from '@northline/tokens';
import * as ui from '@northline/ui';
import { NlChartFrame, NlChartLegend, NlChartTooltip } from '@northline/ui/charts';

const samples = ['bg-action-primary', 'bg-brand', 'bg-success', 'bg-warning', 'bg-error'] as const;

export default function Page() {
  return (
    <main style={{ padding: 'var(--nl-space-4xl)', display: 'grid', gap: 'var(--nl-space-xl)' }}>
      <h1 style={{ font: 'var(--nl-font-display-small-h3)' }}>Northline Next.js check</h1>
      <p style={{ font: 'var(--nl-font-body-l)', color: 'var(--nl-text-secondary)' }}>
        Brands: {brands.join(', ')}. Themes: {themes.join(', ')}. Components exported: {Object.keys(ui).length}.
      </p>
      <div style={{ display: 'flex', gap: 'var(--nl-space-l)' }}>
        {samples.map((name) => (
          <span
            key={name}
            title={semanticTokens[name].description}
            style={{
              width: 'var(--nl-size-48)',
              height: 'var(--nl-size-48)',
              borderRadius: 'var(--nl-radius-s)',
              backgroundColor: `var(${semanticTokens[name].cssVar})`,
            }}
          />
        ))}
      </div>
      {/* @northline/ui/charts, the separate charts entry point, rendered on the server. */}
      <NlChartTooltip
        heading="Mar 2026"
        items={[
          { name: 'Members', value: '1,204', series: 1 },
          { name: 'New members', value: '96', series: 2 },
        ]}
      />
      <NlChartFrame title="Members by tier" status="empty" height="240" />
      <NlChartLegend
        items={[
          { label: 'Members', series: 1 },
          { label: 'New members', series: 2 },
        ]}
      />
    </main>
  );
}
