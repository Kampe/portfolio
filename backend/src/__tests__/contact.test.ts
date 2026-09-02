import { describe, expect, it } from 'bun:test'
import { sendContactEmail, validateContactPayload, type ContactMessage } from '../routes/contact'

const validMessage: ContactMessage = {
  name: 'Alex Rivera',
  email: 'alex@example.com',
  subject: 'Platform modernization',
  message: 'We need a safer self-service path for our product teams.',
  website: '',
}

describe('contact payload validation', () => {
  it('normalizes a valid payload', () => {
    const result = validateContactPayload({ ...validMessage, name: '  Alex Rivera ', email: 'ALEX@EXAMPLE.COM ' })
    expect(result.errors).toBeUndefined()
    expect(result.data?.name).toBe('Alex Rivera')
    expect(result.data?.email).toBe('alex@example.com')
  })

  it('rejects missing, malformed, and oversized fields', () => {
    const result = validateContactPayload({ name: '', email: 'invalid', subject: 'x', message: 'short' })
    expect(result.errors).toEqual(expect.objectContaining({ name: expect.any(String), email: expect.any(String), subject: expect.any(String), message: expect.any(String) }))
  })

  it('rejects non-object input', () => {
    expect(validateContactPayload('payload').errors?.form).toBeDefined()
  })
})

describe('contact provider', () => {
  it('returns success only when the provider accepts the message', async () => {
    const fakeFetch = async () => new Response('{}', { status: 200 })
    const result = await sendContactEmail(validMessage, fakeFetch)
    expect(result.success).toBe(true)
  })

  it('returns a safe error when the provider fails', async () => {
    const fakeFetch = async () => new Response('{}', { status: 503 })
    const result = await sendContactEmail(validMessage, fakeFetch)
    expect(result.success).toBe(false)
    expect(result.message).not.toContain('503')
  })
})
