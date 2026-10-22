'use client';
import { useMemo, useState } from 'react';
import { COUNTRIES, FLAGS, money, usd } from '@/lib/data';
import { useSort } from './useSort';

export type MarketRow = {
  key: string;
  city: string;
  state: string | null;
  country: string;
  hotels: number;
  keys: number;
  adr: number;
  txns: number;
  medPpk: number | null;
};

export default function MarketsTable({ rows }: { rows: MarketRow[] }) {
  const [country, setCountry] = useState('');
  const filtered = useMemo(() => rows.filter((r) => !country || r.country === country), [rows, country]);
  const { sorted, toggle, arrow } = useSort<MarketRow>(filtered, 'hotels');

  const cols: { key: keyof MarketRow; label: string; right?: boolean }[] = [
    { key: 'city', label: 'Market' },
    { key: 'hotels', label: 'Hotels', right: true },
    { key: 'keys', label: 'Keys', right: true },
    { key: 'adr', label: 'Avg blended ADR', right: true },
    { key: 'txns', label: 'Sales', right: true },
    { key: 'medPpk', label: 'Median sale $/key', right: true },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {['', ...COUNTRIES].map((c) => (
          <button
            key={c || 'all'}
            onClick={() => setCountry(c)}
            className={`rounded-full border px-3 py-1 text-sm font-semibold ${
              country === c ? 'border-navy bg-navy text-white' : 'border-line bg-white text-gray-700'
            }`}
          >
            {c ? `${FLAGS[c]} ${c}` : 'All'}
          </button>
        ))}
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
            {sorted.map((r, i) => (
              <tr key={r.key} className={`border-t border-line/60 hover:bg-sky-50 ${i % 2 ? 'bg-slate-50/60' : ''}`}>
                <td className="td font-semibold text-navy">
                  {FLAGS[r.country]} {r.city}{r.state ? `, ${r.state}` : ''}
                </td>
                <td className="td text-right">{r.hotels}</td>
                <td className="td text-right">{r.keys.toLocaleString()}</td>
                <td className="td text-right">{usd(r.adr)}</td>
                <td className="td text-right">{r.txns || '—'}</td>
                <td className="td text-right">{money(r.medPpk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
