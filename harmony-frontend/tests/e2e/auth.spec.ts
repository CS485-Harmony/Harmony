import { expect, test, type Page, type TestInfo } from '@playwright/test';
import {
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_PASSWORD,
  DEFAULT_JOIN_SERVER_SLUG,
  SEEDED_PRIVATE_CHANNEL,
  SEEDED_PUBLIC_CHANNEL,
  SIGNUP_USER,
} from './support/stack.shared.mjs';

function sanitizeIdentifier(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
}

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPublicChannelPath() {
  return `/c/${SEEDED_PUBLIC_CHANNEL.serverSlug}/${SEEDED_PUBLIC_CHANNEL.channelSlug}`;
}

function getPrivateChannelPath() {
  return `/channels/${SEEDED_PRIVATE_CHANNEL.serverSlug}/${SEEDED_PRIVATE_CHANNEL.channelSlug}`;
}

const NAVIGATION_TIMEOUT_MS = 15_000;

async function signUpMember(page: Page, testInfo: TestInfo) {
  const { project, retry } = testInfo;
  const normalizedProject = sanitizeIdentifier(project.name).slice(0, 8);
  const uniqueSuffix = `${normalizedProject}-${retry}-${Date.now().toString(36)}`;
  const emailLocalPart = `${SIGNUP_USER.username}-${uniqueSuffix}`.replace(/_/g, '-');
  const email = `${emailLocalPart}@harmony.test`;
  const username = `${SIGNUP_USER.username}_${uniqueSuffix}`.slice(0, 32);

  await page.goto('/auth/signup');
  await page.getByLabel(/^Email/).fill(email);
  await page.getByLabel(/^Username/).fill(username);
  await page.getByLabel('Display Name').fill(SIGNUP_USER.displayName);
  await page.getByLabel(/^Password/).fill(SIGNUP_USER.password);
  await page.getByRole('button', { name: 'Continue' }).click();
}

async function logInDevAdmin(page: Page, destination = getPrivateChannelPath()) {
  await page.goto(destination);

  await expect(page).toHaveURL(
    new RegExp(`/auth/login\\?returnUrl=${encodeURIComponent(destination)}$`),
    { timeout: NAVIGATION_TIMEOUT_MS },
  );

  await page.getByLabel('Email').fill(DEV_ADMIN_EMAIL);
  await page.getByLabel('Password').fill(DEV_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL(new RegExp(`${escapeForRegExp(destination)}$`), {
    timeout: NAVIGATION_TIMEOUT_MS,
  });
}

test.describe('True E2E auth and access flows', () => {
  test('guest can read a seeded public channel', async ({ page }) => {
    await page.goto(getPublicChannelPath());

    await expect(
      page.getByRole('banner').getByText(SEEDED_PUBLIC_CHANNEL.serverName, { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: SEEDED_PUBLIC_CHANNEL.channelName, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(SEEDED_PUBLIC_CHANNEL.welcomeText).first()).toBeVisible();
    await expect(page.getByLabel('Join server promotion')).toBeVisible();
  });

  test('guest is denied access to a private channel', async ({ page }) => {
    await page.goto(
      `/c/${SEEDED_PRIVATE_CHANNEL.serverSlug}/${SEEDED_PRIVATE_CHANNEL.channelSlug}`,
    );

    await expect(page.getByRole('heading', { name: 'This channel is private' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Account' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log In' })).toHaveAttribute(
      'href',
      new RegExp(
        `returnUrl=%2Fc%2F${SEEDED_PRIVATE_CHANNEL.serverSlug}%2F${SEEDED_PRIVATE_CHANNEL.channelSlug}$`,
      ),
    );
  });

  test('dev admin can log in through the real backend and access a private channel', async ({
    page,
  }) => {
    await logInDevAdmin(page);
    await expect(page.getByLabel(`Message #${SEEDED_PRIVATE_CHANNEL.channelName}`)).toBeVisible();
  });

  test('newly registered users join the seeded default server and land on the authenticated channel view', async ({
    page,
  }, testInfo) => {
    await signUpMember(page, testInfo);

    await expect(page).toHaveURL(
      new RegExp(`/channels/${DEFAULT_JOIN_SERVER_SLUG}/${SEEDED_PUBLIC_CHANNEL.channelSlug}$`),
      { timeout: NAVIGATION_TIMEOUT_MS },
    );
    await expect(page.getByLabel(`Message #${SEEDED_PUBLIC_CHANNEL.channelName}`)).toBeVisible();
    await expect(page.getByText(SEEDED_PUBLIC_CHANNEL.welcomeText).first()).toBeVisible();
  });

  test('authenticated sessions survive a full page reload on protected routes', async ({
    page,
  }) => {
    const privateChannelPath = getPrivateChannelPath();

    await logInDevAdmin(page, privateChannelPath);
    await page.reload();

    await expect(page).toHaveURL(new RegExp(`${escapeForRegExp(privateChannelPath)}$`), {
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await expect(page.getByLabel(`Message #${SEEDED_PRIVATE_CHANNEL.channelName}`)).toBeVisible();
  });

  test('authenticated users can send a real message through the backend', async ({
    page,
  }, testInfo) => {
    const messageInput = page.getByLabel(`Message #${SEEDED_PRIVATE_CHANNEL.channelName}`);
    const messageLog = page.getByRole('log', {
      name: `Messages in #${SEEDED_PRIVATE_CHANNEL.channelName}`,
    });
    const messageText = `E2E message ${sanitizeIdentifier(testInfo.project.name)} ${Date.now()}`;

    await logInDevAdmin(page);

    await messageInput.fill(messageText);
    await messageInput.press('Enter');

    await expect(messageInput).toHaveValue('');
    await expect(messageLog.getByText(messageText)).toBeVisible();
  });

  test('logging out from an authenticated route returns the user to a guest-safe channel', async ({
    page,
  }) => {
    await logInDevAdmin(page);

    await page.getByLabel('User Settings').click();
    await expect(page).toHaveURL(
      new RegExp(`/settings\\?returnTo=${encodeURIComponent(getPrivateChannelPath())}$`),
      { timeout: NAVIGATION_TIMEOUT_MS },
    );

    await page
      .getByRole('navigation', { name: 'Settings navigation' })
      .getByRole('button', { name: 'Log Out', exact: true })
      .click();
    await page
      .getByRole('main', { name: 'Settings content' })
      .getByRole('button', { name: 'Log Out', exact: true })
      .click();

    await expect(page).toHaveURL(new RegExp(`${escapeForRegExp(getPublicChannelPath())}$`), {
      timeout: NAVIGATION_TIMEOUT_MS,
    });
    await expect(page.getByLabel('Join server promotion')).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'Log In',
      }),
    ).toBeVisible();
  });
});
