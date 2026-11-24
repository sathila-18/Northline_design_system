'use client';

import { useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import { NlButton } from '../../components/NlButton';
import { NlEmptyState } from '../../components/NlEmptyState';
import { NlSegmentedButton, type NlSegmentedButtonOption } from '../../components/NlSegmentedButton';
import { NlSkeleton } from '../../components/NlSkeleton';
import { NlTextBlock, type NlTextBlockHeadingAs } from '../../components/NlTextBlock';
import * as styles from './NlChartFrame.styles';

export type NlChartFrameStatus = 'ready' | 'loading' | 'empty' | 'error';
export type NlChartFrameView = 'chart' | 'table';
export type NlChartFrameHeight = keyof typeof styles.body;

export interface NlChartFrameProps extends Omit<ComponentPropsWithRef<'section'>, 'className' | 'children' | 'title'> {
  /** The chart's title: the frame's heading and the section's name. */
  title: string;
  /** A one-line summary under the title. */
  description?: string;
  /** The heading's element. Default h2. */
  headingAs?: NlTextBlockHeadingAs;
  /** Ready (the chart or table), loading, empty or error. */
  status?: NlChartFrameStatus;
  /** Error state: called by Try again. */
  onRetry?: () => void;
  /** The chart's height, kept in every state: Size-240 or Size-320. */
  height?: NlChartFrameHeight;
  /** The chart (an NlLineChart, NlBarChart or NlDonutChart), a slot (D15). */
  children?: ReactNode;
  /** The same data as an NlTable, a slot (D15). Without it there is no switch. */
  table?: ReactNode;
  /** The view (controlled). */
  view?: NlChartFrameView;
  /** The starting view when uncontrolled. Default chart. */
  defaultView?: NlChartFrameView;
  onViewChange?: (view: NlChartFrameView) => void;
  /** Card (default) or plain (the page draws the card). */
  variant?: keyof typeof styles.root;
  /** Placement only. */
  className?: string;
}

const viewOptions: [NlSegmentedButtonOption, NlSegmentedButtonOption] = [
  { value: 'chart', label: 'Chart', icon: 'bar_chart' },
  { value: 'table', label: 'Table', icon: 'table' },
];

/**
 * The chart area (DESIGN.md §9, NlChartFrame). A section named by the title: the heading (NlTextBlock
 * headline-small), a "View as" switch (NlSegmentedButton, Chart | Table) when a table is given, and a body that keeps
 * the chart's height in every state: the chart or the table (both slots, D15), five skeleton bars while loading, or
 * NlEmptyState for empty ("No data for this period") and error (with Try again). The switch is hidden, keeping its
 * space, unless there's data. 'use client' for the view state.
 */
export function NlChartFrame({
  title,
  description,
  headingAs = 'h2',
  status = 'ready',
  onRetry,
  height = '320',
  children,
  table,
  view,
  defaultView = 'chart',
  onViewChange,
  variant = 'card',
  className,
  ...rest
}: NlChartFrameProps) {
  const [ownView, setOwnView] = useState<NlChartFrameView>(defaultView);
  const current = view ?? ownView;
  const ready = status === 'ready';
  const showSwitch = table !== undefined;

  let body: ReactNode;
  if (status === 'loading') {
    body = (
      <div className={styles.skeletons}>
        {[0, 1, 2, 3, 4].map((bar) => (
          <NlSkeleton key={bar} shape="rect" />
        ))}
      </div>
    );
  } else if (status === 'empty') {
    body = (
      <div className={styles.state}>
        <NlEmptyState
          size="small"
          live
          icon="bar_chart"
          heading="No data for this period"
          description="Try a different date range."
        />
      </div>
    );
  } else if (status === 'error') {
    body = (
      <div className={styles.state}>
        <NlEmptyState
          size="small"
          live
          icon="error"
          heading="This chart couldn't load"
          description="Something went wrong while loading the data."
          action={
            <NlButton variant="primary" size="small" icon="leading" iconName="refresh" onClick={onRetry}>
              Try again
            </NlButton>
          }
        />
      </div>
    );
  } else if (current === 'table' && table !== undefined) {
    body = <div className={styles.table}>{table}</div>;
  } else {
    body = children;
  }

  return (
    <section
      {...rest}
      aria-label={title}
      aria-busy={status === 'loading' || undefined}
      className={[styles.root[variant], className].filter(Boolean).join(' ')}
      data-status={status}
      data-variant={variant}
    >
      <div className={styles.header}>
        <NlTextBlock
          type="headline-small"
          heading={title}
          headingAs={headingAs}
          description={description}
          className={styles.title}
        />
        {showSwitch && (
          <div
            className={styles.switchSlot[ready ? 'shown' : 'hidden']}
            aria-hidden={ready ? undefined : true}
            inert={!ready}
          >
            <NlSegmentedButton
              aria-label="View as"
              size="xsmall"
              options={viewOptions}
              value={current}
              onValueChange={(next) => {
                const nextView = next as NlChartFrameView;
                setOwnView(nextView);
                onViewChange?.(nextView);
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.body[height]} data-view={ready ? current : undefined}>
        {body}
      </div>
    </section>
  );
}
