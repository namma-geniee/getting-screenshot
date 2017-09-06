'use strict';

const path   = require('path');
const config = require('../../config');

const SCRAPER_CLASS_PATH = path.join(__dirname, '../scrapers');

/**
 * @param {string} adnetworkName
 */
exports.getScraperClass = function (adnetworkName) {
  const className = config.scrapers[adnetworkName];
  if (!className) {
    throw new Error(`Scraper for adnetwork "${adnetworkName}" is not configured`);
  }
  const classPath = `${SCRAPER_CLASS_PATH}/${className}`;

  return require(classPath);
};

/**
 * @param {ScrapingTask} task
 * @returns {AbstractScraper}
 */
exports.createInstance = function (task) {
  const Scraper = this.getScraperClass(task.adnetworkName);
  return new Scraper(task);
};
