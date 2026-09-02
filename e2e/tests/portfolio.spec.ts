import { expect, test } from '@playwright/test'
import { checkA11y, injectAxe } from 'axe-playwright'

test('homepage presents positioning, proof, and selected work', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Nick Kampe \| Platform Architect/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('self-service platforms')
  await expect(page.getByText('50+', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: /Read case study/ })).toHaveCount(3)
})

test('case studies have unique metadata and useful structure', async ({ page }) => {
  await page.goto('/work/yuga-platform')
  await expect(page).toHaveTitle(/self-service platform/)
  await expect(page.getByText('The challenge', { exact: true })).toBeVisible()
  await expect(page.getByText(/Enabled 50\+ engineers/)).toBeVisible()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://nickkampe.com/work/yuga-platform')
})

test('mobile navigation exposes full-size route links', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes('mobile'))
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open navigation' })
  await expect(toggle).toBeVisible()
  await toggle.click()
  const workLink = page.getByRole('navigation').getByRole('link', { name: 'Work' })
  await expect(workLink).toBeVisible()
  expect((await workLink.boundingBox())?.height).toBeGreaterThanOrEqual(44)
})

test('contact form has labels, pending feedback, and a success state', async ({ page }) => {
  await page.route('**/api/contact', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 120))
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, message: 'Received' }) })
  })
  await page.goto('/contact')
  await page.getByLabel('Name *').fill('Alex Rivera')
  await page.getByLabel('Email *').fill('alex@example.com')
  await page.getByLabel('What are you working on? *').fill('Platform modernization')
  await page.getByLabel('What would a good outcome look like? *').fill('We need a safer self-service path for our product teams.')
  await page.getByRole('button', { name: 'Send project brief' }).click()
  await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled()
  await expect(page.getByRole('heading', { name: 'Message received.' })).toBeVisible()
})

test('contact provider failures are announced', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 502, contentType: 'application/json', body: JSON.stringify({ error: 'The message provider is temporarily unavailable.' }) }))
  await page.goto('/contact')
  await page.getByLabel('Name *').fill('Alex Rivera')
  await page.getByLabel('Email *').fill('alex@example.com')
  await page.getByLabel('What are you working on? *').fill('Platform modernization')
  await page.getByLabel('What would a good outcome look like? *').fill('We need a safer self-service path for our product teams.')
  await page.getByRole('button', { name: 'Send project brief' }).click()
  await expect(page.getByRole('alert')).toContainText('temporarily unavailable')
})

test('unknown routes return an actual 404', async ({ request }) => {
  const response = await request.get('/definitely-not-a-route')
  expect(response.status()).toBe(404)
  expect(response.headers()['x-content-type-options']).toBe('nosniff')
})

test('the opt-in lab starts the canvas experience', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'))
  await page.goto('/lab')
  await page.getByRole('button', { name: 'Start experience' }).click()
  await expect(page.locator('canvas')).toBeVisible()
})

for (const path of ['/', '/work', '/work/yuga-platform', '/about', '/resume', '/contact', '/lab', '/privacy']) {
  test(`${path} has no automatically detectable accessibility violations`, async ({ page }) => {
    await page.goto(path)
    await injectAxe(page)
    await checkA11y(page, null, { detailedReport: true, detailedReportOptions: { html: true } })
  })
}
