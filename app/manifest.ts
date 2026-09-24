import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BingeBox",
    short_name: "BingeBox",
    description: "Track TV shows, rate episodes, build lists, and discover what to watch next.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#0f9b8e",
    icons: [
      {
        src: "/logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
