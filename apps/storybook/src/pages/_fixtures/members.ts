/**
 * Member fixtures for the Storybook pages (DESIGN.md §8.6, page rules). Invented people only: names are drawn from
 * generic first and last names, emails are on example.com, and IDs follow NL-000123.
 *
 * Built once at import from a fixed seed (mulberry32), so every build shows the same 2,480 members. Join and activity
 * dates run from 1 Jan 2023 to 23 Nov 2026 (fixed UTC date arithmetic, no locale formatting), kept as ISO strings for
 * sorting and filtering and shown in the DD/MM/YYYY format NlDateField uses.
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
const COUNT = 2480;

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
  'Arlo',
  'Bea',
  'Cass',
  'Dora',
  'Emil',
  'Fen',
  'Gus',
  'Hedda',
  'Ivo',
  'Juno',
  'Kit',
  'Lenna',
  'Mott',
  'Nell',
  'Odo',
  'Peri',
  'Rook',
  'Saffi',
  'Tam',
  'Ulla',
  'Vesna',
  'Wim',
  'Xan',
  'Yves',
  'Zola',
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
  'Alderby',
  'Brackwell',
  'Coldharbour',
  'Dewhurst',
  'Edgecombe',
  'Fallowfield',
  'Greystoke',
  'Hartwell',
  'Inglebank',
  'Juniper',
  'Kestrel',
  'Lowmoor',
  'Marchbank',
  'Nettlefold',
  'Ormsby',
  'Pellow',
  'Quenby',
  'Redfern',
  'Saltmarsh',
  'Tenby',
  'Underhill',
  'Vantage',
  'Westerby',
  'Yarrow',
  'Brimble',
  'Copperfield',
  'Driftwood',
  'Elderwood',
  'Foxley',
  'Glenrose',
  'Hawthorne',
  'Ivywood',
  'Kingsmere',
  'Linfield',
  'Moorcroft',
  'Nightingale',
  'Oxley',
  'Pinewood',
  'Rushmere',
  'Sandyford',
];

const pad = (value: number, length: number) => String(value).padStart(length, '0');

/** The programme's first day and the fixtures' "today": 1 January 2023 to 23 November 2026. */
const FIRST_DAY = Date.UTC(2023, 0, 1);
const DAY = 86_400_000;
export const LAST_DATE = '2026-11-23';
const DAYS = Math.round((Date.UTC(2026, 10, 23) - FIRST_DAY) / DAY);

/** Days after 1 January 2023 → ISO date. Fixed UTC arithmetic, so the same on every machine and build. */
function isoFromDay(day: number) {
  return new Date(FIRST_DAY + day * DAY).toISOString().slice(0, 10);
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
    // More members join as the programme grows (a square-root curve); activity leans towards recent days.
    const joinedDay = Math.floor(DAYS * Math.sqrt(random()));
    const activityDay = joinedDay + Math.floor((DAYS - joinedDay) * (1 - random() ** 3));

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

/** The 2,480 fixture members, in the same order on every build. */
export const members: Member[] = build();
