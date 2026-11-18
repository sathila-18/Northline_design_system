import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { NlAvatar } from './NlAvatar';

const root = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const circle = (container: HTMLElement) => root(container).firstElementChild as HTMLElement;
const image = (container: HTMLElement) => {
  const img = container.querySelector('img');
  if (!img) throw new Error('No image rendered');
  return img;
};

describe('NlAvatar', () => {
  it('defaults to medium, icon type, with the person icon', () => {
    const { container } = render(<NlAvatar />);
    expect(root(container)).toHaveAttribute('data-size', 'medium');
    expect(root(container)).toHaveAttribute('data-type', 'icon');
    expect(root(container)).toHaveClass('nl:size-40');
    const icon = container.querySelector('[data-icon]');
    expect(icon).toHaveAttribute('data-icon', 'person');
    expect(icon).toHaveAttribute('data-size', '24');
    expect(icon).toHaveAttribute('data-tone', 'inherit');
  });

  it('draws a round circle with a 1px border-subtle inside', () => {
    const { container } = render(<NlAvatar />);
    expect(circle(container)).toHaveClass('nl:rounded-full', 'nl:border', 'nl:border-subtle', 'nl:overflow-hidden');
  });

  it('uses bg-icons with fg-secondary for the icon and text-secondary for initials', () => {
    const { container: a } = render(<NlAvatar />);
    expect(circle(a)).toHaveClass('nl:bg-icons', 'nl:text-fg-secondary');
    const { container: b } = render(<NlAvatar initials="MX" />);
    expect(circle(b)).toHaveClass('nl:bg-icons', 'nl:text-secondary');
  });

  it('shows the photo when src is set, covering the circle', () => {
    const { container } = render(<NlAvatar src="a.png" alt="Member 0042" initials="MX" />);
    expect(root(container)).toHaveAttribute('data-type', 'image');
    const img = screen.getByRole('img', { name: 'Member 0042' });
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveClass('nl:object-cover');
    expect(circle(container)).not.toHaveClass('nl:bg-icons');
  });

  it('gives the image an empty alt by default', () => {
    const { container } = render(<NlAvatar src="a.png" />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('trims initials, keeps 2 characters and uppercases them', () => {
    const { container } = render(<NlAvatar initials="  max " />);
    expect(root(container)).toHaveAttribute('data-type', 'text');
    expect(circle(container)).toHaveTextContent(/^MA$/);
  });

  it('falls back to the icon when the initials are blank', () => {
    const { container } = render(<NlAvatar initials="   " />);
    expect(root(container)).toHaveAttribute('data-type', 'icon');
  });

  it('falls back to initials, then the icon, when the photo fails', () => {
    const { container, rerender } = render(<NlAvatar src="broken.png" initials="MX" />);
    fireEvent.error(image(container));
    expect(root(container)).toHaveAttribute('data-type', 'text');
    rerender(<NlAvatar src="broken.png" />);
    expect(root(container)).toHaveAttribute('data-type', 'icon');
  });

  it('tries again when src changes after a failure', () => {
    const { container, rerender } = render(<NlAvatar src="broken.png" initials="MX" />);
    fireEvent.error(image(container));
    rerender(<NlAvatar src="new.png" initials="MX" />);
    expect(root(container)).toHaveAttribute('data-type', 'image');
  });

  it('hides initials and icon from screen readers by default', () => {
    render(<NlAvatar initials="MX" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByText('MX')).toHaveAttribute('aria-hidden', 'true');
  });

  it('names initials and icon avatars with alt (role img)', () => {
    const { container } = render(<NlAvatar initials="MX" alt="Member 0042" />);
    expect(screen.getByRole('img', { name: 'Member 0042' })).toBe(circle(container));
    render(<NlAvatar alt="Member 0043" />);
    expect(screen.getByRole('img', { name: 'Member 0043' })).toBeInTheDocument();
  });

  it('shows no dot unless online, and labels it "Online" by default', () => {
    const { container, rerender } = render(<NlAvatar />);
    expect(root(container).children).toHaveLength(1);
    rerender(<NlAvatar online />);
    expect(screen.getByRole('img', { name: 'Online' })).toHaveClass('nl:absolute', 'nl:end-none', 'nl:bottom-none');
    rerender(<NlAvatar online onlineLabel="Available" />);
    expect(screen.getByRole('img', { name: 'Available' })).toBeInTheDocument();
  });

  it.each([
    ['xsmall', 'nl:size-24', '16', 'xsmall', 'nl:text-label-s', 'nl:end-none'],
    ['small', 'nl:size-32', '20', 'small', 'nl:text-label-m', 'nl:end-none'],
    ['medium', 'nl:size-40', '24', 'medium', 'nl:text-label-l', 'nl:end-none'],
    ['large', 'nl:size-48', '24', 'medium', 'nl:text-title-l', 'nl:end-none'],
    ['xlarge', 'nl:size-56', '36', 'large', 'nl:text-headline-medium-h5', 'nl:end-none'],
    ['xxlarge', 'nl:size-64', '48', 'large', 'nl:text-headline-large-h4', 'nl:end-xxs'],
    ['xxxlarge', 'nl:size-96', '64', 'xlarge', 'nl:text-display-medium-h2', 'nl:end-xxs'],
  ] as const)('size %s: box %s, icon %s, dot %s, initials %s, dot inset %s', (size, box, icon, dot, text, inset) => {
    const { container: a } = render(<NlAvatar size={size} online />);
    expect(root(a)).toHaveClass(box);
    expect(a.querySelector('[data-icon]')).toHaveAttribute('data-size', icon);
    const statusDot = a.querySelector('[role="img"][aria-label="Online"]');
    expect(statusDot).toHaveAttribute('data-size', dot);
    expect(statusDot).toHaveClass(inset);
    const { container: b } = render(<NlAvatar size={size} initials="MX" />);
    expect(b.querySelector('[aria-hidden]')).toHaveClass(text);
  });

  it('is never focusable', () => {
    const { container } = render(<NlAvatar initials="MX" alt="Member 0042" online />);
    expect(container.querySelector('[tabindex]')).toBeNull();
  });

  it('appends className last and passes native attributes and ref to the root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(<NlAvatar className="nl:ms-xs" id="probe" ref={ref} />);
    expect(root(container).className.split(' ').at(-1)).toBe('nl:ms-xs');
    expect(root(container)).toHaveAttribute('id', 'probe');
    expect(ref.current).toBe(root(container));
  });
});
