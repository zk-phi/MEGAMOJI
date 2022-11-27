import { test, expect } from "@playwright/test";

const sleep = async (delay: number) => new Promise((resolve) => {
  setTimeout(resolve, delay);
});

test("ページタイトルが表示されている", async ({ page }) => {
  await page.goto("/");
  await expect(await page.getByRole("heading", { level: 1 })).toHaveText(/MEGAMOJI/);
});

test("ファーストビューに textarea が存在し、フォーカスが当たっている", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("textarea")).toBeFocused();
});

test("textarea に文字列を入力すると何らかの画像が表示される", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("hoge\nhoge");
  const src = await page.locator("img").evaluate((el) => (el as HTMLImageElement).src);
  expect(src).toMatch(/^blob:/);
});

test("保存ボタンを押すと何らかの PNG ファイルがダウンロードされる", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("hoge\nhoge");
  const [ download ] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("button", { hasText: "保存" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.png$/);
});
