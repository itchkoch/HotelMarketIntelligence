import MarketsTable, { MarketRow } from '@/components/MarketsTable';
import { hotels, median, transactions } from '@/lib/data';
import { normCity } from '@/lib/match';

export const metadata = { title: 'Markets — Hotel Intelligence' };

function buildMarkets(): MarketRow[] {
  const map = new Map<string, MarketRow & { _adr: number[]; _occ: number[]; _rev: number[]; _oar: number[]; _ppk: number[] }>();
  for (const h of hotels) {
    const k = `${normCity(h.city)}|${h.country}`;
    if (!map.has(k)) {
      map.set(k, {
        key: k, city: h.city, state: h.state, country: h.country, hotels: 0, keys: 0,
        adr: 0, occ: 0, revpar: 0, oarMin: 0, oarMax: 0, txns: 0, medPpk: null,
        _adr: [], _occ: [], _rev: [], _oar: [], _ppk: [],
      });
    }
    const m = map.get(k)!;
    m.hotels++;
    m.keys += h.keys;
    m._adr.push(h.adr);
    m._occ.push(h.occ);
    m._rev.push(h.revpar);
    m._oar.push(h.oar);
  }
  for (const t of transactions) {
    const m = map.get(`${normCity(t.city)}|${t.country}`);
    if (!m) continue;
    m.txns++;
    if (t.pricePerKey) m._ppk.push(t.pricePerKey);
  }
  const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  return [...map.values()].map(({ _adr, _occ, _rev, _oar, _ppk, ...m }) => ({
    ...m,
    adr: avg(_adr),
    occ: avg(_occ),
    revpar: avg(_rev),
    oarMin: Math.min(..._oar),
    oarMax: Math.max(..._oar),
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
          {rows.length} markets, calculated directly from the hotel and transaction data. ADR, occupancy and RevPAR are
          simple averages of the tracked hotels in each market, not market-wide STR figures.
        </p>
      </div>
      <MarketsTable rows={rows} />
    </div>
  );
}
