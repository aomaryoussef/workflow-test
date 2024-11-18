import { expect, test } from '@playwright/test';

import { login, urls } from '../e2e.helpers';

test('Should be protected by login', async ({ page }) => {
  await page.goto(urls.partnerCreation);

  // Expect the page to redirect to login
  await expect(page).toHaveURL(urls.login);
});

test.describe('Form fields should be existent and visible', () => {
  test.beforeEach(login);

  test('Should have "Create Partner" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create Partner', exact: false })).toBeVisible();
  });

  test('Should have Bank Information section, and at least one bank account card', async ({ page }) => {
    await expect(page.locator('text=Bank Information')).toBeVisible();
    await expect(page.getByTestId('bank-account-card')).toBeVisible();
  });

  test('Should have Contact Person section, and at least one contact card', async ({ page }) => {
    await expect(page.locator('text=Contact Person')).toBeVisible();
    await expect(page.getByTestId('contact-card')).toBeVisible();
  });

  test('Should have Submit button', async ({ page }) => {
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe('Form fields should accept only valid values', () => {
  test.beforeEach(login);

  // Test selects are not empty
  test('All selects should have options', async ({ page }) => {
    // Get id of the input that is inside the select component (this is the was ant-design creates a searchable select).
    // using the id, we can search for the div that holds the options.
    // The naming convention ant-design uses is `${inputId}_list`.
    // The div that holds the select options is the next sibling element of the `${inputId}_list`.
    // The select options are creating when the input is focused, and removed from the DOM when it is blurred.

    //#region Categories select
    const categoriesSelect = page.getByTestId('commercial-activity-category-select');
    await categoriesSelect.click(); // Focus the input to show the options

    const categoriesInput = categoriesSelect.locator('input');
    const categoriesInputId = await categoriesInput.getAttribute('id');
    expect(categoriesInputId).toBeTruthy(); // not undefined, and not en empty string, expect it to have a truthy value

    const categoriesList = page.locator(`#${categoriesInputId}_list + div`); // The div that holds the options
    // Expect categories list to have at least 1 option child
    expect(await categoriesList.locator('.ant-select-item, .ant-select-item-option').count()).toBeGreaterThan(0);

    // click outside the select to blur it, for the next test to not wait for the current select to close
    await page.locator('body').click();
    //#endregion

    //#region Bank name select
    const bankNamesSelect = page.getByTestId('bank-name-select');
    await bankNamesSelect.click(); // Focus the input to show the options

    const bankNamesInput = bankNamesSelect.locator('input');
    const bankNameInputId = await bankNamesInput.getAttribute('id');
    expect(bankNameInputId).toBeTruthy();

    const bankNameList = page.locator(`#${bankNameInputId}_list + div`); // The div that holds the options`);
    expect(await bankNameList.locator('.ant-select-item, .ant-select-item-option').count()).toBeGreaterThan(0);

    // click outside the select to blur it, for the next test to not wait for the current select to close
    await page.locator('body').click();
    //#endregion
  });

  test('Tax registration number should accept only 9 digits, no more, no less', async ({ page }) => {
    const taxRegistrationNumberInput = page.getByTestId('tax-registration-number-input');
    await taxRegistrationNumberInput.fill('123456789');
    await expect(taxRegistrationNumberInput).toHaveValue('123456789');

    // add 1 more digit
    await taxRegistrationNumberInput.fill('1234567890');
    // expect the input to have an error class.
    // The way ant-design works for inputs with suffixes or prefixes is that,
    // the parent element of the input (probably a span) is the one that has the error class.
    expect(
      await taxRegistrationNumberInput
        .locator('..')
        .evaluate((parent) => parent.classList.contains('ant-input-status-error'))
    ).toBe(true);
  });

  test("All bank account input fields shouldn't accept less than 3 characters", async ({ page }) => {
    const bankAccountFields = page.getByTestId('bank-account-card').getByRole('textbox');
    const allFields = Array.from(await bankAccountFields.all());

    for (let i = 0; i < allFields.length; i++) {
      const field = allFields[i];

      // Fill the field with 2 characters, expect it to have an error class
      await field.fill('ab');
      expect(await field.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(true);

      // Fill the field with 3 characters, expect it to not have that error class
      await field.fill('abc');
      expect(await field.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(false);
    }
  });

  test('Phone number should accept only valid phone number', async ({ page }) => {
    const phoneNumberInput = page.getByTestId('contact-phone-number-input');

    await phoneNumberInput.fill('abc');
    expect(await phoneNumberInput.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(true);

    // add non-egyptian number
    await phoneNumberInput.fill('+1234567890');
    expect(await phoneNumberInput.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(true);

    // add valid egyptian number
    await phoneNumberInput.fill('+201234567890');
    expect(await phoneNumberInput.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(false);
  });

  test('Email should accept only valid email', async ({ page }) => {
    const emailInput = page.getByTestId('contact-email-input');

    await emailInput.fill('abc');
    expect(await emailInput.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(true);

    // add valid email
    await emailInput.fill('test@example.com');
    expect(await emailInput.evaluate((field) => field.classList.contains('ant-input-status-error'))).toBe(false);
  });
});

test('Should fill and submit form successfully', async ({ page }) => {
  await login({ page });

  // Fill first section
  await page.getByTestId('merchant-name-input').fill('Test Merchant');
  const rand9DigitNum = Math.floor(100000000 + Math.random() * 900000000).toString();
  await page.getByTestId('commercial-registration-number-input').fill(rand9DigitNum);
  await page.getByTestId('tax-registration-number-input').fill(rand9DigitNum);
  // Select first option of commercial-activity-category-select
  const categoriesSelect = page.getByTestId('commercial-activity-category-select');
  await categoriesSelect.click(); // Focus the input to show the options
  const categoriesInputId = await categoriesSelect.locator('input').getAttribute('id');
  const categoriesList = page.locator(`#${categoriesInputId}_list + div`); // The div that holds the options`);
  await categoriesList.locator('.ant-select-item, .ant-select-item-option').first().click(); // Select first option
  await page.locator('body').click(); // Click outside the select to blur it

  // Fill bank info section
  // Select first option of bank-name-select
  const bankNameSelect = page.getByTestId('bank-name-select');
  await bankNameSelect.click(); // Focus the input to show the options
  const bankNameInputId = await bankNameSelect.locator('input').getAttribute('id');
  const bankNameList = page.locator(`#${bankNameInputId}_list + div`); // The div that holds the options`);
  await bankNameList.locator('.ant-select-item, .ant-select-item-option').first().click(); // Select first option
  await page.locator('body').click(); // Click outside the select to blur it
  await page.getByTestId('bank-branch-name-input').fill('Test Branch');
  await page.getByTestId('bank-beneficiary-name-input').fill('Test Beneficiary');
  await page.getByTestId('bank-iban-input').fill('DE89370400440532013000');
  await page.getByTestId('bank-account-number-input').fill('12345678');
  await page.getByTestId('bank-swift-code-input').fill('TESTSWIFT');

  // Fill contact person section
  await page.getByTestId('contact-card').getByTestId('contact-first-name-input').fill('Test First Name');
  await page.getByTestId('contact-last-name-input').fill('Test Last Name');
  await page.getByTestId('contact-phone-number-input').fill('+201234567890');
  await page.getByTestId('contact-email-input').fill('test@example.com');

  // Prepare for waiting for request before clicking, Note no await here.
  const requestPromise = page.waitForRequest(
    (request) => request.url().endsWith('/create') && request.method() === 'POST'
  );
  // Prepare for waiting for response before clicking, Note no await here.
  const responsePromise = page.waitForResponse((response) => response.url().endsWith('/create'));

  // Click the submit button
  await page.locator('button[type="submit"]').click(); // Submit the form

  await requestPromise; // wait for request to be made
  const response = await responsePromise; // wait for response to be received
  expect(response.status()).toBe(200); // Expect a success response
});
