// Cloudflare Worker entry point.
//
// This serves the built Vite app as static assets, and proxies /api/vrr/*
// to the real VRR EFA OpenService so the browser only ever talks to our own
// origin (avoiding the CORS restriction the upstream API enforces). This
// mirrors the Vite dev server's `/api/vrr` proxy in vite.config.ts, so no
// other app code needs to change between local dev and production.
//
// wrangler.jsonc routes /api/* to this Worker first (run_worker_first);
// everything else falls straight through to static assets.

interface Env {
  ASSETS: Fetcher;
}

const VRR_TARGET = 'https://openservice-test.vrr.de/openservice';

async function proxyVrrRequest(request: Request): Promise<Response> {
  const incomingUrl = new URL(request.url);
  const path = incomingUrl.pathname.replace(/^\/api\/vrr\/?/, '');
  const targetUrl = `${VRR_TARGET}/${path}${incomingUrl.search}`;

  const headers = new Headers();
  const accept = request.headers.get('Accept');
  if (accept) headers.set('Accept', accept);
  const contentType = request.headers.get('Content-Type');
  if (contentType) headers.set('Content-Type', contentType);

  const init: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const upstreamResponse = await fetch(targetUrl, init);

  const responseHeaders = new Headers(upstreamResponse.headers);
  // These are set by the platform based on the actual response body and
  // conflict if copied verbatim from the upstream response.
  responseHeaders.delete('Content-Encoding');
  responseHeaders.delete('Content-Length');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/vrr/')) {
      return proxyVrrRequest(request);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
