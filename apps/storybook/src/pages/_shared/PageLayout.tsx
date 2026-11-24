import type { ReactNode } from 'react';
import { NlAppShell, NlListItem, NlPageHeader, NlSideNav } from '@northline/ui';
import { navItems, type PageHref } from './navItems';

export interface PageLayoutProps {
  /** The side nav item for this page (its href). Marks it as current. */
  active?: PageHref;
  /** The page title, shown in the page header. */
  title: string;
  /** The line under the title. */
  subtitle?: ReactNode;
  children: ReactNode;
}

/**
 * The frame every Storybook page sits in (DESIGN.md §8.6, page rules): NlAppShell with the shared Northline side
 * nav and an NlPageHeader. Pages put their content in `children`.
 */
export function PageLayout({ active, title, subtitle, children }: PageLayoutProps) {
  return (
    <NlAppShell
      skipLink
      nav={
        <NlSideNav
          items={navItems}
          currentHref={active}
          // Story-only wordmark, as on the login page. There is no logo component.
          logo={<span className="nl:text-headline-small-h6 nl:text-primary">Northline</span>}
          user={{
            name: 'Admin 01',
            email: 'admin01@example.com',
            avatar: { initials: 'A1' },
            menu: <NlListItem role="menuitem" title="Sign out" size="small" density="compact" divider={false} />,
          }}
        />
      }
      header={<NlPageHeader title={title}>{subtitle}</NlPageHeader>}
    >
      {children}
    </NlAppShell>
  );
}
