// City names are written slightly differently across the hotel and transaction
// datasets ("Washington D.C." vs "Washington, DC"), so compare a normalized form.
const ALIASES: Record<string, string> = {
  'new york city': 'new york',
  nyc: 'new york',
  'washington dc': 'washington',
  'washington d c': 'washington',
  'miami beach': 'miami beach',
  'montréal': 'montreal',
  'québec city': 'quebec city',
};

export function normCity(c: string): string {
  const s = c
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return ALIASES[s] ?? s;
}

export const cityMatch = (a: string, b: string) => normCity(a) === normCity(b);
