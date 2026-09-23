import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const SIZES = {
  sm: { box: 32, image: 28 },
  md: { box: 40, image: 36 },
  lg: { box: 56, image: 50 },
};

export function BrandLogo({ showWordmark = true, size = "md", href = "/" }: BrandLogoProps) {
  const dim = SIZES[size];

  const content = (
    <>
      <span
        className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-elevated)] shadow-[0_0_24px_-6px_var(--color-violet-glow)] transition group-hover:shadow-[0_0_32px_-4px_var(--color-accent-glow)]"
        style={{ width: dim.box, height: dim.box }}
      >
        <Image
          src="/logo.png"
          alt="BingeBox"
          width={dim.image}
          height={dim.image}
          className="object-contain"
          priority={size !== "sm"}
        />
      </span>
      {showWordmark && (
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--color-text)] transition group-hover:text-[var(--color-accent-soft)]">
          BingeBox
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group flex shrink-0 items-center gap-2.5">
        {content}
      </Link>
    );
  }

  return <div className="group flex shrink-0 items-center gap-2.5">{content}</div>;
}
