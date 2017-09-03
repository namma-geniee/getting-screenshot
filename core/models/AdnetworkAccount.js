'use strict'

class AdnetworkAccount {
  /**
   * @param {string} adnetworkName
   * @param {string} acccountName
   * @param {Object} credentials
   */
  constructor (adnetworkName, acccountName, credentials) {
    this.adnetworkName = adnetworkName
    this.accountName   = acccountName
    this.credentials   = credentials
  }
}

module.exports = AdnetworkAccount
