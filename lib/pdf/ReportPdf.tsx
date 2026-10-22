/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Document, Font, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { HTMLElement, Node, parse } from 'node-html-parser';
import type { Hotel } from '@/lib/data';
import type { Section } from '@/lib/reports';
import { SANS_BOLD, SANS_ITALIC, SANS_REGULAR, SERIF_BOLD } from './fonts';

// ── Fonts (embedded, see ./fonts.ts) ───────────────────────────────
Font.register({
  family: 'Sans',
  fonts: [
    { src: SANS_REGULAR },
    { src: SANS_BOLD, fontWeight: 'bold' },
    { src: SANS_ITALIC, fontStyle: 'italic' },
  ],
});
Font.register({ family: 'Serif', src: SERIF_BOLD, fontWeight: 'bold' });
Font.registerHyphenationCallback((w) => [w]); // never hyphenate words

const NAVY = '#1A3A5C';
const MID = '#2471A3';
const LIGHT = '#D6EAF8';

const s = StyleSheet.create({
  page: { fontFamily: 'Sans', fontSize: 9, color: '#1a1a1a', paddingTop: 34, paddingBottom: 40, paddingHorizontal: 36, lineHeight: 1.4 },
  accent: { height: 4, backgroundColor: NAVY, marginBottom: 10 },
  eyebrow: { fontSize: 7.5, color: '#666', textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontFamily: 'Serif', fontWeight: 'bold', fontSize: 20, color: NAVY, marginTop: 3, lineHeight: 1.25 },
  subtitle: { fontSize: 9.5, color: MID, marginTop: 4 },
  notice: { marginTop: 8, padding: 6, backgroundColor: '#FFF8E1', borderLeftWidth: 3, borderLeftColor: '#E6AC00', fontSize: 8, color: '#6B4700' },
  h1: { fontFamily: 'Serif', fontWeight: 'bold', fontSize: 12, color: NAVY, marginTop: 14, marginBottom: 5, paddingBottom: 2, borderBottomWidth: 1.5, borderBottomColor: NAVY },
  h2: { fontSize: 8.5, fontWeight: 'bold', color: MID, textTransform: 'uppercase', marginTop: 7, marginBottom: 3 },
  p: { marginBottom: 5 },
  li: { flexDirection: 'row', marginBottom: 2.5 },
  bullet: { width: 9 },
  liBody: { flex: 1 },
  table: { marginVertical: 4, borderWidth: 0.5, borderColor: '#C8D8E8' },
  tr: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#E8EFF8' },
  th: { flex: 1, padding: 3.5, backgroundColor: NAVY, color: '#fff', fontWeight: 'bold', fontSize: 8 },
  td: { flex: 1, padding: 3.5, fontSize: 8.5 },
  lbl: { width: 130, flexBasis: 130, flexGrow: 0, flexShrink: 0, backgroundColor: LIGHT, color: NAVY, fontWeight: 'bold', fontSize: 8 },
  rateBox: { flexDirection: 'row', marginVertical: 5 },
  rateCard: { flex: 1, marginRight: 5, padding: 6, backgroundColor: LIGHT, borderRadius: 4, alignItems: 'center' },
  rateV: { fontFamily: 'Serif', fontWeight: 'bold', fontSize: 13, color: NAVY },
  rateL: { fontSize: 6.5, color: '#555', textTransform: 'uppercase', textAlign: 'center' },
  swGrid: { flexDirection: 'row', marginVertical: 4 },
  swBox: { flex: 1, padding: 7, borderRadius: 4, marginRight: 6 },
  str: { backgroundColor: '#E8F8EE', borderWidth: 0.5, borderColor: '#82D09A' },
  wkn: { backgroundColor: '#FEF0F0', borderWidth: 0.5, borderColor: '#F4AAAA' },
  h4: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  link: { color: '#1565C0', textDecoration: 'none' },
  footer: { position: 'absolute', bottom: 18, left: 36, right: 36, flexDirection: 'row', justifyContent: 'space-between', fontSize: 6.5, color: '#888' },
});

// ── Text clean-up ──────────────────────────────────────────────────
// Liberation Sans has no emoji or arrow glyphs; map the few used in reports and drop the rest.
const MAP: Record<string, string> = { '▲': '+', '▼': '–', '→': '→', '↑': '↑', '↓': '↓', '✓': '✓', '⚠': '!' };
function clean(t: string): string {
  return t
    .replace(/[▲▼⚠]/g, (c) => MAP[c] ?? '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, '')
    .replace(/[ \t\r\n]+/g, ' ');
}

const isEl = (n: Node): n is HTMLElement => n.nodeType === 1;
const tag = (n: HTMLElement) => n.rawTagName?.toLowerCase() ?? '';
const has = (n: HTMLElement, c: string) => n.classList?.contains(c);
const INLINE = new Set(['strong', 'b', 'em', 'i', 'span', 'a', 'br', 'small', 'sup', 'sub', 'u', 'code']);
const BLOCK = new Set(['p', 'div', 'ul', 'ol', 'li', 'table', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'thead', 'tbody', 'tr', 'section']);

// ── Inline rendering: returns Text children ────────────────────────
function inline(nodes: Node[], keyBase = 'i'): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  nodes.forEach((n, i) => {
    const key = `${keyBase}-${i}`;
    if (n.nodeType === 3) {
      const t = clean(n.text);
      if (t) out.push(t);
      return;
    }
    if (!isEl(n)) return;
    const tg = tag(n);
    const kids = inline(n.childNodes, key);
    if (tg === 'br') out.push('\n');
    else if (tg === 'strong' || tg === 'b') out.push(<Text key={key} style={{ fontWeight: 'bold' }}>{kids}</Text>);
    else if (tg === 'em' || tg === 'i') out.push(<Text key={key} style={{ fontStyle: 'italic' }}>{kids}</Text>);
    else if (tg === 'a') {
      const href = n.getAttribute('href');
      out.push(href && /^https?:|^mailto:/.test(href)
        ? <Link key={key} src={href} style={s.link}>{kids}</Link>
        : <Text key={key}>{kids}</Text>);
    } else out.push(<Text key={key}>{kids}</Text>);
  });
  return out;
}

const hasText = (nodes: React.ReactNode[]) => nodes.some((x) => (typeof x === 'string' ? x.trim() : x != null));

// ── Block rendering ────────────────────────────────────────────────
function cellChildren(cell: HTMLElement): HTMLElement[] {
  return cell.childNodes.filter(isEl);
}

const WEIGHTS: [RegExp, number][] = [
  [/buyer|seller|notes/i, 2.4],
  [/transaction|property|period/i, 2],
];

function renderTable(t: HTMLElement, key: string) {
  const rows = t.querySelectorAll('tr');
  const kv = has(t, 'kv-t');
  // width weight per column, taken from the header row when there is one
  const head = rows[0]?.childNodes.filter(isEl).filter((c) => tag(c) === 'th') ?? [];
  const weights = head.map((h) => WEIGHTS.find(([re]) => re.test(h.text))?.[1] ?? 1);
  return (
    <View key={key} style={s.table}>
      {rows.map((tr, ri) => {
        const cells = tr.childNodes.filter(isEl).filter((c) => ['td', 'th'].includes(tag(c)));
        return (
          <View key={ri} style={s.tr} wrap={false}>
            {cells.map((c, ci) => {
              const isTh = tag(c) === 'th';
              const span = Number(c.getAttribute('colspan') ?? 1);
              const style = [
                isTh ? s.th : s.td,
                kv && has(c, 'lbl') ? s.lbl : {},
                kv ? (has(c, 'lbl') ? {} : { flexGrow: 1, flexBasis: 0 }) : { flexGrow: (weights[ci] ?? 1) * span, flexBasis: 0 },
                /text-align:\s*right/.test(c.getAttribute('style') ?? '') ? { textAlign: 'right' as const } : {},
                /background:#1A3A5C/i.test(c.getAttribute('style') ?? '') ? { backgroundColor: NAVY, color: '#fff', fontWeight: 'bold' as const } : {},
                /font-weight:\s*700/.test(tr.getAttribute('style') ?? '') ? { fontWeight: 'bold' as const, backgroundColor: '#EBF4FF' } : {},
              ];
              return <Text key={ci} style={style}>{inline(c.childNodes, `${key}-${ri}-${ci}`)}</Text>;
            })}
          </View>
        );
      })}
    </View>
  );
}

function blocks(nodes: Node[], keyBase = 'b'): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  let run: Node[] = []; // consecutive inline nodes become one paragraph
  const flush = () => {
    if (!run.length) return;
    const kids = inline(run, `${keyBase}-r${out.length}`);
    if (hasText(kids)) out.push(<Text key={`${keyBase}-r${out.length}`} style={s.p}>{kids}</Text>);
    run = [];
  };

  nodes.forEach((n, i) => {
    const key = `${keyBase}-${i}`;
    if (n.nodeType === 3 || (isEl(n) && INLINE.has(tag(n)))) {
      run.push(n);
      return;
    }
    if (!isEl(n)) return;
    flush();
    const tg = tag(n);
    if (tg === 'table') out.push(renderTable(n, key));
    else if (tg === 'p') {
      const kids = inline(n.childNodes, key);
      if (hasText(kids)) out.push(<Text key={key} style={s.p}>{kids}</Text>);
    } else if (tg === 'ul' || tg === 'ol') {
      out.push(
        <View key={key} style={{ marginBottom: 5 }}>
          {n.childNodes.filter(isEl).filter((li) => tag(li) === 'li').map((li, j) => {
            const nested = li.childNodes.some((c) => isEl(c) && BLOCK.has(tag(c)) && tag(c) !== 'br');
            return (
              <View key={j} style={s.li} wrap={false}>
                <Text style={s.bullet}>{has(n, 'ds-list') || !/list-style:none/.test(n.getAttribute('style') ?? '') ? '•' : ''}</Text>
                <View style={s.liBody}>
                  {nested ? blocks(li.childNodes, `${key}-${j}`) : <Text>{inline(li.childNodes, `${key}-${j}`)}</Text>}
                </View>
              </View>
            );
          })}
        </View>,
      );
    } else if (tg === 'div' && has(n, 'rate-box')) {
      out.push(
        <View key={key} style={s.rateBox} wrap={false}>
          {n.querySelectorAll('.rate-card').map((c, j) => (
            <View key={j} style={s.rateCard}>
              <Text style={s.rateV}>{clean(c.querySelector('.rate-v')?.text ?? '')}</Text>
              <Text style={s.rateL}>{clean(c.querySelector('.rate-l')?.text ?? '')}</Text>
            </View>
          ))}
        </View>,
      );
    } else if (tg === 'div' && has(n, 'sw-grid')) {
      out.push(
        <View key={key} style={s.swGrid} wrap={false}>
          {cellChildren(n).map((box, j) => (
            <View key={j} style={[s.swBox, has(box, 'wkn') ? s.wkn : s.str]}>{blocks(box.childNodes, `${key}-${j}`)}</View>
          ))}
        </View>,
      );
    } else if (tg === 'div' && has(n, 'h2')) {
      out.push(<Text key={key} style={s.h2}>{inline(n.childNodes, key)}</Text>);
    } else if (/^h[1-6]$/.test(tg)) {
      out.push(<Text key={key} style={s.h4}>{inline(n.childNodes, key)}</Text>);
    } else {
      out.push(...blocks(n.childNodes, key)); // generic div / section / tbody wrapper
    }
  });
  flush();
  return out;
}

// ── Document ───────────────────────────────────────────────────────
export function ReportPdf({ hotel: h, sections }: { hotel: Hotel; sections: Section[] }) {
  return (
    <Document title={`${h.name} — Hotel Intelligence`} author="itchkochapps@gmail.com">
      <Page size="LETTER" style={s.page}>
        <View style={s.accent} fixed />
        <Text style={s.eyebrow}>
          {h.country} · {h.city}{h.state ? `, ${h.state}` : ''} · Report {h.id}
        </Text>
        <Text style={s.title}>{clean(h.name)}</Text>
        <Text style={s.subtitle}>
          {h.tier} · {h.keys.toLocaleString('en-US')} keys{h.address ? ` · ${clean(h.address)}` : ''}
        </Text>
        <Text style={s.notice}>
          Research data for preliminary investigation only. All figures in USD. Verify independently before relying on any figure.
          {h.verified
            ? ` Address, rooms, amenities and OTA prices verified ${h.verified}; see Data Sources.`
            : ' This report has not yet been re-verified against current sources.'}
        </Text>

        {sections.map((sec, i) => (
          <View key={i}>
            <Text style={s.h1} minPresenceAhead={200}>{i + 1}. {clean(sec.title)}</Text>
            {blocks(parse(sec.html).childNodes, `s${i}`)}
          </View>
        ))}

        <View style={s.footer} fixed>
          <Text>Hotel Intelligence · research data, not an appraisal · itchkochapps@gmail.com</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
