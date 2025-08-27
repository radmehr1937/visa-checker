import express from 'express';
import puppeteer from 'puppeteer-core';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/check', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // ورود به سامانه
    await page.goto(
      'https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth',
      { waitUntil: 'domcontentloaded' }
    );
    await page.type('#email-input-field', 'ozbajik@telegmail.com');
    await page.type('#password-input-field', '123456Negar@');
    await page.click('#btn-login');
    await page.waitForNavigation();

    // رفتن به صفحه نوبت‌گیری
    await page.goto(
      'https://visas-de.tlscontact.com/en-us/3487969/workflow/appointment-booking?location=irTHR2de',
      { waitUntil: 'domcontentloaded' }
    );

    // بررسی وجود دکمه فعال (یعنی وقت باز هست)
    const available = await page.$x(
      '//*[@id="main"]/div[1]/div/div[2]/div[3]/div/div[3]/div[2]/div/div/div/div/button[not(@disabled)]'
    );

    await browser.close();
    res.json({
      status: available.length > 0 ? 'AVAILABLE' : 'NOT_AVAILABLE'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
