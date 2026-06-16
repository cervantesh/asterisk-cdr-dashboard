import { expect, test } from '@playwright/test';

test('protects dashboard and renders after login', async ({ page }) => {
	await page.goto('/app/dashboard');
	await expect(page).toHaveURL(/\/login/);

	await page.getByLabel('Username').fill('admin');
	await page.getByLabel('Password').fill('admin123');
	await page.getByRole('button', { name: 'Log in' }).click();

	await expect(page).toHaveURL(/\/app\/dashboard/);
	await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	await expect(page.getByText('Total Calls')).toBeVisible();
});

test('blocks unauthenticated report exports', async ({ request }) => {
	const response = await request.get('/api/cdr/reports/call-details/export.csv');
	expect(response.status()).toBe(401);
});
