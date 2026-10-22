import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { hotels } from '@/lib/data';
import { loadSections } from '@/lib/reports';
import { ReportPdf } from '@/lib/pdf/ReportPdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /reports/hir-010.pdf → PDF generated on demand, then cached by Vercel's CDN.
export async function GET(_req: Request, { params }: { params: { file: string } }) {
  const slug = params.file.replace(/\.pdf$/i, '').toLowerCase();
  const hotel = hotels.find((h) => h.slug === slug);
  if (!hotel) return new Response('Report not found', { status: 404 });

  const doc = React.createElement(ReportPdf, { hotel, sections: loadSections(slug) });
  // renderToBuffer's type expects a <Document> element; ReportPdf returns one.
  const pdf = await renderToBuffer(doc as unknown as Parameters<typeof renderToBuffer>[0]);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${slug}.pdf"`,
      // cache for a day at the edge; redeploys refresh it
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
