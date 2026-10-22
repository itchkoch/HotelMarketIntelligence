import fs from 'fs';
import path from 'path';

export type Section = { title: string; html: string };

let cache: Record<string, Section[]> | null = null;

/** All report sections, keyed by hotel slug (e.g. "hir-010"). Read once per server instance. */
export function loadReports(): Record<string, Section[]> {
  if (!cache) {
    cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'reports.json'), 'utf8'));
  }
  return cache!;
}

export const loadSections = (slug: string): Section[] => loadReports()[slug] ?? [];
