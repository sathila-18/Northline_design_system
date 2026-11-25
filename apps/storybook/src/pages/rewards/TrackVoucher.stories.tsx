import type { Meta, StoryObj } from '@storybook/react-vite';
import { knownCodes } from '../_fixtures/vouchers';
import { TrackVoucher } from './TrackVoucher';

/**
 * Track voucher (DESIGN.md §8.6, P5). Storybook only, built from library components and the fixture vouchers. Type
 * a code and press Track or Enter; a row in Recent vouchers loads that voucher. Known codes, one per status:
 * NLV-7K2P-94QX (issued), NLV-3HQM-8RZD (redeemed), NLV-9WTB-2LKF (settled), NLV-5CXN-6PJV (expired),
 * NLV-4DGY-7MWS (cancelled). Designed for 1440 wide.
 */
const meta: Meta<typeof TrackVoucher> = {
  title: 'Pages/Rewards/Track voucher',
  component: TrackVoucher,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
};
export default meta;

type Story = StoryObj<typeof TrackVoucher>;

/** An empty search, with the recent vouchers below. */
export const Default: Story = {};

/** An issued voucher: Mark as redeemed and Cancel voucher. */
export const Issued: Story = { args: { initialCode: knownCodes.issued } };

/** A redeemed voucher: Mark as settled. */
export const Redeemed: Story = { args: { initialCode: knownCodes.redeemed } };

/** A settled voucher: every step done, no actions. */
export const Settled: Story = { args: { initialCode: knownCodes.settled } };

/** An expired voucher: the steps stop before Redeemed, with the reason. */
export const Expired: Story = { args: { initialCode: knownCodes.expired } };

/** A cancelled voucher: the steps stop where it was cancelled, with the reason. */
export const Cancelled: Story = { args: { initialCode: knownCodes.cancelled } };

/** A well-formed code that doesn't exist: Try another code clears and focuses the field. */
export const NotFound: Story = { name: 'Not found', args: { initialCode: 'NLV-AAAA-BBBB' } };

/** A code in the wrong format: the field error shows and nothing is searched. */
export const InvalidFormat: Story = { name: 'Invalid format', args: { initialCode: 'NLV-12' } };

/** The lookup in progress: the result card's loading state. */
export const Loading: Story = { args: { initialCode: knownCodes.issued, initialState: 'loading' } };

/** The lookup failed. Try again looks the code up again. */
export const Error: Story = { args: { initialCode: knownCodes.issued, initialState: 'error' } };
