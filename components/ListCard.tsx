import Image from "next/image";
import Link from "next/link";
import { posterUrl, getShow } from "@/lib/tmdb";

interface ListCardProps {
  id: string;
  title: string;
  authorName: string;
  authorUsername: string;
  itemCount: number;
  showIds: number[];
}

export async function ListCard({
  id,
  title,
  authorName,
  authorUsername,
  itemCount,
  showIds,
}: ListCardProps) {
  const posters = await Promise.all(
    showIds.slice(0, 5).map(async (showId) => {
      try {
        const show = await getShow(showId);
        return posterUrl(show.poster_path, "w154");
      } catch {
        return null;
      }
    })
  );

  return (
    <Link href={`/lists/${id}`} className="group block">
      <div className="grid aspect-[5/2] grid-cols-5 gap-0.5 overflow-hidden rounded bg-[#2c3440]">
        {posters.map((src, i) => (
          <div key={i} className="relative overflow-hidden bg-[#1c2228]">
            {src ? (
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-2">
        <h3 className="font-semibold text-[#9ab] group-hover:text-white">{title}</h3>
        <p className="text-xs text-[#678]">
          {itemCount} shows · by{" "}
          <span className="text-[#9ab]">{authorName}</span>
        </p>
      </div>
    </Link>
  );
}
