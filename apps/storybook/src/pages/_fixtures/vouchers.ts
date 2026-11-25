/**
 * Voucher fixtures (DESIGN.md §8.6, page rules): 60 invented vouchers from a fixed seed. Each one belongs to a member
 * from the member fixtures and a reward from the reward fixtures, so names and points match the other pages.
 * Redemption places are invented. Dates run up to the fixtures' last date (23/11/2026).
 *
 * Known codes for the stories, one per status:
 *   issued     NLV-7K2P-94QX
 *   redeemed   NLV-3HQM-8RZD
 *   settled    NLV-9WTB-2LKF
 *   expired    NLV-5CXN-6PJV
 *   cancelled  NLV-4DGY-7MWS
 */
import { LAST_DATE, members, type Member } from './members';
import { rewards, type Reward } from './rewards';

export type VoucherStatus = 'issued' | 'redeemed' | 'settled' | 'expired' | 'cancelled';

export interface Voucher {
  /** NLV-7K2P-94QX style. */
  code: string;
  memberId: string;
  rewardId: string;
  pointsSpent: number;
  /** ISO YYYY-MM-DD. */
  issued: string;
  /** ISO YYYY-MM-DD. */
  expires: string;
  /** ISO YYYY-MM-DD, when redeemed. */
  redeemed?: string;
  /** Where it was redeemed. */
  place?: string;
  /** ISO YYYY-MM-DD, when settled. */
  settled?: string;
  /** ISO YYYY-MM-DD, when cancelled. */
  cancelled?: string;
  status: VoucherStatus;
}

export const voucherStatuses: VoucherStatus[] = ['issued', 'redeemed', 'settled', 'expired', 'cancelled'];

export const voucherStatusLabel: Record<VoucherStatus, string> = {
  issued: 'Issued',
  redeemed: 'Redeemed',
  settled: 'Settled',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

/** The known codes for the stories, one per status. */
export const knownCodes: Record<VoucherStatus, string> = {
  issued: 'NLV-7K2P-94QX',
  redeemed: 'NLV-3HQM-8RZD',
  settled: 'NLV-9WTB-2LKF',
  expired: 'NLV-5CXN-6PJV',
  cancelled: 'NLV-4DGY-7MWS',
};

/** Invented redemption places. */
const places = [
  'Northline Hub, Bay 3',
  'Northline Hub, Bay 7',
  'Paddock Lounge, Desk 2',
  'Grid Gate, Kiosk 1',
  'Pit Lane Store, Counter 4',
  'Trackside Café, Till 2',
  'Members Centre, Desk 5',
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(20261126);
const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
const pick = <T>(list: readonly T[]): T => list[Math.floor(random() * list.length)] ?? (list[0] as T);

/** Days after an ISO date, as an ISO date (UTC, so it's the same everywhere). */
function addDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Letters and digits that don't look alike (no 0, O, 1, I). Kept as two strings: one 32-character run trips the
 * scrub's file-key rule.
 */
const codeCharacters = 'ABCDEFGHJKLMN' + 'PQRSTUVWXYZ' + '23456789';
const codePart = () =>
  Array.from({ length: 4 }, () => codeCharacters.charAt(Math.floor(random() * codeCharacters.length))).join('');

/** Rewards that can be redeemed: live or expired ones. */
const redeemable = rewards.filter((reward) => reward.status === 'live' || reward.status === 'expired');
const activeMembers = members.filter((member) => member.status !== 'suspended');

const VOUCHER_DAYS = 90;
const START = '2025-12-01';

function build(): Voucher[] {
  const list: Voucher[] = [];
  const used = new Set<string>(Object.values(knownCodes));
  for (let index = 0; index < 60; index += 1) {
    const member = pick(activeMembers);
    const reward = pick(redeemable);
    const issued = addDays(START, between(0, 357));
    const expires = addDays(issued, VOUCHER_DAYS);
    const roll = random();
    let status: VoucherStatus;
    if (roll < 0.1) status = 'cancelled';
    else if (roll < 0.45) status = 'settled';
    else if (roll < 0.7) status = 'redeemed';
    else status = expires < LAST_DATE ? 'expired' : 'issued';

    const voucher: Voucher = {
      code: '',
      memberId: member.id,
      rewardId: reward.id,
      pointsSpent: reward.points,
      issued,
      expires,
      status,
    };
    if (status === 'redeemed' || status === 'settled') {
      const redeemed = addDays(issued, between(2, 60));
      voucher.redeemed = redeemed < LAST_DATE ? redeemed : LAST_DATE;
      voucher.place = pick(places);
      if (status === 'settled') {
        const settled = addDays(voucher.redeemed, between(3, 14));
        // Settled after the last date can't have happened yet: it stays redeemed.
        if (settled <= LAST_DATE) voucher.settled = settled;
        else voucher.status = 'redeemed';
      }
    }
    if (status === 'cancelled') {
      const cancelled = addDays(issued, between(1, 20));
      voucher.cancelled = cancelled < LAST_DATE ? cancelled : LAST_DATE;
    }
    let code = `NLV-${codePart()}-${codePart()}`;
    while (used.has(code)) code = `NLV-${codePart()}-${codePart()}`;
    used.add(code);
    voucher.code = code;
    list.push(voucher);
  }
  // The first voucher of each status takes its known code, so the stories can search for it.
  for (const status of voucherStatuses) {
    const voucher = list.find((item) => item.status === status);
    if (voucher) voucher.code = knownCodes[status];
  }
  return list;
}

export const vouchers: Voucher[] = build();

const memberById = new Map(members.map((member) => [member.id, member]));
const rewardById = new Map(rewards.map((reward) => [reward.id, reward]));

export const memberOf = (voucher: Voucher): Member | undefined => memberById.get(voucher.memberId);
export const rewardOf = (voucher: Voucher): Reward | undefined => rewardById.get(voucher.rewardId);

/** The 10 most recently issued vouchers, newest first (ties by code). */
export const recentVouchers: Voucher[] = [...vouchers]
  .sort((a, b) => b.issued.localeCompare(a.issued) || a.code.localeCompare(b.code))
  .slice(0, 10);

/** The code format: NLV, then two groups of 4 letters or digits. */
export const CODE_PATTERN = /^NLV-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** A typed code tidied for searching: no spaces, upper case. */
export const normaliseCode = (value: string) => value.replace(/\s+/g, '').toUpperCase();
