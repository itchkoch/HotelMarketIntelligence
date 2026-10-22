import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FLAGS, hotels } from '@/lib/data';
import { loadSections } from '@/lib/reports';

export const dynamicParams = false;

export function generateStaticParams() {
  return hotels.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const h = hotels.find((x) => x.slug === params.slug);
  return { title: h ? `${h.name} — Hotel Intelligence` : 'Hotel not found' };
}

export default function HotelPage({ params }: { params: { slug: string } }) {
  const h = hotels.find((x) => x.slug === params.slug);
  if (!h) notFound();
  const sections = loadSections(h.slug);

  return (
    <div className="space-y-4">
      <div className="no-print flex items-center justify-between">
        <Link href="/" className="text-sm text-navy hover:underline">← All hotels</Link>
        <a
          href={`/reports/${h.slug}.pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-navy px-3 py-1.5 text-sm font-semibold text-white hover:bg-navy-dark"
        >
          Open PDF
        </a>
      </div>

      <article className="card mx-auto max-w-[980px] overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-navy via-[#2471A3] to-gold" />
        <div className="px-5 pb-2 pt-5 sm:px-10">
          <div className="text-[11px] uppercase tracking-wider text-gray-500">
            {FLAGS[h.country]} {h.country} · {h.city}{h.state ? `, ${h.state}` : ''} · Report {h.id}
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-navy sm:text-3xl">{h.name}</h1>
          <div className="mt-1 text-sm text-[#2471A3]">
            {h.tier} · {h.keys.toLocaleString()} keys{h.address ? ` · ${h.address}` : ''}
          </div>
          <p className="mt-3 rounded-r border-l-4 border-amber-500 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Research data for preliminary investigation only. All figures in USD. Verify independently before relying on any
            figure.{h.verified ? ` Address, rooms, amenities and OTA prices verified ${h.verified}; see Data Sources.` : ' This report has not yet been re-verified against current sources.'}
          </p>
        </div>

        <div className="rpt px-5 pb-10 sm:px-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="h1">{i + 1}. {s.title}</h2>
              <div className="rpt-body" dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}
          {!sections.length && <p className="mt-6 text-sm text-gray-500">No report sections on file for this hotel.</p>}
        </div>
      </article>
    </div>
  );
}
