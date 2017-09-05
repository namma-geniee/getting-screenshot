'use strict';

class ScrapingTask {
  /**
   * @param {Date} scheduleTime
   * @param {AdnetworkAccount} adnetworkAccount
   */
  constructor (scheduleTime, adnetworkAccount) {
    this.scheduleTime     = scheduleTime;
    this.adnetworkAccount = adnetworkAccount
  }

  get adnetworkName () {
    return this.adnetworkAccount.adnetworkName
  }

  get accountName () {
    return this.adnetworkAccount.accountName
  }

  get credentials () {
    return this.adnetworkAccount.credentials
  }
}

module.exports = ScrapingTask;
