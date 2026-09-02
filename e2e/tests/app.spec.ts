import { expect, test } from '@playwright/test'
import { checkA11y, injectAxe } from 'axe-playwright'

test('preserves the original hero, content, and navigation', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle('Nick Kampe | Automation Engineer & Platform Architect — Infrastructure & DevOps')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'NICK KAMPE' })).toBeVisible()
  await expect(page.getByText('Platform Engineer', { exact: true })).toBeVisible()
  await expect(page.getByText('Software Craftsman', { exact: true })).toBeVisible()
  await expect(page.getByText('Perpetual Learner', { exact: true })).toBeVisible()

  for (const section of ['ABOUT', 'SKILLS', 'RESUME', 'CONTACT']) {
    await expect(page.getByRole('button', { name: section, exact: true })).toBeVisible()
  }
})

test('section dialogs retain their original content and hash navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'ABOUT' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Infrastructure Architect & Platform Engineer')).toBeVisible()
  await expect(page).toHaveURL(/#about$/)
  await expect(dialog).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
})

test('deep links open the existing sections', async ({ page }) => {
  await page.goto('/#resume')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('PROFESSIONAL EXPERIENCE')).toBeVisible()
})

test('contact submission prevents duplicates and announces success', async ({ page }) => {
  let requests = 0
  await page.route('**/api/contact', async (route) => {
    requests += 1
    await new Promise((resolve) => setTimeout(resolve, 500))
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  })

  await page.goto('/#contact')
  await page.getByLabel('Your name').fill('Test User')
  await page.getByLabel('Your email').fill('test@example.com')
  await page.getByLabel('Your message').fill('Test message from Playwright')

  const submit = page.getByRole('button', { name: 'SEND MESSAGE' })
  await submit.click()
  await expect(submit).toBeDisabled()
  await submit.click({ force: true })
  await expect(page.getByText('Message Submitted!')).toBeVisible()
  expect(requests).toBe(1)
})

test('an alternate original animation theme still renders', async ({ page }) => {
  await page.goto('/?theme=spectrum')
  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'NICK KAMPE' })).toBeVisible()
})

test('unknown routes return a real 404 with security headers', async ({ request }) => {
  const response = await request.get('/does-not-exist')
  expect(response.status()).toBe(404)
  expect(response.headers()['content-security-policy']).toContain("default-src 'self'")
  expect(response.headers()['x-content-type-options']).toBe('nosniff')
})

test('the original experience has no automatic accessibility violations', async ({ page }) => {
  await page.goto('/')
  await injectAxe(page)
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } })

  await page.getByRole('button', { name: 'ABOUT' }).click()
  await checkA11y(page, undefined, { detailedReport: true, detailedReportOptions: { html: true } })
})

test('the layout remains contained on mobile and desktop', async ({ page }) => {
  await page.goto('/')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})
