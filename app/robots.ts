/**
 * BIBAZ — Robots.txt
 * SOP §৭ — SEO Infrastructure
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/"],
      },
    ],
    sitemap: "https://moccasin-bat-178323.hostingersite.com/sitemap.xml",
  };
}
