// Cloudflare Pages Function: proxies /api/vrr/* to the real VRR EFA OpenService
// so the browser only ever talks to our own origin (same domain as the static
// site), avoiding the CORS restriction the upstream API enforces. This mirrors
// the Vite dev server's `/api/vrr` proxy in vite.config.ts, so no other app
// code needs to change between local dev and production.

const VRR_TARGET = 'https://openservice-test.vrr.de/openservice';

export async function onRequest(context: {
  request: Request;
  params: { path?: string | string[] };
}): Promise<Response> {
  const { request, params } = context;
  const incomingUrl = new URL(request.url);

  const path = Array.isArray(params.path)
    ? params.path.join('/')
    : (params.path ?? '');

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
