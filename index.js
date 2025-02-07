import { chromium } from 'playwright';
import notifier from 'node-notifier';
import fs from 'fs';
import { SITES, PRICE_THRESHOLD, CHECK_INTERVAL, CURRENCY } from './constants.js';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
];

function logPrices(site, tickets) {
  const logFile = 'prices.json';
  let history = [];

  if (fs.existsSync(logFile)) {
    history = JSON.parse(fs.readFileSync(logFile, 'utf8'));
  }

  const timestamp = new Date().toISOString();
  tickets.forEach(ticket => {
    history.push({
      site: site.name,
      category: ticket.category,
      price: ticket.price,
      availability: ticket.availability,
      timestamp,
    });
  });

  fs.writeFileSync(logFile, JSON.stringify(history, null, 2));
}

async function fetchTickets(site) {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ userAgent });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await new Promise(res => setTimeout(res, Math.random() * 3000 + 1000));
  await page.goto(site.url, { waitUntil: 'domcontentloaded' });

  try {
    await page.waitForSelector(site.selectors.ticketList, { timeout: 5000 });
    return await page.$$eval(
      site.selectors.row,
      (rows, selectors) => {
        return rows
          .map(row => {
            const categoryNode = row.querySelector(selectors.category);
            const category = categoryNode ? categoryNode.childNodes[0]?.textContent.trim() : null;
            const priceText = row.querySelector(selectors.price)?.innerText.trim();
            const availability = row.querySelector(selectors.availability)?.innerText.trim();

            if (!category || !priceText) return null;

            const price = parseFloat(priceText.replace(/\s|zł/g, '').replace(',', '.'));
            return { category, price, availability };
          })
          .filter(Boolean);
      },
      site.selectors
    );
  } catch (error) {
    console.error(`Error fetching tickets from ${site.name}:`, error);
    return [];
  } finally {
    await browser.close();
  }
}

async function checkPrices() {
  for (const site of SITES) {
    console.log(`Checking ${site.name}...`);
    const tickets = await fetchTickets(site);

    if (tickets.length > 0) {
      logPrices(site, tickets);

      const categories = {};
      tickets.forEach(ticket => {
        if (!categories[ticket.category]) {
          categories[ticket.category] = [];
        }
        categories[ticket.category].push(ticket);
      });

      Object.entries(categories).forEach(([category, tickets]) => {
        const minPrice = Math.min(...tickets.map(t => t.price));

        if (minPrice < PRICE_THRESHOLD) {
          notifier.notify({
            title: `🔥 ${site.name} - ${category}!`,
            message: `${minPrice} ${CURRENCY}.`,
          });
        }
      });
    }
  }
}

(async () => {
  checkPrices();
  setInterval(checkPrices, CHECK_INTERVAL);
})();
