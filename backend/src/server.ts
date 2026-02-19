import { existsSync, statSync } from 'fs'
import { join } from 'path'
import { sendContactEmail } from './routes/contact'

const PORT = 3001
// Use absolute path in container, relative path in dev
const PUBLIC_DIR = process.env.NODE_ENV === 'production'
  ? '/app/backend/public'
  : join(import.meta.dir, '../public')

function getMimeType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase()

  const mimeTypes: Record<string, string> = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'txt': 'text/plain',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
  }

  return mimeTypes[ext || ''] || 'application/octet-stream'
}

function getCacheHeaders(filePath: string): Record<string, string> {
  const ext = filePath.split('.').pop()?.toLowerCase()

  // Immutable assets (hashed filenames)
  if (filePath.includes('/assets/')) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' } // 1 year
  }

  // Long cache for fonts
  if (['woff', 'woff2', 'ttf'].includes(ext || '')) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' } // 1 year
  }

  // Medium cache for images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'].includes(ext || '')) {
    return { 'Cache-Control': 'public, max-age=604800' } // 1 week
  }

  // Short cache for HTML
  if (ext === 'html') {
    return { 'Cache-Control': 'public, max-age=3600, must-revalidate' } // 1 hour, with revalidation
  }

  // No cache for everything else
  return { 'Cache-Control': 'public, max-age=0, must-revalidate' }
}

function isRegularFile(filePath: string): boolean {
  try {
    return statSync(filePath).isFile()
  } catch {
    return false
  }
}

export function startServer() {
  const server = Bun.serve({
    port: PORT,
    hostname: '0.0.0.0',
    development: process.env.NODE_ENV !== 'production',
    async fetch(request: any) {
      const url = new URL(request.url)
      const pathname = url.pathname

      // Health check endpoint
      if (pathname === '/health') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString()
          }),
          { headers: { 'Content-Type': 'application/json' } }
        )
      }

      // API endpoints
      if (pathname === '/api/contact' && request.method === 'POST') {
        try {
          const body = await request.json()
          const result = await sendContactEmail({
            name: body.name || '',
            email: body.email || '',
            subject: body.subject || '',
            message: body.message || '',
          })
          return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
          })
        } catch (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to process contact form' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          )
        }
      }

      if (pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ error: 'API endpoint not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        )
      }

      // Static file serving
      let filePath = join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname)

      if (existsSync(filePath) && isRegularFile(filePath)) {
        const file = Bun.file(filePath)
        const mimeType = getMimeType(filePath)
        const cacheHeaders = getCacheHeaders(filePath)
        return new Response(file, {
          headers: {
            'Content-Type': mimeType,
            ...cacheHeaders
          }
        })
      }

      // Fallback to index.html for SPA routing
      if (pathname.startsWith('/assets/')) {
        return new Response('Not found', { status: 404 })
      }

      if (pathname.startsWith('/.well-known/')) {
        return new Response('Not found', { status: 404 })
      }

      const indexFile = Bun.file(join(PUBLIC_DIR, 'index.html'))
      return new Response(indexFile, {
        headers: { 'Content-Type': 'text/html' }
      })
    }
  })

  console.log(`🚀 Server running at http://localhost:${PORT}`)
  console.log(`📁 Serving static files from: ${PUBLIC_DIR}`)

  return server
}
