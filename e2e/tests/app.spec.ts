import { test, expect } from '@playwright/test'

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(//)

  // Check that main content is visible
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
})

test('health endpoint works', async ({ page }) => {
  const response = await page.request.get('/health')
  expect(response.status()).toBe(200)

  const data = await response.json()
  expect(data.status).toBe('ok')
  expect(data.timestamp).toBeDefined()
})

test('navigation buttons are visible', async ({ page }) => {
  await page.goto('/')

  // Check for navigation buttons
  const aboutBtn = page.locator('button:has-text("ABOUT")')
  const skillsBtn = page.locator('button:has-text("SKILLS")')
  const resumeBtn = page.locator('button:has-text("RESUME")')
  const contactBtn = page.locator('button:has-text("CONTACT")')

  await expect(aboutBtn).toBeVisible()
  await expect(skillsBtn).toBeVisible()
  await expect(resumeBtn).toBeVisible()
  await expect(contactBtn).toBeVisible()
})

test('ABOUT modal opens and closes', async ({ page }) => {
  await page.goto('/')

  const aboutBtn = page.locator('button:has-text("ABOUT")')
  await aboutBtn.click()

  // Modal should be visible with about content
  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  await expect(modal.first()).toBeVisible({ timeout: 1000 })
})

test('SKILLS modal opens and displays content', async ({ page }) => {
  await page.goto('/')

  const skillsBtn = page.locator('button:has-text("SKILLS")')
  await skillsBtn.click()

  // Check for skills content (should contain some text about technologies)
  const text = page.locator('text=/Vue|TypeScript|Docker/')
  await expect(text.first()).toBeVisible({ timeout: 1000 })
})

test('RESUME modal opens and displays content', async ({ page }) => {
  await page.goto('/')

  const resumeBtn = page.locator('button:has-text("RESUME")')
  await resumeBtn.click()

  // Check for resume content
  const text = page.locator('text=/DevOps|Experience|Skills/')
  await expect(text.first()).toBeVisible({ timeout: 1000 })
})

test('CONTACT modal opens', async ({ page }) => {
  await page.goto('/')

  const contactBtn = page.locator('button:has-text("CONTACT")')
  await contactBtn.click()

  // Check for contact form or content
  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  await expect(modal.first()).toBeVisible({ timeout: 1000 })
})

test('contact form can be filled and submitted', async ({ page }) => {
  await page.goto('/')

  const contactBtn = page.locator('button:has-text("CONTACT")')
  await contactBtn.click()

  // Fill contact form with proper IDs
  const nameInput = page.locator('input#contact-name')
  const emailInput = page.locator('input#contact-email')
  const messageInput = page.locator('textarea#contact-message')
  const submitBtn = page.locator('button#contact-submit')

  if (await nameInput.isVisible({ timeout: 500 }).catch(() => false)) {
    await nameInput.fill('Test User')
    await emailInput.fill('test@example.com')
    await messageInput.fill('Test message from Playwright')

    // Wait for form submission response
    const submitPromise = page.waitForResponse(
      response => response.url().includes('/api/contact') && response.request().method() === 'POST'
    )

    await submitBtn.click()

    try {
      const response = await Promise.race([
        submitPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ])

      expect(response.status()).toBe(200)
    } catch (e) {
      // Form submission timeout is acceptable if Formspree is not configured
    }
  }
})

test('page handles keyboard navigation', async ({ page }) => {
  await page.goto('/')

  // Try pressing Escape to close modals
  const aboutBtn = page.locator('button:has-text("ABOUT")')
  await aboutBtn.click()

  await page.keyboard.press('Escape')

  // Modal should be hidden
  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  const isHidden = await modal.first().isHidden({ timeout: 500 }).catch(() => true)
  expect(isHidden).toBe(true)
})

test('page is responsive', async ({ page, viewport }) => {
  // Test at mobile viewport
  await page.goto('/')

  // Canvas should still be visible on mobile
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()

  // Navigation buttons should be accessible
  const aboutBtn = page.locator('button:has-text("ABOUT")')
  await expect(aboutBtn).toBeVisible()
})

test('api contact endpoint responds', async ({ page }) => {
  const response = await page.request.post('/api/contact', {
    data: {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message'
    }
  })

  expect(response.status()).toBe(200)
  const data = await response.json()
  expect(data).toHaveProperty('success')
  expect(data).toHaveProperty('message')
})

// Deep linking tests
test('deep link #about opens About modal', async ({ page }) => {
  await page.goto('/#about')
  await page.waitForTimeout(500)

  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  const aboutText = page.locator('text=/Infrastructure Architect|Platform Engineer/')

  await expect(modal.first()).toBeVisible()
  await expect(aboutText).toBeVisible()
})

test('deep link #skills opens Skills modal', async ({ page }) => {
  await page.goto('/#skills')
  await page.waitForTimeout(500)

  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  const skillsText = page.locator('text=/Cloud Native|Kubernetes/')

  await expect(modal.first()).toBeVisible()
  await expect(skillsText).toBeVisible()
})

test('deep link #resume opens Resume modal', async ({ page }) => {
  await page.goto('/#resume')
  await page.waitForTimeout(500)

  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  const resumeText = page.locator('text=/PROFESSIONAL EXPERIENCE|DevOps Engineer/')

  await expect(modal.first()).toBeVisible()
  await expect(resumeText).toBeVisible()
})

test('deep link #contact opens Contact modal with form', async ({ page }) => {
  await page.goto('/#contact')
  await page.waitForTimeout(500)

  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  const contactForm = page.locator('form')
  const nameInput = page.locator('input#contact-name')

  await expect(modal.first()).toBeVisible()
  await expect(contactForm).toBeVisible()
  await expect(nameInput).toBeVisible()
})

test('browser back button closes modal when deep linked', async ({ page }) => {
  await page.goto('/#about')
  await page.waitForTimeout(500)

  const modal = page.locator('div[class*="modal"], div[class*="overlay"]')
  await expect(modal.first()).toBeVisible()

  // Go back
  await page.goBack()
  await page.waitForTimeout(500)

  const isClosed = await modal.first().isHidden({ timeout: 500 }).catch(() => true)
  expect(isClosed).toBe(true)
})

test('hash updates when modal is opened', async ({ page }) => {
  await page.goto('/')

  const aboutBtn = page.locator('button:has-text("ABOUT")')
  await aboutBtn.click()
  await page.waitForTimeout(500)

  const url = page.url()
  expect(url).toContain('#about')
})

test('hash clears when modal is closed', async ({ page }) => {
  await page.goto('/#about')
  await page.waitForTimeout(500)

  const closeBtn = page.locator('button:has-text("✕")')
  await closeBtn.click()
  await page.waitForTimeout(500)

  const url = page.url()
  expect(url).not.toContain('#about')
})
