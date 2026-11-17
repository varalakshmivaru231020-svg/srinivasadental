import { CheckList } from './Shared';

/**
 * Renders plain text typed in the admin panel — no HTML is ever injected.
 *   blank line   → new paragraph
 *   "## Title"   → heading
 *   "- item"     → bullet point (consecutive lines form a list)
 */
export default function RichText({ text = '' }) {
  const blocks = String(text).replace(/\r\n/g, '\n').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
        const heading = lines[0].startsWith('## ') ? lines[0].slice(3) : null;
        const rest = heading ? lines.slice(1) : lines;
        const isList = rest.length > 0 && rest.every((l) => /^[-•*]\s+/.test(l));
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i}>
            {heading && <h2 className="mt-4 mb-4 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-[1.7rem]">{heading}</h2>}
            {isList
              ? <CheckList items={rest.map((l) => l.replace(/^[-•*]\s+/, ''))} cols />
              : rest.length > 0 && <p className="text-lg leading-relaxed text-muted">{rest.join(' ')}</p>}
          </div>
        );
      })}
    </div>
  );
}
