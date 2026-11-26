/**
 * Tier fixtures (DESIGN.md §8.6, page rules): the four invented tiers and an invented perks list. Member counts per
 * tier come from the member fixtures, so they match the Dashboard donut and the Member list. Dates are up to the
 * fixtures' last date (23/11/2026).
 */
import { members, type MemberTier } from './members';

export interface Perk {
  id: string;
  label: string;
}

/** Every perk a tier can give, in the order the edit drawer lists them. */
export const perks: Perk[] = [
  { id: 'birthday-points', label: 'Birthday bonus points' },
  { id: 'partner-discounts', label: 'Partner discounts' },
  { id: 'free-delivery', label: 'Free voucher delivery' },
  { id: 'early-access', label: 'Early access to events' },
  { id: 'track-day-discount', label: 'Track day discount' },
  { id: 'priority-support', label: 'Priority support' },
  { id: 'lounge-access', label: "Members' lounge access" },
  { id: 'pit-lane-tour', label: 'Yearly pit lane tour' },
];

export interface Tier {
  id: string;
  /** The tier's key in the member fixtures; stays the same when the name is edited. */
  memberTier: MemberTier;
  name: string;
  /** Points a member needs to reach the tier. Always 0 for the first tier. */
  pointsToReach: number;
  /** Points earned are multiplied by this. */
  multiplier: number;
  /** Months a member keeps the tier before it is checked again. */
  keepMonths: number;
  /** Perk ids, from `perks`. */
  perkIds: string[];
  /** ISO date. */
  lastUpdated: string;
}

/** Choices in the edit drawer. */
export const multiplierOptions = [1, 1.25, 1.5, 1.75, 2];
export const keepMonthOptions = [6, 12, 24];

const perkIdsUpTo = (count: number) => perks.slice(0, count).map((perk) => perk.id);

/** The four tiers, lowest first. Rows stay in this order. */
export const tiers: Tier[] = [
  {
    id: 'tier-bronze',
    memberTier: 'Bronze',
    name: 'Bronze',
    pointsToReach: 0,
    multiplier: 1,
    keepMonths: 12,
    perkIds: perkIdsUpTo(2),
    lastUpdated: '2026-03-02',
  },
  {
    id: 'tier-silver',
    memberTier: 'Silver',
    name: 'Silver',
    pointsToReach: 5000,
    multiplier: 1.25,
    keepMonths: 12,
    perkIds: perkIdsUpTo(4),
    lastUpdated: '2026-06-15',
  },
  {
    id: 'tier-gold',
    memberTier: 'Gold',
    name: 'Gold',
    pointsToReach: 15000,
    multiplier: 1.5,
    keepMonths: 12,
    perkIds: perkIdsUpTo(6),
    lastUpdated: '2026-09-08',
  },
  {
    id: 'tier-platinum',
    memberTier: 'Platinum',
    name: 'Platinum',
    pointsToReach: 40000,
    multiplier: 2,
    keepMonths: 12,
    perkIds: perkIdsUpTo(8),
    lastUpdated: '2026-10-19',
  },
];

/** Members in each tier, from the member fixtures. */
export const membersInTier: Record<MemberTier, number> = {
  Bronze: members.filter((m) => m.tier === 'Bronze').length,
  Silver: members.filter((m) => m.tier === 'Silver').length,
  Gold: members.filter((m) => m.tier === 'Gold').length,
  Platinum: members.filter((m) => m.tier === 'Platinum').length,
};

export const totalMembers = members.length;

/** A tier's share of all members, one decimal place, without locale formatting ("24.8%"). */
export function shareOfMembers(tier: MemberTier) {
  return `${String(Math.round((membersInTier[tier] / totalMembers) * 1000) / 10)}%`;
}

/** "1.25x". */
export const formatMultiplier = (multiplier: number) => `${String(multiplier)}x`;

/** "12 months". */
export const formatMonths = (months: number) => `${String(months)} months`;

/** "5 perks", "1 perk". */
export const formatPerkCount = (count: number) => `${String(count)} ${count === 1 ? 'perk' : 'perks'}`;
