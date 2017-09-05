'use strict';

const ScrapingTask     = require('../core/models/ScrapingTask');
const AdnetworkAccount = require('../core/models/AdnetworkAccount');
const IMobileScraper   = require('../core/scrapers/IMobileScraper');

const task = new ScrapingTask(
  new Date(),
  new Date(),
  new AdnetworkAccount('i-mobile', 'i-mobile1', {
    username: 'media@geniee.co.jp',
    password: 'kasemituyo'
  })
);

const scraper = new IMobileScraper(task);

scraper.run()
  .then(() => console.info('> Done!'))
  .catch(err => console.error(err));
