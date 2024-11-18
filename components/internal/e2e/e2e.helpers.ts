import { Page } from '@playwright/test';

// Define base URLs and credentials
const baseUrl = 'http://mylo.localhost/en/back-office';
export const urls = {
  login: `${baseUrl}/public/login`,
  partnerCreation: `${baseUrl}/private/partners/create`,
  storeCreation: `${baseUrl}/private/partners/stores/create`,
};

export const userCredentials = { email: 'relationship_manager@btech.com', password: '123456' };

/** Login to the application. Typically used in the `beforeEach` hook of a test suite. */
export const login = async ({ page }: { page: Page }) => {
  await page.goto(urls.login); // Navigate to the login page
  // Fill in the email and password fields
  await page.getByTestId('email-input').fill(userCredentials.email);
  await page.getByTestId('password').fill(userCredentials.password);
  await page.click('button[type="submit"]'); // Click the submit button
  await page.waitForURL(urls.partnerCreation); // Wait for navigation to the partner creation page
};
