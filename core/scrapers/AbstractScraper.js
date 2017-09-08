'use strict';

const path          = require('path');
const puppeteer     = require('puppeteer');
const fs            = require('fs.extra');
const winston       = require('winston');
const storageHelper = require('../helper/storageHelper');
const slackNotifier = require('../slack/notifier');
const config        = require('../../config');

const MESSAGE_METHOD_NOT_IMPLEMENTED = 'Method not implemented';
const MESSAGE_AUTH_FAILED            = 'Authentication failed';

class AbstractScraper {
  /**
   * @param {ScrapingTask} scrapingTask
   */
  constructor (scrapingTask) {
    const { adnetworkId, accountId } = scrapingTask;
    const logFile  = storageHelper.getTaskLogPath(scrapingTask);
    const logLabel = `#${accountId}`;

    this.scrapingTask   = scrapingTask;
    this.browser        = undefined;
    this.page           = undefined;
    this.viewport       = config.page.defaultViewport;
    this.screenshotPath = `/tmp/getting-screenshot-${adnetworkId}-${accountId}.png`;
    this.logFile        = logFile;
    this.logger         = new winston.Logger({
      transports: [
        new winston.transports.File({
          level:       'debug',
          label:       logLabel,
          filename:    logFile,
          json:        false,
          prettyPrint: true
        })
      ]
    });
  }

  /**
   * Preparation before execution.
   * Eg. create new instances for browser and page
   *
   * @returns {Promise.<void>}
   */
  async init () {
    this.browser = await puppeteer.launch(config.browser);
    this.page    = await this.browser.newPage();

    await this.page.setViewport(this.viewport);

    fs.mkdirRecursiveSync(path.dirname(this.logFile));
  }

  /**
   * Main execution script
   *
   * @returns {Promise.<{Object}>}
   */
  async run () {
    const { logger } = this;
    // Some of summary data will be defined later in & after scraping process
    const summary = {
      revenue:        undefined,
      screenshotPath: this.screenshotPath,
      startTime:      new Date(),
      endTime:        undefined,
      elapsedMs:      undefined,
      elapsedSec:     undefined
    };

    try {
      await this.init();

      logger.info('Start authentication');
      const authenticated = await this.login();
      if (!authenticated) {
        throw new Error(MESSAGE_AUTH_FAILED)
      }
      logger.info('Authenticated');

      logger.info('Start collecting revenue');
      summary.revenue = await this.getRevenue();
      logger.info('Revenue collected:', summary.revenue);

      // Save screenshot for the last screen whether succeeded or failed
      logger.info('Start taking screenshot for the last screen');
      await this.page.screenshot({
        path:     summary.screenshotPath,
        fullPage: true
      });
      logger.info('Screenshot saved:', summary.screenshotPath);

      // Close the browser after the task is done
      await this.browser.close();

      summary.endTime    = new Date();
      summary.elapsedMs  = summary.endTime - summary.startTime;
      summary.elapsedSec = (summary.elapsedMs / 1000).toFixed(3);
      logger.info('SUMMARY', summary);

      return summary;
    } catch (err) {
      logger.error(err);
      await this.browser.close();
      throw err;
    }
  }

  /**
   * This method MUST be implemented
   *
   * @returns {Promise.<boolean>}
   */
  async login () {
    throw new Error(MESSAGE_METHOD_NOT_IMPLEMENTED)
  }

  /**
   * This method MUST be implemented
   *
   * @returns {Promise.<number>}
   */
  async getRevenue () {
    throw new Error(MESSAGE_METHOD_NOT_IMPLEMENTED)
  }

  /**
   * Transform the money string into a number
   *
   * @param {string} moneyString
   */
  extractMoney (moneyString) {
    const extracted = moneyString.replace(/[,\s\%￥$]/g, '');
    return parseFloat(extracted)
  }
}

module.exports = AbstractScraper;
