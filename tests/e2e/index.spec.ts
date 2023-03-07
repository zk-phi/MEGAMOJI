import * as Path from "path";
import { test, expect } from "@playwright/test";
import ssim from "ssim.js";
import { loadFromPath } from "../utils/image";

test("ページタイトルが表示されている", async ({ page }) => {
  await page.goto("/");
  await expect(await page.getByRole("heading", { level: 1 })).toHaveText(/MEGAMOJI/);
});

test("ファーストビューに textarea が存在し、フォーカスが当たっている", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("textarea")).toBeFocused();
});

test("シンプルなテキスト絵文字を作成して、ダウンロードできる", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("hoge\nほげ");

  // プレビュー画像が更新される
  const src = await page.locator("img").evaluate((el) => (el as HTMLImageElement).src);
  expect(src).toMatch(/^blob:/);

  // 何らかのファイルがダウンロードできる
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("button", { hasText: "保存" }).click(),
  ]);
  const path = await download.path();

  // ダウンロードしたファイルが PNG
  expect(download.suggestedFilename()).toMatch(/\.png$/);

  // ダウンロードしたファイルがお手本と十分似ている
  const data1 = await loadFromPath(Path.resolve(__dirname, "./assets/textsample.png"));
  const data2 = await loadFromPath(path!);
  const { mssim } = ssim(data1, data2);
  expect(mssim).toBeGreaterThanOrEqual(0.9);
});

test("絵文字フォントを使用した絵文字を作成して、ダウンロードできる", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("👍");

  // 生成待ち
  const src = await page.locator("img").evaluate((el) => (el as HTMLImageElement).src);

  // ダウンロード待ち
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("button", { hasText: "保存" }).click(),
  ]);
  const path = await download.path();

  // ダウンロードしたファイルがお手本とある程度似ている
  const data1 = await loadFromPath(Path.resolve(__dirname, "./assets/emojisample.png"));
  const data2 = await loadFromPath(path!);
  const { mssim } = ssim(data1, data2);
  expect(mssim).toBeGreaterThanOrEqual(0.5);
});
