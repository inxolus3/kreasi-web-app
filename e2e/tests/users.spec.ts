import { test, expect } from '@playwright/test'

test('admin can manage users (scaffold)', async ({ page }) => {
  await page.goto('/admin/users')
  await expect(page).toHaveURL(/admin\/users/)
})
