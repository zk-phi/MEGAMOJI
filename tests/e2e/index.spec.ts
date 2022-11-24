import { test, expect } from "@playwright/test";

const sleep = async (delay: number) => new Promise((resolve) => {
  setTimeout(resolve, delay);
});

test("ページが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(await page.getByRole("heading", { level: 1 })).toHaveText(/MEGAMOJI/);
});

test("textarea に文字列を入力すると何らかの画像が生成される", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox").fill("hoge\nhoge");
  await sleep(3000);
  const src = await page.evaluate(() => document.body.getElementsByTagName("img")[0].src);
  expect(src).toMatch(/^blob:/);
});
