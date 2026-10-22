'use client';
import { useMemo, useState } from 'react';
import { COUNTRIES, FLAGS, TIERS, Transaction, median, money } from '@/lib/data';
import { useSort } from './useSort';
import { Stat } from './HotelsTable';

export default function TransactionsTable({ rows }: { rows: Transaction[] }) {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [tier, setTier] = useState('');
  const [sourcedOnly, setSourcedOnly] = useState(false);

  const years = useMemo(() => [...new Set(rows.map((r) => r.year))].sort((a, b) => b - a), [rows]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter(
      (t) =>
        (!country || t.country === country) &&
        (!year || t.year === Number(year)) &&
        (!tier || t.tier === tier) &&
        (!sourcedOnly || !!t.url) &&
        (!s || `${t.name} ${t.location} ${t.buyer ?? ''} ${t.seller ?? ''}`.toLowerCase().includes(s)),
    );
  }, [rows, q, country, year, tier, sourcedOnly]);

  const { sorted, toggle, arrow } = useSort<Transaction>(filtered, 'year');
  const volume = filtered.reduce((a, t) => a + (t.price ?? 0), 0);
  const medPpk = median(filtered.map((t) => t.pricePerKey).filter((x): x is number => x != null));

  const cols: { key: keyof Transaction; label: string; right?: boolean }[] = [
    { key: 'name', label: 'Hotel' },
    { key: 'city', label: 'Market' },
    { key: 'year', label: 'Date' },
    { key: 'tier', label: 'Tier' },
    { key: 'rooms', label: 'Keys', right: true },
    { key: 'price', label: 'Price', right: true },
    { key: 'pricePerKey', label: '$/key', right: true },
    { key: 'buyer', label: 'Buyer' },
    { key: 'seller', label: 'Seller' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Transactions" value={filtered.length.toLocaleString()} />
        <Stat label="Disclosed volume" value={money(volume)} />
        <Stat label="Median $/key" value={money(medPpk)} />
        <Stat label="With source link" value={`${filtered.filter((t) => t.url).length}`} />
      </div>

      <div className="card grid grid-cols-1 items-end gap-3 p-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="label">Search</label>
          <input className="input" placeholder="Hotel, buyer, seller…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label className="label">Country</label>
          <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Year</label>
          <select className="input" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All years</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tier</label>
          <select className="input" value={tier} onChange={(e) => setTier(e.target.value)}>
            <option value="">All tiers</option>
            {TIERS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={sourcedOnly} onChange={(e) => setSourcedOnly(e.target.checked)} />
          Sourced only
        </label>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-navy">
            <tr>
              {cols.map((c) => (
                <th key={c.key} onClick={() => toggle(c.key)} className={`th cursor-pointer ${c.right ? 'text-right' : ''}`}>
                  {c.label}{arrow(c.key)}
                </th>
              ))}
              <th className="th">Source</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <tr key={t.id} className={`border-t border-line/60 align-top hover:bg-sky-50 ${i % 2 ? 'bg-slate-50/60' : ''}`}>
                <td className="td max-w-[260px] whitespace-normal font-semibold text-navy" title={t.notes ?? ''}>{t.name}</td>
                <td className="td text-gray-700">{FLAGS[t.country]} {t.city}</td>
                <td className="td">{t.date}</td>
                <td className="td text-gray-700">{t.tier}</td>
                <td className="td text-right">{t.rooms?.toLocaleString() ?? '—'}</td>
                <td className="td text-right font-semibold">{t.price ? money(t.price) : 'Undisclosed'}</td>
                <td className="td text-right">{money(t.pricePerKey)}</td>
                <td className="td max-w-[180px] truncate text-xs" title={t.buyer ?? ''}>{t.buyer ?? '—'}</td>
                <td className="td max-w-[180px] truncate text-xs" title={t.seller ?? ''}>{t.seller ?? '—'}</td>
                <td className="td text-xs">
                  {t.url ? (
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-navy underline">Link</a>
                  ) : (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">No source</span>
                  )}
                </td>
              </tr>
            ))}
            {!sorted.length && (
              <tr><td colSpan={cols.length + 1} className="td py-8 text-center text-gray-500">No transactions match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
