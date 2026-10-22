import hotelsJson from '@/data/hotels.json';
import txJson from '@/data/transactions.json';

export type Seasonal = { period: string; rate: number; note: string };

export type Hotel = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string | null;
  country: string;
  tier: string;
  keys: number;
  address: string | null;
  owner: string | null;
  brand: string | null;
  adr: number;
  otaLow: number;
  otaHigh: number;
  seasonal: Seasonal[];
  verified: string | null;
  flag: string | null;
};

export type Transaction = {
  id: string;
  name: string;
  city: string;
  location: string;
  country: string;
  date: string;
  year: number;
  rooms: number | null;
  price: number | null;
  pricePerKey: number | null;
  tier: string;
  buyer: string | null;
  seller: string | null;
  url: string | null;
  notes: string | null;
};

export const hotels = hotelsJson as Hotel[];
export const transactions = txJson as Transaction[];

export const COUNTRIES = ['Canada', 'USA', 'Mexico'] as const;
export const TIERS = ['Ultra-Luxury', 'Luxury', 'Upper-Upscale', 'Upscale', 'Upper Midscale'];

export const FLAGS: Record<string, string> = { Canada: '🇨🇦', USA: '🇺🇸', Mexico: '🇲🇽' };

export function money(n: number | null | undefined): string {
  if (n == null) return '—';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3).toLocaleString('en-US')}K`;
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function usd(n: number | null | undefined, digits = 0): string {
  if (n == null) return '—';
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}

export const pct = (n: number, digits = 0) => `${(n * 100).toFixed(digits)}%`;

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const cityKey = (city: string, country: string) => `${city}|${country}`;
