/**
 * Event fixtures for the Storybook pages (DESIGN.md §8.6, page rules). Invented events and places only; registered
 * members come from the member fixtures and every one is allowed by the event's lowest tier (tier fixtures).
 *
 * Every status and date check uses the fixed EVENTS_TODAY (26/11/2026), never the real date, so the stories never
 * change as time passes. Registrations are picked once at import from a fixed seed (mulberry32), so every build shows
 * the same members. Dates and times are ISO strings ('YYYY-MM-DDTHH:MM') for sorting and filtering, shown in the
 * DD/MM/YYYY format NlDateField uses.
 */
import { formatDate, members, memberTiers, type Member, type MemberTier } from './members';
import { tiers, type Tier } from './tiers';

/** The fixed "today" for every event status and date check: 26/11/2026. */
export const EVENTS_TODAY = '2026-11-26';

/** The first and last days any fixture event runs on. */
export const EVENTS_FIRST_DATE = '2026-06-01';
export const EVENTS_LAST_DATE = '2027-03-31';

export type EventType = 'track-day' | 'pit-lane-tour' | 'meetup' | 'product-launch' | 'hospitality';
export type EventStatus = 'draft' | 'upcoming' | 'live' | 'past' | 'cancelled';

export const eventTypes: EventType[] = ['track-day', 'pit-lane-tour', 'meetup', 'product-launch', 'hospitality'];
export const eventStatuses: EventStatus[] = ['upcoming', 'live', 'past', 'draft', 'cancelled'];

export const eventTypeLabel: Record<EventType, string> = {
  'track-day': 'Track day',
  'pit-lane-tour': 'Pit lane tour',
  meetup: "Members' meetup",
  'product-launch': 'Product launch',
  hospitality: 'Hospitality',
};

export const eventStatusLabel: Record<EventStatus, string> = {
  draft: 'Draft',
  upcoming: 'Upcoming',
  live: 'Live',
  past: 'Past',
  cancelled: 'Cancelled',
};

export interface Registration {
  memberId: string;
  /** ISO YYYY-MM-DD, never after EVENTS_TODAY or the event's start. */
  registered: string;
}

export interface NlEvent {
  /** EV-0042 style. */
  id: string;
  name: string;
  type: EventType;
  /** ISO 'YYYY-MM-DDTHH:MM'. */
  start: string;
  /** ISO 'YYYY-MM-DDTHH:MM'. */
  end: string;
  location: string;
  capacity: number;
  /** Registered members, earliest registration first. */
  registrations: Registration[];
  waitlist: number;
  /** The lowest tier allowed, an id from the tier fixtures. */
  lowestTierId: string;
  status: EventStatus;
}

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

const SEED = 20261126;
const DAY = 86_400_000;

const dayNumber = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / DAY;
const isoFromDayNumber = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);

interface EventSeed {
  id: string;
  name: string;
  type: EventType;
  start: string;
  end: string;
  location: string;
  capacity: number;
  /** Share of the capacity registered, 0 to 1; 1 is full. */
  fill: number;
  waitlist?: number;
  lowest: MemberTier;
  /** Set for drafts and cancelled events; the rest get their status from the dates. */
  status?: 'draft' | 'cancelled';
}

const hub = 'Northline Hub, Hall A';
const hubB = 'Northline Hub, Hall B';
const track = 'Westmoor Test Track';
const pits = 'Westmoor pit lane';
const suite = 'Westmoor grandstand';

const seeds: EventSeed[] = [
  // Past
  {
    id: 'EV-0031',
    name: 'Summer track day',
    type: 'track-day',
    start: '2026-06-13T09:00',
    end: '2026-06-13T17:00',
    location: track,
    capacity: 40,
    fill: 1,
    lowest: 'Silver',
  },
  {
    id: 'EV-0032',
    name: 'Pit lane tour, June',
    type: 'pit-lane-tour',
    start: '2026-06-20T10:00',
    end: '2026-06-20T12:00',
    location: pits,
    capacity: 24,
    fill: 0.92,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0033',
    name: "Members' summer meetup",
    type: 'meetup',
    start: '2026-07-04T18:00',
    end: '2026-07-04T21:00',
    location: hubB,
    capacity: 120,
    fill: 0.78,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0034',
    name: 'Coupe range launch',
    type: 'product-launch',
    start: '2026-07-16T19:00',
    end: '2026-07-16T22:00',
    location: hub,
    capacity: 200,
    fill: 1,
    lowest: 'Silver',
  },
  {
    id: 'EV-0035',
    name: 'Grandstand hospitality day',
    type: 'hospitality',
    start: '2026-08-08T11:00',
    end: '2026-08-08T18:00',
    location: suite,
    capacity: 60,
    fill: 0.85,
    lowest: 'Gold',
  },
  {
    id: 'EV-0036',
    name: 'Late summer track day',
    type: 'track-day',
    start: '2026-08-22T09:00',
    end: '2026-08-22T17:00',
    location: track,
    capacity: 40,
    fill: 1,
    waitlist: 6,
    lowest: 'Gold',
  },
  {
    id: 'EV-0037',
    name: 'Pit lane tour, September',
    type: 'pit-lane-tour',
    start: '2026-09-12T10:00',
    end: '2026-09-12T12:00',
    location: pits,
    capacity: 24,
    fill: 0.75,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0038',
    name: "Members' autumn meetup",
    type: 'meetup',
    start: '2026-09-26T18:00',
    end: '2026-09-26T21:00',
    location: 'Harbourside Pavilion',
    capacity: 120,
    fill: 0.62,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0039',
    name: 'Coastal drive meetup',
    type: 'meetup',
    start: '2026-10-03T09:30',
    end: '2026-10-03T15:00',
    location: 'Linden Quay Marina',
    capacity: 80,
    fill: 0.4,
    lowest: 'Silver',
    status: 'cancelled',
  },
  {
    id: 'EV-0040',
    name: 'Autumn track day',
    type: 'track-day',
    start: '2026-10-17T09:00',
    end: '2026-10-17T17:00',
    location: track,
    capacity: 40,
    fill: 1,
    lowest: 'Silver',
  },
  {
    id: 'EV-0041',
    name: 'Platinum dinner',
    type: 'hospitality',
    start: '2026-10-30T19:00',
    end: '2026-10-30T23:00',
    location: 'Ashcombe House',
    capacity: 48,
    fill: 0.9,
    lowest: 'Platinum',
  },
  {
    id: 'EV-0042',
    name: 'Pit lane tour, November',
    type: 'pit-lane-tour',
    start: '2026-11-14T10:00',
    end: '2026-11-14T12:00',
    location: pits,
    capacity: 24,
    fill: 1,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0043',
    name: 'Accessories launch',
    type: 'product-launch',
    start: '2026-11-20T18:00',
    end: '2026-11-20T21:00',
    location: hub,
    capacity: 150,
    fill: 0.7,
    lowest: 'Bronze',
  },
  // Live on 26/11/2026
  {
    id: 'EV-0044',
    name: "Members' winter meetup",
    type: 'meetup',
    start: '2026-11-26T17:00',
    end: '2026-11-26T21:00',
    location: hubB,
    capacity: 120,
    fill: 0.7,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0045',
    name: 'Endurance weekend',
    type: 'hospitality',
    start: '2026-11-25T10:00',
    end: '2026-11-27T18:00',
    location: suite,
    capacity: 60,
    fill: 1,
    lowest: 'Gold',
  },
  // Upcoming
  {
    id: 'EV-0046',
    name: 'Pit lane tour, December',
    type: 'pit-lane-tour',
    start: '2026-12-05T10:00',
    end: '2026-12-05T12:00',
    location: pits,
    capacity: 24,
    fill: 1,
    waitlist: 9,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0047',
    name: 'Winter track day',
    type: 'track-day',
    start: '2026-12-12T08:30',
    end: '2026-12-12T16:30',
    location: track,
    capacity: 40,
    fill: 1,
    waitlist: 14,
    lowest: 'Silver',
  },
  {
    id: 'EV-0048',
    name: 'Festive lunch',
    type: 'hospitality',
    start: '2026-12-18T12:00',
    end: '2026-12-18T16:00',
    location: 'Ashcombe House',
    capacity: 60,
    fill: 0.55,
    lowest: 'Gold',
  },
  {
    id: 'EV-0049',
    name: 'New year meetup',
    type: 'meetup',
    start: '2027-01-09T18:00',
    end: '2027-01-09T21:00',
    location: 'Harbourside Pavilion',
    capacity: 120,
    fill: 0.3,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0050',
    name: 'Ice driving track day',
    type: 'track-day',
    start: '2027-01-23T09:00',
    end: '2027-01-23T16:00',
    location: 'Westmoor skid pan',
    capacity: 32,
    fill: 0.81,
    lowest: 'Gold',
  },
  {
    id: 'EV-0051',
    name: 'Pit lane tour, January',
    type: 'pit-lane-tour',
    start: '2027-01-30T10:00',
    end: '2027-01-30T12:00',
    location: pits,
    capacity: 24,
    fill: 0.5,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0052',
    name: 'Saloon range launch',
    type: 'product-launch',
    start: '2027-02-11T19:00',
    end: '2027-02-11T22:00',
    location: hub,
    capacity: 200,
    fill: 0.42,
    lowest: 'Silver',
  },
  {
    id: 'EV-0053',
    name: 'Platinum winter retreat',
    type: 'hospitality',
    start: '2027-02-19T15:00',
    end: '2027-02-21T11:00',
    location: 'Fernhollow Lodge',
    capacity: 36,
    fill: 1,
    lowest: 'Platinum',
  },
  {
    id: 'EV-0054',
    name: 'Spring track day',
    type: 'track-day',
    start: '2027-03-06T09:00',
    end: '2027-03-06T17:00',
    location: track,
    capacity: 40,
    fill: 0.35,
    lowest: 'Silver',
  },
  {
    id: 'EV-0055',
    name: 'Pit lane tour, March',
    type: 'pit-lane-tour',
    start: '2027-03-13T10:00',
    end: '2027-03-13T12:00',
    location: pits,
    capacity: 24,
    fill: 0.17,
    lowest: 'Bronze',
  },
  {
    id: 'EV-0056',
    name: "Members' spring meetup",
    type: 'meetup',
    start: '2027-03-27T18:00',
    end: '2027-03-27T21:00',
    location: hubB,
    capacity: 120,
    fill: 0.12,
    lowest: 'Bronze',
  },
  // Cancelled before it ran
  {
    id: 'EV-0057',
    name: 'Night track session',
    type: 'track-day',
    start: '2026-12-19T17:00',
    end: '2026-12-19T21:00',
    location: track,
    capacity: 30,
    fill: 0.6,
    lowest: 'Gold',
    status: 'cancelled',
  },
  // Drafts
  {
    id: 'EV-0058',
    name: 'Electric range preview',
    type: 'product-launch',
    start: '2027-03-18T18:00',
    end: '2027-03-18T21:00',
    location: hub,
    capacity: 180,
    fill: 0,
    lowest: 'Bronze',
    status: 'draft',
  },
  {
    id: 'EV-0059',
    name: 'Driver coaching track day',
    type: 'track-day',
    start: '2027-02-27T09:00',
    end: '2027-02-27T16:00',
    location: track,
    capacity: 24,
    fill: 0,
    lowest: 'Silver',
    status: 'draft',
  },
  {
    id: 'EV-0060',
    name: 'Spring hospitality day',
    type: 'hospitality',
    start: '2027-03-20T11:00',
    end: '2027-03-20T18:00',
    location: suite,
    capacity: 60,
    fill: 0,
    lowest: 'Gold',
    status: 'draft',
  },
];

/** The status from the dates against EVENTS_TODAY, unless the event is a draft or cancelled. */
function statusOf(seed: EventSeed): EventStatus {
  if (seed.status) return seed.status;
  const startDay = seed.start.slice(0, 10);
  const endDay = seed.end.slice(0, 10);
  if (endDay < EVENTS_TODAY) return 'past';
  if (startDay > EVENTS_TODAY) return 'upcoming';
  return 'live';
}

const tierRank = (tier: MemberTier) => memberTiers.indexOf(tier);

/** Active members allowed by each lowest tier. */
const allowedBy = (lowest: MemberTier): Member[] =>
  members.filter((member) => member.status === 'active' && tierRank(member.tier) >= tierRank(lowest));

function build(): NlEvent[] {
  const random = mulberry32(SEED);
  return seeds.map((seed) => {
    const lowestTier = tiers.find((tier) => tier.memberTier === seed.lowest);
    if (!lowestTier) throw new RangeError(`No tier ${seed.lowest}`);
    const count = Math.round(seed.capacity * seed.fill);
    const pool = allowedBy(seed.lowest);
    // Registration opens 75 days before the start; nobody registers after "today" or on the day itself.
    const lastDay = Math.min(dayNumber(seed.start) - 1, dayNumber(EVENTS_TODAY));
    const firstDay = Math.min(dayNumber(seed.start) - 75, lastDay);
    const chosen = new Set<number>();
    const registrations: Registration[] = [];
    while (registrations.length < count) {
      const index = Math.floor(random() * pool.length);
      if (chosen.has(index)) continue;
      chosen.add(index);
      const member = pool[index];
      if (!member) continue;
      // Leans towards the first weeks, as registrations usually do.
      const day = firstDay + Math.floor((lastDay - firstDay + 1) * random() ** 1.6);
      registrations.push({ memberId: member.id, registered: isoFromDayNumber(day) });
    }
    registrations.sort((a, b) => a.registered.localeCompare(b.registered) || a.memberId.localeCompare(b.memberId));
    return {
      id: seed.id,
      name: seed.name,
      type: seed.type,
      start: seed.start,
      end: seed.end,
      location: seed.location,
      capacity: seed.capacity,
      registrations,
      waitlist: seed.waitlist ?? 0,
      lowestTierId: lowestTier.id,
      status: statusOf(seed),
    };
  });
}

/** The 30 fixture events, in the same order on every build. */
export const events: NlEvent[] = build();

const memberById = new Map(members.map((member) => [member.id, member]));

/** The member for a registration. */
export const memberOf = (id: string) => memberById.get(id);

/** The event's lowest allowed tier, from the tier fixtures. */
export function lowestTierOf(event: NlEvent): Tier {
  const tier = tiers.find((item) => item.id === event.lowestTierId);
  if (!tier) throw new RangeError(`No tier ${event.lowestTierId}`);
  return tier;
}

/** "Gold and above". */
export const tierAccessLabel = (event: NlEvent) => `${lowestTierOf(event).name} and above`;

export const isFull = (event: NlEvent) => event.registrations.length >= event.capacity;

/** "84 / 120". */
export const registeredLabel = (event: NlEvent) => `${String(event.registrations.length)} / ${String(event.capacity)}`;

/** Registered as a percent of the capacity, for NlProgressBar. */
export const registeredPercent = (event: NlEvent) =>
  event.capacity === 0 ? 0 : Math.round((event.registrations.length / event.capacity) * 100);

/**
 * The date and the start and end times for a one-day event (DD/MM/YYYY, then both times); across days, the start
 * date and time to the end date and time. No locale formatting.
 */
export function formatEventWhen(event: NlEvent) {
  const [startDay = '', startTime = ''] = event.start.split('T');
  const [endDay = '', endTime = ''] = event.end.split('T');
  if (startDay === endDay) return `${formatDate(startDay)}, ${startTime} to ${endTime}`;
  return `${formatDate(startDay)}, ${startTime} to ${formatDate(endDay)}, ${endTime}`;
}

/** The start date and time only, for the table, where the full range doesn't fit at 1440. */
export function formatEventStart(event: NlEvent) {
  const [startDay = '', startTime = ''] = event.start.split('T');
  return `${formatDate(startDay)}, ${startTime}`;
}
