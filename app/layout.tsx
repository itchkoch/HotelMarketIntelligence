import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Hotel Intelligence — Canada, USA & Mexico',
  description: 'Hotel rates, property data and transactions across Canada, the USA and Mexico.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <header className="no-print sticky top-0 z-30 bg-gradient-to-r from-navy-dark to-navy shadow-lg">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
            <div>
              <div className="text-base font-bold text-white">Hotel Intelligence</div>
              <div className="text-[11px] text-gold">Canada · USA · Mexico</div>
            </div>
            <Nav />
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6">{children}</main>
        <footer className="no-print mx-auto max-w-[1500px] px-4 pb-10 text-xs leading-relaxed text-gray-500">
          All figures in USD. Research data for preliminary investigation only, not an appraisal.
          Room rates from OTA research (Kayak, Booking.com, HotelPlanner) 2025–2026; verified hotels use Kayak.com last-12-month prices.
          <br />
          Contact: itchkochapps@gmail.com
        </footer>
      </body>
    </html>
  );
}
