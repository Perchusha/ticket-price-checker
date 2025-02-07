# Ticket Price Checker

Ticket Price Checker is a Node.js script that monitors ticket prices on specified websites and sends notifications when prices drop below a defined threshold.

## 📌 Features
- Uses Playwright to scrape ticket websites.
- Sends notifications via `node-notifier` when a ticket price is below the threshold.
- Checks for tickets at a specified time interval.
- **Logs price history** to track fluctuations over time.
- **Implements anti-bot measures** like rotating User-Agents and request delays.

## 🚀 Installation & Usage
### 1. Install dependencies
```sh
npm install
```

### 2. Run the script
```sh
npm start
```

## 🔧 Configuration
Configuration is located in `constants.js`:

### 📌 Website Configuration
```js
export const SITES = [
  {
    "name": "AleBilet",
    "url": "https://www.alebilet.pl/bilety/billie_eilish/2025-06-03/17:30/hit-me-hard-and-soft-tour",
    "selectors": {
      "ticketList": "#ticket-list",
      "row": "tbody tr",
      "category": "td:nth-child(1) .cat",
      "price": "td.price b",
      "availability": "td.availability"
    }
  }
];
```
- `name` - Website name.
- `url` - Ticket listing URL.
- `selectors` - CSS selectors for extracting ticket data.

### 🔥 Price Threshold
```js
export const PRICE_THRESHOLD = 1500;
```
If a ticket is found below 1500 PLN, a notification is sent.

### ⏳ Check Interval
```js
export const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
```
Defines how often the script checks ticket prices.

### 📊 Price Logging
The script logs ticket prices into `prices.json` for tracking price trends. This allows users to analyze price changes over time.

### 🛡 Anti-Bot Protection
To prevent being blocked by websites, the script includes:
- **Rotating User-Agents** to mimic different devices.
- **Randomized delays** between requests to avoid detection.
- **Automatic retries** in case of request failures.

## 📜 License
This project is licensed under the MIT License.

---

🎟 **Ticket Price Checker** — automate ticket monitoring and catch the best deals! 🚀

