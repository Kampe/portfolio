import { describe, expect, it } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { handleRequest, staticResponse } from '../server'

describe('request handler', () => {
  it('returns a health response with security and no-cache headers', async () => {
    const response = await handleRequest(new Request('http://localhost/health'))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
    expect((await response.json() as { status: string }).status).toBe('ok')
  })

  it('only enforces HTTPS upgrades for secure requests', async () => {
    const lanResponse = await handleRequest(new Request('http://192.168.1.21/health'))
    expect(lanResponse.headers.get('content-security-policy')).not.toContain('upgrade-insecure-requests')
    expect(lanResponse.headers.get('cross-origin-opener-policy')).toBeNull()
    expect(lanResponse.headers.get('strict-transport-security')).toBeNull()

    const productionResponse = await handleRequest(new Request('https://nickkampe.com/health'))
    expect(productionResponse.headers.get('content-security-policy')).toContain('upgrade-insecure-requests')
    expect(productionResponse.headers.get('cross-origin-opener-policy')).toBe('same-origin')
    expect(productionResponse.headers.get('strict-transport-security')).toContain('max-age=63072000')
  })

  it('returns 404 for an unknown API endpoint', async () => {
    const response = await handleRequest(new Request('http://localhost/api/missing'))
    expect(response.status).toBe(404)
  })

  it('compresses text assets when the client accepts gzip', async () => {
    const response = await staticResponse(new Request('http://localhost/', {
      headers: { 'Accept-Encoding': 'gzip' },
    }), resolve(import.meta.dir, '../../../frontend/index.html'))
    expect(response.status).toBe(200)
    expect(response.headers.get('content-encoding')).toBe('gzip')
    expect(response.headers.get('vary')).toContain('Accept-Encoding')
  })

  it('invalidates compressed assets after their source file changes', async () => {
    const fixtureDirectory = mkdtempSync(join(tmpdir(), 'portfolio-compression-'))
    const fixturePath = join(fixtureDirectory, 'index.html')
    const request = new Request('http://localhost/', { headers: { 'Accept-Encoding': 'gzip' } })

    try {
      await Bun.write(fixturePath, `first-${'a'.repeat(2048)}`)
      await staticResponse(request, fixturePath)
      await Bun.write(fixturePath, `second-${'b'.repeat(2049)}`)

      const refreshed = await staticResponse(request, fixturePath)
      const uncompressed = Bun.gunzipSync(new Uint8Array(await refreshed.arrayBuffer()))
      expect(new TextDecoder().decode(uncompressed)).toStartWith('second-')
    } finally {
      rmSync(fixtureDirectory, { recursive: true, force: true })
    }
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
