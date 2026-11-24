// Cloudflare Worker: proxies vercel.json rewrites (_redirects cannot proxy to another origin);
// everything else is served from static assets. wrangler.jsonc run_worker_first must list the same sources.
import { rewrites } from "../vercel.json";

export default {
  async fetch(request: Request, env: { ASSETS: { fetch: typeof fetch } }) {
    const url = new URL(request.url);
    for (const { source, destination } of rewrites) {
      const prefix = source.replace(":path*", "");
      if (url.pathname.startsWith(prefix))
        return fetch(
          new Request(
            destination.replace(":path*", url.pathname.slice(prefix.length)) +
              url.search,
            request,
          ),
        );
    }
    return env.ASSETS.fetch(request);
  },
};
