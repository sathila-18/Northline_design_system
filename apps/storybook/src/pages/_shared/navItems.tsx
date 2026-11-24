import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { linkTo } from '@storybook/addon-links';
import type { NlSideNavItem } from '@northline/ui';

/** Every page the side nav knows, by its href. Pages that aren't built yet open their Coming soon story. */
export type PageHref =
  '#dashboard' | '#members' | '#rewards' | '#track-voucher' | '#tiers' | '#events' | '#messages' | '#help';

const comingSoon = 'Pages/Coming soon';

/** Storybook title and story name for each page. Change a row here when its page is built. */
export const pageStories: Record<PageHref, readonly [title: string, story: string]> = {
  '#dashboard': [comingSoon, 'Dashboard'],
  '#members': ['Pages/Members/Member list', 'Default'],
  '#rewards': [comingSoon, 'All rewards'],
  '#track-voucher': [comingSoon, 'Track voucher'],
  '#tiers': [comingSoon, 'Tiers'],
  '#events': [comingSoon, 'Events'],
  '#messages': [comingSoon, 'Messages'],
  '#help': [comingSoon, 'Help'],
};

/** Opens a page's story in Storybook. */
export function goTo(href: PageHref) {
  const [title, story] = pageStories[href];
  linkTo(title, story)();
}

/**
 * The element side nav links render as (NlSideNav's `as`). A real link with the page's href, so it stays a link
 * for keyboard and screen readers; a click opens the page's story instead of following the hash.
 */
export function StoryLink({ href, onClick, ...rest }: ComponentPropsWithRef<'a'>) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !href || !(href in pageStories)) return;
    event.preventDefault();
    goTo(href as PageHref);
  };
  return <a href={href} onClick={handleClick} {...rest} />;
}

/** The Northline side nav sections, shared by every page. */
export const navItems: NlSideNavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '#dashboard', as: StoryLink },
  { icon: 'person', label: 'Members', href: '#members', as: StoryLink },
  {
    icon: 'redeem',
    label: 'Rewards',
    pages: [
      { label: 'All rewards', href: '#rewards', as: StoryLink },
      { label: 'Track voucher', href: '#track-voucher', as: StoryLink },
      { label: 'Tiers', href: '#tiers', as: StoryLink },
    ],
  },
  { icon: 'event', label: 'Events', href: '#events', as: StoryLink },
  { icon: 'mail', label: 'Messages', href: '#messages', as: StoryLink },
  { icon: 'help', label: 'Help', href: '#help', as: StoryLink },
];
