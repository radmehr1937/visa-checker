import express from "express";
import puppeteer from "puppeteer-core";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/check", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome"
    });

    const page = await browser.newPage();
    await page.goto("https://example.com", { waitUntil: "domcontentloaded" });

    // این قسمت را باید بر اساس ساختار سایت تغییر بدی
    const result = await page.evaluate(() => {
      const el = document.querySelector(".appointment");
      return el ? el.innerText : "وقت موجود نمی‌باشد";
    });

    await browser.close();
    res.json({ status: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
