import { readFile } from 'fs/promises'
import { join } from 'path'

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

interface FormspreeConfig {
  project: string
  forms: Array<{
    name: string
    id: string
    email: string
  }>
}

let config: FormspreeConfig | null = null

async function loadFormspreeConfig(): Promise<FormspreeConfig> {
  if (config) return config

  try {
    const configPath = join(import.meta.dir, '../../..', '.formspree.json')
    const configData = await readFile(configPath, 'utf-8')
    config = JSON.parse(configData)
    return config
  } catch (error) {
    throw new Error('Failed to load Formspree configuration')
  }
}

export async function sendContactEmail(data: ContactMessage) {
  try {
    const config = await loadFormspreeConfig()
    const contactForm = config.forms.find(f => f.name === 'contact')

    if (!contactForm) {
      throw new Error('Contact form not configured')
    }

    const response = await fetch(
      `https://formspree.io/f/${contactForm.id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Formspree error: ${response.status}`)
    }

    return {
      success: true,
      message: 'Message received. I will respond shortly!',
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
    }
  }
}
