import { CheckList } from './Shared';

/**
 * Splits a doctor's profile text (typed in the admin panel) into sections. No HTML is ever injected.
 *   "## Heading"     → starts a new section
 *   "- item"         → bullet point
 *   "Label: value"   → detail row (e.g. "Speciality: Periodontics")
 *   anything else    → paragraph (a blank line starts a new one)
 */
export function parseProfile(text = '') {
  const sections = [];
  let current = { heading: null, blocks: [] };
  let gap = false;
  const finish = () => { if (current.heading || current.blocks.length) sections.push(current); };

  String(text).replace(/\r\n/g, '\n').split('\n').forEach((raw) => {
    const line = raw.trim();
    if (!line) { gap = true; return; }
    if (line.startsWith('## ')) {
      finish();
      current = { heading: line.slice(3).trim(), blocks: [] };
      gap = false;
      return;
    }
    const bullet = line.match(/^[-•*]\s+(.+)$/);
    const fact = !bullet && line.match(/^([^:]{2,40}):\s+(\S.*)$/);
    const type = bullet ? 'list' : fact ? 'facts' : 'text';
    let block = current.blocks[current.blocks.length - 1];
    if (!block || block.type !== type || (type === 'text' && gap)) {
      block = { type, items: [] };
      current.blocks.push(block);
    }
    if (type === 'list') block.items.push(bullet[1]);
    else if (type === 'facts') block.items.push({ label: fact[1].trim(), value: fact[2].trim() });
    else block.items.push(line);
    gap = false;
  });
  finish();
  return sections;
}

export function FactRows({ items }) {
  return (
    <dl className="divide-y divide-clinic-sky rounded-[10px] border border-clinic-sky bg-clinic-bg px-5">
      {items.map((f) => (
        <div key={f.label} className="grid gap-1 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
          <dt className="font-poppins text-[15px] font-semibold text-clinic-navy">{f.label}</dt>
          <dd className="leading-relaxed">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Renders a parsed profile in the clinic page style. */
export default function DoctorProfileText({ text, headingClass }) {
  return parseProfile(text).map((section, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <div key={i} className="mt-9">
      {section.heading && <h3 className={headingClass}>{section.heading}</h3>}
      <div className="space-y-4">
        {section.blocks.map((b, j) => {
          // eslint-disable-next-line react/no-array-index-key
          if (b.type === 'list') return <CheckList key={j} items={b.items} />;
          // eslint-disable-next-line react/no-array-index-key
          if (b.type === 'facts') return <FactRows key={j} items={b.items} />;
          // eslint-disable-next-line react/no-array-index-key
          return <p key={j} className="sm:text-justify">{b.items.join(' ')}</p>;
        })}
      </div>
    </div>
  ));
}
