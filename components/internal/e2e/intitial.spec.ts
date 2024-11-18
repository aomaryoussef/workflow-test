import { expect, test } from '@playwright/test';

test('Protected By Login', async ({ page }) => {
  await page.goto('http:localhost:3000/web-internal/partners');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Web Internal/);
});

test('Logs in successfully', async ({ page }) => {
  await page.goto('http://localhost:3000/web-internal/');
  await page.getByTestId('email-input').fill('demo@refine.dev');
  await page.getByTestId('password').fill('demodemo');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('http://localhost:3000/web-internal/partners');
  await expect(page.locator('span').nth(1)).toHaveText('Partners');
});
