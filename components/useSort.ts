'use client';
import { useMemo, useState } from 'react';

export function useSort<T>(rows: T[], initial: keyof T, initialDir: 'asc' | 'desc' = 'desc') {
  const [col, setCol] = useState<keyof T>(initial);
  const [dir, setDir] = useState<'asc' | 'desc'>(initialDir);

  const sorted = useMemo(() => {
    const out = [...rows];
    out.sort((a, b) => {
      const x = a[col] as unknown;
      const y = b[col] as unknown;
      if (x == null && y == null) return 0;
      if (x == null) return 1; // nulls always last
      if (y == null) return -1;
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
      return dir === 'asc' ? c : -c;
    });
    return out;
  }, [rows, col, dir]);

  const toggle = (c: keyof T) => {
    if (c === col) setDir(dir === 'asc' ? 'desc' : 'asc');
    else {
      setCol(c);
      setDir('desc');
    }
  };
  const arrow = (c: keyof T) => (c === col ? (dir === 'asc' ? ' ▲' : ' ▼') : '');
  return { sorted, toggle, arrow };
}
