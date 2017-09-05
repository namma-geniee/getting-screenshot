'use strict';

module.exports = {

  browser: {
    headless: !process.argv.includes('--no-headless'),
    dumpio:   process.argv.includes('--dumpio'),
    args:     [
      '--disable-gpu',
      '--no-sandbox'
    ]
  },

  page: {
    defaultViewport: {
      width:  process.env.DEFAULT_VIEWPORT_WIDTH || 1366,
      height: process.env.DEFAULT_VIEWPORT_HEIGHT || 768
    }
  },

  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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',
    defaults:   {
      username:  process.env.SLACK_USERNAME || 'GS Notification',
      iconEmoji: ':ghost:'
    }
  },

  scrapers: require('./adnetworkScrapers.json')
};
