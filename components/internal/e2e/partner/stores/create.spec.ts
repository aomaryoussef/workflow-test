import { expect, test } from '@playwright/test';

import { login, urls } from '../../e2e.helpers';

// Test to ensure the store creation page is protected by login
test('Should be protected by login', async ({ page }) => {
  // Attempt to navigate directly to the store creation page
  await page.goto(urls.storeCreation);
  // Expect to be redirected to the login page
  await expect(page).toHaveURL(urls.login);
});

// Test suite for checking the existence and visibility of form fields
test.describe('Form fields should be existent and visible', () => {
  test.beforeEach(async ({ page }) => {
    await login({ page });
    await page.goto(urls.storeCreation); // Go to the store creation page
  });

  // Check for the presence of the "Create" heading
  test('Should have "Create Partner Store" heading', async ({ page }) => {
    // Expect the heading to be visible
    await expect(page.getByRole('heading', { name: 'Create Partner Store', exact: false })).toBeVisible();
  });

  // Check for the presence of the Partner select field
  test('Should have Partner select', async ({ page }) => {
    // Expect the partner select field to be visible
    await expect(page.getByTestId('partner-select')).toBeVisible();
  });

  test('Should have Store name input', async ({ page }) => {
    // Expect the store name input to be visible
    await expect(page.getByTestId('store-name-input')).toBeVisible();
  });

  test('Should have governorate select', async ({ page }) => {
    // Expect the governorate select to be visible
    await expect(page.getByTestId('store-governorate-select')).toBeVisible();
  });

  test('Should have city select', async ({ page }) => {
    // Expect the city select to be visible
    await expect(page.getByTestId('store-city-select')).toBeVisible();
  });

  test('Should have area input', async ({ page }) => {
    // Expect the area input to be visible
    await expect(page.getByTestId('store-area-input')).toBeVisible();
  });

  test('Should have street input', async ({ page }) => {
    // Expect the store street input to be visible
    await expect(page.getByTestId('store-street-input')).toBeVisible();
  });

  // Check for the presence of the Submit button
  test('Should have Submit button', async ({ page }) => {
    // Expect the submit button to be visible
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

// Test suite for validating form field inputs
test.describe('Form fields should accept only valid values', () => {
  test.beforeEach(login);

  // Test to ensure the Partner select has options
  test('Partner select should have options', async ({ page }) => {
    const partnerSelect = page.getByTestId('partner-select');
    // Click the partner select to open the dropdown
    await partnerSelect.click();
    // Get the input ID for the select
    const partnerInputId = await partnerSelect.locator('input').getAttribute('id');
    // Locate the list of options
    const partnerList = page.locator(`#${partnerInputId}_list + div`);
    // Expect there to be at least one option
    expect(await partnerList.locator('.ant-select-item, .ant-select-item-option').count()).toBeGreaterThan(0);
    // Click outside to close the dropdown
    await page.locator('body').click();
  });

  test('Governorate select should have options', async ({ page }) => {
    const governorateSelect = page.getByTestId('store-governorate-select');
    await governorateSelect.click();
    const governorateInputId = await governorateSelect.locator('input').getAttribute('id');
    const governorateList = page.locator(`#${governorateInputId}_list + div`);
    expect(await governorateList.locator('.ant-select-item, .ant-select-item-option').count()).toBeGreaterThan(0);
    await page.locator('body').click();
  });

  test('City select should have options', async ({ page }) => {
    // First we must select a governorate
    const governorateSelect = page.getByTestId('store-governorate-select');
    await governorateSelect.click();
    const governorateInputId = await governorateSelect.locator('input').getAttribute('id');
    const governorateList = page.locator(`#${governorateInputId}_list + div`);
    await governorateList.locator('.ant-select-item, .ant-select-item-option').first().click();
    await page.locator('body').click();

    // Select a city
    const citySelect = page.getByTestId('store-city-select');
    await citySelect.click();
    const cityInputId = await citySelect.locator('input').getAttribute('id');
    const cityList = page.locator(`#${cityInputId}_list + div`);
    expect(await cityList.locator('.ant-select-item, .ant-select-item-option').count()).toBeGreaterThan(0);
    await page.locator('body').click();
  });

  // Test to validate the Store name input
  test('Store name should not be empty', async ({ page }) => {
    const storeNameInput = page.getByTestId('store-name-input');
    await storeNameInput.fill('1'); // Fill the input with something
    await storeNameInput.fill(''); // Empty the input
    // Expect an error class to be present
    expect(await storeNameInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(true);
    // Fill in a valid store name
    await storeNameInput.fill('Valid Store Name');
    // Expect the error class to be removed
    expect(await storeNameInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(false);
  });

  test('Area should not be empty', async ({ page }) => {
    const areaInput = page.getByTestId('store-area-input');
    await areaInput.fill('1'); // Fill the input with something
    await areaInput.fill(''); // Empty the input
    // Expect an error class to be present
    expect(await areaInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(true);
    // Fill in a valid area
    await areaInput.fill('Valid Area');
    // Expect the error class to be removed
    expect(await areaInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(false);
  });

  test('Street should not be empty', async ({ page }) => {
    const streetInput = page.getByTestId('store-street-input');
    await streetInput.fill('1'); // Fill the input with something
    await streetInput.fill(''); // Empty the input
    // Expect an error class to be present
    expect(await streetInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(true);
    // Fill in a valid street
    await streetInput.fill('Valid Street');
    // Expect the error class to be removed
    expect(await streetInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(false);
  });

  // Test to validate the Google Maps link input
  test('Google Maps link should be a valid url', async ({ page }) => {
    const mapsLinkInput = page.getByTestId('store-google-maps-link-input');
    // Try to submit an invalid link
    await mapsLinkInput.fill('invalid-link');
    // Expect an error class to be present
    expect(await mapsLinkInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(true);
    // Fill in a valid Google Maps link
    await mapsLinkInput.fill('https://goo.gl/maps/valid-location');
    // Expect the error class to be removed
    expect(await mapsLinkInput.evaluate((el) => el.classList.contains('ant-input-status-error'))).toBe(false);
  });

  test('Google Maps link should update latitude and longitude correctly', async ({ page }) => {
    const mapsLinkInput = page.getByTestId('store-google-maps-link-input');
    const latitudeInput = page.getByTestId('store-latitude-input');
    const longitudeInput = page.getByTestId('store-longitude-input');

    const validLink =
      'https://www.google.com/maps/place/b_labs/@29.9794671,31.3580415,17z/data=!3m1!4b1!4m6!3m5!1s0x14583b8a37216725:0x4a3c4e6194ea5933!8m2!3d29.9794625!4d31.3554666!16s%2Fg%2F11sthl8mll?entry=ttu';

    // Fill in the valid Google Maps link
    await mapsLinkInput.fill(validLink);
    await mapsLinkInput.blur();

    // Expect latitude and longitude to be updated with specific values
    const expectedLatitude = '29.9794671';
    const expectedLongitude = '31.3580415';

    expect(await latitudeInput.inputValue()).toBe(expectedLatitude);
    expect(await longitudeInput.inputValue()).toBe(expectedLongitude);

    await mapsLinkInput.fill('https://goo.gl/maps/valid-location');
    await mapsLinkInput.blur();
    expect(await latitudeInput.inputValue()).toBe('0');
    expect(await longitudeInput.inputValue()).toBe('0');
  });
});

// Test to fill out the form completely and submit successfully
test('Should fill and submit form successfully', async ({ page }) => {
  await login({ page });

  // Select a partner
  const partnerSelect = page.getByTestId('partner-select');
  await partnerSelect.click();
  const partnerInputId = await partnerSelect.locator('input').getAttribute('id');
  const partnerList = page.locator(`#${partnerInputId}_list + div`);
  await partnerList.locator('.ant-select-item, .ant-select-item-option').first().click();
  await partnerSelect.blur();

  // Select a governorate
  const governorateSelect = page.getByTestId('store-governorate-select');
  await governorateSelect.click();
  const governorateInputId = await governorateSelect.locator('input').getAttribute('id');
  const governorateList = page.locator(`#${governorateInputId}_list + div`);
  await governorateList.locator('.ant-select-item, .ant-select-item-option').first().click();
  await governorateSelect.blur();

  // Select a city
  const citySelect = page.getByTestId('store-city-select');
  await citySelect.click();
  const cityInputId = await citySelect.locator('input').getAttribute('id');
  const cityList = page.locator(`#${cityInputId}_list + div`);
  await cityList.locator('.ant-select-item, .ant-select-item-option').first().click();
  await citySelect.blur();

  // Fill remaining store details
  await page.getByTestId('store-name-input').fill('Test Store');
  await page.getByTestId('store-area-input').fill('Test Area');
  await page.getByTestId('store-street-input').fill('Test Street');
  await page
    .getByTestId('store-google-maps-link-input')
    .fill(
      'https://www.google.com/maps/place/b_labs/@29.9794671,31.3580415,17z/data=!3m1!4b1!4m6!3m5!1s0x14583b8a37216725:0x4a3c4e6194ea5933!8m2!3d29.9794625!4d31.3554666!16s%2Fg%2F11sthl8mll?entry=ttu'
    );
  await page.getByTestId('store-google-maps-link-input').blur();

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
