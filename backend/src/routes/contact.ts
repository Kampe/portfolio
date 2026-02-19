const FORMSPREE_ID = 'meelkpqg'

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactMessage) {
  try {
    const response = await fetch(
      `https://formspree.io/f/${FORMSPREE_ID}`,
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
