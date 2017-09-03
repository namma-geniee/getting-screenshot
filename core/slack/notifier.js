'use strict'

const { IncomingWebhook } = require('@slack/client')
const config              = require('../../config')

const webhook = new IncomingWebhook(config.slack.webhookUrl)

const notifier = {
  /**
   * @param message
   * @returns {Promise}
   */
  info (message ) {
    return new Promise((resolve, reject) => {
      webhook.send(message, (err, resp) => err ? reject(err) : resolve(resp))
    })
  },
  /**
   * @param message
   * @returns {Promise}
   */
  error (message) {
    return new Promise((resolve, reject) => {
      webhook.send(message, (err, resp) => err ? reject(err) : resolve(resp))
    })
  }
}

module.exports = notifier
