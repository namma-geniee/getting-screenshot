'use strict';

const fs              = require('fs');
const cron            = require('node-cron');
const aladdinFrontApi = require('../core/aladdinFrontApi');
const scraperHelper   = require('../core/helper/scraperHelper');

const SHIFTED_TASKS_COUNT = 16;
const NEWLINE             = '\r\n';

process.setMaxListeners(0);

(async function () {
  const tasks = await aladdinFrontApi.getTodayTasks();

  // Run each 10 simultaneously
  while (tasks.length > 0) {
    const shiftedTasks  = tasks.splice(0, SHIFTED_TASKS_COUNT);
    await Promise.all(
      shiftedTasks.map(function (task) {
        const scraper = scraperHelper.createInstance(task);
        return executeScraper(scraper);
      })
    );
  }
})();

/**
 * @param {AbstractScraper} scraper
 * @returns {Promise}
 */
function executeScraper (scraper) {
  return scraper
    .run()
    .then(function (result) {
      appendResultToLogFile(scraper, result);
    })
    .catch(function (err) {
      appendResultToLogFile(scraper, err);
    })
    .then(function () {
      const task = scraper.scrapingTask;
      console.log(`Finish execution for ${task.accountName} of ${task.adnetworkName}`)
    });
}

/**
 * @param {AbstractScraper} scraper
 * @param {*} result
 */
function appendResultToLogFile (scraper, result) {
  const stringified = JSON.stringify(result, undefined, 2);
  fs.appendFileSync(scraper.logFilePath, stringified + NEWLINE);
}
