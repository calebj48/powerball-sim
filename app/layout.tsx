// Root layout with DrawingsProvider

import type { Metadata } from 'next';
import './globals.css';
import { DrawingsProvider } from '@/context/DrawingsContext';

export const metadata: Metadata = {
  title: 'Powerball Simulator',
  description: 'Experience the futility of the lottery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <DrawingsProvider>
          <div className="relative z-10">
            {children}
          </div>
        </DrawingsProvider>
      </body>
    </html>
  );
}
