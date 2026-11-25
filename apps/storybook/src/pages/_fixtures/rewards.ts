/**
 * Rewards fixtures (DESIGN.md §8.6, page rules): 36 invented, motorsport-style rewards from a fixed seed. The 8
 * dashboard rewards come first and keep the dashboard's redemption counts (its default 12-month period), so the two
 * pages match. No real brands, teams, circuits or people; fake numbers only.
 */
import type { NlIconName } from '@northline/ui';
import { rewardRedemptions } from './dashboard';
import { LAST_DATE } from './members';

export type RewardCategory = 'experiences' | 'merchandise' | 'partner-offers' | 'vouchers';
export type RewardStatus = 'live' | 'scheduled' | 'expired' | 'draft';

export interface Reward {
  /** RW-0012 style. */
  id: string;
  name: string;
  category: RewardCategory;
  /** Points a member spends. */
  points: number;
  /** All-time redemptions. */
  redemptions: number;
  /** Units left, or unlimited. */
  stock: number | 'unlimited';
  status: RewardStatus;
  /** ISO YYYY-MM-DD. */
  validFrom: string;
  /** ISO YYYY-MM-DD. */
  validUntil: string;
}

export const rewardCategories: RewardCategory[] = ['experiences', 'merchandise', 'partner-offers', 'vouchers'];
export const rewardStatuses: RewardStatus[] = ['live', 'scheduled', 'expired', 'draft'];

export const categoryLabel: Record<RewardCategory, string> = {
  experiences: 'Experiences',
  merchandise: 'Merchandise',
  'partner-offers': 'Partner offers',
  vouchers: 'Vouchers',
};

/** The icon on each category's card placeholder, from the nlIcons registry. */
export const categoryIcon: Record<RewardCategory, NlIconName> = {
  experiences: 'event',
  merchandise: 'redeem',
  'partner-offers': 'swap_horiz',
  vouchers: 'check_circle',
};

export const rewardStatusLabel: Record<RewardStatus, string> = {
  live: 'Live',
  scheduled: 'Scheduled',
  expired: 'Expired',
  draft: 'Draft',
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20261125);
const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));

/** The 8 dashboard rewards, in the dashboard's order, with their categories. */
const dashboardRewards: [string, RewardCategory][] = [
  ['Pit lane pass', 'experiences'],
  ['Hot lap experience', 'experiences'],
  ['Grid walk', 'experiences'],
  ['Paddock tour', 'experiences'],
  ['Track day voucher', 'experiences'],
  ['Pole position package', 'experiences'],
  ['Chequered flag dinner', 'partner-offers'],
  ['Garage visit', 'experiences'],
];

/** The other 28 rewards, with their category and status. */
const otherRewards: [string, RewardCategory, RewardStatus][] = [
  ['Driving lesson: braking skills', 'experiences', 'live'],
  ['Driving lesson: wet weather', 'experiences', 'scheduled'],
  ['Karting sprint session', 'experiences', 'live'],
  ['Pit stop challenge', 'experiences', 'expired'],
  ['Night session pass', 'experiences', 'scheduled'],
  ['Sim racing hour', 'experiences', 'live'],
  ['Pit lane tour for two', 'experiences', 'draft'],
  ['Team cap', 'merchandise', 'live'],
  ['Racing gloves', 'merchandise', 'live'],
  ['Paddock jacket', 'merchandise', 'live'],
  ['Lap timer keyring', 'merchandise', 'expired'],
  ['Scale model car', 'merchandise', 'live'],
  ['Pit crew hoodie', 'merchandise', 'scheduled'],
  ['Chequered flag scarf', 'merchandise', 'live'],
  ['Grid umbrella', 'merchandise', 'draft'],
  ['Trackside café meal', 'partner-offers', 'live'],
  ['Trackside hotel night', 'partner-offers', 'live'],
  ['Tyre fitting discount', 'partner-offers', 'expired'],
  ['Car wash pass', 'partner-offers', 'live'],
  ['Detailing package', 'partner-offers', 'draft'],
  ['Fuel voucher 20', 'vouchers', 'live'],
  ['Fuel voucher 50', 'vouchers', 'live'],
  ['Servicing voucher', 'vouchers', 'live'],
  ['Oil change voucher', 'vouchers', 'expired'],
  ['Parking pass: day', 'vouchers', 'live'],
  ['Parking pass: season', 'vouchers', 'scheduled'],
  ['Brake check voucher', 'vouchers', 'expired'],
  ['Valet voucher', 'vouchers', 'draft'],
];

/** Points cost range per category, in steps of 50. */
const pointsRange: Record<RewardCategory, [number, number]> = {
  experiences: [2500, 12000],
  merchandise: [400, 3000],
  'partner-offers': [800, 5000],
  vouchers: [300, 2500],
};

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (year: number, month: number, day: number) => `${String(year)}-${pad(month)}-${pad(day)}`;

/** Valid dates for a status, around the fixtures' last date (23/11/2026). */
function validDates(status: RewardStatus): [string, string] {
  switch (status) {
    case 'scheduled':
      return [isoDate(2026, 12, between(1, 28)), isoDate(2027, between(3, 12), between(1, 28))];
    case 'expired':
      return [isoDate(2025, between(1, 12), between(1, 28)), isoDate(2026, between(1, 10), between(1, 28))];
    case 'draft':
      return [isoDate(2027, between(1, 3), between(1, 28)), isoDate(2027, between(6, 12), between(1, 28))];
    case 'live':
      return [isoDate(2025, between(1, 12), between(1, 28)), isoDate(between(2026, 2027), 12, between(1, 28))];
  }
}

function build(): Reward[] {
  const list: [string, RewardCategory, RewardStatus, number | undefined][] = [
    ...dashboardRewards.map(([name, category], index): [string, RewardCategory, RewardStatus, number | undefined] => [
      name,
      category,
      'live',
      rewardRedemptions[index]?.byMonth.reduce((sum, value) => sum + value, 0),
    ]),
    ...otherRewards.map(([name, category, status]): [string, RewardCategory, RewardStatus, number | undefined] => [
      name,
      category,
      status,
      undefined,
    ]),
  ];
  return list.map(([name, category, status, dashboardCount], index) => {
    const [min, max] = pointsRange[category];
    const points = between(min / 50, max / 50) * 50;
    // Scheduled and draft rewards haven't been redeemed yet.
    const redemptions = dashboardCount ?? (status === 'live' || status === 'expired' ? between(12, 320) : 0);
    // Vouchers are unlimited; the rest have stock, some running low.
    const stock: Reward['stock'] = category === 'vouchers' ? 'unlimited' : between(0, 40) * 5;
    const [validFrom, validUntil] = validDates(status);
    return {
      id: `RW-${String(index + 1).padStart(4, '0')}`,
      name,
      category,
      points,
      redemptions,
      stock,
      status,
      validFrom,
      validUntil: status === 'live' && validUntil <= LAST_DATE ? isoDate(2026, 12, 31) : validUntil,
    };
  });
}

export const rewards: Reward[] = build();
