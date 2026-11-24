/**
 * Dashboard fixtures (DESIGN.md §8.6, page rules): twelve months of programme data, December 2025 to November 2026,
 * from a fixed seed. Member numbers (growth, active members, tiers, statuses, recent activity) come from the member
 * fixtures, so they match the Member list page. Points and reward redemptions are generated here. Invented reward
 * names; fake numbers only.
 */
import { members, memberTiers, type Member } from './members';

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20251201);

/** The twelve months shown, oldest first, as ISO "YYYY-MM". */
export const dashboardMonths = [
  '2025-12',
  '2026-01',
  '2026-02',
  '2026-03',
  '2026-04',
  '2026-05',
  '2026-06',
  '2026-07',
  '2026-08',
  '2026-09',
  '2026-10',
  '2026-11',
];

export interface MonthData {
  month: string;
  /** Members who joined in the month (from the member fixtures). */
  newMembers: number;
  /** All members at the end of the month (from the member fixtures). */
  totalMembers: number;
  /** Points earned and redeemed in the month. */
  earned: number;
  redeemed: number;
  [key: string]: string | number;
}

/** Month by month. Points grow with the programme; redeemed runs at 55 to 75% of earned. */
export const monthly: MonthData[] = dashboardMonths.map((month) => {
  const newMembers = members.filter((m) => m.joined.startsWith(month)).length;
  const totalMembers = members.filter((m) => m.joined.slice(0, 7) <= month).length;
  const earned = Math.round(totalMembers * (22 + random() * 8));
  const redeemed = Math.round(earned * (0.55 + random() * 0.2));
  return { month, newMembers, totalMembers, earned, redeemed };
});

/** Invented, motorsport-style rewards. */
export const rewardNames = [
  'Pit lane pass',
  'Hot lap experience',
  'Grid walk',
  'Paddock tour',
  'Track day voucher',
  'Pole position package',
  'Chequered flag dinner',
  'Garage visit',
] as const;

/** Redemptions per reward, per month (index matches dashboardMonths). Popularity differs by reward. */
export const rewardRedemptions: { reward: string; byMonth: number[] }[] = rewardNames.map((reward, index) => {
  const popularity = 1.6 - index * 0.17;
  return {
    reward,
    byMonth: dashboardMonths.map(() => Math.round((14 + random() * 26) * popularity)),
  };
});

/** Counts from the member fixtures, so both pages agree. */
export const activeMembers = members.filter((m) => m.status === 'active').length;
export const membersByTier = memberTiers.map((tier) => ({
  key: tier.toLowerCase(),
  label: tier,
  value: members.filter((m) => m.tier === tier).length,
}));

export interface ActivityRow {
  id: string;
  member: string;
  memberId: string;
  event: string;
  points: number;
  date: string;
}

const events = [
  ['Points earned', 1],
  ['Reward redeemed', -1],
  ['Bonus points', 1],
] as const;

/** The 5 latest member events: the members with the latest activity (ties by ID), with an invented event each. */
export const recentActivity: ActivityRow[] = [...members]
  .sort((a: Member, b: Member) => b.lastActivity.localeCompare(a.lastActivity) || b.id.localeCompare(a.id))
  .slice(0, 5)
  .map((member, index) => {
    const [event, sign] = events[Math.floor(random() * events.length)] ?? events[0];
    return {
      id: `activity-${String(index)}`,
      member: member.name,
      memberId: member.id,
      event,
      points: sign * (50 + Math.floor(random() * 950)),
      date: member.lastActivity,
    };
  });
