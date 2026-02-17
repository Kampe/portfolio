export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

const FORMSPREE_FORM_ID = '2938978484824833769'
const FORMSPREE_DEPLOY_KEY = 'b2e8f68e1d2f41089cc29f9c307dd590'

export async function sendContactEmail(data: ContactMessage) {
  try {
    const response = await fetch(
      `https://formspree.io/api/form/${FORMSPREE_FORM_ID}/submissions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FORMSPREE_DEPLOY_KEY}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          _url: 'https://nickkampe.com',
          _next: 'https://nickkampe.com',
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Formspree API error: ${response.status}`)
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
