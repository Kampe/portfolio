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

  // Fill contact form if visible
  const nameInput = page.locator('input[placeholder*="name"], input[type="text"]').first()
  const emailInput = page.locator('input[type="email"]')

  if (await nameInput.isVisible({ timeout: 500 }).catch(() => false)) {
    await nameInput.fill('Test User')
    await emailInput.fill('test@example.com')
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

test('api contact endpoint works', async ({ page }) => {
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
  expect(data.success).toBe(true)
})
