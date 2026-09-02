import { describe, expect, it } from 'bun:test'
import { handleRequest } from '../server'

describe('request handler', () => {
  it('returns a health response with security and no-cache headers', async () => {
    const response = await handleRequest(new Request('http://localhost/health'))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect((await response.json() as { status: string }).status).toBe('ok')
  })

  it('returns 404 for an unknown API endpoint', async () => {
    const response = await handleRequest(new Request('http://localhost/api/missing'))
    expect(response.status).toBe(404)
  })

  it('rejects invalid JSON and wrong content types', async () => {
    const wrongType = await handleRequest(new Request('http://localhost/api/contact', { method: 'POST', body: 'hello' }))
    expect(wrongType.status).toBe(415)
    const invalidJson = await handleRequest(new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' }))
    expect(invalidJson.status).toBe(400)
  })

  it('rejects cross-origin contact submissions', async () => {
    const response = await handleRequest(new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://attacker.example' },
      body: '{}',
    }))
    expect(response.status).toBe(403)
  })

  it('returns field errors for an invalid contact payload', async () => {
    const request = new Request('http://localhost/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: '', email: 'nope' }) })
    const response = await handleRequest(request)
    const body = await response.json() as { fields: Record<string, string> }
    expect(response.status).toBe(422)
    expect(body.fields.email).toBeDefined()
  })

  it('accepts honeypot submissions without contacting the provider', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Spam Bot', email: 'bot@example.com', subject: 'A valid subject', message: 'This is long enough to pass validation.', website: 'https://spam.example' }),
    })
    const response = await handleRequest(request)
    expect(response.status).toBe(200)
    expect((await response.json() as { success: boolean }).success).toBe(true)
  })
})
