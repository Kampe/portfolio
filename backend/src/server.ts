import { existsSync } from 'fs'
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

export function startServer() {
  const server = Bun.serve({
    port: PORT,
    hostname: '0.0.0.0',
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

      if (existsSync(filePath)) {
        const file = Bun.file(filePath)
        const mimeType = getMimeType(filePath)
        return new Response(file, {
          headers: { 'Content-Type': mimeType }
        })
      }

      // Fallback to index.html for SPA routing
      if (pathname.startsWith('/assets/')) {
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
