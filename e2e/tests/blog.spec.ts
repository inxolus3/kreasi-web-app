import { test, expect } from '@playwright/test'

test('admin can create, edit and delete a blog post (scaffold)', async ({ page }) => {
  await page.goto('/admin/blog')
  await expect(page).toHaveURL(/admin\/blog/)
  // TODO: implement create/edit/delete interactions
})
