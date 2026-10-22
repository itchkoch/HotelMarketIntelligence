import MarketsTable, { MarketRow } from '@/components/MarketsTable';
import { hotels, median, transactions } from '@/lib/data';
import { normCity } from '@/lib/match';

export const metadata = { title: 'Markets — Hotel Intelligence' };

function buildMarkets(): MarketRow[] {
  const map = new Map<string, MarketRow & { _adr: number[]; _ppk: number[] }>();
  for (const h of hotels) {
    const k = `${normCity(h.city)}|${h.country}`;
    if (!map.has(k)) {
      map.set(k, {
        key: k, city: h.city, state: h.state, country: h.country, hotels: 0, keys: 0,
        adr: 0, txns: 0, medPpk: null,
        _adr: [], _ppk: [],
      });
    }
    const m = map.get(k)!;
    m.hotels++;
    m.keys += h.keys;
    m._adr.push(h.adr);
  }
  for (const t of transactions) {
    const m = map.get(`${normCity(t.city)}|${t.country}`);
    if (!m) continue;
    m.txns++;
    if (t.pricePerKey) m._ppk.push(t.pricePerKey);
  }
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return [...map.values()].map(({ _adr, _ppk, ...m }) => ({
    ...m,
    adr: avg(_adr),
    medPpk: median(_ppk),
  }));
}

export default function MarketsPage() {
  const rows = buildMarkets();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Markets</h1>
        <p className="text-sm text-gray-600">
          {rows.length} markets, calculated directly from the hotel and transaction data. Average blended ADR is a
          simple average of the tracked hotels in each market. Median sale $/key comes from recorded hotel sales.
        </p>
      </div>
      <MarketsTable rows={rows} />
    </div>
  );
}
