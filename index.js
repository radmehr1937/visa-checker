const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/check', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // ورود به سایت
  await page.goto('https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth', { waitUntil: 'domcontentloaded' });
  await page.type('#email-input-field', 'ozbajik@telegmail.com');
  await page.type('#password-input-field', '123456Negar@');
  await page.click('#btn-login');
  await page.waitForNavigation();

  // رفتن به صفحه وقت
  await page.goto('https://visas-de.tlscontact.com/en-us/3487969/workflow/appointment-booking?location=irTHR2de', { waitUntil: 'domcontentloaded' });

  // بررسی دکمه وقت
  const available = await page.$x('//*[@id="main"]/div[1]/div/div[2]/div[3]/div/div[3]/div[2]/div/div/div/div/button[not(@disabled)]');
  
  await browser.close();
  res.json({ status: available.length > 0 ? 'AVAILABLE' : 'NOT_AVAILABLE' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
