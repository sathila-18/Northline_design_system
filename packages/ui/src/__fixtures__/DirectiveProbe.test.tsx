// Proves the test setup (Vitest, jsdom, Testing Library, user-event, jest-dom) on the internal fixture.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DirectiveProbe } from './DirectiveProbe';

describe('test setup', () => {
  it('renders, takes keyboard input and updates', async () => {
    const user = userEvent.setup();
    render(<DirectiveProbe />);
    const button = screen.getByRole('button', { name: '0' });
    expect(button).toBeEnabled();

    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
  });
});
