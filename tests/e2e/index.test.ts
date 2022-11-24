const sleep = async (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

describe("/", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8080");
  });
  it("ページが表示される", async () => {
    const text = await page.evaluate(() => document.body.textContent);
    await expect(text).toContain("MEGAMOJI");
  });
  it("textarea に文字列を入力すると何らかの画像が生成される", async () => {
    await page.type("textarea", "hogen\nhoge");
    await sleep(3000);
    const imageSrc = await page.evaluate(() => document.body.getElementsByTagName("img")[0].src);
    await expect(imageSrc).toContain("blob:");
  });
});
