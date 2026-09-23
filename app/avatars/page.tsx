import Image from "next/image";
import Link from "next/link";
import { AVATARS } from "@/lib/avatars";

export default function AvatarPreviewPage() {
  return (
    <div className="page-shell py-12">
      <Link href="/profile" className="text-sm text-[var(--color-link)] hover:text-[var(--color-text)]">
        ← Back to profile
      </Link>
      <h1 className="mt-4 text-3xl font-bold">Avatar picks for BingeBox</h1>
      <p className="mt-2 max-w-xl text-[var(--color-muted)]">
        These five avatars are available in Edit profile on your account.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {AVATARS.map((avatar, i) => (
          <div key={avatar.id} className="glass-card p-6">
            <p className="section-eyebrow mb-3">Option {i + 1}</p>
            <div className="flex items-center gap-4">
              <Image src={avatar.file} alt="" width={96} height={96} className="rounded-2xl" />
              <div>
                <h2 className="text-lg font-semibold">{avatar.name}</h2>
                <code className="mt-2 block text-xs text-[var(--color-muted)]">{avatar.id}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
