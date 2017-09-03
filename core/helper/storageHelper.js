'use strict'

const path = require('path')
const moment = require('moment')

const STORAGE_ROOT_PATH = path.join(__dirname, '../../storage')

/**
 * @param {string} storageRelativePath
 * @returns {string}
 */
exports.getStoragePath = function (storageRelativePath ) {
  return path.join(STORAGE_ROOT_PATH, storageRelativePath)
}

/**
 * @param {string} adnetworkName
 * @returns {string}
 */
exports.getAdnetworkStoragePath = function (adnetworkName) {
  return this.getStoragePath(adnetworkName)
}

/**
 * @param {string} adnetworkName
 * @param {string} accountName
 * @param {Date} date
 * @returns {string}
 */
exports.getAccountStoragePath = function (adnetworkName, accountName, date = undefined) {
  const yearAndMonth = date ? moment(date).format('YYYY-MM') : undefined
  return this.getStoragePath(`${adnetworkName}/${accountName}/${yearAndMonth}`)
}
