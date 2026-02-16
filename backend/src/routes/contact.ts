export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactMessage) {
  // Email sending logic would go here
  // For now, this is a placeholder for when user adds their email API keys
  
  console.log('Contact form submission:', {
    name: data.name,
    email: data.email,
    subject: data.subject,
    timestamp: new Date().toISOString(),
  })

  return {
    success: true,
    message: 'Message received. We will respond shortly.',
  }
}
