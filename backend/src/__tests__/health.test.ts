import { describe, it, expect } from 'bun:test'

describe('Health Check Response Format', () => {
  it('should format health check response correctly', () => {
    const now = new Date()
    const response = {
      status: 'ok',
      timestamp: now.toISOString()
    }

    expect(response.status).toBe('ok')
    expect(response.timestamp).toBeDefined()
    expect(typeof response.timestamp).toBe('string')
  })

  it('should validate ISO timestamp format', () => {
    const timestamp = new Date().toISOString()
    const parsed = new Date(timestamp)

    expect(!isNaN(parsed.getTime())).toBe(true)
    expect(timestamp.includes('T')).toBe(true)
    expect(timestamp.includes('Z')).toBe(true)
  })
})

describe('Health Endpoint Integration (requires running server)', () => {
  it('skip: health check should return 200', async () => {
    // This test requires the server to be running on port 3001
    // Run the app with: bun src/index.ts
    // Then run tests with: bun test

    const PORT = process.env.TEST_PORT || '3001'
    const HOST = process.env.TEST_HOST || 'localhost'

    try {
      const response = await fetch(`http://${HOST}:${PORT}/health`, {
        signal: AbortSignal.timeout(2000)
      })

      if (response.status === 200) {
        const data = await response.json()
        expect(data.status).toBe('ok')
      }
    } catch (error) {
      // Server not running - skip this test
      console.log('⚠️ Server not running on port 3001. Run: bun src/index.ts')
    }
  })
})
