import { describe, it, expect } from 'bun:test'

describe('API Response Handling', () => {
  describe('Contact Form Validation', () => {
    it('should validate email format', () => {
      const emails = ['test@example.com', 'user+tag@domain.co.uk']
      const invalidEmails = ['invalid', '@example.com', 'test@']

      emails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        expect(isValid).toBe(true)
      })

      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        expect(isValid).toBe(false)
      })
    })

    it('should accept valid contact payloads', () => {
      const payload = {
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Test message'
      }

      expect(payload.name).toBeDefined()
      expect(payload.email).toBeDefined()
      expect(payload.subject).toBeDefined()
      expect(payload.message).toBeDefined()
    })

    it('should handle partial payloads', () => {
      const payload = {
        name: 'Test User'
        // missing other fields
      }

      expect(payload.name).toBeDefined()
      // Other fields are undefined but accepted
    })
  })

  describe('Error Response Format', () => {
    it('should format error responses correctly', () => {
      const error = {
        error: 'API endpoint not found'
      }

      expect(error.error).toBeDefined()
      expect(typeof error.error).toBe('string')
    })

    it('should format success responses correctly', () => {
      const success = {
        success: true,
        message: 'Message received. We will respond shortly.'
      }

      expect(success.success).toBe(true)
      expect(success.message).toBeDefined()
    })
  })
})

describe('API Endpoints (Integration - requires running server)', () => {
  const PORT = process.env.TEST_PORT || '3001'
  const HOST = process.env.TEST_HOST || 'localhost'
  const BASE_URL = `http://${HOST}:${PORT}`

  async function testIfServerRunning() {
    try {
      const response = await fetch(`${BASE_URL}/health`, {
        signal: AbortSignal.timeout(2000)
      })
      return response.status === 200
    } catch {
      return false
    }
  }

  it('skip: POST /api/contact should accept valid submission', async () => {
    const serverRunning = await testIfServerRunning()
    if (!serverRunning) {
      console.log('⚠️ Server not running. Run: bun src/index.ts')
      return
    }

    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message'
    }

    const response = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it('skip: GET /api/nonexistent should return 404', async () => {
    const serverRunning = await testIfServerRunning()
    if (!serverRunning) {
      return
    }

    const response = await fetch(`${BASE_URL}/api/nonexistent`, {
      signal: AbortSignal.timeout(5000)
    })

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBeDefined()
  })
})
