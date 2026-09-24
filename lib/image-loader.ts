/**
 * TMDB URLs already include size (e.g. /t/p/w500/...). Load them directly so we
 * do not depend on Vercel Image Optimization (returns 402 when quota is exceeded).
 */
export default function bingeboxImageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return src;
}
