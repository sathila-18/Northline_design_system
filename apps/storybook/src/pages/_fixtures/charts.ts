/**
 * Chart fixtures for the chart stories and the dashboard (DESIGN.md §8.5, page rules). Fake, generic numbers built from
 * a fixed seed, so every build shows the same charts. Months are ISO "YYYY-MM"; the charts format them ("Mar",
 * "Jan 2027", "Mar 2026").
 */

import { members, memberTiers } from './members';

/** mulberry32: a small seeded generator. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20260301);
const pad = (value: number) => String(value).padStart(2, '0');

/** Fifteen months, January 2026 to March 2027, so the axis shows a January with its year. */
export const months = Array.from({ length: 15 }, (_, index) => {
  const year = 2026 + Math.floor(index / 12);
  return `${String(year)}-${pad((index % 12) + 1)}`;
});

export interface MemberGrowth {
  month: string;
  members: number;
  newMembers: number;
  returning: number;
  tier2: number;
  tier3: number;
  inactive: number;
  suspended: number;
  [key: string]: string | number;
}

/** Member growth by month: a total that climbs, and six smaller series for the "most series" stories. */
export const memberGrowth: MemberGrowth[] = (() => {
  let members = 820;
  return months.map((month) => {
    const newMembers = 40 + Math.floor(random() * 70);
    members += newMembers - Math.floor(random() * 25);
    return {
      month,
      members,
      newMembers,
      returning: 200 + Math.floor(random() * 220),
      tier2: 260 + Math.floor(random() * 90),
      tier3: 110 + Math.floor(random() * 60),
      inactive: 40 + Math.floor(random() * 40),
      suspended: 4 + Math.floor(random() * 12),
    };
  });
})();

export interface PointsByMonth {
  month: string;
  earned: number;
  redeemed: number;
  expired: number;
  bonus: number;
  adjusted: number;
  [key: string]: string | number;
}

/** Points earned, redeemed and the rest, by month: twelve months of 2026. */
export const pointsByMonth: PointsByMonth[] = months.slice(0, 12).map((month) => ({
  month,
  earned: 9000 + Math.floor(random() * 6000),
  redeemed: 5000 + Math.floor(random() * 4500),
  expired: 600 + Math.floor(random() * 900),
  bonus: 800 + Math.floor(random() * 1200),
  adjusted: 100 + Math.floor(random() * 400),
}));

export interface RewardCount {
  reward: string;
  redeemed: number;
  [key: string]: string | number;
}

/** Top rewards by times redeemed, largest first (the page sorts). Invented reward names. */
export const topRewards: RewardCount[] = [
  'Track day voucher',
  'Reward X',
  'Event pass',
  'Tier 2 welcome bonus',
  'Coffee voucher',
  'Weekend parking pass for members in every tier',
]
  .map((reward) => ({ reward, redeemed: 40 + Math.floor(random() * 420) }))
  .sort((a, b) => b.redeemed - a.redeemed);

/** Members by tier, counted from the member fixtures, in tier order (the tier donut keeps data order). */
export const membersByTier = memberTiers.map((tier) => ({
  key: tier.toLowerCase(),
  label: tier,
  value: members.filter((member) => member.tier === tier).length,
}));

/** Rewards redeemed by kind: eight kinds, so the donut shows the largest 4 and "Other". Invented names. */
export const rewardsByKind = [
  'Track day voucher',
  'Reward X',
  'Event pass',
  'Coffee voucher',
  'Parking pass',
  'Tier 2 bonus',
  'Gift card',
  'Merch pack',
].map((label, index) => ({ key: `kind-${String(index)}`, label, value: 20 + Math.floor(random() * 300) }));
