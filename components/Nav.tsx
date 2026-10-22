'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Hotels' },
  { href: '/markets', label: 'Markets' },
  { href: '/transactions', label: 'Transactions' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1">
      {LINKS.map((l) => {
        const active = l.href === '/' ? path === '/' || path.startsWith('/hotel') : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
              active ? 'bg-gold text-navy-dark' : 'text-white/85 hover:bg-white/10'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
