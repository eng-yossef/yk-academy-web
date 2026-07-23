import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "YK Academy",
    short_name: "YK Academy",
    description: "Egypt's Premier Tech Academy - Master Programming & AI",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#071226",
    orientation: "portrait-primary",
    categories: ["education", "technology"],
    lang: "en",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
