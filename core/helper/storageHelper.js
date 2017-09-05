'use strict';

const path = require('path');
const moment = require('moment');

const STORAGE_ROOT_PATH = path.join(__dirname, '../../storage');
const STORAGE_DATA_PATH = path.join(STORAGE_ROOT_PATH, 'data');

/**
 * @param {string} storageRelativePath
 * @returns {string}
 */
exports.getStoragePath = function (storageRelativePath ) {
  return path.join(STORAGE_ROOT_PATH, storageRelativePath)
};

/**
 * @param {ScrapingTask} task
 * @returns {string}
 */
exports.getTaskStoragePath = function (task) {
  const yearAndMonth = moment(task.scheduleTime).format('YYYY-MM');
  return path.join(STORAGE_DATA_PATH, `${yearAndMonth}/${task.adnetworkName}/${task.accountName}`);
};
