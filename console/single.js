'use strict';

const commander       = require('commander');
const aladdinFrontApi = require('../core/aladdinFrontApi');
const scraperHelper   = require('../core/helper/scraperHelper');
const ScrapingTask    = require('../core/models/ScrapingTask');

let id = undefined;

commander
  .arguments('<accountId>')
  .action(accountId => id = accountId)
  .parse(process.argv);

if (id === undefined) {
  console.error('Account ID is required');
  process.exit(1);
}

(async function () {
  const account   = await aladdinFrontApi.getAdnetworkAccount(id);
  const task      = new ScrapingTask(new Date(), account);
  const scraper   = scraperHelper.createInstance(task);
  const startTime = Date.now();

  scraper
    .run()
    .then(function () {
      const endTime    = Date.now();
      const elapsedMs  = endTime - startTime;
      const elapsedSec = (elapsedMs / 1000).toFixed(3);
      console.log(`> Execution time = ${elapsedMs}ms ~ ${elapsedSec}s`);
    });

  console.log(`> Scraping task for account "${task.accountName}" of adnetwork "${task.adnetworkName}" has been executed.`);
})();
