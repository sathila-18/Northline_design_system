import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlTextBlock } from './NlTextBlock';

const rootOf = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('NlTextBlock', () => {
  it('defaults to headline-small, start, default tone, heading as a p', () => {
    const { container } = render(<NlTextBlock heading="Tier 2" description="Earn points on every visit" />);
    const root = rootOf(container);
    expect(root).toHaveAttribute('data-type', 'headline-small');
    expect(root).toHaveAttribute('data-align', 'start');
    expect(root).toHaveAttribute('data-tone', 'default');
    const heading = screen.getByText('Tier 2');
    expect(heading.tagName).toBe('P');
    expect(heading).toHaveClass('nl:text-headline-small-h6', 'nl:text-primary');
    const description = screen.getByText('Earn points on every visit');
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('nl:text-body-m', 'nl:text-secondary');
  });

  it('headingAs sets the element without changing the look (OD-16)', () => {
    render(<NlTextBlock type="headline-small" headingAs="h2" heading="Rewards" />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Rewards' });
    expect(heading).toHaveClass('nl:text-headline-small-h6');
  });

  it.each([
    ['display-large', 'nl:text-display-large-h1', 'nl:text-body-l', 'nl:gap-m'],
    ['display-medium', 'nl:text-display-medium-h2', 'nl:text-body-l', 'nl:gap-m'],
    ['display-small', 'nl:text-display-small-h3', 'nl:text-body-m', 'nl:gap-m'],
    ['headline-large', 'nl:text-headline-large-h4', 'nl:text-body-m', 'nl:gap-m'],
    ['headline-medium', 'nl:text-headline-medium-h5', 'nl:text-body-m', 'nl:gap-xs'],
    ['headline-small', 'nl:text-headline-small-h6', 'nl:text-body-m', 'nl:gap-xs'],
    ['label', 'nl:text-label-m', 'nl:text-body-s', 'nl:gap-none'],
  ] as const)('type %s: heading %s, description %s, gap %s', (type, headingStyle, descStyle, gap) => {
    render(<NlTextBlock type={type} heading="H" description="D" />);
    expect(screen.getByText('H')).toHaveClass(headingStyle);
    expect(screen.getByText('D')).toHaveClass(descStyle);
    expect(screen.getByText('D').parentElement).toHaveClass(gap);
  });

  it('body type: a Body L description and no heading (OD-41)', () => {
    const { container } = render(<NlTextBlock type="body" description="Send me offers by email" />);
    expect(rootOf(container)).toHaveAttribute('data-type', 'body');
    expect(screen.getByText('Send me offers by email')).toHaveClass('nl:text-body-l', 'nl:text-secondary');
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });

  it('renders label, heading and description in that DOM order', () => {
    const { container } = render(
      <NlTextBlock label={<span>Label</span>} heading="Heading" description="Description" />,
    );
    expect(container.textContent).toBe('LabelHeadingDescription');
    expect(rootOf(container).firstElementChild?.textContent).toBe('Label');
  });

  it('does not render parts that are not given', () => {
    const { container } = render(<NlTextBlock heading="Only a heading" />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
    const empty = render(<NlTextBlock />);
    expect(rootOf(empty.container)).toBeEmptyDOMElement();
  });

  it.each([
    ['start', 'nl:items-start', 'nl:text-start'],
    ['center', 'nl:items-center', 'nl:text-center'],
    ['end', 'nl:items-end', 'nl:text-end'],
  ] as const)('align %s', (align, items, text) => {
    const { container } = render(<NlTextBlock align={align} heading="H" />);
    expect(rootOf(container)).toHaveClass(items, text);
    expect(rootOf(container)).toHaveAttribute('data-align', align);
  });

  it('inverse tone: both texts text-inverse', () => {
    render(<NlTextBlock tone="inverse" heading="H" description="D" />);
    expect(screen.getByText('H')).toHaveClass('nl:text-inverse');
    expect(screen.getByText('D')).toHaveClass('nl:text-inverse');
  });

  it('disabled: both texts text-disabled, over any tone (OD-15)', () => {
    render(<NlTextBlock tone="inverse" disabled heading="H" description="D" />);
    expect(screen.getByText('H')).toHaveClass('nl:text-disabled');
    expect(screen.getByText('D')).toHaveClass('nl:text-disabled');
    expect(screen.getByText('H')).not.toHaveClass('nl:text-inverse');
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<NlTextBlock heading="H" className="nl:mt-xl" id="probe" ref={ref} />);
    expect(rootOf(container).className.split(' ').at(-1)).toBe('nl:mt-xl');
    expect(rootOf(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(rootOf(container));
  });
});
