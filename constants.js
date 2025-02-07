export const SITES = [
  {
    name: 'AleBilet',
    url: 'https://www.alebilet.pl/bilety/billie_eilish/2025-06-03/17:30/hit-me-hard-and-soft-tour',
    selectors: {
      ticketList: '#ticket-list',
      row: 'tbody tr',
      category: 'td:nth-child(1) .cat',
      price: 'td.price b',
      availability: 'td.availability',
    },
  },
];

export const CURRENCY = 'PLN';

export const PRICE_THRESHOLD = 1500;

export const CHECK_INTERVAL = 5 * 60 * 1000;
