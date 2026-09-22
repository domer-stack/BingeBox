import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({ title, href, linkLabel = "More →" }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {href && (
        <Link href={href} className="section-link">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
