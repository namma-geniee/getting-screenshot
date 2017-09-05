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
 * @param {string} adnetworkName
 * @returns {string}
 */
exports.getAdnetworkStoragePath = function (adnetworkName) {
  return path.join(STORAGE_DATA_PATH, adnetworkName)
};

/**
 * @param {string} adnetworkName
 * @param {string} accountName
 * @param {Date} date
 * @returns {string}
 */
exports.getAccountStoragePath = function (adnetworkName, accountName, date) {
  const yearAndMonth = date ? moment(date).format('YYYY-MM') : undefined;
  const adnetworkPath = this.getAdnetworkStoragePath(adnetworkName);

  return path.join(adnetworkPath, `${yearAndMonth}/${accountName}`)
};
