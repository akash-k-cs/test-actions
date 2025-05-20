import { expect, Page } from "@playwright/test";
import { ctest } from "./fixutre";

const n = 2;
let fileName = "";
const filenameTitle = process.env.CONFIG_FILENAME
let page: Page;

ctest.beforeAll(`Suite ${n}`, async ({ browser, configFileName }) => {
  page = await browser.newPage();
  fileName = configFileName;
});

ctest(`${n} | ${filenameTitle} : has title`, async ({}) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(fileName).not.toBe(null);
  await expect(page).toHaveTitle(/Playwright/);
});

ctest(`${n} | ${filenameTitle} : get started link`, async ({}) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
