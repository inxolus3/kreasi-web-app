import { test, expect } from '@playwright/test'

test('admin billboard management (scaffold)', async ({ page }) => {
  await page.goto('/admin/billboards')
  await expect(page).toHaveURL(/admin\/billboards/)
})
