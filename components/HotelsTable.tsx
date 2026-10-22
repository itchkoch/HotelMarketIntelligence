'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { COUNTRIES, FLAGS, Hotel, TIERS, money, pct, usd } from '@/lib/data';
import { useSort } from './useSort';

const PER = 50;

export default function HotelsTable({ hotels }: { hotels: Hotel[] }) {
  const [q, setQ] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [tier, setTier] = useState('');
  const [page, setPage] = useState(0);

  const cities = useMemo(
    () => [...new Set(hotels.filter((h) => !country || h.country === country).map((h) => h.city))].sort(),
    [hotels, country],
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return hotels.filter(
      (h) =>
        (!country || h.country === country) &&
        (!city || h.city === city) &&
        (!tier || h.tier === tier) &&
        (!s || `${h.name} ${h.city} ${h.brand ?? ''} ${h.owner ?? ''}`.toLowerCase().includes(s)),
    );
  }, [hotels, q, country, city, tier]);

  const { sorted, toggle, arrow } = useSort<Hotel>(filtered, 'value');
  const pages = Math.max(1, Math.ceil(sorted.length / PER));
  const rows = sorted.slice(page * PER, page * PER + PER);

  const totKeys = filtered.reduce((a, h) => a + h.keys, 0);
  const avg = (f: (h: Hotel) => number) => (filtered.length ? filtered.reduce((a, h) => a + f(h), 0) / filtered.length : 0);

  const reset = (fn: () => void) => {
    fn();
    setPage(0);
  };

  const cols: { key: keyof Hotel; label: string; right?: boolean }[] = [
    { key: 'name', label: 'Hotel' },
    { key: 'city', label: 'Market' },
    { key: 'tier', label: 'Tier' },
    { key: 'keys', label: 'Keys', right: true },
    { key: 'adr', label: 'ADR', right: true },
    { key: 'occ', label: 'Occ.', right: true },
    { key: 'revpar', label: 'RevPAR', right: true },
    { key: 'oar', label: 'Cap rate', right: true },
    { key: 'value', label: 'Est. value', right: true },
    { key: 'valuePerKey', label: 'Value / key', right: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label="Hotels" value={filtered.length.toLocaleString()} />
        <Stat label="Keys" value={totKeys.toLocaleString()} />
        <Stat label="Avg ADR" value={usd(avg((h) => h.adr))} />
        <Stat label="Avg occupancy" value={pct(avg((h) => h.occ), 1)} />
        <Stat label="Avg cap rate" value={`${avg((h) => h.oar).toFixed(2)}%`} />
      </div>

      <div className="card grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="label">Search</label>
          <input className="input" placeholder="Hotel, brand, owner…" value={q} onChange={(e) => reset(() => setQ(e.target.value))} />
        </div>
        <div>
          <label className="label">Country</label>
          <select className="input" value={country} onChange={(e) => reset(() => { setCountry(e.target.value); setCity(''); })}>
            <option value="">All countries</option>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Market</label>
          <select className="input" value={city} onChange={(e) => reset(() => setCity(e.target.value))}>
            <option value="">All markets</option>
            {cities.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Tier</label>
          <select className="input" value={tier} onChange={(e) => reset(() => setTier(e.target.value))}>
            <option value="">All tiers</option>
            {TIERS.filter((t) => hotels.some((h) => h.tier === t)).map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {rows.map((h, i) => (
              <tr key={h.id} className={`border-t border-line/60 hover:bg-sky-50 ${i % 2 ? 'bg-slate-50/60' : ''}`}>
                <td className="td max-w-[280px] truncate font-semibold">
                  <a href={`/reports/${h.slug}.pdf`} target="_blank" rel="noopener noreferrer" className="text-navy hover:underline">
                    {h.name}
                  </a>
                  {h.verified && (
                    <span title={`Verified ${h.verified}`} className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                      Verified
                    </span>
                  )}
                  <Link href={`/hotel/${h.slug}`} className="ml-1.5 text-[11px] font-normal text-gray-400 hover:text-navy" title="Web version">
                    web
                  </Link>
                </td>
                <td className="td text-gray-700">
                  {FLAGS[h.country]} {h.city}{h.state ? `, ${h.state}` : ''}
                </td>
                <td className="td text-gray-700">{h.tier}</td>
                <td className="td text-right">{h.keys.toLocaleString()}</td>
                <td className="td text-right">{usd(h.adr)}</td>
                <td className="td text-right">{pct(h.occ)}</td>
                <td className="td text-right">{usd(h.revpar)}</td>
                <td className="td text-right">{h.oar.toFixed(2)}%</td>
                <td className="td text-right font-semibold">{money(h.value)}</td>
                <td className="td text-right">{money(h.valuePerKey)}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={cols.length} className="td py-8 text-center text-gray-500">No hotels match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {sorted.length ? `${page * PER + 1}–${Math.min(sorted.length, page * PER + PER)} of ${sorted.length}` : '0 results'}
        </span>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded border border-line bg-white px-3 py-1 disabled:opacity-40">Prev</button>
          <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="rounded border border-line bg-white px-3 py-1 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-0.5 text-xl font-bold text-navy">{value}</div>
    </div>
  );
}
