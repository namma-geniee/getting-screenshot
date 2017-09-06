'use strict';

class AdnetworkAccount {
  /**
   * @param {number} adnetworkId
   * @param {string} adnetworkName
   * @param {number} accountId
   * @param {string} accountName
   * @param {Object} credentials
   */
  constructor (adnetworkId, adnetworkName, accountId, accountName, credentials) {
    this.adnetworkId   = adnetworkId;
    this.adnetworkName = adnetworkName;
    this.accountId     = accountId;
    this.accountName   = accountName;
    this.credentials   = credentials;
  }
}

module.exports = AdnetworkAccount;
