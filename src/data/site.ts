// ponytail: single source for the origin — astro.config, llms.txt, robots check and canonical fallback read it
export const SITE = "https://unblocked-games.vercel.app";

// ponytail: bump with the catalog; page metadata and llms.txt must agree
export const LAST_UPDATED = "2026-11-05";

// ponytail: .swf files are served from Cloudflare R2 (free egress) to keep Vercel bandwidth low; public/flash stays the upload source
export const FLASH_CDN = "https://flash.theoneand33.dev";
