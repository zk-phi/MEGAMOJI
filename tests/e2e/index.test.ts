describe("Load index page", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8080");
  });
  it("Succeed to render the page", async () => {
    const text = await page.evaluate(() => document.body.textContent);
    await expect(text).toContain("MEGAMOJI");
  });
});
