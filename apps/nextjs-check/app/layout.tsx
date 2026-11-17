import type { ReactNode } from 'react';
import '@northline/ui/index.css';

export const metadata = { title: 'Northline Next.js check' };

// Brand and theme are set only on <html> (CLAUDE.md "React and Next.js").
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-brand="northline" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
