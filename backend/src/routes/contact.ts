const DEFAULT_FORMSPREE_ID = 'meelkpqg'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
  website: string
}

export interface ValidationResult {
  data?: ContactMessage
  errors?: Record<string, string>
}

export interface ContactResult {
  success: boolean
  message: string
}

export type FetchImplementation = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateContactPayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { errors: { form: 'Submit the form as a JSON object.' } }
  }

  const source = payload as Record<string, unknown>
  const data: ContactMessage = {
    name: clean(source.name),
    email: clean(source.email).toLowerCase(),
    subject: clean(source.subject),
    message: clean(source.message),
    website: clean(source.website),
  }
  const errors: Record<string, string> = {}

  if (data.name.length < 2 || data.name.length > 80) errors.name = 'Name must be between 2 and 80 characters.'
  if (data.email.length > 254 || !EMAIL_PATTERN.test(data.email)) errors.email = 'Enter a valid email address.'
  if (data.subject.length < 3 || data.subject.length > 120) errors.subject = 'Subject must be between 3 and 120 characters.'
  if (data.message.length < 20 || data.message.length > 5000) errors.message = 'Message must be between 20 and 5,000 characters.'

  return Object.keys(errors).length ? { errors } : { data }
}

export async function sendContactEmail(
  data: ContactMessage,
  fetchImplementation: FetchImplementation = fetch,
): Promise<ContactResult> {
  const formspreeId = process.env.FORMSPREE_ID || DEFAULT_FORMSPREE_ID
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)

  try {
    const response = await fetchImplementation(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: data.name, email: data.email, subject: data.subject, message: data.message }),
      signal: controller.signal,
    })

    if (!response.ok) return { success: false, message: 'The message provider could not accept this request.' }
    return { success: true, message: 'Message received. I will respond shortly.' }
  } catch {
    return { success: false, message: 'The message provider is temporarily unavailable.' }
  } finally {
    clearTimeout(timeout)
  }
}
