import { test, expect } from '@playwright/test'

test('admin can update settings (scaffold)', async ({ page }) => {
  await page.goto('/admin/settings')
  await expect(page).toHaveURL(/admin\/settings/)
})
