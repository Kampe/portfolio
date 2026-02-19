import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Nicholas Kampe/)
})

test('health endpoint works', async ({ page }) => {
  const response = await page.goto('/health')
  expect(response?.status()).toBe(200)
})

test('navigation links present', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.locator('a[href="/about"]')).toBeVisible()
  await expect(page.locator('a[href="/work"]')).toBeVisible()
  await expect(page.locator('a[href="/skills"]')).toBeVisible()
  await expect(page.locator('a[href="/contact"]')).toBeVisible()
})

test('theme selector accessible', async ({ page }) => {
  await page.goto('/')
  
  const themeButton = page.locator('button[title="Change theme"]')
  await expect(themeButton).toBeVisible()
  
  await themeButton.click()
  const themeOptions = page.locator('button:has-text("Organic"), button:has-text("Geometric")')
  await expect(themeOptions.first()).toBeVisible()
})

test('homepage accessible', async ({ page }) => {
  await page.goto('/')
  
  await injectAxe(page)
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  })
})
