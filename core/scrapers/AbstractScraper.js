'use strict';

const puppeteer     = require('puppeteer');
const fs            = require('fs.extra');
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
    this.scrapingTask = scrapingTask;
    this.browser      = undefined;
    this.page         = undefined
  }

  /**
   * @returns {string}
   */
  get historyStoragePath () {
    const task = this.scrapingTask;
    return storageHelper.getAccountStoragePath(
      task.adnetworkName,
      task.accountName,
      task.historyTime
    )
  }

  /**
   * Viewport configuration for the page.
   * Developer may OVERRIDE THIS.
   *
   * @returns {{width: {number}, height: {number}}}
   */
  get viewport () {
    return config.page.defaultViewport
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

    await fs.mkdirRecursiveSync(this.historyStoragePath)
  }

  /**
   * Main execution script
   *
   * @returns {Promise.<void>}
   */
  async run () {
    await this.init();

    const screenshotPath = `${this.historyStoragePath}/screenshot.png`;

    try {
      const authenticated = await this.login();
      if (!authenticated) {
        throw new Error(MESSAGE_AUTH_FAILED)
      }

      const revenue = await this.getRevenue();
      console.info(`> Revenue = ${revenue}`)
    }
    catch (err) {
      console.error('> Got error:', err)
    }

    // Save screenshot for the last screen whether succeeded or failed
    await this.page.screenshot({
      path:     screenshotPath,
      fullPage: true
    });

    // Close the browser after the task is done
    await this.browser.close()
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
