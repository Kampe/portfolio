import { describe, it, expect } from 'bun:test'
import { sendContactEmail, ContactMessage } from '../routes/contact'

describe('Contact Form Handler', () => {
  it('should accept valid contact message', async () => {
    const message: ContactMessage = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    }

    const result = await sendContactEmail(message)

    expect(result.success).toBe(true)
    expect(result.message).toBeDefined()
    expect(typeof result.message).toBe('string')
  })

  it('should handle empty fields gracefully', async () => {
    const message: ContactMessage = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }

    const result = await sendContactEmail(message)

    expect(result.success).toBe(true)
  })

  it('should handle long messages', async () => {
    const longMessage = 'a'.repeat(5000)
    const message: ContactMessage = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Long Message',
      message: longMessage
    }

    const result = await sendContactEmail(message)
    expect(result.success).toBe(true)
  })

  it('should handle special characters', async () => {
    const message: ContactMessage = {
      name: 'José García',
      email: 'josé@example.com',
      subject: 'Test with émojis 🚀',
      message: 'Message with special chars: <>&"'
    }

    const result = await sendContactEmail(message)
    expect(result.success).toBe(true)
  })
})
