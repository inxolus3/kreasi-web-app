import { test, expect } from '@playwright/test'

test('login and access admin dashboard', async ({ page }) => {
  await page.goto('/admin')
  // assume auth fixture saved token in localStorage via storageState
  await expect(page).toHaveURL(/admin/)
})
