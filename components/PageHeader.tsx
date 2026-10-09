import { eyebrow as eyebrowStyle, pageHeading } from '@/components/ds/styles';

type Props = {
  /** Mono caps label above the title, e.g. "Nights & history". */
  eyebrow: string;
  /** Rendered as-is — pass it already capitalised. */
  title: string;
  /** Space below the header block. Pages differ; About adds `rule` instead. */
  gap?: number;
  /** The cyan gradient hairline the About page sits under its title. */
  rule?: boolean;
};

/** The eyebrow + `<h1>` block every page below the home page opens with. */
export default function PageHeader({ eyebrow, title, gap = 8, rule = false }: Props) {
  return (
    <>
      <p style={{ ...eyebrowStyle, margin: '0 0 16px', textAlign: 'center' }}>{eyebrow}</p>
      <h1 style={{ ...pageHeading, margin: `0 0 ${rule ? 20 : gap}px` }}>{title}</h1>
      {rule && (
        <div
          style={{
            height: 1,
            width: 120,
            background: 'linear-gradient(to right, transparent, var(--pc-cyan), transparent)',
            margin: '0 auto 56px',
          }}
        />
      )}
    </>
  );
}
