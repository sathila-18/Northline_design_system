/**
 * Member fixtures for the Storybook pages (DESIGN.md §8.6, page rules). Invented people only: names are drawn from
 * generic first and last names, emails are on example.com, and IDs follow NL-000123.
 *
 * Built once at import from a fixed seed (mulberry32), so every build shows the same 120 members. Dates are in
 * 2026, kept as ISO strings for sorting and filtering, with a display copy in the DD/MM/YYYY format NlDateField
 * uses. No Date objects or locale formatting, so server and client output match.
 */

export type MemberTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
export type MemberStatus = 'active' | 'inactive' | 'suspended';

export interface Member {
  /** NL-000123 style. */
  id: string;
  name: string;
  email: string;
  tier: MemberTier;
  points: number;
  /** ISO YYYY-MM-DD. */
  joined: string;
  /** ISO YYYY-MM-DD. */
  lastActivity: string;
  status: MemberStatus;
}

export const memberTiers: MemberTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
export const memberStatuses: MemberStatus[] = ['active', 'inactive', 'suspended'];

/** Sentence-case labels for the status values. */
export const statusLabel: Record<MemberStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
};

const SEED = 20260101;
const COUNT = 120;

/** mulberry32: a small seeded generator, so the fixtures never change between builds. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const firstNames = [
  'Ada',
  'Bram',
  'Cora',
  'Dex',
  'Elin',
  'Finn',
  'Greta',
  'Hal',
  'Ines',
  'Jory',
  'Kaia',
  'Leo',
  'Mira',
  'Nico',
  'Orla',
  'Pim',
  'Quin',
  'Rhea',
  'Sami',
  'Tova',
  'Uma',
  'Vik',
  'Wren',
  'Yara',
  'Zed',
];
const lastNames = [
  'Ashdown',
  'Birchley',
  'Calloway',
  'Dunmere',
  'Elsworth',
  'Fenwick',
  'Garrow',
  'Hollins',
  'Ivers',
  'Jessop',
  'Kettle',
  'Larkspur',
  'Merrow',
  'Northam',
  'Oakes',
  'Penhallow',
  'Quarry',
  'Rowntree',
  'Stanmore',
  'Thistle',
];

const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/** Day 1 to 327 of 2026 (1 January to 23 November). */
const LAST_DAY = 327;

const pad = (value: number, length: number) => String(value).padStart(length, '0');

/** Day of the year (1-based) → ISO date in 2026. */
function isoFromDay(day: number) {
  let month = 0;
  let rest = day;
  for (let days = monthDays[month] ?? 31; rest > days; days = monthDays[month] ?? 31) {
    rest -= days;
    month += 1;
  }
  return `2026-${pad(month + 1, 2)}-${pad(rest, 2)}`;
}

/** ISO YYYY-MM-DD → DD/MM/YYYY, the display format NlDateField uses by default. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

/** Points shown with a thousands separator, without locale formatting. */
export function formatPoints(points: number) {
  return String(points).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** The list item at index, for lists that are never empty. */
function at<T>(list: readonly T[], index: number): T {
  const value = list[index];
  if (value === undefined) throw new RangeError(`No item at ${String(index)}`);
  return value;
}

function pick<T>(random: () => number, list: readonly T[]): T {
  return at(list, Math.floor(random() * list.length));
}

/** Weighted pick: each entry is [value, weight]. */
function weighted<T>(random: () => number, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = random() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll < 0) return value;
  }
  return at(entries, entries.length - 1)[0];
}

const pointsRange: Record<MemberTier, [number, number]> = {
  Bronze: [0, 2500],
  Silver: [2500, 10000],
  Gold: [10000, 40000],
  Platinum: [40000, 120000],
};

function build(): Member[] {
  const random = mulberry32(SEED);
  const used = new Set<string>();
  const members: Member[] = [];
  for (let index = 0; index < COUNT; index += 1) {
    let name = `${pick(random, firstNames)} ${pick(random, lastNames)}`;
    while (used.has(name)) name = `${pick(random, firstNames)} ${pick(random, lastNames)}`;
    used.add(name);

    const tier = weighted(random, [
      ['Bronze', 40],
      ['Silver', 30],
      ['Gold', 20],
      ['Platinum', 10],
    ] as const);
    const [low, high] = pointsRange[tier];
    const joinedDay = 1 + Math.floor(random() * (LAST_DAY - 10));
    const activityDay = joinedDay + Math.floor(random() * (LAST_DAY - joinedDay + 1));

    members.push({
      id: `NL-${pad(100 + index * 7, 6)}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      tier,
      points: low + Math.floor(random() * (high - low)),
      joined: isoFromDay(joinedDay),
      lastActivity: isoFromDay(activityDay),
      status: weighted(random, [
        ['active', 70],
        ['inactive', 20],
        ['suspended', 10],
      ] as const),
    });
  }
  return members;
}

/** The 120 fixture members, in the same order on every build. */
export const members: Member[] = build();
