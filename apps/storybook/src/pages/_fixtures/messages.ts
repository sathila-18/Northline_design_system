/**
 * Message fixtures for the Storybook pages (DESIGN.md §8.6, page rules): the campaigns a car brand's loyalty team
 * sends to its members (product brief). Invented names and text only.
 *
 * Every date check uses the events fixture's fixed today (EVENTS_TODAY, 26/11/2026). Audience sizes are counted from
 * the member fixtures (and the event fixtures for event audiences), never typed by hand. Delivery, open and click
 * counts come from a fixed seed (mulberry32), so every build shows the same numbers.
 */
import { EVENTS_TODAY, events } from './events';
import { formatDate, members, memberTiers, type Member, type MemberTier } from './members';
import { tiers } from './tiers';

export type MessageChannel = 'email' | 'push' | 'sms' | 'in-app';
export type MessageStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

export const messageChannels: MessageChannel[] = ['email', 'push', 'sms', 'in-app'];

export const channelLabel: Record<MessageChannel, string> = {
  email: 'Email',
  push: 'Push',
  sms: 'SMS',
  'in-app': 'In-app',
};

export const messageStatusLabel: Record<MessageStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  sending: 'Sending',
  sent: 'Sent',
  failed: 'Failed',
};

/** Who a campaign goes to. */
export type Audience =
  | { kind: 'all' }
  | { kind: 'tier'; tierId: string }
  | { kind: 'inactive' }
  | { kind: 'event'; eventId: string }
  | { kind: 'new' };

export interface MessageResults {
  delivered: number;
  /** Email only; null where the channel doesn't track opens. */
  opened: number | null;
  /** Null where the channel doesn't track clicks (SMS). */
  clicked: number | null;
}

export interface Message {
  /** MS-0018 style. */
  id: string;
  name: string;
  channel: MessageChannel;
  audience: Audience;
  /** Counted from the member fixtures at the send date. */
  audienceSize: number;
  /** ISO 'YYYY-MM-DDTHH:MM'. Drafts keep their planned date. */
  sendAt: string;
  status: MessageStatus;
  subject: string;
  body: string;
  /** Sent campaigns only. */
  results?: MessageResults;
  /** Failed campaigns only. */
  failureReason?: string;
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

const DAY = 86_400_000;
const dayNumber = (iso: string) => Date.parse(`${iso.slice(0, 10)}T00:00:00Z`) / DAY;
const isoFromDayNumber = (day: number) => new Date(day * DAY).toISOString().slice(0, 10);

const tierRank = (tier: MemberTier) => memberTiers.indexOf(tier);
const tierById = (id: string) => {
  const tier = tiers.find((item) => item.id === id);
  if (!tier) throw new RangeError(`No tier ${id}`);
  return tier;
};
const eventById = (id: string) => {
  const event = events.find((item) => item.id === id);
  if (!event) throw new RangeError(`No event ${id}`);
  return event;
};

/** Members who can receive messages on a day: joined by then and not suspended. */
const reachable = (day: string) => members.filter((m: Member) => m.status !== 'suspended' && m.joined <= day);

/** The audience's size on the send date, from the member and event fixtures. */
function sizeOf(audience: Audience, sendAt: string): number {
  const day = sendAt.slice(0, 10);
  switch (audience.kind) {
    case 'all':
      return reachable(day).length;
    case 'tier': {
      const rank = tierRank(tierById(audience.tierId).memberTier);
      return reachable(day).filter((m) => tierRank(m.tier) >= rank).length;
    }
    case 'inactive': {
      // No activity in the 90 days before the send date.
      const cutoff = isoFromDayNumber(dayNumber(day) - 90);
      return reachable(day).filter((m) => m.lastActivity < cutoff).length;
    }
    case 'event':
      return eventById(audience.eventId).registrations.length;
    case 'new':
      return reachable(day).filter((m) => m.joined.slice(0, 7) === day.slice(0, 7)).length;
  }
}

/** "Gold and above", "Registered: Winter track day". */
export function audienceLabel(audience: Audience): string {
  switch (audience.kind) {
    case 'all':
      return 'All members';
    case 'tier':
      return `${tierById(audience.tierId).name} and above`;
    case 'inactive':
      return 'Inactive for 90 days';
    case 'event':
      return `Registered: ${eventById(audience.eventId).name}`;
    case 'new':
      return 'New members this month';
  }
}

interface MessageSeed {
  id: string;
  name: string;
  channel: MessageChannel;
  audience: Audience;
  sendAt: string;
  /** Set for drafts and failed campaigns; the rest get their status from the send date. */
  status?: 'draft' | 'failed';
  subject: string;
  body: string;
  failureReason?: string;
}

const all: Audience = { kind: 'all' };
const inactive: Audience = { kind: 'inactive' };
const fresh: Audience = { kind: 'new' };
const tier = (tierId: string): Audience => ({ kind: 'tier', tierId });
const event = (eventId: string): Audience => ({ kind: 'event', eventId });

const seeds: MessageSeed[] = [
  {
    id: 'MS-0012',
    name: 'Summer service reminder',
    channel: 'email',
    audience: all,
    sendAt: '2026-06-03T09:00',
    subject: 'Is your car ready for summer?',
    body: 'Book a summer check at any brand service centre before 30 June. Every service earns double points this month, and the check takes under an hour.',
  },
  {
    id: 'MS-0013',
    name: 'Track day bookings open',
    channel: 'email',
    audience: tier('tier-silver'),
    sendAt: '2026-06-10T10:00',
    subject: 'Summer track day: bookings are open',
    body: 'Spend a day on the Westmoor Test Track with our driving coaches. Places go fast, so book with your points now.',
  },
  {
    id: 'MS-0014',
    name: 'Pit lane tour reminder',
    channel: 'sms',
    audience: event('EV-0032'),
    sendAt: '2026-06-18T12:00',
    subject: 'Pit lane tour on Saturday',
    body: 'Your pit lane tour starts at 10am on Saturday. Please arrive 15 minutes early and bring your membership card.',
  },
  {
    id: 'MS-0015',
    name: 'Welcome to Gold',
    channel: 'email',
    audience: tier('tier-gold'),
    sendAt: '2026-06-18T08:30',
    subject: 'You have reached Gold',
    body: 'Thank you for driving with us. As a Gold member you now earn 1.5 points per point, get early access to events and save on track days.',
  },
  {
    id: 'MS-0016',
    name: 'Double points weekend',
    channel: 'push',
    audience: all,
    sendAt: '2026-06-26T17:00',
    subject: 'Double points this weekend',
    body: 'Earn double points on accessories and at partner stations until Sunday night. No sign-up needed.',
  },
  {
    id: 'MS-0017',
    name: 'Coupe launch invitation',
    channel: 'email',
    audience: tier('tier-silver'),
    sendAt: '2026-07-01T09:00',
    subject: 'Be first to see the new coupe range',
    body: 'Join us at Northline Hub on 16 July for an evening with the new coupe range. Silver members and above can bring a guest.',
  },
  {
    id: 'MS-0018',
    name: 'We miss you',
    channel: 'email',
    audience: inactive,
    sendAt: '2026-07-08T10:00',
    subject: 'Your points are waiting',
    body: 'It has been a while since your last visit. Your points are still here, and your next service earns 500 bonus points.',
  },
  {
    id: 'MS-0019',
    name: 'First points for new members',
    channel: 'in-app',
    audience: fresh,
    sendAt: '2026-07-15T11:00',
    subject: 'Earn your first 500 points',
    body: 'Add your car and book your first service in the app to earn 500 points. You can spend them on rewards straight away.',
  },
  {
    id: 'MS-0020',
    name: 'Track day: what to bring',
    channel: 'sms',
    audience: event('EV-0036'),
    sendAt: '2026-08-21T09:00',
    subject: 'Your track day is tomorrow',
    body: 'Check-in opens at 8am at Westmoor Test Track. Bring your driving licence, and wear flat shoes and long sleeves.',
  },
  {
    id: 'MS-0021',
    name: 'Accessories weekend',
    channel: 'push',
    audience: all,
    sendAt: '2026-08-14T16:00',
    status: 'failed',
    subject: 'Triple points on accessories',
    body: 'This weekend only, accessories earn triple points online and in store. Roof boxes, mats and chargers included.',
    failureReason: 'The push service rejected the send because the app key had expired. No members received it.',
  },
  {
    id: 'MS-0022',
    name: 'Autumn service check',
    channel: 'email',
    audience: all,
    sendAt: '2026-09-02T09:00',
    subject: 'Get your car ready for autumn',
    body: 'Lights, wipers and tyres matter more as the days get shorter. Book an autumn check and earn double points on the visit.',
  },
  {
    id: 'MS-0023',
    name: 'Partner station bonus',
    channel: 'push',
    audience: all,
    sendAt: '2026-09-17T07:30',
    subject: 'Double points at partner stations',
    body: 'Fuel up or charge at any partner station this week and earn double points. Show your membership card at the till or in the app.',
  },
  {
    id: 'MS-0024',
    name: 'Platinum dinner invitation',
    channel: 'email',
    audience: tier('tier-platinum'),
    sendAt: '2026-10-05T10:00',
    subject: 'An evening for Platinum members',
    body: 'You are invited to our Platinum dinner at Ashcombe House on 30 October. Places are limited, so please reply by 20 October.',
  },
  {
    id: 'MS-0025',
    name: 'Points about to expire',
    channel: 'email',
    audience: inactive,
    sendAt: '2026-10-12T09:00',
    subject: 'Some of your points expire soon',
    body: 'Points you earned last year expire at the end of the month. Spend them on a reward or a service before then.',
  },
  {
    id: 'MS-0026',
    name: 'Winter tyre check',
    channel: 'sms',
    audience: tier('tier-gold'),
    sendAt: '2026-10-28T08:00',
    status: 'failed',
    subject: 'Free winter tyre check',
    body: 'Gold members get a free winter tyre check until 15 December. Reply BOOK and we will call you to arrange it.',
    failureReason: 'The SMS provider has not approved the sender name yet. No messages went out.',
  },
  {
    id: 'MS-0027',
    name: 'Welcome to the programme',
    channel: 'in-app',
    audience: fresh,
    sendAt: '2026-11-23T10:00',
    subject: 'Welcome to the programme',
    body: 'Thanks for joining. Earn points every time you service your car, buy accessories or come to an event, and spend them on rewards.',
  },
  {
    id: 'MS-0028',
    name: 'Winter service reminder',
    channel: 'email',
    audience: all,
    sendAt: '2026-11-18T09:00',
    subject: 'Book your winter service',
    body: 'Cold mornings are hard on batteries and tyres. Book a winter service before Christmas and earn double points on the visit.',
  },
  {
    id: 'MS-0029',
    name: 'Accessories weekend',
    channel: 'push',
    audience: all,
    sendAt: '2026-11-21T08:00',
    subject: 'Triple points on accessories',
    body: 'This weekend only, accessories earn triple points online and in store. Winter mats and roof boxes included.',
  },
  {
    id: 'MS-0030',
    name: 'Meetup tonight',
    channel: 'push',
    audience: event('EV-0044'),
    sendAt: '2026-11-26T09:00',
    subject: 'See you tonight at Northline Hub',
    body: 'The winter meetup starts at 5pm in Hall B. Bring your car for the photo wall and collect 200 points at the door.',
  },
  {
    id: 'MS-0031',
    name: 'Track day final details',
    channel: 'email',
    audience: event('EV-0047'),
    sendAt: '2026-12-08T10:00',
    subject: 'Your winter track day on 12 December',
    body: 'Check-in opens at 8am at Westmoor Test Track. Helmets are provided, and your instructor will meet you in the pit lane.',
  },
  {
    id: 'MS-0032',
    name: 'Double points weekend',
    channel: 'push',
    audience: all,
    sendAt: '2026-12-11T17:00',
    subject: 'Double points this weekend',
    body: 'Earn double points on services, accessories and at partner stations until Sunday night. No sign-up needed.',
  },
  {
    id: 'MS-0033',
    name: 'Festive lunch reminder',
    channel: 'sms',
    audience: event('EV-0048'),
    sendAt: '2026-12-16T09:00',
    subject: 'Festive lunch on Friday',
    body: 'Lunch is served at noon at Ashcombe House on Friday. Please tell us about any dietary needs by Wednesday.',
  },
  {
    id: 'MS-0034',
    name: 'New year meetup',
    channel: 'email',
    audience: all,
    sendAt: '2027-01-04T10:00',
    subject: 'Start the year with fellow owners',
    body: 'Join us at Harbourside Pavilion on 9 January for our new year meetup. Bring your car, meet the team and earn 200 points for coming.',
  },
  {
    id: 'MS-0035',
    name: 'Ice driving bookings open',
    channel: 'email',
    audience: tier('tier-gold'),
    sendAt: '2027-01-08T09:00',
    status: 'draft',
    subject: 'Learn to drive on ice',
    body: 'Our ice driving day on 23 January teaches car control on the skid pan. Gold members and above can book with points.',
  },
  {
    id: 'MS-0036',
    name: 'Welcome to Platinum',
    channel: 'in-app',
    audience: tier('tier-platinum'),
    sendAt: '2027-01-12T10:00',
    status: 'draft',
    subject: 'You have reached Platinum',
    body: 'You now earn double points, have lounge access at events and a yearly pit lane tour. Thank you for being one of our most loyal owners.',
  },
  {
    id: 'MS-0037',
    name: 'Saloon range: save the date',
    channel: 'email',
    audience: tier('tier-silver'),
    sendAt: '2027-01-20T10:00',
    status: 'draft',
    subject: 'Save the date: the new saloon range',
    body: 'We launch the new saloon range at Northline Hub on 11 February. Silver members and above will get their invitation soon.',
  },
];

/** Sent before today, sending on today, scheduled after; drafts and failures are set by hand. */
function statusOf(seed: MessageSeed): MessageStatus {
  if (seed.status) return seed.status;
  const day = seed.sendAt.slice(0, 10);
  if (day < EVENTS_TODAY) return 'sent';
  if (day === EVENTS_TODAY) return 'sending';
  return 'scheduled';
}

/** Share between low and high. */
const share = (random: () => number, low: number, high: number) => low + random() * (high - low);

/** Delivery, opens and clicks per channel: email opens 20 to 45%, clicks well below; push and in-app clicks only. */
function resultsFor(random: () => number, channel: MessageChannel, size: number): MessageResults {
  const delivery: Record<MessageChannel, [number, number]> = {
    email: [0.95, 0.99],
    push: [0.7, 0.86],
    sms: [0.96, 0.995],
    'in-app': [0.5, 0.68],
  };
  const [low, high] = delivery[channel];
  const delivered = Math.round(size * share(random, low, high));
  switch (channel) {
    case 'email': {
      const opened = Math.round(delivered * share(random, 0.2, 0.45));
      return { delivered, opened, clicked: Math.round(opened * share(random, 0.08, 0.22)) };
    }
    case 'push':
      return { delivered, opened: null, clicked: Math.round(delivered * share(random, 0.03, 0.09)) };
    case 'in-app':
      return { delivered, opened: null, clicked: Math.round(delivered * share(random, 0.06, 0.15)) };
    case 'sms':
      return { delivered, opened: null, clicked: null };
  }
}

function build(): Message[] {
  const random = mulberry32(20261127);
  return seeds.map((seed) => {
    const status = statusOf(seed);
    const audienceSize = sizeOf(seed.audience, seed.sendAt);
    const message: Message = {
      id: seed.id,
      name: seed.name,
      channel: seed.channel,
      audience: seed.audience,
      audienceSize,
      sendAt: seed.sendAt,
      status,
      subject: seed.subject,
      body: seed.body,
    };
    if (status === 'sent') message.results = resultsFor(random, seed.channel, audienceSize);
    if (status === 'failed') message.failureReason = seed.failureReason;
    return message;
  });
}

/** The 26 fixture campaigns, in the same order on every build. */
export const messages: Message[] = build();

/** A count with a thousands separator, without locale formatting. */
export const formatCount = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** A share of a whole as a percentage with one decimal place, without locale formatting. */
export const formatRate = (part: number, whole: number) =>
  whole === 0 ? '0%' : `${String(Math.round((part / whole) * 1000) / 10)}%`;

/** "Gold and above, 758". */
export const audienceWithSize = (message: Message) =>
  `${audienceLabel(message.audience)}, ${formatCount(message.audienceSize)}`;

/** The send date, DD/MM/YYYY. */
export const formatSendDate = (message: Message) => formatDate(message.sendAt.slice(0, 10));

/** The send date and time: the date (DD/MM/YYYY), a comma, then the time. */
export const formatSendAt = (message: Message) =>
  `${formatDate(message.sendAt.slice(0, 10))}, ${message.sendAt.slice(11)}`;
