'use strict'

class ScrapingTask {
  /**
   * @param {Date} scheduleTime
   * @param {Date} historyTime
   * @param {AdnetworkAccount} adnetworkAccount
   */
  constructor (scheduleTime, historyTime, adnetworkAccount) {
    this.scheduleTime     = scheduleTime
    this.historyTime      = historyTime
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

module.exports = ScrapingTask
