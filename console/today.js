'use strict';

const fs              = require('fs');
const cron            = require('node-cron');
const winston         = require('winston');
const aladdinFrontApi = require('../core/aladdinFrontApi');
const scraperHelper   = require('../core/helper/scraperHelper');

const SHIFTED_TASKS_COUNT = 16;

process.setMaxListeners(0);

(async function () {
  const tasks = await aladdinFrontApi.getTodayTasks();

  // Run each 10 simultaneously
  while (tasks.length > 0) {
    const shiftedTasks = tasks.splice(0, SHIFTED_TASKS_COUNT);
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
  const taskName = `$\{task.accountName} of $\{task.adnetworkName}`;
  return scraper
    .run()
    .then(function (summary) {
      winston.info(`Finish task for ${taskName}`, summary);
    })
    .catch(function (err) {
      winston.error(`Got error while running task for ${taskName}`, err)
    });
}
