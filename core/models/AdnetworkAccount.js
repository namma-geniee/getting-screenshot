'use strict'

class AdnetworkAccount {
  /**
   * @param {string} adnetworkName
   * @param {string} accountName
   * @param {Object} credentials
   */
  constructor (adnetworkName, accountName, credentials) {
    this.adnetworkName = adnetworkName
    this.accountName   = accountName
    this.credentials   = credentials
  }
}

module.exports = AdnetworkAccount
