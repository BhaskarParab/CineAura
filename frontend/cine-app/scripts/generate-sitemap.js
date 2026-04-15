import fs from "fs";

const BASE_URL = "https://cineaura.space";

// Example static routes
const staticRoutes = [
  "",
  "/about",
  "/privacy-policy",
  "/terms",
  "/sign-up",
  "/log-in",
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticRoutes
    .map(
      (route) => `
    <url>
      <loc>${BASE_URL}${route}</loc>
      <changefreq>weekly</changefreq>
    </url>
  `
    )
    .join("")}
</urlset>`;

fs.writeFileSync("public/sitemap.xml", sitemap);
console.log("Sitemap generated!");