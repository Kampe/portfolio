import { statSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import type { Server } from 'bun'
import { sendContactEmail, validateContactPayload } from './routes/contact'

const PORT = Number.parseInt(process.env.PORT || '3001', 10)
const PUBLIC_DIR = process.env.PUBLIC_DIR || (process.env.NODE_ENV === 'production' ? '/app/backend/public' : resolve(import.meta.dir, '../public'))
const MAX_BODY_BYTES = 64 * 1024
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const MIN_COMPRESSIBLE_BYTES = 1024
const compressedFiles = new Map<string, Uint8Array>()

const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com; font-src 'self' data:; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
}

const mimeTypes: Record<string, string> = {
  html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8', webmanifest: 'application/manifest+json; charset=utf-8',
  xml: 'application/xml; charset=utf-8', txt: 'text/plain; charset=utf-8', png: 'image/png', jpg: 'image/jpeg',
  jpeg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', ico: 'image/x-icon',
  webp: 'image/webp', avif: 'image/avif', woff: 'font/woff', woff2: 'font/woff2', ttf: 'font/ttf', map: 'application/json',
}

interface RateRecord { count: number; resetAt: number }
const rateLimits = new Map<string, RateRecord>()

function responseHeaders(extra: HeadersInit = {}): Headers {
  const headers = new Headers(securityHeaders)
  new Headers(extra).forEach((value, key) => headers.set(key, value))
  return headers
}

function json(data: unknown, status = 200, extra: HeadersInit = {}): Response {
  const headers = responseHeaders(extra)
  headers.set('Cache-Control', 'no-store')
  return Response.json(data, { status, headers })
}

function getMimeType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase() || ''
  return mimeTypes[extension] || 'application/octet-stream'
}

function cacheControl(filePath: string): string {
  if (filePath.includes(`${sep}assets${sep}`)) return 'public, max-age=31536000, immutable'
  if (/\.(?:png|jpe?g|gif|svg|ico|webp|avif|woff2?|ttf)$/.test(filePath)) return 'public, max-age=604800'
  return 'public, max-age=0, must-revalidate'
}

function isCompressible(contentType: string): boolean {
  return /^(?:text\/|application\/(?:javascript|json|manifest\+json|xml)|image\/svg\+xml)/.test(contentType)
}

async function staticResponse(request: Request, filePath: string): Promise<Response> {
  const contentType = getMimeType(filePath)
  const headers = responseHeaders({ 'Content-Type': contentType, 'Cache-Control': cacheControl(filePath) })
  const acceptsGzip = request.headers.get('accept-encoding')?.split(',').some((value) => value.trim().startsWith('gzip'))
  const file = Bun.file(filePath)

  if (acceptsGzip && isCompressible(contentType) && file.size >= MIN_COMPRESSIBLE_BYTES) {
    let compressed = compressedFiles.get(filePath)
    if (!compressed) {
      compressed = Bun.gzipSync(new Uint8Array(await file.arrayBuffer()))
      compressedFiles.set(filePath, compressed)
    }
    headers.set('Content-Encoding', 'gzip')
    headers.set('Vary', 'Accept-Encoding')
    headers.set('Content-Length', String(compressed.byteLength))
    const body = compressed.buffer.slice(
      compressed.byteOffset,
      compressed.byteOffset + compressed.byteLength,
    ) as ArrayBuffer
    return new Response(request.method === 'HEAD' ? null : body, { headers })
  }

  return new Response(request.method === 'HEAD' ? null : file, { headers })
}

function isFile(filePath: string): boolean {
  try { return statSync(filePath).isFile() } catch { return false }
}

function safeStaticPath(pathname: string): string | undefined {
  let decoded: string
  try { decoded = decodeURIComponent(pathname) } catch { return undefined }
  const candidate = resolve(PUBLIC_DIR, `.${decoded}`)
  const root = resolve(PUBLIC_DIR)
  if (candidate !== root && !candidate.startsWith(`${root}${sep}`)) return undefined
  return candidate
}

function findStaticFile(pathname: string): string | undefined {
  const base = safeStaticPath(pathname)
  if (!base) return undefined
  const candidates = pathname === '/'
    ? [resolve(PUBLIC_DIR, 'index.html')]
    : [base, `${base}.html`, resolve(base, 'index.html')]
  return candidates.find(isFile)
}

function getClientIp(request: Request, server?: Server<undefined>): string {
  const forwarded = process.env.NODE_ENV === 'production' ? request.headers.get('cf-connecting-ip') : null
  return forwarded || server?.requestIP(request)?.address || 'unknown'
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const originUrl = new URL(origin)
    const requestUrl = new URL(request.url)
    if (originUrl.host === requestUrl.host) return true
    if (process.env.PUBLIC_ORIGIN && origin === process.env.PUBLIC_ORIGIN) return true
    return process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(originUrl.hostname)
  } catch {
    return false
  }
}

function isRateLimited(key: string, now = Date.now()): boolean {
  const current = rateLimits.get(key)
  if (!current || current.resetAt <= now) {
    if (!current && rateLimits.size >= 10_000) {
      const oldestKey = rateLimits.keys().next().value
      if (typeof oldestKey === 'string') rateLimits.delete(oldestKey)
    }
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > RATE_LIMIT_MAX
}

async function handleContact(request: Request, server?: Server<undefined>): Promise<Response> {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' })
  if (!isAllowedOrigin(request)) return json({ error: 'Cross-origin submission rejected.' }, 403)
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Content-Type must be application/json.' }, 415)
  const contentLength = Number.parseInt(request.headers.get('content-length') || '0', 10)
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'Request body is too large.' }, 413)

  let payload: unknown
  try { payload = await request.json() } catch { return json({ error: 'Request body must contain valid JSON.' }, 400) }
  const validation = validateContactPayload(payload)
  if (!validation.data) return json({ error: 'Please correct the highlighted fields.', fields: validation.errors }, 422)
  if (validation.data.website) return json({ success: true, message: 'Message received.' })
  if (isRateLimited(getClientIp(request, server))) return json({ error: 'Too many messages. Please try again in a few minutes.' }, 429, { 'Retry-After': '600' })

  const result = await sendContactEmail(validation.data)
  return result.success ? json(result) : json({ error: result.message }, 502)
}

export async function handleRequest(request: Request, server?: Server<undefined>): Promise<Response> {
  const url = new URL(request.url)
  if (url.pathname === '/health') return json({ status: 'ok', timestamp: new Date().toISOString() })
  if (url.pathname === '/api/contact') return handleContact(request, server)
  if (url.pathname.startsWith('/api/')) return json({ error: 'API endpoint not found.' }, 404)
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: responseHeaders({ Allow: 'GET, HEAD' }) })

  const filePath = findStaticFile(url.pathname)
  if (filePath) {
    return staticResponse(request, filePath)
  }

  const notFoundPath = findStaticFile('/404')
  return new Response(request.method === 'HEAD' ? null : notFoundPath ? Bun.file(notFoundPath) : 'Not found', {
    status: 404,
    headers: responseHeaders({ 'Content-Type': notFoundPath ? 'text/html; charset=utf-8' : 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }),
  })
}

export function startServer() {
  const server = Bun.serve({
    port: Number.isFinite(PORT) ? PORT : 3001,
    hostname: '0.0.0.0',
    development: process.env.NODE_ENV !== 'production',
    maxRequestBodySize: MAX_BODY_BYTES,
    idleTimeout: 10,
    fetch: handleRequest,
  })
  console.log(`Server listening on http://localhost:${server.port}`)
  return server
}
